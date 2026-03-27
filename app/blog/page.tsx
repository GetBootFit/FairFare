import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getAllBlogSlugs, getBlogPost, getFeaturedPost } from '@/lib/blog-posts'
import { EmailCapture } from '@/components/EmailCapture'
import { BlogIndexClient } from '@/components/BlogIndexClient'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com').replace(/\/$/, '')

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Travel Tips & Taxi Guides — Hootling Blog',
  description:
    'Practical travel guides: how much taxis cost in Bangkok, Dubai, London, New York and more. Real meter rates, scam warnings and airport fare tables.',
  alternates: { canonical: `${APP_URL}/blog` },
  openGraph: {
    title: 'Hootling Travel Blog — Taxi Costs & Tipping Guides',
    description: 'Real taxi fares and tipping customs for travellers. Updated for 2026.',
    url: `${APP_URL}/blog`,
    type: 'website',
  },
}


export default function BlogIndexPage() {
  const featured = getFeaturedPost()
  const slugs = getAllBlogSlugs()
  const sorted = slugs
    .map((s) => getBlogPost(s)!)
    .filter(Boolean)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    // Exclude the featured post — BlogIndexClient pins it separately
    .filter((p) => p.slug !== featured?.slug)

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Travel Tips & Taxi Guides — Hootling Blog',
    description: 'Practical travel guides covering taxi fares, tipping customs, and travel tips for 120+ cities worldwide.',
    url: `${APP_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Hootling',
      url: APP_URL,
      logo: { '@type': 'ImageObject', url: `${APP_URL}/images/brand/hootling-logo-icon.png` },
    },
    hasPart: sorted.slice(0, 50).map((post) => ({
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      url: `${APP_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
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

      {/* Email capture */}
      <EmailCapture feature="taxi" variant="blog" />

      {/* Featured + search + tabs + article list (client-interactive) */}
      <BlogIndexClient posts={sorted} featured={featured} />
    </div>
    </>
  )
}
