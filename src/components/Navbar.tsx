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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                fontSize: '1.25rem',
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
              }}
            >
              <span style={{ color: 'var(--amber)', fontSize: '1.1rem' }}>◆</span>
              <span>Marc Delon</span>
            </button>

            {/* 3D Overview Pill indicator */}
            <button
              type="button"
              className={`nav-3d-toggle ${viewMode === 'cube' ? 'active' : ''}`}
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

      {/* ── Mobile Vertical Slide-in Drawer ── */}
      {mobileOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={`mobile-vertical-drawer ${mobileOpen ? 'open' : ''}`}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-brand">
            <span style={{ color: 'var(--amber)', fontSize: '1.1rem' }}>◆</span>
            <span>Marc Delon</span>
          </div>
          {/* Space reserved for the animated morphing hamburger/X button above */}
          <div style={{ width: 36, height: 36 }} />
        </div>

        {/* 3D Overview Card */}
        <button
          type="button"
          className="drawer-3d-card"
          onClick={() => {
            closeToCube();
            setMobileOpen(false);
          }}
        >
          <div className="drawer-3d-icon-wrap">
            <Box size={18} />
          </div>
          <div className="drawer-3d-text">
            <span className="drawer-3d-title">Orbite MD</span>
            <span className="drawer-3d-sub">{lang === 'fr' ? 'Vue 3D interactive' : 'Interactive 3D view'}</span>
          </div>
        </button>

        {/* Vertical Navigation Links */}
        <div className="drawer-nav-list">
          {links.map((i) => (
            <button
              key={i}
              onClick={() => handleNavClick(i)}
              className={`drawer-nav-link ${current === i && viewMode === 'expanded' ? 'active' : ''}`}
            >
              <span className="drawer-link-num">0{i + 1}</span>
              <span className="drawer-link-label">{labels[i]}</span>
              {current === i && viewMode === 'expanded' && <span className="drawer-active-dot" />}
            </button>
          ))}
        </div>

        {/* Drawer Footer Actions */}
        <div className="drawer-footer">
          <button
            className="drawer-lang-btn"
            onClick={toggleLang}
          >
            <span>Langue :</span>
            <strong>{lang === 'fr' ? 'FRANÇAIS (FR)' : 'ENGLISH (EN)'}</strong>
          </button>

          <button
            className="btn btn-amber drawer-contact-btn"
            onClick={() => handleNavClick(3)}
          >
            <Send size={16} />
            <span>{lang === 'fr' ? 'Me contacter' : 'Contact me'}</span>
          </button>
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

        /* ── Mobile Vertical Drawer Styles ── */
        .mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 5, 2, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 998;
          animation: fadeIn 0.45s ease-out;
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
          width: min(320px, 85vw);
          height: 100vh;
          background: linear-gradient(180deg, #1a0d07 0%, #0d0603 100%);
          border-left: 1px solid rgba(224, 123, 31, 0.25);
          box-shadow: -15px 0 50px rgba(0, 0, 0, 0.85);
          z-index: 999;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1.25rem;
          gap: 1.25rem;
          transform: translateX(100%);
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
          overflow-y: auto;
        }
        .mobile-vertical-drawer.open {
          transform: translateX(0);
        }
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid rgba(223, 203, 175, 0.15);
        }
        .drawer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-serif);
          font-size: 1.2rem;
          font-weight: 900;
          color: #ffffff;
        }
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .drawer-close-btn:hover {
          background: var(--amber);
          color: #ffffff;
        }
        .drawer-3d-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 14px;
          background: rgba(224, 123, 31, 0.12);
          border: 1px solid rgba(224, 123, 31, 0.3);
          color: var(--amber);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .drawer-3d-card:hover {
          background: rgba(224, 123, 31, 0.22);
          box-shadow: 0 4px 18px rgba(224, 123, 31, 0.25);
        }
        .drawer-3d-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--amber);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .drawer-3d-text {
          display: flex;
          flex-direction: column;
        }
        .drawer-3d-title {
          font-size: 0.92rem;
          font-weight: 800;
        }
        .drawer-3d-sub {
          font-size: 0.72rem;
          opacity: 0.75;
        }
        .drawer-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        .drawer-nav-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 16px;
          border-radius: 14px;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.95rem;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: all 0.22s ease;
        }
        .drawer-nav-link:hover {
          background: rgba(224, 123, 31, 0.1);
          color: #ffffff;
          border-color: rgba(224, 123, 31, 0.2);
          transform: translateX(4px);
        }
        .drawer-nav-link.active {
          background: linear-gradient(135deg, rgba(224, 123, 31, 0.2) 0%, rgba(180, 87, 13, 0.15) 100%);
          border-color: rgba(224, 123, 31, 0.4);
          color: var(--amber);
          font-weight: 800;
        }
        .drawer-link-num {
          font-family: monospace;
          font-size: 0.76rem;
          color: var(--amber);
          opacity: 0.8;
        }
        .drawer-link-label {
          flex: 1;
        }
        .drawer-active-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--amber);
          box-shadow: 0 0 8px var(--amber);
        }
        .drawer-footer {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(223, 203, 175, 0.15);
        }
        .drawer-lang-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(223, 203, 175, 0.15);
          color: #dfcbaf;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .drawer-contact-btn {
          width: 100%;
          justify-content: center;
          padding: 12px;
          font-size: 0.9rem;
          border-radius: 14px;
        }

        @media(max-width:860px){
          #nav-links{display:none!important;}
          .nav-cta-btn{display:none!important;}
          .hamburger{display:flex!important;}
        }
      `}</style>
    </>
  );
}
