import { NextResponse } from 'next/server';

const SYSTEM_CONTEXT = `
Tu es NoVa, l'assistant virtuel et guide IA interactif du portfolio de Marc Delon (Nzenang Tchouantcheu Marc Delon).
Ton ton est professionnel, concis, élégant, courtois et technologique.
Ne JAMAIS utiliser d'emojis dans tes réponses.

Informations sur Marc Delon :
- Nom complet : NZENANG TCHOUANTCHEU MARC DELON
- Titre : Ingénieur Logiciel Full-Stack & Développeur Web / Mobile
- Localisation : Douala, Cameroun
- Contact : Email : marcnzenang@gmail.com | Téléphone & WhatsApp : +237 655 46 26 42 | GitHub : MarcDelon
- Formations & Diplômes : Diplômé de l'IUT de Douala, certifié Cisco CCNA (Réseaux & Sécurité)
- Compétences techniques : React, Next.js, Node.js, PHP, Java, SQL, MongoDB, Cisco CCNA, TailwindCSS, Three.js, TypeScript, Architecture Full-Stack
- Sections du portfolio (Faces du Cube 3D) :
  * Face 0 (Accueil & Vision) : Présentation, biographie et philosophie d'ingénierie logicielle.
  * Face 1 (Formation & Compétences) : Diplômes universitaires, certifications réseaux et maîtrise technique.
  * Face 2 (Salle des Projets) : Couloir immersif 3D présentant les projets complets avec études de cas et démonstrations interactives.
  * Face 3 (Contact) : Formulaire de contact direct connecté par email et lien WhatsApp.

Consignes de réponse :
- Réponds toujours de manière concise et directe (2 à 4 phrases maximum).
- N'utilise AUCUN emoji.
- Si la question concerne une section précise, indique la face correspondante (ex: Face 0, Face 1, Face 2 ou Face 3).
`;

export async function POST(req: Request) {
  try {
    const { message, lang = 'fr' } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;

    // 1. If a Gemini API key is configured, call Google Gemini API (gemini-3.6-flash / 2.5 / 1.5)
    if (process.env.GEMINI_API_KEY) {
      const models = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
      for (const model of models) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [
                      {
                        text: `${SYSTEM_CONTEXT}\n\nLangue de réponse : ${lang === 'fr' ? 'Français' : 'Anglais'}\n\nMessage de l'utilisateur : ${message}`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 300,
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
          // try next model
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
    let reply = '';

    if (lower.includes('qui') || lower.includes('who') || lower.includes('marc') || lower.includes('presentation') || lower.includes('présentation') || lower.includes('bio')) {
      reply = lang === 'fr'
        ? 'Marc Delon est un ingénieur logiciel full-stack et développeur web/mobile basé à Douala, Cameroun. Il conçoit des architectures logicielles modernes, des solutions web performantes et des interfaces 3D immersives.'
        : 'Marc Delon is a full-stack software engineer and web/mobile developer based in Douala, Cameroon. He builds modern software architectures, high-performance web solutions, and immersive 3D interfaces.';
    } else if (lower.includes('competence') || lower.includes('compétence') || lower.includes('skill') || lower.includes('formation') || lower.includes('diplome') || lower.includes('diplôme') || lower.includes('ccna') || lower.includes('stack')) {
      reply = lang === 'fr'
        ? 'Marc maîtrise les technologies React, Next.js, Node.js, PHP, Java, SQL et MongoDB. Il est diplômé de l\'IUT de Douala et détient la certification réseau Cisco CCNA.'
        : 'Marc specializes in React, Next.js, Node.js, PHP, Java, SQL, and MongoDB. He is a graduate of IUT Douala and holds a Cisco CCNA networking certification.';
    } else if (lower.includes('projet') || lower.includes('project') || lower.includes('portfolio') || lower.includes('realisation') || lower.includes('réalisation')) {
      reply = lang === 'fr'
        ? 'La salle des projets 3D regroupe les réalisations de Marc, incluant des applications web complètes, des architectures backend et des interfaces interactives accompagnées d\'études de cas détaillées.'
        : 'The 3D projects room showcases Marc\'s work, including complete web applications, backend architectures, and interactive interfaces with comprehensive case studies.';
    } else if (lower.includes('contact') || lower.includes('email') || lower.includes('mail') || lower.includes('whatsapp') || lower.includes('telephone') || lower.includes('téléphone')) {
      reply = lang === 'fr'
        ? 'Vous pouvez contacter Marc par email à marcnzenang@gmail.com ou directement par WhatsApp et téléphone au +237 655 46 26 42.'
        : 'You can contact Marc via email at marcnzenang@gmail.com or directly via WhatsApp and phone at +237 655 46 26 42.';
    } else if (lower.includes('cube') || lower.includes('planete') || lower.includes('planète') || lower.includes('navig') || lower.includes('tourn')) {
      reply = lang === 'fr'
        ? 'Pour naviguer sur la Planète Delon, faites glisser le cube avec votre souris ou votre doigt pour explorer ses différentes faces, ou cliquez directement sur une face pour ouvrir la section correspondante.'
        : 'To navigate Planet Delon, drag the cube with your mouse or finger to explore its faces, or click directly on any face to enter that section.';
    } else {
      reply = lang === 'fr'
        ? 'Je suis NoVa, l\'assistant virtuel de Marc Delon. Je peux vous renseigner sur son profil, ses compétences, ses projets ou ses coordonnées.'
        : 'I am NoVa, Marc Delon\'s virtual assistant. I can help you learn about his profile, skills, projects, or contact information.';
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors du traitement du message' },
      { status: 500 }
    );
  }
}
