/**
 * Procedural planet textures (equirectangular, drawn on a canvas) — no image downloads.
 * Seeded value-noise + fBm so every load looks the same.
 */

type RGB = [number, number, number];

function makeNoise(seed: number) {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = seed >>> 0;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const grad = (h: number, x: number, y: number, z: number) => {
    const u = (h & 15) < 8 ? x : y;
    const v = (h & 15) < 4 ? y : (h & 15) === 12 || (h & 15) === 14 ? x : z;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  };
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  // 3D Perlin noise, so sampling on the sphere surface has no seam at the poles/date line
  return (x: number, y: number, z: number) => {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    const u = fade(x), v = fade(y), w = fade(z);
    const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z;
    const B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
    return lerp(
      lerp(lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
        lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u), v),
      lerp(lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
        lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u), v),
      w,
    );
  };
}

function fbm(noise: (x: number, y: number, z: number) => number, x: number, y: number, z: number, octaves: number) {
  let amp = 0.5, freq = 1, sum = 0, norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * noise(x * freq, y * freq, z * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm; // ~[-0.7, 0.7]
}

const mix = (a: RGB, b: RGB, t: number): RGB => {
  const k = Math.min(1, Math.max(0, t));
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
};
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** Iterate over an equirectangular canvas, giving each pixel its unit-sphere position. */
function paint(
  w: number,
  h: number,
  shade: (x: number, y: number, z: number, lat: number, u: number) => RGB | [number, number, number, number],
) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  for (let j = 0; j < h; j++) {
    const lat = Math.PI * (0.5 - (j + 0.5) / h);
    const cl = Math.cos(lat), sl = Math.sin(lat);
    for (let i = 0; i < w; i++) {
      const lon = 2 * Math.PI * ((i + 0.5) / w);
      const c = shade(cl * Math.cos(lon), sl, cl * Math.sin(lon), lat, i / w);
      const k = (j * w + i) * 4;
      img.data[k] = c[0];
      img.data[k + 1] = c[1];
      img.data[k + 2] = c[2];
      img.data[k + 3] = c.length === 4 ? c[3] : 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

export function earthTexture(w = 512, h = 256) {
  const n = makeNoise(7);
  const deep: RGB = [10, 42, 92], shallow: RGB = [30, 98, 160];
  const beach: RGB = [196, 178, 128], green: RGB = [62, 120, 52], forest: RGB = [34, 82, 38];
  const desert: RGB = [176, 146, 92], mountain: RGB = [120, 108, 92], ice: RGB = [236, 242, 248];
  return paint(w, h, (x, y, z, lat) => {
    const e = fbm(n, x * 1.6 + 3, y * 1.6, z * 1.6, 6);
    const absLat = Math.abs(lat);
    if (absLat > 1.25 + e * 0.3) return ice;
    if (e < 0.04) return mix(deep, shallow, smooth(-0.25, 0.04, e));
    const dry = fbm(n, x * 3 + 10, y * 3, z * 3, 3) + (absLat < 0.5 ? 0.15 : -0.1);
    let land = e < 0.06 ? beach : mix(green, forest, smooth(0.06, 0.25, e));
    if (dry > 0.12) land = mix(land, desert, smooth(0.12, 0.3, dry));
    if (e > 0.3) land = mix(land, mountain, smooth(0.3, 0.45, e));
    return land;
  });
}

export function earthCloudsTexture(w = 512, h = 256) {
  const n = makeNoise(21);
  return paint(w, h, (x, y, z) => {
    const c = fbm(n, x * 2.5, y * 4, z * 2.5, 5);
    const a = smooth(0.02, 0.32, c) * 230;
    return [255, 255, 255, a];
  });
}

export function marsTexture(w = 512, h = 256) {
  const n = makeNoise(42);
  const light: RGB = [214, 112, 62], mid: RGB = [178, 82, 44], dark: RGB = [104, 46, 26], cap: RGB = [244, 236, 228];
  return paint(w, h, (x, y, z, lat) => {
    const e = fbm(n, x * 2, y * 2, z * 2, 6);
    const crater = fbm(n, x * 9 + 5, y * 9, z * 9, 2);
    let c = mix(light, mid, smooth(-0.2, 0.15, e));
    c = mix(c, dark, smooth(0.12, 0.35, e));
    c = mix(c, [c[0] * 0.8, c[1] * 0.8, c[2] * 0.8], smooth(0.25, 0.45, crater));
    if (Math.abs(lat) > 1.32 + e * 0.25) c = cap;
    return c;
  });
}

function bandedTexture(seed: number, palette: RGB[], turbulence: number, w: number, h: number, spot?: (lat: number, u: number) => number) {
  const n = makeNoise(seed);
  return paint(w, h, (x, y, z, lat, u) => {
    const warp = fbm(n, x * 3, y * 3, z * 3, 4) * turbulence;
    const raw = (Math.sin((lat + warp) * 11) + Math.sin((lat + warp * 0.6) * 23) * 0.35) / 1.35;
    const t = Math.min(1, Math.max(0, raw * 0.5 + 0.5));
    const idx = t * (palette.length - 1);
    const i0 = Math.floor(idx);
    let c = mix(palette[i0], palette[Math.min(palette.length - 1, i0 + 1)], idx - i0);
    const fine = fbm(n, x * 14, y * 40, z * 14, 2) * 18;
    c = [c[0] + fine, c[1] + fine, c[2] + fine];
    if (spot) {
      const s = spot(lat, u);
      if (s > 0) c = mix(c, [178, 70, 46], s);
    }
    return c;
  });
}

export function jupiterTexture(w = 512, h = 256) {
  return bandedTexture(
    5,
    [[226, 206, 172], [184, 132, 90], [236, 222, 196], [160, 108, 72], [214, 184, 144], [240, 228, 206], [170, 120, 82]],
    0.12,
    w,
    h,
    (lat, u) => {
      // Great Red Spot, southern hemisphere
      const dLat = (lat + 0.38) / 0.09;
      const dLon = (u - 0.62) / 0.06;
      const d = dLat * dLat + dLon * dLon;
      return d < 1 ? smooth(1, 0.3, d) * 0.85 : 0;
    },
  );
}

export function saturnTexture(w = 512, h = 256) {
  return bandedTexture(
    9,
    [[232, 214, 168], [208, 180, 124], [240, 226, 186], [196, 166, 110], [226, 204, 150]],
    0.05,
    w,
    h,
  );
}

/** Radial ring strip: u = inner→outer radius, painted with Cassini-like gaps. */
export function saturnRingTexture(w = 512) {
  const n = makeNoise(13);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = 4;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(w, 4);
  for (let i = 0; i < w; i++) {
    const r = i / (w - 1);
    let a = 0.55 + 0.35 * n(r * 40, 0.5, 0.5);
    a *= smooth(0, 0.06, r) * smooth(1, 0.92, r);
    if (r > 0.6 && r < 0.66) a *= 0.12; // Cassini division
    if (r > 0.83 && r < 0.85) a *= 0.4;
    const tone = 200 + 40 * n(r * 25, 1.5, 0.5);
    for (let j = 0; j < 4; j++) {
      const k = (j * w + i) * 4;
      img.data[k] = tone;
      img.data[k + 1] = tone * 0.9;
      img.data[k + 2] = tone * 0.72;
      img.data[k + 3] = Math.max(0, Math.min(255, a * 255));
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

export function sunTexture(w = 512, h = 256) {
  const n = makeNoise(3);
  const core: RGB = [255, 214, 140], hot: RGB = [255, 160, 60], cool: RGB = [200, 82, 18];
  return paint(w, h, (x, y, z) => {
    const g = fbm(n, x * 6, y * 6, z * 6, 5);
    const cells = Math.abs(fbm(n, x * 18 + 4, y * 18, z * 18, 2));
    let c = mix(hot, core, smooth(-0.1, 0.35, g));
    c = mix(c, cool, smooth(0.05, 0.25, cells) * 0.55);
    return c;
  });
}

/** Soft radial glow for sprites (sun corona, atmosphere halos). */
export function glowTexture(rgb: RGB, size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  const [r, gg, b] = rgb;
  g.addColorStop(0, `rgba(${r},${gg},${b},1)`);
  g.addColorStop(0.25, `rgba(${r},${gg},${b},0.45)`);
  g.addColorStop(0.6, `rgba(${r},${gg},${b},0.08)`);
  g.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}
