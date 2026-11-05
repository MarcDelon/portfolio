'use client';
import { useEffect, useRef, useState } from 'react';
import { Home, User, Code2, Mail, type LucideIcon } from 'lucide-react';
import { useCube } from '@/lib/CubeContext';
import { useLanguage } from '@/lib/LanguageContext';
import { projects } from '@/lib/data';
import type { PlanetScene, ScreenPoint } from '@/components/orbit/planetScene';

interface Satellite {
  face: number;
  icon: LucideIcon;
  label: { fr: string; en: string };
  meta: { fr: string; en: string };
}

/** Same order as PLANETS in planetScene: Earth, Jupiter, Saturn, Mars. */
const SATELLITES: Satellite[] = [
  { face: 0, icon: Home, label: { fr: 'Accueil', en: 'Home' }, meta: { fr: 'Full-Stack', en: 'Full-Stack' } },
  { face: 1, icon: User, label: { fr: 'À propos & CV', en: 'About & CV' }, meta: { fr: 'B3 · IA & BD', en: 'B3 · AI & BD' } },
  { face: 2, icon: Code2, label: { fr: 'Projets', en: 'Projects' }, meta: { fr: `${projects.length} projets`, en: `${projects.length} projects` } },
  { face: 3, icon: Mail, label: { fr: 'Contact', en: 'Contact' }, meta: { fr: 'Douala', en: 'Douala' } },
];

function computeLayout(w: number, h: number) {
  const desktop = w > 900;
  return desktop
    ? { width: w, height: h, cx: w * (w > 1200 ? 0.64 : 0.62), cy: h * 0.46, R: Math.min(420, w * 0.29), elevation: 0.36 }
    : { width: w, height: h, cx: w * 0.5, cy: h * 0.38, R: Math.min(w * 0.45, 260), elevation: 0.6, planetScale: 1.45 };
}

/**
 * "Orbite MD" overview: a real-time WebGL solar system. The sun lights four textured
 * planets (Earth, Jupiter, Saturn, Mars) that spin on tilted axes and orbit at
 * Kepler speeds. Each planet opens a portfolio section.
 */
export default function OrbitNav() {
  const { openFace, isExploding, isZoomingOut, current } = useCube();
  const { lang } = useLanguage();

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const sunBtnRef = useRef<HTMLButtonElement>(null);
  const satRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sceneRef = useRef<PlanetScene | null>(null);
  const dragRef = useRef<{ x: number; moved: boolean } | null>(null);
  const velRef = useRef(0);
  const [origin, setOrigin] = useState({ x: 0, y: 0, R: 300 });
  const [hovered, setHovered] = useState<number | null>(null);
  const [targetFace, setTargetFace] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  /* Boot the WebGL scene (client only, lazy-loaded so three.js stays out of the main bundle) */
  useEffect(() => {
    let disposed = false;
    let ro: ResizeObserver | null = null;
    let inertiaRaf = 0;

    import('@/components/orbit/planetScene').then(({ createPlanetScene }) => {
      if (disposed || !canvasRef.current || !rootRef.current) return;
      const scene = createPlanetScene(canvasRef.current);
      sceneRef.current = scene;

      const resize = () => {
        const el = rootRef.current;
        if (!el) return;
        const l = computeLayout(el.clientWidth, el.clientHeight);
        scene.setLayout(l);
        setOrigin({ x: l.cx, y: l.cy, R: l.R });
        if (captionRef.current) {
          captionRef.current.style.left = `${l.cx}px`;
          captionRef.current.style.top = `${l.cy + l.R * Math.sin(l.elevation) + l.R * 0.16}px`;
        }
      };
      resize();
      ro = new ResizeObserver(resize);
      ro.observe(rootRef.current);

      scene.start((pts: ScreenPoint[], sun: ScreenPoint) => {
        pts.forEach((p, i) => {
          const el = satRefs.current[i];
          if (!el) return;
          el.style.transform = `translate(${p.x}px, ${p.y}px)`;
          el.style.setProperty('--hit', `${Math.max(44, p.r * 2.2)}px`);
          el.style.setProperty('--label-offset', `${p.r + 8}px`);
          // planets passing behind the sun: fade their label out of the way
          const behindSun = p.depth < 0 && Math.abs(p.x - sun.x) < sun.r * 1.2 && Math.abs(p.y - sun.y) < sun.r * 1.4;
          el.style.opacity = behindSun ? '0.12' : `${0.62 + 0.38 * ((p.depth + 1) / 2)}`;
          el.style.zIndex = p.depth > 0 ? '30' : '10';
        });
        if (sunBtnRef.current) {
          sunBtnRef.current.style.transform = `translate(${sun.x}px, ${sun.y}px)`;
          sunBtnRef.current.style.setProperty('--hit', `${sun.r * 2}px`);
        }
      });
      setReady(true);

      // drag inertia
      const tick = () => {
        if (!dragRef.current && Math.abs(velRef.current) > 0.00005) {
          scene.nudge(velRef.current);
          velRef.current *= 0.93;
        }
        inertiaRaf = requestAnimationFrame(tick);
      };
      inertiaRaf = requestAnimationFrame(tick);
    });

    return () => {
      disposed = true;
      ro?.disconnect();
      cancelAnimationFrame(inertiaRaf);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setHovered(hovered ?? -1);
  }, [hovered]);

  /* Drag (mouse or finger) spins the whole system */
  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, moved: false };
    velRef.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 4) return;
    if (!d.moved) {
      d.moved = true;
      rootRef.current?.setPointerCapture(e.pointerId);
    }
    const delta = -dx / (origin.R * 1.4);
    sceneRef.current?.nudge(delta);
    velRef.current = delta * 0.6;
    d.x = e.clientX;
  };
  const onPointerUp = () => {
    setTimeout(() => { dragRef.current = null; }, 0);
  };

  const open = (face: number) => {
    if (dragRef.current?.moved) return;
    setTargetFace(face);
    openFace(face);
  };

  const zoomFace = isExploding ? (targetFace ?? current) : null;

  return (
    <div
      ref={rootRef}
      className={`orbit-root ${ready ? 'is-ready' : ''} ${isExploding ? 'is-warping' : ''} ${isZoomingOut ? 'is-arriving' : ''}`}
      style={{ transformOrigin: `${origin.x}px ${origin.y}px` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <canvas ref={canvasRef} className="orbit-canvas" aria-hidden="true" />

      {/* Sun = home */}
      <button
        ref={sunBtnRef}
        type="button"
        className="orbit-hit orbit-sun-hit"
        onClick={() => open(0)}
        aria-label={lang === 'fr' ? 'Ouvrir l’accueil' : 'Open home'}
      >
        <span className="orbit-sun-monogram">MD</span>
      </button>

      {/* Planets = sections (hit area + label follow the projected 3D position) */}
      {SATELLITES.map((s, i) => {
        const Icon = s.icon;
        return (
          <button
            key={s.face}
            type="button"
            ref={(el) => { satRefs.current[i] = el; }}
            className={`orbit-hit orbit-planet-hit ${hovered === i ? 'is-hovered' : ''} ${zoomFace === s.face ? 'is-target' : ''}`}
            onClick={() => open(s.face)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
          >
            <span className="orbit-planet-label">
              <span className="orbit-sat-label">
                <Icon size={13} strokeWidth={2} />
                {s.label[lang]}
              </span>
              <span className="orbit-sat-meta">{s.meta[lang]}</span>
            </span>
          </button>
        );
      })}

      <div ref={captionRef} className="orbit-caption">
        <span className="orbit-name">Marc Delon</span>
        <span className="orbit-role">{lang === 'fr' ? 'Développeur Full-Stack' : 'Full-Stack Developer'}</span>
        <span className="orbit-hint">
          {lang === 'fr' ? 'Clique sur une planète pour explorer' : 'Click a planet to explore'}
        </span>
      </div>
    </div>
  );
}
