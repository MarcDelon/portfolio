'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useCube } from '@/lib/CubeContext';
import OrbitNav from '@/components/OrbitNav';
import Starfield from '@/components/Starfield';
import PlanetDelonGuide from '@/components/PlanetDelonGuide';

interface Props {
  faces: ReactNode[];
}

export default function CubeContainer({ faces }: Props) {
  const {
    current,
    isAnimating,
    isExploding,
    isZoomingOut,
    viewMode,
    isOpen,
    goNext,
    goPrev,
  } = useCube();

  const isStaticExpanded = viewMode === 'expanded' && !isAnimating && !isExploding && !isZoomingOut;

  useEffect(() => {
    if (!isStaticExpanded) {
      window.scrollTo(0, 0);
    }
  }, [isStaticExpanded]);

  /* ── Interactive Background Cursor Parallax State ── */
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, rawX: 0, rawY: 0 });

  /* ── 3D Room Continuous Transition Angle ── */
  const [roomAngle, setRoomAngle] = useState(current * -90);
  const prevCurrentRef = useRef(current);

  useEffect(() => {
    if (isExploding) {
      // Direct warp zoom into the chosen face without any detour to Accueil
      setRoomAngle(current * -90);
      prevCurrentRef.current = current;
      return;
    }

    if (viewMode === 'expanded') {
      const fromAngle = prevCurrentRef.current * -90;
      const toAngle = current * -90;
      prevCurrentRef.current = current;

      if (isAnimating) {
        setRoomAngle(fromAngle);
        const raf = requestAnimationFrame(() => {
          setRoomAngle(toAngle);
        });
        return () => cancelAnimationFrame(raf);
      } else {
        setRoomAngle(toAngle);
      }
    }
  }, [current, isAnimating, isExploding, viewMode]);

  /* ── Mouse tracking for background parallax (active only in 3D Cube overview) ── */
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (viewMode !== 'cube') return;
      const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normalizedY = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({
        x: normalizedX,
        y: normalizedY,
        rawX: e.clientX,
        rawY: e.clientY,
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [viewMode]);

  /* ── In expanded mode, scrolling is standard within each page without boundary auto-transitions ── */

  /* ── Keyboard navigation in expanded mode ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isAnimating) return;
      if (viewMode === 'expanded') {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goPrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewMode, isAnimating, goNext, goPrev]);

  return (
    <div className={`cube-root-viewport mode-${viewMode} ${isExploding ? 'is-exploding' : ''} ${isStaticExpanded ? 'is-static-expanded' : ''}`}>
      {/* ── Dynamic Parallax Galaxy & Background Texture with Warp Zoom ── */}
      <div className={`cube-ambient-bg ${isExploding ? 'galaxy-warp-zoom' : ''}`}>
        {/* Animated Galaxy Starfield with Hyperdrive Warp Flight */}
        <Starfield warpSpeed={isExploding} />

        {/* Cursor interactive spotlight glow */}
        <div
          className="cursor-spotlight-glow"
          style={{
            transform: `translate(${mousePos.rawX - 250}px, ${mousePos.rawY - 250}px)`,
          }}
        />

        {/* Ambient floating glows */}
        <div
          className="ambient-glow glow-1"
          style={{
            transform: `translate(calc(-50% + ${mousePos.x * 55}px), ${mousePos.y * 40}px)`,
          }}
        />
        <div
          className="ambient-glow glow-2"
          style={{
            transform: `translate(${mousePos.x * -65}px, ${mousePos.y * -50}px)`,
          }}
        />

        {/* Dynamic Grid Floor */}
        <div
          className="ambient-grid-floor"
          style={{
            transform: `translate(${mousePos.x * -35}px, ${mousePos.y * -35}px) scale(${isExploding ? 2.5 : 1.1})`,
            opacity: isExploding ? 0 : 0.4,
            transition: 'opacity 0.7s ease',
            backgroundPosition: `${mousePos.x * -25}px ${mousePos.y * -25}px`,
          }}
        />
      </div>

      {/* ── Orbite MD overview: photo planet + section satellites ── */}
      {viewMode === 'cube' && (
        <div id="orbit-scene" className="orbit-scene">
          <OrbitNav />
        </div>
      )}

      {/* ── 3D Cubic Rotation During Transition OR Zoom In / Zoom Out ── */}
      {(isExploding || isZoomingOut || (viewMode === 'expanded' && isAnimating)) && (
        <div
          className={`expanded-cube-viewport ${isExploding ? 'portal-zooming-in' : ''} ${isZoomingOut ? 'portal-zooming-out' : ''} is-cube-rotating`}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            perspective: '1300px',
            perspectiveOrigin: '50% 50%',
            overflow: 'hidden',
            pointerEvents: 'none',
            overscrollBehavior: 'none',
          }}
        >
          <div
            className="expanded-cube-room"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100vw',
              height: '100vh',
              transformStyle: 'preserve-3d',
              transform: `translateZ(-50vw) rotateY(${roomAngle}deg)`,
              transition: isExploding
                ? 'none'
                : 'transform 0.95s cubic-bezier(0.2, 0.85, 0.25, 1)',
              overscrollBehavior: 'none',
            }}
          >
            {faces.map((faceContent, idx) => {
              // During 3D transition, render the departure face and target face to prevent mounting duplicate instances
              const isRelevantFace = idx === current || idx === prevCurrentRef.current;
              return (
                <div
                  key={idx}
                  className="expanded-face-panel"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100vw',
                    height: '100vh',
                    transform: `rotateY(${idx * 90}deg) translateZ(50vw)`,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    overflow: 'hidden',
                    boxShadow: '0 0 50px rgba(0, 0, 0, 0.85), inset 0 0 0 1.5px rgba(224, 123, 31, 0.3)',
                  }}
                >
                  {isRelevantFace ? faceContent : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Native 2D Full-Screen Active Document When Static (100% Native Scroll & Clicks) ── */}
      {isStaticExpanded && (
        <div
          id={`cube-face-${current}`}
          className={`expanded-active-document face-panel-${current}`}
          style={{
            position: 'relative',
            zIndex: 100,
            width: '100%',
            minHeight: '100dvh',
            overflowX: 'hidden',
            pointerEvents: 'auto',
            background: current === 1 ? 'var(--cream)' : 'var(--dark)',
          }}
        >
          {faces[current]}
        </div>
      )}

      {/* ── Planet Delon Interactive Virtual Guide (Avatar Companion) ── */}
      <PlanetDelonGuide />
    </div>
  );
}
