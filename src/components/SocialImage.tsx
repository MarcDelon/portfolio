'use client';
import { useState, useRef, useEffect } from 'react';
import Image, { type ImageProps } from 'next/image';

export interface SocialImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  shimmerColor?: 'dark' | 'amber' | 'cream';
  onImageLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onImageError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export default function SocialImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  quality = 80,
  priority,
  preload,
  loading,
  className = '',
  style,
  wrapperClassName = '',
  wrapperStyle,
  shimmerColor = 'dark',
  onImageLoad,
  onImageError,
  ...restProps
}: SocialImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Check if image is already cached in browser memory upon mounting
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onImageLoad) onImageLoad(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onImageError) onImageError(e);
  };

  // Next.js 16 deprecates priority in favor of preload, support both safely
  const shouldPreload = preload ?? priority ?? false;

  return (
    <div
      className={`social-img-wrapper ${wrapperClassName}`}
      style={{
        position: fill ? 'absolute' : 'relative',
        inset: fill ? 0 : undefined,
        width: fill ? '100%' : (width ? `${width}px` : '100%'),
        height: fill ? '100%' : (height ? `${height}px` : '100%'),
        overflow: 'hidden',
        display: fill ? 'block' : 'inline-block',
        ...wrapperStyle,
      }}
    >
      {/* ── Luxury Social Shimmer Skeleton (active while image is fetching) ── */}
      {!isLoaded && !hasError && (
        <div
          className={`social-img-shimmer shimmer-theme-${shimmerColor}`}
          aria-hidden="true"
        />
      )}

      {/* ── High-Performance Next.js Image with Blur-Up Reveal ── */}
      {!hasError ? (
        <Image
          ref={imgRef}
          src={src}
          alt={alt || ''}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes || (fill ? '100vw' : undefined)}
          quality={quality}
          preload={shouldPreload}
          loading={shouldPreload ? undefined : (loading || 'lazy')}
          onLoad={handleLoad}
          onError={handleError}
          className={`social-core-img ${isLoaded ? 'is-ready' : 'is-loading'} ${className}`}
          style={{
            ...style,
            // Ensure transitions are buttery smooth without layout shift
            willChange: isLoaded ? 'auto' : 'filter, opacity, transform',
          }}
          {...restProps}
        />
      ) : (
        /* Fallback icon in case of broken link */
        <div className="social-img-fallback">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(224,123,31,0.5)" strokeWidth="1.5">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
        </div>
      )}

      <style jsx>{`
        .social-img-wrapper {
          user-select: none;
        }

        .social-img-shimmer {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          animation: socialShimmerSweep 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .shimmer-theme-dark {
          background: linear-gradient(
            90deg,
            rgba(20, 10, 5, 0.95) 0%,
            rgba(45, 25, 12, 0.85) 35%,
            rgba(224, 123, 31, 0.18) 50%,
            rgba(45, 25, 12, 0.85) 65%,
            rgba(20, 10, 5, 0.95) 100%
          );
          background-size: 250% 100%;
        }

        .shimmer-theme-amber {
          background: linear-gradient(
            90deg,
            rgba(35, 18, 8, 0.8) 0%,
            rgba(224, 123, 31, 0.25) 50%,
            rgba(35, 18, 8, 0.8) 100%
          );
          background-size: 250% 100%;
        }

        .shimmer-theme-cream {
          background: linear-gradient(
            90deg,
            rgba(240, 235, 226, 0.9) 0%,
            rgba(224, 123, 31, 0.15) 50%,
            rgba(240, 235, 226, 0.9) 100%
          );
          background-size: 250% 100%;
        }

        @keyframes socialShimmerSweep {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        :global(.social-core-img) {
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        :global(.social-core-img.is-loading) {
          opacity: 0 !important;
          filter: blur(14px) scale(1.03) !important;
        }

        :global(.social-core-img.is-ready) {
          opacity: 1 !important;
          filter: blur(0px) scale(1) !important;
        }

        .social-img-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(20, 10, 5, 0.6);
          border: 1px dashed rgba(224, 123, 31, 0.3);
        }
      `}</style>
    </div>
  );
}
