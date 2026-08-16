'use client';
import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useCube } from '@/lib/CubeContext';

export default function WhatsAppButton() {
  const { lang } = useLanguage();
  const { current, viewMode } = useCube();
  const [isHovered, setIsHovered] = useState(false);

  // Only display when user is active on the Contact page
  if (current !== 3 || viewMode !== 'expanded') {
    return null;
  }

  const phoneNumber = '237655462642';
  const defaultMessage = lang === 'fr' 
    ? 'Bonjour Marc, j\'ai vu votre portfolio et j\'aimerais échanger avec vous !' 
    : 'Hello Marc, I saw your portfolio and would love to connect with you!';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div
      id="global-whatsapp-floating-btn"
      style={{
        position: 'fixed',
        bottom: 'clamp(16px, 3.5vw, 28px)',
        right: 'clamp(16px, 3.5vw, 28px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        pointerEvents: 'auto',
        animation: 'fadeInUp 0.4s ease',
      }}
    >
      {/* Floating Tooltip Bubble */}
      <div
        style={{
          background: 'rgba(22, 11, 6, 0.95)',
          color: '#ffffff',
          border: '1px solid rgba(223, 203, 175, 0.35)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '9999px',
          padding: '8px 16px',
          fontSize: '0.8125rem',
          fontWeight: 600,
          letterSpacing: '0.02em',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <span style={{ color: '#25D366', marginRight: '6px' }}>●</span>
        {lang === 'fr' ? 'Discuter sur WhatsApp' : 'Chat on WhatsApp'}
      </div>

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: 'clamp(48px, 12vw, 56px)',
          height: 'clamp(48px, 12vw, 56px)',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: isHovered
            ? '0 12px 32px rgba(37, 211, 102, 0.6), 0 0 20px rgba(37, 211, 102, 0.4)'
            : '0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(37, 211, 102, 0.35)',
          transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          textDecoration: 'none',
          position: 'relative',
        }}
      >
        {/* Radar Pulse Effect */}
        <span
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            border: '2px solid rgba(37, 211, 102, 0.6)',
            animation: 'pulseRing 2.4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
            pointerEvents: 'none',
          }}
        />

        {/* WhatsApp Vector SVG */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.8 11.64c-.26-.13-1.56-.77-1.8-.86-.24-.09-.42-.13-.6.13-.17.26-.68.86-.84 1.03-.15.17-.31.19-.58.06-.26-.13-1.12-.41-2.13-1.31-.79-.7-1.32-1.57-1.47-1.83-.16-.26-.02-.41.11-.54.12-.12.26-.31.39-.47.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.07-.13-.6-1.45-.82-1.99-.22-.53-.44-.45-.6-.46-.16-.01-.34-.01-.52-.01-.17 0-.46.07-.7.32-.24.26-.93.91-.93 2.22s.95 2.58 1.08 2.76c.13.17 1.88 2.87 4.55 4.02.64.27 1.13.44 1.52.56.64.2 1.22.17 1.68.1.51-.08 1.56-.64 1.78-1.25.22-.61.22-1.14.15-1.25-.06-.11-.23-.18-.49-.31z" />
        </svg>
      </a>
    </div>
  );
}
