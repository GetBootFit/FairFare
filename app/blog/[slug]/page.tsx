import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { getBlogPost, getAllBlogSlugs, type BlogSection } from '@/lib/blog-posts'
import { BlogAffiliateCard } from '@/components/BlogAffiliateCard'
import { getPartnersForZone } from '@/lib/affiliates'
import type { AffiliateCategory } from '@/data/affiliate-config'

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

// ── Static generation + ISR ───────────────────────────────────────────────────

// Regenerate at most once every 24 h (blog content changes infrequently)
export const revalidate = 86400

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Article Not Found' }

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'}/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      images: post.citySlug
        ? [
            {
              url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'}/api/og/city?city=${encodeURIComponent(post.citySlug)}`,
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
        ? [`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'}/api/og/city?city=${encodeURIComponent(post.citySlug)}`]
        : undefined,
    },
  }
}

// ── Section renderer ──────────────────────────────────────────────────────────

function RenderSection({ section }: { section: BlogSection }) {
  switch (section.type) {
    case 'intro':
      return (
        <p className="text-zinc-300 leading-relaxed text-sm">{section.body}</p>
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
              <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
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
  const post = getBlogPost(slug)
  if (!post) notFound()

  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      author: { '@type': 'Organization', name: 'Hootling Team', url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com' },
      publisher: { '@type': 'Organization', name: 'Hootling Team', url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com' },
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hootling.com'}/blog/${slug}`,
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

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
          <div className="flex items-center gap-3 text-xs text-zinc-600">
            <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className="text-xl font-bold text-white leading-snug">{post.title}</h1>
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
                {post.city} fare table <ArrowRight size={11} />
              </Link>
            )}
            {post.countrySlug && (
              <Link
                href={`/tipping/${post.countrySlug}`}
                className="inline-flex items-center gap-1.5 text-xs bg-teal-900/30 border border-teal-800/40 text-teal-400 rounded-full px-3 py-1.5 hover:bg-teal-900/50 transition-colors"
              >
                {post.country} tipping guide <ArrowRight size={11} />
              </Link>
            )}
          </div>
        )}

        {/* Main content */}
        <div className="space-y-4">
          {mainContent.map((section, i) => (
            <RenderSection key={i} section={section} />
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

        {/* CTA */}
        <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900 border border-purple-800/30 rounded-2xl p-5 text-center space-y-3">
          <p className="text-white font-semibold">Check your exact route fare</p>
          <p className="text-zinc-500 text-sm">
            Get real-time fare estimates with scam warnings — any city, any route.
          </p>
          <Link
            href="/taxi"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Check Route Fare <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </>
  )
}
