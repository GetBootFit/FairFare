/**
 * Admin Dashboard — /admin
 *
 * Protected by middleware (admin_token cookie required).
 * Two panels:
 *   1. Metrics — affiliate click counts + Stripe revenue
 *   2. Affiliate config editor — toggle, reorder, update URLs live
 */

import { getAffiliateConfig } from '@/lib/affiliates'
import { AdminDashboardClient } from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const config = await getAffiliateConfig()

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-900 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-white">Hootling Admin</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Affiliate config + metrics</p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* Dashboard */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AdminDashboardClient initialConfig={config} />
      </div>
    </div>
  )
}
