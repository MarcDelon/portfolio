'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#140A02',
      color: '#FFFFFF',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px',
      textAlign: 'center',
    }}>
      <h2 style={{ fontSize: '2rem', color: '#E07B1F', marginBottom: '16px' }}>Une erreur est survenue</h2>
      <p style={{ color: '#A09080', maxWidth: '450px', marginBottom: '24px' }}>
        Une interruption inattendue s'est produite lors du chargement de la vue.
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
        Réessayer
      </button>
    </div>
  );
}
