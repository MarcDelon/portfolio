'use client';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { projects, type Project } from '@/lib/data';
import { ArrowUpRight } from 'lucide-react';

/* ── AstroShock 3D Tunnel Room Component (Luxury Brown / White / Beige) ── */
function AstroTunnelRoom({
  project,
  index,
  total,
  lang,
}: {
  project: Project;
  index: number;
  total: number;
  lang: 'fr' | 'en';
}) {
  const theme = project.roomTheme;

  return (
    <div
      id={`astro-room-${project.id}`}
      className="astro-tunnel-room"
      style={{
        '--r-roof': theme.roofTop,
        '--r-ceiling': theme.ceiling,
        '--r-wall-l': theme.wallLeft,
        '--r-wall-r': theme.wallRight,
        '--r-back': theme.back,
        '--r-floor': theme.floor,
        '--r-accent': theme.accent,
        '--r-accent-glow': theme.accentGlow,
      } as React.CSSProperties}
    >
      {/* ── 1. Top Roof Bar (Warm Chocolate/Espresso) ── */}
      <div className="astro-surface astro-surface-roof">
        <div className="surface-roof-meta">
          <span className="meta-brand-tag">MARC DELON // LABS</span>
          <span className="meta-room-index">{theme.roomNumber}</span>
        </div>
      </div>

      {/* ── 2. Top Ceiling Trapezoid Slope (Linen Beige / Alabaster Ivory) ── */}
      <div className="astro-surface astro-surface-ceiling" />

      {/* ── 3. Left Wall Trapezoid (Roasted Mocha Brown) ── */}
      <div className="astro-surface astro-surface-wall-left">
        <div className="wall-vertical-meta">
          <span className="wall-category-tag">{project.category.toUpperCase()}</span>
          <span className="wall-index-tag">0{index + 1} / 0{total}</span>
        </div>
      </div>

      {/* ── 4. Right Wall Trapezoid (Roasted Mocha Brown) ── */}
      <div className="astro-surface astro-surface-wall-right">
        <div className="wall-vertical-meta right-side">
          <span className="wall-sub-tag">{theme.subLabel}</span>
          <span className="wall-year-tag">{project.year}</span>
        </div>
      </div>

      {/* ── 5. Bottom Floor Trapezoid (Connects seamlessly to next room) ── */}
      <div className="astro-surface astro-surface-floor">
        <div className="floor-connector-strip" />
      </div>

      {/* ── 6. Central Recessed Room Stage (Links to Dedicated Project Page) ── */}
      <Link
        href={`/projects/${project.slug}`}
        className="astro-room-stage"
      >
        {/* Left Floating Card — Luxury Ivory Glass Mockup with Real Project Logo */}
        <div className="astro-floating-card">
          <div className="card-mockup-canvas" style={{ background: project.gradient }}>
            <div 
              className={`card-logo-container ${project.slug === 'vano-chat' ? 'is-dark-logo' : ''}`}
              style={project.slug === 'vano-chat' ? { background: '#000000', borderColor: 'rgba(255, 255, 255, 0.15)' } : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.logo}
                alt={project.title}
                className="card-logo-img"
              />
            </div>
            <div className="card-preview-strip">
              <span className="card-live-dot" />
              <span className="card-live-txt">
                {lang === 'fr' ? 'PROJET MAJEUR' : 'FEATURED WORK'}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right: Massive Ultra-Bold Condensed Title & Tagline */}
        <div className="astro-center-title-group">
          <div className="astro-title-meta-badge">
            <span className="badge-room-num">{theme.roomNumber}</span>
            <span className="badge-sep">·</span>
            <span className="badge-category">{project.category.toUpperCase()}</span>
          </div>

          <h2 className="astro-massive-title">
            {project.displayTitle}
          </h2>

          {project.tagline && (
            <p className="astro-room-tagline">
              {project.tagline[lang]}
            </p>
          )}

          {/* Interactive Luxury CTA Button */}
          <div className="astro-action-cta">
            <span className="astro-cta-pill">
              {lang === 'fr' ? 'Explorer la Fiche' : 'View Case Study'}
              <ArrowUpRight size={16} className="cta-icon-arrow" />
            </span>
            <span className="astro-cta-meta">
              {project.tech.slice(0, 3).join(' · ')}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ── Main Projects Component ── */
export default function Projects() {
  const { lang } = useLanguage();

  return (
    <section id="projects" className="astroshock-corridor-wrapper">
      {/* ── 3D Rooms Continuous Vertical Tunnel ── */}
      <div className="astro-continuous-tunnel">
        {projects.map((project, idx) => (
          <AstroTunnelRoom
            key={project.id}
            project={project}
            index={idx}
            total={projects.length}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
}
