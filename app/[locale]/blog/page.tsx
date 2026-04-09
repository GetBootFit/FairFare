import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getAllBlogSlugs, getBlogPost, getFeaturedPost, type BlogPost } from '@/lib/blog-posts'
import { BlogIndexClient } from '@/components/BlogIndexClient'
import { EmailCapture } from '@/components/EmailCapture'
import { kvKeys, kvGet } from '@/lib/kv'
import { LOCALES, getTranslations, type Locale } from '@/lib/i18n'
import { TRANSLATED_SLUGS } from '@/lib/blog-translation'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com').replace(/\/$/, '')

/** All non-English locale codes supported by the app */
const NON_EN_LOCALES = LOCALES.filter((l) => l.code !== 'en').map((l) => l.code)
const VALID_LOCALE_SET = new Set<string>(NON_EN_LOCALES)

/** Map app locale codes to BCP 47 for hreflang (only tw differs) */
function toBcp47(locale: string): string {
  return locale === 'tw' ? 'zh-TW' : locale
}

// Locale blog index pages are built on demand (ISR) — no static params pre-built.
// This avoids any build-time API cost. Pages are cached after first request.
export const revalidate = 300
export const dynamicParams = true

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
  const { locale } = await params
  if (!VALID_LOCALE_SET.has(locale)) return { title: 'Not Found' }

  const t = getTranslations(locale as Locale)

  // Hreflang: en → /blog, each locale → /[locale]/blog
  const localeLanguages: Record<string, string> = {
    en: `${APP_URL}/blog`,
    'x-default': `${APP_URL}/blog`,
  }
  NON_EN_LOCALES.forEach((l) => {
    localeLanguages[toBcp47(l)] = `${APP_URL}/${l}/blog`
  })

  return {
    title: `${t.blog_heading} — Hootling`,
    description: t.blog_subheading,
    alternates: {
      canonical: `${APP_URL}/${locale}/blog`,
      languages: localeLanguages,
    },
    openGraph: {
      title: `${t.blog_heading} — Hootling`,
      description: t.blog_subheading,
      url: `${APP_URL}/${locale}/blog`,
      type: 'website',
    },
  }
}

export default async function LocaleBlogIndexPage(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params
  if (!VALID_LOCALE_SET.has(locale)) notFound()

  const t = getTranslations(locale as Locale)
  const featured = getFeaturedPost()

  // Static posts — only include slugs that have translated content to avoid
  // generating locale-prefixed links to untranslated posts (prevents redirect crawl waste)
  const staticSlugs = getAllBlogSlugs()
  const staticPosts: BlogPost[] = staticSlugs
    .filter((s) => TRANSLATED_SLUGS.has(s))
    .map((s) => getBlogPost(s)!)
    .filter(Boolean)

  // KV-published posts
  const kvPublishedKeys = await kvKeys('blog:published:*')
  const kvPosts = (
    await Promise.all(kvPublishedKeys.map((k) => kvGet<BlogPost>(k)))
  ).filter((p): p is BlogPost => !!p && !staticSlugs.includes(p.slug))

  const sorted = [...staticPosts, ...kvPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .filter((p) => p.slug !== featured?.slug)

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-zinc-400">{t.blog_breadcrumb}</span>
        </nav>
        <h1 className="text-xl font-bold text-white">{t.blog_heading}</h1>
        <p className="text-zinc-500 text-sm mt-1">{t.blog_subheading}</p>
      </div>

      {/* Email capture */}
      <EmailCapture feature="taxi" variant="blog" />

      {/* Post list — interactive search/filter (client component, responds to user's language) */}
      <BlogIndexClient posts={sorted} featured={featured} />
    </div>
  )
}
