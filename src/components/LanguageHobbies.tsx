'use client';
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

function useAOS() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const HOBBIES = [
  { 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/>
      </svg>
    ), 
    fr: 'Basketball & Sport', 
    en: 'Basketball & Sports' 
  },
  { 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/>
      </svg>
    ), 
    fr: 'Montage Vidéo (CapCut)', 
    en: 'Video Editing (CapCut)' 
  },
  { 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>
      </svg>
    ), 
    fr: 'Développement Mobile', 
    en: 'Mobile App Development' 
  },
  { 
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="2" x2="7" y1="17" y2="17"/><line x1="17" x2="22" y1="17" y2="17"/><line x1="17" x2="22" y1="7" y2="7"/>
      </svg>
    ), 
    fr: 'Cinéma & Veille Tech', 
    en: 'Cinema & Tech Trends' 
  },
];

export default function LanguageHobbies() {
  const { lang } = useLanguage();
  const ref = useAOS();

  return (
    <div ref={ref} className="aos" style={{ padding: '3rem 0 2rem', borderTop: '1px solid var(--beige)' }}>

      {/* Language */}
      <h3 style={{
        fontFamily: 'var(--font-serif)', fontSize: '2rem',
        fontWeight: 900, fontStyle: 'italic',
        color: 'var(--dark)', marginBottom: '1.5rem',
        letterSpacing: '-0.01em',
      }}>
        <span style={{ color: 'var(--amber)', marginRight: '0.5rem' }}>◆</span>
        {lang === 'fr' ? 'Langues' : 'Languages'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { name: 'Français', code: 'FR', level: lang === 'fr' ? 'Langue Maternelle' : 'Native', pct: 100 },
          { name: 'Anglais', code: 'EN', level: lang === 'fr' ? 'Intermédiaire B1' : 'Intermediate B1', pct: 55 },
        ].map(({ name, code, level, pct }) => (
          <div key={name} style={{
            background: 'var(--white)', borderRadius: 'var(--r-md)',
            padding: '1rem 1.125rem',
            boxShadow: 'var(--shadow-sm)', border: '1px solid var(--beige)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 'var(--r-sm)',
                background: 'var(--amber-pale)', color: 'var(--amber-dark)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '0.75rem', fontFamily: 'monospace', letterSpacing: '0.05em'
              }}>
                {code}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--dark)', fontFamily: 'var(--font-sans)' }}>{name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: 'var(--font-sans)' }}>{level}</div>
              </div>
            </div>
            <div style={{ height: 4, background: 'var(--beige)', borderRadius: 'var(--r-full)' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--amber), var(--amber-light))', borderRadius: 'var(--r-full)' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Hobbies */}
      <h3 style={{
        fontFamily: 'var(--font-serif)', fontSize: '1.75rem',
        fontWeight: 900, fontStyle: 'italic',
        color: 'var(--dark)', marginBottom: '1.25rem',
        letterSpacing: '-0.01em',
      }}>
        <span style={{ color: 'var(--amber)', marginRight: '0.5rem' }}>◆</span>
        {lang === 'fr' ? 'Centres d’Intérêt' : 'Interests & Activities'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        {HOBBIES.map(h => (
          <div key={h.fr} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.875rem 1.125rem',
            background: 'var(--white)', borderRadius: 'var(--r-md)',
            border: '1px solid var(--beige)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'var(--t)',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--amber)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--beige)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {h.icon}
            </div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-mid)', fontFamily: 'var(--font-sans)' }}>
              {lang === 'fr' ? h.fr : h.en}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
