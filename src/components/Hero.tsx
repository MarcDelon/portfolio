'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useCube } from '@/lib/CubeContext';
import { translations } from '@/lib/data';

function Star({ x, y, size = 20, delay = 0 }: { x: string; y: string; size?: number; delay?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--amber)" style={{
      position: 'absolute', left: x, top: y,
      animation: `twinkle ${2 + delay}s ease-in-out infinite`,
      animationDelay: `${delay}s`, opacity: 0.7, pointerEvents: 'none', zIndex: 1
    }}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6z"/>
    </svg>
  );
}

const ROLES_FR = ['Développeur Web & Mobile', 'UI/UX Designer', 'Développeur Fullstack', 'Monteur Vidéo'];
const ROLES_EN = ['Web & Mobile Developer', 'UI/UX Designer', 'Fullstack Developer', 'Video Editor'];

export default function Hero() {
  const { lang }              = useLanguage();
  const { goto, isAnimating } = useCube();
  const t                     = translations[lang].hero;
  const roles                 = lang === 'fr' ? ROLES_FR : ROLES_EN;

  const [roleIdx, setRoleIdx]         = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);
  const [mousePos, setMousePos]       = useState({ x: 0, y: 0 });
  const [tilt, setTilt]               = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered]     = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setRoleVisible(false);
      setTimeout(() => { setRoleIdx(i => (i + 1) % roles.length); setRoleVisible(true); }, 380);
    }, 2800);
    return () => clearInterval(iv);
  }, [roles.length]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg tilt
    const rotateY = ((x - centerX) / centerX) * 15;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleCardLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      style={{
        height: '100vh', minHeight: '100vh',
        background: 'linear-gradient(165deg, #110600 0%, #1a0e08 40%, #0d0603 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        paddingTop: 'var(--navbar-h)',
      }}
    >
      {/* Photo Background Layer with Parallax */}
      <div style={{
        position: 'absolute', inset: '-30px',
        backgroundImage: 'url(/back.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.12, // Subtle transparency so the gradient and grid show through
        zIndex: 0, pointerEvents: 'none',
        transform: `translate(${mousePos.x * -0.015}px, ${mousePos.y * -0.015}px)`,
        transition: 'transform 0.1s ease-out',
      }} />
      {/* Interactive Cursor Spotlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, pointerEvents: 'none',
        width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(224,123,31,0.06) 0%, transparent 60%)',
        transform: `translate(calc(${mousePos.x}px - 30vw), calc(${mousePos.y}px - 30vw))`,
        transition: 'transform 0.1s ease-out', zIndex: 0,
      }} />

      {/* Grid lines with Parallax */}
      <div style={{ 
        position: 'absolute', inset: '-50px', 
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', 
        backgroundSize: '64px 64px', pointerEvents: 'none', zIndex: 0,
        transform: `translate(${mousePos.x * -0.03}px, ${mousePos.y * -0.03}px)`,
        transition: 'transform 0.1s ease-out',
      }} />

      {/* Stars */}
      <Star x="8%"  y="18%" size={28} delay={0}   />
      <Star x="15%" y="72%" size={16} delay={1.2}  />
      <Star x="72%" y="12%" size={22} delay={0.6}  />
      <Star x="88%" y="65%" size={18} delay={1.8}  />
      <Star x="55%" y="80%" size={14} delay={0.9}  />
      <Star x="92%" y="28%" size={12} delay={2.1}  />
      <Star x="38%" y="8%"  size={10} delay={1.5}  />

      {/* Main grid */}
      <div className="container" style={{
        flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '1rem', alignItems: 'center',
        padding: '1.5rem 2.5rem', position: 'relative', zIndex: 2,
      }} id="hero-grid">

        {/* Left: Photo + info */}
        <div id="hero-left-col" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeUp 0.7s ease both', animationDelay: '0.1s' }}>

          {/* Photo and Text Row */}
          <div className="hero-photo-row" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* 3D Photo block — static frame, moving photo */}
            <div 
              className="hero-photo-box"
              style={{ 
                position: 'relative', width: 200, height: 250,
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '24px', overflow: 'hidden',
                boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
                background: '#0d0603',
                perspective: '800px',
                flexShrink: 0,
              }}
              onMouseMove={handleCardMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleCardLeave}
            >
              {/* Ambient glow */}
              <div style={{ 
                position: 'absolute', inset: -30, background: 'var(--amber)', borderRadius: '50%',
                filter: 'blur(50px)', opacity: isHovered ? 0.25 : 0.1, transition: 'opacity 0.4s ease',
                pointerEvents: 'none', zIndex: -1,
              }} />

              {/* Background Layer */}
              <img 
                src="/photo.png" 
                alt="" 
                style={{ 
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: '115%', height: '115%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  transform: `translate(calc(-50% + ${-tilt.y * 0.4}px), calc(-50% + ${tilt.x * 0.4}px)) rotateX(${tilt.x * 0.5}deg) rotateY(${tilt.y * 0.5}deg)`,
                  transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                  transformOrigin: 'center center',
                  willChange: 'transform',
                  pointerEvents: 'none',
                  filter: 'blur(6px) brightness(0.75)',
                }} 
              />
              
              {/* Foreground Layer */}
              <img 
                src="/photo-front.png" 
                alt="Marc Delon" 
                style={{ 
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: '115%', height: '115%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  transform: `translate(calc(-50% + ${-tilt.y * 1.5}px), calc(-50% + ${tilt.x * 1.5}px)) rotateX(${tilt.x * 1.2}deg) rotateY(${tilt.y * 1.2}deg) scale(1.05)`,
                  transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                  transformOrigin: 'center center',
                  willChange: 'transform',
                  pointerEvents: 'none',
                  zIndex: 2,
                  filter: isHovered ? 'drop-shadow(0px 15px 15px rgba(0,0,0,0.5))' : 'drop-shadow(0px 0px 0px rgba(0,0,0,0))',
                }} 
              />

              {/* Glare reflection */}
              {isHovered && (
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
                  background: `radial-gradient(circle at ${(tilt.y / 15 + 0.5) * 100}% ${(-tilt.x / 15 + 0.5) * 100}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
                  mixBlendMode: 'overlay',
                  transition: 'background 0.08s ease-out',
                }} />
              )}

              {/* Amber border glow on hover */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '24px',
                boxShadow: isHovered ? 'inset 0 0 0 1px rgba(224,123,31,0.5)' : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                transition: 'box-shadow 0.3s ease',
                pointerEvents: 'none', zIndex: 3,
              }} />
            </div>

            {/* Name & Quote */}
            <div className="hero-name-quote-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span className="hero-name-title" style={{ fontSize: '1.75rem', color: 'rgba(255,255,255,0.95)', fontWeight: 800, letterSpacing: '0.1em' }}>
                MARC DELON
              </span>
              <p className="hero-quote-txt" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontStyle: 'italic', maxWidth: '240px' }}>
                {lang === 'fr' ? '« Le succès arrive lorsque l\'opportunité rencontre la préparation. »' : '"Success happens when opportunity meets preparation."'}
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="hero-role-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="hero-role-box" style={{ height: '2.5rem', overflow: 'hidden' }}>
              <span className="hero-role-txt" style={{
                fontSize: '1.25rem', fontWeight: 700, color: 'rgba(255,255,255,0.95)',
                display: 'inline-block',
                opacity: roleVisible ? 1 : 0,
                transform: roleVisible ? 'translateY(0)' : 'translateY(-15px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}>
                <span style={{ color: 'var(--amber)', marginRight: '8px' }}>→</span> 
                {roles[roleIdx]}
              </span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="hero-cta-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button id="hero-cta-projects" className="btn btn-amber hero-cta-btn" disabled={isAnimating} onClick={() => goto(2)} style={{ fontSize: '0.95rem', padding: '14px 28px', boxShadow: '0 10px 25px rgba(224,123,31,0.3)' }}>
              {t.cta1}
            </button>
            <button id="hero-cta-contact" className="btn btn-dark hero-cta-btn" disabled={isAnimating} onClick={() => goto(3)} style={{ fontSize: '0.95rem', padding: '14px 28px' }}>
              {t.cta2}
            </button>
          </div>
        </div>

        {/* Right: Stacked PORTFOLIO text + social */}
        <div id="hero-right-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2rem', animation: 'fadeUp 0.8s ease both', animationDelay: '0.3s' }}>
          {/* Giant Outline Text */}
          <div id="hero-giant-title" style={{ lineHeight: 0.9, userSelect: 'none', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            {[
              { text: 'PORTFOLIO', filled: true,   ml: '0' },
              { text: 'NZENANG',   filled: false,  ml: '1.5rem' },
              { text: 'TCH. MARC', filled: false,  ml: '4rem' },
              { text: 'DELON',     filled: false,  ml: '2.5rem' },
            ].map(({ text, filled, ml }, i) => (
              <div key={i} className="hero-giant-title-line" style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
                fontWeight: 900, letterSpacing: '-0.02em',
                marginLeft: ml, lineHeight: 0.85,
                color: filled ? 'transparent' : 'rgba(255,255,255,0.03)',
                WebkitTextStroke: filled ? 'none' : '1px rgba(255,255,255,0.15)',
                backgroundImage: filled ? 'linear-gradient(135deg, var(--amber) 0%, #ffd0a0 100%)' : 'none',
                WebkitBackgroundClip: filled ? 'text' : 'none',
                backgroundClip: filled ? 'text' : 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if(!filled) {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.1)';
                  (e.currentTarget as HTMLElement).style.webkitTextStroke = '1px rgba(224,123,31,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if(!filled) {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.03)';
                  (e.currentTarget as HTMLElement).style.webkitTextStroke = '1px rgba(255,255,255,0.15)';
                }
              }}
              >
                {text}
              </div>
            ))}
          </div>

          {/* Social Links with hover scale */}
          <div id="hero-social-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-end', paddingRight: '1rem' }}>
            {[
              { 
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>, 
                handle: '/MarcDelon', href: 'https://github.com/MarcDelon' 
              },
              { 
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>, 
                handle: '/in/marc-delon', href: 'https://www.linkedin.com/in/marc-delon-nzenang-tchouantcheu-57909b22a' 
              },
              { 
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>, 
                handle: 'marcnzenang@gmail.com', href: 'mailto:marcnzenang@gmail.com' 
              },
            ].map(({ icon, handle, href }, idx) => (
              <a href={href} target="_blank" rel="noopener" key={idx} className="hero-social-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'transform 0.2s ease', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateX(-5px)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'}
              >
                <div className="hero-social-icon-box" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)' }}>
                  {icon}
                </div>
                <span className="hero-social-txt" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{handle}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll / Next face button */}
      <div className="hero-scroll-wrapper" style={{ display: 'flex', justifyContent: 'center', paddingBottom: '1.5rem', position: 'relative', zIndex: 10 }}>
        <button id="scroll-down-btn" onClick={() => goto(1)} disabled={isAnimating} style={{
          width: 70, height: 70, borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)', color: 'var(--white)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
          cursor: 'pointer', transition: 'all 0.3s ease',
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em',
          animation: 'float 3s ease-in-out infinite',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'var(--amber)';
          el.style.borderColor = 'var(--amber)';
          el.style.boxShadow = '0 10px 30px rgba(224,123,31,0.4)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'rgba(255,255,255,0.03)';
          el.style.borderColor = 'rgba(255,255,255,0.1)';
          el.style.boxShadow = 'none';
        }}
        >
          <span style={{ fontFamily: 'var(--font-sans)', textTransform: 'uppercase' }}>
            {lang === 'fr' ? 'Suivant' : 'Next'}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'bounce 1.8s ease-in-out infinite' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes pulse-amber { 0%,100%{box-shadow:0 0 0 0 rgba(224,123,31,.5)} 60%{box-shadow:0 0 0 12px rgba(224,123,31,0)} }
        @keyframes twinkle { 0%,100%{opacity:.7;transform:scale(1) rotate(0deg)} 50%{opacity:.3;transform:scale(.6) rotate(15deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:900px){ 
          .hero-section-root {
            height: auto !important;
            min-height: 100vh !important;
            overflow-y: auto !important;
            padding-top: calc(var(--navbar-h) - 5px) !important;
          }
          #hero-grid {
            display: flex !important;
            flex-direction: column !important;
            padding: 1rem 1.5rem 1.5rem !important;
            gap: 1.5rem !important;
          }
          #hero-right-col {
            display: contents !important;
          }
          #hero-giant-title {
            order: 1 !important;
            width: 100% !important;
            align-items: flex-end !important;
            text-align: right !important;
            margin-bottom: 0.4rem !important;
          }
          .hero-giant-title-line {
            font-size: clamp(2.8rem, 7.8vw, 4.2rem) !important;
            line-height: 0.85 !important;
          }
          #hero-left-col {
            order: 2 !important;
            width: 100% !important;
            gap: 1.35rem !important;
          }
          .hero-photo-row {
            gap: 1.35rem !important;
            align-items: center !important;
          }
          .hero-photo-box {
            width: 175px !important;
            height: 220px !important;
            border-radius: 22px !important;
          }
          .hero-name-quote-col {
            gap: 0.55rem !important;
          }
          .hero-name-title {
            font-size: 1.65rem !important;
            letter-spacing: 0.08em !important;
          }
          .hero-quote-txt {
            font-size: 0.85rem !important;
            line-height: 1.5 !important;
            max-width: 230px !important;
          }
          .hero-role-wrap {
            gap: 0.6rem !important;
          }
          .hero-role-box {
            height: 2.2rem !important;
          }
          .hero-role-txt {
            font-size: 1.15rem !important;
          }
          .hero-cta-group {
            gap: 0.85rem !important;
          }
          .hero-cta-btn {
            font-size: 0.92rem !important;
            padding: 12px 24px !important;
          }
          #hero-social-links {
            order: 3 !important;
            width: 100% !important;
            align-items: flex-end !important;
            gap: 0.65rem !important;
            padding-right: 0.5rem !important;
            margin-top: 0.6rem !important;
          }
          .hero-social-item {
            gap: 0.65rem !important;
          }
          .hero-social-icon-box {
            width: 32px !important;
            height: 32px !important;
          }
          .hero-social-icon-box svg {
            width: 16px !important;
            height: 16px !important;
          }
          .hero-social-txt {
            font-size: 0.84rem !important;
          }
          .hero-scroll-wrapper {
            padding-bottom: 1.25rem !important;
          }
          #scroll-down-btn {
            width: 64px !important;
            height: 64px !important;
            font-size: 0.62rem !important;
            gap: 4px !important;
          }
          #scroll-down-btn svg {
            width: 15px !important;
            height: 15px !important;
          }
        }

        @media(max-width:440px){
          #hero-grid {
            padding: 0.75rem 1rem 1rem !important;
            gap: 1.15rem !important;
          }
          .hero-photo-row {
            gap: 0.85rem !important;
          }
          .hero-photo-box {
            width: 135px !important;
            height: 175px !important;
            border-radius: 18px !important;
          }
          .hero-name-title {
            font-size: 1.35rem !important;
          }
          .hero-quote-txt {
            font-size: 0.75rem !important;
            max-width: 150px !important;
            line-height: 1.4 !important;
          }
          .hero-giant-title-line {
            font-size: clamp(2.2rem, 9.5vw, 3.2rem) !important;
          }
          .hero-cta-btn {
            font-size: 0.85rem !important;
            padding: 10px 18px !important;
            width: 100% !important;
            justify-content: center !important;
          }
          .hero-cta-group {
            width: 100% !important;
          }
        }

        @media (min-width: 901px) and (max-width: 1150px) {
          #hero-grid {
            gap: 2rem !important;
            padding: 0 1.5rem !important;
          }
          .hero-giant-title-line {
            font-size: clamp(2.6rem, 5.2vw, 4.2rem) !important;
          }
          .hero-photo-box {
            width: 180px !important;
            height: 230px !important;
          }
        }
      `}</style>
    </section>
  );
}
