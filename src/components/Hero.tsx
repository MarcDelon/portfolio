'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import RipplePortalBackground from '@/components/RipplePortalBackground';
import { useLanguage } from '@/lib/LanguageContext';
import { useCube } from '@/lib/CubeContext';
import { translations } from '@/lib/data';

// Custom Animated Counter Hook
function useCounter(target: number, duration: number = 1600, delay: number = 200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    let timer: NodeJS.Timeout;
    const startDelay = setTimeout(() => {
      const stepTime = Math.max(Math.floor(duration / target), 30);
      timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= target) {
          clearInterval(timer);
        }
      }, stepTime);
    }, delay);

    return () => {
      clearTimeout(startDelay);
      if (timer) clearInterval(timer);
    };
  }, [target, duration, delay]);

  return count;
}

export default function Hero() {
  const { lang } = useLanguage();
  const { goto, isAnimating } = useCube();
  const t = translations[lang].hero;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Animated counters
  const yearsCount = useCounter(3, 1200, 300);
  const projectsCount = useCounter(8, 1400, 500);
  const clientsCount = useCounter(4, 1200, 700);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });

    if (typeof window !== 'undefined') {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setParallax({
        x: (clientX - cx) / cx, // -1 to 1
        y: (clientY - cy) / cy,
      });
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="hero-fullscreen-root"
      style={{
        width: '100%',
        height: '100vh',
        minHeight: '100vh',
        background: '#0D0603',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 clamp(1.5rem, 5vw, 5rem) clamp(1.5rem, 3.5vh, 2.5rem)',
        boxSizing: 'border-box',
      }}
    >
      {/* Uiverse.io by NlghtM4re 3D Ripple Rings Portal with brand warm amber colors */}
      <RipplePortalBackground />

      {/* Background ambient radial glow centered behind head/torso */}
      <div
        className="hero-ambient-glow"
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          width: '75vw',
          height: '75vw',
          maxWidth: '1000px',
          maxHeight: '1000px',
          background: 'radial-gradient(circle, rgba(224,123,31,0.24) 0%, rgba(224,123,31,0.06) 48%, transparent 72%)',
          transform: `translate(calc(-50% + ${parallax.x * -25}px), calc(-50% + ${parallax.y * -20}px))`,
          transition: 'transform 0.25s ease-out',
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(50px)',
        }}
      />

      {/* Interactive cursor spotlight */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(245,160,64,0.08) 0%, transparent 60%)',
          transform: `translate(calc(${mousePos.x}px - 25vw), calc(${mousePos.y}px - 25vw))`,
          transition: 'transform 0.15s ease-out',
          zIndex: 0,
        }}
      />

      {/* ── TYPOGRAPHIE GÉANTE D'ARRIÈRE-PLAN: "PORTFOLIO" ── */}
      {/* Placé plus bas (top: 18%) pour épouser les épaules et le buste exactement comme sur l'affiche */}
      <div
        className="hero-giant-bg-text anim-fade-in-scale"
        style={{
          position: 'absolute',
          top: 'clamp(5rem, 15vh, 9rem)',
          left: '50%',
          transform: `translate(calc(-50% + ${parallax.x * -16}px), ${parallax.y * -8}px)`,
          transition: 'transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)',
          width: '100%',
          textAlign: 'center',
          fontSize: 'clamp(5.5rem, 17vw, 16.5rem)',
          fontWeight: 900,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          lineHeight: 0.85,
          color: '#E07B1F',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 1,
          fontFamily: 'var(--font-sans)',
          textShadow: '0 20px 60px rgba(0, 0, 0, 0.75)',
          opacity: 0.95,
        }}
      >
        PORTFOLIO
      </div>

      {/* ── PHOTO CENTRALE ÉTENDUE ET ANCRÉE AU BAS DE L'ÉCRAN ── */}
      <div
        className="hero-center-photo-wrap anim-fade-up-photo"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: `translate(calc(-50% + ${parallax.x * 12}px), ${parallax.y * 8}px)`,
          transition: 'transform 0.18s cubic-bezier(0.2, 0, 0.2, 1)',
          width: 'clamp(460px, 58vw, 840px)',
          height: 'calc(100vh - 1.5rem)',
          maxHeight: '1060px',
          zIndex: 4,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {/* Dégradé doux à la base pour fusionner la veste au noir pur */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '-20%',
            right: '-20%',
            height: '140px',
            background: 'linear-gradient(to top, #0D0603 20%, rgba(13,6,3,0.85) 55%, transparent 100%)',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        />

        <Image
          src="/photo-hero.png"
          alt="Marc Delon"
          fill
          priority
          quality={95}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
          style={{
            objectFit: 'contain',
            objectPosition: 'bottom center',
            filter: 'drop-shadow(0px 25px 50px rgba(0, 0, 0, 0.9))',
          }}
        />
      </div>

      {/* ── ALIGNEMENT OPTIQUE DU BAS : GAUCHE (TEXTE & CTA) vs DROITE (STATS) ── */}
      <div
        className="hero-bottom-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          position: 'relative',
          zIndex: 10,
          width: '100%',
        }}
      >
        {/* Bas Gauche : Hiérarchie typographique raffinée avec carte de contraste */}
        <div
          className="hero-bottom-left anim-slide-up-left"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            maxWidth: '440px',
            background: 'linear-gradient(135deg, rgba(13, 6, 3, 0.7) 0%, rgba(13, 6, 3, 0.2) 100%)',
            backdropFilter: 'blur(8px)',
            padding: '1.2rem 1.5rem',
            borderRadius: '18px',
            border: '1px solid rgba(224, 123, 31, 0.15)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Cursive "Bonjour, je suis" */}
          <span
            style={{
              fontStyle: 'italic',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: '1.35rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            {lang === 'fr' ? 'Bonjour, je suis' : "Hello, I'm"}
          </span>

          {/* MARC DELON géant et condensé */}
          <h1
            className="hero-person-name"
            style={{
              margin: '0.15rem 0',
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              textTransform: 'uppercase',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
            }}
          >
            MARC<br />DELON
          </h1>

          {/* Métier / Titre */}
          <h2
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--amber)',
              margin: '0.2rem 0 0.1rem',
              fontFamily: 'var(--font-sans)',
            }}
          >
            WEB DESIGNER & UI/UX CREATOR
          </h2>

          {/* Description courte */}
          <p
            className="hero-bio-text"
            style={{
              fontSize: '0.8125rem',
              color: 'rgba(255, 255, 255, 0.74)',
              lineHeight: 1.5,
              margin: 0,
              fontFamily: 'var(--font-sans)',
            }}
          >
            {lang === 'fr'
              ? 'Je conçois et développe des expériences web modernes, élégantes et centrées sur l’utilisateur. Alliant créativité technique et sens du détail.'
              : 'I design and build stylish, user-focused web experiences that combine creativity with strategy. Passionate about clean design and smooth interactions.'}
          </p>

          {/* Tag mondialement disponible + Boutons d'action */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '0.65rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--amber)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="spin-subtle"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{lang === 'fr' ? 'DISPONIBLE MONDIALEMENT' : 'AVAILABLE WORLDWIDE'}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                id="hero-cta-projects"
                disabled={isAnimating}
                onClick={() => goto(2)}
                className="btn-interactive-amber"
                style={{
                  padding: '9px 20px',
                  borderRadius: 'var(--r-full)',
                  background: 'var(--amber)',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-sans)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(224, 123, 31, 0.4)',
                  transition: 'all 0.25s ease',
                }}
              >
                {t.cta1}
              </button>
              <button
                id="hero-cta-contact"
                disabled={isAnimating}
                onClick={() => goto(3)}
                className="btn-interactive-outline"
                style={{
                  padding: '9px 20px',
                  borderRadius: 'var(--r-full)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {t.cta2}
              </button>
            </div>
          </div>
        </div>

        {/* Bas Droite : Statistiques premium alignées dans une carte semi-transparente */}
        <div
          className="hero-bottom-right-stats anim-slide-up-right"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.1rem',
            alignItems: 'flex-start',
            background: 'linear-gradient(135deg, rgba(13, 6, 3, 0.7) 0%, rgba(13, 6, 3, 0.2) 100%)',
            backdropFilter: 'blur(8px)',
            padding: '1.2rem 1.6rem',
            borderRadius: '18px',
            border: '1px solid rgba(224, 123, 31, 0.15)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          {[
            {
              countVal: yearsCount,
              suffix: '+',
              line1: lang === 'fr' ? 'ANNÉES' : 'YEARS',
              line2: lang === 'fr' ? "D'EXPÉRIENCE" : 'EXPERIENCE',
            },
            {
              countVal: projectsCount,
              suffix: '+',
              line1: lang === 'fr' ? 'PROJETS' : 'PROJECTS',
              line2: lang === 'fr' ? 'RÉALISÉS' : 'COMPLETED',
            },
            {
              countVal: clientsCount,
              suffix: '+',
              line1: lang === 'fr' ? 'CLIENTS' : 'HAPPY',
              line2: lang === 'fr' ? 'SATISFAITS' : 'CLIENTS',
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="stat-interactive-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                transition: 'transform 0.25s ease',
                cursor: 'default',
              }}
            >
              <span
                className="stat-glow-number"
                style={{
                  fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                  fontWeight: 900,
                  color: 'var(--amber)',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1,
                  minWidth: '58px',
                  display: 'inline-block',
                }}
              >
                {stat.countVal}{stat.suffix}
              </span>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.78)',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1.25,
                }}
              >
                <span>{stat.line1}</span>
                <span>{stat.line2}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* ── Animations clés ── */
        .anim-fade-in-scale {
          animation: fadeInScale 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .anim-fade-up-photo {
          animation: fadeUpPhoto 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }
        .anim-slide-up-left {
          animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }
        .anim-slide-up-right {
          animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -20px) scale(0.94);
          }
          to {
            opacity: 0.95;
            transform: translate(-50%, 0) scale(1);
          }
        }

        @keyframes fadeUpPhoto {
          from {
            opacity: 0;
            transform: translate(-50%, 40px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-ambient-glow {
          animation: ambientBreath 8s ease-in-out infinite;
        }
        @keyframes ambientBreath {
          0%, 100% {
            opacity: 0.8;
            filter: blur(50px);
          }
          50% {
            opacity: 1;
            filter: blur(65px);
          }
        }

        .spin-subtle {
          animation: slowSpin 25s linear infinite;
        }
        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ── Micro-interactions ── */
        .btn-interactive-amber:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(224, 123, 31, 0.6) !important;
          background: #f58826 !important;
        }
        .btn-interactive-outline:hover {
          background: rgba(255, 255, 255, 0.16) !important;
          border-color: rgba(224, 123, 31, 0.5) !important;
          transform: translateY(-2px);
        }

        .stat-interactive-card:hover {
          transform: translateX(4px);
        }
        .stat-interactive-card:hover .stat-glow-number {
          text-shadow: 0 0 16px rgba(224, 123, 31, 0.7);
        }

        /* ── Responsive Adaptatif ── */
        @media (max-width: 980px) {
          .hero-fullscreen-root {
            height: auto !important;
            min-height: 100vh !important;
            padding: calc(var(--navbar-h) + 1.5rem) 1.25rem 2rem !important;
            justify-content: flex-start !important;
            gap: 2rem !important;
          }
          .hero-giant-bg-text {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            transform: none !important;
            width: 100% !important;
            font-size: clamp(3.2rem, 15vw, 6.5rem) !important;
            margin: 0.5rem 0 !important;
          }
          .hero-center-photo-wrap {
            position: relative !important;
            transform: none !important;
            left: auto !important;
            bottom: auto !important;
            width: 90% !important;
            max-width: 440px !important;
            height: 440px !important;
            margin: -2rem auto 0 !important;
          }
          .hero-bottom-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.5rem !important;
          }
          .hero-bottom-left {
            max-width: 100% !important;
          }
          .hero-bottom-right-stats {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 1.5rem !important;
            width: 100% !important;
            justify-content: space-between !important;
          }
        }

        @media (max-width: 480px) {
          .hero-bottom-right-stats {
            flex-direction: column !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
