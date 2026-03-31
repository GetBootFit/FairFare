import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ArrowRight, Plane, ExternalLink } from 'lucide-react'
import {
  getBlogPost, getRelatedPosts, getWordCount, type BlogSection, type BlogPost,
} from '@/lib/blog-posts'
import { getTranslatedBlogContent, TRANSLATED_SLUGS } from '@/lib/blog-translation'
import { BlogAffiliateCard } from '@/components/BlogAffiliateCard'
import { RelatedPosts } from '@/components/RelatedPosts'
import { getPartnersForZone } from '@/lib/affiliates'
import { getAirportForCity } from '@/lib/airport-data'
import type { AffiliateCategory } from '@/data/affiliate-config'
import { EmailCapture } from '@/components/EmailCapture'
import { ScrollDepthTracker } from '@/components/ScrollDepthTracker'
import { kvGet } from '@/lib/kv'
import { LOCALES, getTranslations, interpolate, type Locale } from '@/lib/i18n'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com').replace(/\/$/, '')

/** Format a date string deterministically (no ICU dependency = no hydration mismatch). */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

const NON_EN_LOCALES = LOCALES.filter((l) => l.code !== 'en').map((l) => l.code)
const VALID_LOCALE_SET = new Set<string>(NON_EN_LOCALES)

function toBcp47(locale: string): string {
  return locale === 'tw' ? 'zh-TW' : locale
}

/** Resolve a post from static TS files first, then KV. */
async function resolvePost(slug: string): Promise<BlogPost | undefined> {
  return getBlogPost(slug) ?? (await kvGet<BlogPost>(`blog:published:${slug}`)) ?? undefined
}

// City SVG sticker map — 13 illustrated cities
const CITY_IMAGES: Record<string, string> = {
  amsterdam:  '/images/cities/Amsterdam.svg',
  bangkok:    '/images/cities/Bangkok.svg',
  barcelona:  '/images/cities/Barcelona.svg',
  dubai:      '/images/cities/Dubai.svg',
  istanbul:   '/images/cities/Istanbul.svg',
  london:     '/images/cities/London.svg',
  melbourne:  '/images/cities/Melbourne.svg',
  'new-york': '/images/cities/NewYork.svg',
  paris:      '/images/cities/Paris.svg',
  rome:       '/images/cities/Rome.svg',
  singapore:  '/images/cities/Singapore.svg',
  sydney:     '/images/cities/Sydney.svg',
  tokyo:      '/images/cities/Tokyo.svg',
}

const COUNTRY_FLAGS: Record<string, string> = {
  argentina: 'ar', australia: 'au', austria: 'at', brazil: 'br', cambodia: 'kh',
  canada: 'ca', chile: 'cl', china: 'cn', colombia: 'co', croatia: 'hr', cuba: 'cu',
  'czech-republic': 'cz', denmark: 'dk', egypt: 'eg', france: 'fr', germany: 'de',
  greece: 'gr', hungary: 'hu', india: 'in', indonesia: 'id', ireland: 'ie',
  israel: 'il', italy: 'it', japan: 'jp', kenya: 'ke', malaysia: 'my', mexico: 'mx',
  morocco: 'ma', netherlands: 'nl', 'new-zealand': 'nz', norway: 'no', peru: 'pe',
  philippines: 'ph', poland: 'pl', portugal: 'pt', qatar: 'qa', singapore: 'sg',
  'south-africa': 'za', 'south-korea': 'kr', spain: 'es', 'sri-lanka': 'lk',
  sweden: 'se', switzerland: 'ch', thailand: 'th', turkey: 'tr', uae: 'ae',
  'united-kingdom': 'gb', usa: 'us', vietnam: 'vn',
}

// No static params — pages are built on demand (ISR) to avoid pre-building
// 100 posts × 14 locales = 1,400 pages and incurring ~$40-80 Claude cost.
export const revalidate = 86400
export const dynamicParams = true

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; slug: string }> },
): Promise<Metadata> {
  const { locale, slug } = await params
  if (!VALID_LOCALE_SET.has(locale)) return { title: 'Not Found' }
  if (!TRANSLATED_SLUGS.has(slug)) return { title: 'Not Found' }

  const post = await resolvePost(slug)
  if (!post) return { title: 'Article Not Found' }

  // Translated title/description for non-English meta
  const translated = await getTranslatedBlogContent(post, locale)

  // Hreflang: en → /blog/{slug}, each locale → /[locale]/blog/{slug}
  const localeLanguages: Record<string, string> = {
    en: `${APP_URL}/blog/${slug}`,
    'x-default': `${APP_URL}/blog/${slug}`,
  }
  NON_EN_LOCALES.forEach((l) => {
    localeLanguages[toBcp47(l)] = `${APP_URL}/${l}/blog/${slug}`
  })

  return {
    title: translated.title,
    description: translated.description,
    alternates: {
      canonical: `${APP_URL}/${locale}/blog/${slug}`,
      languages: localeLanguages,
    },
    openGraph: {
      title: translated.title,
      description: translated.description,
      url: `${APP_URL}/${locale}/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      images: post.citySlug
        ? [{ url: `${APP_URL}/api/og/city?city=${encodeURIComponent(post.citySlug)}`, width: 1200, height: 630, alt: translated.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: translated.title,
      description: translated.description,
    },
  }
}

// ── Section renderer (same as English page) ───────────────────────────────────

function RenderSection({ section }: { section: BlogSection }) {
  switch (section.type) {
    case 'intro':
      return <p className="post-intro text-zinc-300 leading-relaxed text-sm">{section.body}</p>
    case 'h2':
      return <h2 className="text-base font-bold text-white pt-2">{section.heading}</h2>
    case 'h3':
      return <h3 className="text-sm font-semibold text-zinc-200 pt-1">{section.heading}</h3>
    case 'p':
      return <p className="text-zinc-400 leading-relaxed text-sm">{section.body}</p>
    case 'ul':
      return (
        <ul className="space-y-2">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
              <span className="text-purple-400 mt-0.5 shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
      )
    case 'table':
      return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {section.rows?.map((row, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 last:border-0">
              <span className="text-sm text-zinc-400">{row.label}</span>
              <span className="text-sm font-semibold text-white ml-4 text-right">{row.value}</span>
            </div>
          ))}
        </div>
      )
    case 'tip':
      return (
        <div className="flex gap-3 bg-teal-900/20 border border-teal-800/40 rounded-xl p-3.5">
          <span className="text-teal-400 shrink-0 mt-0.5">💡</span>
          <p className="text-sm text-teal-200 leading-relaxed">{section.body}</p>
        </div>
      )
    case 'warning':
      return (
        <div className="flex gap-3 bg-red-900/20 border border-red-800/40 rounded-xl p-3.5">
          <span className="text-red-400 shrink-0 mt-0.5">⚠️</span>
          <p className="text-sm text-red-200 leading-relaxed">{section.body}</p>
        </div>
      )
    case 'faq':
      return (
        <div className="space-y-3">
          {section.faqs?.map((faq, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1.5">
              <p className="text-sm font-semibold text-white">{faq.q}</p>
              <p className="post-faq-answer text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      )
    default:
      return null
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function LocaleBlogArticlePage(
  { params }: { params: Promise<{ locale: string; slug: string }> },
) {
  const { locale, slug } = await params
  if (!VALID_LOCALE_SET.has(locale)) notFound()

  // If this slug hasn't been translated yet, send Google to the English canonical.
  // This prevents thin/duplicate content on locale URLs for untranslated posts.
  if (!TRANSLATED_SLUGS.has(slug)) redirect(`/blog/${slug}`)

  const post = await resolvePost(slug)
  if (!post) notFound()

  const t = getTranslations(locale as Locale)
  const translated = await getTranslatedBlogContent(post, locale)

  const mainContent = translated.sections.filter((s) => s.type !== 'faq')
  const faqContent = translated.sections.filter((s) => s.type === 'faq')

  const blogCategories: AffiliateCategory[] =
    post.category === 'tipping' ? ['tours'] :
    post.category === 'travel' ? ['transfer', 'hotel'] :
    ['transfer']

  const affiliatePartners = await getPartnersForZone('blog', {
    categories: blogCategories,
    maxItems: 3,
  })

  const airportData = post.category === 'taxi' && post.city
    ? getAirportForCity(post.city)
    : null

  const relatedPosts = getRelatedPosts(post, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: translated.title,
    description: translated.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    wordCount: getWordCount(post),
    inLanguage: toBcp47(locale),
    author: { '@type': 'Organization', name: 'Hootling', url: APP_URL },
    publisher: { '@type': 'Organization', name: 'Hootling', url: APP_URL },
    url: `${APP_URL}/${locale}/blog/${slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${APP_URL}/${locale}/blog/${slug}` },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />

      <div className="space-y-5 pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/${locale}/blog`} className="hover:text-zinc-300 transition-colors">
            {t.blog_breadcrumb}
          </Link>
          <ChevronRight size={12} />
          <span className="text-zinc-400 truncate max-w-[180px]">{post.city ?? 'Article'}</span>
        </nav>

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span>
              {formatDate(post.publishedAt)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{interpolate(t.blog_min_read, { n: String(post.readingMinutes) })}</span>
          </div>
          <h1 className="post-headline text-xl font-bold text-white leading-snug">
            {translated.title}
          </h1>
          <p className="text-zinc-400 text-sm">{translated.description}</p>
        </div>

        {/* Post hero image — city sticker or country flag */}
        {(() => {
          const cityImg = post.citySlug ? CITY_IMAGES[post.citySlug] : undefined
          const flagCode = post.countrySlug ? COUNTRY_FLAGS[post.countrySlug] : undefined
          const flagImg = flagCode ? `/images/flags/${flagCode}.svg` : undefined
          const src = cityImg ?? flagImg
          if (!src) return null
          const isCitySticker = !!cityImg
          return (
            <div className={`flex ${isCitySticker ? 'justify-center' : 'justify-start'} py-2`}>
              <Image
                src={src}
                alt={isCitySticker ? `${post.city} city illustration` : `${post.country} flag`}
                width={isCitySticker ? 120 : 64}
                height={isCitySticker ? 120 : 48}
                unoptimized
                className={isCitySticker ? 'opacity-90 drop-shadow-lg' : 'rounded shadow-sm'}
              />
            </div>
          )
        })()}

        {/* Quick links to fare check / tipping guide */}
        {(post.citySlug || post.countrySlug) && (
          <div className="flex flex-wrap gap-2">
            {post.citySlug && post.city && (
              <Link
                href={`/taxi/${post.citySlug}`}
                className="inline-flex items-center gap-1.5 text-xs bg-purple-900/30 border border-purple-800/40 text-purple-400 rounded-full px-3 py-1.5 hover:bg-purple-900/50 transition-colors"
              >
                {interpolate(t.blog_check_fare, { city: post.city })} <ArrowRight size={11} />
              </Link>
            )}
            {post.countrySlug && post.country && (
              <Link
                href={`/tipping/${post.countrySlug}`}
                className="inline-flex items-center gap-1.5 text-xs bg-teal-900/30 border border-teal-800/40 text-teal-400 rounded-full px-3 py-1.5 hover:bg-teal-900/50 transition-colors"
              >
                {interpolate(t.blog_tipping_customs, { country: post.country })} <ArrowRight size={11} />
              </Link>
            )}
          </div>
        )}

        {/* Translated main content */}
        <div className="space-y-4">
          {mainContent.map((section, i) => (
            <RenderSection key={i} section={section} />
          ))}
        </div>

        {/* FAQ sections */}
        {faqContent.length > 0 && (
          <div className="space-y-4 pt-2">
            <h2 className="text-base font-bold text-white">{t.blog_faq_heading}</h2>
            {faqContent.map((section, i) => (
              <RenderSection key={i} section={section} />
            ))}
          </div>
        )}

        <BlogAffiliateCard
          partners={affiliatePartners}
          category={post.category}
          city={post.city}
          country={post.country}
        />

        {/* CTA — category-specific (English links — taxi/tipping tools are English-only for now) */}
        {post.category === 'taxi' && (
          <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900 border border-purple-800/30 rounded-2xl p-5 text-center space-y-3">
            <p className="text-white font-semibold">
              {interpolate(t.blog_check_fare, { city: post.city ?? '' })}
            </p>
            <Link
              href="/taxi"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Hootling <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {post.category === 'tipping' && (
          <div className="bg-gradient-to-br from-teal-900/30 to-zinc-900 border border-teal-800/30 rounded-2xl p-5 text-center space-y-3">
            <p className="text-white font-semibold">
              {post.country && interpolate(t.blog_tipping_customs, { country: post.country })}
            </p>
            <Link
              href={post.countrySlug ? `/tipping/${post.countrySlug}` : '/tipping'}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Hootling <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {post.category === 'travel' && (
          <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900 border border-purple-800/30 rounded-2xl p-5 text-center space-y-3">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/taxi"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Taxi <ArrowRight size={15} />
              </Link>
              <Link
                href="/tipping"
                className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Tipping <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}

        {/* Airport page CTA */}
        {airportData && (
          <div className="flex items-start gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-800/50 flex items-center justify-center shrink-0">
              <Plane size={17} className="text-purple-400" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-snug">
                {airportData.city}
              </p>
              <Link
                href={`/taxi/airport/${airportData.code}`}
                className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium mt-2 transition-colors"
              >
                {airportData.name} <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        )}

        {/* External references */}
        {post.references && post.references.length > 0 && (
          <div className="border-t border-zinc-800 pt-5 space-y-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
              {t.blog_sources}
            </p>
            <ul className="space-y-1.5">
              {post.references.map((ref) => (
                <li key={ref.url}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <ExternalLink size={11} className="shrink-0 text-zinc-600" aria-hidden="true" />
                    {ref.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Email capture */}
        <EmailCapture
          feature={post.category === 'tipping' ? 'tipping' : 'taxi'}
          variant="post"
        />

        {/* Related posts */}
        <RelatedPosts posts={relatedPosts} />
      </div>

      <ScrollDepthTracker
        slug={post.slug}
        feature={post.category === 'tipping' ? 'tipping' : post.category === 'travel' ? 'travel' : 'taxi'}
      />
    </>
  )
}
