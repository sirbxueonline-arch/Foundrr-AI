'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, Language, Translation } from '@/lib/translations'

interface LanguageContextType {
  lang: Language
  t: Translation
  toggleLanguage: () => void
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('az') // Default to Azerbaijani as requested

  useEffect(() => {
    const savedLang = localStorage.getItem('foundrr-lang') as Language
    if (savedLang && (savedLang === 'az' || savedLang === 'en')) {
      setLang(savedLang)
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = lang === 'az' ? 'en' : 'az'
    setLang(newLang)
    localStorage.setItem('foundrr-lang', newLang)
  }

  const setLanguage = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('foundrr-lang', newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
