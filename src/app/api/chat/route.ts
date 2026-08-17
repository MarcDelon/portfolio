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
- Formations & Diplômes : Étudiant à KEYCE Informatique & Intelligence Artificielle Douala (Bachelor en Informatique & Génie Logiciel), Classe Préparatoire Scientifique Maths-Physique (Esprit Prépa, admis dans 13 grandes écoles d'ingénieurs), certifié Cisco CCNA (Réseaux & Sécurité)
- Compétences techniques : React, Next.js, Node.js, PHP, Java, SQL, PostgreSQL, MongoDB, Cisco CCNA, TailwindCSS, Three.js, TypeScript, Architecture Full-Stack
- Navigation du portfolio 3D (Faces du Cube) :
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
      const models = ['gemini-3.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.1-flash-lite', 'gemini-3.6-flash'];
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

    if (lower.includes('qui') || lower.includes('who') || lower.includes('marc') || lower.includes('presentation') || lower.includes('présentation') || lower.includes('bio')) {
      reply = isEn
        ? 'Marc Delon is a full-stack software engineer and web/mobile developer based in Douala, Cameroon. He builds modern software architectures, high-performance web solutions, and immersive 3D interfaces.'
        : 'Marc Delon est un ingénieur logiciel full-stack et développeur web/mobile basé à Douala, Cameroun. Il conçoit des architectures logicielles modernes, des solutions web performantes et des interfaces 3D immersives.';
    } else if (lower.includes('competence') || lower.includes('compétence') || lower.includes('skill') || lower.includes('formation') || lower.includes('diplome') || lower.includes('diplôme') || lower.includes('ccna') || lower.includes('stack') || lower.includes('ecole') || lower.includes('école') || lower.includes('keyce')) {
      reply = isEn
        ? 'Marc studies Software Engineering at KEYCE Informatique & AI Douala, has completed intensive preparatory classes in Math-Physics, and holds a Cisco CCNA networking certification. He specializes in React, Next.js, Node.js, PHP, Java, SQL, PostgreSQL, and MongoDB.'
        : 'Marc est étudiant en Génie Logiciel à KEYCE Informatique & Intelligence Artificielle Douala, issu de classe préparatoire Maths-Physique et certifié réseau Cisco CCNA. Il maîtrise React, Next.js, Node.js, PHP, Java, SQL, PostgreSQL et MongoDB.';
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
        ? 'To navigate Planet Delon, drag the cube with your mouse or finger to explore its faces, or click directly on any face or bottom tab to enter that section.'
        : 'Pour naviguer sur la Planète Delon, faites glisser le cube avec votre souris ou votre doigt pour explorer ses différentes faces, ou cliquez directement sur une face pour ouvrir la section correspondante.';
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
