'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight, Search, X, Pin } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts'
import { useLanguage } from '@/context/LanguageContext'

interface BlogIndexClientProps {
  posts: BlogPost[]        // All posts, sorted by date (featured already excluded from this list)
  featured?: BlogPost
}

const CATEGORY_BADGE: Record<string, string> = {
  taxi: 'bg-purple-900/40 text-purple-400 border-purple-800/40',
  tipping: 'bg-teal-900/40 text-teal-400 border-teal-800/40',
  travel: 'bg-blue-900/40 text-blue-400 border-blue-800/40',
}

type Category = 'all' | 'taxi' | 'tipping' | 'travel'

function PostCard({ post, categoryLabel }: { post: BlogPost; categoryLabel: string }) {
  const { t } = useLanguage()
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block bg-zinc-900 border border-zinc-800 hover:border-purple-800/50 rounded-2xl p-4 transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${CATEGORY_BADGE[post.category]}`}>
              {categoryLabel}
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
        <span className="text-xs text-zinc-600">{t('blog_min_read', { n: String(post.readingMinutes) })}</span>
      </div>
    </Link>
  )
}

export function BlogIndexClient({ posts, featured }: BlogIndexClientProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<Category>('all')
  const [search, setSearch] = useState('')

  const CATEGORY_LABEL: Record<string, string> = {
    taxi: t('blog_category_taxi'),
    tipping: t('blog_category_tipping'),
    travel: t('blog_category_travel'),
  }

  const TABS: { key: Category; label: string }[] = [
    { key: 'all', label: t('blog_category_all') },
    { key: 'taxi', label: t('blog_category_taxi') },
    { key: 'tipping', label: t('blog_category_tipping') },
    { key: 'travel', label: t('blog_category_travel') },
  ]

  const filtered = useMemo(() => {
    let result = posts
    if (activeTab !== 'all') {
      result = result.filter((p) => p.category === activeTab)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.city?.toLowerCase().includes(q) ?? false) ||
          (p.country?.toLowerCase().includes(q) ?? false),
      )
    }
    return result
  }, [posts, activeTab, search])

  const isFiltering = activeTab !== 'all' || search.trim().length > 0

  // When filtering, check if the featured post matches and include it in results
  const featuredMatchesFilter = useMemo(() => {
    if (!featured || !isFiltering) return false
    const matchesCategory = activeTab === 'all' || featured.category === activeTab
    if (!matchesCategory) return false
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      return (
        featured.title.toLowerCase().includes(q) ||
        featured.description.toLowerCase().includes(q) ||
        (featured.city?.toLowerCase().includes(q) ?? false) ||
        (featured.country?.toLowerCase().includes(q) ?? false)
      )
    }
    return true
  }, [featured, activeTab, search, isFiltering])

  const totalCount = isFiltering
    ? filtered.length + (featuredMatchesFilter ? 1 : 0)
    : null

  return (
    <div className="space-y-4">
      {/* ── Featured post — always pinned when not filtering, or shown if it matches ── */}
      {featured && (!isFiltering || featuredMatchesFilter) && (
        <Link
          href={`/blog/${featured.slug}`}
          className="block bg-gradient-to-br from-purple-950/60 to-zinc-900 border border-purple-800/40 hover:border-purple-700/60 rounded-2xl p-4 transition-colors group"
        >
          <div className="flex items-center gap-1.5 mb-2.5">
            <Pin size={10} className="text-purple-400 fill-purple-400" />
            <span className="text-[10px] text-purple-400 uppercase tracking-wider font-medium">{t('blog_featured')}</span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${CATEGORY_BADGE[featured.category]}`}>
                  {CATEGORY_LABEL[featured.category]}
                </span>
                {featured.city && (
                  <span className="text-xs text-zinc-500">{featured.city}</span>
                )}
              </div>
              <h2 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors leading-snug">
                {featured.title}
              </h2>
              <p className="text-xs text-zinc-400 line-clamp-2">{featured.description}</p>
            </div>
            <ChevronRight size={16} className="text-zinc-500 group-hover:text-purple-400 transition-colors shrink-0 mt-1" />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-zinc-600">
              {new Date(featured.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-zinc-600">{t('blog_min_read', { n: String(featured.readingMinutes) })}</span>
          </div>
        </Link>
      )}

      {/* ── Search ── */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
        <input
          type="text"
          placeholder={t('blog_search_placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-8 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* ── Category tabs ── */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              activeTab === tab.key
                ? 'bg-purple-900/50 border-purple-700/60 text-purple-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Results count ── */}
      {isFiltering && (
        <p className="text-xs text-zinc-600">
          {totalCount} {totalCount === 1 ? t('blog_article_singular') : t('blog_article_plural')}
          {search.trim() ? ` matching "${search.trim()}"` : ''}
          {activeTab !== 'all' ? ` in ${CATEGORY_LABEL[activeTab]}` : ''}
        </p>
      )}

      {/* ── Article list ── */}
      {filtered.length === 0 && !featuredMatchesFilter ? (
        <div className="text-center py-10 space-y-2">
          <p className="text-sm text-zinc-500">{t('blog_no_results')}</p>
          <button
            onClick={() => { setSearch(''); setActiveTab('all') }}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            {t('blog_clear_filters')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} categoryLabel={CATEGORY_LABEL[post.category]} />
          ))}
        </div>
      )}
    </div>
  )
}
