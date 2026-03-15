// Skeleton shown while the tipping page JS bundle loads
export default function TippingLoading() {
  return (
    <div className="space-y-5 pb-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-4 w-28 bg-zinc-800 rounded-full" />
        <div className="h-7 w-52 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-60 bg-zinc-800 rounded-full" />
      </div>

      {/* Form card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
        <div className="h-12 bg-zinc-800 rounded-xl" />
        <div className="h-11 bg-zinc-800 rounded-xl" />
      </div>

      {/* Popular countries chips */}
      <div className="space-y-2.5">
        <div className="h-3 w-32 bg-zinc-800 rounded-full" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-7 w-24 bg-zinc-800 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
