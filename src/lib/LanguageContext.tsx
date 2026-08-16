'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Language } from './data';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'fr',
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-lang') as Language | null;
    if (saved === 'fr' || saved === 'en') setLang(saved);
  }, []);

  const toggleLang = () => {
    setLang(prev => {
      const next: Language = prev === 'fr' ? 'en' : 'fr';
      localStorage.setItem('portfolio-lang', next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
