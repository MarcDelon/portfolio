'use client';
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations, experiences } from '@/lib/data';

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

export default function Experience() {
  const { lang } = useLanguage();
  const ref = useAOS();

  return (
    <div ref={ref} className="aos" style={{ padding: '3rem 0 2rem', borderTop: '1px solid var(--beige)' }}>
      <h3 style={{
        fontFamily: 'var(--font-serif)', fontSize: '2rem',
        fontWeight: 900, fontStyle: 'italic',
        color: 'var(--dark)', marginBottom: '1.75rem',
        letterSpacing: '-0.01em',
      }}>
        <span style={{ color: 'var(--amber)', marginRight: '0.5rem' }}>◆</span>
        {lang === 'fr' ? 'Expérience' : 'Experience'}
      </h3>

      <div className="timeline">
        {experiences.map((exp, i) => (
          <div key={exp.id} className="tl-item" style={{
            opacity: 0, transform: 'translateY(14px)',
            transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`,
          }}
            ref={el => {
              if (!el) return;
              const obs = new IntersectionObserver(([e]) => {
                if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; obs.disconnect(); }
              }, { threshold: 0.08 });
              obs.observe(el);
            }}>

            <div className="tl-diamond" />

            {/* Year + type badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--amber)', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
                {exp.period}
              </span>
              <span style={{
                fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em',
                padding: '2px 8px', borderRadius: 'var(--r-full)',
                background: exp.type === 'stage' ? 'var(--amber)' : 'var(--dark)',
                color: 'var(--white)', textTransform: 'uppercase',
              }}>
                {exp.type === 'stage' ? (lang === 'fr' ? 'Stage' : 'Internship') : (lang === 'fr' ? 'Projets' : 'Projects')}
              </span>
            </div>

            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--dark)', marginBottom: '0.2rem', fontFamily: 'var(--font-sans)' }}>
              {exp.role[lang]}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--amber)', fontWeight: 600, marginBottom: '0.625rem', fontFamily: 'var(--font-sans)' }}>
              {exp.company}
            </div>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {exp.description[lang].map((line, j) => (
                <li key={j} style={{ fontSize: '0.8125rem', color: 'var(--text-mid)', lineHeight: 1.6, fontFamily: 'var(--font-sans)', paddingLeft: '1rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--amber)', fontWeight: 700 }}>·</span>
                  {line}
                </li>
              ))}
            </ul>

            {/* Tech chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.75rem' }}>
              {exp.tech.map(t => <span key={t} className="chip-dark" style={{ fontSize: '0.7rem' }}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
