'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { type Locale, type TranslationKey, getTranslations, interpolate } from '@/lib/i18n'
import { inferPaymentCurrencyFromLocale, isManualCurrency, storeCurrency } from '@/lib/currency'
import { track } from '@vercel/analytics'

const LS_KEY = 'ff_lang'
const VALID_LOCALES: Locale[] = ['en', 'ar', 'es', 'fr', 'de', 'it', 'pt', 'id', 'vi', 'th', 'zh', 'tw', 'ja', 'ko', 'hi']

/** Map a browser navigator.language tag to a supported Locale, falling back to 'en'. */
function detectLocaleFromBrowser(): Locale {
  const lang = (navigator.language || navigator.languages?.[0] || 'en').toLowerCase()
  // Chinese variants must be checked before the generic 'zh' prefix
  if (lang === 'zh-tw' || lang === 'zh-hant' || lang.startsWith('zh-hk')) return 'tw'
  if (lang === 'zh' || lang.startsWith('zh-'))  return 'zh'
  if (lang === 'ja' || lang.startsWith('ja-'))  return 'ja'
  if (lang === 'ko' || lang.startsWith('ko-'))  return 'ko'
  if (lang === 'ar' || lang.startsWith('ar-'))  return 'ar'
  if (lang === 'hi' || lang.startsWith('hi-'))  return 'hi'
  if (lang === 'th' || lang.startsWith('th-'))  return 'th'
  if (lang === 'vi' || lang.startsWith('vi-'))  return 'vi'
  if (lang === 'id' || lang.startsWith('id-'))  return 'id'
  if (lang === 'de' || lang.startsWith('de-'))  return 'de'
  if (lang === 'fr' || lang.startsWith('fr-'))  return 'fr'
  if (lang === 'es' || lang.startsWith('es-'))  return 'es'
  if (lang === 'it' || lang.startsWith('it-'))  return 'it'
  if (lang === 'pt' || lang.startsWith('pt-'))  return 'pt'
  return 'en'
}

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

  // Hydrate from localStorage on mount, or auto-detect from browser language (client only)
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) as Locale | null
    if (saved && VALID_LOCALES.includes(saved)) {
      setLocaleState(saved)
      return
    }
    // No saved preference — detect from browser and persist so it doesn't flicker on next load
    const detected = detectLocaleFromBrowser()
    setLocaleState(detected)
    localStorage.setItem(LS_KEY, detected)
    if (detected !== 'en') {
      const inferred = inferPaymentCurrencyFromLocale(detected)
      if (inferred) storeCurrency(inferred)
    }
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(LS_KEY, l)
    track('language_changed', { locale: l })

    // Auto-update payment currency when the user switches language,
    // but only if they haven't already manually chosen a currency.
    if (!isManualCurrency()) {
      const inferred = inferPaymentCurrencyFromLocale(l)
      if (inferred) storeCurrency(inferred)
    }
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
