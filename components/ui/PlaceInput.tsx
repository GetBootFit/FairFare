'use client'

import { useRef, useEffect } from 'react'
import { useGoogleMaps } from '@/hooks/useGoogleMaps'
import clsx from 'clsx'

interface Props {
  id: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSelect: (address: string, placeId: string) => void
  className?: string
}

export function PlaceInput({ id, placeholder, value, onChange, onSelect, className }: Props) {
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

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      value={value}
      placeholder={placeholder}
      autoComplete="off"
      onFocus={handleFocus}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        'w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3.5',
        'text-white placeholder-zinc-500 text-base',
        'focus:border-zinc-500 focus:bg-zinc-750 transition-colors',
        className
      )}
    />
  )
}
