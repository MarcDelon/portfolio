'use client';
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/data';

function useAOS(cls = 'aos') {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function About() {
  const { lang } = useLanguage();
  const t = translations[lang].about;
  const leftRef = useAOS();
  const rightRef = useAOS();

  return (
    <section id="about-intro" style={{ background: 'var(--cream)', paddingTop: '5rem', paddingBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
      {/* ── Bamileke Heritage Background Artwork Layer ── */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/bamileke.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.22,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(245, 237, 216, 0.85) 0%, rgba(235, 225, 200, 0.78) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(2rem, 5vw, 5rem)', alignItems: 'start',
        }} id="about-grid">

          {/* ── Left: Hello + bio ── */}
          <div id="about-left-col" ref={leftRef} className="aos" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <h2 id="about-title" style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)',
              fontWeight: 900, fontStyle: 'italic',
              color: 'var(--dark)', lineHeight: 1.04,
              letterSpacing: '-0.02em',
            }}>
              {lang === 'fr' ? 'Bonjour,' : 'Hello,'}<br />
              {lang === 'fr' ? "je suis Marc !" : "I'm Marc!"}
            </h2>

            <p id="about-description" style={{ fontSize: '0.9375rem', lineHeight: 1.85, color: 'var(--text-mid)', maxWidth: 440 }}>
              {t.description}
            </p>

            {/* Tags */}
            <div id="about-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['React JS', 'Node.js', 'Next.js', 'PHP', 'Java', 'SQL', 'MongoDB', 'Cisco CCNA'].map(tag => (
                <span key={tag} className="chip-dark" style={{ fontSize: '0.72rem' }}>{tag}</span>
              ))}
            </div>

            {/* LinkedIn & CV buttons */}
            <div id="about-buttons" style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', paddingTop: '0.5rem', position: 'relative', zIndex: 10 }}>
              <a 
                href="https://www.linkedin.com/in/marc-delon-nzenang-tchouantcheu-57909b22a" 
                target="_blank" 
                rel="noopener noreferrer" 
                id="linkedin-btn" 
                className="btn btn-amber-outline" 
                style={{ 
                  fontSize: '0.875rem', 
                  borderRadius: 'var(--r-full)', 
                  gap: '0.625rem',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                linkedin.com/in/marc-delon
              </a>
              <a 
                href="/cv.pdf" 
                download="CV - NZENANG TCHOUANTCHEU MARC DELON.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                id="cv-download-btn" 
                className="btn" 
                style={{ 
                  background: 'transparent', 
                  color: 'var(--dark)', 
                  border: '1.5px solid var(--beige-dark)', 
                  borderRadius: 'var(--r-full)', 
                  fontSize: '0.875rem', 
                  gap: '0.5rem',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {t.downloadCV}
              </a>
            </div>

            {/* Stats strip */}
            <div id="about-stats" style={{ display: 'flex', gap: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--beige)', flexWrap: 'wrap' }}>
              {t.stats.map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 800, color: 'var(--amber)', lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Photo + contact card ── */}
          <div id="about-right-col" ref={rightRef} className="aos-r" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Photo area with badges */}
            <div id="about-photo-block" style={{ position: 'relative', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>

              {/* Photo */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div id="about-photo-wrapper" style={{
                  width: 200, height: 250,
                  background: 'var(--dark)',
                  borderRadius: 'var(--r-lg)', overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  border: '3px solid var(--amber)',
                  position: 'relative'
                }}>
                  <img src="/photo.png" alt="Marc Delon" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                </div>
                {/* Amber badge */}
                <div style={{
                  position: 'absolute', top: -12, right: -12,
                  background: 'var(--amber)', color: 'var(--white)',
                  borderRadius: 'var(--r-full)', padding: '5px 14px',
                  fontSize: '0.72rem', fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(224,123,31,0.4)',
                  whiteSpace: 'nowrap',
                }}>
                  Bachelor 3 · 2026
                </div>
              </div>

              {/* Right of photo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1.25rem' }}>
                <div style={{
                  background: 'var(--dark)', color: 'var(--white)',
                  borderRadius: 'var(--r-full)', padding: '6px 14px',
                  fontSize: '0.8rem', fontWeight: 600, width: 'fit-content',
                }}>
                  Camerounais 🇨🇲
                </div>
                {/* Baham Proverb Watermark */}
                <div style={{
                  fontFamily: 'var(--font-serif)', fontWeight: 900, fontStyle: 'italic',
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', lineHeight: 0.9,
                  color: 'rgba(26,14,6,0.18)', userSelect: 'none',
                  letterSpacing: '-0.01em', display: 'flex', flexDirection: 'column',
                  marginTop: '0.25rem'
                }}>
                  <span>Tʉ̀ gə́ bə</span>
                  <span>wá' ŋgɔ́ lə,</span>
                  <span>a kʉ̀</span>
                  <span>nə gwɔ</span>
                </div>
                {/* Translated caption */}
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--amber)', fontStyle: 'italic', maxWidth: '190px', lineHeight: 1.4, marginTop: '0.25rem' }}>
                  {lang === 'fr' ? "« L'arbre qui porte beaucoup de fruits se penche. »" : '"The tree that bears many fruits bows down."'}
                </div>
              </div>
            </div>

            {/* Contact card */}
            <div id="about-contact-card" style={{
              background: 'linear-gradient(145deg, #180c07 0%, #0e0603 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(224, 123, 31, 0.25)',
              padding: '1rem 1.35rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              width: '100%',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.45rem' }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)', fontSize: '1.2rem',
                  fontWeight: 900, fontStyle: 'italic',
                  color: 'var(--white)', margin: 0,
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <span style={{ color: 'var(--amber)', fontSize: '0.95rem' }}>◆</span>
                  <span>Contact</span>
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', width: '100%' }}>
                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', paddingBottom: '0.45rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(224,123,31,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      {lang === 'fr' ? 'Localisation' : 'Location'}
                    </span>
                    <span style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>Douala, Cameroun 🇨🇲</span>
                  </div>
                </div>

                {/* Email */}
                <a href="mailto:marcnzenang@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', paddingBottom: '0.45rem', borderBottom: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none', transition: 'transform 0.2s ease' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(224,123,31,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Email
                    </span>
                    <span style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>marcnzenang@gmail.com</span>
                  </div>
                </a>

                {/* Phone */}
                <a href="tel:+237655462642" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none', transition: 'transform 0.2s ease' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(224,123,31,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      {lang === 'fr' ? 'Téléphone / WhatsApp' : 'Phone / WhatsApp'}
                    </span>
                    <span style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>+237 655 46 26 42</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:860px){
          #about-intro {
            padding-top: calc(var(--navbar-h) - 24px) !important;
            padding-bottom: 2rem !important;
          }
          #about-grid { 
            display: flex !important;
            flex-direction: column !important;
            gap: 0.5rem !important;
            padding: 0 !important;
          }
          #about-left-col, #about-right-col {
            display: contents !important;
          }
          #about-title {
            order: 1 !important;
            line-height: 0.98 !important;
            margin: 0 0 -0.2rem 0 !important;
            padding: 0 !important;
          }
          #about-description {
            order: 2 !important;
            line-height: 1.55 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #about-photo-block {
            order: 3 !important;
            margin: 0.1rem 0 !important;
          }
          #about-photo-wrapper {
            width: 175px !important;
            height: 220px !important;
          }
          #about-photo-wrapper img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center top !important;
          }
          #about-tags {
            order: 4 !important;
            margin-top: 0.15rem !important;
          }
          #about-buttons {
            order: 5 !important;
            margin-top: 0.15rem !important;
          }
          #about-stats {
            order: 6 !important;
            padding-top: 0.85rem !important;
          }
          #about-contact-card {
            order: 7 !important;
            margin-top: 0.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
