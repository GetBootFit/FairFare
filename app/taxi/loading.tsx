import Image from 'next/image'

// Skeleton shown while the taxi page JS bundle loads
export default function TaxiLoading() {
  return (
    <div className="space-y-5 pb-8">
      {/* Branded loading indicator */}
      <div className="flex flex-col items-center gap-2 py-4">
        <Image
          src="/images/owl/stickers/owl-magnifying-glass.svg"
          alt=""
          aria-hidden="true"
          width={56}
          height={56}
          className="animate-pulse"
        />
        <p className="text-zinc-600 text-xs">Loading…</p>
      </div>

      {/* Skeleton */}
      <div className="space-y-5 animate-pulse">
        {/* Header */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-zinc-800 rounded-full" />
          <div className="h-7 w-48 bg-zinc-800 rounded-lg" />
          <div className="h-4 w-64 bg-zinc-800 rounded-full" />
        </div>

        {/* Form card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="h-12 bg-zinc-800 rounded-xl" />
          <div className="h-12 bg-zinc-800 rounded-xl" />
          <div className="h-11 bg-zinc-800 rounded-xl" />
        </div>

        {/* Popular cities chips */}
        <div className="space-y-2.5">
          <div className="h-3 w-28 bg-zinc-800 rounded-full" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-7 w-20 bg-zinc-800 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
