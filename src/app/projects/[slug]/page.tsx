'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { projects } from '@/lib/data';
import Starfield from '@/components/Starfield';
import { 
  ArrowLeft, 
  ArrowRight, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  Globe, 
  Maximize2, 
  X,
  Sparkles
} from 'lucide-react';

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { lang, toggleLang } = useLanguage();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Find project by slug or numeric id
  const projectIndex = projects.findIndex(
    (p) => p.slug === resolvedParams.slug || p.id.toString() === resolvedParams.slug
  );

  if (projectIndex === -1) {
    notFound();
  }

  const project = projects[projectIndex];
  const theme = project.roomTheme;

  // Previous & Next navigation
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  return (
    <main
      className="project-page-root"
      style={{
        '--p-back': theme.back,
        '--p-wall': theme.wallLeft,
        '--p-ceiling': theme.ceiling,
        '--p-floor': theme.floor,
        '--p-accent': theme.accent,
      } as React.CSSProperties}
    >
      {/* Dynamic Starfield Background */}
      <div className="project-page-bg">
        <Starfield />
        <div className="project-bg-radial" />
      </div>

      {/* ── Top Fixed Navigation Bar ── */}
      <header className="project-page-nav">
        <div className="container project-nav-inner">
          <Link href="/#projects" className="project-back-link">
            <ArrowLeft size={18} className="back-icon" />
            <span>{lang === 'fr' ? 'Retour au Portfolio' : 'Back to Portfolio'}</span>
          </Link>

          <div className="project-nav-center">
            <span className="nav-brand-tag">MARC DELON // LABS</span>
            <span className="nav-room-badge">{theme.roomNumber}</span>
          </div>

          <div className="project-nav-actions">
            <button
              type="button"
              className="lang-toggle-btn"
              onClick={toggleLang}
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <Link href="/#contact" className="nav-contact-pill">
              {lang === 'fr' ? 'Me Contacter' : 'Contact Me'}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Banner Section ── */}
      <section className="project-hero-section">
        <div className="container">
          <div className="project-hero-grid">
            {/* Left: Floating 3D Card with Official Project Logo */}
            <div className="project-hero-card-col">
              <div className="project-detail-card" style={{ background: project.gradient }}>
                <div 
                  className={`detail-logo-wrap ${project.slug === 'vano-chat' ? 'is-dark-logo' : ''}`}
                  style={project.slug === 'vano-chat' ? { background: '#000000', borderColor: 'rgba(255, 255, 255, 0.15)' } : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.logo}
                    alt={`${project.title} Logo`}
                    className="detail-card-logo-img"
                  />
                </div>
                <div className="detail-card-badge">
                  <span className="card-live-dot" />
                  <span className="card-live-text">
                    {lang === 'fr' ? 'PROJET MAJEUR' : 'FEATURED WORK'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Massive Title & Overview Meta */}
            <div className="project-hero-info-col">
              <div className="project-meta-pill-row">
                <span className="room-meta-pill">{theme.roomNumber}</span>
                <span className="category-meta-pill">{project.category.toUpperCase()}</span>
                <span className="year-meta-pill">
                  <Calendar size={13} /> {project.year}
                </span>
              </div>

              <h1 className="project-hero-title">{project.title}</h1>

              {project.tagline && (
                <p className="project-hero-tagline">{project.tagline[lang]}</p>
              )}

              {/* Quick Tech Badges */}
              <div className="project-hero-tech-row">
                {project.tech.map((t) => (
                  <span key={t} className="hero-tech-chip">
                    <span className="tech-chip-dot" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Case Study Detailed Content ── */}
      <section className="project-body-section">
        <div className="container">
          <div className="project-content-card">
            {/* 1. Presentation & Architecture */}
            <div className="case-study-block">
              <div className="block-title-row">
                <h2 className="block-title">
                  {lang === 'fr'
                    ? 'Architecture & Présentation Détaillée'
                    : 'Architecture & In-Depth Overview'}
                </h2>
              </div>
              <p className="block-paragraph">{project.longDescription[lang]}</p>
            </div>

            {/* 2. Photo & Screenshot Showcase Gallery */}
            {project.images && project.images.length > 0 && (
              <div className="case-study-block">
                <div className="block-title-row">
                  <h2 className="block-title">
                    {lang === 'fr'
                      ? 'Captures d’Écran & Galerie du Projet'
                      : 'Screenshots & Project Gallery'}
                  </h2>
                </div>
                <div className="project-gallery-grid">
                  {project.images.map((imgSrc, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="gallery-image-frame"
                      onClick={() => setActiveImage(imgSrc)}
                      title={lang === 'fr' ? 'Cliquez pour agrandir' : 'Click to enlarge'}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc}
                        alt={`${project.title} screenshot ${imgIdx + 1}`}
                        className="gallery-screenshot"
                        loading="lazy"
                      />
                      <div className="gallery-hover-overlay">
                        <span className="gallery-zoom-badge">
                          <Maximize2 size={16} />
                          <span>{lang === 'fr' ? 'Agrandir' : 'Enlarge'}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Live Site / Online Deployment CTA Banner (Right after photos!) */}
            <div className="live-deployment-banner">
              <div className="live-banner-left">
                <div className="live-status-indicator">
                  <span className="live-status-pulse" />
                  <span className="live-status-label">
                    {lang === 'fr' ? 'APPLICATION EN LIGNE & DISPONIBLE' : 'LIVE APPLICATION & READY'}
                  </span>
                </div>
                <h3 className="live-banner-heading">
                  {lang === 'fr' ? 'Découvrez le projet en direct' : 'Experience the project live'}
                </h3>
                <p className="live-banner-sub">
                  {lang === 'fr'
                    ? 'Explorez l’interface interactive, testez les fonctionnalités et vivez l’expérience utilisateur.'
                    : 'Explore the live interactive interface, test features and experience the full user journey.'}
                </p>
              </div>

              <div className="live-banner-actions">
                <a
                  href={project.liveUrl || 'https://github.com/MarcDelon'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="live-visit-primary-btn"
                >
                  <Globe size={18} />
                  <span>{lang === 'fr' ? 'Visiter le site en ligne' : 'Visit Live Website'}</span>
                  <ExternalLink size={16} className="external-link-arrow" />
                </a>

                <a
                  href="https://github.com/MarcDelon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="live-source-secondary-btn"
                >
                  <GithubIcon size={17} />
                  <span>{lang === 'fr' ? 'Dépôt GitHub' : 'GitHub Repo'}</span>
                </a>
              </div>
            </div>

            {/* 4. Key Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="case-study-block">
                <div className="block-title-row">
                  <h2 className="block-title">
                    {lang === 'fr'
                      ? 'Performances & Métriques Clés'
                      : 'Performance & Key Highlights'}
                  </h2>
                </div>
                <div className="metrics-cards-grid">
                  {project.metrics.map((m, idx) => (
                    <div key={idx} className="metric-box">
                      <span className="metric-num">{m.value}</span>
                      <span className="metric-lbl">{m.label[lang]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Technologies Deployed */}
            <div className="case-study-block">
              <div className="block-title-row">
                <h2 className="block-title">
                  {lang === 'fr'
                    ? 'Stack Technique & Outils Déployés'
                    : 'Technical Stack & Deployed Tools'}
                </h2>
              </div>
              <div className="tech-badges-grid">
                {project.tech.map((techItem) => (
                  <div key={techItem} className="tech-detail-card">
                    <CheckCircle2 size={16} className="tech-check-icon" />
                    <span className="tech-name">{techItem}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom Corridor Navigation ── */}
          <nav className="project-corridor-nav">
            {prevProject ? (
              <Link href={`/projects/${prevProject.slug}`} className="corridor-nav-btn prev-btn">
                <ArrowLeft size={20} />
                <div className="nav-btn-text">
                  <span className="nav-btn-hint">
                    {lang === 'fr' ? 'PROJET PRÉCÉDENT' : 'PREVIOUS PROJECT'}
                  </span>
                  <span className="nav-btn-title">{prevProject.title}</span>
                </div>
              </Link>
            ) : (
              <div className="corridor-nav-placeholder" />
            )}

            <Link href="/#projects" className="corridor-back-hub">
              <span>{lang === 'fr' ? 'Explorer tous les projets' : 'Explore all projects'}</span>
            </Link>

            {nextProject ? (
              <Link href={`/projects/${nextProject.slug}`} className="corridor-nav-btn next-btn">
                <div className="nav-btn-text text-right">
                  <span className="nav-btn-hint">
                    {lang === 'fr' ? 'PROJET SUIVANT' : 'NEXT PROJECT'}
                  </span>
                  <span className="nav-btn-title">{nextProject.title}</span>
                </div>
                <ArrowRight size={20} />
              </Link>
            ) : (
              <div className="corridor-nav-placeholder" />
            )}
          </nav>
        </div>
      </section>

      {/* ── Fullscreen Image Lightbox Modal ── */}
      {activeImage && (
        <div className="gallery-lightbox-backdrop" onClick={() => setActiveImage(null)}>
          <div className="gallery-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setActiveImage(null)}
              title={lang === 'fr' ? 'Fermer' : 'Close'}
            >
              <X size={24} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt="Zoomed project view"
              className="lightbox-zoomed-img"
            />
          </div>
        </div>
      )}
    </main>
  );
}
