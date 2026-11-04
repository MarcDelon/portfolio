'use client';

export default function RipplePortalBackground() {
  const items = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div
      className="uiverse-ripple-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: '1200px',
      }}
    >
      <div className="ripple-rings-stage">
        {items.map((i) => (
          <div
            key={i}
            className="ripple-item"
            style={{ ['--i' as any]: i }}
          />
        ))}
      </div>

      <style jsx>{`
        /* From Uiverse.io by NlghtM4re adapted to large warm Amber & Gold portal */
        .uiverse-ripple-container {
          user-select: none;
        }

        .ripple-rings-stage {
          position: absolute;
          top: 36%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          transform-style: preserve-3d;
        }

        .ripple-item {
          position: absolute;
          background-color: transparent;
          /* Substantially enlarged to spread broadly behind PORTFOLIO */
          width: calc(var(--i) * 6.5vmin);
          aspect-ratio: 1;
          border-radius: 50%;
          /* Amber luminous border */
          border: 0.8vmin solid rgba(224, 123, 31, 0.72);
          transform-style: preserve-3d;
          transform: rotateX(70deg) translateZ(50px);
          animation: my-move 3.2s ease-in-out calc(var(--i) * 0.08s) infinite;
          box-shadow:
            0px 0px 22px rgba(224, 123, 31, 0.48),
            inset 0px 0px 22px rgba(224, 123, 31, 0.28);
        }

        @keyframes my-move {
          0%,
          100% {
            transform: rotateX(70deg) translateZ(50px) translateY(0px);
            filter: hue-rotate(0deg);
          }

          50% {
            transform: rotateX(70deg) translateZ(50px) translateY(-60vmin);
            /* Soft warm hue variation staying in harmony with amber & gold */
            filter: hue-rotate(35deg) brightness(1.25);
          }
        }

        @media (max-width: 900px) {
          .ripple-rings-stage {
            top: 40%;
          }
          .ripple-item {
            width: calc(var(--i) * 8.5vmin);
            border-width: 0.75vmin;
          }
        }
      `}</style>
    </div>
  );
}
