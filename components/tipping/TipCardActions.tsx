'use client'

import { useState } from 'react'
import { Download, Share2, Check } from 'lucide-react'

interface Props {
  country: string
  iso2: string
  restaurant: string
  taxi: string
  hotel: string
  highlight: string
  slug: string
}

export function TipCardActions({ country, iso2, restaurant, taxi, hotel, highlight, slug }: Props) {
  const [copied, setCopied] = useState(false)

  const cardParams = new URLSearchParams({ country, iso2, restaurant, taxi, hotel, highlight })
  const downloadUrl = `/api/og/tipping-card?${cardParams}&download=1`
  const pageUrl = `https://www.hootling.com/tipping/${slug}`
  const shareTitle = `Tipping in ${country} — Hootling`
  const shareText = `Should you tip in ${country}? Get the full guide on Hootling.`

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: pageUrl })
      } catch {
        // User cancelled — ignore
      }
      return
    }
    // Fallback: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard not available — silent fail
    }
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      {/* Download card */}
      <a
        href={downloadUrl}
        download={`hootling-tipping-${iso2}.png`}
        onClick={(e) => e.stopPropagation()}
        title="Download tipping card"
        className="flex items-center justify-center w-7 h-7 rounded-lg text-zinc-600 hover:text-teal-400 hover:bg-teal-900/20 transition-colors"
      >
        <Download size={13} />
      </a>

      {/* Share / copy link */}
      <button
        onClick={(e) => { e.stopPropagation(); handleShare() }}
        title={copied ? 'Link copied!' : 'Share'}
        className="flex items-center justify-center w-7 h-7 rounded-lg text-zinc-600 hover:text-purple-400 hover:bg-purple-900/20 transition-colors"
      >
        {copied ? <Check size={13} className="text-green-400" /> : <Share2 size={13} />}
      </button>
    </div>
  )
}
