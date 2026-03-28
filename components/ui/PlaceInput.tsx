'use client'

import { useRef, useEffect } from 'react'
import { useGoogleMaps, preloadGoogleMaps } from '@/hooks/useGoogleMaps'
import clsx from 'clsx'

interface Props {
  id: string
  /** Visible or sr-only label text. When a visible <label> exists in the parent (htmlFor={id}),
   *  omit this prop. Pass it when the component is used without an external label element,
   *  so the input is always accessible regardless of context. */
  label?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSelect: (address: string, placeId: string) => void
  /** Associates this input with an error message element via aria-describedby. */
  errorId?: string
  className?: string
}

export function PlaceInput({ id, label, placeholder, value, onChange, onSelect, errorId, className }: Props) {
  const mapsLoaded = useGoogleMaps()
  const inputRef = useRef<HTMLInputElement>(null)
  const acRef = useRef<google.maps.places.Autocomplete | null>(null)
  // Session token groups all autocomplete keystrokes + the final place selection into
  // a single billing event (~$17/1000 sessions vs ~$17/1000 per keystroke without it).
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)

  useEffect(() => {
    if (!mapsLoaded || !inputRef.current || acRef.current) return

    sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken()

    acRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'place_id', 'name'],
    })
    // sessionToken is a valid Maps API option but missing from @types/google.maps;
    // set it via the untyped set() method to group all keystrokes into one billing event.
    acRef.current.set('sessionToken', sessionTokenRef.current)

    acRef.current.addListener('place_changed', () => {
      const place = acRef.current!.getPlace()
      const address = place.formatted_address ?? place.name ?? ''
      const placeId = place.place_id ?? ''
      if (address) onSelect(address, placeId)
      // Reset token so the next search session starts a fresh billing group
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken()
      acRef.current!.set('sessionToken', sessionTokenRef.current)
    })
  }, [mapsLoaded, onSelect])

  // On mobile, the software keyboard shrinks the viewport and can push the
  // autocomplete dropdown behind it. Scrolling the input into view after the
  // keyboard has animated in (300 ms delay) keeps the field visible.
  const handleFocus = () => {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
  }

  // Trigger Maps load on the earliest possible user signal (pointer contact).
  // onPointerDown fires before onFocus, giving ~100–200 ms head-start on the
  // script fetch before the user reaches the keyboard. This is the LCP fix:
  // Maps is not fetched until user intent is shown, so it never blocks initial paint.
  const handlePointerDown = () => preloadGoogleMaps()

  return (
    <>
      {/* Render a visually-hidden label when no external <label htmlFor> is provided. */}
      {label && (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        // Browser autocomplete is disabled because Google Places Autocomplete handles
        // suggestions via a custom listbox. The role/aria-autocomplete attributes
        // communicate this combobox pattern to screen readers (WCAG 4.1.2, 1.3.5).
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="false"
        aria-haspopup="listbox"
        onPointerDown={handlePointerDown}
        onFocus={handleFocus}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={errorId}
        className={clsx(
          'w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3.5',
          'text-white placeholder-zinc-500 text-base',
          'focus:border-zinc-500 focus:bg-zinc-750 transition-colors',
          className
        )}
      />
    </>
  )
}
