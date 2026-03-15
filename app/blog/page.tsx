import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog-posts'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Travel Tips & Taxi Guides — Hootling Blog',
  description:
    'Practical travel guides: how much taxis cost in Bangkok, Dubai, London, New York and more. Real meter rates, scam warnings and airport fare tables.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'}/blog` },
  openGraph: {
    title: 'Hootling Travel Blog — Taxi Costs & Tipping Guides',
    description: 'Real taxi fares and tipping customs for travellers. Updated for 2026.',
    url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'}/blog`,
    type: 'website',
  },
}

const categoryLabel: Record<string, string> = {
  taxi: 'Taxi Fares',
  tipping: 'Tipping',
  travel: 'Travel Tips',
}

const categoryColor: Record<string, string> = {
  taxi: 'bg-purple-900/40 text-purple-400 border-purple-800/40',
  tipping: 'bg-teal-900/40 text-teal-400 border-teal-800/40',
  travel: 'bg-blue-900/40 text-blue-400 border-blue-800/40',
}

export default function BlogIndexPage() {
  const sorted = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-zinc-400">Blog</span>
        </nav>
        <h1 className="text-xl font-bold text-white">Travel Guides</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Real taxi fares, tipping customs, and local travel tips.
        </p>
      </div>

      {/* Article cards */}
      <div className="space-y-3">
        {sorted.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-zinc-900 border border-zinc-800 hover:border-purple-800/50 rounded-2xl p-4 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${categoryColor[post.category]}`}
                  >
                    {categoryLabel[post.category]}
                  </span>
                  {post.city && (
                    <span className="text-xs text-zinc-600">{post.city}</span>
                  )}
                </div>
                <h2 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs text-zinc-500 line-clamp-2">{post.description}</p>
              </div>
              <ChevronRight size={16} className="text-zinc-600 group-hover:text-purple-400 transition-colors shrink-0 mt-1" />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs text-zinc-600">
                {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span className="text-zinc-700">·</span>
              <span className="text-xs text-zinc-600">{post.readingMinutes} min read</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
