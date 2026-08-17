'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useCube } from '@/lib/CubeContext';
import { Box, Sparkles, Send, X } from 'lucide-react';

const FACE_LABELS = {
  fr: ['Accueil', 'À Propos & CV', 'Projets', 'Contact'],
  en: ['Home', 'About & Resume', 'Projects', 'Contact'],
};

export default function Navbar() {
  const { lang, toggleLang } = useLanguage();
  const { current, goto, openFace, closeToCube, viewMode, isAnimating } = useCube();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (viewMode !== 'expanded') {
      setScrolled(false);
      return;
    }
    const onScroll = () => {
      const face = document.getElementById(`cube-face-${current}`);
      setScrolled((face?.scrollTop ?? 0) > 40);
    };
    const face = document.getElementById(`cube-face-${current}`);
    face?.addEventListener('scroll', onScroll, { passive: true });
    return () => face?.removeEventListener('scroll', onScroll);
  }, [current, viewMode]);

  const labels = FACE_LABELS[lang];
  const links = [0, 1, 2, 3];

  const handleNavClick = (i: number) => {
    if (viewMode === 'cube') {
      openFace(i);
    } else {
      goto(i);
    }
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        id="main-site-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 600,
          height: 'var(--navbar-h)',
          display: 'flex',
          alignItems: 'center',
          transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
          background: 'rgba(22, 11, 6, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(223, 203, 175, 0.16)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.55)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Logo & 3D Mode Quick Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1rem)', flexShrink: 0 }}>
            <button
              id="nav-logo"
              onClick={() => {
                if (viewMode === 'expanded') {
                  closeToCube();
                } else {
                  openFace(0);
                }
              }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.05rem, 4vw, 1.25rem)',
                fontWeight: 900,
                color: 'var(--white)',
                padding: 0,
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                background: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <span style={{ color: 'var(--amber)', fontSize: '1.1rem' }}>◆</span>
              <span style={{ whiteSpace: 'nowrap' }}>Marc Delon</span>
            </button>

            {/* 3D Overview Pill indicator */}
            <button
              type="button"
              className={`nav-3d-toggle ${viewMode === 'cube' ? 'active is-cube-view' : ''}`}
              onClick={() => {
                if (viewMode === 'cube') {
                  openFace(current);
                } else {
                  closeToCube();
                }
              }}
              title={viewMode === 'cube' ? 'Ouvrir en plein écran' : 'Passer en Orbite MD'}
            >
              <Box size={14} className="icon-amber" />
              <span>{viewMode === 'cube' ? 'Orbite MD Actif' : 'Orbite MD'}</span>
            </button>
          </div>

          {/* Desktop nav links */}
          <div
            id="nav-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '4px 6px',
              borderRadius: 'var(--r-full)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {links.map((i) => (
              <button
                key={i}
                id={`nav-face-${i}`}
                onClick={() => handleNavClick(i)}
                disabled={isAnimating}
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--r-full)',
                  fontSize: '0.85rem',
                  fontWeight: current === i && viewMode === 'expanded' ? 600 : 400,
                  color:
                    current === i && viewMode === 'expanded'
                      ? 'var(--amber)'
                      : 'rgba(255,255,255,0.72)',
                  background:
                    current === i && viewMode === 'expanded'
                      ? 'rgba(224,123,31,0.14)'
                      : 'transparent',
                  border: 'none',
                  cursor: isAnimating ? 'default' : 'pointer',
                  transition: 'all 0.22s ease',
                }}
                onMouseEnter={(e) => {
                  if (current !== i || viewMode !== 'expanded')
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  if (current !== i || viewMode !== 'expanded')
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.72)';
                }}
              >
                {labels[i]}
              </button>
            ))}
          </div>

          {/* Right: lang + CTA + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              id="lang-toggle"
              onClick={toggleLang}
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.7)',
                padding: '5px 12px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 'var(--r-full)',
                background: 'transparent',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'var(--amber)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--amber)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            <button
              id="nav-cta"
              className="btn btn-amber nav-cta-btn"
              onClick={() => handleNavClick(3)}
              style={{ fontSize: '0.84rem', padding: '8px 18px', gap: '6px' }}
            >
              <Send size={14} />
              <span>{lang === 'fr' ? 'Me contacter' : 'Contact me'}</span>
            </button>

            {/* Hamburger Button with smooth 3-bar to X morphing */}
            <button
              id="nav-hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`hamburger ${mobileOpen ? 'is-open' : ''}`}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              style={{
                display: 'none',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '5px',
                background: mobileOpen ? 'rgba(224, 123, 31, 0.15)' : 'transparent',
                border: mobileOpen ? '1px solid rgba(224, 123, 31, 0.3)' : '1px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                padding: '6px',
                width: '36px',
                height: '36px',
                position: 'relative',
                zIndex: 1001,
                transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: 22,
                  height: 2,
                  borderRadius: 2,
                  background: mobileOpen ? 'var(--amber)' : '#fff',
                  transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                  transformOrigin: 'center center',
                  transform: mobileOpen
                    ? 'translateY(7px) rotate(45deg)'
                    : 'none',
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: 22,
                  height: 2,
                  borderRadius: 2,
                  background: mobileOpen ? 'var(--amber)' : '#fff',
                  transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                  opacity: mobileOpen ? 0 : 1,
                  transform: mobileOpen ? 'scaleX(0)' : 'none',
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: 22,
                  height: 2,
                  borderRadius: 2,
                  background: mobileOpen ? 'var(--amber)' : '#fff',
                  transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                  transformOrigin: 'center center',
                  transform: mobileOpen
                    ? 'translateY(-7px) rotate(-45deg)'
                    : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Luxury Vertical Slide-in Drawer ── */}
      {mobileOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={`mobile-vertical-drawer ${mobileOpen ? 'open' : ''}`}>
        {/* Drawer Header with Designer Brand */}
        <div className="drawer-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div className="drawer-brand">
              <span style={{ color: 'var(--amber)', fontSize: '1rem' }}>◆</span>
              <span>Marc Delon</span>
            </div>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(223, 203, 175, 0.65)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
              {lang === 'fr' ? 'Ingénieur Logiciel & 3D' : 'Software & 3D Engineer'}
            </span>
          </div>
          {/* Morphing hamburger close button space */}
          <div style={{ width: 36, height: 36 }} />
        </div>

        {/* 3D Orbit Space Portal Card */}
        <button
          type="button"
          className={`drawer-3d-card ${viewMode === 'cube' ? 'is-active-orbit' : ''}`}
          onClick={() => {
            closeToCube();
            setMobileOpen(false);
          }}
        >
          <div className="drawer-3d-icon-wrap">
            <Box size={18} />
          </div>
          <div className="drawer-3d-text">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="drawer-3d-title">Orbite MD</span>
              <span className="drawer-3d-badge">{viewMode === 'cube' ? (lang === 'fr' ? 'Actif' : 'Active') : '3D'}</span>
            </div>
            <span className="drawer-3d-sub">{lang === 'fr' ? 'Explorer la Planète Delon en 3D' : 'Explore Planet Delon in 3D'}</span>
          </div>
        </button>

        {/* Editorial Navigation List */}
        <div className="drawer-nav-list">
          <div className="drawer-section-label">
            {lang === 'fr' ? 'Navigation' : 'Navigation'}
          </div>

          {[
            {
              id: 0,
              num: '01',
              title: lang === 'fr' ? 'Accueil' : 'Home',
              subtitle: lang === 'fr' ? 'Vision, Bio & Philosophie' : 'Vision, Bio & Philosophy',
            },
            {
              id: 1,
              num: '02',
              title: lang === 'fr' ? 'À Propos & CV' : 'About & CV',
              subtitle: lang === 'fr' ? 'Formation, CCNA & Stacks' : 'Education, CCNA & Stacks',
            },
            {
              id: 2,
              num: '03',
              title: lang === 'fr' ? 'Projets 3D' : '3D Projects',
              subtitle: lang === 'fr' ? 'Réalisations & Démos live' : 'Creations & Live Demos',
            },
            {
              id: 3,
              num: '04',
              title: lang === 'fr' ? 'Contact' : 'Contact',
              subtitle: lang === 'fr' ? 'Messagerie directe & WhatsApp' : 'Direct Email & WhatsApp',
            },
          ].map((item) => {
            const isActive = current === item.id && viewMode === 'expanded';
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`drawer-nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="drawer-link-num">{item.num}</span>
                <div className="drawer-link-text-col">
                  <span className="drawer-link-title">{item.title}</span>
                  <span className="drawer-link-subtitle">{item.subtitle}</span>
                </div>
                {isActive && <div className="drawer-active-indicator" />}
              </button>
            );
          })}
        </div>

        {/* Social Quick Connect */}
        <div className="drawer-social-row">
          <a
            href="https://github.com/MarcDelon"
            target="_blank"
            rel="noopener noreferrer"
            className="drawer-social-btn"
            title="GitHub"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/marc-delon-nzenang-tchouantcheu-57909b22a"
            target="_blank"
            rel="noopener noreferrer"
            className="drawer-social-btn"
            title="LinkedIn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Drawer Footer Actions */}
        <div className="drawer-footer">
          {/* Language Switcher Segment */}
          <div className="drawer-lang-segment">
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Langue :</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => { if (lang !== 'fr') toggleLang(); }}
                className={`drawer-lang-choice ${lang === 'fr' ? 'active' : ''}`}
              >
                FR
              </button>
              <button
                onClick={() => { if (lang !== 'en') toggleLang(); }}
                className={`drawer-lang-choice ${lang === 'en' ? 'active' : ''}`}
              >
                EN
              </button>
            </div>
          </div>

          <button
            className="btn btn-amber drawer-contact-btn"
            onClick={() => handleNavClick(3)}
          >
            <Send size={15} />
            <span>{lang === 'fr' ? 'Démarrer un projet' : 'Start a project'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', paddingTop: '4px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#25D366', boxShadow: '0 0 8px #25D366' }} />
            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
              {lang === 'fr' ? 'Disponible pour opportunités' : 'Available for opportunities'}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .nav-3d-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: var(--r-full);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--amber);
          background: rgba(224, 123, 31, 0.12);
          border: 1px solid rgba(224, 123, 31, 0.25);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .nav-3d-toggle:hover, .nav-3d-toggle.active {
          background: rgba(224, 123, 31, 0.25);
          box-shadow: 0 0 12px rgba(224, 123, 31, 0.3);
        }

        /* ── Luxury Mobile Vertical Drawer Styles ── */
        .mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(8, 4, 2, 0.78);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 998;
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .mobile-vertical-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(340px, 86vw);
          height: 100vh;
          height: 100dvh;
          background: linear-gradient(175deg, rgba(24, 12, 6, 0.98) 0%, rgba(12, 6, 3, 0.99) 100%);
          border-left: 1px solid rgba(224, 123, 31, 0.3);
          box-shadow: -20px 0 60px rgba(0, 0, 0, 0.9), inset 1px 0 0 rgba(255, 255, 255, 0.05);
          z-index: 999;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1.25rem 1.25rem;
          gap: 1.15rem;
          transform: translateX(100%);
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          overflow-y: auto;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .mobile-vertical-drawer.open {
          transform: translateX(0);
        }
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(223, 203, 175, 0.12);
        }
        .drawer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        /* 3D Orbit Portal Card */
        .drawer-3d-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(224, 123, 31, 0.16) 0%, rgba(180, 87, 13, 0.08) 100%);
          border: 1px solid rgba(224, 123, 31, 0.35);
          color: var(--amber);
          text-align: left;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.3);
        }
        .drawer-3d-card:hover, .drawer-3d-card.is-active-orbit {
          background: linear-gradient(135deg, rgba(224, 123, 31, 0.28) 0%, rgba(180, 87, 13, 0.18) 100%);
          border-color: var(--amber);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(224, 123, 31, 0.25);
        }
        .drawer-3d-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--amber) 0%, #b4570d 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 14px rgba(224, 123, 31, 0.4);
          flex-shrink: 0;
        }
        .drawer-3d-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .drawer-3d-title {
          font-size: 0.94rem;
          font-weight: 800;
          color: #ffffff;
        }
        .drawer-3d-badge {
          font-size: 0.62rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 6px;
          background: rgba(224, 123, 31, 0.25);
          border: 1px solid var(--amber);
          color: var(--amber);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .drawer-3d-sub {
          font-size: 0.72rem;
          color: rgba(223, 203, 175, 0.75);
        }

        /* Editorial Navigation List */
        .drawer-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          flex: 1;
        }
        .drawer-section-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(223, 203, 175, 0.4);
          padding-left: 6px;
          margin-bottom: 2px;
        }
        .drawer-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.85);
          text-align: left;
          cursor: pointer;
          transition: all 0.22s ease;
          position: relative;
        }
        .drawer-nav-link:hover {
          background: rgba(224, 123, 31, 0.12);
          border-color: rgba(224, 123, 31, 0.25);
          color: #ffffff;
          transform: translateX(3px);
        }
        .drawer-nav-link.active {
          background: linear-gradient(135deg, rgba(224, 123, 31, 0.22) 0%, rgba(180, 87, 13, 0.14) 100%);
          border-color: rgba(224, 123, 31, 0.45);
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
        }
        .drawer-link-num {
          font-family: monospace;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--amber);
          opacity: 0.9;
        }
        .drawer-link-text-col {
          display: flex;
          flex-direction: column;
          gap: 1px;
          flex: 1;
        }
        .drawer-link-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ffffff;
        }
        .drawer-link-subtitle {
          font-size: 0.68rem;
          color: rgba(223, 203, 175, 0.6);
        }
        .drawer-active-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--amber);
          box-shadow: 0 0 10px var(--amber);
        }

        /* Social Quick Links */
        .drawer-social-row {
          display: flex;
          gap: 8px;
          padding: 4px 0;
        }
        .drawer-social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(223, 203, 175, 0.14);
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.78rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .drawer-social-btn:hover {
          background: rgba(224, 123, 31, 0.18);
          border-color: var(--amber);
          color: #ffffff;
          transform: translateY(-1px);
        }

        /* Drawer Footer */
        .drawer-footer {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(223, 203, 175, 0.12);
        }
        .drawer-lang-segment {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(223, 203, 175, 0.12);
        }
        .drawer-lang-choice {
          padding: 4px 12px;
          border-radius: 8px;
          border: none;
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.2s ease;
        }
        .drawer-lang-choice.active {
          background: var(--amber);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(224, 123, 31, 0.4);
        }
        .drawer-contact-btn {
          width: 100%;
          justify-content: center;
          padding: 11px;
          font-size: 0.88rem;
          font-weight: 700;
          border-radius: 14px;
          box-shadow: 0 6px 20px rgba(224, 123, 31, 0.35);
        }

        .nav-3d-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--r-full, 9999px);
          background: rgba(224, 123, 31, 0.12);
          border: 1px solid rgba(224, 123, 31, 0.35);
          color: var(--amber, #e07b1f);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .nav-3d-toggle:hover {
          background: rgba(224, 123, 31, 0.25);
          border-color: var(--amber, #e07b1f);
          transform: translateY(-1px);
        }
        .nav-3d-toggle.active {
          background: rgba(224, 123, 31, 0.2);
          border-color: rgba(224, 123, 31, 0.5);
          box-shadow: 0 0 14px rgba(224, 123, 31, 0.25);
        }

        @media(max-width:960px){
          #nav-links{display:none!important;}
          .nav-cta-btn{display:none!important;}
          .hamburger{display:flex!important;}
        }

        @media(max-width:640px){
          .nav-3d-toggle.is-cube-view {
            display: none !important;
          }
          .nav-3d-toggle {
            padding: 4px 10px;
            font-size: 0.72rem;
          }
        }
      `}</style>
    </>
  );
}
