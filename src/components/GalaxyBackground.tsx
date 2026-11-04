'use client';
import { useMemo } from 'react';

interface GalaxyBackgroundProps {
  opacity?: number;
  speedMultiplier?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Generate deterministic pseudo-random star field box-shadows using your palette
function generateStarsShadow(count: number, colorWeights: { color: string; weight: number }[], seedOffset: number) {
  const shadows: string[] = [];
  let s = seedOffset;

  const pseudoRandom = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const totalWeight = colorWeights.reduce((acc, c) => acc + c.weight, 0);

  const pickColor = () => {
    let r = pseudoRandom() * totalWeight;
    for (const item of colorWeights) {
      if (r < item.weight) return item.color;
      r -= item.weight;
    }
    return colorWeights[0].color;
  };

  for (let i = 0; i < count; i++) {
    const x = Math.floor(pseudoRandom() * 2000);
    const y = Math.floor(pseudoRandom() * 2000);
    const color = pickColor();
    shadows.push(`${x}px ${y}px ${color}`);
  }

  return shadows.join(', ');
}

export default function GalaxyBackground({
  opacity = 1,
  speedMultiplier = 1,
  className = '',
  style,
}: GalaxyBackgroundProps) {
  // Brand color palette for stars
  const palette = useMemo(
    () => [
      { color: '#ffffff', weight: 4 },           // Pure white
      { color: 'rgba(255, 255, 255, 0.75)', weight: 3 }, // Soft white
      { color: '#F5A040', weight: 3 },           // Amber light
      { color: '#E07B1F', weight: 4 },           // Brand Amber
      { color: '#ffd29d', weight: 2 },           // Warm cream
      { color: 'rgba(224, 123, 31, 0.6)', weight: 2 }, // Glowing amber dust
    ],
    []
  );

  const stars1 = useMemo(() => generateStarsShadow(500, palette, 1024), [palette]);
  const stars2 = useMemo(() => generateStarsShadow(180, palette, 4096), [palette]);
  const stars3 = useMemo(() => generateStarsShadow(75, palette, 8192), [palette]);

  const duration1 = 50 / speedMultiplier;
  const duration2 = 100 / speedMultiplier;
  const duration3 = 150 / speedMultiplier;

  return (
    <div
      className={`uiverse-galaxy-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity,
        zIndex: 0,
        // Brand galactic background: warm deep cosmic void to rich dark amber-card
        background: 'radial-gradient(ellipse at bottom, #271507 0%, #140A02 65%, #090401 100%)',
        ...style,
      }}
    >
      {/* Layer 1: Small stars (1px) */}
      <div className="galaxy-layer stars-1" />

      {/* Layer 2: Medium stars (2px) */}
      <div className="galaxy-layer stars-2" />

      {/* Layer 3: Large glowing stars (3px) */}
      <div className="galaxy-layer stars-3" />

      <style jsx>{`
        .uiverse-galaxy-container {
          user-select: none;
        }

        .galaxy-layer {
          position: absolute;
          top: 0;
          left: 0;
          background: transparent;
          border-radius: 50%;
        }

        .stars-1 {
          width: 1px;
          height: 1px;
          box-shadow: ${stars1};
          animation: animStar ${duration1}s linear infinite;
        }

        .stars-1::after {
          content: ' ';
          position: absolute;
          top: 2000px;
          left: 0;
          width: 1px;
          height: 1px;
          background: transparent;
          border-radius: 50%;
          box-shadow: ${stars1};
        }

        .stars-2 {
          width: 2px;
          height: 2px;
          box-shadow: ${stars2};
          animation: animStar ${duration2}s linear infinite;
        }

        .stars-2::after {
          content: ' ';
          position: absolute;
          top: 2000px;
          left: 0;
          width: 2px;
          height: 2px;
          background: transparent;
          border-radius: 50%;
          box-shadow: ${stars2};
        }

        .stars-3 {
          width: 3px;
          height: 3px;
          box-shadow: ${stars3};
          animation: animStar ${duration3}s linear infinite;
        }

        .stars-3::after {
          content: ' ';
          position: absolute;
          top: 2000px;
          left: 0;
          width: 3px;
          height: 3px;
          background: transparent;
          border-radius: 50%;
          box-shadow: ${stars3};
        }

        @keyframes animStar {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-2000px);
          }
        }
      `}</style>
    </div>
  );
}
