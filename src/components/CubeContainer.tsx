'use client';
import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { useCube, TOTAL_FACES } from '@/lib/CubeContext';
import { useLanguage } from '@/lib/LanguageContext';
import CubeFacePreview from '@/components/CubeFacePreview';
import Starfield from '@/components/Starfield';
import PlanetDelonGuide from '@/components/PlanetDelonGuide';
import HologramCone3D from '@/components/HologramCone3D';
import { Box, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  faces: ReactNode[];
}

export default function CubeContainer({ faces }: Props) {
  const {
    current,
    staging,
    isAnimating,
    isExploding,
    isZoomingOut,
    viewMode,
    isOpen,
    goto,
    goNext,
    goPrev,
    openFace,
    closeToCube,
  } = useCube();
  const { lang } = useLanguage();

  const isStaticExpanded = viewMode === 'expanded' && !isAnimating && !isExploding && !isZoomingOut;

  useEffect(() => {
    if (!isStaticExpanded) {
      window.scrollTo(0, 0);
    }
  }, [isStaticExpanded]);

  /* ── 3D Cube Physics State (Inertia & Smooth Damping) ── */
  const [rotY, setRotY] = useState(-32);
  const [rotX, setRotX] = useState(-18);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);

  // Inertia refs
  const rotYRef = useRef(-32);
  const rotXRef = useRef(-18);
  const velXRef = useRef(0);
  const velYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const pointerStartPos = useRef({ x: 0, y: 0 });
  const lastPointerPos = useRef({ x: 0, y: 0, time: 0 });
  const animFrameRef = useRef<number | null>(null);
  const lastInteractionRef = useRef<number>(Date.now());

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

  /* ── Stop physics momentum when exploding ── */
  useEffect(() => {
    if (isExploding || viewMode === 'expanded') {
      velXRef.current = 0;
      velYRef.current = 0;
    }
  }, [isExploding, viewMode]);

  const cubeWrapperRef = useRef<HTMLDivElement>(null);

  const updateCubeTransform = useCallback((rx: number, ry: number) => {
    if (cubeWrapperRef.current && !isExploding) {
      cubeWrapperRef.current.style.transform = `translate3d(0, 0, -100px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  }, [isExploding]);

  useEffect(() => {
    if (viewMode === 'cube') {
      updateCubeTransform(rotXRef.current, rotYRef.current);
    }
  }, [viewMode, updateCubeTransform]);

  /* ── 60fps / 120fps Native GPU Physics & Inertia Engine in Cube Mode ── */
  useEffect(() => {
    let prevTime = performance.now();

    const physicsLoop = (time: number) => {
      const dt = Math.min(32, time - prevTime);
      prevTime = time;

      if (viewMode === 'cube' && !isExploding) {
        if (!isDraggingRef.current) {
          rotYRef.current += velXRef.current * (dt / 16);
          rotXRef.current += velYRef.current * (dt / 16);

          velXRef.current *= 0.92;
          velYRef.current *= 0.92;

          rotXRef.current = Math.max(-45, Math.min(35, rotXRef.current));

          // Continuous smooth auto-rotation
          if (
            Date.now() - lastInteractionRef.current > 1000 &&
            Math.abs(velXRef.current) < 0.05
          ) {
            rotYRef.current -= 0.18 * (dt / 16);
          }

          updateCubeTransform(rotXRef.current, rotYRef.current);
        }
      }

      animFrameRef.current = requestAnimationFrame(physicsLoop);
    };

    animFrameRef.current = requestAnimationFrame(physicsLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [viewMode, isExploding, updateCubeTransform]);

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

  /* ── Pointer Drag with Button Exclusion ── */
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input')) {
      return;
    }
    if (viewMode !== 'cube' || isExploding || isAnimating) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    velXRef.current = 0;
    velYRef.current = 0;
    lastInteractionRef.current = Date.now();
    pointerStartPos.current = { x: e.clientX, y: e.clientY };
    lastPointerPos.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || viewMode !== 'cube' || isExploding) return;
    const now = performance.now();
    const dt = Math.max(1, now - lastPointerPos.current.time);

    const deltaX = e.clientX - lastPointerPos.current.x;
    const deltaY = e.clientY - lastPointerPos.current.y;

    rotYRef.current += deltaX * 0.45;
    rotXRef.current = Math.max(-45, Math.min(35, rotXRef.current - deltaY * 0.3));

    updateCubeTransform(rotXRef.current, rotYRef.current);

    velXRef.current = (deltaX / dt) * 11;
    velYRef.current = (-deltaY / dt) * 9;

    lastInteractionRef.current = Date.now();
    lastPointerPos.current = { x: e.clientX, y: e.clientY, time: now };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    lastInteractionRef.current = Date.now();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe
    }
  };

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

      {/* ── 3D Scene Wrapper (Cube Mode: Solid Cube with 6 Faces) ── */}
      {viewMode === 'cube' && (
        <div
          id="cube-scene"
          className={`cube-scene scene-cube ${isZoomingOut ? 'cube-entering-orbit' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* ── 3D Stage positioning container (anchored to the right) ── */}
          <div className="cube-3d-stage">
            {/* ── Static Projector Base (stays flat on the ground) ── */}
            <div
              className="cube-ground-shadow"
              style={{
                transform: isExploding ? 'translateZ(-100px) translateY(500px) scale(3)' : 'translateZ(-100px) translateY(260px) rotateX(90deg)',
                opacity: isExploding ? 0 : 1,
                transition: 'opacity 0.5s ease, transform 0.8s ease',
              }}
            />
            <div
              className="hologram-projector"
              style={{
                transform: isExploding ? 'translateZ(-100px) translateY(800px) rotateX(90deg) scale(0.1)' : 'translateZ(-100px) translateY(260px) rotateX(90deg)',
                opacity: isExploding ? 0 : 1,
                transition: 'opacity 0.6s ease, transform 0.8s ease',
              }}
            />

            {/* ── Real-Time 3D Volumetric Hologram Cone (Hardware Additive Blending & 3D Perspective) ── */}
            <HologramCone3D
              rotXRef={rotXRef}
              rotYRef={rotYRef}
              isExploding={isExploding}
            />

            <div
              id="cube-wrapper"
              ref={cubeWrapperRef}
              className={`cube-object ${isExploding ? 'cube-shattered' : ''}`}
              style={{
                transform: `translate3d(0, 0, -100px) rotateX(${rotXRef.current}deg) rotateY(${rotYRef.current}deg)`,
                transition: isDragging
                  ? 'none'
                  : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >

              {/* ── 4 Lateral Faces: Shatter and vanish into outer space on click ── */}
              {faces.map((_, i) => {
                const isHovered = hoveredFace === i;

                // Physical dispersal vectors
                const shatterVectors = [
                  'rotateY(0deg) translateZ(1100px) translateY(-180px) rotateZ(-30deg) scale(0.15)',
                  'rotateY(90deg) translateZ(1100px) translateX(450px) rotateZ(35deg) scale(0.15)',
                  'rotateY(180deg) translateZ(1200px) translateY(180px) rotateX(40deg) scale(0.15)',
                  'rotateY(270deg) translateZ(1100px) translateX(-450px) rotateZ(-35deg) scale(0.15)',
                ];

                return (
                  <div
                    key={i}
                    id={`cube-face-wrapper-${i}`}
                    className={`cube-solid-face lateral-face face-idx-${i} ${
                      isHovered && !isExploding ? 'hovered-face' : ''
                    }`}
                    style={{
                      transform: isExploding
                        ? shatterVectors[i]
                        : `rotateY(${i * 90}deg) translateZ(var(--cube-half, 180px))`,
                      opacity: isExploding ? 0 : 1,
                      transition: isDragging
                        ? 'none'
                        : 'transform 1s cubic-bezier(0.16, 1, 0.25, 1), opacity 0.75s ease',
                    }}
                    onMouseEnter={() => setHoveredFace(i)}
                    onMouseLeave={() => setHoveredFace(null)}
                  >
                    <div className="cube-face-preview-container">
                      <CubeFacePreview faceIndex={i} />
                    </div>
                  </div>
                );
              })}

              {/* ── Top Cap (Shatters upward into cosmos) ── */}
              <div
                className="cube-solid-face cube-top-face"
                style={{
                  transform: isExploding
                    ? 'rotateX(90deg) translateZ(1100px) rotateZ(60deg) scale(0.15)'
                    : 'rotateX(90deg) translateZ(var(--cube-half, 180px))',
                  opacity: isExploding ? 0 : 1,
                  transition: 'transform 1s cubic-bezier(0.16, 1, 0.25, 1), opacity 0.75s ease',
                }}
              >
                <div className="top-face-decor">
                  <div className="top-face-grid" />
                  <div className="top-face-logo">
                    <span className="logo-gem">◆</span>
                    <span className="logo-initials">MD</span>
                  </div>
                  <span className="top-face-label">MARC DELON · PORTFOLIO</span>
                </div>
              </div>

              {/* ── Bottom Cap (Shatters downward) ── */}
              <div
                className="cube-solid-face cube-bottom-face"
                style={{
                  transform: isExploding
                    ? 'rotateX(-90deg) translateZ(1100px) rotateZ(-60deg) scale(0.15)'
                    : 'rotateX(-90deg) translateZ(var(--cube-half, 180px))',
                  opacity: isExploding ? 0 : 1,
                  transition: 'transform 1s cubic-bezier(0.16, 1, 0.25, 1), opacity 0.75s ease',
                }}
              />

            </div>
          </div>
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
            {faces.map((faceContent, idx) => (
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
                {faceContent}
              </div>
            ))}
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
            paddingBottom: 'calc(85px + env(safe-area-inset-bottom, 0px))',
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
