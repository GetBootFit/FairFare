import { HomeContent } from '@/components/HomeContent'

export default function HomePage() {
  return (
    <>
      <p className="sr-only">
        Hootling is an instant taxi fare checker and tipping guide for international travellers.
        Check accurate fare ranges in 120+ cities using real local meter rates, get city-specific
        scam warnings, and look up tipping customs for 50+ countries — restaurants, hotels, taxis,
        bars, tour guides, and delivery. No account required. Results in seconds.
      </p>
      <HomeContent />
    </>
  )
}
