'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart3, Settings, RefreshCw, Save, RotateCcw,
  ChevronDown, ChevronUp, ExternalLink, Eye, Car, Banknote,
  CheckCircle, AlertCircle, Loader2, TrendingUp, TrendingDown,
  Database, MapPin,
} from 'lucide-react'
import type { AffiliatePartner } from '@/data/affiliate-config'
import type { MetricsResponse } from '@/app/api/admin/metrics/route'

interface Props {
  initialConfig: AffiliatePartner[]
}

export function AdminDashboardClient({ initialConfig }: Props) {
  const [activeTab, setActiveTab] = useState<'metrics' | 'config' | 'preview'>('metrics')
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null)
  const [metricsLoading, setMetricsLoading] = useState(false)
  const [config, setConfig] = useState<AffiliatePartner[]>(initialConfig)
  const [configDirty, setConfigDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [expandedPartner, setExpandedPartner] = useState<string | null>(null)

  const loadMetrics = useCallback(async () => {
    setMetricsLoading(true)
    try {
      const res = await fetch('/api/admin/metrics')
      const data = await res.json()
      setMetrics(data)
    } catch {
      // ignore
    } finally {
      setMetricsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'metrics' && !metrics) loadMetrics()
  }, [activeTab, metrics, loadMetrics])

  // ─── Config helpers ────────────────────────────────────────────────

  function updatePartner(id: string, changes: Partial<AffiliatePartner>) {
    setConfig(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p))
    setConfigDirty(true)
    setSaveMsg('')
  }

  async function saveConfig() {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      })
      const data = await res.json()
      if (res.ok) {
        setSaveMsg(`✓ Saved ${data.saved} partners`)
        setConfigDirty(false)
      } else {
        setSaveMsg(`✗ Error: ${data.error}`)
      }
    } catch {
      setSaveMsg('✗ Network error')
    } finally {
      setSaving(false)
    }
  }

  async function resetConfig() {
    if (!confirm('Reset to static defaults? This clears any KV overrides.')) return
    await fetch('/api/admin/config', { method: 'DELETE' })
    const res = await fetch('/api/admin/config')
    const data = await res.json()
    setConfig(data.config)
    setConfigDirty(false)
    setSaveMsg('✓ Reset to defaults')
  }

  // ─── Affiliate helpers ─────────────────────────────────────────────

  function parseClicks(clicks: Record<string, number>) {
    const byPartner: Record<string, { total: number; byZone: Record<string, number> }> = {}
    for (const [key, val] of Object.entries(clicks)) {
      const parts = key.replace('affiliate:clicks:', '').split(':')
      if (parts.length < 2) continue
      const [partner, zone] = parts
      if (!zone || zone.match(/^\d{4}-\d{2}-\d{2}$/)) continue
      if (!byPartner[partner]) byPartner[partner] = { total: 0, byZone: {} }
      byPartner[partner].total += val
      byPartner[partner].byZone[zone] = (byPartner[partner].byZone[zone] ?? 0) + val
    }
    return Object.entries(byPartner).sort((a, b) => b[1].total - a[1].total)
  }

  const categoryColour: Record<string, string> = {
    transfer: 'text-teal-400',
    hotel:    'text-blue-400',
    tours:    'text-purple-400',
    esim:     'text-green-400',
    car:      'text-orange-400',
  }

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 w-fit">
        {(['metrics', 'config', 'preview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === tab ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab === 'metrics' ? <BarChart3 size={13} />
              : tab === 'config' ? <Settings size={13} />
              : <Eye size={13} />}
            {tab === 'metrics' ? 'Metrics' : tab === 'config' ? 'Affiliate Config' : 'Preview'}
          </button>
        ))}
      </div>

      {/* ── METRICS TAB ─────────────────────────────────────────────── */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300">Performance</h2>
            <button
              onClick={loadMetrics}
              disabled={metricsLoading}
              className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <RefreshCw size={11} className={metricsLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {metricsLoading && !metrics && (
            <p className="text-xs text-zinc-600">Loading…</p>
          )}

          {metrics && (
            <>
              {/* ── Revenue overview ── */}
              {metrics.stripe && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-4">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Revenue</p>

                  {/* KPI row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] text-zinc-600 mb-1">All-time</p>
                      <p className="text-xl font-bold text-white">
                        ${metrics.stripe.grandTotal.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-zinc-600">{metrics.stripe.chargeCount} charges</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-600 mb-1">This month</p>
                      <p className="text-xl font-bold text-white">
                        ${metrics.stripe.thisMonth.toFixed(2)}
                      </p>
                      {metrics.stripe.lastMonth > 0 && (
                        <MoMBadge current={metrics.stripe.thisMonth} previous={metrics.stripe.lastMonth} />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-600 mb-1">Last month</p>
                      <p className="text-xl font-bold text-zinc-400">
                        ${metrics.stripe.lastMonth.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Monthly bar chart */}
                  {metrics.stripe.byMonth.length > 0 && (
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Last 6 months</p>
                      <MonthlyBar months={metrics.stripe.byMonth} />
                    </div>
                  )}

                  {/* By product */}
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">By product</p>
                    <div className="space-y-1.5">
                      {Object.entries(metrics.stripe.byProduct).map(([product, data]) => (
                        <div key={product} className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400 capitalize">{product.replace(/_/g, ' ')}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-zinc-600">{data.count}×</span>
                            <span className="text-zinc-300 font-medium">${data.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent charges */}
                  {metrics.stripe.recent.length > 0 && (
                    <div className="border-t border-zinc-800 pt-3">
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Recent charges</p>
                      <div className="space-y-1.5">
                        {metrics.stripe.recent.slice(0, 8).map(charge => (
                          <div key={charge.id} className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-600 w-20 shrink-0">
                              {new Date(charge.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-zinc-500 flex-1 capitalize">
                              {charge.product.replace(/_/g, ' ')} · {charge.feature}
                            </span>
                            <span className="text-zinc-300 font-medium">${charge.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Affiliate clicks ── */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Affiliate Clicks</p>

                {/* 7-day sparkline */}
                {Object.keys(metrics.last7DayClicks).length > 0 && (
                  <div>
                    <p className="text-[10px] text-zinc-600 mb-2">Last 7 days</p>
                    <SevenDayBar data={metrics.last7DayClicks} />
                  </div>
                )}

                {/* By partner */}
                {Object.keys(metrics.affiliateClicks).length === 0 ? (
                  <p className="text-xs text-zinc-600">No clicks tracked yet.</p>
                ) : (
                  <div className="space-y-2 pt-1">
                    {parseClicks(metrics.affiliateClicks).map(([partner, data]) => (
                      <div key={partner} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 capitalize">{partner.replace(/_/g, ' ')}</span>
                        <div className="flex items-center gap-3">
                          {Object.entries(data.byZone).map(([zone, count]) => (
                            <span key={zone} className="text-zinc-600">{zone}: {count}</span>
                          ))}
                          <span className="text-zinc-300 font-medium">{data.total} total</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── KV cache stats ── */}
              {metrics.kv && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Database size={13} className="text-zinc-600" />
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">KV Cache</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-800/60 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-zinc-600 mb-0.5">Taxi guides cached</p>
                      <p className="text-lg font-bold text-white">{metrics.kv.cacheEntries.taxi}</p>
                    </div>
                    <div className="bg-zinc-800/60 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-zinc-600 mb-0.5">Tipping guides cached</p>
                      <p className="text-lg font-bold text-white">{metrics.kv.cacheEntries.tipping}</p>
                    </div>
                  </div>

                  {/* City misses */}
                  {metrics.kv.cityMisses.length > 0 && (
                    <div className="border-t border-zinc-800 pt-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <MapPin size={11} className="text-amber-500" />
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                          City misses — searched but not in taxi-rates.json
                        </p>
                      </div>
                      <div className="space-y-1">
                        {metrics.kv.cityMisses.slice(0, 10).map(({ city, count }) => (
                          <div key={city} className="flex items-center justify-between text-xs">
                            <span className="text-zinc-400">{city}</span>
                            <span className="text-amber-500/80">{count}×</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <p className="text-[10px] text-zinc-700">
                Generated {new Date(metrics.generatedAt).toLocaleString()}
              </p>
            </>
          )}
        </div>
      )}

      {/* ── PREVIEW TAB ─────────────────────────────────────────────── */}
      {activeTab === 'preview' && <AdminPreviewTab />}

      {/* ── CONFIG TAB ──────────────────────────────────────────────── */}
      {activeTab === 'config' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300">Affiliate Partners</h2>
            <div className="flex items-center gap-2">
              {saveMsg && (
                <span className={`text-xs ${saveMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
                  {saveMsg}
                </span>
              )}
              <button
                onClick={resetConfig}
                className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <RotateCcw size={11} />
                Reset
              </button>
              <button
                onClick={saveConfig}
                disabled={saving || !configDirty}
                className="flex items-center gap-1.5 text-xs bg-white text-zinc-950 px-3 py-1.5 rounded-lg font-medium hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save size={11} />
                {saving ? 'Saving…' : 'Save to KV'}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-zinc-600">
            Changes saved to Vercel KV take effect immediately — no redeploy needed.
            Placeholder URLs (TRAVELPAYOUTS_*/IMPACT_*) are automatically hidden from users.
          </p>

          <div className="space-y-2">
            {config.map(partner => (
              <div
                key={partner.id}
                className={`rounded-xl border ${partner.enabled ? 'border-zinc-800' : 'border-zinc-900'} bg-zinc-900 overflow-hidden`}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <button
                    onClick={() => updatePartner(partner.id, { enabled: !partner.enabled })}
                    className={`w-8 h-4.5 rounded-full transition-colors relative shrink-0 ${
                      partner.enabled ? 'bg-teal-500' : 'bg-zinc-700'
                    }`}
                    aria-label={partner.enabled ? 'Disable partner' : 'Enable partner'}
                  >
                    <span
                      className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                        partner.enabled ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${partner.enabled ? 'text-zinc-200' : 'text-zinc-600'}`}>
                        {partner.name}
                      </span>
                      <span className={`text-[9px] uppercase tracking-wider ${categoryColour[partner.category] ?? 'text-zinc-600'}`}>
                        {partner.category}
                      </span>
                      {partner.baseUrl.startsWith('TRAVELPAYOUTS_') || partner.baseUrl.startsWith('IMPACT_') ? (
                        <span className="text-[9px] text-amber-600 uppercase tracking-wider">needs URL</span>
                      ) : (
                        <span className="text-[9px] text-green-600 uppercase tracking-wider">URL set</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-zinc-600">zones: {partner.zones.join(', ')}</span>
                      <span className="text-[10px] text-zinc-600">priority: {partner.priority}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedPartner(expandedPartner === partner.id ? null : partner.id)}
                    className="text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {expandedPartner === partner.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {expandedPartner === partner.id && (
                  <div className="border-t border-zinc-800 px-4 py-4 space-y-3">
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                        Affiliate URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={partner.baseUrl}
                          onChange={e => updatePartner(partner.id, { baseUrl: e.target.value })}
                          placeholder="https://..."
                          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
                        />
                        {!partner.baseUrl.startsWith('TRAVELPAYOUTS_') && !partner.baseUrl.startsWith('IMPACT_') && (
                          <a
                            href={partner.baseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-9 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors"
                          >
                            <ExternalLink size={12} className="text-zinc-400" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                        Priority (lower = shown first)
                      </label>
                      <input
                        type="number"
                        value={partner.priority}
                        min={1}
                        max={20}
                        onChange={e => updatePartner(partner.id, { priority: parseInt(e.target.value) || 1 })}
                        className="w-24 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                        Zones
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {(['result', 'preview', 'blog', 'success'] as const).map(zone => (
                          <label key={zone} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={partner.zones.includes(zone)}
                              onChange={e => {
                                const zones = e.target.checked
                                  ? [...partner.zones, zone]
                                  : partner.zones.filter(z => z !== zone)
                                updatePartner(partner.id, { zones })
                              }}
                              className="accent-teal-500"
                            />
                            <span className="text-xs text-zinc-400">{zone}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────────

/** Month-over-month change badge */
function MoMBadge({ current, previous }: { current: number; previous: number }) {
  const pct = previous === 0 ? 0 : ((current - previous) / previous) * 100
  const up = pct >= 0
  return (
    <div className={`flex items-center gap-0.5 text-[10px] ${up ? 'text-green-400' : 'text-red-400'}`}>
      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {Math.abs(pct).toFixed(0)}% vs last mo.
    </div>
  )
}

/** Simple bar chart for last 6 months revenue */
function MonthlyBar({ months }: { months: Array<{ month: string; total: number; count: number }> }) {
  const max = Math.max(...months.map(m => m.total), 1)
  return (
    <div className="flex items-end gap-1.5 h-16">
      {[...months].reverse().map(m => {
        const pct = (m.total / max) * 100
        const label = new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short' })
        return (
          <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="w-full flex items-end" style={{ height: '44px' }}>
              <div
                className="w-full rounded-t bg-purple-600/70 group-hover:bg-purple-500 transition-colors"
                style={{ height: `${Math.max(pct, 4)}%` }}
              />
            </div>
            <span className="text-[9px] text-zinc-600">{label}</span>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              ${m.total.toFixed(2)} · {m.count} charges
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Bar chart for last 7 days affiliate clicks */
function SevenDayBar({ data }: { data: Record<string, number> }) {
  const sorted = Object.entries(data).sort(([a], [b]) => a.localeCompare(b))
  const max = Math.max(...sorted.map(([, v]) => v), 1)
  const total = sorted.reduce((s, [, v]) => s + v, 0)
  if (total === 0) {
    return <p className="text-xs text-zinc-600">No clicks in the last 7 days.</p>
  }
  return (
    <div className="flex items-end gap-1 h-10">
      {sorted.map(([date, count]) => {
        const pct = (count / max) * 100
        const label = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)
        return (
          <div key={date} className="flex-1 flex flex-col items-center gap-0.5 group relative">
            <div className="w-full flex items-end" style={{ height: '28px' }}>
              <div
                className="w-full rounded-t bg-teal-600/70 group-hover:bg-teal-500 transition-colors"
                style={{ height: `${Math.max(pct, 8)}%` }}
              />
            </div>
            <span className="text-[9px] text-zinc-600">{label}</span>
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {count} clicks
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Preview tab ─────────────────────────────────────────────────────────────────

type PreviewStatus = 'idle' | 'loading' | 'success' | 'error'

function AdminPreviewTab() {
  const [taxi, setTaxi] = useState<{ status: PreviewStatus; message: string }>({ status: 'idle', message: '' })
  const [tipping, setTipping] = useState<{ status: PreviewStatus; message: string }>({ status: 'idle', message: '' })

  async function getPreviewToken(feature: 'taxi' | 'tipping') {
    const setter = feature === 'taxi' ? setTaxi : setTipping
    setter({ status: 'loading', message: '' })
    try {
      const res = await fetch(`/api/admin/preview-token?feature=${feature}`)
      const data = await res.json()
      if (!res.ok || !data.token) {
        setter({ status: 'error', message: data.error ?? 'Unknown error' })
        return
      }
      localStorage.setItem('ff_token', data.token)
      setter({ status: 'success', message: `✓ Token stored (7 days). Opening /${feature}…` })
      setTimeout(() => window.open(`/${feature}`, '_blank'), 800)
    } catch (err) {
      setter({ status: 'error', message: String(err) })
    }
  }

  function clearTokens() {
    localStorage.removeItem('ff_token')
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key?.startsWith('ff_pass_') || key?.startsWith('ff_bundle_')) localStorage.removeItem(key!)
    }
    setTaxi({ status: 'idle', message: '' })
    setTipping({ status: 'idle', message: '' })
    alert('All Hootling tokens cleared from localStorage.')
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-zinc-300">Preview Paid Pages</h2>
        <p className="text-xs text-zinc-600 mt-1">
          Issue a 7-day admin token to review paid features on the live site without going through Stripe.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => getPreviewToken('taxi')}
          disabled={taxi.status === 'loading' || taxi.status === 'success'}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-purple-800/50 hover:bg-zinc-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-900/20 flex items-center justify-center shrink-0">
            {taxi.status === 'loading' ? <Loader2 size={20} className="animate-spin text-zinc-400" />
              : taxi.status === 'success' ? <CheckCircle size={20} className="text-green-400" />
              : taxi.status === 'error' ? <AlertCircle size={20} className="text-red-400" />
              : <Car size={20} className="text-purple-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">Preview Taxi Fare Check</p>
            {taxi.message ? (
              <p className={`text-xs mt-0.5 ${taxi.status === 'error' ? 'text-red-400' : 'text-green-400'}`}>{taxi.message}</p>
            ) : (
              <p className="text-xs text-zinc-500 mt-0.5">Issues a 7-day token → opens /taxi in new tab</p>
            )}
          </div>
        </button>

        <button
          onClick={() => getPreviewToken('tipping')}
          disabled={tipping.status === 'loading' || tipping.status === 'success'}
          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-teal-800/50 hover:bg-zinc-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-900/20 flex items-center justify-center shrink-0">
            {tipping.status === 'loading' ? <Loader2 size={20} className="animate-spin text-zinc-400" />
              : tipping.status === 'success' ? <CheckCircle size={20} className="text-green-400" />
              : tipping.status === 'error' ? <AlertCircle size={20} className="text-red-400" />
              : <Banknote size={20} className="text-teal-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">Preview Tipping Guide</p>
            {tipping.message ? (
              <p className={`text-xs mt-0.5 ${tipping.status === 'error' ? 'text-red-400' : 'text-green-400'}`}>{tipping.message}</p>
            ) : (
              <p className="text-xs text-zinc-500 mt-0.5">Issues a 7-day token → opens /tipping in new tab</p>
            )}
          </div>
        </button>
      </div>

      <div className="pt-2 border-t border-zinc-800">
        <button
          onClick={clearTokens}
          className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
        >
          Clear all tokens from localStorage
        </button>
      </div>
    </div>
  )
}
