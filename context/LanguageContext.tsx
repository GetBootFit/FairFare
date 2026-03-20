'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { type Locale, type TranslationKey, getTranslations, interpolate } from '@/lib/i18n'
import { track } from '@vercel/analytics'

const LS_KEY = 'ff_lang'
const VALID_LOCALES: Locale[] = ['en', 'es', 'fr', 'de', 'it', 'pt', 'id', 'vi', 'th', 'zh', 'tw', 'ja', 'ko', 'hi']

interface LanguageContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey, vars?: Record<string, string>) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) as Locale | null
    if (saved && VALID_LOCALES.includes(saved)) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(LS_KEY, l)
    track('language_changed', { locale: l })
  }

  const translations = getTranslations(locale)

  const t = (key: TranslationKey, vars?: Record<string, string>): string => {
    const val = translations[key] ?? key
    return vars ? interpolate(val, vars) : val
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
