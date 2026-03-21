/**
 * Optional Vercel KV (Redis) integration.
 *
 * All functions degrade gracefully when KV env vars are not configured,
 * so the app works identically in local dev without any Redis setup.
 *
 * Set to enable:
 *   KV_REST_API_URL=https://...
 *   KV_REST_API_TOKEN=...
 */

import { createClient, type VercelKV } from '@vercel/kv'

let _client: VercelKV | null = null

function getClient(): VercelKV | null {
  if (_client) return _client
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  _client = createClient({ url, token })
  return _client
}

/** Get a cached value. Returns null on miss or when KV is unavailable. */
export async function kvGet<T>(key: string): Promise<T | null> {
  try {
    const client = getClient()
    if (!client) return null
    return await client.get<T>(key)
  } catch {
    return null
  }
}

/** Set a value with a TTL in seconds. No-ops when KV is unavailable. */
export async function kvSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  try {
    const client = getClient()
    if (!client) return
    await client.set(key, value, { ex: ttlSeconds })
  } catch {
    // Non-fatal — fall back to in-memory cache
  }
}

/** Atomically increment a counter by 1. Returns the new value, or null when KV unavailable. */
export async function kvIncrement(key: string): Promise<number | null> {
  try {
    const client = getClient()
    if (!client) return null
    return await client.incr(key)
  } catch {
    return null
  }
}

/** Returns true if the key exists (used to mark Stripe sessions as used). */
export async function kvExists(key: string): Promise<boolean> {
  try {
    const client = getClient()
    if (!client) return false
    const result = await client.exists(key)
    return result === 1
  } catch {
    return false
  }
}

/** Delete a key. No-ops when KV is unavailable. */
export async function kvDelete(key: string): Promise<void> {
  try {
    const client = getClient()
    if (!client) return
    await client.del(key)
  } catch {
    // Non-fatal
  }
}

/** Get a value without TTL (for config storage without expiry). */
export async function kvSetPermanent(key: string, value: unknown): Promise<void> {
  try {
    const client = getClient()
    if (!client) return
    await client.set(key, value)
  } catch {
    // Non-fatal
  }
}

/** Scan keys matching a pattern. Returns empty array when KV unavailable. */
export async function kvKeys(pattern: string): Promise<string[]> {
  try {
    const client = getClient()
    if (!client) return []
    return await client.keys(pattern)
  } catch {
    return []
  }
}
