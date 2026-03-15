// Skeleton shown while a blog article loads
export default function BlogSlugLoading() {
  return (
    <article className="space-y-5 pb-10 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <div className="h-3 w-10 bg-zinc-800 rounded-full" />
        <div className="h-3 w-3 bg-zinc-800 rounded-full" />
        <div className="h-3 w-32 bg-zinc-800 rounded-full" />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <div className="h-8 w-full bg-zinc-800 rounded-lg" />
        <div className="h-8 w-3/4 bg-zinc-800 rounded-lg" />
      </div>

      {/* Meta row */}
      <div className="flex gap-3">
        <div className="h-4 w-20 bg-zinc-800 rounded-full" />
        <div className="h-4 w-16 bg-zinc-800 rounded-full" />
        <div className="h-4 w-14 bg-zinc-800 rounded-full" />
      </div>

      {/* Body paragraphs */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-5 w-40 bg-zinc-800 rounded-lg" />
          <div className="h-4 w-full bg-zinc-800 rounded-full" />
          <div className="h-4 w-5/6 bg-zinc-800 rounded-full" />
          <div className="h-4 w-4/5 bg-zinc-800 rounded-full" />
        </div>
      ))}

      {/* CTA placeholder */}
      <div className="h-12 bg-zinc-800 rounded-xl" />
    </article>
  )
}
