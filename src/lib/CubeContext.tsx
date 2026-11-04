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

/* ── Return-to-section handoff (e.g. /projects/[slug] → home "projects" face) ──
   Client-side navigation to "/#projects" may not expose the hash when the cube
   mounts, so detail pages also drop a sessionStorage flag before navigating. */
export const RETURN_KEY = 'cube-return-face';

const SECTION_FACES: Record<string, number> = {
  home: 0, accueil: 0,
  about: 1, cv: 1, 'a-propos': 1,
  projects: 2, projets: 2,
  contact: 3,
};

export function markReturnSection(section: string) {
  try { sessionStorage.setItem(RETURN_KEY, section); } catch {}
}

/** Face index requested by the URL hash or a pending return flag, or null. */
export function getRequestedFace(consume = false): number | null {
  if (typeof window === 'undefined') return null;
  let section: string | null = null;
  try {
    section = sessionStorage.getItem(RETURN_KEY);
    if (consume) sessionStorage.removeItem(RETURN_KEY);
  } catch {}
  if (!section) section = window.location.hash.slice(1).toLowerCase();
  const face = SECTION_FACES[section];
  return face === undefined ? null : face;
}

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
      const face = getRequestedFace(true);
      if (face === null) return;
      setCurrent(face);
      setPrevious(face);
      setViewMode('expanded');
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
      previous,
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
