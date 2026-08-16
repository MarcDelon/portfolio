import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#140A02',
};

export const metadata: Metadata = {
  title: 'NZENANG TCHOUANTCHEU MARC DELON — Portfolio Full-Stack Developer',
  description:
    'Portfolio de MARC DELON NZENANG TCHOUANTCHEU, étudiant en Bachelor 3 Génie Logiciel à KEYCE Cameroun. Développeur Full-Stack React JS, Node.js, Next.js.',
  keywords: ['portfolio', 'développeur', 'react', 'nodejs', 'nextjs', 'cameroun', 'marc delon', 'KEYCE', 'génie logiciel'],
  authors: [{ name: 'NZENANG TCHOUANTCHEU MARC DELON' }],
  icons: {
    icon: '/MD.jpg',
    shortcut: '/MD.jpg',
    apple: '/MD.jpg',
  },
  openGraph: {
    title: 'Marc Delon — Portfolio Full-Stack Developer',
    description: 'Développeur Full-Stack React JS, Node.js et Next.js basé à Douala, Cameroun.',
    type: 'website',
    images: ['/MD.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/MD.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/MD.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/MD.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
