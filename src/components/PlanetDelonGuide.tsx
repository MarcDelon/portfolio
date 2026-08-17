'use client';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useCube } from '@/lib/CubeContext';
import Image from 'next/image';
import { Send, Minimize2, ExternalLink, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  action?: {
    label: string;
    faceIndex: number;
  };
  suggestions?: string[];
  timestamp: string;
}

export default function PlanetDelonGuide() {
  const { lang } = useLanguage();
  const { viewMode, openFace, isExploding, isZoomingOut } = useCube();
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      sender: 'bot',
      text: lang === 'fr'
        ? 'Bienvenue sur la Planète Delon. Je suis NoVa, l\'assistant virtuel de Marc Delon.'
        : 'Welcome to Planet Delon. I am NoVa, Marc Delon\'s virtual assistant.',
      timestamp: '12:00',
    },
    {
      id: '2',
      sender: 'bot',
      text: lang === 'fr'
        ? 'Vous pouvez faire pivoter le cube 3D ou me poser une question sur le parcours, les compétences et les projets de Marc :'
        : 'You can rotate the 3D cube or ask me any question about Marc\'s background, skills, and projects:',
      suggestions: lang === 'fr'
        ? ['Qui est Marc ?', 'Compétences & formations', 'Projets 3D', 'Contacter Marc', 'Fonctionnement du cube']
        : ['Who is Marc?', 'Skills & education', '3D Projects', 'Contact Marc', 'How the cube works'],
      timestamp: '12:00',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update greeting when language changes
  useEffect(() => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: lang === 'fr'
          ? 'Bienvenue sur la Planète Delon. Je suis NoVa, l\'assistant virtuel de Marc Delon.'
          : 'Welcome to Planet Delon. I am NoVa, Marc Delon\'s virtual assistant.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: '2',
        sender: 'bot',
        text: lang === 'fr'
          ? 'Vous pouvez faire pivoter le cube 3D ou me poser une question sur le parcours, les compétences et les projets de Marc :'
          : 'You can rotate the 3D cube or ask me any question about Marc\'s background, skills, and projects:',
        suggestions: lang === 'fr'
          ? ['Qui est Marc ?', 'Compétences & formations', 'Projets 3D', 'Contacter Marc', 'Fonctionnement du cube']
          : ['Who is Marc?', 'Skills & education', '3D Projects', 'Contact Marc', 'How the cube works'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [lang]);

  if (viewMode !== 'cube' || isExploding || isZoomingOut) {
    return null;
  }

  const detectAction = (text: string, lower: string) => {
    if (lower.includes('qui') || lower.includes('who') || lower.includes('marc') || lower.includes('presentation') || lower.includes('présentation') || lower.includes('bio') || lower.includes('face 0')) {
      return {
        label: lang === 'fr' ? 'Ouvrir Accueil & Vision' : 'Open Home & Vision',
        faceIndex: 0,
      };
    }
    if (lower.includes('competence') || lower.includes('compétence') || lower.includes('skill') || lower.includes('formation') || lower.includes('diplome') || lower.includes('diplôme') || lower.includes('ccna') || lower.includes('face 1')) {
      return {
        label: lang === 'fr' ? 'Voir Formations & Compétences' : 'View Education & Skills',
        faceIndex: 1,
      };
    }
    if (lower.includes('projet') || lower.includes('project') || lower.includes('realisation') || lower.includes('réalisation') || lower.includes('salle') || lower.includes('face 2')) {
      return {
        label: lang === 'fr' ? 'Entrer dans la Salle des Projets' : 'Enter 3D Projects Corridor',
        faceIndex: 2,
      };
    }
    if (lower.includes('contact') || lower.includes('mail') || lower.includes('email') || lower.includes('whatsapp') || lower.includes('telephone') || lower.includes('téléphone') || lower.includes('face 3')) {
      return {
        label: lang === 'fr' ? 'Ouvrir la Page Contact' : 'Open Contact Page',
        faceIndex: 3,
      };
    }
    return undefined;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, lang }),
      });

      if (res.ok) {
        const data = await res.json();
        const cleanReply = (data.reply || '').replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
        const action = detectAction(cleanReply, query.toLowerCase());

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: cleanReply || (lang === 'fr' ? 'Je suis à votre disposition.' : 'I am at your service.'),
            action,
            suggestions: lang === 'fr'
              ? ['Compétences & formations', 'Projets 3D', 'Contacter Marc']
              : ['Skills & education', '3D Projects', 'Contact Marc'],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('API Error');
      }
    } catch {
      // Fallback
      const lower = query.toLowerCase();
      let fallbackText = lang === 'fr'
        ? 'Je suis NoVa. Je peux vous guider vers les compétences, les projets ou les coordonnées de Marc.'
        : 'I am NoVa. I can guide you through Marc\'s skills, projects, or contact info.';
      const action = detectAction(fallbackText, lower);

      if (lower.includes('qui') || lower.includes('who') || lower.includes('marc')) {
        fallbackText = lang === 'fr'
          ? 'Marc Delon est un ingénieur logiciel full-stack et développeur web/mobile passionné par les architectures modernes et la 3D.'
          : 'Marc Delon is a full-stack software engineer and web/mobile developer passionate about modern architecture and 3D.';
      } else if (lower.includes('competence') || lower.includes('compétence') || lower.includes('formation')) {
        fallbackText = lang === 'fr'
          ? 'Marc maîtrise React, Next.js, Node.js, PHP, Java, SQL et MongoDB. Il est certifié Cisco CCNA et diplômé de l\'IUT de Douala.'
          : 'Marc specializes in React, Next.js, Node.js, PHP, Java, SQL, and MongoDB. He is CCNA certified and holds a degree from IUT Douala.';
      } else if (lower.includes('projet')) {
        fallbackText = lang === 'fr'
          ? 'La salle des projets 3D regroupe les applications complètes et études de cas développées par Marc.'
          : 'The 3D projects room showcases full applications and case studies built by Marc.';
      } else if (lower.includes('contact')) {
        fallbackText = lang === 'fr'
          ? 'Vous pouvez joindre Marc à marcnzenang@gmail.com ou par WhatsApp au +237 655 46 26 42.'
          : 'You can reach Marc at marcnzenang@gmail.com or via WhatsApp at +237 655 46 26 42.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: fallbackText,
          action,
          suggestions: lang === 'fr'
            ? ['Compétences & formations', 'Projets 3D', 'Contacter Marc']
            : ['Skills & education', '3D Projects', 'Contact Marc'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <aside
      id="planet-delon-chatbot"
      aria-label="Chatbot NoVa"
      style={{
        position: 'fixed',
        bottom: 'clamp(16px, 3.5vw, 28px)',
        left: 'clamp(16px, 3.5vw, 28px)',
        zIndex: 500,
        maxWidth: 'min(380px, calc(100vw - 32px))',
        width: '100%',
        pointerEvents: 'auto',
        fontFamily: 'var(--font-sans)',
        animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* ── Minimized Floating Avatar Badge ── */}
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="chatbot-floating-trigger"
          aria-label={lang === 'fr' ? 'Ouvrir NoVa' : 'Open NoVa'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, rgba(28, 14, 7, 0.96) 0%, rgba(16, 8, 4, 0.98) 100%)',
            border: '1.5px solid rgba(224, 123, 31, 0.45)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 24px rgba(224, 123, 31, 0.25)',
            borderRadius: '9999px',
            padding: '6px 16px 6px 6px',
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ position: 'relative', width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--amber)' }}>
            <Image
              src="/avatar.png"
              alt="NoVa Avatar"
              fill
              sizes="42px"
              style={{ objectFit: 'cover' }}
              priority
            />
            {/* Live green dot */}
            <span style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: '#25D366', border: '1.5px solid #1c0e05' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff' }}>
              NoVa
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--amber)' }}>
              {lang === 'fr' ? 'En ligne • Poser une question' : 'Online • Ask a question'}
            </span>
          </div>
        </button>
      ) : (
        /* ── Full Chatbot Window ── */
        <div
          className="chatbot-window-box"
          style={{
            background: 'linear-gradient(155deg, rgba(26, 13, 6, 0.98) 0%, rgba(12, 6, 3, 0.98) 100%)',
            border: '1.5px solid rgba(224, 123, 31, 0.35)',
            borderRadius: '22px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(224, 123, 31, 0.18)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            height: 'clamp(400px, 60vh, 480px)',
            maxHeight: 'calc(100vh - 120px)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* ── Chat Header ── */}
          <div
            style={{
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.4)',
              borderBottom: '1px solid rgba(223, 203, 175, 0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Avatar Frame */}
              <div
                style={{
                  position: 'relative',
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  padding: '1.5px',
                  background: 'linear-gradient(135deg, var(--amber) 0%, #b4570d 100%)',
                  boxShadow: '0 0 12px rgba(224, 123, 31, 0.35)',
                  flexShrink: 0,
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                  <Image
                    src="/avatar.png"
                    alt="NoVa Avatar"
                    fill
                    sizes="38px"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
                {/* Live dot */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#25D366',
                    border: '1.5px solid #1c0e05',
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                    NoVa
                  </h4>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', background: 'rgba(224, 123, 31, 0.2)', color: 'var(--amber)' }}>
                    Assistant IA
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.68rem', color: '#25D366', fontWeight: 600 }}>
                  {lang === 'fr' ? 'En direct de la Planète Delon' : 'Live from Planet Delon'}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setIsMinimized(true)}
                aria-label={lang === 'fr' ? 'Réduire' : 'Minimize'}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(224, 123, 31, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                <Minimize2 size={13} />
              </button>
            </div>
          </div>

          {/* ── Messages Feed ── */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {/* Bot Avatar Icon in message stream */}
                {msg.sender === 'bot' && (
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                      border: '1px solid var(--amber)',
                      marginTop: '2px',
                    }}
                  >
                    <Image src="/avatar.png" alt="NoVa" fill sizes="26px" style={{ objectFit: 'cover' }} />
                  </div>
                )}

                {/* Speech Bubble */}
                <div
                  style={{
                    maxWidth: '84%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      background: msg.sender === 'user'
                        ? 'linear-gradient(135deg, #e07b1f 0%, #b4570d 100%)'
                        : 'rgba(255, 255, 255, 0.06)',
                      border: msg.sender === 'user'
                        ? '1px solid rgba(255, 255, 255, 0.2)'
                        : '1px solid rgba(223, 203, 175, 0.14)',
                      borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.8125rem',
                      lineHeight: 1.55,
                      whiteSpace: 'pre-line',
                      boxShadow: msg.sender === 'user'
                        ? '0 4px 14px rgba(224, 123, 31, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {msg.text}

                    {/* Direct Action Warp Button */}
                    {msg.action && (
                      <button
                        onClick={() => openFace(msg.action!.faceIndex)}
                        style={{
                          marginTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(224, 123, 31, 0.25)',
                          border: '1px solid var(--amber)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          padding: '6px 10px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          width: '100%',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--amber)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(224, 123, 31, 0.25)';
                        }}
                      >
                        <span>{msg.action.label}</span>
                        <ExternalLink size={12} />
                      </button>
                    )}
                  </div>

                  {/* Suggestion Chips (Clean, without emojis) */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                      {msg.suggestions.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(chip)}
                          style={{
                            background: 'rgba(224, 123, 31, 0.12)',
                            border: '1px solid rgba(224, 123, 31, 0.3)',
                            borderRadius: '9999px',
                            color: 'var(--amber)',
                            padding: '3px 9px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(224, 123, 31, 0.25)';
                            e.currentTarget.style.borderColor = 'var(--amber)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(224, 123, 31, 0.12)';
                            e.currentTarget.style.borderColor = 'rgba(224, 123, 31, 0.3)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', position: 'relative', border: '1px solid var(--amber)' }}>
                  <Image src="/avatar.png" alt="NoVa" fill sizes="24px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '6px 12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--amber)', animation: 'pulse 1s infinite 0ms' }} />
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--amber)', animation: 'pulse 1s infinite 200ms' }} />
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--amber)', animation: 'pulse 1s infinite 400ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Bar ── */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '8px 10px',
              background: 'rgba(0, 0, 0, 0.45)',
              borderTop: '1px solid rgba(223, 203, 175, 0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={lang === 'fr' ? 'Posez une question à NoVa...' : 'Ask NoVa a question...'}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(223, 203, 175, 0.18)',
                borderRadius: '12px',
                padding: '7px 12px',
                color: '#ffffff',
                fontSize: '0.78rem',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--amber)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(223, 203, 175, 0.18)';
              }}
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              aria-label={lang === 'fr' ? 'Envoyer' : 'Send'}
              style={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                background: inputText.trim() && !isTyping ? 'var(--amber)' : 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() && !isTyping ? 'pointer' : 'default',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
