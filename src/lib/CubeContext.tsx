'use client';
import {
  createContext, useContext, useState,
  useCallback, useRef, type ReactNode, useEffect,
} from 'react';

export const TOTAL_FACES = 4;

export type ViewMode = 'cube' | 'expanded';

export interface CubeCtxType {
  current:          number;
  previous:         number;
  staging:          number | null;
  direction:        'fwd' | 'bwd';
  isAnimating:      boolean;
  isExploding:      boolean;
  isZoomingOut:     boolean;
  viewMode:         ViewMode;
  isOpen:           boolean;
  goto:             (n: number) => void;
  goNext:           () => void;
  goPrev:           () => void;
  openFace:         (n: number) => void;
  closeToCube:      () => void;
  toggleViewMode:   () => void;
}

export const CubeContext = createContext<CubeCtxType>({
  current: 0,
  previous: 0,
  staging: null,
  direction: 'fwd',
  isAnimating: false,
  isExploding: false,
  isZoomingOut: false,
  viewMode: 'cube',
  isOpen: false,
  goto: () => {},
  goNext: () => {},
  goPrev: () => {},
  openFace: () => {},
  closeToCube: () => {},
  toggleViewMode: () => {},
});

export const useCube = () => useContext(CubeContext);

export function CubeProvider({ children }: { children: ReactNode }) {
  const [current,      setCurrent]      = useState(0);
  const [previous,     setPrevious]     = useState(0);
  const [staging,      setStaging]      = useState<number | null>(null);
  const [direction,    setDirection]    = useState<'fwd' | 'bwd'>('fwd');
  const [isAnimating,  setIsAnimating]  = useState(false);
  const [isExploding,  setIsExploding]  = useState(false);
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const [viewMode,     setViewMode]     = useState<ViewMode>('cube');

  const lockRef  = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Detect URL hash on mount / navigation (e.g. returning from /projects/[slug] via /#projects) ── */
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#projects' || hash === '#projets') {
        setCurrent(2);
        setPrevious(2);
        setViewMode('expanded');
      } else if (hash === '#about' || hash === '#cv' || hash === '#a-propos') {
        setCurrent(1);
        setPrevious(1);
        setViewMode('expanded');
      } else if (hash === '#contact') {
        setCurrent(3);
        setPrevious(3);
        setViewMode('expanded');
      } else if (hash === '#home' || hash === '#accueil') {
        setCurrent(0);
        setPrevious(0);
        setViewMode('expanded');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  /* ── Instant page change with immediate 3D cubic rotation ── */
  const goto = useCallback((n: number) => {
    if (lockRef.current) return;
    if (n === current || n < 0 || n >= TOTAL_FACES) return;

    lockRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);

    setDirection(n > current ? 'fwd' : 'bwd');
    setPrevious(current);
    setCurrent(n);
    setStaging(null);
    setIsAnimating(true);

    timerRef.current = setTimeout(() => {
      setIsAnimating(false);
      lockRef.current = false;
    }, 950);
  }, [current]);

  const goNext = useCallback(() => {
    if (current < TOTAL_FACES - 1) goto(current + 1);
  }, [current, goto]);

  const goPrev = useCallback(() => {
    if (current > 0) goto(current - 1);
  }, [current, goto]);

  const openFace = useCallback((n: number) => {
    if (lockRef.current) return;
    lockRef.current = true;
    
    // Set active face and trigger instant warp zoom
    setPrevious(n);
    setCurrent(n);
    setStaging(null);
    setIsAnimating(true);
    setIsExploding(true);

    setTimeout(() => {
      setViewMode('expanded');
      setIsExploding(false);
      setIsAnimating(false);
      lockRef.current = false;
    }, 1200);
  }, []);

  const closeToCube = useCallback(() => {
    if (lockRef.current) return;
    lockRef.current = true;
    
    // Switch to cube immediately so the 3D cube is visible and zooms in over the full duration
    setViewMode('cube');
    setIsAnimating(true);
    setIsZoomingOut(true);
    setIsExploding(false);

    setTimeout(() => {
      setIsZoomingOut(false);
      setIsAnimating(false);
      lockRef.current = false;
    }, 1400);
  }, []);

  const toggleViewMode = useCallback(() => {
    if (viewMode === 'cube') {
      openFace(current);
    } else {
      closeToCube();
    }
  }, [viewMode, current, openFace, closeToCube]);

  // Keyboard shortcut: Escape to return to cube
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewMode === 'expanded') {
        closeToCube();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewMode, closeToCube]);

  return (
    <CubeContext.Provider value={{
      current,
      staging,
      direction,
      isAnimating,
      isExploding,
      isZoomingOut,
      viewMode,
      isOpen: viewMode === 'expanded',
      goto,
      goNext,
      goPrev,
      openFace,
      closeToCube,
      toggleViewMode,
    }}>
      {children}
    </CubeContext.Provider>
  );
}
