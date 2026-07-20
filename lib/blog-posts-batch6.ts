import type { BlogPost } from './blog-posts'

export const BATCH6_BLOG_POSTS: BlogPost[] = [

  // ── Addis Ababa Taxi Fares ──────────────────────────────────────────────────

  {
    slug: 'how-much-does-a-taxi-cost-in-addis-ababa',
    title: 'How Much Does a Taxi Cost in Addis Ababa? (2026 Fare Guide)',
    description: 'Addis Ababa taxis cost from Br30 minimum — a 5km city ride runs Br75–120. But unmetered contract taxis need a negotiated price. Here\'s the 2026 guide including Bole Airport fares, inDrive vs Ride app, and scams to avoid.',
    publishedAt: '2026-07-20',
    readingMinutes: 7,
    category: 'taxi',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    citySlug: 'addis-ababa',
    content: [
      {
        type: 'intro',
        body: 'Addis Ababa has two parallel taxi systems running side by side, and confusing them is the main source of tourist overcharging. Blue-and-white metered taxis (registered by the city) charge Br15 flag-fall and Br12 per kilometre — a 5km journey to the Bole district costs around Br75–120. Then there are unmetered contract taxis: any private car whose driver flags you down or parks outside a hotel offering rides. These are unregulated and require negotiation. For most visitors, the easiest solution is the Ride or inDrive app — transparent pricing, no negotiation, English interface.',
      },
      { type: 'h2', heading: 'Addis Ababa Taxi Fares at a Glance' },
      {
        type: 'table',
        rows: [
          { label: 'Metered taxi flag-fall', value: 'Br15' },
          { label: 'Rate per km (metered)', value: 'Br12' },
          { label: 'Minimum fare', value: 'Br30' },
          { label: '5 km journey (e.g. Bole → Piazza)', value: 'Br75–120' },
          { label: '10 km journey (cross-city)', value: 'Br135–180' },
          { label: 'Bole Airport → city centre (metered)', value: 'Br200–400' },
          { label: 'Bole Airport → city (inDrive / Ride app)', value: 'Br350–600 (variable)' },
          { label: 'Night surcharge (after 21:00)', value: '+20–30% on negotiated fares' },
        ],
      },
      { type: 'h2', heading: 'Metered vs Contract Taxis — What\'s the Difference?' },
      {
        type: 'p',
        body: 'Licensed metered taxis in Addis Ababa are registered blue-and-white sedans with a taximeter mounted on the dashboard. The meter starts at Br15 and ticks up at Br12 per kilometre. These are the honest, regulated option — insist the driver turns on the meter before you move. Contract taxis are unmetered private cars — they are not licensed taxis, they carry no meter, and they charge whatever the market will bear. Foreigners are routinely quoted 3–5x the fair rate. If a driver near a hotel or the airport quotes you a price without a meter in sight, that is a contract taxi. Either negotiate firmly (know the Ride app price for comparison) or walk to a metered rank.',
      },
      { type: 'h2', heading: 'Ride App and inDrive — The Recommended Option' },
      {
        type: 'p',
        body: 'Two apps dominate ride-hailing in Addis Ababa in 2026. Ride (formerly known as Feres) is the locally built platform — designed for Ethiopian roads and widely used by residents. inDrive, the global peer-to-peer app, has grown rapidly in East Africa and lets you propose your own price, which drivers can accept or counter. Both apps show the fare upfront, eliminate negotiation, and work in English. Download whichever is available before you land — connectivity in arrivals can be slow. A Bole Airport to Bole Medhanialem (city hotel zone) trip on inDrive runs approximately Br350–500.',
      },
      {
        type: 'ul',
        items: [
          'Ride app: Ethiopian-built, highest driver availability inside the city, fares slightly lower than inDrive',
          'inDrive: set your own offered price; drivers counter if needed — useful for longer routes',
          'Blue-and-white metered taxis: best for short city hops when no app driver is nearby',
          'Minibuses (blue-and-white): extremely cheap shared transport for locals — not practical for visitors with luggage',
          'Blue Nile taxi rank near Meskel Square is the best source of metered taxis in central Addis',
        ],
      },
      { type: 'h2', heading: 'Bole International Airport (ADD) to the City' },
      {
        type: 'p',
        body: 'Bole International Airport sits about 6km south-east of the city centre — a straightforward drive in normal traffic (20–35 minutes) that stretches to 60+ minutes during rush hour (7–9am, 5–8pm). At arrivals, avoid the drivers who approach you inside the terminal. Walk through the exits and either book via Ride/inDrive at the kerb, or look for the licensed taxi rank (blue-and-white cars with visible meters) to the left of the main exit. A metered taxi to Bole district hotels runs Br200–300; to the city centre (Meskel Square, Churchill Avenue) Br300–400. Do not pay more than Br600 for any airport-to-city journey in a metered cab.',
      },
      {
        type: 'tip',
        body: 'The Ethiopian Birr (ETB) is a controlled currency — do not exchange money at the airport at unofficial rates. Use bank ATMs (Commercial Bank of Ethiopia is reliable) or hotel exchange desks. Having Br200–500 in small notes ready for your arrival taxi is useful; most drivers do not carry change for large bills.',
      },
      { type: 'h2', heading: 'Scams to Know Before You Go' },
      {
        type: 'warning',
        body: 'Four common Addis Ababa taxi scams: (1) Airport touts — drivers who approach you inside the terminal and quote USD fares (Addis taxis charge in ETB; a USD quote is a tourist trap). (2) Meter not started — a metered taxi driver who "forgets" to turn on the meter, then charges a flat invented rate at destination. Always watch the meter click on before moving. (3) Detour for commission — some drivers offer to take you to a specific hotel, craft shop, or currency exchange they receive kickback from. State your destination clearly; if the driver resists, get out. (4) Wrong change — giving you torn or cancelled notes as change. Check notes are current ETB before leaving the cab.',
      },
      { type: 'h2', heading: 'Frequently Asked Questions' },
      {
        type: 'faq',
        faqs: [
          {
            q: 'What is the taxi price per km in Ethiopia in 2026?',
            a: 'Licensed metered taxis in Addis Ababa charge Br12 per kilometre after a Br15 flag-fall. A 10km journey costs approximately Br135–180 on the meter. Unmetered contract taxis have no fixed rate — negotiate before boarding, using the Ride app price as your reference.',
          },
          {
            q: 'How much is a taxi from Bole Airport to the city centre?',
            a: 'A metered taxi from Bole International Airport (ADD) to central Addis Ababa costs Br300–400. To Bole district hotels it is Br200–300. On the Ride or inDrive app, expect Br350–550 depending on destination and demand. Avoid drivers who approach you inside the terminal — walk to the metered rank or book via app.',
          },
          {
            q: 'Is Uber available in Addis Ababa?',
            a: 'Uber does not operate in Ethiopia. The local equivalent is Ride (formerly Feres) — the most widely used ride-hailing app in Addis Ababa. inDrive also operates across the city with a bidding model. Download one or both before you land.',
          },
          {
            q: 'Should I negotiate taxi fares in Addis Ababa?',
            a: 'For unmetered contract taxis, yes — negotiation is expected and necessary. Use the Ride or inDrive app price as a benchmark (open the app, enter your destination, see the estimate, then negotiate from there). For metered blue-and-white taxis, there is nothing to negotiate — insist the meter runs.',
          },
          {
            q: 'Is it safe to take a taxi in Addis Ababa at night?',
            a: 'App-booked taxis (Ride, inDrive) are safe at night — the driver\'s identity and route are tracked. Street-hailed taxis after dark carry more risk; if you need a late-night taxi, book via app or ask your hotel to arrange a car. Night fares on unmetered taxis are 20–30% higher — agree the price before boarding.',
          },
          {
            q: 'Do taxis in Addis Ababa take card or only cash?',
            a: 'App-booked rides (Ride, inDrive) typically accept mobile money or card through the app. Street-hailed metered taxis and contract taxis are cash only — Ethiopian Birr. Carry Br100–200 in small notes for short city trips; Br500 for airport runs.',
          },
        ],
      },
    ],
    references: [
      { label: 'Ethiopian Transport Authority — taxi licensing', url: 'https://www.mot.gov.et' },
      { label: 'Ride Ethiopia app (formerly Feres)', url: 'https://www.rideethiopia.com' },
    ],
  },

  // ── Punta Cana Taxi Fares ───────────────────────────────────────────────────

  {
    slug: 'how-much-does-a-taxi-cost-in-punta-cana',
    title: 'How Much Does a Taxi Cost in Punta Cana? (2026 Fare Guide)',
    description: 'Punta Cana taxis charge in USD with no meters — PUJ Airport to Bávaro runs $25–40. Here\'s the 2026 zone-by-zone guide: fixed rates, how to avoid overcharging, and when shared transfers beat private taxis.',
    publishedAt: '2026-07-20',
    readingMinutes: 6,
    category: 'taxi',
    city: 'Punta Cana',
    country: 'Dominican Republic',
    citySlug: 'punta-cana',
    content: [
      {
        type: 'intro',
        body: 'Punta Cana taxis operate on a zone-based fixed-rate system — there are no meters anywhere in the tourist corridor. Every fare is in USD (or the peso equivalent), agreed before you get in, and based on which zone you\'re going to. From Punta Cana International Airport (PUJ) to the Bávaro hotel strip, the going rate is $25–40 depending on your specific hotel and your negotiating ability. The main money-saving move: always check if your resort offers a shared shuttle (often $15–20 per person) before paying for a private taxi.',
      },
      { type: 'h2', heading: 'Punta Cana Taxi Fares at a Glance' },
      {
        type: 'table',
        rows: [
          { label: 'PUJ Airport → Bávaro (main hotel zone)', value: '$25–40 USD (private taxi)' },
          { label: 'PUJ Airport → Cap Cana', value: '$20–30 USD' },
          { label: 'PUJ Airport → Uvero Alto (far north)', value: '$55–75 USD' },
          { label: 'PUJ Airport → Miches', value: '$80–100 USD' },
          { label: 'Within Bávaro hotel zone (short hop)', value: '$15–25 USD' },
          { label: 'Bávaro → Altos de Chavón / La Romana', value: '$70–90 USD' },
          { label: 'Shared airport shuttle (resort transfer)', value: '$15–25 USD per person' },
          { label: 'Minimum fare (any journey)', value: '$15 USD' },
        ],
      },
      { type: 'h2', heading: 'Why Punta Cana Has No Meters' },
      {
        type: 'p',
        body: 'The Dominican Republic has a zone-based taxi regulation system rather than metered taxis in resort areas. AMET (the transit authority) sets official reference rates for common routes from Punta Cana Airport — but these are not displayed and not universally followed. In practice, every fare is a negotiation. Knowing the reference rates before you approach a driver is the single most effective thing you can do to pay a fair price. The rates in this guide reflect what tourists successfully pay in 2026 when they negotiate — not the inflated opening quotes.',
      },
      { type: 'h2', heading: 'Airport Taxis — What to Expect' },
      {
        type: 'p',
        body: 'At Punta Cana International Airport (PUJ), taxis queue in the official rank outside arrivals. Official taxis display a SITRAVETURS licence (the Dominican taxi union). The initial quote you receive will almost always be higher than the going rate — $50–60 for a journey that should be $30 is common. Politely state the price you know ("I\'ve been quoted $30 to Bávaro"), smile, and be willing to walk to the next driver. You will rarely need to walk more than two cars to find a driver who accepts a fair rate. Avoid anyone who approaches you inside the arrivals hall before you reach the official rank.',
      },
      {
        type: 'ul',
        items: [
          'Always agree the price in USD before luggage goes in the boot — changing it at the destination is a common dispute tactic',
          'Ask "Is that for the whole car?" — some drivers quote per-person rates that inflate to $80+ for groups',
          'Have USD cash ready — drivers do not always have change; small bills ($5, $10, $20) are valuable',
          'The SITRAVETURS taxi union publishes a rate sheet — you can ask to see it if quoted an inflated fare',
          'Shared airport shuttles (operadoras) are cheaper but slower — they drop multiple hotels in sequence',
          'Uber does not operate in Punta Cana — there is no ride-hailing app alternative in the tourist zone',
        ],
      },
      { type: 'h2', heading: 'Getting Around Within Bávaro' },
      {
        type: 'p',
        body: 'Within the Bávaro tourist zone (the main hotel strip running along the beach), taxis from hotel ranks charge $15–25 for short hops to restaurants, the San Juan Shopping Centre, or Palma Real mall. Many all-inclusive resorts include complimentary shuttles between sister properties — check with your hotel before paying for a taxi. Motoconchos (motorcycle taxis) operate throughout the area at $3–5 per trip — cheap, but not recommended for tourists unfamiliar with Dominican roads. For day trips to Saona Island, Hoyo Azul, or other excursions, pre-booked tour transfers are usually more economical than arranging private taxis.',
      },
      {
        type: 'tip',
        body: 'The best value taxi move in Punta Cana is to share with another group. If you meet other travellers going the same direction at the airport rank, splitting a $30–35 taxi four ways beats a $15/person shuttle on both price and convenience. Ask the driver if they\'ll accept two parties going to nearby hotels — most will.',
      },
      { type: 'h2', heading: 'Frequently Asked Questions' },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from Punta Cana Airport to Bávaro?',
            a: 'The going rate is $25–40 USD for a private taxi from PUJ Airport to the Bávaro hotel zone. The price varies by your specific hotel\'s distance from the airport and how well you negotiate. Shared shuttle transfers run $15–25 per person. Always agree the price before your luggage goes in the boot.',
          },
          {
            q: 'Are there meters in Punta Cana taxis?',
            a: 'No. Punta Cana and the wider Bávaro tourist zone operates entirely on negotiated fixed rates — there are no taximeters. This is normal and legal. Agree the price upfront in USD; do not enter the vehicle without a confirmed fare.',
          },
          {
            q: 'Is Uber available in Punta Cana?',
            a: 'No — Uber does not operate in Punta Cana or the Dominican Republic\'s resort areas. There is no ride-hailing app with transparent pricing available. Your options are official taxi ranks, hotel-arranged transfers, or pre-booked shuttle services.',
          },
          {
            q: 'How do I avoid being overcharged in Punta Cana?',
            a: 'Know the going rate before you approach a driver ($25–40 to Bávaro from the airport). State your price confidently — "Treinta dólares a [hotel name]?" — and move to the next driver if refused. Never let a driver load your luggage before agreeing a price. Avoid drivers who approach you inside the terminal before you reach the official rank outside.',
          },
          {
            q: 'How much should I tip a Punta Cana taxi driver?',
            a: 'Tipping is not expected on top of a negotiated fare — the negotiated price is the complete payment. That said, $1–2 for a helpful driver who assists with heavy luggage is a kind gesture. Do not feel obligated if the driver simply drove the route.',
          },
          {
            q: 'How far is Punta Cana Airport from the hotels?',
            a: 'PUJ Airport is centrally located within the tourist zone — most Bávaro hotels are 15–25 minutes away (10–20km). Cap Cana is closer (10–15 minutes). Uvero Alto to the north is 45–60 minutes. Miches is a full hour or more, which is why taxis there cost $80–100.',
          },
        ],
      },
    ],
    references: [
      { label: 'Punta Cana Airport (PUJ) official site', url: 'https://www.puntacanainternationalairport.com' },
      { label: 'AMET — Dominican Republic transit authority', url: 'https://amet.gob.do' },
    ],
  },

]
