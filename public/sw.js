/**
 * FairFare Service Worker
 * Strategy: Network-first with cache fallback. Offline page for failed navigations.
 */

const CACHE = 'ff-v1'

// Pages to pre-cache on install (app shell)
const PRECACHE = [
  '/',
  '/taxi',
  '/tipping',
  '/about',
  '/faq',
  '/offline',
]

// ── Install ──────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  )
  // Activate immediately — don't wait for old SW to be discarded
  self.skipWaiting()
})

// ── Activate ─────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  // Remove outdated caches
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  )
  // Take control of all clients immediately
  self.clients.claim()
})

// ── Fetch ─────────────────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip: non-GET, cross-origin requests, API routes, Next.js internals
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/success')
  ) {
    return
  }

  event.respondWith(networkFirstWithFallback(request))
})

async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request)

    // Cache successful HTML responses (pages)
    if (response.ok && request.headers.get('accept')?.includes('text/html')) {
      const cache = await caches.open(CACHE)
      cache.put(request, response.clone())
    }

    return response
  } catch {
    // Network failed — try cache
    const cached = await caches.match(request)
    if (cached) return cached

    // Nothing in cache — serve offline page for navigation requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline') ?? new Response('Offline', { status: 503 })
    }

    return new Response('Network error', { status: 503 })
  }
}
