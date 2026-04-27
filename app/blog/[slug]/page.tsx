import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ArrowRight, Plane, ExternalLink } from 'lucide-react'
import { getBlogPost, getAllBlogSlugs, getRelatedPosts, getWordCount, type BlogSection, type BlogPost } from '@/lib/blog-posts'
import { TRANSLATED_SLUGS } from '@/lib/blog-translation'
import { LOCALES } from '@/lib/i18n'

const NON_EN_LOCALES_SLUG = LOCALES.filter((l) => l.code !== 'en').map((l) => l.code)
function toBcp47Slug(locale: string): string { return locale === 'tw' ? 'zh-TW' : locale }
import { BlogAffiliateCard } from '@/components/BlogAffiliateCard'
import { RelatedPosts } from '@/components/RelatedPosts'
import { getPartnersForZone } from '@/lib/affiliates'
import { getAirportForCity } from '@/lib/airport-data'
import type { AffiliateCategory } from '@/data/affiliate-config'
import { EmailCapture } from '@/components/EmailCapture'
import { ScrollDepthTracker } from '@/components/ScrollDepthTracker'
import { kvGet } from '@/lib/kv'

/** Resolve a post from static TS files first, then KV (for auto-generated posts). */
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

// Country slug → ISO 3166-1 alpha-2 for flag images
const COUNTRY_FLAGS: Record<string, string> = {
  argentina:        'ar', australia:      'au', austria:        'at',
  brazil:           'br', cambodia:       'kh', canada:         'ca',
  chile:            'cl', china:          'cn', colombia:       'co',
  croatia:          'hr', cuba:           'cu', 'czech-republic':'cz',
  denmark:          'dk', egypt:          'eg', france:         'fr',
  germany:          'de', greece:         'gr', hungary:        'hu',
  india:            'in', indonesia:      'id', ireland:        'ie',
  israel:           'il', italy:          'it', japan:          'jp',
  kenya:            'ke', malaysia:       'my', mexico:         'mx',
  morocco:          'ma', netherlands:    'nl', 'new-zealand':  'nz',
  norway:           'no', peru:           'pe', philippines:    'ph',
  poland:           'pl', portugal:       'pt', qatar:          'qa',
  singapore:        'sg', 'south-africa': 'za', 'south-korea':  'kr',
  spain:            'es', 'sri-lanka':    'lk', sweden:         'se',
  switzerland:      'ch', thailand:       'th', turkey:         'tr',
  uae:              'ae', 'united-kingdom':'gb', usa:            'us',
  vietnam:          'vn',
}

/** Format a date string deterministically (no ICU dependency = no hydration mismatch). */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

// ── Static generation + ISR ───────────────────────────────────────────────────

// Regenerate at most once every 7 days (was 24h) — reduces Fluid CPU from daily ISR crawl triggers.
export const revalidate = 604800

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await resolvePost(slug)
  if (!post) return { title: 'Article Not Found' }

  const APP_URL_META = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com').replace(/\/$/, '')
  const localeLanguages: Record<string, string> = {
    en: `${APP_URL_META}/blog/${slug}`,
    'x-default': `${APP_URL_META}/blog/${slug}`,
  }
  // Only emit locale hreflang for slugs that have been translated.
  // Emitting hreflang for untranslated slugs causes Google to follow locale URLs
  // that redirect back to English — triggering "Page with redirect" in GSC.
  if (TRANSLATED_SLUGS.has(slug)) {
    NON_EN_LOCALES_SLUG.forEach((l) => {
      localeLanguages[toBcp47Slug(l)] = `${APP_URL_META}/${l}/blog/${slug}`
    })
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${APP_URL_META}/blog/${slug}`,
      languages: localeLanguages,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${APP_URL_META}/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      images: post.citySlug
        ? [
            {
              url: `${APP_URL_META}/api/og/city?city=${encodeURIComponent(post.citySlug)}`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.citySlug
        ? [`${APP_URL_META}/api/og/city?city=${encodeURIComponent(post.citySlug)}`]
        : undefined,
    },
  }
}

// ── Section renderer ──────────────────────────────────────────────────────────

function RenderSection({ section }: { section: BlogSection }) {
  switch (section.type) {
    case 'intro':
      // .post-intro is referenced by SpeakableSpecification — voice/AI reads this first
      return (
        <p className="post-intro text-zinc-300 leading-relaxed text-sm">{section.body}</p>
      )
    case 'h2':
      return (
        <h2 className="text-base font-bold text-white pt-2">{section.heading}</h2>
      )
    case 'h3':
      return (
        <h3 className="text-sm font-semibold text-zinc-200 pt-1">{section.heading}</h3>
      )
    case 'p':
      return (
        <p className="text-zinc-400 leading-relaxed text-sm">{section.body}</p>
      )
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
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 last:border-0"
            >
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
              {/* .post-faq-answer referenced by SpeakableSpecification for voice/AI readout */}
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

export default async function BlogArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await resolvePost(slug)
  if (!post) notFound()

  const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.hootling.com').replace(/\/$/, '')
  const canonicalUrl = `${APP_URL}/blog/${slug}`
  const ogImageUrl = post.citySlug
    ? `${APP_URL}/api/og/city?city=${encodeURIComponent(post.citySlug)}`
    : undefined

  // BlogPosting is a schema.org subtype of Article — more precise for blog content.
  // wordCount aids Google's quality assessment. image is required for rich results.
  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      wordCount: getWordCount(post),
      inLanguage: 'en',
      author: {
        '@type': 'Organization',
        name: 'Hootling',
        url: APP_URL,
        logo: { '@type': 'ImageObject', url: `${APP_URL}/images/brand/hootling-logo-icon.png` },
      },
      publisher: {
        '@type': 'Organization',
        name: 'Hootling',
        url: APP_URL,
        logo: { '@type': 'ImageObject', url: `${APP_URL}/images/brand/hootling-logo-icon.png` },
      },
      url: canonicalUrl,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      ...(ogImageUrl ? {
        image: { '@type': 'ImageObject', url: ogImageUrl, width: 1200, height: 630 },
      } : {}),
      // SpeakableSpecification — tells AI assistants and voice search engines which
      // parts of the page to read aloud. CSS selectors map to elements in the JSX below.
      // Google uses this for Google Assistant "Daily Briefing" and AI Overviews.
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.post-headline', '.post-intro', '.post-faq-answer'],
      },
    },
  ]

  // Add HowTo schema for instructional articles (those with h2 headings + body content)
  // Treats each h2 + following p/ul as a HowTo step
  const h2Sections = post.content.filter((s) => s.type === 'h2' && s.heading)
  if (h2Sections.length >= 2) {
    const steps = h2Sections.map((s, i) => {
      // Find next paragraph or list after this h2
      const h2Idx = post.content.indexOf(s)
      const nextContent = post.content.slice(h2Idx + 1).find(
        (c) => c.type === 'p' || c.type === 'ul'
      )
      const text = nextContent?.body ?? nextContent?.items?.join(' ') ?? s.heading ?? ''
      return {
        '@type': 'HowToStep',
        position: i + 1,
        name: s.heading,
        text,
      }
    })
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: post.title,
      description: post.description,
      step: steps,
    })
  }

  // Add FAQPage schema if any FAQ sections exist
  const faqSections = post.content.filter((s) => s.type === 'faq' && s.faqs?.length)
  if (faqSections.length > 0) {
    const allFaqs = faqSections.flatMap((s) => s.faqs ?? [])
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: allFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }

  // Split content into pre-FAQ and FAQ sections for layout
  const mainContent = post.content.filter((s) => s.type !== 'faq')
  const faqContent = post.content.filter((s) => s.type === 'faq')

  const blogCategories: AffiliateCategory[] =
    post.category === 'tipping' ? ['tours'] :
    post.category === 'travel' ? ['transfer', 'hotel'] :
    ['transfer']

  const affiliatePartners = await getPartnersForZone('blog', {
    categories: blogCategories,
    maxItems: 3,
  })

  // Airport CTA — only for taxi-category posts about cities with an airport page
  const airportData = post.category === 'taxi' && post.city
    ? getAirportForCity(post.city)
    : null

  // Related posts — 3 by relevance score (city > country > category)
  const relatedPosts = getRelatedPosts(post, 3)

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          suppressHydrationWarning
        />
      ))}

      <div className="space-y-5 pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/blog" className="hover:text-zinc-300 transition-colors">Blog</Link>
          <ChevronRight size={12} />
          <span className="text-zinc-400 truncate max-w-[180px]">{post.city ?? 'Article'}</span>
        </nav>

        {/* Header */}
        <div className="space-y-3">
          {/* zinc-400 on dark bg ≈ 6.5:1 — passes WCAG AA for small text (needs ≥4.5:1) */}
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span>{formatDate(post.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className="post-headline text-xl font-bold text-white leading-snug">{post.title}</h1>
          <p className="text-zinc-400 text-sm">{post.description}</p>
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

        {/* Related links */}
        {(post.citySlug || post.countrySlug) && (
          <div className="flex flex-wrap gap-2">
            {post.citySlug && (
              <Link
                href={`/taxi/${post.citySlug}`}
                className="inline-flex items-center gap-1.5 text-xs bg-purple-900/30 border border-purple-800/40 text-purple-400 rounded-full px-3 py-1.5 hover:bg-purple-900/50 transition-colors"
              >
                Check your exact {post.city} fare <ArrowRight size={11} />
              </Link>
            )}
            {post.countrySlug && (
              <Link
                href={`/tipping/${post.countrySlug}`}
                className="inline-flex items-center gap-1.5 text-xs bg-teal-900/30 border border-teal-800/40 text-teal-400 rounded-full px-3 py-1.5 hover:bg-teal-900/50 transition-colors"
              >
                {post.country} tipping customs <ArrowRight size={11} />
              </Link>
            )}
          </div>
        )}

        {/* Main content — early CTA injected after intro to catch readers before they bounce */}
        <div className="space-y-4">
          {mainContent.map((section, i) => (
            <React.Fragment key={i}>
              <RenderSection section={section} />
              {/* Inject CTA after the intro section for city/country posts */}
              {i === 0 && section.type === 'intro' && (post.citySlug || post.countrySlug) && (
                <div className="flex flex-col gap-2 py-1">
                  {post.citySlug && post.city && (
                    <Link
                      href="/taxi"
                      className="flex items-center justify-between gap-3 bg-purple-950/60 border border-purple-800/50 hover:border-purple-600/70 hover:bg-purple-900/50 rounded-xl px-4 py-3 transition-all group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">Check your {post.city} fare</p>
                        <p className="text-xs text-purple-300/70 mt-0.5">Route + scam warnings in seconds</p>
                      </div>
                      <ArrowRight size={16} className="text-purple-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </Link>
                  )}
                  {post.countrySlug && post.country && (
                    <Link
                      href="/tipping"
                      className="flex items-center justify-between gap-3 bg-teal-950/60 border border-teal-800/50 hover:border-teal-600/70 hover:bg-teal-900/50 rounded-xl px-4 py-3 transition-all group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{post.country} tipping guide</p>
                        <p className="text-xs text-teal-300/70 mt-0.5">Restaurants, taxis, hotels &amp; more</p>
                      </div>
                      <ArrowRight size={16} className="text-teal-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </Link>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* FAQ sections */}
        {faqContent.length > 0 && (
          <div className="space-y-4 pt-2">
            <h2 className="text-base font-bold text-white">Frequently Asked Questions</h2>
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

        {/* CTA — category-specific */}
        {post.category === 'taxi' && (
          <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900 border border-purple-800/30 rounded-2xl p-5 text-center space-y-3">
            <p className="text-white font-semibold">
              That&apos;s the general range — what&apos;s YOUR route?
            </p>
            <p className="text-zinc-500 text-sm">
              Fares shift by exact pickup point, time of day, and traffic. Get a personalised estimate
              for your specific journey{post.city ? ` in ${post.city}` : ''}, plus scam warnings and
              the phrase to say to your driver.
            </p>
            <Link
              href="/taxi"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Check My Exact Fare <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {post.category === 'tipping' && (
          <div className="bg-gradient-to-br from-teal-900/30 to-zinc-900 border border-teal-800/30 rounded-2xl p-5 text-center space-y-3">
            <p className="text-white font-semibold">
              Know exactly what to tip before you reach for your wallet
            </p>
            <p className="text-zinc-500 text-sm">
              Get the full tipping breakdown for{post.country ? ` ${post.country}` : ' your destination'} —
              restaurants, taxis, hotels, spas, and tour guides — in under 10 seconds.
            </p>
            <Link
              href={post.countrySlug ? `/tipping/${post.countrySlug}` : '/tipping'}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Get {post.country ?? 'My'} Tipping Guide <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {post.category === 'travel' && (
          <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900 border border-purple-800/30 rounded-2xl p-5 text-center space-y-3">
            <p className="text-white font-semibold">
              Go prepared — know the fair price before you land
            </p>
            <p className="text-zinc-500 text-sm">
              Check real taxi fares and local tipping customs for{post.city ? ` ${post.city}` : post.country ? ` ${post.country}` : ' your destination'} —
              so you never overpay on your first ride or leave an awkward tip.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/taxi"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Check Taxi Fares <ArrowRight size={15} />
              </Link>
              <Link
                href="/tipping"
                className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Tipping Guide <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}

        {/* Airport page CTA — taxi posts for cities with an airport landing page.
            Links /blog/how-much-taxi-cost-in-bangkok → /taxi/airport/BKK.
            High-intent cross-link: reader researching taxi costs → airport fare table. */}
        {airportData && (
          <div className="flex items-start gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-800/50 flex items-center justify-center shrink-0">
              <Plane size={17} className="text-purple-400" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-snug">
                Flying into {airportData.city}?
              </p>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                See the full {airportData.code} airport taxi fare table — route-by-route estimates,
                scam warnings, and cheaper alternatives.
              </p>
              <Link
                href={`/taxi/airport/${airportData.code}`}
                className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium mt-2 transition-colors"
              >
                {airportData.name} taxi fares <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        )}

        {/* External references — authoritative outbound links signal topical depth.
            Populated per-post in blog-posts.ts via the `references` field. */}
        {post.references && post.references.length > 0 && (
          <div className="border-t border-zinc-800 pt-5 space-y-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
              Sources &amp; Further Reading
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

        {/* Email capture — soft, after primary CTA */}
        <EmailCapture
          feature={post.category === 'tipping' ? 'tipping' : 'taxi'}
          variant="post"
        />

        {/* Related posts — cross-links within city/category cluster */}
        <RelatedPosts posts={relatedPosts} />
      </div>

      {/* Invisible scroll depth tracker — fires analytics events at 25/50/75/100% */}
      <ScrollDepthTracker
        slug={post.slug}
        feature={post.category === 'tipping' ? 'tipping' : post.category === 'travel' ? 'travel' : 'taxi'}
      />
    </>
  )
}
