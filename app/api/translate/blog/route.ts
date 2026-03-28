import { getBlogPost } from '@/lib/blog-posts'
import { kvGet } from '@/lib/kv'
import { getTranslatedBlogContent } from '@/lib/blog-translation'
import type { BlogPost } from '@/lib/blog-posts'

const SUPPORTED_LOCALES = new Set([
  'ar', 'es', 'fr', 'de', 'pt', 'it', 'id', 'vi', 'th', 'zh', 'tw', 'ja', 'ko', 'hi',
])

/**
 * GET /api/translate/blog?slug=...&locale=...
 *
 * Returns translated blog content for a given post slug and locale.
 * Checks KV cache first (365-day TTL); calls Claude on miss.
 * Falls back to English content on error.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const locale = searchParams.get('locale')

  if (!slug || !locale) {
    return Response.json({ error: 'slug and locale are required' }, { status: 400 })
  }
  if (!SUPPORTED_LOCALES.has(locale)) {
    return Response.json({ error: 'Unsupported locale' }, { status: 400 })
  }

  const post: BlogPost | undefined =
    getBlogPost(slug) ?? (await kvGet<BlogPost>(`blog:published:${slug}`)) ?? undefined

  if (!post) {
    return Response.json({ error: 'Post not found' }, { status: 404 })
  }

  const content = await getTranslatedBlogContent(post, locale)

  return Response.json(content, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  })
}
