'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { LOCALES, type Locale } from '@/lib/i18n'
import { useLanguage } from '@/context/LanguageContext'

const LISTBOX_ID = 'language-listbox'

interface Props {
  /** Controls which direction the dropdown opens. Default 'up' (designed for bottom nav). */
  direction?: 'up' | 'down'
}

export function LanguageSelector({ direction = 'up' }: Props) {
  const { locale, setLocale } = useLanguage()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listboxRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]
  const currentIndex = LOCALES.findIndex((l) => l.code === locale)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Open / close ────────────────────────────────────────────────────────────

  const openDropdown = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setOpen(true)
  }, [])

  const closeDropdown = useCallback(() => {
    setOpen(false)
    buttonRef.current?.focus()
  }, [])

  // Auto-close on mouse leave (desktop only — touch never fires this)
  const handleMouseEnter = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
    }, 250)
  }, [])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  // Move focus to the currently selected option when dropdown opens
  useEffect(() => {
    if (open) {
      const idx = currentIndex >= 0 ? currentIndex : 0
      // Defer to next frame so the list is mounted in the DOM
      requestAnimationFrame(() => {
        optionRefs.current[idx]?.focus()
      })
    }
  }, [open, currentIndex])

  // ── Keyboard navigation ──────────────────────────────────────────────────────

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      openDropdown()
    }
  }

  const handleOptionKeyDown = (e: React.KeyboardEvent, idx: number) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        closeDropdown()
        break
      case 'ArrowDown':
        e.preventDefault()
        optionRefs.current[Math.min(idx + 1, LOCALES.length - 1)]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        if (idx === 0) closeDropdown()
        else optionRefs.current[Math.max(idx - 1, 0)]?.focus()
        break
      case 'Home':
        e.preventDefault()
        optionRefs.current[0]?.focus()
        break
      case 'End':
        e.preventDefault()
        optionRefs.current[LOCALES.length - 1]?.focus()
        break
      case 'Tab':
        // Tab should close the dropdown and let focus move naturally
        closeDropdown()
        break
    }
  }

  const handleSelect = (code: Locale) => {
    setLocale(code)
    closeDropdown()
  }

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        ref={buttonRef}
        onClick={() => (open ? closeDropdown() : openDropdown())}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={LISTBOX_ID}
        aria-label={`Language: ${current.label}`}
        className="flex flex-col items-center gap-1 py-3 px-3 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors min-h-[44px] min-w-[44px] justify-center"
      >
        {current.flagCode === 'globe' ? (
          <span className="text-lg leading-none" aria-hidden="true">🌐</span>
        ) : (
          <Image
            src={`/images/flags/${current.flagCode}.svg`}
            alt={current.label}
            width={24}
            height={18}
            className="rounded-sm"
            unoptimized
          />
        )}
        <span className="leading-none uppercase">{current.code}</span>
      </button>

      {open && (
        <>
          {/* Backdrop — click outside to close */}
          <div
            className="fixed inset-0 z-40"
            onClick={closeDropdown}
            aria-hidden="true"
          />
          {/* Listbox — opens upward from bottom nav */}
          <div
            ref={listboxRef}
            id={LISTBOX_ID}
            role="listbox"
            aria-label="Select language"
            aria-activedescendant={`lang-option-${locale}`}
            className={`absolute ${direction === 'down' ? 'top-full mt-2' : 'bottom-full mb-2'} right-0 rtl:right-auto rtl:left-0 z-50 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-xl min-w-[160px] max-h-64 overflow-y-auto scrollbar-purple`}
          >
            {LOCALES.map((l, idx) => (
              <button
                key={l.code}
                id={`lang-option-${l.code}`}
                ref={(el) => { optionRefs.current[idx] = el }}
                role="option"
                aria-selected={l.code === locale}
                onClick={() => handleSelect(l.code as Locale)}
                onKeyDown={(e) => handleOptionKeyDown(e, idx)}
                className={`w-full text-left rtl:text-right flex items-center gap-3 px-4 py-3 text-sm transition-colors min-h-[44px] ${
                  l.code === locale
                    ? 'text-purple-400 bg-purple-900/20 font-medium'
                    : 'text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                {l.flagCode === 'globe' ? (
                  <span className="text-base leading-none shrink-0" aria-hidden="true">🌐</span>
                ) : (
                  <Image
                    src={`/images/flags/${l.flagCode}.svg`}
                    alt=""
                    width={20}
                    height={15}
                    className="rounded-sm shrink-0"
                    unoptimized
                  />
                )}
                <span>{l.label}</span>
                {l.code === locale && (
                  <span className="sr-only">(selected)</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
