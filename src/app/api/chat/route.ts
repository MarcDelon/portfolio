import { NextResponse } from 'next/server';

const SYSTEM_CONTEXT = `
Tu es NoVa, l'assistant virtuel et intelligence artificielle interactive du portfolio de Marc Delon (Nzenang Tchouantcheu Marc Delon).

RÈGLES FONDAMENTALES :
1. LANGUE : Tu dois TOUJOURS répondre dans la même langue que celle utilisée par l'utilisateur dans son message.
   - Si le message est en anglais, réponds en anglais naturel et impeccable.
   - Si le message est en français, réponds en français.
   - Si le message est dans une autre langue (espagnol, allemand, etc.), réponds dans cette même langue.
2. ÉTENDUE DES CONNAISSANCES : Tu as accès à l'ensemble du savoir universel. Tu peux répondre avec précision et intelligence à TOUTES les questions : culture générale, sciences, programmation, informatique, architectures logicielles, histoire, logique, conseils techniques, salutations ou questions spécifiques sur Marc Delon.
3. EMOJIS : N'utilise STRICTEMENT AUCUN emoji dans tes réponses.
4. TON & FORMAT : Ton ton est professionnel, courtois, fluide, concis et technologique (2 à 4 phrases claires et bien structurées).

Informations détaillées sur Marc Delon :
- Nom complet : NZENANG TCHOUANTCHEU MARC DELON
- Titre : Ingénieur Logiciel Full-Stack & Développeur Web / Mobile / 3D
- Localisation : Douala, Cameroun
- Contact : Email : marcnzenang@gmail.com | Téléphone & WhatsApp : +237 655 46 26 42 | GitHub : MarcDelon | LinkedIn : /in/marc-delon-nzenang-tchouantcheu-57909b22a
- Formations & Diplômes : Actuellement étudiant en Bachelor 3 Informatique, filière IA & BD (2026-2027), à KEYCE Informatique & Intelligence Artificielle Douala, et Développeur Junior chez KARBURA SA. Parcours KEYCE : Bachelor 1 (2024-2025), Bachelor 2 Tronc Commun (2025-2026), Bachelor 3 filière IA & BD (2026-2027). Issu de Classe Préparatoire Scientifique Maths-Physique (Esprit Prépa, admis dans 13 grandes écoles d'ingénieurs), certifié Cisco CCNA (Réseaux & Sécurité)
- Expériences : Développeur Junior chez KARBURA SA (2026-2027, en parallèle du Bachelor 3). Stage chez CCN Technologie & Nje Lih Fa (2025-2026, Bachelor 2) : réalisation de Mentora, une plateforme LMS de formations en ligne (React JS, Next.js, Node.js). Stage de 3 mois chez l'organisation Egalité pour Tous (2024-2025, Bachelor 1) : développement du site web de l'événement « La Journée de l'emploi », couvert par la télévision et radio Balafon.
- Compétences techniques : React, Next.js, Node.js, PHP, Java, SQL, PostgreSQL, MongoDB, Cisco CCNA, TailwindCSS, Three.js, TypeScript, Architecture Full-Stack
- Équipe de développeurs : Fondateur et Lead Développeur de Nova Dev (logo polyédrique cristallin cyan avec le N). Nova Dev est l'équipe de développeurs et startup fondée par Marc Delon, spécialisée dans la conception d'architectures logicielles modernes, applications web & mobiles de pointe, 3D interactive et intelligence artificielle.
- Navigation du portfolio (Orbite MD : une planète tenue par deux mains au centre, chaque section est un satellite en orbite) :
  * Face 0 (Accueil / Home) : Présentation, biographie et philosophie d'ingénierie logicielle.
  * Face 1 (À Propos / About & CV) : Diplômes et cursus à KEYCE Informatique, certifications réseaux Cisco CCNA, compétences et expériences.
  * Face 2 (Projets 3D / Projects) : Couloir immersif 3D présentant les projets complets avec études de cas et démonstrations interactives.
  * Face 3 (Contact) : Formulaire de contact direct par email et lien WhatsApp.
`;

export async function POST(req: Request) {
  try {
    const { message, lang = 'fr' } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    // 1. If a Gemini API key is configured, call Google Gemini Flash Lite (Ultra-fast <1s response)
    if (process.env.GEMINI_API_KEY) {
      const models = [
        'gemini-3.5-flash-lite',
        'gemini-flash-lite-latest',
        'gemini-3.1-flash-lite',
        'gemini-3.5-flash',
        'gemini-3.8-flash',
      ];
      for (const model of models) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: AbortSignal.timeout(5000),
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [
                      {
                        text: `${SYSTEM_CONTEXT}\n\nUser Message: "${message}"\n\nInstruction: Reply directly in the same language as the user's message with zero emojis.`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 280,
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const replyText = rawText.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
              return NextResponse.json({ reply: replyText });
            }
          }
        } catch {
          // try next model or fallback
        }
      }
    }

    // 2. If a free Groq API key is configured, call Groq Llama 3
    if (process.env.GROQ_API_KEY) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: SYSTEM_CONTEXT },
              { role: 'user', content: message },
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data.choices?.[0]?.message?.content?.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')?.trim();
          if (replyText) {
            return NextResponse.json({ reply: replyText });
          }
        }
      } catch {
        // Fallback to internal knowledge engine
      }
    }

    // 3. Fallback Built-in Knowledge Engine (Free, Offline, Instant & 100% Reliable)
    const lower = message.toLowerCase();
    const isEn = lang === 'en' || /\b(who|what|where|how|tell|project|contact|skills|hello|hi|hey|good)\b/i.test(lower);
    let reply = '';

    if (lower.includes('comment') && (lower.includes('va') || lower.includes('vas') || lower.includes('allez')) || lower.includes('ça va') || lower.includes('ca va') || lower.includes('how are you') || lower.includes("how's it going") || lower.includes('whats up') || lower.includes("what's up")) {
      reply = isEn
        ? 'I am doing great, thank you! As Marc Delon\'s AI assistant, I am fully operational and ready to assist you. What would you like to discover about his background, skills, or 3D projects?'
        : 'Je vais très bien, merci ! En tant qu\'intelligence artificielle de Marc Delon, je suis opérationnelle et prête à vous assister. Que souhaitez-vous découvrir sur son profil, ses compétences ou ses projets 3D ?';
    } else if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('bonsoir') || lower.includes('coucou') || lower.includes('hello') || lower.includes('hi ') || lower === 'hi' || lower.includes('hey')) {
      reply = isEn
        ? 'Hello! Welcome to Planet Delon. I am NoVa, Marc Delon\'s virtual assistant. How can I help you today?'
        : 'Bonjour ! Ravi de vous accueillir sur la Planète Delon. Je suis NoVa, l\'assistant virtuel de Marc Delon. Comment puis-je vous aider aujourd\'hui ?';
    } else if (lower.includes('merci') || lower.includes('thank') || lower.includes('thx')) {
      reply = isEn
        ? 'You are very welcome! Feel free to ask if you have any other questions regarding Marc\'s work or journey.'
        : 'Avec grand plaisir ! N\'hésitez pas si vous avez d\'autres questions sur le travail ou le parcours de Marc.';
    } else if (lower.includes('qui es-tu') || lower.includes('tu es qui') || lower.includes('c\'est quoi nova') || lower.includes('who are you') || lower.includes('what are you')) {
      reply = isEn
        ? 'I am NoVa, Marc Delon\'s virtual assistant and interactive AI. I am here to guide your 3D tour, present his portfolio, and answer all your questions.'
        : 'Je suis NoVa, l\'assistant virtuel et l\'IA interactive de Marc Delon. Je suis là pour guider votre visite 3D, vous présenter son portfolio et répondre à toutes vos questions.';
    } else if (lower.includes('nova dev') || lower.includes('equipe') || lower.includes('équipe') || lower.includes('team') || lower.includes('startup')) {
      reply = isEn
        ? 'Nova Dev is the elite software engineering team and startup founded and led by Marc Delon. Specialized in modern web, mobile, 3D, and AI architectures, Nova Dev builds high-performance digital products.'
        : 'Nova Dev est l\'équipe de développeurs et la startup technologique fondée et dirigée par Marc Delon. Spécialisée en ingénierie logicielle moderne, applications web & mobiles de pointe, 3D interactive et IA, Nova Dev conçoit des produits digitaux performants et sur-mesure.';
    } else if (lower.includes('qui') || lower.includes('who') || lower.includes('marc') || lower.includes('presentation') || lower.includes('présentation') || lower.includes('bio')) {
      reply = isEn
        ? 'Marc Delon is a full-stack software engineer and web/mobile developer based in Douala, Cameroon. He builds modern software architectures, high-performance web solutions, and immersive 3D interfaces.'
        : 'Marc Delon est un ingénieur logiciel full-stack et développeur web/mobile basé à Douala, Cameroun. Il conçoit des architectures logicielles modernes, des solutions web performantes et des interfaces 3D immersives.';
    } else if (lower.includes('competence') || lower.includes('compétence') || lower.includes('skill') || lower.includes('formation') || lower.includes('diplome') || lower.includes('diplôme') || lower.includes('ccna') || lower.includes('stack') || lower.includes('ecole') || lower.includes('école') || lower.includes('keyce')) {
      reply = isEn
        ? 'Marc is currently a Bachelor 3 Computer Science student, AI & BD track (2026-2027), at KEYCE Informatique & AI Douala, and a Junior Developer at KARBURA SA. He completed intensive preparatory classes in Math-Physics, holds a Cisco CCNA certification, and specializes in React, Next.js, Node.js, PHP, Java, SQL, PostgreSQL, and MongoDB.'
        : 'Marc est actuellement étudiant en Bachelor 3 Informatique, filière IA & BD (2026-2027), à KEYCE Informatique & Intelligence Artificielle Douala, et Développeur Junior chez KARBURA SA. Il est issu de classe préparatoire Maths-Physique et certifié réseau Cisco CCNA. Il maîtrise React, Next.js, Node.js, PHP, Java, SQL, PostgreSQL et MongoDB.';
    } else if (lower.includes('projet') || lower.includes('project') || lower.includes('portfolio') || lower.includes('realisation') || lower.includes('réalisation')) {
      reply = isEn
        ? 'The 3D projects room showcases Marc\'s work, including complete web applications, backend architectures, and interactive interfaces with comprehensive case studies.'
        : 'La salle des projets 3D regroupe les réalisations de Marc, incluant des applications web complètes, des architectures backend et des interfaces interactives accompagnées d\'études de cas détaillées.';
    } else if (lower.includes('contact') || lower.includes('email') || lower.includes('mail') || lower.includes('whatsapp') || lower.includes('telephone') || lower.includes('téléphone') || lower.includes('reach')) {
      reply = isEn
        ? 'You can contact Marc via email at marcnzenang@gmail.com or directly via WhatsApp and phone at +237 655 46 26 42.'
        : 'Vous pouvez contacter Marc par email à marcnzenang@gmail.com ou directement par WhatsApp et téléphone au +237 655 46 26 42.';
    } else if (lower.includes('cube') || lower.includes('planete') || lower.includes('planète') || lower.includes('navig') || lower.includes('tourn') || lower.includes('orbit')) {
      reply = isEn
        ? 'To navigate Planet Delon, click any satellite orbiting the planet to open that section. You can also drag the orbit with your mouse or finger to spin it.'
        : 'Pour naviguer sur la Planète Delon, cliquez sur un satellite en orbite autour de la planète pour ouvrir la section correspondante. Vous pouvez aussi faire tourner l\'orbite avec la souris ou le doigt.'
    } else {
      reply = isEn
        ? 'I am NoVa, Marc Delon\'s AI assistant. I can answer any question about his profile, skills, projects, or discuss any tech and general knowledge topic.'
        : 'Je suis NoVa, l\'assistant virtuel de Marc Delon. Je peux vous renseigner sur son profil, ses compétences, ses projets ou répondre à toutes vos questions.';
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du traitement du message' },
      { status: 500 }
    );
  }
}
