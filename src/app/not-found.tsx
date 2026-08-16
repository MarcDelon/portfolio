import Link from 'next/link';

export default function NotFound() {
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
      <h1 style={{ fontSize: '4rem', margin: 0, color: '#E07B1F', fontWeight: 800 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginTop: '10px', marginBottom: '20px' }}>Page introuvable</h2>
      <p style={{ color: '#A09080', maxWidth: '400px', marginBottom: '30px' }}>
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 24px',
          backgroundColor: '#E07B1F',
          color: '#FFFFFF',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          transition: 'opacity 0.2s',
        }}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
