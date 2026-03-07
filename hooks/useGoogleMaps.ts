'use client'

import { useEffect, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

let loaderPromise: Promise<void> | null = null

function loadMaps(): Promise<void> {
  if (loaderPromise) return loaderPromise
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    version: 'weekly',
    libraries: ['places'],
  })
  loaderPromise = loader.load().then(() => undefined)
  return loaderPromise
}

export function useGoogleMaps(): boolean {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadMaps()
      .then(() => setLoaded(true))
      .catch((err) => console.error('Google Maps failed to load:', err))
  }, [])

  return loaded
}
