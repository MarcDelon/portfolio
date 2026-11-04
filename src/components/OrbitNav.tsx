'use client';
import { useEffect, useRef, useState } from 'react';
import { Home, User, Code2, Mail, type LucideIcon } from 'lucide-react';
import { useCube } from '@/lib/CubeContext';
import { useLanguage } from '@/lib/LanguageContext';
import { projects } from '@/lib/data';

interface Satellite {
  face: number;
  planet: 'earth' | 'jupiter' | 'saturn' | 'mars';
  icon: LucideIcon;
  label: { fr: string; en: string };
  meta: { fr: string; en: string };
}

const SATELLITES: Satellite[] = [
  { face: 0, planet: 'earth', icon: Home, label: { fr: 'Accueil', en: 'Home' }, meta: { fr: 'Full-Stack', en: 'Full-Stack' } },
  { face: 1, planet: 'jupiter', icon: User, label: { fr: 'À propos & CV', en: 'About & CV' }, meta: { fr: 'B3 · IA & BD', en: 'B3 · AI & BD' } },
  { face: 2, planet: 'saturn', icon: Code2, label: { fr: 'Projets', en: 'Projects' }, meta: { fr: `${projects.length} projets`, en: `${projects.length} projects` } },
  { face: 3, planet: 'mars', icon: Mail, label: { fr: 'Contact', en: 'Contact' }, meta: { fr: 'Douala', en: 'Douala' } },
];

/** Radians per ms of idle orbit rotation (~1 full turn / 70s). */
const IDLE_SPEED = (Math.PI * 2) / 70000;

/**
 * "Orbite MD" overview: Marc's photo is the planet, each portfolio section
 * is a satellite on a tilted orbit. Click a satellite (or the planet) to open it.
 */
export default function OrbitNav() {
  const { openFace, isExploding, isZoomingOut, current } = useCube();
  const { lang } = useLanguage();

  const stageRef = useRef<HTMLDivElement>(null);
  const satRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const angleRef = useRef(-Math.PI / 2 + 0.35);
  const velRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef<{ x: number; moved: boolean } | null>(null);
  const radiusRef = useRef({ rx: 260, ry: 90 });
  const [hovered, setHovered] = useState<number | null>(null);
  const [targetFace, setTargetFace] = useState<number | null>(null);

  /* Orbit radii follow the viewport */
  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const rx = w > 900 ? Math.min(400, w * 0.28) : Math.min(w * 0.38, 240);
      radiusRef.current = { rx, ry: rx * (w > 900 ? 0.34 : 0.52) };
      stageRef.current?.style.setProperty('--orbit-rx', `${rx}px`);
      stageRef.current?.style.setProperty('--orbit-ry', `${radiusRef.current.ry}px`);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* Animation loop: place satellites on the ellipse, fake depth with scale/opacity/z-index */
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let prev = performance.now();

    const loop = (t: number) => {
      const dt = Math.min(48, t - prev);
      prev = t;

      if (!dragRef.current) {
        angleRef.current += velRef.current * dt;
        velRef.current *= 0.94;
        if (!pausedRef.current && !reduceMotion) angleRef.current += IDLE_SPEED * dt;
      }

      const { rx, ry } = radiusRef.current;
      SATELLITES.forEach((_, i) => {
        const el = satRefs.current[i];
        if (!el) return;
        const a = angleRef.current + (i * Math.PI) / 2;
        const depth = Math.sin(a); // -1 = far side, 1 = near side
        const scale = 0.72 + 0.28 * ((depth + 1) / 2);
        el.style.transform = `translate(-50%, -50%) translate(${Math.cos(a) * rx}px, ${depth * ry}px) scale(${scale})`;
        el.style.opacity = `${0.55 + 0.45 * ((depth + 1) / 2)}`;
        el.style.zIndex = depth > -0.15 ? '30' : '5';
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Drag (mouse or finger) spins the orbit, with inertia */
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
      stageRef.current?.setPointerCapture(e.pointerId);
    }
    const delta = -dx / (radiusRef.current.rx * 1.6);
    angleRef.current += delta;
    velRef.current = delta / 16;
    d.x = e.clientX;
  };
  const onPointerUp = () => {
    // Keep the "moved" flag until the click handler has run, then clear it
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
      ref={stageRef}
      className={`orbit-stage ${isExploding ? 'is-warping' : ''} ${isZoomingOut ? 'is-arriving' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; setHovered(null); }}
    >
      {/* Far half of the orbit (drawn behind the planet) */}
      <svg className="orbit-ring orbit-ring-back" viewBox="-100 -100 200 200" preserveAspectRatio="none" aria-hidden="true">
        <path d="M -99 0 A 99 99 0 0 1 99 0" />
      </svg>

      {/* Planet = Marc */}
      <button
        type="button"
        className="orbit-planet"
        onClick={() => open(0)}
        aria-label={lang === 'fr' ? 'Ouvrir l’accueil' : 'Open home'}
      >
        <span className="orbit-planet-halo" />
        <span className="orbit-planet-sphere">
          <span className="orbit-planet-bands" />
          <span className="orbit-planet-shade" />
        </span>
        <span className="orbit-planet-monogram">MD</span>
      </button>

      <div className="orbit-planet-caption">
        <span className="orbit-name">Marc Delon</span>
        <span className="orbit-role">{lang === 'fr' ? 'Développeur Full-Stack' : 'Full-Stack Developer'}</span>
      </div>

      {/* Near half of the orbit (drawn over the planet) */}
      <svg className="orbit-ring orbit-ring-front" viewBox="-100 -100 200 200" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 99 0 A 99 99 0 0 1 -99 0" />
      </svg>

      {/* Satellites = sections */}
      {SATELLITES.map((s, i) => {
        const Icon = s.icon;
        return (
          <button
            key={s.face}
            type="button"
            ref={(el) => { satRefs.current[i] = el; }}
            className={`orbit-satellite ${hovered === i ? 'is-hovered' : ''} ${zoomFace === s.face ? 'is-target' : ''}`}
            onClick={() => open(s.face)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => { pausedRef.current = true; setHovered(i); }}
            onBlur={() => { pausedRef.current = false; setHovered(null); }}
          >
            <span className={`orbit-sat-body planet-${s.planet}`}>
              {s.planet === 'saturn' && <span className="planet-rings" />}
              <span className="planet-surface" />
            </span>
            <span className="orbit-sat-label">
              <Icon size={13} strokeWidth={2} />
              {s.label[lang]}
            </span>
            <span className="orbit-sat-meta">{s.meta[lang]}</span>
          </button>
        );
      })}

      <p className="orbit-hint">
        {lang === 'fr' ? 'Clique sur une planète pour explorer' : 'Click a planet to explore'}
      </p>
    </div>
  );
}
