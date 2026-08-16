import { CubeProvider } from '@/lib/CubeContext';
import Navbar from '@/components/Navbar';
import CubeContainer from '@/components/CubeContainer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Preloader from '@/components/Preloader';

/* ── Face imports ─────────────────────────────────────────────── */
import Hero from '@/components/Hero';
import About from '@/components/About';
import Education from '@/components/Education';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import LanguageHobbies from '@/components/LanguageHobbies';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

/* ══════════════════════════════════════════════════════════════════
   FACE 1 — CV / À Propos  (cream, scrollable)
══════════════════════════════════════════════════════════════════ */
function ResumeFace() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ paddingTop: 'var(--navbar-h)' }}>
        <About />
        <div className="container" style={{ paddingBottom: '5rem' }}>
          {/* Separator */}
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--beige-dark),transparent)', margin: '0 0 0.5rem' }} />

          {/* Education + Skills */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem,5vw,5rem)' }} id="edu-skills">
            <Education />
            <Skills />
          </div>

          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--beige-dark),transparent)', margin: '0.5rem 0' }} />

          {/* Experience + Language */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem,5vw,5rem)' }} id="exp-lang">
            <Experience />
            <LanguageHobbies />
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){ #edu-skills,#exp-lang{grid-template-columns:1fr!important;} }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FACE 2 — Projets  (dark)
══════════════════════════════════════════════════════════════════ */
function ProjectsFace() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,var(--dark) 0%,var(--dark-mid) 100%)' }}>
      <div style={{ paddingTop: 'var(--navbar-h)' }}>
        <Projects />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FACE 3 — Contact  (cream → dark footer)
══════════════════════════════════════════════════════════════════ */
function ContactFace() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ paddingTop: 'var(--navbar-h)' }}>
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE ROOT
══════════════════════════════════════════════════════════════════ */
const FACES = [
  <Hero key="hero" />,
  <ResumeFace key="resume" />,
  <ProjectsFace key="projects" />,
  <ContactFace key="contact" />,
];

export default function Home() {
  return (
    <CubeProvider>
      {/* 6-Second Luxury Brand Preloader */}
      <Preloader />
      {/* Fixed overlay nav */}
      <Navbar />
      {/* 3D cube engine + nav dots */}
      <CubeContainer faces={FACES} />
      {/* Viewport Fixed WhatsApp Button (Only on Contact face) */}
      <WhatsAppButton />
    </CubeProvider>
  );
}
