'use client'

import { useEffect, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

/**
 * Singleton promise for the Maps JS API load.
 * null  → not yet requested
 * Promise → load in flight or complete
 */
let loaderPromise: Promise<void> | null = null

/**
 * Triggers the Google Maps Places library load (idempotent — safe to call multiple times).
 *
 * Design: loading is intentionally NOT started on page mount. It is triggered only
 * when the user shows intent to interact with the place autocomplete input
 * (onPointerDown / onFocus on PlaceInput). This defers a ~20 KB script + DNS
 * handshake that would otherwise compete with LCP rendering.
 *
 * Call this from PlaceInput's onPointerDown handler so Maps is loading the
 * instant the user's finger touches the input — well before the keyboard opens
 * and they begin typing.
 */
export function preloadGoogleMaps(): void {
  if (loaderPromise) return
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    version: 'weekly',
    libraries: ['places'],
  })
  loaderPromise = loader.load().then(() => undefined).catch((err) => {
    // Reset so a retry is possible on next interaction
    loaderPromise = null
    console.error('Google Maps failed to load:', err)
  }) as Promise<void>
}

/**
 * Returns true once the Maps Places library is available in `window.google`.
 *
 * Does NOT trigger loading itself — call preloadGoogleMaps() on user interaction
 * before mounting components that use this hook.
 *
 * The hook subscribes to the existing loader promise (if one was started by
 * preloadGoogleMaps) and resolves when it completes.
 */
export function useGoogleMaps(): boolean {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // If maps are already loaded (cached singleton), resolve immediately
    if (window.google?.maps?.places) {
      setLoaded(true)
      return
    }

    // If loading was triggered (e.g. by preloadGoogleMaps on pointer down),
    // attach to the existing promise. If not yet triggered, the hook waits —
    // it will re-evaluate when preloadGoogleMaps() is eventually called because
    // PlaceInput triggers a re-render via its own interaction handlers.
    if (!loaderPromise) return

    let cancelled = false
    loaderPromise
      .then(() => { if (!cancelled) setLoaded(true) })
      .catch(() => { /* already logged in preloadGoogleMaps */ })

    return () => { cancelled = true }
  // Re-run any time loaderPromise changes (i.e. after preloadGoogleMaps fires).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaderPromise])

  return loaded
}
