/**
 * Blog layout — widens to a comfortable reading column on desktop.
 *
 * The root layout constrains all pages to max-w-md (448px) centred with px-4.
 * On md+ screens we break out of that container using the full-bleed technique:
 *   width: 100vw  +  margin-left: calc(50% − 50vw − 1rem)
 * The inner wrapper then re-centres at max-w-2xl (42 rem / 672px) with generous
 * horizontal padding so line lengths stay readable (~65–75 chars).
 *
 * Mobile is unaffected — no breakout classes apply below md (768px).
 */

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:w-screen md:[margin-left:calc(50%-50vw-1rem)]">
      <div className="md:max-w-2xl md:mx-auto md:px-8">
        {children}
      </div>
    </div>
  )
}
