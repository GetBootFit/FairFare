'use client'

import { useState, useEffect, useCallback } from 'react'

export interface RecentSearch {
  pickup: string
  destination: string
  pickupPlaceId: string
  destPlaceId: string
  timestamp: number
}

const STORAGE_KEY = 'ff_recent_searches'
const MAX_RECENT = 3

function loadFromStorage(): RecentSearch[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as RecentSearch[]
  } catch {
    return []
  }
}

function saveToStorage(searches: RecentSearch[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
  } catch { /* storage full or unavailable */ }
}

export function useRecentSearches() {
  const [recent, setRecent] = useState<RecentSearch[]>([])

  useEffect(() => {
    setRecent(loadFromStorage())
  }, [])

  const addSearch = useCallback((search: Omit<RecentSearch, 'timestamp'>) => {
    if (!search.pickup.trim() || !search.destination.trim()) return
    setRecent((prev) => {
      const deduped = prev.filter(
        (r) => !(r.pickup === search.pickup && r.destination === search.destination)
      )
      const next = [{ ...search, timestamp: Date.now() }, ...deduped].slice(0, MAX_RECENT)
      saveToStorage(next)
      return next
    })
  }, [])

  return { recent, addSearch }
}
