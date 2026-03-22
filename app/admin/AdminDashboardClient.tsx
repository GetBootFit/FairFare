'use client'

import { useState, useEffect, useCallback } from 'react'
import { BarChart3, Settings, RefreshCw, Save, RotateCcw, ChevronDown, ChevronUp, ExternalLink, Eye, Car, Banknote, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import type { AffiliatePartner } from '@/data/affiliate-config'

interface MetricsData {
  affiliateClicks: Record<string, number>
  stripe: {
    grandTotal: number
    currency: string
    chargeCount: number
    byProduct: Record<string, { count: number; total: number; currency: string }>
    recent: Array<{ id: string; amount: number; currency: string; product: string; feature: string; date: string }>
  } | null
  generatedAt: string
}

interface Props {
  initialConfig: AffiliatePartner[]
}

export function AdminDashboardClient({ initialConfig }: Props) {
  const [activeTab, setActiveTab] = useState<'metrics' | 'config' | 'preview'>('metrics')
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
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

  // ─── Config editing helpers ────────────────────────────────────

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

  // ─── Metrics helpers ───────────────────────────────────────────

  function parseClicks(clicks: Record<string, number>) {
    const byPartner: Record<string, { total: number; byZone: Record<string, number> }> = {}
    for (const [key, val] of Object.entries(clicks)) {
      const parts = key.replace('affiliate:clicks:', '').split(':')
      if (parts.length < 2) continue
      const [partner, zone] = parts
      if (!zone || zone.match(/^\d{4}-\d{2}-\d{2}$/)) continue // skip daily keys and totals
      if (!byPartner[partner]) byPartner[partner] = { total: 0, byZone: {} }
      byPartner[partner].total += val
      byPartner[partner].byZone[zone] = (byPartner[partner].byZone[zone] ?? 0) + val
    }
    return Object.entries(byPartner).sort((a, b) => b[1].total - a[1].total)
  }

  const categoryColour: Record<string, string> = {
    transfer: 'text-teal-400',
    hotel: 'text-blue-400',
    tours: 'text-purple-400',
    esim: 'text-green-400',
    car: 'text-orange-400',
  }

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
            {tab === 'metrics' ? <BarChart3 size={13} /> : tab === 'config' ? <Settings size={13} /> : <Eye size={13} />}
            {tab === 'metrics' ? 'Metrics' : tab === 'config' ? 'Affiliate Config' : 'Preview'}
          </button>
        ))}
      </div>

      {/* ── METRICS TAB ── */}
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
              {/* Stripe Revenue */}
              {metrics.stripe && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-3">Revenue (last 50 charges)</p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-white">
                      ${metrics.stripe.grandTotal.toFixed(2)}
                    </span>
                    <span className="text-xs text-zinc-500">{metrics.stripe.chargeCount} charges</span>
                  </div>
                  <div className="space-y-1.5">
                    {Object.entries(metrics.stripe.byProduct).map(([product, data]) => (
                      <div key={product} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 capitalize">{product.replace('_', ' ')}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-600">{data.count}×</span>
                          <span className="text-zinc-300">${data.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {metrics.stripe.recent.length > 0 && (
                    <div className="mt-4 border-t border-zinc-800 pt-3">
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Recent</p>
                      <div className="space-y-1">
                        {metrics.stripe.recent.slice(0, 5).map(charge => (
                          <div key={charge.id} className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-500">{new Date(charge.date).toLocaleDateString()}</span>
                            <span className="text-zinc-500 capitalize">{charge.product} · {charge.feature}</span>
                            <span className="text-zinc-400">${charge.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Affiliate Clicks */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-3">Affiliate Clicks</p>
                {Object.keys(metrics.affiliateClicks).length === 0 ? (
                  <p className="text-xs text-zinc-600">No clicks tracked yet.</p>
                ) : (
                  <div className="space-y-2">
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

              <p className="text-[10px] text-zinc-700">
                Generated {new Date(metrics.generatedAt).toLocaleString()}
              </p>
            </>
          )}
        </div>
      )}

      {/* ── PREVIEW TAB ── */}
      {activeTab === 'preview' && <AdminPreviewTab />}

      {/* ── CONFIG TAB ── */}
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
                {/* Partner header row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Enable toggle */}
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

                  {/* Name + category */}
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

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpandedPartner(expandedPartner === partner.id ? null : partner.id)}
                    className="text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    {expandedPartner === partner.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Expanded editor */}
                {expandedPartner === partner.id && (
                  <div className="border-t border-zinc-800 px-4 py-4 space-y-3">
                    {/* Affiliate URL */}
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

                    {/* Priority */}
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

                    {/* Zones */}
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

// ─── Admin Preview Tab ──────────────────────────────────────────────────────────

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
          Token opens in a new tab.
        </p>
      </div>

      <div className="space-y-3">
        {/* Taxi */}
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

        {/* Tipping */}
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

      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-1.5">
        <p className="text-xs font-semibold text-zinc-400">How this works</p>
        <ul className="text-xs text-zinc-600 space-y-1 list-disc list-inside">
          <li>Calls <code className="text-zinc-500">/api/admin/preview-token</code> (admin cookie required)</li>
          <li>Issues a JWT signed with <code className="text-zinc-500">ENTITLEMENT_SECRET</code></li>
          <li>Stores token as <code className="text-zinc-500">ff_token</code> in localStorage</li>
          <li>Valid for 7 days — no payment needed</li>
        </ul>
      </div>
    </div>
  )
}
