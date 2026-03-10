/**
 * Dev helper — generates a test JWT token so you can test the paid
 * experience without going through Stripe.
 *
 * Usage:  node scripts/gen-test-token.mjs
 * Then:   paste the localStorage line into your browser DevTools console
 */

import { SignJWT } from 'jose'
import { readFileSync } from 'fs'

// Read ENTITLEMENT_SECRET from .env.local
const env = readFileSync('.env.local', 'utf8')
const match = env.match(/ENTITLEMENT_SECRET[=\s]*"?([^\n"]+)"?/)
if (!match) {
  console.error('❌  ENTITLEMENT_SECRET not found in .env.local')
  process.exit(1)
}
const secret = new TextEncoder().encode(match[1].trim())

const token = await new SignJWT({
  tokenType: 'single',
  sessionId: 'dev-test-' + Date.now(),
  feature: 'taxi',
})
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('2h')
  .sign(secret)

console.log('\n✅  Test token generated (expires in 2 hours)\n')
console.log('Paste this into your browser DevTools console:\n')
console.log(`localStorage.setItem('ff_token', '${token}')`)
console.log('\nThen refresh the page and check your route — it should skip payment.\n')
