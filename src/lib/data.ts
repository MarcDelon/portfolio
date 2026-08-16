export type Language = 'fr' | 'en';

// ─── Translations ────────────────────────────────────────────────────────────

export const translations = {
  fr: {
    nav: {
      about: 'À Propos',
      skills: 'Compétences',
      projects: 'Projets',
      experience: 'Expérience',
      education: 'Formation',
      contact: 'Contact',
      cta: 'Travaillons ensemble',
    },
    hero: {
      greeting: 'Bonjour, je suis',
      role: 'Développeur Full-Stack',
      subtitle: 'Étudiant passionné en Génie Logiciel · Bachelor 3 · KEYCE, Cameroun',
      description:
        'Je conçois des expériences web modernes, performantes et élégantes avec React, Node.js et Next.js.',
      cta1: 'Voir mes projets',
      cta2: 'Me contacter',
      roles: ['Développeur React JS', 'Développeur Node.js', 'Développeur Next.js', 'Génie Logiciel'],
    },
    about: {
      label: 'À Propos',
      title: 'Passionné par le code\net l\'innovation',
      description:
        'Je suis NZENANG TCHOUANTCHEU MARC DELON, étudiant en Bachelor 3 Génie Logiciel à KEYCE Informatique, Cameroun. Passionné par l\'écosystème web & mobile full-stack, je conçois des solutions modernes alliant haute performance et design soigné. Mon parcours s\'enrichit de stages professionnels formateurs, de projets de toutes envergures, de collaborations fructueuses avec plus de 3 entreprises qui m\'ont fait confiance, ainsi que du lancement de ma startup de développement web & mobile Nova Dev.',
      stats: [
        { value: '8+', label: 'Projets Réalisés' },
        { value: '3', label: 'Mois de Stage' },
        { value: '2', label: 'Langues Parlées' },
        { value: '5+', label: 'Technologies Maîtrisées' },
      ],
      location: 'Douala, Cameroun 🇨🇲',
      available: 'Disponible pour des opportunités',
      downloadCV: 'Télécharger le CV',
    },
    skills: {
      label: 'Compétences',
      title: 'Mes Expertises\nTechniques',
      subtitle:
        'Un ensemble de compétences soigneusement développées à travers des projets concrets et des formations rigoureuses.',
    },
    projects: {
      label: 'Projets 3D · Portfolio',
      title: 'Mes Réalisations',
      subtitle:
        'Une immersion dans mes projets phares : explorez chaque salle 3D pour découvrir les défis relevés, les architectures et les technologies déployées.',
      filters: { all: 'Tous', web: 'Web & Fullstack', stage: 'Stage & Média' },
      details: 'Explorer le projet',
      close: 'Fermer',
      tech: 'Stack & Technologies',
      year: 'Année',
      category: 'Catégorie',
      scrollPrompt: 'Faites défiler pour traverser les salles',
      roomBadge: 'SALLE 3D',
      keyHighlights: 'Points Clés & Métriques',
    },
    experience: {
      label: 'Expérience',
      title: 'Mon Parcours\nProfessionnel',
      subtitle:
        'Des expériences concrètes qui ont forgé ma vision et mes compétences en développement logiciel.',
    },
    education: {
      label: 'Formation',
      title: 'Mon Parcours\nAcadémique',
      subtitle:
        'Un cursus rigoureux alliant théorie et pratique pour maîtriser l\'ingénierie logicielle moderne.',
      current: 'En cours',
    },
    contact: {
      label: 'Contact',
      title: 'Travaillons\nEnsemble',
      subtitle:
        'Une idée de projet, une opportunité ou juste envie d\'échanger ? Je réponds rapidement et avec enthousiasme.',
      info: {
        email: { label: 'Email', value: 'marcnzenang@gmail.com' },
        phone: { label: 'Téléphone', value: '+237 655 46 26 42' },
        location: { label: 'Localisation', value: 'Douala, Cameroun' },
      },
      form: {
        name: 'Nom complet',
        namePlaceholder: 'Jean Dupont',
        email: 'Adresse email',
        emailPlaceholder: 'jean@email.com',
        subject: 'Sujet',
        subjectPlaceholder: 'Proposition de projet, stage...',
        message: 'Message',
        messagePlaceholder: 'Décrivez votre projet ou votre demande en détail...',
        send: 'Envoyer le message',
        sending: 'Envoi en cours...',
        success: 'Message envoyé avec succès ! Je vous répondrai très vite.',
        error: 'Une erreur est survenue. Veuillez réessayer.',
      },
    },
    footer: {
      tagline: 'Développeur Full-Stack passionné basé à Douala, Cameroun.',
      rights: 'Tous droits réservés.',
      builtWith: 'Conçu avec Next.js & TypeScript',
    },
  },

  en: {
    nav: {
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      experience: 'Experience',
      education: 'Education',
      contact: 'Contact',
      cta: "Let's Work Together",
    },
    hero: {
      greeting: "Hello, I'm",
      role: 'Full-Stack Developer',
      subtitle: 'Passionate Software Engineering Student · Bachelor 3 · KEYCE, Cameroon',
      description:
        'I design modern, high-performance and elegant web experiences with React, Node.js and Next.js.',
      cta1: 'View my projects',
      cta2: 'Contact me',
      roles: ['React JS Developer', 'Node.js Developer', 'Next.js Developer', 'Software Engineer'],
    },
    about: {
      label: 'About',
      title: 'Passionate about code\nand innovation',
      description:
        'I am NZENANG TCHOUANTCHEU MARC DELON, a Bachelor 3 Software Engineering student at KEYCE Informatique, Cameroon. Passionate about full-stack web & mobile development, I create modern applications combining high performance and sleek aesthetics. My journey includes valuable professional internships, multi-scale projects, fruitful collaborations with more than 3 companies that trusted my expertise, and the founding of my web & mobile development startup Nova Dev.',
      stats: [
        { value: '8+', label: 'Projects Completed' },
        { value: '3', label: 'Months Internship' },
        { value: '2', label: 'Languages Spoken' },
        { value: '5+', label: 'Technologies Mastered' },
      ],
      location: 'Douala, Cameroon',
      available: 'Available for opportunities',
      downloadCV: 'Download CV',
    },
    skills: {
      label: 'Skills',
      title: 'My Technical\nExpertise',
      subtitle:
        'A set of skills carefully developed through real-world projects and rigorous training.',
    },
    projects: {
      label: '3D Projects · Showcase',
      title: 'My Work',
      subtitle:
        'An immersive journey through my key projects: step into each 3D room to discover the challenges solved, architectures and technologies built.',
      filters: { all: 'All', web: 'Web & Fullstack', stage: 'Internship & Media' },
      details: 'Explore project',
      close: 'Close',
      tech: 'Stack & Technologies',
      year: 'Year',
      category: 'Category',
      scrollPrompt: 'Scroll to travel through the 3D rooms',
      roomBadge: '3D ROOM',
      keyHighlights: 'Key Highlights & Metrics',
    },
    experience: {
      label: 'Experience',
      title: 'My Professional\nJourney',
      subtitle:
        'Concrete experiences that have shaped my vision and skills in software development.',
    },
    education: {
      label: 'Education',
      title: 'My Academic\nJourney',
      subtitle:
        'A rigorous curriculum combining theory and practice to master modern software engineering.',
      current: 'In progress',
    },
    contact: {
      label: 'Contact',
      title: "Let's Work\nTogether",
      subtitle:
        'A project idea, an opportunity or just want to chat? I respond quickly and with enthusiasm.',
      info: {
        email: { label: 'Email', value: 'marcnzenang@gmail.com' },
        phone: { label: 'Phone', value: '+237 655 46 26 42' },
        location: { label: 'Location', value: 'Douala, Cameroon' },
      },
      form: {
        name: 'Full name',
        namePlaceholder: 'John Doe',
        email: 'Email address',
        emailPlaceholder: 'john@email.com',
        subject: 'Subject',
        subjectPlaceholder: 'Project proposal, internship...',
        message: 'Message',
        messagePlaceholder: 'Describe your project or request in detail...',
        send: 'Send message',
        sending: 'Sending...',
        success: 'Message sent successfully! I will reply very soon.',
        error: 'An error occurred. Please try again.',
      },
    },
    footer: {
      tagline: 'Passionate Full-Stack Developer based in Douala, Cameroon.',
      rights: 'All rights reserved.',
      builtWith: 'Built with Next.js & TypeScript',
    },
  },
} as const;

// ─── Projects ────────────────────────────────────────────────────────────────

export interface Project {
  id: number;
  slug: string;
  title: string;
  displayTitle: string;
  tagline?: { fr: string; en: string };
  description: { fr: string; en: string };
  longDescription: { fr: string; en: string };
  tech: string[];
  category: 'web' | 'desktop' | 'stage';
  year: string;
  featured: boolean;
  gradient: string;
  icon: string;
  logo: string;
  images: string[];
  liveUrl?: string;
  roomTheme: {
    roofTop: string;
    ceiling: string;
    wallLeft: string;
    wallRight: string;
    back: string;
    floor: string;
    accent: string;
    accentGlow: string;
    textColor: string;
    roomNumber: string;
    subLabel: string;
  };
  metrics?: { label: { fr: string; en: string }; value: string }[];
}

export const projects: Project[] = [
  {
    id: 1,
    slug: 'vano-chat',
    title: 'Vano Chat',
    displayTitle: 'VANO CHAT',
    tagline: {
      fr: 'Réseau social immersif & Messagerie temps réel WebSockets',
      en: 'Immersive Social Network & Real-time WebSockets Messaging',
    },
    description: {
      fr: 'Réseau social complet avec messagerie instantanée temps réel, profils et fil d\'actualités.',
      en: 'Complete social network with real-time messaging, profiles and news feed.',
    },
    longDescription: {
      fr: 'Vano Chat est une plateforme de réseau social développée avec React JS et Node JS. Elle offre une messagerie instantanée en temps réel via WebSockets, la gestion de profils utilisateurs personnalisés, un système d\'amis, un fil d\'actualités dynamique et une authentification sécurisée avec JWT.',
      en: 'Vano Chat is a social network platform developed with React JS and Node JS. It offers real-time instant messaging via WebSockets, personalized user profile management, a friends system, a dynamic news feed and secure JWT authentication.',
    },
    tech: ['React JS', 'Node JS', 'Express', 'MongoDB', 'Socket.io', 'JWT'],
    category: 'web',
    year: '2025',
    featured: true,
    gradient: 'linear-gradient(135deg, #2b170e 0%, #dfcbaf 100%)',
    icon: '💬',
    logo: '/image projet/nova/logo.png',
    images: [
      '/image projet/nova/nova accueil.png',
      '/image projet/nova/nova messagerie.png',
      '/image projet/nova/nova.png',
    ],
    liveUrl: 'https://nova-chat-drab.vercel.app',
    roomTheme: {
      roofTop: '#180e08',
      ceiling: '#dfcbaf',
      wallLeft: '#381c0e',
      wallRight: '#381c0e',
      back: '#120905',
      floor: '#2a140a',
      accent: '#f5ede3',
      accentGlow: 'rgba(224, 123, 31, 0.35)',
      textColor: '#ffffff',
      roomNumber: 'ROOM // 01',
      subLabel: 'WebSockets · 2025',
    },
    metrics: [
      { label: { fr: 'Latence Messagerie', en: 'Chat Latency' }, value: '< 20ms' },
      { label: { fr: 'Architecture', en: 'Architecture' }, value: 'Full-Stack' },
      { label: { fr: 'Sécurité', en: 'Security' }, value: 'JWT / Auth' },
    ],
  },
  {
    id: 2,
    slug: 'e-commerce',
    title: 'E-Commerce Vêtements',
    displayTitle: 'E-COMMERCE',
    tagline: {
      fr: 'Boutique de Mode Haute Performance avec Paiement Intégré',
      en: 'High-Performance Fashion Store with Integrated Payments',
    },
    description: {
      fr: 'Boutique e-commerce moderne avec catalogue complet, panier dynamique et paiement sécurisé.',
      en: 'Modern e-commerce shop with catalog, cart and order management.',
    },
    longDescription: {
      fr: 'Plateforme e-commerce complète pour la vente de vêtements. Catalogue produits avec filtres avancés, panier d\'achat persistant, système de paiement sécurisé, espace client avec historique de commandes et un tableau de bord administrateur pour la gestion des stocks et ventes.',
      en: 'Complete e-commerce platform for clothing sales. Product catalog with advanced filters, persistent shopping cart, secure payment system, customer area with order history and an admin dashboard for inventory and sales management.',
    },
    tech: ['React JS', 'Node JS', 'Express', 'MongoDB', 'Stripe'],
    category: 'web',
    year: '2025',
    featured: true,
    gradient: 'linear-gradient(135deg, #3d1e10 0%, #e8dac8 100%)',
    icon: '🛍️',
    logo: '/image projet/jada/logo.png',
    images: [
      '/image projet/jada/jada.png',
      '/image projet/jada/jada2.png',
      '/image projet/jada/jada3.png',
      '/image projet/jada/jada 4.png',
    ],
    liveUrl: 'https://ja-da.vercel.app',
    roomTheme: {
      roofTop: '#2a140a',
      ceiling: '#e8dac8',
      wallLeft: '#442211',
      wallRight: '#442211',
      back: '#150a06',
      floor: '#200f08',
      accent: '#ffffff',
      accentGlow: 'rgba(245, 160, 64, 0.35)',
      textColor: '#ffffff',
      roomNumber: 'ROOM // 02',
      subLabel: 'E-Shop · Stripe',
    },
    metrics: [
      { label: { fr: 'Gestion Panier', en: 'Cart Management' }, value: 'Temps Réel' },
      { label: { fr: 'Paiements', en: 'Payments' }, value: 'Stripe API' },
      { label: { fr: 'Catalogue', en: 'Catalog' }, value: 'Multi-Filtres' },
    ],
  },
  {
    id: 3,
    slug: 'legacy-work',
    title: 'Legacy Workspace',
    displayTitle: 'LEGACY WORK',
    tagline: {
      fr: 'Plateforme B2B de réservation et location d\'espaces professionnels',
      en: 'B2B Professional Workspace Booking & Rental Platform',
    },
    description: {
      fr: 'Plateforme de réservation et location d\'espaces de travail professionnels pour l\'entreprise Legacy.',
      en: 'Professional workspace rental platform for the Legacy company.',
    },
    longDescription: {
      fr: 'Application web professionnelle développée pour l\'entreprise Legacy permettant la location d\'espaces de travail. Recherche et filtrage d\'espaces par localisation/capacité, système de réservation en ligne, paiement intégré, gestion des disponibilités en temps réel et tableau de bord entreprise complet. Développée avec React JS et Next.js pour des performances optimales.',
      en: 'Professional web application developed for the Legacy company allowing workspace rental. Space search and filtering by location/capacity, online booking system, integrated payment, real-time availability management and complete company dashboard. Built with React JS and Next.js for optimal performance.',
    },
    tech: ['React JS', 'Next.js', 'Node JS', 'PostgreSQL', 'Stripe'],
    category: 'web',
    year: '2025',
    featured: true,
    gradient: 'linear-gradient(135deg, #2b140a 0%, #f3e7d8 100%)',
    icon: '🏢',
    logo: '/image projet/legacy/logo.png',
    images: [
      '/image projet/legacy/legacy accueille.png',
      '/image projet/legacy/legacy nos esapces.png',
      '/image projet/legacy/legacy nos espaces 2.png',
      '/image projet/legacy/legacy nos espaces 3.png',
      '/image projet/legacy/legacy nos services.png',
      '/image projet/legacy/legacy reserver.png',
      '/image projet/legacy/legacy tarif.png',
      '/image projet/legacy/legacy compte.png',
      '/image projet/legacy/legacy contact.png',
      '/image projet/legacy/legacy avis.png',
    ],
    liveUrl: 'https://group-legacy.com',
    roomTheme: {
      roofTop: '#200f08',
      ceiling: '#f3e7d8',
      wallLeft: '#34190c',
      wallRight: '#34190c',
      back: '#100704',
      floor: '#30160b',
      accent: '#e07b1f',
      accentGlow: 'rgba(224, 123, 31, 0.45)',
      textColor: '#ffffff',
      roomNumber: 'ROOM // 03',
      subLabel: 'Next.js · B2B App',
    },
    metrics: [
      { label: { fr: 'Stack Moderne', en: 'Modern Stack' }, value: 'Next.js App' },
      { label: { fr: 'Base Données', en: 'Database' }, value: 'PostgreSQL' },
      { label: { fr: 'Disponibilités', en: 'Availability' }, value: 'Live Calendar' },
    ],
  },
  {
    id: 4,
    slug: 'eventpass',
    title: 'Eventpass',
    displayTitle: 'EVENTPASS',
    tagline: {
      fr: 'Billetterie Événementielle & Validation Instantanée par QR Code',
      en: 'Event Ticketing & Instant QR Code Ticket Validation',
    },
    description: {
      fr: 'Système de billetterie événementielle et contrôle d\'accès sécurisé par QR Code.',
      en: 'Event ticketing system and secure QR Code access control.',
    },
    longDescription: {
      fr: 'Application complète de billetterie événementielle Eventpass. Création de billets personnalisés avec QR codes uniques et sécurisés, système de validation instantanée à l\'entrée, gestion de la liste des participants, statistiques d\'affluence et export PDF des billets. Interface organisateur complète.',
      en: 'Complete Eventpass ticketing application. Creation of personalized tickets with unique and secure QR codes, instant entry validation system, participant list management, attendance statistics and PDF export of tickets. Full organizer interface.',
    },
    tech: ['React JS', 'Node JS', 'QR Code API', 'PDF.js', 'MongoDB'],
    category: 'web',
    year: '2025',
    featured: false,
    gradient: 'linear-gradient(135deg, #38190d 0%, #d8c4ab 100%)',
    icon: '🎟️',
    logo: '/image projet/billeterie/logo.png',
    images: [
      '/image projet/billeterie/billeterie.png',
      '/image projet/billeterie/billeterie 2.png',
      '/image projet/billeterie/billeterie 3.png',
      '/image projet/billeterie/billeterie 4.png',
    ],
    liveUrl: 'https://eventpass-ruddy.vercel.app',
    roomTheme: {
      roofTop: '#30160b',
      ceiling: '#d8c4ab',
      wallLeft: '#4a2514',
      wallRight: '#4a2514',
      back: '#130805',
      floor: '#241109',
      accent: '#ffffff',
      accentGlow: 'rgba(255, 255, 255, 0.35)',
      textColor: '#ffffff',
      roomNumber: 'ROOM // 04',
      subLabel: 'QR Code · Event App',
    },
    metrics: [
      { label: { fr: 'Génération PDF', en: 'PDF Generation' }, value: 'Automatisée' },
      { label: { fr: 'Scan & Contrôle', en: 'Scan & Control' }, value: 'QR Unique' },
      { label: { fr: 'Vérification', en: 'Verification' }, value: '100% Instant' },
    ],
  },
  {
    id: 5,
    slug: 'job-day',
    title: "Journée de l'Emploi",
    displayTitle: 'JOB DAY',
    tagline: {
      fr: 'Site Événementiel Médiatisé à l\'échelle Nationale (TV & Radio Balafon)',
      en: 'Nationally Media-Covered Event Website (Balafon TV & Radio)',
    },
    description: {
      fr: 'Site web événementiel professionnel avec inscriptions en ligne, médiatisé à la TV & radio Balafon.',
      en: 'Event website for Job Day — covered by Balafon TV and radio.',
    },
    longDescription: {
      fr: 'Site web événementiel professionnel réalisé lors de mon stage chez l\'organisation Egalité pour Tous. Le projet présentait l\'événement "Journée de l\'emploi", permettait l\'inscription des participants, affichait le programme complet et les informations pratiques. Ce projet a bénéficié d\'une couverture médiatique nationale sur la chaîne de télévision et radio Balafon — une fierté majeure de mon parcours.',
      en: 'Professional event website created during my internship at the organization Egalité pour Tous. The project presented the "Job Day" event, allowed participant registration, displayed the full schedule and practical information. This project received national media coverage on the Balafon TV and radio channel — a major pride of my journey.',
    },
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP'],
    category: 'stage',
    year: '2025',
    featured: true,
    gradient: 'linear-gradient(135deg, #2a1107 0%, #faeedd 100%)',
    icon: '📺',
    logo: '/image projet/job day/logo.jpg',
    images: [
      '/image projet/job day/job day accueil.png',
      '/image projet/job day/job day.png',
      '/image projet/job day/job day 2.png',
      '/image projet/job day/job day 3.png',
    ],
    liveUrl: 'https://journees-emploi-formation-f98x.vercel.app',
    roomTheme: {
      roofTop: '#241109',
      ceiling: '#faeedd',
      wallLeft: '#36180c',
      wallRight: '#36180c',
      back: '#0d0503',
      floor: '#1a0b06',
      accent: '#ea8524',
      accentGlow: 'rgba(234, 133, 36, 0.45)',
      textColor: '#ffffff',
      roomNumber: 'ROOM // 05',
      subLabel: 'TV Balafon · 2025',
    },
    metrics: [
      { label: { fr: 'Médiatisation', en: 'Media Coverage' }, value: 'Balafon TV' },
      { label: { fr: 'Inscriptions', en: 'Registrations' }, value: 'En Ligne' },
      { label: { fr: 'Cadre', en: 'Context' }, value: 'Stage Pro' },
    ],
  },
];

// ─── Skills ──────────────────────────────────────────────────────────────────

export interface SkillGroup {
  category: { fr: string; en: string };
  icon: string;
  color: string;
  skills: { name: string; level: number }[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: { fr: 'Frontend', en: 'Frontend' },
    icon: '🎨',
    color: '#8B6347',
    skills: [
      { name: 'React JS', level: 85 },
      { name: 'Next.js', level: 75 },
      { name: 'HTML / CSS', level: 90 },
      { name: 'JavaScript', level: 82 },
    ],
  },
  {
    category: { fr: 'Backend', en: 'Backend' },
    icon: '⚙️',
    color: '#5C3D2E',
    skills: [
      { name: 'Node.js', level: 80 },
      { name: 'PHP', level: 70 },
      { name: 'Java', level: 60 },
      { name: 'Express.js', level: 78 },
    ],
  },
  {
    category: { fr: 'Bases de Données', en: 'Databases' },
    icon: '🗄️',
    color: '#7A5438',
    skills: [
      { name: 'SQL / MySQL', level: 78 },
      { name: 'MongoDB', level: 72 },
      { name: 'PostgreSQL', level: 65 },
    ],
  },
  {
    category: { fr: 'Réseaux & Outils', en: 'Networks & Tools' },
    icon: '🛠️',
    color: '#C4A882',
    skills: [
      { name: 'Git / GitHub', level: 80 },
      { name: 'Cisco CCNA', level: 70 },
      { name: 'CapCut', level: 85 },
    ],
  },
];

// ─── Experience ───────────────────────────────────────────────────────────────

export interface Experience {
  id: number;
  role: { fr: string; en: string };
  company: string;
  period: string;
  type: 'stage' | 'projet';
  description: { fr: string[]; en: string[] };
  tech: string[];
}

export const experiences: Experience[] = [
  {
    id: 1,
    role: { fr: 'Stage Développeur Web', en: 'Web Developer Internship' },
    company: 'Egalité pour Tous',
    period: '2025 · 3 mois',
    type: 'stage',
    description: {
      fr: [
        'Réalisation du site web de l\'événement « Journée de l\'emploi »',
        'Couverture médiatique nationale à la télévision et radio Balafon',
        'Développement complet frontend & backend de l\'application',
      ],
      en: [
        'Built the website for the "Job Day" event',
        'National media coverage on Balafon TV and radio',
        'Complete frontend & backend development of the application',
      ],
    },
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP'],
  },
  {
    id: 2,
    role: { fr: 'Projets Bachelor 2', en: 'Bachelor 2 Projects' },
    company: 'KEYCE Informatique',
    period: '2025 · Présent',
    type: 'projet',
    description: {
      fr: [
        'Vano Chat — réseau social complet (React JS + Node JS)',
        'Site e-commerce de vêtements (React JS + Node JS)',
        'Legacy — location d\'espace de travail (React JS + Next JS)',
        'Générateur de billets d\'événement QR (React JS + Node JS)',
      ],
      en: [
        'Vano Chat — complete social network (React JS + Node JS)',
        'Clothing e-commerce website (React JS + Node JS)',
        'Legacy — workspace rental platform (React JS + Next JS)',
        'QR event ticket generator (React JS + Node JS)',
      ],
    },
    tech: ['React JS', 'Next.js', 'Node.js', 'MongoDB'],
  },
  {
    id: 3,
    role: { fr: 'Projets Bachelor 1', en: 'Bachelor 1 Projects' },
    company: 'KEYCE Informatique',
    period: '2024 – 2025',
    type: 'projet',
    description: {
      fr: [
        'Conception d\'algorithmes et programmation orientée objet',
        'Modélisation et requêtage bases de données relationnelles SQL',
        'Projets web fondamentaux et architecture logicielle',
      ],
      en: [
        'Algorithm design and object-oriented programming',
        'Relational SQL database modeling and query engineering',
        'Core web development projects and software architecture',
      ],
    },
    tech: ['Python', 'SQL', 'HTML / CSS', 'JavaScript', 'Git'],
  },
];

// ─── Education ────────────────────────────────────────────────────────────────

export interface Education {
  id: number;
  degree: { fr: string; en: string };
  school: string;
  period: string;
  current: boolean;
  description: { fr: string; en: string };
}

export const educationList: Education[] = [
  {
    id: 1,
    degree: { fr: 'Bachelor 2 Informatique — Génie Logiciel', en: 'Bachelor 2 Computer Science — Software Engineering' },
    school: 'KEYCE Informatique',
    period: '2025 – Présent',
    current: true,
    description: {
      fr: 'Formation avancée en développement logiciel, architecture des systèmes, technologies web modernes et méthodes agiles.',
      en: 'Advanced training in software development, systems architecture, modern web technologies and agile methods.',
    },
  },
  {
    id: 2,
    degree: { fr: 'Bachelor 1 Informatique', en: 'Bachelor 1 Computer Science' },
    school: 'KEYCE Informatique',
    period: '2024 – 2025',
    current: false,
    description: {
      fr: 'Fondamentaux de l\'informatique, programmation orientée objet, bases de données et développement web.',
      en: 'Computer science fundamentals, object-oriented programming, databases and web development.',
    },
  },
  {
    id: 3,
    degree: { fr: 'Classe Préparatoire Maths-Physique', en: 'Mathematics-Physics Preparatory Class' },
    school: 'Esprit Prépa',
    period: '2021 – 2024',
    current: false,
    description: {
      fr: 'Formation scientifique intensive en mathématiques et physique. Admis dans 13 grandes écoles d\'ingénieurs.',
      en: 'Intensive scientific training in mathematics and physics. Admitted to 13 engineering schools.',
    },
  },
  {
    id: 4,
    degree: { fr: 'Baccalauréat', en: 'High School Diploma (Baccalauréat)' },
    school: 'Collège La Conquête',
    period: '2021',
    current: false,
    description: {
      fr: 'Obtention du diplôme de baccalauréat.',
      en: 'Obtained the baccalauréat diploma.',
    },
  },
];
