'use client';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import { useCube } from '@/lib/CubeContext';
import { 
  Laptop, 
  User, 
  Code2, 
  Mail, 
  ArrowUpRight, 
  MapPin 
} from 'lucide-react';

interface FacePreviewProps {
  faceIndex: number;
}

export default function CubeFacePreview({ faceIndex }: FacePreviewProps) {
  const { lang } = useLanguage();
  const { openFace } = useCube();

  const handleOpen = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
    openFace(faceIndex);
  };

  switch (faceIndex) {
    /* ── Face 0 : Accueil / Home ── */
    case 0:
      return (
        <div className="cube-square-face galactic-panel">
          {/* Header */}
          <div className="cube-face-topbar">
            <span className="face-indicator-chip">
              <span className="chip-dot" /> {lang === 'fr' ? 'ACCUEIL' : 'HOME'}
            </span>
            <span className="face-icon-pill">
              <Laptop size={13} />
            </span>
          </div>

          {/* Center */}
          <div className="cube-face-center">
            <div className="cube-hero-avatar">
              <div className="avatar-ring-glow" />
              <Image
                src="/photo.png"
                alt="Marc Delon"
                width={76}
                height={76}
                className="avatar-img"
              />
            </div>

            <h3 className="face-main-name">Marc Delon</h3>
            <p className="face-main-sub">
              <Laptop size={13} className="text-amber" />
              {lang === 'fr' ? 'Développeur Full-Stack' : 'Full-Stack Developer'}
            </p>
            <p className="face-snippet">
              {lang === 'fr'
                ? 'Concepteur d’expériences web modernes & architectures logicielles.'
                : 'Crafting modern web experiences & software architectures.'}
            </p>
          </div>

          {/* Galactic Button */}
          <button 
            type="button" 
            className="galactic-action-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleOpen}
          >
            <span className="btn-glow-layer" />
            <span className="btn-text">{lang === 'fr' ? 'Ouvrir l’Accueil' : 'Open Home'}</span>
            <ArrowUpRight size={15} className="btn-arrow" />
          </button>
        </div>
      );

    /* ── Face 1 : À Propos & CV ── */
    case 1:
      return (
        <div className="cube-square-face galactic-panel">
          <div className="cube-face-topbar">
            <span className="face-indicator-chip">
              <span className="chip-dot" /> {lang === 'fr' ? 'À PROPOS & CV' : 'ABOUT & RESUME'}
            </span>
            <span className="face-icon-pill">
              <User size={13} />
            </span>
          </div>

          <div className="cube-face-center">
            <h3 className="face-section-title">
              {lang === 'fr' ? 'À Propos & CV' : 'About & Resume'}
            </h3>

            <div className="cube-stats-row">
              <div className="stat-pill-box">
                <span className="stat-pill-val">8+</span>
                <span className="stat-pill-tag">{lang === 'fr' ? 'Projets' : 'Projects'}</span>
              </div>
              <div className="stat-pill-box">
                <span className="stat-pill-val">B3</span>
                <span className="stat-pill-tag">KEYCE</span>
              </div>
              <div className="stat-pill-box">
                <span className="stat-pill-val">3m</span>
                <span className="stat-pill-tag">{lang === 'fr' ? 'Stage' : 'Intern'}</span>
              </div>
            </div>

            <div className="cube-skills-grid" style={{ maxWidth: '95%', gap: '4px' }}>
              {['Java', 'SpringBoot', 'PHP', 'Laravel', 'C', 'C++', 'C#', 'React', 'Next.js', 'Node.js'].map((s) => (
                <span key={s} className="skill-mini-tag" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>{s}</span>
              ))}
            </div>
          </div>

          <button 
            type="button" 
            className="galactic-action-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleOpen}
          >
            <span className="btn-glow-layer" />
            <span className="btn-text">{lang === 'fr' ? 'À Propos & CV' : 'About & Resume'}</span>
            <ArrowUpRight size={15} className="btn-arrow" />
          </button>
        </div>
      );

    /* ── Face 2 : Projets / Confiance ── */
    case 2:
      return (
        <div className="cube-square-face galactic-panel">
          <div className="cube-face-topbar">
            <span className="face-indicator-chip">
              <span className="chip-dot" /> {lang === 'fr' ? 'PROJETS' : 'PROJECTS'}
            </span>
            <span className="face-icon-pill">
              <Code2 size={13} />
            </span>
          </div>

          <div className="cube-face-center">
            <h3 className="face-section-title" style={{ fontSize: '1rem', marginBottom: '0.6rem' }}>
              {lang === 'fr' ? 'Ils nous ont fait confiance' : 'They Trusted Us'}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', width: '100%' }}>
              {/* Partner 1: Legacy Groupe */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '6px 10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(223, 203, 175, 0.25)',
                borderRadius: '10px',
                textAlign: 'left',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '7px',
                  background: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '3px', flexShrink: 0,
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/image projet/legacy/logo.png" alt="Legacy Groupe" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#ffffff' }}>Legacy Groupe</div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(245, 160, 64, 0.9)' }}>
                    {lang === 'fr' ? 'Espace Coworking' : 'Coworking Space'}
                  </div>
                </div>
              </div>

              {/* Partner 2: Égalité pour Tous */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '6px 10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(223, 203, 175, 0.25)',
                borderRadius: '10px',
                textAlign: 'left',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '7px',
                  background: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '3px', flexShrink: 0,
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/image projet/job day/logo.jpg" alt="Égalité pour Tous" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#ffffff' }}>Égalité pour Tous</div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(245, 160, 64, 0.9)' }}>
                    {lang === 'fr' ? "Journée de l'Emploi" : 'Job Fair & Employment'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            className="galactic-action-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleOpen}
          >
            <span className="btn-glow-layer" />
            <span className="btn-text">{lang === 'fr' ? 'Voir les Projets' : 'View Projects'}</span>
            <ArrowUpRight size={15} className="btn-arrow" />
          </button>
        </div>
      );

    /* ── Face 3 : Contact ── */
    case 3:
      return (
        <div className="cube-square-face galactic-panel">
          <div className="cube-face-topbar">
            <span className="face-indicator-chip">
              <span className="chip-dot" /> CONTACT
            </span>
            <span className="face-icon-pill">
              <Mail size={13} />
            </span>
          </div>

          <div className="cube-face-center">
            <h3 className="face-section-title">
              {lang === 'fr' ? 'Transmission Directe' : 'Direct Signal'}
            </h3>
            
            <div className="cube-contact-box">
              <div className="contact-item-row">
                <MapPin size={13} className="text-amber" />
                <span>Douala, Cameroun</span>
              </div>
              <div className="contact-item-row">
                <Mail size={13} className="text-amber" />
                <span className="contact-email">marcnzenang@gmail.com</span>
              </div>
            </div>
            
            <p className="contact-subtext">
              {lang === 'fr'
                ? 'Disponible pour opportunités et nouveaux défis.'
                : 'Open for freelance, internship and full-time roles.'}
            </p>
          </div>

          <button 
            type="button" 
            className="galactic-action-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleOpen}
          >
            <span className="btn-glow-layer" />
            <span className="btn-text">{lang === 'fr' ? 'Écrire un Message' : 'Send Message'}</span>
            <ArrowUpRight size={15} className="btn-arrow" />
          </button>
        </div>
      );

    default:
      return null;
  }
}
