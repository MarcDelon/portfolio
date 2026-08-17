'use client';
import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useCube } from '@/lib/CubeContext';
import Image from 'next/image';
import { Sparkles, Compass, X, ChevronRight, MessageSquare, Laptop, GraduationCap, User } from 'lucide-react';

export default function PlanetDelonGuide() {
  const { lang } = useLanguage();
  const { viewMode, openFace, isExploding, isZoomingOut } = useCube();
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'welcome' | 'faces'>('welcome');

  // Only show when in 3D Orbit view and not during transition
  if (viewMode !== 'cube' || isExploding || isZoomingOut) {
    return null;
  }

  const facesInfo = [
    {
      id: 0,
      icon: User,
      title: lang === 'fr' ? '01 · Accueil & Vision' : '01 · Home & Vision',
      desc: lang === 'fr' 
        ? 'Qui je suis, mon profil d\'ingénieur logiciel et ma vision technologique.'
        : 'Who I am, my software engineering profile and tech vision.',
      badge: lang === 'fr' ? 'Présentation' : 'Profile',
      color: '#e07b1f',
    },
    {
      id: 1,
      icon: GraduationCap,
      title: lang === 'fr' ? '02 · Parcours & Compétences' : '02 · Education & Skills',
      desc: lang === 'fr'
        ? 'Mes formations, certifications (CCNA...), diplômes et technologies maîtresses.'
        : 'My degrees, certifications (CCNA...), education and core tech stack.',
      badge: lang === 'fr' ? 'Expertise' : 'Skills',
      color: '#dfcbaf',
    },
    {
      id: 2,
      icon: Laptop,
      title: lang === 'fr' ? '03 · Salle des Projets 3D' : '03 · 3D Projects Corridor',
      desc: lang === 'fr'
        ? 'Plongez dans le couloir 3D immersif de mes réalisations avec démos live.'
        : 'Dive into the immersive 3D corridor of my work with live demos.',
      badge: lang === 'fr' ? 'Réalisations' : 'Portfolio',
      color: '#4A7C59',
    },
    {
      id: 3,
      icon: MessageSquare,
      title: lang === 'fr' ? '04 · Contact & Échanges' : '04 · Contact & Connect',
      desc: lang === 'fr'
        ? 'Formulaire direct vers ma boîte mail et accès WhatsApp instantané.'
        : 'Direct email form to my inbox and instant WhatsApp connection.',
      badge: lang === 'fr' ? 'Disponible' : 'Available',
      color: '#25D366',
    },
  ];

  return (
    <aside
      id="planet-delon-companion"
      aria-label={lang === 'fr' ? 'Guide de la Planète Delon' : 'Planet Delon Guide'}
      style={{
        position: 'fixed',
        bottom: 'clamp(18px, 3.5vw, 32px)',
        left: 'clamp(16px, 3.5vw, 32px)',
        zIndex: 500,
        maxWidth: 'min(400px, calc(100vw - 32px))',
        pointerEvents: 'auto',
        fontFamily: 'var(--font-sans)',
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* ── Minimized Floating Avatar Trigger ── */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="planet-guide-pill-btn"
          aria-label={lang === 'fr' ? 'Ouvrir le guide' : 'Open guide'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(22, 11, 6, 0.94)',
            border: '1.5px solid rgba(224, 123, 31, 0.45)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 24px rgba(224, 123, 31, 0.25)',
            borderRadius: '9999px',
            padding: '6px 18px 6px 6px',
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ position: 'relative', width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--amber)' }}>
            <Image
              src="/avatar.png"
              alt="Marc Delon Avatar"
              fill
              sizes="42px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Planète Delon</span>
              <Sparkles size={13} color="var(--amber)" />
            </span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.65)' }}>
              {lang === 'fr' ? 'Ouvrir le guide' : 'Open guide'}
            </span>
          </div>
        </button>
      ) : (
        /* ── Full Interactive Dialog Card ── */
        <div
          className="planet-guide-card"
          style={{
            background: 'linear-gradient(145deg, rgba(28, 14, 7, 0.96) 0%, rgba(14, 7, 3, 0.98) 100%)',
            border: '1.5px solid rgba(224, 123, 31, 0.35)',
            borderRadius: '22px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 35px rgba(224, 123, 31, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '1.15rem',
            color: '#ffffff',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Top Decorative Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(224, 123, 31, 0.35) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Header Row: Avatar + Greeting + Minimize/Close */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '0.85rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(223, 203, 175, 0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Glowing Avatar Portrait */}
              <div
                style={{
                  position: 'relative',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  padding: '2px',
                  background: 'linear-gradient(135deg, var(--amber) 0%, #b4570d 100%)',
                  boxShadow: '0 0 16px rgba(224, 123, 31, 0.4)',
                  flexShrink: 0,
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                  <Image
                    src="/avatar.png"
                    alt="Marc Delon 3D Avatar"
                    fill
                    sizes="48px"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
                {/* Online pulse indicator */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    background: '#25D366',
                    border: '2px solid #1c0e05',
                    boxShadow: '0 0 8px #25D366',
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--amber)' }}>
                    {lang === 'fr' ? 'Guide Virtuel' : 'Virtual Guide'}
                  </span>
                  <Sparkles size={11} color="var(--amber)" />
                </div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>
                  Marc Delon
                </h4>
              </div>
            </div>

            {/* Minimize button */}
            <button
              onClick={() => setIsMinimized(true)}
              aria-label={lang === 'fr' ? 'Réduire le guide' : 'Minimize guide'}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(224, 123, 31, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '0.85rem', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '10px' }}>
            <button
              onClick={() => setActiveTab('welcome')}
              style={{
                flex: 1,
                padding: '5px 8px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'welcome' ? 'rgba(224, 123, 31, 0.25)' : 'transparent',
                color: activeTab === 'welcome' ? 'var(--amber)' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s ease',
              }}
            >
              {lang === 'fr' ? '👋 Bienvenue' : '👋 Welcome'}
            </button>
            <button
              onClick={() => setActiveTab('faces')}
              style={{
                flex: 1,
                padding: '5px 8px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'faces' ? 'rgba(224, 123, 31, 0.25)' : 'transparent',
                color: activeTab === 'faces' ? 'var(--amber)' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s ease',
              }}
            >
              {lang === 'fr' ? '🪐 Les 4 Faces' : '🪐 The 4 Faces'}
            </button>
          </div>

          {/* Tab 1: Welcome Speech Bubble */}
          {activeTab === 'welcome' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(223, 203, 175, 0.15)',
                  borderRadius: '14px',
                  padding: '0.75rem 0.9rem',
                  fontSize: '0.82rem',
                  lineHeight: 1.55,
                  color: 'rgba(255, 255, 255, 0.88)',
                  marginBottom: '0.75rem',
                }}
              >
                <p style={{ margin: '0 0 0.4rem 0', fontWeight: 800, color: '#ffffff', fontSize: '0.88rem' }}>
                  {lang === 'fr'
                    ? '« Bienvenue sur la Planète Delon ! »'
                    : '"Welcome to Planet Delon!"'}
                </p>
                <p style={{ margin: '0 0 0.4rem 0' }}>
                  {lang === 'fr'
                    ? 'Vous êtes en orbite 3D autour de mon cube de compétences. Chaque face représente un chapitre de mon parcours.'
                    : 'You are in 3D orbit around my skill cube. Each face represents a chapter of my journey.'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--amber)', fontSize: '0.76rem', fontWeight: 700 }}>
                  <Compass size={13} />
                  <span>
                    {lang === 'fr'
                      ? 'Faites glisser pour tourner • Cliquez pour explorer'
                      : 'Drag to rotate • Click to explore'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setActiveTab('faces')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: 'var(--amber)',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(224, 123, 31, 0.35)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--amber-light)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--amber)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>{lang === 'fr' ? 'Découvrir les 4 pages' : 'Explore the 4 pages'}</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => openFace(0)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {lang === 'fr' ? 'Entrer' : 'Enter'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: The 4 Faces Quick Guide & Instant Warp Jump */}
          {activeTab === 'faces' && (
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto', paddingRight: '2px' }}>
              {facesInfo.map((face) => {
                const IconComponent = face.icon;
                return (
                  <button
                    key={face.id}
                    onClick={() => openFace(face.id)}
                    className="planet-guide-face-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 9px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.22s ease',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(224, 123, 31, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(224, 123, 31, 0.4)';
                      e.currentTarget.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '7px',
                        background: 'rgba(224, 123, 31, 0.15)',
                        border: '1px solid rgba(224, 123, 31, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: face.color,
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent size={14} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff' }}>
                          {face.title}
                        </span>
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: face.color }}>
                          {face.badge}
                        </span>
                      </div>
                      <p style={{ margin: '1px 0 0 0', fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {face.desc}
                      </p>
                    </div>

                    <ChevronRight size={13} color="rgba(255, 255, 255, 0.4)" style={{ flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
