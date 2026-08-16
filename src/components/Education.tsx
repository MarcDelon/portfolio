'use client';
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations, educationList } from '@/lib/data';

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

export default function Education() {
  const { lang } = useLanguage();
  const t = translations[lang].education;
  const ref = useAOS();

  return (
    <div ref={ref} className="aos" style={{ padding: '3rem 0 2rem' }}>
      {/* Section title */}
      <h3 style={{
        fontFamily: 'var(--font-serif)', fontSize: '2rem',
        fontWeight: 900, fontStyle: 'italic',
        color: 'var(--dark)', marginBottom: '1.75rem',
        letterSpacing: '-0.01em',
      }}>
        <span style={{ color: 'var(--amber)', marginRight: '0.5rem' }}>◆</span>
        {lang === 'fr' ? 'Formation' : 'Education'}
      </h3>

      {/* Timeline */}
      <div className="timeline">
        {educationList.map((edu, i) => (
          <div key={edu.id} className={`tl-item d${i + 1}`} style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            ref={el => {
              if (!el) return;
              const obs = new IntersectionObserver(([e]) => {
                if (e.isIntersecting) {
                  el.style.opacity = '1';
                  el.style.transform = 'translateY(0)';
                  obs.disconnect();
                }
              }, { threshold: 0.1 });
              obs.observe(el);
            }}
          >
            {/* Diamond dot */}
            <div className="tl-diamond" />

            {/* Year badge */}
            <div style={{ marginBottom: '0.375rem' }}>
              <span style={{
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em',
                color: 'var(--amber)', fontFamily: 'var(--font-sans)',
                textTransform: 'uppercase',
              }}>{edu.period}</span>
              {edu.current && (
                <span style={{
                  marginLeft: '0.625rem', fontSize: '0.65rem', fontWeight: 700,
                  background: 'var(--amber)', color: 'var(--white)',
                  padding: '2px 8px', borderRadius: 'var(--r-full)',
                  letterSpacing: '0.04em',
                }}>{t.current}</span>
              )}
            </div>

            {/* School & degree */}
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--dark)', marginBottom: '0.25rem', fontFamily: 'var(--font-sans)' }}>
              {edu.school}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-mid)', marginBottom: '0.5rem', fontStyle: 'italic', fontFamily: 'var(--font-sans)' }}>
              {edu.degree[lang]}
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)', lineHeight: 1.65, fontFamily: 'var(--font-sans)' }}>
              {edu.description[lang]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
