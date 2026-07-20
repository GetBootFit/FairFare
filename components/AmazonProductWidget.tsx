/**
 * AmazonProductWidget — geo-aware Amazon affiliate product cards for blog posts.
 *
 * Server component: reads x-vercel-ip-country to route AU/GB/CA visitors to their
 * local Amazon store; everyone else gets amazon.com. Uses search URLs (not ASINs)
 * so links always surface current in-stock products.
 *
 * Required disclosure: Amazon Associates Program Operating Agreement §5.
 */

import { headers } from 'next/headers'
import { ShoppingBag, ExternalLink } from 'lucide-react'

interface Product {
  name: string
  description: string
  query: string
  emoji: string
}

const PRODUCTS: Record<'taxi' | 'tipping' | 'travel', Product[]> = {
  taxi: [
    { name: 'Universal Travel Adapter', description: 'Works in 150+ countries', query: 'universal travel adapter all-in-one', emoji: '🔌' },
    { name: 'TSA Luggage Locks',        description: 'Airport-security approved', query: 'tsa approved luggage lock set', emoji: '🔒' },
    { name: 'Digital Luggage Scale',    description: 'Avoid excess baggage fees', query: 'portable digital luggage scale', emoji: '⚖️' },
  ],
  tipping: [
    { name: 'RFID Travel Wallet',  description: 'Secure cash & cards abroad', query: 'rfid blocking travel wallet slim', emoji: '👛' },
    { name: 'Travel Money Belt',   description: 'Hidden under-clothes pouch', query: 'travel money belt hidden waist', emoji: '💰' },
    { name: 'Compact Card Holder', description: 'For local notes & tips',      query: 'slim rfid card holder travel', emoji: '🃏' },
  ],
  travel: [
    { name: 'Universal Travel Adapter', description: 'Works in 150+ countries',     query: 'universal travel adapter all-in-one', emoji: '🔌' },
    { name: 'RFID Travel Wallet',       description: 'Secure cash & cards abroad',  query: 'rfid blocking travel wallet slim', emoji: '👛' },
    { name: 'Packing Cubes Set',        description: 'Organise your suitcase',      query: 'packing cubes set travel luggage', emoji: '🧳' },
  ],
}

const STORES: Record<string, { domain: string; tag: string }> = {
  AU: { domain: 'amazon.com.au', tag: 'getbootfit-22' },
  GB: { domain: 'amazon.co.uk',  tag: 'getbootfit-21' },
  CA: { domain: 'amazon.ca',     tag: 'getbootfit0d-20' },
}

const US_STORE = { domain: 'amazon.com', tag: 'getbootfit-20' }

interface Props {
  category: 'taxi' | 'tipping' | 'travel'
}

export async function AmazonProductWidget({ category }: Props) {
  const headersList = await headers()
  const country = headersList.get('x-vercel-ip-country') ?? ''
  const store = STORES[country] ?? US_STORE
  const products = PRODUCTS[category]

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <ShoppingBag size={13} className="text-amber-500 shrink-0" />
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Travel Essentials</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {products.map((product) => {
          const href = `https://www.${store.domain}/s?k=${encodeURIComponent(product.query)}&tag=${store.tag}`
          return (
            <a
              key={product.name}
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex flex-col gap-1 bg-zinc-900 border border-zinc-800 hover:border-amber-700/60 rounded-xl p-3 transition-all group"
            >
              <span className="text-lg leading-none">{product.emoji}</span>
              <p className="text-[11px] font-semibold text-white leading-snug group-hover:text-amber-300 transition-colors mt-1">
                {product.name}
              </p>
              <p className="text-[10px] text-zinc-500 leading-snug">{product.description}</p>
              <div className="flex items-center gap-1 mt-auto pt-1.5">
                <span className="text-[10px] text-amber-700 font-medium">Amazon</span>
                <ExternalLink size={8} className="text-amber-800 shrink-0" />
              </div>
            </a>
          )
        })}
      </div>

      <p className="text-[9px] text-zinc-600 leading-relaxed">
        As an Amazon Associate I earn from qualifying purchases.
      </p>
    </div>
  )
}
