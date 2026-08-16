'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { translations } from '@/lib/data';

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

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const { lang } = useLanguage();
  const t = translations[lang].contact;
  const [formState, setFormState] = useState<FormState>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const leftRef = useAOS();
  const rightRef = useAOS();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormState('success');
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setFormState('idle'), 7000);
      } else {
        setFormState('error');
        setTimeout(() => setFormState('idle'), 7000);
      }
    } catch {
      setFormState('error');
      setTimeout(() => setFormState('idle'), 7000);
    }
  };

  const infoCards = [
    { 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      ), 
      label: t.info.email.label, 
      value: t.info.email.value, 
      href: `mailto:${t.info.email.value}` 
    },
    { 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ), 
      label: t.info.phone.label, 
      value: t.info.phone.value, 
      href: `tel:${t.info.phone.value}` 
    },
    { 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      ), 
      label: t.info.location.label, 
      value: t.info.location.value, 
      href: '#' 
    },
  ];

  return (
    <section id="contact" style={{ background: 'var(--cream)', padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* ── Bamileke Heritage Background Artwork Layer ── */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/bamileke.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.20,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(245, 237, 216, 0.88) 0%, rgba(235, 225, 200, 0.80) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 'clamp(2.5rem, 5vw, 5rem)', alignItems: 'start' }} id="contact-grid">

          {/* Left Column: Title, Subtitle & Direct Contact Info (No Box Container) */}
          <div ref={leftRef} className="aos" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <span className="sec-label-dark">{t.label}</span>
              <h2 style={{
                fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.75rem)',
                fontWeight: 900, fontStyle: 'italic', color: 'var(--dark)',
                lineHeight: 1.06, letterSpacing: '-0.02em', whiteSpace: 'pre-line',
                marginTop: '0.5rem',
              }}>
                {t.title}
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-mid)', maxWidth: 480, lineHeight: 1.75, fontFamily: 'var(--font-sans)', marginTop: '0.85rem' }}>
                {t.subtitle}
              </p>
            </div>

            {/* Direct Contact & Socials List (Placed directly on the site) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(223, 203, 175, 0.6)' }}>
              
              {/* Email */}
              <a 
                href="mailto:marcnzenang@gmail.com"
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  color: 'var(--dark)', textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(6px)'; (e.currentTarget as HTMLElement).style.color = 'var(--amber)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.color = 'var(--dark)'; }}
              >
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--amber-pale)', color: 'var(--amber-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '2px' }}>Email</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>marcnzenang@gmail.com</div>
                </div>
              </a>

              {/* Téléphone */}
              <a 
                href="tel:+237655462642"
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  color: 'var(--dark)', textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(6px)'; (e.currentTarget as HTMLElement).style.color = 'var(--amber)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.color = 'var(--dark)'; }}
              >
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--amber-pale)', color: 'var(--amber-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '2px' }}>{lang === 'fr' ? 'Téléphone' : 'Phone'}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>+237 655 46 26 42</div>
                </div>
              </a>

              {/* Adresse / Localisation */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  color: 'var(--dark)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--amber-pale)', color: 'var(--amber-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '2px' }}>{lang === 'fr' ? 'Adresse' : 'Address'}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Douala, Cameroun</div>
                </div>
              </div>

              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/marc-delon-nzenang-tchouantcheu-57909b22a"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  color: 'var(--dark)', textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(6px)'; (e.currentTarget as HTMLElement).style.color = 'var(--amber)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.color = 'var(--dark)'; }}
              >
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--amber-pale)', color: 'var(--amber-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '2px' }}>LinkedIn</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>linkedin.com/in/marc-delon</div>
                </div>
              </a>

              {/* GitHub */}
              <a 
                href="https://github.com/MarcDelon"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  color: 'var(--dark)', textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(6px)'; (e.currentTarget as HTMLElement).style.color = 'var(--amber)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.color = 'var(--dark)'; }}
              >
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--amber-pale)', color: 'var(--amber-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '2px' }}>GitHub</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>github.com/MarcDelon</div>
                </div>
              </a>

            </div>
          </div>

          {/* Form */}
          <div id="contact-form-col" ref={rightRef} className="aos-r" style={{ paddingTop: '1rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} id="form-name-email">
                <div>
                  <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>{t.form.name}</label>
                  <input id="contact-name" type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={t.form.namePlaceholder} className="form-input" />
                </div>
                <div>
                  <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>{t.form.email}</label>
                  <input id="contact-email" type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder={t.form.emailPlaceholder} className="form-input" />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>{t.form.subject}</label>
                <input id="contact-subject" type="text" required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder={t.form.subjectPlaceholder} className="form-input" />
              </div>

              <div>
                <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>{t.form.message}</label>
                <textarea id="contact-message" required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder={t.form.messagePlaceholder} className="form-input" rows={5} />
              </div>

              {formState === 'success' && (
                <div style={{ padding: '1rem', background: 'rgba(74,124,89,0.1)', border: '1px solid rgba(74,124,89,0.3)', borderRadius: 'var(--r-md)', fontSize: '0.875rem', color: '#4A7C59', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                  {t.form.success}
                </div>
              )}
              {formState === 'error' && (
                <div style={{ padding: '1rem', background: 'rgba(200,50,50,0.08)', border: '1px solid rgba(200,50,50,0.25)', borderRadius: 'var(--r-md)', fontSize: '0.875rem', color: '#c43a3a', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                  {t.form.error}
                </div>
              )}

              <button id="contact-submit" type="submit" disabled={formState === 'sending'} className="btn btn-amber" style={{ justifyContent: 'center', padding: '14px', fontSize: '0.9375rem', opacity: formState === 'sending' ? 0.75 : 1, cursor: formState === 'sending' ? 'not-allowed' : 'pointer' }}>
                {formState === 'sending' ? (
                  <>
                    <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    {t.form.sending}
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    {t.form.send}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @media(max-width:960px){
          #contact-grid{
            grid-template-columns:1fr!important;
            gap: 2rem !important;
          }
          #contact-form-col{
            padding-top: 0 !important;
          }
          #form-name-email{
            grid-template-columns:1fr!important;
          }
        }
        @media(max-width:480px){
          #contact-section-root {
            padding-top: 3.5rem !important;
            padding-bottom: 5rem !important;
          }
          .contact-heading-title {
            font-size: clamp(2rem, 8vw, 2.5rem) !important;
          }
          .contact-info-cards-list {
            gap: 0.85rem !important;
          }
        }
      `}</style>
    </section>
  );
}
