'use client';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/data';

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang].footer;

  return (
    <footer style={{
      background: 'var(--dark)',
      borderTop: '1px solid rgba(224,123,31,0.15)',
      padding: '3.5rem 0 2rem',
    }}>
      <div className="container">
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--amber)', fontSize: '1rem' }}>◆</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--white)' }}>Marc Delon</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', maxWidth: 260, lineHeight: 1.65, fontFamily: 'var(--font-sans)' }}>
              {t.tagline}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4A7C59', animation: 'pulse-green 2.5s infinite' }} />
              <span style={{ fontSize: '0.78rem', color: '#4A7C59', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                {lang === 'fr' ? 'Disponible pour des opportunités' : 'Available for opportunities'}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.375rem', fontFamily: 'var(--font-sans)' }}>
              {lang === 'fr' ? 'Navigation' : 'Navigation'}
            </p>
            {[
              { label: lang === 'fr' ? 'À Propos' : 'About', id: 'about-intro' },
              { label: lang === 'fr' ? 'Projets' : 'Projects', id: 'projects' },
              { label: lang === 'fr' ? 'Contact' : 'Contact', id: 'contact' },
            ].map(link => (
              <button key={link.id} onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })} style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'var(--font-sans)', transition: 'color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--amber)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem', fontFamily: 'var(--font-sans)' }}>
              Contact
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-sans)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>marcnzenang@gmail.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-sans)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>+237 655 46 26 42</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-sans)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Douala, Cameroun</span>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-sans)' }}>
            © {new Date().getFullYear()} NZENANG TCHOUANTCHEU MARC DELON. {t.rights}
          </p>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-sans)' }}>
            {t.builtWith}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse-green{0%,100%{box-shadow:0 0 0 0 rgba(74,124,89,0.5)}60%{box-shadow:0 0 0 8px rgba(74,124,89,0)}}
      `}</style>
    </footer>
  );
}
