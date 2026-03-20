'use client'

import { useLanguage } from '@/context/LanguageContext'

/**
 * Next.js App Router error boundary for the /tipping route segment.
 *
 * Catches render errors and server-component errors that escape the
 * in-page <ErrorBoundary> wrapper. The `reset` function re-renders
 * the segment without a full page reload.
 */
export default function TippingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
      <span className="text-5xl" role="img" aria-label="Hootling owl">🦉</span>
      <div>
        <p className="text-white font-semibold text-lg">{t('error_heading')}</p>
        <p className="text-zinc-400 text-sm mt-1 max-w-xs mx-auto leading-relaxed">
          {error.message || t('error_tipping_body')}
        </p>
        {error.digest && (
          <p className="text-zinc-700 text-xs mt-2 font-mono">ref: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
      >
        {t('error_try_again')}
      </button>
    </div>
  )
}
