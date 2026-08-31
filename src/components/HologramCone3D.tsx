'use client';
import { useEffect, useRef } from 'react';

interface HologramCone3DProps {
  rotXRef: React.MutableRefObject<number>;
  rotYRef: React.MutableRefObject<number>;
  isExploding?: boolean;
}

export default function HologramCone3D({ rotXRef, rotYRef, isExploding }: HologramCone3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isExplodingRef = useRef(isExploding);
  isExplodingRef.current = isExploding;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Upward floating photon particles
    interface Particle {
      angle: number;
      progress: number;
      speed: number;
      size: number;
      alpha: number;
    }

    const particles: Particle[] = Array.from({ length: 48 }, () => ({
      angle: Math.random() * Math.PI * 2,
      progress: Math.random(),
      speed: 0.005 + Math.random() * 0.01,
      size: 1.2 + Math.random() * 2.8,
      alpha: 0.35 + Math.random() * 0.65,
    }));

    const render = () => {
      time += 0.02;

      // Handle HiDPI scaling
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * 2 || canvas.height !== height * 2) {
        canvas.width = width * 2;
        canvas.height = height * 2;
      }

      ctx.save();
      ctx.scale(2, 2);
      ctx.clearRect(0, 0, width, height);

      if (isExplodingRef.current) {
        ctx.restore();
        animId = requestAnimationFrame(render);
        return;
      }

      const cx = width / 2;
      const cy = 350; // Vertical origin aligned with stage center
      const D = 1400; // Camera perspective distance

      const rx = (rotXRef.current * Math.PI) / 180;
      const ry = (rotYRef.current * Math.PI) / 180;

      // 3D rotation and projection helper
      const project3D = (x: number, y: number, z: number, isLocalCube = true) => {
        let px = x;
        let py = y;
        let pz = z;

        if (isLocalCube) {
          // Rotate around Y
          const x1 = px * Math.cos(ry) + pz * Math.sin(ry);
          const y1 = py;
          const z1 = -px * Math.sin(ry) + pz * Math.cos(ry);

          // Rotate around X
          const x2 = x1;
          const y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
          const z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);

          px = x2;
          py = y2;
          pz = z2 - 100; // Cube Z-offset
        } else {
          pz = pz - 100;
        }

        const scale = D / (D + pz);
        return {
          x: cx + px * scale,
          y: cy + py * scale,
          z: pz,
          scale,
        };
      };

      const N = 36; // Number of radial segments
      const R_top = 180; // Top radius at cube bottom (360px diameter)
      const R_bot = 48; // Bottom radius at projector nozzle
      const Y_bot = 258; // Projector nozzle Y

      // 1. Calculate top rim (rotates in 3D locked with cube bottom face)
      const topPts: { x: number; y: number; z: number; scale: number }[] = [];
      for (let i = 0; i < N; i++) {
        const theta = (i * 2 * Math.PI) / N;
        const lx = R_top * Math.cos(theta);
        const lz = R_top * Math.sin(theta);
        const ly = 180; // Cube bottom face Y
        topPts.push(project3D(lx, ly, lz, true));
      }

      // 2. Calculate bottom rim (static on projector aperture)
      const botPts: { x: number; y: number; z: number; scale: number }[] = [];
      for (let i = 0; i < N; i++) {
        const theta = (i * 2 * Math.PI) / N;
        const bx = R_bot * Math.cos(theta);
        const bz = R_bot * Math.sin(theta);
        botPts.push(project3D(bx, Y_bot, bz, false));
      }

      ctx.globalCompositeOperation = 'lighter';

      // 3. Draw Back Facets & Volumetric Shell (sorted by Z depth)
      interface Slice {
        idx: number;
        avgZ: number;
      }
      const slices: Slice[] = [];
      for (let i = 0; i < N; i++) {
        const next = (i + 1) % N;
        const avgZ = (topPts[i].z + topPts[next].z + botPts[i].z + botPts[next].z) / 4;
        slices.push({ idx: i, avgZ });
      }
      slices.sort((a, b) => a.avgZ - b.avgZ); // Draw back to front

      slices.forEach(({ idx }) => {
        const next = (idx + 1) % N;
        const t1 = topPts[idx];
        const t2 = topPts[next];
        const b1 = botPts[idx];
        const b2 = botPts[next];

        // Volumetric quad with smooth luminous gradient
        ctx.beginPath();
        ctx.moveTo(b1.x, b1.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.lineTo(t2.x, t2.y);
        ctx.lineTo(t1.x, t1.y);
        ctx.closePath();

        const grad = ctx.createLinearGradient(
          (b1.x + b2.x) / 2,
          (b1.y + b2.y) / 2,
          (t1.x + t2.x) / 2,
          (t1.y + t2.y) / 2
        );
        grad.addColorStop(0, 'rgba(255, 230, 140, 0.45)');
        grad.addColorStop(0.18, 'rgba(245, 160, 64, 0.28)');
        grad.addColorStop(0.6, 'rgba(224, 123, 31, 0.12)');
        grad.addColorStop(1, 'rgba(245, 160, 64, 0.0)');

        ctx.fillStyle = grad;
        ctx.fill();

        // Glowing 3D ray struts
        if (idx % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(b1.x, b1.y);
          ctx.lineTo(t1.x, t1.y);
          ctx.strokeStyle = 'rgba(255, 220, 130, 0.22)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // 4. Concentric 3D Depth Rings (4 scan rings in real 3D perspective)
      const ringLevels = [0.03, 0.35, 0.7, 0.98];
      ringLevels.forEach((lvl, ringIdx) => {
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const idx = i % N;
          const rx = botPts[idx].x + (topPts[idx].x - botPts[idx].x) * lvl;
          const ry = botPts[idx].y + (topPts[idx].y - botPts[idx].y) * lvl;
          if (i === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.closePath();

        if (ringIdx === 0) {
          // Bottom intense ring
          ctx.strokeStyle = 'rgba(255, 235, 160, 0.85)';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#e07b1f';
          ctx.shadowBlur = 12;
        } else if (ringIdx === 3) {
          // Top ring embracing cube bottom
          ctx.strokeStyle = 'rgba(245, 160, 64, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 5]);
        } else {
          // Mid scan rings
          ctx.strokeStyle = `rgba(245, 160, 64, ${0.48 - ringIdx * 0.1})`;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 4]);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
      });

      // 5. Upward Streaming 3D Photons / Light particles
      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.angle = Math.random() * Math.PI * 2;
        }

        // Interpolate along 3D cone surface
        const fracIndex = ((p.angle / (Math.PI * 2)) * N) % N;
        const i1 = Math.floor(fracIndex);
        const i2 = (i1 + 1) % N;
        const f = fracIndex - i1;

        const bx = botPts[i1].x + (botPts[i2].x - botPts[i1].x) * f;
        const by = botPts[i1].y + (botPts[i2].y - botPts[i1].y) * f;
        const tx = topPts[i1].x + (topPts[i2].x - topPts[i1].x) * f;
        const ty = topPts[i1].y + (topPts[i2].y - topPts[i1].y) * f;

        const px = bx + (tx - bx) * p.progress;
        const py = by + (ty - by) * p.progress;

        const alpha = Math.sin(p.progress * Math.PI) * p.alpha;
        ctx.beginPath();
        ctx.arc(px, py, p.size * (1 - p.progress * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 235, 170, ${alpha * 0.9})`;
        ctx.fill();
      });

      // 6. Base Emitter Luminous Glow Pool
      const bCenter = project3D(0, Y_bot, 0, false);
      const baseGrad = ctx.createRadialGradient(bCenter.x, bCenter.y, 0, bCenter.x, bCenter.y, 90);
      baseGrad.addColorStop(0, 'rgba(255, 240, 180, 0.9)');
      baseGrad.addColorStop(0.25, 'rgba(245, 160, 64, 0.5)');
      baseGrad.addColorStop(0.65, 'rgba(224, 123, 31, 0.18)');
      baseGrad.addColorStop(1, 'rgba(224, 123, 31, 0)');

      ctx.beginPath();
      ctx.arc(bCenter.x, bCenter.y, 90, 0, Math.PI * 2);
      ctx.fillStyle = baseGrad;
      ctx.fill();

      // 7. Top Junction Ambient Glow (bleeds softly onto the cube base)
      const tCenter = project3D(0, 180, 0, true);
      const topGrad = ctx.createRadialGradient(tCenter.x, tCenter.y, 0, tCenter.x, tCenter.y, 180);
      topGrad.addColorStop(0, 'rgba(245, 160, 64, 0.32)');
      topGrad.addColorStop(0.35, 'rgba(224, 123, 31, 0.15)');
      topGrad.addColorStop(1, 'rgba(224, 123, 31, 0)');

      ctx.beginPath();
      ctx.arc(tCenter.x, tCenter.y, 180, 0, Math.PI * 2);
      ctx.fillStyle = topGrad;
      ctx.fill();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [rotXRef, rotYRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        width: 800,
        height: 700,
        left: -400,
        top: -350,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
}
