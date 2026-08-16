'use client';
import { useState, useEffect } from 'react';

export default function Preloader() {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(120);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const [progress, setProgress] = useState(0);

  const fullText = 'Marc Delon...';

  // 6 seconds total loading timer
  useEffect(() => {
    const startTime = Date.now();
    const duration = 6000; // 6 seconds

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(currentProgress);

      if (elapsed >= duration) {
        clearInterval(progressInterval);
        setLoadingComplete(true);
        // Remove from DOM after smooth fade-out
        setTimeout(() => {
          setShouldRender(false);
        }, 900);
      }
    }, 30);

    return () => clearInterval(progressInterval);
  }, []);

  // Typewriter effect (writing and deleting "Marc Delon...")
  useEffect(() => {
    if (loadingComplete) return;

    let timer: NodeJS.Timeout;

    const handleTyping = () => {
      setDisplayText((prev) => {
        if (!isDeleting) {
          // Writing mode
          const nextText = fullText.substring(0, prev.length + 1);
          if (nextText === fullText) {
            // Reached full text: pause then start deleting
            setTypingSpeed(900);
            setIsDeleting(true);
          } else {
            setTypingSpeed(110);
          }
          return nextText;
        } else {
          // Deleting mode
          const nextText = fullText.substring(0, prev.length - 1);
          if (nextText === '') {
            // Emptied: pause then restart writing
            setIsDeleting(false);
            setLoopNum((l) => l + 1);
            setTypingSpeed(400);
          } else {
            setTypingSpeed(60);
          }
          return nextText;
        }
      });
    };

    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, typingSpeed, loadingComplete, loopNum]);

  if (!shouldRender) return null;

  return (
    <div
      id="site-preloader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#140A02',
        opacity: loadingComplete ? 0 : 1,
        transform: loadingComplete ? 'scale(1.04)' : 'scale(1)',
        filter: loadingComplete ? 'blur(12px)' : 'none',
        transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: loadingComplete ? 'none' : 'auto',
        overflow: 'hidden',
      }}
    >
      {/* ── Layer 1: Bamileke Heritage Background Artwork ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/bamileke.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.38,
          zIndex: 1,
          filter: 'contrast(1.15) brightness(0.9)',
        }}
      />

      {/* ── Layer 2: Dark Brown Luxury Transparent Overlay ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(38, 19, 7, 0.85) 0%, rgba(18, 9, 3, 0.96) 75%, rgba(12, 5, 2, 0.99) 100%)',
          zIndex: 2,
        }}
      />

      {/* ── Layer 3: Subtle Amber Glow in Center ── */}
      <div
        style={{
          position: 'absolute',
          width: 'min(400px, 80vw)',
          height: 'min(400px, 80vw)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224, 123, 31, 0.18) 0%, rgba(224, 123, 31, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: 3,
          pointerEvents: 'none',
          animation: 'preloaderPulse 3s ease-in-out infinite',
        }}
      />

      {/* ── Layer 4: Main Content (Typewriter Text) ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.75rem',
          padding: '2rem',
        }}
      >
        {/* Brand Diamond Emblem */}
        <div
          style={{
            color: 'var(--amber)',
            fontSize: '1.5rem',
            animation: 'float 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 12px rgba(224, 123, 31, 0.6))',
          }}
        >
          ◆
        </div>

        {/* Typewriter Name Text in White Serif */}
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.25rem, 6.5vw, 4.2rem)',
            fontWeight: 900,
            fontStyle: 'italic',
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            minHeight: '1.2em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 255, 255, 0.15)',
          }}
        >
          <span>{displayText}</span>
          {/* Animated Blinking Cursor */}
          <span
            style={{
              display: 'inline-block',
              width: '3px',
              height: '0.85em',
              backgroundColor: 'var(--amber)',
              marginLeft: '4px',
              borderRadius: '2px',
              animation: 'blink 0.75s infinite',
              boxShadow: '0 0 10px var(--amber)',
            }}
          />
        </div>

        {/* Fine Amber Progress Bar */}
        <div
          style={{
            width: 'min(220px, 60vw)',
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginTop: '0.5rem',
            border: '1px solid rgba(224, 123, 31, 0.2)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #E07B1F 0%, #FFD0A0 100%)',
              borderRadius: '9999px',
              boxShadow: '0 0 8px rgba(224, 123, 31, 0.8)',
              transition: 'width 0.05s linear',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes preloaderPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
