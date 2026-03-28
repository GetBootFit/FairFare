import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-posts'

const CATEGORY_COLOUR: Record<BlogPost['category'], string> = {
  taxi:    'text-purple-400',
  tipping: 'text-teal-400',
  travel:  'text-blue-400',
}

const CATEGORY_LABEL: Record<BlogPost['category'], string> = {
  taxi:    'Taxi Fares',
  tipping: 'Tipping Guide',
  travel:  'Travel Tips',
}

interface Props {
  posts: BlogPost[]
}

/**
 * "Related Posts" strip — shown at the bottom of every blog article.
 *
 * Importance:
 *  • Creates cross-post internal links, letting PageRank flow between articles
 *    in the same city/category cluster.
 *  • Increases pages-per-session (Google uses session depth as a quality signal).
 *  • Provides topical context that helps Google understand the site's content graph.
 *
 * Ordering: city-match first (3 pts), country-match (2 pts), category-match (1 pt).
 * See getRelatedPosts() in lib/blog-posts.ts for the scoring logic.
 */
export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null

  return (
    <div className="border-t border-zinc-800 pt-6 space-y-3">
      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
        Related Guides
      </p>
      <div className="space-y-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex items-start justify-between gap-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl px-4 py-3 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className={`text-[10px] font-semibold uppercase tracking-wider mb-0.5 ${CATEGORY_COLOUR[post.category]}`}>
                {CATEGORY_LABEL[post.category]}
                {post.city ? ` · ${post.city}` : post.country ? ` · ${post.country}` : ''}
              </p>
              <p className="text-sm text-zinc-300 group-hover:text-white transition-colors leading-snug line-clamp-2">
                {post.title}
              </p>
              <p className="text-[10px] text-zinc-600 mt-1">{post.readingMinutes} min read</p>
            </div>
            <ChevronRight
              size={15}
              className="text-zinc-600 group-hover:text-zinc-400 shrink-0 mt-1 transition-colors"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
