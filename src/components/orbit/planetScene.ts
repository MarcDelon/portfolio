import * as THREE from 'three';
import {
  earthTexture, earthCloudsTexture, marsTexture, jupiterTexture,
  saturnTexture, saturnRingTexture, sunTexture, glowTexture,
} from './planetTextures';

export type PlanetKind = 'earth' | 'jupiter' | 'saturn' | 'mars';

export interface ScreenPoint {
  x: number;      // px, relative to the canvas
  y: number;
  r: number;      // projected radius in px
  depth: number;  // -1 (far side of the orbit) … 1 (near side)
}

export interface Layout {
  width: number;   // canvas css size
  height: number;
  cx: number;      // where the sun sits, in canvas px
  cy: number;
  R: number;       // outer orbit radius in px
  elevation: number; // camera elevation, radians
  planetScale?: number; // enlarge planets on small screens
}

interface PlanetDef {
  kind: PlanetKind;
  orbit: number;   // fraction of R
  size: number;    // radius, fraction of R
  tilt: number;    // axial tilt, radians
  spin: number;    // seconds per self-rotation
  phase: number;   // starting orbital angle
  atmosphere?: [number, number, number];
}

/** Order matches the portfolio faces: 0 Accueil, 1 À propos, 2 Projets, 3 Contact. */
export const PLANETS: PlanetDef[] = [
  { kind: 'earth', orbit: 0.55, size: 0.092, tilt: 0.409, spin: 14, phase: 0.4, atmosphere: [0.35, 0.65, 1] },
  { kind: 'jupiter', orbit: 0.85, size: 0.15, tilt: 0.054, spin: 6, phase: 3.9, atmosphere: [0.95, 0.82, 0.6] },
  { kind: 'saturn', orbit: 1.0, size: 0.118, tilt: 0.466, spin: 6.5, phase: 5.5, atmosphere: [0.95, 0.88, 0.62] },
  { kind: 'mars', orbit: 0.7, size: 0.074, tilt: 0.44, spin: 14.5, phase: 2.2, atmosphere: [1, 0.55, 0.35] },
];

const SUN_SIZE = 0.16;
const EARTH_YEAR = 48; // seconds for one Earth orbit; others follow Kepler's 3rd law

const FOV = 30;

function atmosphereMaterial(rgb: [number, number, number], power: number, strength: number) {
  return new THREE.ShaderMaterial({
    uniforms: { glow: { value: new THREE.Color(...rgb) }, power: { value: power }, strength: { value: strength } },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 glow;
      uniform float power;
      uniform float strength;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), power) * strength;
        gl_FragColor = vec4(glow * rim, rim);
      }`,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
}

function canvasTexture(canvas: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function createPlanetScene(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 20000);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

  const sphere = track(new THREE.SphereGeometry(1, 72, 36));

  /* ── Lights: the sun lights the planets, a faint fill keeps night sides readable ── */
  const sunLight = new THREE.PointLight(0xfff1dc, 3.2, 0, 0);
  scene.add(sunLight);
  scene.add(new THREE.AmbientLight(0xffe2c4, 0.07));

  /* ── Sun ── */
  const sunGroup = new THREE.Group();
  scene.add(sunGroup);
  const sunMesh = new THREE.Mesh(sphere, track(new THREE.MeshBasicMaterial({ map: track(canvasTexture(sunTexture())) })));
  sunGroup.add(sunMesh);
  const sunRim = new THREE.Mesh(sphere, track(atmosphereMaterial([1, 0.55, 0.15], 2.2, 1.4)));
  sunRim.scale.setScalar(1.06);
  sunGroup.add(sunRim);
  const coronaTex = track(canvasTexture(glowTexture([255, 150, 50])));
  const corona = new THREE.Sprite(track(new THREE.SpriteMaterial({
    map: coronaTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.85,
  })));
  sunGroup.add(corona);
  const corona2 = new THREE.Sprite(track(new THREE.SpriteMaterial({
    map: coronaTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.35,
  })));
  sunGroup.add(corona2);

  /* ── Orbit paths ── */
  const orbitMat = track(new THREE.LineBasicMaterial({ color: 0xe07b1f, transparent: true, opacity: 0.22, depthWrite: false }));
  const orbitLines = PLANETS.map(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    }
    const line = new THREE.LineLoop(track(new THREE.BufferGeometry().setFromPoints(pts)), orbitMat);
    scene.add(line);
    return line;
  });

  /* ── Planets ── */
  const textures: Record<PlanetKind, () => HTMLCanvasElement> = {
    earth: earthTexture, jupiter: jupiterTexture, saturn: saturnTexture, mars: marsTexture,
  };

  const planets = PLANETS.map((def) => {
    const orbitPivot = new THREE.Group();     // moves along the orbit
    const tiltGroup = new THREE.Group();      // axial tilt
    tiltGroup.rotation.z = def.tilt;
    orbitPivot.add(tiltGroup);
    scene.add(orbitPivot);

    const mat = track(new THREE.MeshStandardMaterial({
      map: track(canvasTexture(textures[def.kind]())),
      roughness: def.kind === 'earth' ? 0.75 : 0.95,
      metalness: 0,
    }));
    const body = new THREE.Mesh(sphere, mat);
    tiltGroup.add(body);

    let clouds: THREE.Mesh | null = null;
    if (def.kind === 'earth') {
      clouds = new THREE.Mesh(sphere, track(new THREE.MeshStandardMaterial({
        map: track(canvasTexture(earthCloudsTexture())), transparent: true, depthWrite: false, roughness: 1,
      })));
      clouds.scale.setScalar(1.025);
      tiltGroup.add(clouds);
    }

    if (def.atmosphere) {
      const atmo = new THREE.Mesh(sphere, track(atmosphereMaterial(def.atmosphere, def.kind === 'earth' ? 2.6 : 3.4, def.kind === 'earth' ? 1.3 : 0.6)));
      atmo.scale.setScalar(def.kind === 'earth' ? 1.09 : 1.05);
      tiltGroup.add(atmo);
    }

    if (def.kind === 'saturn') {
      const inner = 1.28, outer = 2.35;
      const ringGeo = track(new THREE.RingGeometry(inner, outer, 128, 1));
      const pos = ringGeo.attributes.position as THREE.BufferAttribute;
      const uv = ringGeo.attributes.uv as THREE.BufferAttribute;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
      }
      const ring = new THREE.Mesh(ringGeo, track(new THREE.MeshStandardMaterial({
        map: track(canvasTexture(saturnRingTexture())), transparent: true, side: THREE.DoubleSide,
        depthWrite: false, roughness: 1,
      })));
      ring.rotation.x = -Math.PI / 2;
      tiltGroup.add(ring);
    }

    return { def, orbitPivot, tiltGroup, body, clouds, hover: 0 };
  });

  /* ── State ── */
  let layout: Layout = { width: 1, height: 1, cx: 0.5, cy: 0.5, R: 300, elevation: 0.35 };
  let phaseOffset = 0;
  let speed = 1;
  let targetSpeed = 1;
  let hovered = -1;
  let elapsed = 0;
  let last = performance.now();
  let raf = 0;
  let onFrame: ((pts: ScreenPoint[], sun: ScreenPoint) => void) | null = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const tmp = new THREE.Vector3();
  const camDist = () => (layout.height / 2) / Math.tan(THREE.MathUtils.degToRad(FOV / 2));

  function applyLayout() {
    const { width, height, cx, cy, R, elevation } = layout;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const d = camDist();
    camera.position.set(0, d * Math.sin(elevation), d * Math.cos(elevation));
    camera.lookAt(0, 0, 0);
    camera.near = Math.max(1, d - R * 3);
    camera.far = d + R * 3;
    // Shift the projection so the world origin (the sun) lands on (cx, cy)
    camera.setViewOffset(width, height, width / 2 - cx, height / 2 - cy, width, height);
    camera.updateProjectionMatrix();

    const ps = layout.planetScale ?? 1;
    sunMesh.scale.setScalar(R * SUN_SIZE);
    sunRim.scale.setScalar(R * SUN_SIZE * 1.06);
    corona.scale.setScalar(R * SUN_SIZE * 5.2);
    planets.forEach((p, i) => {
      p.tiltGroup.scale.setScalar(R * p.def.size * ps);
      orbitLines[i].scale.setScalar(R * p.def.orbit);
    });
  }

  function project(world: THREE.Vector3, radius: number): ScreenPoint {
    tmp.copy(world).project(camera);
    const dist = camera.position.distanceTo(world);
    return {
      x: (tmp.x + 1) / 2 * layout.width,
      y: (1 - tmp.y) / 2 * layout.height,
      r: radius * camDist() / dist,
      depth: 0,
    };
  }

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    speed += (targetSpeed - speed) * Math.min(1, dt * 4);
    const t = dt * speed * (reduceMotion ? 0.25 : 1);
    elapsed += t;

    const R = layout.R;
    // Sun: slow rotation + breathing corona
    sunMesh.rotation.y += t * (Math.PI * 2 / 40);
    const pulse = 1 + Math.sin(now / 1400) * 0.03;
    corona.scale.setScalar(R * SUN_SIZE * 5.2 * pulse);
    corona2.scale.setScalar(R * SUN_SIZE * 9 * (2 - pulse));

    const pts: ScreenPoint[] = planets.map((p, i) => {
      const r = p.def.orbit;
      const omega = (Math.PI * 2 / EARTH_YEAR) * Math.pow(PLANETS[0].orbit / r, 1.5);
      const a = p.def.phase + phaseOffset + elapsed * omega;
      p.orbitPivot.position.set(Math.cos(a) * r * R, 0, Math.sin(a) * r * R);
      p.body.rotation.y += t * (Math.PI * 2 / p.def.spin);
      if (p.clouds) p.clouds.rotation.y += t * (Math.PI * 2 / (p.def.spin * 0.8));

      p.hover += ((hovered === i ? 1 : 0) - p.hover) * Math.min(1, dt * 8);
      const s = R * p.def.size * (layout.planetScale ?? 1) * (1 + p.hover * 0.14);
      p.tiltGroup.scale.setScalar(s);

      const sp = project(p.orbitPivot.position, s);
      sp.depth = Math.sin(a);
      return sp;
    });

    renderer.render(scene, camera);
    onFrame?.(pts, project(tmp.set(0, 0, 0), R * SUN_SIZE));
    raf = requestAnimationFrame(frame);
  }

  return {
    start(cb: (pts: ScreenPoint[], sun: ScreenPoint) => void) {
      onFrame = cb;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    setLayout(l: Layout) {
      layout = l;
      applyLayout();
    },
    /** Spin the whole system (drag), in radians. */
    nudge(delta: number) { phaseOffset += delta; },
    setHovered(i: number) {
      hovered = i;
      targetSpeed = i >= 0 ? 0.25 : 1;
    },
    dispose() {
      cancelAnimationFrame(raf);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}

export type PlanetScene = ReturnType<typeof createPlanetScene>;
