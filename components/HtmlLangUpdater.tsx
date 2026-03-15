'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

/**
 * Syncs the <html lang="…"> attribute with the active locale.
 * Must be rendered inside <LanguageProvider>.
 * Returns null — no visual output.
 */
export function HtmlLangUpdater() {
  const { locale } = useLanguage()
  useEffect(() => {
    // Map internal locale codes to valid BCP-47 language tags
    const langMap: Record<string, string> = { pt: 'pt-BR' }
    document.documentElement.lang = langMap[locale] ?? locale
  }, [locale])
  return null
}
