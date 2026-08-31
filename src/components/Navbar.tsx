'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useCube } from '@/lib/CubeContext';
import { Box, Send, Shield, User, Layers } from 'lucide-react';

const FACE_LABELS = {
  fr: ['Accueil', 'À Propos & CV', 'Projets', 'Contact'],
  en: ['Home', 'About & Resume', 'Projects', 'Contact'],
};

export default function Navbar() {
  const { lang, toggleLang } = useLanguage();
  const { current, goto, openFace, closeToCube, viewMode, isAnimating } = useCube();
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollTop = 0;
    
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (scrollTop > lastScrollTop + 10) {
        setShowMobileNav(false);
      } else if (scrollTop < lastScrollTop - 10) {
        setShowMobileNav(true);
      }
      lastScrollTop = scrollTop;
    };
    
    if (viewMode !== 'expanded' || isAnimating) {
      setShowMobileNav(true);
      setIsScrolled(false);
      return;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode, isAnimating]);

  const labels = FACE_LABELS[lang];
  const links = [0, 1, 2, 3];

  const handleNavClick = (i: number) => {
    if (viewMode === 'cube') {
      openFace(i);
    } else {
      goto(i);
    }
  };

  return (
    <>
      {/* ── Top Header Bar ── */}
      <nav
        id="main-site-header"
        className={isScrolled ? 'header-scrolled' : ''}
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
          {/* Logo & 3D Quick Action */}
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
              <span
                style={{
                  color: 'var(--amber)',
                  display: 'inline-block',
                  transform: isAnimating ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.6s ease',
                }}
              >
                ◆
              </span>
              <span>Marc Delon</span>
            </button>

            {/* Orbit 3D Quick Pill (visible in header on larger screens) */}
            <button
              type="button"
              className={`nav-3d-toggle ${viewMode === 'cube' ? 'active is-cube-view' : ''}`}
              onClick={() => {
                if (viewMode === 'cube') {
                  openFace(0);
                } else {
                  closeToCube();
                }
              }}
              title="Basculer vers la vue cube 3D"
            >
              <Box size={14} />
              <span>Orbite MD</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div
            id="nav-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '4px 6px',
              borderRadius: 'var(--r-full)',
              border: '1px solid rgba(223, 203, 175, 0.12)',
            }}
          >
            {links.map((i) => (
              <button
                key={i}
                id={`nav-link-${i}`}
                onClick={() => handleNavClick(i)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--r-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.25s ease',
                  background:
                    current === i && viewMode === 'expanded'
                      ? 'var(--amber)'
                      : 'transparent',
                  color:
                    current === i && viewMode === 'expanded'
                      ? '#ffffff'
                      : 'rgba(255, 255, 255, 0.85)',
                  boxShadow:
                    current === i && viewMode === 'expanded'
                      ? '0 2px 10px rgba(224, 123, 31, 0.4)'
                      : 'none',
                }}
              >
                {labels[i]}
              </button>
            ))}
          </div>

          {/* Right Area Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Language Toggle Button */}
            <button
              id="lang-toggle"
              onClick={toggleLang}
              aria-label="Changer de langue"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--cream)',
                border: '1px solid rgba(223, 203, 175, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '6px 12px',
                borderRadius: 'var(--r-full)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{lang === 'fr' ? 'EN' : 'FR'}</span>
            </button>

            {/* Desktop Contact CTA Button */}
            <button
              id="nav-cta"
              className="btn btn-amber nav-cta-btn"
              onClick={() => handleNavClick(3)}
              style={{ fontSize: '0.84rem', padding: '8px 18px', gap: '6px' }}
            >
              <Send size={14} />
              <span>{lang === 'fr' ? 'Me contacter' : 'Contact me'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Tab Navigation Bar ── */}
      <nav className={`mobile-bottom-bar ${!showMobileNav ? 'hidden-on-scroll' : ''}`} aria-label="Navigation mobile">
        {[
          {
            id: 0,
            label: lang === 'fr' ? 'Accueil' : 'Home',
            icon: Shield,
            isActive: viewMode === 'expanded' && current === 0,
            onClick: () => handleNavClick(0),
          },
          {
            id: 1,
            label: lang === 'fr' ? 'À Propos' : 'About',
            icon: User,
            isActive: viewMode === 'expanded' && current === 1,
            onClick: () => handleNavClick(1),
          },
          {
            id: 2,
            label: lang === 'fr' ? 'Projets' : 'Projects',
            icon: Layers,
            isActive: viewMode === 'expanded' && current === 2,
            onClick: () => handleNavClick(2),
          },
          {
            id: 3,
            label: lang === 'fr' ? 'Contact' : 'Contact',
            icon: Send,
            isActive: viewMode === 'expanded' && current === 3,
            onClick: () => handleNavClick(3),
          },
          {
            id: 'orbit',
            label: lang === 'fr' ? 'Orbite 3D' : '3D Orbit',
            icon: Box,
            isActive: viewMode === 'cube',
            onClick: () => {
              if (viewMode === 'cube') {
                openFace(0);
              } else {
                closeToCube();
              }
            },
          },
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={tab.onClick}
              className={`mobile-tab-btn ${tab.isActive ? 'is-active' : ''}`}
            >
              {tab.isActive && <span className="mobile-tab-indicator" />}
              <div className="mobile-tab-icon-wrap">
                <IconComp size={20} strokeWidth={tab.isActive ? 2.3 : 1.8} />
              </div>
              <span className="mobile-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        #main-site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          margin: 0 auto;
          z-index: 600;
          height: var(--navbar-h, 70px);
          display: flex;
          align-items: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(22, 11, 6, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(223, 203, 175, 0.16);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.55);
          width: 100%;
          max-width: 100%;
          border-radius: 0;
        }

        #main-site-header.header-scrolled {
          top: 12px;
          max-width: 1000px;
          width: calc(100% - 32px);
          height: calc(var(--navbar-h, 70px) * 0.85);
          border-radius: 50px;
          border: 1px solid rgba(223, 203, 175, 0.25);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
          background: rgba(22, 11, 6, 0.98);
        }

        #main-site-header #nav-logo {
          transition: font-size 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        #main-site-header.header-scrolled #nav-logo {
          font-size: clamp(0.85rem, 3vw, 1rem) !important;
        }

        #main-site-header.header-scrolled .nav-3d-toggle {
          padding: 4px 10px !important;
          font-size: 0.68rem !important;
        }

        #main-site-header.header-scrolled .nav-3d-toggle svg {
          width: 12px;
          height: 12px;
          transition: all 0.3s ease;
        }

        #main-site-header.header-scrolled #lang-toggle {
          padding: 4px 10px !important;
          font-size: 0.68rem !important;
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

        /* ── Mobile Bottom Tab Bar ── */
        .mobile-bottom-bar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 900;
          height: auto;
          min-height: 64px;
          background: linear-gradient(180deg, rgba(20, 10, 5, 0.96) 0%, rgba(10, 5, 2, 0.99) 100%);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid rgba(224, 123, 31, 0.25);
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.06);
          padding: 6px 4px calc(6px + env(safe-area-inset-bottom, 6px)) 4px;
          justify-content: space-around;
          align-items: stretch;
          user-select: none;
          touch-action: manipulation;
          transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.4s cubic-bezier(0.33, 1, 0.68, 1);
        }

        .mobile-bottom-bar.hidden-on-scroll {
          transform: translateY(120%);
          opacity: 0;
          pointer-events: none;
        }

        .mobile-tab-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: transparent;
          border: none;
          padding: 6px 2px;
          cursor: pointer;
          position: relative;
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .mobile-tab-btn:hover {
          color: rgba(255, 255, 255, 0.85);
        }

        .mobile-tab-btn.is-active {
          color: var(--amber, #e07b1f);
        }

        .mobile-tab-indicator {
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 38px;
          height: 3.5px;
          background: var(--amber, #e07b1f);
          border-radius: 0 0 4px 4px;
          box-shadow: 0 0 12px var(--amber, #e07b1f), 0 2px 6px rgba(224, 123, 31, 0.6);
          animation: pulseIndicator 2s ease-in-out infinite alternate;
        }

        @keyframes pulseIndicator {
          from { opacity: 0.85; box-shadow: 0 0 8px var(--amber); }
          to { opacity: 1; box-shadow: 0 0 16px var(--amber), 0 0 24px rgba(224, 123, 31, 0.8); }
        }

        .mobile-tab-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 22px;
          transition: transform 0.2s ease;
        }

        .mobile-tab-btn.is-active .mobile-tab-icon-wrap {
          transform: translateY(-2px);
          filter: drop-shadow(0 0 8px rgba(224, 123, 31, 0.5));
        }

        .mobile-tab-label {
          font-family: var(--font-sans);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .mobile-tab-btn.is-active .mobile-tab-label {
          color: #ffffff;
          font-weight: 800;
          text-shadow: 0 0 10px rgba(224, 123, 31, 0.4);
        }

        @media(max-width:960px){
          #nav-links { display: none !important; }
          .nav-cta-btn { display: none !important; }
          .mobile-bottom-bar { display: flex !important; }
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
