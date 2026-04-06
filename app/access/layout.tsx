import type { Metadata } from 'next'

/** The /access page is a functional magic-link endpoint — not content to index. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
