'use client';
import { useState, useEffect, useLayoutEffect } from 'react';
import { getRequestedFace } from '@/lib/CubeContext';

export default function Preloader() {
  const [displayText, setDisplayText] = useState('');
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  // Skip the intro entirely when returning to a specific section (e.g. back from a project page)
  useLayoutEffect(() => {
    if (getRequestedFace() !== null) setShouldRender(false);
  }, []);

  // Global exit timer after animation cycles (~4.6s)
  useEffect(() => {
    const DURATION = 4600;

    const timer = setTimeout(() => {
      setLoadingComplete(true);
      setTimeout(() => {
        setShouldRender(false);
      }, 750);
    }, DURATION);

    return () => clearTimeout(timer);
  }, []);

  // Standard React typewriter loop (zero script tags, 100% React 19 & Next.js compliant)
  useEffect(() => {
    const name = 'Marc Delon';
    let index = 0;
    let isDeleting = false;
    let timerId: ReturnType<typeof setTimeout>;

    function tick() {
      if (!isDeleting) {
        index++;
        setDisplayText(name.substring(0, index));

        if (index >= name.length) {
          isDeleting = true;
          timerId = setTimeout(tick, 950);
          return;
        }
        timerId = setTimeout(tick, 115);
      } else {
        index--;
        setDisplayText(name.substring(0, index));

        if (index <= 0) {
          isDeleting = false;
          timerId = setTimeout(tick, 380);
          return;
        }
        timerId = setTimeout(tick, 60);
      }
    }

    timerId = setTimeout(tick, 60);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

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
        backgroundColor: '#0D0603',
        opacity: loadingComplete ? 0 : 1,
        transform: loadingComplete ? 'scale(1.03)' : 'scale(1)',
        filter: loadingComplete ? 'blur(10px)' : 'none',
        transition:
          'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), filter 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: loadingComplete ? 'none' : 'auto',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Bamileke pattern backdrop, slowly settling in */}
      <div className="preloader-pattern" aria-hidden="true" />
      {/* Warm dark veil + vignette so the pattern stays soft and the name readable */}
      <div className="preloader-veil" aria-hidden="true" />

      {/* Main typewriter container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100px',
        }}
      >
        <span
          style={{
            fontFamily: "'Candara', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: 'clamp(2.5rem, 6.8vw, 4.8rem)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#FFFFFF',
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.9), 0 0 28px rgba(224, 123, 31, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {displayText}
          <span
            style={{
              display: 'inline-block',
              width: '4px',
              height: '0.85em',
              backgroundColor: '#E07B1F',
              marginLeft: '6px',
              borderRadius: '2px',
              boxShadow: '0 0 14px #E07B1F, 0 0 25px rgba(224, 123, 31, 0.6)',
              animation: 'cursorBlink 0.65s infinite',
            }}
          />
        </span>
      </div>

      {/* Soft caption + progress line */}
      <div className="preloader-footer">
        <span className="preloader-caption">Portfolio · Full-Stack Developer</span>
        <span className="preloader-progress"><span /></span>
      </div>

      <style jsx>{`
        .preloader-pattern {
          position: absolute;
          inset: -4%;
          background: url('/bamileke.webp') center / cover no-repeat;
          animation: patternSettle 5.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .preloader-veil {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 50% 50%, rgba(13, 6, 3, 0.78) 0%, rgba(13, 6, 3, 0.9) 55%, rgba(8, 3, 1, 0.97) 100%),
            linear-gradient(rgba(60, 26, 6, 0.25), rgba(60, 26, 6, 0.25));
        }
        .preloader-footer {
          position: absolute;
          left: 50%;
          bottom: 12vh;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          z-index: 10;
          animation: softFadeUp 1s 0.4s ease both;
        }
        .preloader-caption {
          font-family: 'Candara', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 0.78rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(245, 222, 190, 0.6);
          white-space: nowrap;
        }
        .preloader-progress {
          width: min(180px, 40vw);
          height: 2px;
          border-radius: 2px;
          background: rgba(245, 222, 190, 0.12);
          overflow: hidden;
        }
        .preloader-progress span {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, rgba(224, 123, 31, 0.4), #e07b1f);
          transform-origin: left;
          animation: progressFill 4.4s cubic-bezier(0.45, 0, 0.25, 1) forwards;
        }
        @keyframes patternSettle {
          from { transform: scale(1.08); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes softFadeUp {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes progressFill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .preloader-pattern, .preloader-footer, .preloader-progress span { animation: none; }
        }
        @keyframes cursorBlink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
