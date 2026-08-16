'use client';
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { skillGroups } from '@/lib/data';

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

interface BarProps { name: string; level: number; delay?: number; }
function SkillBar({ name, level, delay = 0 }: BarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = barRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.width = `${level}%`;
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [level]);

  return (
    <div style={{ marginBottom: '0.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-mid)', fontFamily: 'var(--font-sans)' }}>{name}</span>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-sans)' }}>{level}%</span>
      </div>
      <div style={{ height: 5, background: 'var(--cream-dark)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
        <div ref={barRef} style={{
          height: '100%', width: '0%',
          background: `linear-gradient(90deg, var(--amber) 0%, var(--amber-light) 100%)`,
          borderRadius: 'var(--r-full)',
          transition: `width 1s cubic-bezier(0.34,1.1,0.64,1) ${delay}ms`,
        }} />
      </div>
    </div>
  );
}

export default function Skills() {
  const { lang } = useLanguage();
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
        {lang === 'fr' ? 'Compétences Techniques' : 'Technical Skills'}
      </h3>

      {/* Two-column: software + coding */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} id="skills-grid">
        <div>
          <h4 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '1.25rem', fontFamily: 'var(--font-sans)' }}>
            {lang === 'fr' ? 'Frontend' : 'Frontend'}
          </h4>
          {skillGroups[0].skills.map((s, i) => <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 80} />)}
        </div>
        <div>
          <h4 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '1.25rem', fontFamily: 'var(--font-sans)' }}>
            {lang === 'fr' ? 'Backend & BD' : 'Backend & DB'}
          </h4>
          {skillGroups[1].skills.map((s, i) => <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 80} />)}
        </div>
      </div>

      {/* DB + Network */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }} id="skills-grid-2">
        <div>
          <h4 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '1.25rem', fontFamily: 'var(--font-sans)' }}>
            {lang === 'fr' ? 'Bases de Données' : 'Databases'}
          </h4>
          {skillGroups[2].skills.map((s, i) => <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 80} />)}
        </div>
        <div>
          <h4 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '1.25rem', fontFamily: 'var(--font-sans)' }}>
            {lang === 'fr' ? 'Réseaux & Outils' : 'Networks & Tools'}
          </h4>
          {skillGroups[3].skills.map((s, i) => <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 80} />)}
        </div>
      </div>

      {/* Skill tags */}
      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--beige)' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.875rem', fontFamily: 'var(--font-sans)' }}>
          Domaines
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['Développement Web', 'API REST', 'UI/UX Design', 'Base de données', 'Montage Vidéo', 'Réseaux Cisco'].map(tag => (
            <span key={tag} className="chip-dark" style={{ fontSize: '0.75rem' }}>{tag}</span>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:640px){
          #skills-grid,#skills-grid-2{grid-template-columns:1fr!important;}
        }
      `}</style>
    </div>
  );
}
