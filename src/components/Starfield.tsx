'use client';
import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

interface StarfieldProps {
  warpSpeed?: boolean;
}

export default function Starfield({ warpSpeed = false }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const warpRef = useRef(warpSpeed);

  useEffect(() => {
    warpRef.current = warpSpeed;
  }, [warpSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Mouse tracking for parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 60;
      targetMouseY = (e.clientY / height - 0.5) * 60;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Generate Stars
    const STAR_COUNT = 180;
    const stars: Star[] = [];
    const colors = [
      'rgba(255, 255, 255, ',
      'rgba(245, 160, 64, ',
      'rgba(224, 123, 31, ',
      'rgba(255, 230, 180, ',
      'rgba(180, 220, 255, ',
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const rx = (Math.random() - 0.5) * width * 1.5;
      const ry = (Math.random() - 0.5) * height * 1.5;
      stars.push({
        x: rx,
        y: ry,
        baseX: rx,
        baseY: ry,
        z: Math.random() * 1000 + 100, // 3D depth for warp
        size: Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.05 + 0.01,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Shooting Stars
    const shootingStars: ShootingStar[] = [];
    const createShootingStar = () => {
      if (shootingStars.length < 3 && Math.random() < 0.02) {
        shootingStars.push({
          x: Math.random() * width * 0.8 + width * 0.1,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 90 + 45,
          speed: Math.random() * 12 + 8,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          opacity: 1,
          active: true,
        });
      }
    };

    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const isWarping = warpRef.current;

      // Clear or trail
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Cosmic dust gradient background
      const grad = ctx.createRadialGradient(
        cx - mouseX * 2,
        cy - mouseY * 2,
        50,
        cx,
        cy,
        Math.max(width, height) * 0.85
      );
      grad.addColorStop(0, 'rgba(38, 18, 6, 0.35)');
      grad.addColorStop(0.5, 'rgba(18, 8, 3, 0.2)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render 3D Stars
      for (const s of stars) {
        if (isWarping) {
          // Warp flight through stars
          s.z -= 28;
          if (s.z <= 10) {
            s.z = 1000;
            s.x = (Math.random() - 0.5) * width * 1.5;
            s.y = (Math.random() - 0.5) * height * 1.5;
          }
        } else {
          // Normal gentle floating
          s.z -= 0.6;
          if (s.z <= 10) {
            s.z = 1000;
          }
        }

        const k = 400 / s.z;
        const px = s.x * k + cx - mouseX * (1.2 - s.z / 1000);
        const py = s.y * k + cy - mouseY * (1.2 - s.z / 1000);

        if (px < 0 || px > width || py < 0 || py > height) continue;

        // Twinkle factor
        const twinkle = Math.sin(time * s.twinkleSpeed * 10 + s.twinklePhase) * 0.35 + 0.65;
        const alpha = Math.min(1, Math.max(0.1, s.opacity * twinkle * (1 - s.z / 1200)));

        if (isWarping) {
          // Render warp streaks
          const prevK = 400 / (s.z + 55);
          const prevPx = s.x * prevK + cx - mouseX;
          const prevPy = s.y * prevK + cy - mouseY;

          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = `${s.color}${alpha * 0.9})`;
          ctx.lineWidth = Math.max(1, (1 - s.z / 1000) * 3);
          ctx.stroke();
        } else {
          // Normal round star with glow
          const currentSize = Math.max(0.6, s.size * (1 - s.z / 1200) * 1.6);
          ctx.beginPath();
          ctx.arc(px, py, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = `${s.color}${alpha})`;
          ctx.fill();

          if (s.size > 1.4) {
            ctx.beginPath();
            ctx.arc(px, py, currentSize * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `${s.color}${alpha * 0.25})`;
            ctx.fill();
          }
        }
      }

      // Render Shooting Stars
      createShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        if (!ss.active) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const ssGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        ssGrad.addColorStop(0, 'rgba(245, 160, 64, 0)');
        ssGrad.addColorStop(0.7, 'rgba(255, 230, 180, 0.6)');
        ssGrad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = ssGrad;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.018;

        if (ss.opacity <= 0 || ss.x > width + 100 || ss.y > height + 100) {
          ss.active = false;
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`starfield-canvas ${warpSpeed ? 'starfield-warp' : ''}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
