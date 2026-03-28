/**
 * Server-side guard for /dev route.
 *
 * The client page (page.tsx) already has:
 *   if (process.env.NODE_ENV !== 'development') return null + router.replace('/')
 *
 * This server layout adds a second, stronger line of defence:
 *   • Calls notFound() at the server level before any JS reaches the browser
 *   • Prevents the /dev HTML/JS bundle from being served to production visitors
 *   • Eliminates even the brief blank-page flash before the client redirect fires
 *
 * In development (next dev), NODE_ENV === 'development', so this layout passes
 * through and the page renders normally.
 */
import { notFound } from 'next/navigation'

export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }
  return <>{children}</>
}
