'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#140A02',
        color: '#FFFFFF',
        fontFamily: 'system-ui, sans-serif',
        margin: 0,
        padding: '20px',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '2rem', color: '#E07B1F', marginBottom: '16px' }}>Erreur globale</h2>
        <p style={{ color: '#A09080', maxWidth: '450px', marginBottom: '24px' }}>
          Une erreur critique est survenue.
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#E07B1F',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Recharger l'application
        </button>
      </body>
    </html>
  );
}
