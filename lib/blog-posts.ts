export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string   // ISO date
  updatedAt?: string
  readingMinutes: number
  category: 'taxi' | 'tipping' | 'travel'
  city?: string
  country?: string
  citySlug?: string     // link to /taxi/[city] if it exists
  countrySlug?: string  // link to /tipping/[country] if it exists
  featured?: boolean    // pin this post at the top of the blog index + home page
  content: BlogSection[]
  /**
   * Outbound links to authoritative external sources (tourism boards, transport
   * authorities, Wikipedia etc.). Rendered at the bottom of every post as
   * "Sources & Further Reading" — signals topical authority to Google.
   */
  references?: Array<{ label: string; url: string }>
}

export interface BlogSection {
  type: 'intro' | 'h2' | 'h3' | 'p' | 'ul' | 'table' | 'tip' | 'warning' | 'faq'
  heading?: string
  body?: string
  items?: string[]
  rows?: { label: string; value: string }[]
  faqs?: { q: string; a: string }[]
}

export const BLOG_POSTS: BlogPost[] = [
  // ── Hootling Origin Story ──────────────────────────────────────────────────
  {
    slug: 'meet-hootling-the-travel-app-that-keeps-you-from-getting-ripped-off',
    title: 'Meet Hootling: The Travel App That Keeps You from Getting Ripped Off',
    description:
      'Introducing Hootling — the travel utility that checks taxi fares and tipping customs in 120+ cities worldwide. Know before you go. Pay right every time.',
    publishedAt: '2026-03-15',
    updatedAt: '2026-03-15',
    readingMinutes: 5,
    category: 'travel',
    content: [
      {
        type: 'intro',
        body: 'Every traveller has a story. A too-expensive taxi from the airport. An awkward moment at a restaurant table, wallet out, wondering if the locals tip here. We built Hootling to fix that.',
      },
      {
        type: 'h2',
        heading: 'The Problem Every Traveller Knows',
      },
      {
        type: 'p',
        body: 'You land in Bangkok after a long-haul flight. You\'re tired, you have luggage, and a driver is waiting with a hand-written sign. He quotes you 800 baht. Is that right? Is that a rip-off? You have no idea. You accept it because you don\'t know any better. Later, you find out the metered fare should have been 280 baht.\n\nThat moment — the uncertainty, the powerlessness — happens to millions of travellers every year. Not because they\'re careless. Because they simply didn\'t have the right information at the right time.',
      },
      {
        type: 'h2',
        heading: 'Why We Built Hootling',
      },
      {
        type: 'p',
        body: 'Hootling was built on one belief: travel should feel empowering, not anxious. When you know the fair price of a taxi before you get in, you negotiate from confidence, not desperation. When you know that tipping is offensive in Japan but expected in New York, you don\'t make cultural missteps that can sour an interaction.\n\nThe name \'Hootling\' comes from the English diminutive \'-ling\' — meaning a baby or young owl. Owls are symbols of wisdom, local knowledge, and the ability to navigate the dark. A Hootling is a wise little companion for your travels — always there when you need to know something fast.',
      },
      {
        type: 'h2',
        heading: 'What Hootling Does',
      },
      {
        type: 'p',
        body: 'Hootling has two core features:',
      },
      {
        type: 'ul',
        items: [
          '**Taxi Fare Check** — Enter your pickup and destination. Get a fair fare range in local currency, city-specific scam warnings, and a phrase to confirm the fare with your driver in their language. Powered by real local meter rate data from 120+ cities.',
          '**Tipping Guide** — Select a country. Get tipping etiquette for restaurants, taxis, hotel porters, bars, tour guides, and delivery. Know exactly how much to tip (or whether to tip at all) before you reach for your wallet.',
        ],
      },
      {
        type: 'h2',
        heading: 'How It Works',
      },
      {
        type: 'p',
        body: 'Fare estimates are calculated from a curated dataset of official local taxi meter rates, combined with real-time route distances from Google Maps. City-specific scam alerts are tailored to your exact route and destination. Results unlock for a small one-time fee — no subscription, no account, no tracking.',
      },
      {
        type: 'tip',
        body: 'Hootling costs less than the difference between a fair fare and a tourist trap fare. One Bangkok taxi check pays for itself in the first ride.',
      },
      {
        type: 'h2',
        heading: 'Travel Wise. Pay Right.',
      },
      {
        type: 'p',
        body: 'Hootling is built for the modern traveller — someone who moves fast, travels smart, and values their money without sacrificing experiences. Whether you\'re navigating the streets of Tokyo, tipping at a restaurant in Rome, or hailing a cab outside Dubai Airport, Hootling has the answer in seconds.\n\nTry it at hootling.com.',
      },
    ],
  },

  // ── Why Tipping Is So Confusing ────────────────────────────────────────────
  {
    slug: 'why-tipping-is-so-confusing-and-how-to-get-it-right',
    title: 'Why Tipping Is So Confusing (And How to Get It Right Every Time)',
    description:
      'Tipping customs vary wildly by country. In Japan it can be offensive. In the US it\'s almost mandatory. Here\'s how to tip correctly wherever you are in the world.',
    publishedAt: '2026-03-08',
    updatedAt: '2026-03-15',
    readingMinutes: 6,
    category: 'tipping',
    content: [
      {
        type: 'intro',
        body: 'Tipping is one of the most anxiety-inducing moments in international travel. Get it wrong and you might offend your host, embarrass yourself, or overpay significantly. Here\'s everything you need to know.',
      },
      {
        type: 'h2',
        heading: 'The Three Types of Tipping Cultures',
      },
      {
        type: 'p',
        body: 'Countries broadly fall into three tipping categories:',
      },
      {
        type: 'ul',
        items: [
          '**Expected (USA, Canada, some Middle East)** — Not tipping is considered rude. 15–20% at restaurants is standard in the US. Taxi drivers, hotel porters, and bar staff all expect something.',
          '**Optional (UK, Australia, most of Europe)** — Tipping is appreciated but not required. Rounding up the bill or leaving small change is common and well-received.',
          '**Offensive or Unnecessary (Japan, South Korea, China)** — Tipping can imply the worker isn\'t paid fairly, which can cause embarrassment. In Japan, it\'s best not to tip at all in most situations.',
        ],
      },
      {
        type: 'h2',
        heading: 'The 6 Scenarios Where Tipping Matters',
      },
      {
        type: 'p',
        body: 'Hootling\'s tipping guides cover six key scenarios where you\'re most likely to face a tipping decision:',
      },
      {
        type: 'ul',
        items: [
          'Restaurants & cafés',
          'Taxis & rideshare drivers',
          'Hotel porters & housekeeping',
          'Bars & nightlife',
          'Tour guides & day trips',
          'Spa, massage & wellness',
        ],
      },
      {
        type: 'h2',
        heading: 'A Country-by-Country Cheat Sheet',
      },
      {
        type: 'table',
        rows: [
          { label: 'USA', value: 'Restaurants: 15–20% · Taxis: 15–20% · Hotels: $2–5/bag' },
          { label: 'UK', value: 'Restaurants: 10–15% optional · Taxis: Round up · Hotels: £1–2/bag' },
          { label: 'Japan', value: 'Restaurants: Not expected · Taxis: Not expected · Hotels: Not expected' },
          { label: 'Australia', value: 'Restaurants: 5–10% optional · Taxis: Round up · Hotels: Optional' },
          { label: 'France', value: 'Restaurants: 5–10% optional · Taxis: Round up · Hotels: €1–2/bag' },
          { label: 'Thailand', value: 'Restaurants: 10–15% appreciated · Taxis: Round up · Hotels: Optional' },
        ],
      },
      {
        type: 'h2',
        heading: 'How Hootling Makes Tipping Simple',
      },
      {
        type: 'p',
        body: 'Rather than memorising every country\'s customs, Hootling looks it up for you. Select your destination country and get instant tipping guidance for all six scenarios — with cultural context, exact amounts in local currency, and a phrase to use in the local language.',
      },
      {
        type: 'tip',
        body: 'Always check tipping customs before you travel, not after the bill arrives. Hootling\'s tipping guides are available for 50+ countries.',
      },
    ],
  },

  // ── 5 Most Common Taxi Scams ───────────────────────────────────────────────
  {
    slug: '5-most-common-taxi-scams-and-how-to-avoid-them',
    title: 'The 5 Most Common Taxi Scams (And How to Avoid Every One)',
    description:
      'Taxi scams cost travellers millions every year. Here are the 5 most common tricks drivers use worldwide, and exactly how to protect yourself in every city.',
    publishedAt: '2026-02-22',
    updatedAt: '2026-03-15',
    readingMinutes: 7,
    category: 'taxi',
    content: [
      {
        type: 'intro',
        body: 'Taxi scams are the most common way travellers lose money abroad. They happen in every country, at every income level, to experienced travellers and first-timers alike. Knowing the playbook is the best defence.',
      },
      {
        type: 'h2',
        heading: 'Scam #1: The Broken Meter',
      },
      {
        type: 'p',
        body: 'The driver claims the meter isn\'t working and offers a \'special\' flat rate. That flat rate is almost always 2–5x the metered fare.',
      },
      {
        type: 'warning',
        body: 'Never accept a flat rate before asking what the metered fare would be. If the meter is genuinely broken, find another taxi or use a ride-hailing app.',
      },
      {
        type: 'h2',
        heading: 'Scam #2: The Long Route',
      },
      {
        type: 'p',
        body: 'The driver takes an unnecessarily long or circuitous route, running the meter up without you realising. This is particularly common from airports where you don\'t know the city layout.',
      },
      {
        type: 'tip',
        body: 'Before getting in, open Google Maps and note the approximate route. If the driver deviates significantly, politely ask them to follow the GPS route.',
      },
      {
        type: 'h2',
        heading: 'Scam #3: Price Change on Arrival',
      },
      {
        type: 'p',
        body: 'You agree on a price before departure, but when you arrive, the driver claims the price was per person, or that traffic/luggage makes it more expensive. Suddenly the agreed 200 baht becomes 600.',
      },
      {
        type: 'tip',
        body: 'Always confirm: \'This is the total price, for this journey, for [number] people, including luggage?\' before you leave.',
      },
      {
        type: 'h2',
        heading: 'Scam #4: The Hotel Switch',
      },
      {
        type: 'p',
        body: 'The driver insists your hotel is closed, full, or \'not safe\' and takes you to a different hotel where he gets a commission. This is extremely common in parts of Southeast Asia and India.',
      },
      {
        type: 'warning',
        body: 'If a driver says your hotel is closed, don\'t believe them without checking yourself. Call the hotel directly or show the driver a booking confirmation.',
      },
      {
        type: 'h2',
        heading: 'Scam #5: Airport Unofficial Taxis',
      },
      {
        type: 'p',
        body: 'Touts approach you in the arrivals hall offering \'official\' taxi services. They have lanyards, uniforms, and clipboards. They are not official. Airport taxi ranks are always outside the terminal, not inside arrivals.',
      },
      {
        type: 'tip',
        body: 'Always use the official taxi rank (signposted by the airport), a pre-booked transfer, or a verified ride-hailing app. Never follow someone who approaches you inside the terminal.',
      },
      {
        type: 'h2',
        heading: 'How to Protect Yourself in Any City',
      },
      {
        type: 'ul',
        items: [
          '**Know the fair price before you get in** — Use Hootling to check the fare range for your route before departure.',
          '**Screenshot the route** — Open Google Maps, enter your destination, take a screenshot of the recommended route.',
          '**Use metered taxis or ride-hailing apps** — Uber, Grab, Bolt, and local equivalents make price scams nearly impossible.',
          '**Pay with exact change when possible** — Overpaying \'because the driver has no change\' is a common minor scam.',
          '**Know the phrase** — Hootling provides a phrase in the local language to say: \'Please use the meter\' or \'I know the fair price.\'',
        ],
      },
      {
        type: 'tip',
        body: 'Hootling\'s taxi fare check gives you a city-specific scam warning list tailored to your exact route, plus the local phrase to use with your driver. Available for 120+ cities.',
      },
    ],
  },

  // ── 1. Bangkok ─────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-bangkok',
    title: 'How Much Does a Taxi Cost in Bangkok? (2026 Fare Guide)',
    description:
      "Suvarnabhumi Airport (BKK) to Sukhumvit costs ฿400–500 all-in by metered taxi — the Airport Rail Link does the same trip in 15 minutes for ฿150. Here's the full 2026 fare breakdown, the 'meter's broken' scam to dodge, and when Grab beats a street taxi.",
    publishedAt: '2026-01-28',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Bangkok',
    country: 'Thailand',
    citySlug: 'bangkok',
    countrySlug: 'thailand',
    featured: true,
    content: [
      {
        type: 'intro',
        body: 'Bangkok taxis are among the cheapest in Southeast Asia — a 10 km metered ride costs roughly ฿80–120 ($2–3 USD). The catch: meter refusals, flat-rate scams, and airport touts are extremely common. But once you know the rules, Bangkok taxis become one of the most affordable ways to get around any major Asian city. Here\'s the complete guide to Bangkok taxi prices in 2026.',
      },
      {
        type: 'h2',
        heading: 'How Bangkok Taxi Meters Work',
      },
      {
        type: 'p',
        body: 'All licensed Bangkok taxis are required to use a government-regulated meter (taximeter). The flag fall covers the first 2 km — after that the per-km rate kicks in, dropping slightly at 10 km. A ฿50 surcharge is added at Suvarnabhumi Airport (BKK) and ฿50 at Don Mueang Airport (DMK) — this is legitimate and printed inside every cab. Expressway tolls (฿25–75 depending on entry point) are paid by the passenger and added to the meter total.',
      },
      {
        type: 'h2',
        heading: 'Bangkok Taxi Meter Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall (first 2 km)', value: '฿35' },
          { label: 'Per km (2–10 km)', value: '฿6.50' },
          { label: 'Per km (over 10 km)', value: '฿5.50' },
          { label: 'Waiting / slow traffic (per minute)', value: '฿3' },
          { label: 'Minimum fare', value: '฿35' },
          { label: 'Airport surcharge (BKK or DMK)', value: '฿50' },
          { label: 'Expressway toll (passenger pays)', value: '฿25–75 depending on route' },
        ],
      },
      {
        type: 'h2',
        heading: 'Sample Fares from Bangkok Airports',
      },
      {
        type: 'p',
        body: 'Suvarnabhumi (BKK) is the main international airport, about 30 km east of the city centre. Don Mueang (DMK) is the budget airline airport, about 25 km north. Both have official metered taxi queues at Arrivals Level 1 — look for the organised queue counter, not the touts.',
      },
      {
        type: 'table',
        rows: [
          { label: 'BKK Airport → Sukhumvit (Nana/Asok, 30 km)', value: '฿280–380 + ฿50 surcharge + ฿75 toll ≈ ฿400–500' },
          { label: 'BKK Airport → Silom / Sathorn (35 km)', value: '฿300–420 + ฿50 + ฿75 ≈ ฿425–545' },
          { label: 'BKK Airport → Khao San Road (40 km)', value: '฿350–480 + ฿50 + ฿75 ≈ ฿475–605' },
          { label: 'BKK Airport → Chatuchak / Mo Chit (28 km)', value: '฿250–340 + ฿50 + ฿50 ≈ ฿350–440' },
          { label: 'DMK Airport → Sukhumvit (25 km)', value: '฿220–300 + ฿50 surcharge ≈ ฿270–350' },
          { label: 'City centre → Grand Palace (3–5 km)', value: '฿60–100 (no toll)' },
          { label: 'City centre → Chatuchak Market (5 km)', value: '฿80–130 (no toll)' },
          { label: 'Silom → Suvarnabhumi Airport (return)', value: '฿280–380 + toll (driver pays toll returning)' },
        ],
      },
      {
        type: 'h2',
        heading: 'Grab vs Metered Taxi in Bangkok',
      },
      {
        type: 'p',
        body: 'Grab operates widely in Bangkok and is the most reliable alternative to metered taxis. GrabCar gives you an upfront fixed price with no meter negotiation needed. During off-peak hours, a metered taxi is usually 10–25% cheaper than Grab\'s standard rate. During peak hours (7–10 am, 5–8 pm) and rainy weather, Grab applies surge pricing which can push it 30–50% above the metered taxi rate.',
      },
      {
        type: 'tip',
        body: 'Use the "GrabTaxi" option (not GrabCar) to hail official licensed taxis via the app. You get the government meter rate with Grab\'s tracking and accountability. This is the best of both worlds — metered pricing with driver accountability.',
      },
      {
        type: 'h2',
        heading: 'Bangkok Taxi Scams',
      },
      {
        type: 'ul',
        items: [
          '"Meter broken" — driver offers a flat rate of ฿300–500 for an airport trip that should cost ฿400–550 total on the meter. Decline and take the next taxi — meters are almost never genuinely broken.',
          'Taxi touts inside Suvarnabhumi arrivals hall — only use the Level 1 official queue counter. Touts charge 2–3× the meter rate.',
          '"Hotel closed today" — driver claims your hotel is fully booked or under renovation and diverts to a partner property. This is false — call your hotel to verify before accepting any diversion.',
          'Long route to inflate tolls — taking a non-expressway route then charging toll fees that weren\'t actually paid.',
          'Flat-rate negotiation at the kerb — drivers waiting outside tourist areas frequently refuse meters. Walk 100 m and flag a passing taxi instead.',
          'Don Mueang airport scam — unofficial drivers in the car park pretend to be official taxi staff. Always enter the official taxi queue counter inside the terminal.',
        ],
      },
      {
        type: 'h2',
        heading: 'Getting Around Bangkok by Taxi — Practical Tips',
      },
      {
        type: 'p',
        body: 'Bangkok traffic is among the worst in Southeast Asia. A 15 km trip in rush hour can take 60–90 minutes. For daytime sightseeing, the BTS Skytrain (฿15–60) and MRT subway (฿16–42) are faster and cheaper for most central routes. Taxis make most sense for late-night returns, trips with luggage, and routes not served by rail (e.g., the old city, Khao San Road, much of Thonburi).',
      },
      {
        type: 'h2',
        heading: 'Airport Rail Link from Suvarnabhumi',
      },
      {
        type: 'p',
        body: 'The Airport Rail Link express train takes 15 minutes from Suvarnabhumi to Phaya Thai station (BTS interchange) for ฿150. A city line stopping service reaches Makkasan (MRT interchange) and other stations for ฿15–45. For solo travellers, the train is the fastest and cheapest option. For groups of 3–4 with luggage, the total taxi cost split per person becomes comparable to the train.',
      },
      {
        type: 'h2',
        heading: 'Paying for Bangkok Taxis',
      },
      {
        type: 'p',
        body: 'Bangkok taxis are almost entirely cash only — Thai Baht only. Card readers are not standard equipment. Airport ATMs (post-customs) give decent rates. The standard tip is rounding up to the nearest ฿10 — so a ฿87 fare becomes ฿90. There is no obligation to tip, and drivers do not expect it.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from Bangkok Airport (BKK) to the city?',
            a: 'From Suvarnabhumi, expect a total of ฿400–600 to central Bangkok including the ฿50 airport surcharge and ฿50–75 expressway toll. Meter reading alone is typically ฿280–420 depending on destination and traffic. Grab charges approximately ฿350–520 with upfront pricing.',
          },
          {
            q: 'How do I get a metered taxi at Suvarnabhumi Airport?',
            a: 'Go to the official Public Taxi queue on Level 1 of the arrivals hall (ground floor). Take a numbered ticket at the counter, then proceed to the designated bay when your number is called. Do not accept rides from drivers who approach you inside the terminal.',
          },
          {
            q: 'Can I pay by card in Bangkok taxis?',
            a: 'No — Bangkok taxis are almost entirely cash-only. Bring Thai Baht. Airport ATMs are available post-customs at both Suvarnabhumi and Don Mueang. Grab and other app services accept card payment via the app.',
          },
          {
            q: 'Is tipping expected in Bangkok taxis?',
            a: 'Tipping is not expected. Rounding up to the nearest ฿10 is a common courtesy. For a ฿87 fare, giving ฿90 or ฿100 is generous. Most Bangkok taxi drivers will make change accurately.',
          },
          {
            q: 'What is the fastest way from BKK airport to the Bangkok city centre?',
            a: 'The Airport Rail Link express train takes 15 minutes to Phaya Thai station for ฿150. Taxis take 35–90 minutes depending on traffic (longer during morning/evening rush hour). For groups with luggage heading to hotels near the BTS line, the taxi often wins on total door-to-door time.',
          },
          {
            q: 'Should I use Grab or a metered taxi in Bangkok?',
            a: 'Use Grab when you want certainty and cashless payment — particularly at the airport and at night. Use a metered taxi during off-peak hours for lower fares (10–25% cheaper than standard Grab pricing). Avoid metered taxis during heavy rain when surge pricing makes Grab expensive and metered taxis rare.',
          },
        ],
      },
    ],
  },

  // ── 2. Dubai ───────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-dubai',
    title: 'How Much Does a Taxi Cost in Dubai? (2026 Rates)',
    description:
      "Dubai Airport (DXB) to Downtown costs AED 50–75 on the meter — Careem and Uber often undercut that by AED 5–15. Here's the full 2026 RTA rate breakdown, plus when the AED 3–8.50 Metro is the smarter call.",
    publishedAt: '2026-01-17',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Dubai',
    country: 'UAE',
    citySlug: 'dubai',
    countrySlug: 'uae',
    content: [
      {
        type: 'intro',
        body: 'Dubai\'s official taxis are metered, air-conditioned, and operated by the Roads and Transport Authority (RTA) — one of the most professionally run taxi networks in the world. Fares are set by the RTA, meters are mandatory, and scams are rare compared to other major global cities. Here\'s what you\'ll pay for every major route in Dubai in 2026, plus when Careem or the Dubai Metro makes more financial sense.',
      },
      {
        type: 'h2',
        heading: 'How Dubai Taxi Pricing Works',
      },
      {
        type: 'p',
        body: 'All Dubai taxis are operated by or licensed under the Roads and Transport Authority (RTA). The fleet is cream/beige-coloured with a coloured roof panel indicating the company (Dubai Taxi Corp = red, Cars Taxi = orange, Metro Taxi = yellow, National Taxi = green). All use the same regulated RTA meter rates. The flag fall covers the first 850 m, after which the per-km rate kicks in. A AED 3 airport surcharge is added at Dubai International Airport (DXB) — this is legitimate and applies on top of the metered fare.',
      },
      {
        type: 'h2',
        heading: 'Dubai Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall — daytime (6 am–10 pm)', value: 'AED 12' },
          { label: 'Flag fall — night (10 pm–6 am)', value: 'AED 12' },
          { label: 'Per km', value: 'AED 1.97' },
          { label: 'Minimum fare', value: 'AED 12' },
          { label: 'Waiting time (per hour)', value: 'AED 30' },
          { label: 'Airport surcharge (DXB departure)', value: 'AED 3' },
          { label: 'Night rate surcharge (midnight–6 am)', value: '+25% on the meter' },
          { label: 'Sharjah surcharge (cross-emirate)', value: 'AED 20 added' },
        ],
      },
      {
        type: 'h2',
        heading: 'Sample Fares from Dubai Airport (DXB)',
      },
      {
        type: 'p',
        body: 'Dubai International Airport (DXB) serves all three terminals. Terminals 1 and 3 (Emirates) and Terminal 2 (budget airlines) all have official taxi ranks on the arrivals kerbside. The AED 3 airport fee appears automatically on the meter and is legitimate.',
      },
      {
        type: 'table',
        rows: [
          { label: 'DXB T3 → Downtown Dubai / Burj Khalifa (15 km)', value: 'AED 50–75' },
          { label: 'DXB T3 → Dubai Marina (30 km)', value: 'AED 80–120' },
          { label: 'DXB T3 → Palm Jumeirah (32 km)', value: 'AED 85–130' },
          { label: 'DXB T3 → Jumeirah Beach Residence (JBR)', value: 'AED 90–125' },
          { label: 'DXB → Deira / City Centre (5 km)', value: 'AED 25–40' },
          { label: 'DXB → Sharjah (25 km)', value: 'AED 60–80 + AED 20 surcharge' },
          { label: 'DXB → Abu Dhabi (130 km)', value: 'AED 250–350 (inter-emirate)' },
          { label: 'DWC (Al Maktoum) → Downtown Dubai (45 km)', value: 'AED 120–160' },
        ],
      },
      {
        type: 'h2',
        heading: 'Uber, Careem, and the Dubai Taxi App',
      },
      {
        type: 'p',
        body: 'Careem (majority-owned by Uber) is the dominant ride-hailing app in Dubai. Uber also operates under its own brand. Both use licensed drivers and offer fixed upfront pricing. For most city routes, Careem and Uber are AED 5–15 cheaper than metered taxis outside peak hours. However, during surge (rush hour, Friday evenings, events at DIFC or Dubai World Trade Centre), the RTA-metered taxi is the more predictable option.',
      },
      {
        type: 'table',
        rows: [
          { label: 'RTA taxi (metered)', value: 'Most transparent. Regulated meter. No surge. Available everywhere including from airport. AED 12 flag fall.' },
          { label: 'Dubai Taxi app (by RTA)', value: 'Pre-books official RTA taxis with upfront estimated fare. No surge pricing. Recommended for airport trips.' },
          { label: 'Careem', value: 'Fixed upfront price. In-app payment. 5–15% cheaper than metered taxi off-peak. Surge applies.' },
          { label: 'Uber', value: 'Same model as Careem. Comparable pricing. Upfront price shown before confirming.' },
        ],
      },
      {
        type: 'tip',
        body: 'Download the RTA Dubai Taxi app before your trip. You can pre-book an official taxi with an upfront fixed fare — no surge pricing, no meter surprises. Particularly useful for early-morning airport departures when demand is high and Careem/Uber surge prices spike.',
      },
      {
        type: 'h2',
        heading: 'Dubai Metro as a Taxi Alternative',
      },
      {
        type: 'p',
        body: 'The Dubai Metro Red Line runs from the airport (Terminals 1 and 3 via Airport Free Zone station) through Downtown and all the way to Dubai Marina. For solo travellers, it is the cheapest option by far at AED 3–8.50 depending on zones. Journey from DXB to Downtown is approximately 20 minutes, to Dubai Marina about 40 minutes. The Red Line does not serve Palm Jumeirah, JBR, or the older Deira residential areas.',
      },
      {
        type: 'h2',
        heading: 'Unofficial Taxis and Scams at DXB',
      },
      {
        type: 'warning',
        body: 'Unlicensed drivers occasionally approach travellers inside DXB arrivals and offer rides at "fixed prices" of AED 150–200 for routes that should cost AED 50–75 by meter. These drivers are not RTA-licensed and are operating illegally. Always use the official taxi rank (cream/beige cars) outside the arrivals exit or book via the Dubai Taxi app or Careem.',
      },
      {
        type: 'ul',
        items: [
          'Non-RTA vehicles claiming to be official taxis — all legitimate Dubai taxis are cream/beige coloured.',
          'Drivers offering flat rates significantly above the metered equivalent — always insist on the meter.',
          'Sharjah/Abu Dhabi surcharges being applied incorrectly for journeys that stay within Dubai.',
          'Phantom "toll charges" — Dubai does not use road tolls on taxi routes (Salik is absorbed into fares on major roads).',
        ],
      },
      {
        type: 'h2',
        heading: 'Tipping in Dubai Taxis',
      },
      {
        type: 'p',
        body: 'Tipping is not expected or mandatory in Dubai taxis. Rounding up to the nearest AED 5 is common courtesy and appreciated. For a AED 67 fare, giving AED 70 is completely normal. For longer trips from the airport, a AED 5–10 tip is a generous but not obligatory gesture. Payment by card is accepted in all RTA taxis — contactless and chip.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from Dubai Airport to Downtown Dubai?',
            a: 'Expect AED 50–75 from DXB Terminal 3 to Downtown Dubai or the Burj Khalifa area (about 15 km). The AED 3 airport surcharge is included. Journey time is 15–25 minutes depending on traffic.',
          },
          {
            q: 'How much is a taxi from Dubai Airport to Dubai Marina?',
            a: 'Expect AED 80–120 from DXB to Dubai Marina or JBR (approximately 30 km). Traffic on Sheikh Zayed Road during peak hours can extend the journey to 45–60 minutes.',
          },
          {
            q: 'Are taxis metered in Dubai?',
            a: 'Yes — all RTA-licensed Dubai taxis use regulated digital meters. The meter must start at flag fall (AED 12) when the journey begins. If the driver refuses to use the meter, exit and use the Dubai Taxi app or Careem.',
          },
          {
            q: 'Is Careem or Uber cheaper than taxis in Dubai?',
            a: 'Outside peak hours, Careem and Uber are typically AED 5–15 cheaper than metered RTA taxis for most city routes. During surge (rush hour, events, rainy days), metered taxis are often the better value as their pricing is regulated.',
          },
          {
            q: 'Can I pay by card in a Dubai taxi?',
            a: 'Yes. All RTA taxis accept credit and debit cards (Visa, Mastercard) and contactless payment. Cash (AED) is also accepted. Careem and Uber are cashless by default via the app.',
          },
          {
            q: 'How do I book a taxi from Dubai Airport in advance?',
            a: 'Use the Dubai Taxi app (by RTA) to pre-book an official taxi with an upfront estimated fare. No surge pricing applies. Alternatively, use Careem or Uber for app-based pickup from the designated rideshare zones at DXB.',
          },
        ],
      },
    ],
  },

  // ── 3. Singapore ───────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-singapore',
    title: 'How Much Does a Taxi Cost in Singapore? (2026 Guide)',
    description:
      "Changi Airport to Orchard Road runs S$28–42 once surcharges and ERP tolls stack up — Grab usually quotes S$3–8 less, upfront. Here's the full 2026 breakdown of every surcharge, and why a midnight fare can hit S$50–60.",
    publishedAt: '2026-01-06',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Singapore',
    country: 'Singapore',
    citySlug: 'singapore',
    countrySlug: 'singapore',
    content: [
      {
        type: 'intro',
        body: 'Singapore taxis are efficient, air-conditioned, and meticulously regulated — but the fare structure is one of the most complex in Asia. Airport surcharges, ERP electronic road tolls, peak-hour surcharges, and midnight premiums can all stack on top of the base meter reading. Understanding each add-on means no surprises when you arrive at your hotel. Here\'s the complete guide to Singapore taxi fares in 2026.',
      },
      {
        type: 'h2',
        heading: 'How Singapore Taxi Pricing Works',
      },
      {
        type: 'p',
        body: 'Singapore taxi fares consist of three elements: the base metered fare, surcharges (airport, peak hour, midnight), and ERP tolls. The base meter runs from flag fall plus a per-distance rate. Surcharges are fixed amounts or percentages applied on top of the base fare. ERP tolls are electronic road pricing charges collected at gantries — the amount depends on your route, time of day, and the specific gantries passed. The driver cannot avoid ERP gantries on certain expressway routes, so ERP is always a legitimate add-on.',
      },
      {
        type: 'h2',
        heading: 'Singapore Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall (first 1 km)', value: 'S$3.90' },
          { label: 'Per 400 m (1–10 km range)', value: 'S$0.25' },
          { label: 'Per 350 m (over 10 km)', value: 'S$0.25' },
          { label: 'Waiting / slow traffic (per 45 sec)', value: 'S$0.25' },
          { label: 'Airport surcharge (peak: 5–8 am, 6 pm–midnight)', value: 'S$8' },
          { label: 'Airport surcharge (other hours)', value: 'S$5' },
          { label: 'Peak-hour surcharge (Mon–Fri 6–9:30 am, 6–11 pm)', value: '25% of metered fare' },
          { label: 'Midnight surcharge (12 am–5:59 am)', value: '50% of metered fare' },
          { label: 'City area surcharge (Mon–Sat 5–11:59 pm)', value: 'S$3' },
          { label: 'ERP tolls (route-dependent)', value: 'S$0.50–S$6 per gantry' },
        ],
      },
      {
        type: 'h2',
        heading: 'Sample Fares from Changi Airport (SIN)',
      },
      {
        type: 'p',
        body: 'The following estimates include the airport surcharge (S$5 off-peak, S$8 peak) and typical ERP toll costs. Midnight surcharge applies if departing between midnight and 6 am. Grab typically undercuts these totals by S$2–8 due to competitive pricing.',
      },
      {
        type: 'table',
        rows: [
          { label: 'SIN → Orchard Road (17 km)', value: 'S$28–42' },
          { label: 'SIN → Marina Bay / MBS (18 km)', value: 'S$26–40' },
          { label: 'SIN → Sentosa (22 km)', value: 'S$34–50 (incl. S$3 Sentosa entry fee)' },
          { label: 'SIN → Clarke Quay / Chinatown (18 km)', value: 'S$28–40' },
          { label: 'SIN → Jurong East (30 km)', value: 'S$32–48' },
          { label: 'SIN → Woodlands (31 km)', value: 'S$35–52' },
        ],
      },
      {
        type: 'tip',
        body: 'The MRT East-West line connects Changi Airport directly to the city for S$2.00–2.50 (EZ-Link card) and takes about 30 minutes to City Hall. Unless you have heavy luggage or are travelling to a non-MRT area, the train is by far the most economical option for solo travellers.',
      },
      {
        type: 'h2',
        heading: 'Grab vs Metered Taxi in Singapore',
      },
      {
        type: 'p',
        body: 'Grab dominates ride-hailing in Singapore and has largely displaced earlier competitors. For most journeys, Grab shows you a fixed upfront price that includes all surcharges and estimated ERP — no surprises at the end. This is the main advantage over a metered taxi where surcharges only become visible as they accumulate. For airport trips, Grab usually prices S$3–8 below the equivalent metered taxi total. For peak-hour city trips, the difference is smaller and occasionally Grab surges above the metered rate.',
      },
      {
        type: 'table',
        rows: [
          { label: 'Metered taxi (ComfortDelGro, SMRT, CityCab)', value: 'Meter + surcharges + ERP. Most visible on street. All official Singapore taxi companies.' },
          { label: 'Grab (GrabCar / GrabTaxi)', value: 'Fixed upfront pricing. Includes estimated surcharges. 5–15% cheaper than metered taxi for airport trips.' },
          { label: 'Ryde', value: 'Local Singapore rideshare. Competitive pricing. Smaller fleet than Grab.' },
          { label: 'GOJEK Singapore', value: 'Available in Singapore. Typically competitive with Grab on pricing.' },
        ],
      },
      {
        type: 'h2',
        heading: 'ERP Tolls — What Are They?',
      },
      {
        type: 'p',
        body: 'Electronic Road Pricing (ERP) is Singapore\'s congestion charge for expressways and city-centre roads. Gantries charge automatically when a taxi passes through — rates vary from S$0.50 to S$6 per gantry depending on congestion. The most expensive gantries are in the CBD during morning and evening peak. The total ERP charge is added to your taxi fare and is always displayed on the meter. It is a legitimate charge that the driver cannot waive.',
      },
      {
        type: 'h2',
        heading: 'How to Pay for a Singapore Taxi',
      },
      {
        type: 'p',
        body: 'All licensed Singapore taxis accept NETS (local debit), Visa, Mastercard, and contactless payment (including Apple Pay and Google Pay). A S$0.30 card surcharge may apply on some meters. Cash (Singapore dollars) is always accepted. Grab and Gojek are cashless — payment via card or GrabPay wallet. If you\'re arriving without Singapore dollars, airport ATMs and money changers are available at all Changi terminals.',
      },
      {
        type: 'h2',
        heading: 'Finding a Taxi at Changi Airport',
      },
      {
        type: 'p',
        body: 'Official taxi ranks are at the basement (B2) of all four Changi terminals. Follow ground transport signs after clearing customs. During busy periods (peak arrivals, public holidays), queues can be 15–25 minutes. Grab and Gojek have dedicated pickup points at each terminal — check the app for the exact location as they differ by terminal.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'Why is my Singapore taxi fare higher than expected?',
            a: 'Singapore taxis have multiple surcharges that stack on the base meter: airport fee (S$5–8), peak-hour surcharge (25%), midnight surcharge (50%), city-area fee (S$3), and ERP road tolls. A midnight airport taxi to Orchard Road can total S$50–60 versus S$28–35 in the middle of the day.',
          },
          {
            q: 'How much is a taxi from Changi Airport to Orchard Road?',
            a: 'Expect S$28–42 including the airport surcharge and ERP tolls. During peak hours (6–9:30 am Mon–Fri or 6–11 pm) add 25%. After midnight, add 50%. Grab typically quotes S$22–38 for the same journey with upfront pricing.',
          },
          {
            q: 'Is Grab cheaper than taxis in Singapore?',
            a: 'Usually yes — Grab is typically S$3–8 cheaper than a metered taxi for airport trips due to competitive pricing. For shorter city trips during peak hours, the difference is smaller. Always compare both before confirming.',
          },
          {
            q: 'Is tipping expected in Singapore taxis?',
            a: 'No — tipping is not expected or common in Singapore. Most Singaporeans do not tip taxi drivers. For Grab, you can add an in-app tip if you wish, but it is entirely optional.',
          },
          {
            q: 'Can I pay by card in Singapore taxis?',
            a: 'Yes. All licensed Singapore taxis accept NETS, Visa, and Mastercard. Contactless and mobile payment (Apple Pay, Google Pay) are widely supported. A S$0.30 surcharge may apply on some terminals.',
          },
          {
            q: 'What is the cheapest way to get from Changi Airport to the city?',
            a: 'The MRT East-West line costs S$2.00–2.50 and takes 30 minutes to City Hall. For groups of 3–4 or travellers with heavy luggage, splitting a taxi or Grab at S$28–42 becomes comparable in cost per person while being door-to-door.',
          },
        ],
      },
    ],
  },

  // ── 4. London ──────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-london',
    title: 'How Much Does a Taxi Cost in London? (2026 Black Cab Fares)',
    description:
      "A Heathrow black cab to central London costs £55–85 — Uber or Bolt typically do the same run for £35–55. Here's the full 2026 tariff breakdown, why the meter shows three different rates, and how to spot an illegal minicab tout.",
    publishedAt: '2025-12-26',
    readingMinutes: 8,
    category: 'taxi',
    city: 'London',
    country: 'United Kingdom',
    citySlug: 'london',
    countrySlug: 'united-kingdom',
    content: [
      {
        type: 'intro',
        body: 'London black cabs (hackney carriages) are metered by Transport for London across three tariff bands — the most expensive applies on Christmas and New Year. In 2026, a Heathrow airport run costs £55–85 in a black cab, while Uber or Bolt typically undercut that by 40–60%. Here is exactly what you will pay for every option.',
      },
      {
        type: 'h2',
        heading: 'London Black Cab Meter Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall (all tariffs)', value: '£3.80' },
          { label: 'Tariff 1 — Mon–Fri 6 am–10 pm', value: '£2.10/km' },
          { label: 'Tariff 2 — Mon–Fri 10 pm–6 am, weekends & bank holidays', value: '£2.50/km' },
          { label: 'Tariff 3 — Christmas Eve, Christmas Day, New Year', value: '£2.80/km' },
          { label: 'Extra per additional passenger (over 1)', value: '£0.20' },
          { label: 'Extra per large item of luggage', value: '£0.40' },
          { label: 'Waiting time (Tariff 1)', value: '£0.40/min' },
        ],
      },
      {
        type: 'h2',
        heading: 'How the Tariff System Works',
      },
      {
        type: 'p',
        body: 'The meter automatically switches tariff based on time of day and day of week. Tariff 1 applies during standard working hours Monday to Friday and is the cheapest. Tariff 2 kicks in during evenings, nights, and all day Saturday and Sunday. Tariff 3 is reserved for the Christmas and New Year period. You can see the active tariff displayed on the meter — if Tariff 2 or 3 is showing for a daytime weekday ride, ask the driver to correct it.',
      },
      {
        type: 'h2',
        heading: 'Sample Black Cab Fares',
      },
      {
        type: 'table',
        rows: [
          { label: 'Heathrow Airport → Central London (day)', value: '£55–85' },
          { label: 'Heathrow Airport → Central London (night/weekend)', value: '£70–110' },
          { label: 'Gatwick Airport → Central London', value: '£90–130 (negotiate fixed rate)' },
          { label: 'King\'s Cross → Shoreditch', value: '£12–18' },
          { label: 'Paddington → Canary Wharf', value: '£28–40' },
          { label: 'Victoria → Brixton', value: '£15–22' },
          { label: 'Liverpool Street → Soho', value: '£14–20' },
          { label: 'Oxford Street → London Bridge', value: '£16–24' },
        ],
      },
      {
        type: 'h2',
        heading: 'Heathrow Airport Taxis',
      },
      {
        type: 'p',
        body: 'Black cab taxi ranks are located outside each Heathrow terminal in the arrivals area — follow the "Taxis" signs past the baggage reclaim exits. No booking is needed; you join the rank queue. Journey time to Central London is 45–75 minutes depending on traffic and your destination. The journey is roughly 24 km on Tariff 1, putting the metered fare in the £55–85 range before any extras.',
      },
      {
        type: 'tip',
        body: 'The Elizabeth line (Crossrail) runs from Heathrow to Paddington in 15 minutes for £10.80–13.00 with an Oyster or contactless card — far cheaper than a taxi for solo travellers with manageable luggage.',
      },
      {
        type: 'h2',
        heading: 'Gatwick Airport Taxis',
      },
      {
        type: 'p',
        body: 'Gatwick is 45 km south of Central London, making taxi fares steep. Licensed black cabs serve the airport but the metered fare can reach £90–130. Negotiate a fixed rate with the driver before departure — most will agree to £90–110 to avoid a meter running through variable traffic. The Gatwick Express train (£21.50 one-way) reaches London Victoria in 30 minutes and is the best value for solo travellers.',
      },
      {
        type: 'h2',
        heading: 'Uber, Bolt and Addison Lee vs Black Cabs',
      },
      {
        type: 'table',
        rows: [
          { label: 'Black cab (Tariff 1, typical city journey)', value: '£18–30 metered' },
          { label: 'Uber uberX (same route)', value: '£9–15 (upfront price)' },
          { label: 'Bolt (same route)', value: '£8–13 (often cheapest)' },
          { label: 'Addison Lee (executive minicab)', value: '£20–35 (higher quality car)' },
          { label: 'Black cab from Heathrow', value: '£55–85' },
          { label: 'Uber from Heathrow', value: '£35–55 (fixed upfront)' },
        ],
      },
      {
        type: 'h2',
        heading: 'How to Pay for a Black Cab',
      },
      {
        type: 'p',
        body: 'Since 2016, all London black cabs are required by TfL to accept contactless card payments. Tap your debit or credit card, or use Apple Pay or Google Pay on the in-cab reader. Cash is still accepted. There is no card surcharge — you pay exactly the metered amount. For Uber and Bolt, payment is taken in-app automatically at the end of the ride.',
      },
      {
        type: 'warning',
        body: 'Unlicensed minicab touts operate around major stations and nightlife areas. It is illegal to take an unbooked minicab in London. Never get into a car that approaches you — always pre-book via a licensed app (Uber, Bolt, Addison Lee) or use a black cab at a rank.',
      },
      {
        type: 'h2',
        heading: 'Scams and Things to Watch For',
      },
      {
        type: 'ul',
        items: [
          'Unlicensed touts at Heathrow arrivals quoting fixed rates of £100+ — always go to the official taxi rank.',
          'Incorrect tariff showing on the meter (Tariff 2 during daytime hours) — check the display.',
          'Scenic routing on unfamiliar routes — share your live location and note the route on Google Maps.',
          'Private hire drivers (Uber, Addison Lee) accepting street hails, which is illegal — only black cabs may pick up without a booking.',
        ],
      },
      {
        type: 'tip',
        body: 'All London black cabs display a licence plate beginning with numbers only (no letters) and a white "Licensed London Taxi" plate at the rear. The yellow TAXI sign on the roof illuminates when the cab is available.',
      },
      {
        type: 'faq',
        faqs: [
          { q: 'How much should I tip a London black cab driver?', a: 'Tipping is not obligatory but appreciated. Rounding up to the nearest pound is the minimum gesture. For good service on a long journey, 10% is generous. Most payment terminals have a tip option.' },
          { q: 'Is it safe to take Uber in London?', a: 'Yes — Uber and Bolt are both licensed by Transport for London (TfL) and must meet the same safety standards as any private hire operator. All drivers are background-checked. Uber lost and then regained its TfL licence after improving safety procedures in 2021.' },
          { q: 'Can I hail an Uber on the street in London?', a: 'No — private hire vehicles including Uber must be pre-booked via the app. Only black cabs (hackney carriages) may be hailed on the street when the yellow TAXI sign is lit.' },
          { q: 'How much does a London black cab cost from Heathrow to the city centre?', a: 'Expect £55–85 during Tariff 1 (daytime weekdays) and £70–110 during evenings and weekends. Journey time is 45–75 minutes. The Elizabeth line costs £10.80–13.00 and takes 15 minutes to Paddington.' },
          { q: 'What is the difference between a black cab and a minicab in London?', a: 'Black cabs (hackney carriages) are licensed to pick up passengers on the street without a booking. Minicabs are private hire vehicles that must be pre-booked — they cannot legally pick up street fares. Uber, Bolt, and Addison Lee are all minicab operators.' },
          { q: 'Is there a taxi from Gatwick to London?', a: 'Yes — the taxi rank is at the South Terminal. Fares run £90–130 metered; negotiate a fixed rate of £90–110 before departure. The Gatwick Express train at £21.50 is faster (30 minutes) and far cheaper for solo travellers.' },
        ],
      },
    ],
  },

  // ── 5. New York ────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-new-york',
    title: 'How Much Does a Taxi Cost in New York? (2026 Yellow Cab Guide)',
    description:
      "The JFK flat rate is $70 to Manhattan — but tolls, surcharges and a 20% tip push the real cost to $90–110. Here's the full 2026 yellow cab breakdown, and why Uber's $65–85 fixed price from JFK often wins.",
    publishedAt: '2025-12-14',
    readingMinutes: 8,
    category: 'taxi',
    city: 'New York',
    country: 'United States',
    citySlug: 'new-york',
    countrySlug: 'united-states',
    content: [
      {
        type: 'intro',
        body: 'New York City yellow cabs are metered but come loaded with surcharges — congestion pricing, MTA levies, night fees, and tolls can add $20–30 on top of the base meter. The JFK flat rate is $70 to any Manhattan address, but the all-in cost after tolls and a 20% tip typically lands at $90–110. Here is the complete 2026 breakdown.',
      },
      {
        type: 'h2',
        heading: 'NYC Yellow Cab Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Initial charge (flag fall)', value: '$3.00' },
          { label: 'Per mile', value: '$2.50' },
          { label: 'Per minute (slow traffic / stopped)', value: '$0.50' },
          { label: 'Night surcharge (8 pm–6 am)', value: '+$0.50 on meter' },
          { label: 'Congestion surcharge (trips to/from Manhattan below 96th St)', value: '+$2.50' },
          { label: 'NYS surcharge', value: '+$0.30' },
          { label: 'MTA surcharge', value: '+$1.00' },
          { label: 'JFK Airport flat rate to any Manhattan destination', value: '$70.00 (excl. tolls, tip)' },
        ],
      },
      {
        type: 'h2',
        heading: 'Understanding the JFK Flat Rate',
      },
      {
        type: 'p',
        body: 'The $70 flat rate applies from JFK to any Manhattan destination regardless of distance or traffic. This is the meter rate — it does NOT include bridge or tunnel tolls ($8.50–19 depending on route), the $2.50 congestion surcharge, or your tip. A realistic all-in cost for JFK to Midtown Manhattan is $90–110 with a 20% tip. From Manhattan to JFK the meter runs normally and is often cheaper.',
      },
      {
        type: 'h2',
        heading: 'LaGuardia and Newark Airport Fares',
      },
      {
        type: 'p',
        body: 'LaGuardia (LGA) does not have a flat rate — the meter runs, and fares to Midtown Manhattan are typically $35–55 plus tolls and tip. Newark Liberty (EWR) in New Jersey uses metered yellow cabs or Uber; expect $70–90 plus a $20 out-of-state (New Jersey) surcharge that appears on most routes. The PATH train from Newark to Manhattan costs $2.75 and is significantly cheaper for solo travellers.',
      },
      {
        type: 'h2',
        heading: 'Sample NYC Taxi Fares',
      },
      {
        type: 'table',
        rows: [
          { label: 'JFK → Midtown Manhattan (all-in estimate)', value: '$90–110 (flat $70 + tolls + 20% tip)' },
          { label: 'JFK → Lower East Side / Brooklyn border', value: '$85–100 all-in' },
          { label: 'LaGuardia → Midtown Manhattan', value: '$45–65 all-in' },
          { label: 'Newark EWR → Midtown Manhattan', value: '$85–110 all-in (incl. NJ surcharge)' },
          { label: 'Times Square → Brooklyn (metered)', value: '$30–50 + tolls + tip' },
          { label: 'Grand Central → Upper West Side (short)', value: '$12–18 + tip' },
          { label: 'Penn Station → Greenwich Village', value: '$10–16 + tip' },
          { label: 'World Trade Center → JFK', value: '$70 flat + tolls + tip' },
        ],
      },
      {
        type: 'h2',
        heading: 'Uber vs Yellow Cab in NYC',
      },
      {
        type: 'table',
        rows: [
          { label: 'Yellow cab (typical 3-mile Midtown ride)', value: '$15–22 metered + surcharges' },
          { label: 'Uber uberX (same route)', value: '$18–28 upfront (varies with surge)' },
          { label: 'Lyft (same route)', value: '$16–26 upfront' },
          { label: 'Yellow cab from JFK', value: '$90–110 all-in' },
          { label: 'Uber from JFK (fixed price)', value: '$65–85 all-in (no toll surprise)' },
        ],
      },
      {
        type: 'h2',
        heading: 'How to Pay in a New York Yellow Cab',
      },
      {
        type: 'p',
        body: 'All NYC yellow cabs are required by law to accept credit and debit cards. The touchscreen terminal in the back seat accepts Visa, Mastercard, Amex, and contactless tap payments including Apple Pay and Google Pay. Cash is also accepted. Do not let a driver claim the card machine is broken — report it to the NYC Taxi and Limousine Commission (TLC).',
      },
      {
        type: 'tip',
        body: 'Always tip 20% in NYC yellow cabs. The payment terminal will prompt you for 20%, 25%, or 30% — 20% is the local norm. Drivers depend on tips as part of their income.',
      },
      {
        type: 'warning',
        body: 'Never accept a ride from an unlicensed "gypsy cab" or unofficial driver at JFK or Penn Station. These vehicles are unregulated, uninsured, and the source of most tourist overcharging complaints. Only use yellow cabs from the official taxi rank or pre-book Uber/Lyft through the app.',
      },
      {
        type: 'h2',
        heading: 'Common NYC Taxi Scams',
      },
      {
        type: 'ul',
        items: [
          'Unofficial drivers at JFK arrivals quoting $100–150 flat — the regulated flat rate is $70 before tolls.',
          'Metering on the JFK flat-rate trip — the driver should NOT run the meter to JFK.',
          'Claiming the card machine is broken to force a cash payment at an inflated rate.',
          'Refusing to cross borough boundaries — yellow cabs are required to take you anywhere in the five boroughs.',
          'Excessive route diversions — use Google Maps to confirm a reasonable route is being taken.',
        ],
      },
      {
        type: 'faq',
        faqs: [
          { q: 'How do I pay in a New York yellow cab?', a: 'All NYC yellow cabs accept credit and debit cards via the in-cab terminal, as well as contactless payments (Apple Pay, Google Pay). Cash is also accepted. A card surcharge is not permitted.' },
          { q: 'Is Uber cheaper than a yellow cab in NYC?', a: 'It depends. For JFK trips, Uber often shows $65–85 all-in versus a yellow cab\'s $90–110 all-in, making Uber cheaper and more predictable. For short Midtown rides, both are comparable. During surge, Uber can exceed taxi rates.' },
          { q: 'What is congestion pricing in NYC?', a: 'Since mid-2024, most vehicles entering Manhattan below 60th Street pay a congestion surcharge. For yellow cabs, this is passed to passengers as a $2.50 addition to the fare, regardless of whether you are crossing the tolled boundary during the ride.' },
          { q: 'How much should I tip a NYC taxi driver?', a: '20% is the standard tip in New York City. The payment terminal defaults to 20%, 25%, and 30% options. Tipping below 15% is considered poor form. For a $15 metered ride, a $3 tip (20%) is expected.' },
          { q: 'Does the JFK flat rate include tolls?', a: 'No — the $70 JFK flat rate does not include bridge or tunnel tolls ($8.50–19 depending on route), the congestion surcharge ($2.50), or your tip. Budget $90–110 all-in for a JFK to Manhattan trip.' },
          { q: 'Can a yellow cab refuse to take me to the outer boroughs?', a: 'No — yellow cabs are required by TLC rules to take passengers anywhere within New York City\'s five boroughs (Manhattan, Brooklyn, Queens, the Bronx, and Staten Island). A refusal can be reported to 311.' },
        ],
      },
    ],
  },

  // ── 6. Tokyo ───────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-tokyo',
    title: 'How Much Does a Taxi Cost in Tokyo? (2026 Fare Guide)',
    description:
      "A taxi from Narita Airport to central Tokyo runs ¥20,000–30,000 ($130–200) — the Narita Express covers the same 60 km in 50 minutes for ¥3,070. Here's the full 2026 fare breakdown and exactly when a taxi is still worth it.",
    publishedAt: '2025-12-03',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Tokyo',
    country: 'Japan',
    citySlug: 'tokyo',
    countrySlug: 'japan',
    content: [
      {
        type: 'intro',
        body: 'Tokyo taxis are immaculately clean, scam-free, and always use the meter — but they are expensive. A 5 km city ride costs ¥1,500–2,200, and a taxi from Narita Airport runs ¥20,000–30,000 ($130–200 USD). The train network covers almost everywhere you need to go and is far cheaper. Here is exactly when a taxi makes sense and what you will pay in 2026.',
      },
      {
        type: 'h2',
        heading: 'How the Tokyo Taxi Meter Works',
      },
      {
        type: 'p',
        body: 'Tokyo taxis use a combined distance-and-time meter. The flag fall of ¥500 covers the first 1.052 km. After that, ¥100 is added for every 237 metres travelled. When traffic slows below a certain speed, the meter switches to a time-based rate — ¥100 per 1 minute 30 seconds of slow movement. A late-night surcharge of 20% applies between 10 pm and 5 am on top of all charges.',
      },
      {
        type: 'h2',
        heading: 'Tokyo Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall (first 1.052 km)', value: '¥500' },
          { label: 'Per 237 m after flag fall', value: '¥100' },
          { label: 'Equivalent per km (approx.)', value: '¥422' },
          { label: 'Waiting / slow traffic (per 1 min 30 sec)', value: '¥100' },
          { label: 'Late-night surcharge (10 pm–5 am)', value: '+20% on all charges' },
          { label: 'Highway tolls', value: 'Added directly to fare' },
          { label: 'Reservation surcharge (some companies)', value: '¥410' },
        ],
      },
      {
        type: 'h2',
        heading: 'Sample Tokyo Taxi Fares',
      },
      {
        type: 'table',
        rows: [
          { label: 'Narita Airport → Shinjuku / central Tokyo (60 km)', value: '¥20,000–30,000' },
          { label: 'Haneda Airport → Shinjuku (22 km)', value: '¥7,000–10,000' },
          { label: 'Haneda Airport → Tokyo Station (20 km)', value: '¥6,000–9,000' },
          { label: 'Shinjuku → Shibuya (3 km)', value: '¥1,200–1,800' },
          { label: 'Shinjuku → Tokyo Station (8 km)', value: '¥2,000–3,000' },
          { label: 'Shibuya → Roppongi (3 km)', value: '¥1,200–1,800' },
          { label: 'Asakusa → Akihabara (5 km)', value: '¥1,800–2,500' },
        ],
      },
      {
        type: 'h2',
        heading: 'Narita Airport: Why You Should Take the Train',
      },
      {
        type: 'p',
        body: 'Narita Airport is 60 km east of central Tokyo, making it one of the most expensive airport-to-city taxi routes in the world. A metered taxi runs ¥20,000–30,000 and takes 60–90 minutes. The Narita Express (N\'EX) train reaches Shinjuku in 50 minutes for ¥3,070 — roughly one-tenth the taxi cost. Unless you have a specific reason (multiple passengers, very heavy luggage, destination not on the rail network), take the train.',
      },
      {
        type: 'tip',
        body: 'Haneda Airport is much closer to central Tokyo (about 22 km). A taxi from Haneda to Shinjuku costs ¥7,000–10,000 and is a more reasonable option, especially for late-night arrivals when the Tokyo Monorail runs less frequently.',
      },
      {
        type: 'h2',
        heading: 'Booking a Taxi: GO App and JapanTaxi',
      },
      {
        type: 'p',
        body: 'The GO app (formerly JapanTaxi) is the dominant taxi-booking platform in Tokyo. It works in English, allows credit card payment in-app, and shows live taxi availability. Uber Japan also operates but uses licensed taxi companies rather than private drivers — prices are comparable to metered taxis. Both apps provide upfront fare estimates.',
      },
      {
        type: 'h2',
        heading: 'Important Rules: Doors and Tipping',
      },
      {
        type: 'p',
        body: 'Tokyo taxi doors are fully automatic — the driver controls them remotely. Do not attempt to open or close the door yourself; it is both unnecessary and potentially damaging. Never tip in Japan. Tipping is considered culturally awkward and confusing — drivers have been known to chase passengers down the street to return extra change. Pay exactly the metered amount.',
      },
      {
        type: 'h2',
        heading: 'Payment: Cash, Cards and IC Cards',
      },
      {
        type: 'p',
        body: 'Most Tokyo taxis now accept credit cards (Visa, Mastercard, JCB) and IC cards such as Suica and Pasmo. However, acceptance varies by company and vehicle age. Carrying cash as a backup is always advisable, particularly for older taxis or suburban areas. The GO app allows cashless payment regardless of the individual taxi\'s card terminal.',
      },
      {
        type: 'warning',
        body: 'Tokyo taxis are essentially scam-free — drivers are honest and meters are accurate. The only real risk is taking a taxi from Narita when the train is dramatically cheaper and faster. There are no unlicensed taxi operators at Japanese airports.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from Narita Airport to Tokyo?',
            a: 'A metered taxi from Narita Airport to central Tokyo costs ¥20,000–30,000 ($130–200 USD) and takes 60–90 minutes. The Narita Express train covers the same journey in 50 minutes for ¥3,070. The train is almost always the better option unless you have an unusual destination or extremely heavy luggage.',
          },
          {
            q: 'How much is a taxi from Haneda Airport to Tokyo city centre?',
            a: 'Haneda is much closer to central Tokyo. A taxi from Haneda to Shinjuku costs ¥7,000–10,000 (about $45–65 USD) and takes 30–50 minutes depending on traffic. This is a much more reasonable taxi option than Narita, especially for late-night arrivals.',
          },
          {
            q: 'Can I hail a taxi on the street in Tokyo?',
            a: 'Yes — Tokyo taxis can be hailed from the pavement anywhere in the city. A green light on the dashboard (or a sign in the windscreen) indicates the taxi is available for hire. At busy areas there are designated taxi ranks. The GO app also allows you to request a nearby taxi without hailing.',
          },
          {
            q: 'Do Tokyo taxis accept credit cards?',
            a: 'Most modern Tokyo taxis accept credit cards (Visa, Mastercard, JCB, Amex) and IC cards (Suica, Pasmo). Older taxis may be cash-only. The GO app enables cashless payment through your phone regardless of the taxi\'s own terminal. Always carry some yen in case.',
          },
          {
            q: 'Should I tip Tokyo taxi drivers?',
            a: 'No — never tip in Japan. Tipping is not part of Japanese culture and can cause confusion or embarrassment. Pay the exact meter amount. If you accidentally overpay, the driver will return the difference. This applies to taxis, restaurants, and all other services in Japan.',
          },
          {
            q: 'Is Uber available in Tokyo?',
            a: 'Yes, but Uber in Japan works differently from most countries. Instead of private drivers, Uber partners with licensed taxi companies, so prices are very similar to metered taxis. Uber Taxi provides an upfront price estimate and allows cashless payment. The GO app is generally considered the better local option.',
          },
        ],
      },
    ],
  },

  // ── 7. Paris ───────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-paris',
    title: 'How Much Does a Taxi Cost in Paris? (2026 Rates)',
    description:
      "CDG to central Paris is a fixed €56–65; Orly is €35–41 — running the meter instead is illegal. Here's the full 2026 tariff breakdown (Tariffs A, B and C), and when Bolt or Uber beats a licensed G7 taxi.",
    publishedAt: '2025-11-21',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Paris',
    country: 'France',
    citySlug: 'paris',
    countrySlug: 'france',
    content: [
      {
        type: 'intro',
        body: 'Paris taxis use a three-tariff system (A, B, C) that changes by time of day and destination zone. Airport trips from CDG and Orly now have mandatory fixed fares. Whether you\'re arriving at Charles de Gaulle at midnight or heading to Versailles on a Sunday afternoon, the tariff you pay can vary by nearly 75%. Here\'s everything you need to know about Paris taxi prices in 2026.',
      },
      {
        type: 'h2',
        heading: 'How Paris Taxi Tariffs Work',
      },
      {
        type: 'p',
        body: 'All licensed Paris taxis are required to use the taximeter. There is no negotiating or flat-rate haggling for city journeys — every trip starts with a €4.00 flag fall and the meter runs based on one of three tariffs depending on when and where you are travelling. The tariff letter (A, B, or C) is displayed on a small light on the roof of the cab and on the meter display inside.',
      },
      {
        type: 'h2',
        heading: 'Paris Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall (prise en charge)', value: '€4.00' },
          { label: 'Tariff A — daytime in Paris (Mon–Sat 10 am–5 pm)', value: '€1.14/km' },
          { label: 'Tariff B — evenings, Sundays & public holidays', value: '€1.57/km' },
          { label: 'Tariff B — airport & suburbs (daytime)', value: '€1.57/km' },
          { label: 'Tariff C — nights (midnight–7 am) & long-distance', value: '€2.00/km' },
          { label: 'Minimum fare', value: '€8.00' },
          { label: 'Large luggage supplement (per item)', value: '€1.00' },
          { label: 'Booking by phone / app supplement', value: '€1.50' },
        ],
      },
      {
        type: 'h2',
        heading: 'Typical Paris Taxi Fares by Route',
      },
      {
        type: 'p',
        body: 'The following estimates are based on metered Tariff A (daytime weekday) with no supplements. Add 30–40% for Tariff B (evenings/Sundays) and 70% for Tariff C (late night).',
      },
      {
        type: 'table',
        rows: [
          { label: 'Gare du Nord → Eiffel Tower', value: '€18–€24' },
          { label: 'Gare du Nord → Marais (4th arr.)', value: '€12–€16' },
          { label: 'Châtelet → Sacré-Cœur (Montmartre)', value: '€14–€18' },
          { label: 'Opéra → Père Lachaise cemetery', value: '€12–€16' },
          { label: 'Eiffel Tower → Notre-Dame', value: '€14–€18' },
          { label: 'Paris centre → Versailles (20 km)', value: '€45–€60' },
          { label: 'Paris centre → Disneyland Paris (35 km)', value: '€75–€95' },
          { label: 'CDG Airport → Paris centre (metered if applicable)', value: '€55–€80' },
        ],
      },
      {
        type: 'h2',
        heading: 'Fixed Fares from Paris Airports (Mandatory)',
      },
      {
        type: 'p',
        body: 'Since 2016, licensed taxis must charge fixed regulated fares for journeys between Paris airports and the city. These are not optional — a driver who tries to run the meter for your CDG or Orly airport ride is breaking the law.',
      },
      {
        type: 'table',
        rows: [
          { label: 'CDG Airport → Right Bank (1st–10th, 17th–20th arr.)', value: '€56 fixed' },
          { label: 'CDG Airport → Left Bank (5th, 6th, 7th, 13th–15th arr.)', value: '€65 fixed' },
          { label: 'Orly Airport → Right Bank', value: '€41 fixed' },
          { label: 'Orly Airport → Left Bank', value: '€35 fixed' },
          { label: 'Beauvais Airport → Paris city', value: 'No fixed rate — negotiate or take coach' },
        ],
      },
      {
        type: 'tip',
        body: 'The CDG and Orly fixed fares are mandatory for licensed Paris taxis. If a driver claims the meter applies or quotes a higher amount, cite the Paris Police Prefecture regulated tariff. You can show them the official Paris taxi fare page on your phone. Supplements for additional passengers (4th passenger) and large luggage still apply on top of the fixed fare.',
      },
      {
        type: 'h2',
        heading: 'Uber, Bolt & G7 — Ride-Share vs Licensed Taxi',
      },
      {
        type: 'p',
        body: 'Uber VTC (voitures de transport avec chauffeur) are legal in Paris and operate alongside licensed taxis. Bolt, Marcel, and Chauffeur Privé are also active. For airport runs the fixed taxi rate is often competitive, but for city journeys VTCs can be noticeably cheaper.',
      },
      {
        type: 'table',
        rows: [
          { label: 'Service', value: 'Notes' },
          { label: 'Licensed taxi (G7, Taxis Bleus)', value: 'Regulated meter/fixed rates. Can hail on street or at rank. Takes cash and card.' },
          { label: 'Uber (UberX / Comfort)', value: 'Upfront pricing. Typically €5–15 cheaper than taxi for city trips. No airport fixed rate — surge pricing applies.' },
          { label: 'Bolt', value: 'Usually 10–15% cheaper than Uber. Growing fleet in Paris. Upfront pricing.' },
          { label: 'G7 app', value: 'Largest licensed taxi fleet — 8,500+ cabs. Fixed prices available via app. Same legal rates as street taxis.' },
          { label: 'Le Cab (Marcel)', value: 'Premium VTC. Leather interior, fixed pricing, popular for business travel.' },
        ],
      },
      {
        type: 'h2',
        heading: 'How to Pay',
      },
      {
        type: 'p',
        body: 'Licensed Paris taxis are legally required to accept credit and debit cards for any journey over €5.00 (contactless and chip-and-pin). Cash is always accepted. Uber and Bolt are cashless by default — payment is processed automatically via your account. If a taxi driver claims their card machine is "broken," this is a common scam — insist on card payment or use a different cab.',
      },
      {
        type: 'h2',
        heading: 'Scam Warnings',
      },
      {
        type: 'warning',
        body: 'Unofficial taxis (clandestine drivers) operate near CDG Terminal 2 and outside busy train stations like Gare du Nord. They approach travellers, claim to be official, and then demand €80–€150 for a city run. Never accept a ride from someone who approaches you — always go to an official taxi rank (marked with a blue "Taxi" sign) or book via G7 or Uber.',
      },
      {
        type: 'ul',
        items: [
          'Driver skips the airport fixed rate and runs the meter — refuse and cite the regulated fixed fare.',
          '"Scenic route" to inflate the fare — share your live location with someone or watch Google Maps.',
          'Broken card reader claimed to force cash payment — insist or exit and take another cab.',
          'Fake taxi rank near CDG Terminal 1 drop-off — always use the official rank at arrivals level.',
          'Baggage fee inflation — the supplement is €1 per large item, not €5 per bag.',
        ],
      },
      {
        type: 'h2',
        heading: 'Tipping in Paris Taxis',
      },
      {
        type: 'p',
        body: 'Tipping is not expected or obligatory in France. Most Parisian passengers round up to the nearest euro or add €1–2 for exceptional service. For airport runs or late-night journeys, a 5–10% tip is appreciated but never assumed. If you pay by card, many taxi card readers now include a tip prompt — it\'s fine to select zero.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from CDG Airport to Paris city centre?',
            a: 'The mandatory fixed fare is €56 to the Right Bank (1st–10th, 17th–20th arrondissements) and €65 to the Left Bank (5th, 6th, 7th, 13th–15th arrondissements). The meter should not run — it\'s a flat rate regardless of traffic.',
          },
          {
            q: 'How much is a taxi from Orly Airport to Paris?',
            a: 'The fixed fare is €35 to the Left Bank and €41 to the Right Bank. These are mandatory regulated prices for licensed taxis. Uber and Bolt are also available from Orly at similar or slightly lower prices.',
          },
          {
            q: 'Is Uber legal and safe in Paris?',
            a: 'Yes. Uber VTC is fully legal in France. Drivers are licensed and insured. Uber, Bolt, and Marcel are all legitimate alternatives to licensed taxis. For city trips they are often €5–15 cheaper than taxis. For airport journeys the difference is smaller since taxis have fixed fares.',
          },
          {
            q: 'What is the difference between Tariff A, B, and C in Paris?',
            a: 'Tariff A (€1.14/km) applies Monday–Saturday 10 am–5 pm within Paris. Tariff B (€1.57/km) applies evenings, weekends, public holidays, and all airport and suburban journeys. Tariff C (€2.00/km) applies between midnight and 7 am and for long-distance or out-of-region trips.',
          },
          {
            q: 'Can I hail a Paris taxi on the street?',
            a: 'Yes — a green roof light means the taxi is available. You can hail from the street or find an official taxi rank (look for a blue "Taxi" sign). Alternatively, book via the G7 app (largest fleet, 8,500+ cabs) or Taxis Bleus.',
          },
          {
            q: 'Are there fake taxis at CDG Airport?',
            a: 'Yes. Unlicensed drivers regularly approach travellers at Terminal 2 and claim to be official taxis. They charge 2–3× the legal rate. Always use the official taxi rank at the arrivals exit (marked with a blue sign) or pre-book via G7 or a transfer service.',
          },
        ],
      },
    ],
  },

  // ── 8. Bali ────────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-bali',
    title: 'How Much Does a Taxi Cost in Bali? (2026 Guide)',
    description:
      "Unmetered tourist taxis in Bali charge 3–5× the metered rate — a Kuta–Seminyak ride that's IDR 30,000–45,000 on the Blue Bird meter gets quoted at IDR 100,000–200,000 by touts. Here's the full 2026 fare guide for airport transfers, Gojek vs Grab, and avoiding the markup.",
    publishedAt: '2025-11-09',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Bali',
    country: 'Indonesia',
    citySlug: 'denpasar',
    countrySlug: 'indonesia',
    content: [
      {
        type: 'intro',
        body: 'Bali taxis range from cheap metered Blue Bird cabs to wildly overpriced tourist taxis charging 10× the fair rate. The island has no public metered taxi rank culture outside of Blue Bird — the majority of vehicles you see outside hotels and at popular spots are unmetered, quote-based tourist taxis that prey on visitors who don\'t know the real price. Here\'s how to pay the right fare in 2026.',
      },
      {
        type: 'h2',
        heading: 'How Bali Taxis Work',
      },
      {
        type: 'p',
        body: 'Bali has two distinct taxi categories: metered taxis (Blue Bird Group only) and unmetered charter/tourist taxis. Blue Bird is the only taxi company using a tamper-proof meter — all other cabs in Bali are charter vehicles where the price is negotiated before you get in. The result is a two-tier market where uninformed tourists routinely pay 5–10× what metered rides would cost. Ride-hailing apps Gojek and Grab have closed much of this gap and are the recommended choice for travel between major areas.',
      },
      {
        type: 'h2',
        heading: 'Bali Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Blue Bird flag fall', value: 'IDR 7,500' },
          { label: 'Blue Bird per km (daytime)', value: 'IDR 5,000' },
          { label: 'Blue Bird minimum fare', value: 'IDR 35,000' },
          { label: 'Gojek / Grab car (5 km)', value: 'IDR 30,000–60,000' },
          { label: 'Gojek / Grab motorbike (5 km)', value: 'IDR 15,000–30,000' },
          { label: 'Unmetered tourist taxi (Kuta–Seminyak, 4 km)', value: 'IDR 100,000–200,000 (3–5× metered)' },
          { label: 'Metered Blue Bird (Kuta–Seminyak, 4 km)', value: 'IDR 30,000–45,000' },
        ],
      },
      {
        type: 'h2',
        heading: 'Airport Transfer Prices (Ngurah Rai)',
      },
      {
        type: 'p',
        body: 'Ngurah Rai International Airport (DPS) has an official prepaid taxi counter inside the arrivals hall. Always use it — fares are fixed and displayed on a board. Gojek and Grab are not permitted to pick up at the airport (they can only drop off). Pre-booked private transfers are the best alternative to the prepaid counter.',
      },
      {
        type: 'table',
        rows: [
          { label: 'Ngurah Rai Airport → Kuta (5 km)', value: 'IDR 80,000–100,000 (prepaid)' },
          { label: 'Ngurah Rai Airport → Seminyak (9 km)', value: 'IDR 130,000–160,000' },
          { label: 'Ngurah Rai Airport → Canggu (14 km)', value: 'IDR 170,000–220,000' },
          { label: 'Ngurah Rai Airport → Nusa Dua (10 km)', value: 'IDR 150,000–190,000' },
          { label: 'Ngurah Rai Airport → Ubud (36 km)', value: 'IDR 300,000–400,000' },
          { label: 'Ngurah Rai Airport → Uluwatu (18 km)', value: 'IDR 200,000–270,000' },
        ],
      },
      {
        type: 'warning',
        body: 'Gojek and Grab are officially banned from picking up passengers at Ngurah Rai Airport — this is enforced. Drivers who try to pick you up outside the terminal risk losing their account. Use the official prepaid taxi counter inside the arrivals hall. Once you\'ve cleared the airport, Gojek and Grab work perfectly everywhere else in Bali.',
      },
      {
        type: 'h2',
        heading: 'Blue Bird vs Gojek/Grab vs Tourist Taxis',
      },
      {
        type: 'table',
        rows: [
          { label: 'Service', value: 'Notes' },
          { label: 'Blue Bird (metered)', value: 'Most reliable. Air-conditioned. Tamper-proof meter. Light blue cars with bird logo. Book via MyBluebird app.' },
          { label: 'Gojek (GoCar / GoRide)', value: 'Cheapest for non-airport travel. In-app pricing, no negotiation. GoCar = car, GoRide = motorbike taxi.' },
          { label: 'Grab (GrabCar / GrabBike)', value: 'Similar to Gojek. Slightly larger car fleet in some areas. Both apps available on iOS and Android.' },
          { label: 'Unmetered tourist taxi', value: 'Avoid unless you enjoy negotiating. Always quote first, agree before entry. Expect 3–6× Blue Bird rates initially.' },
          { label: 'Prepaid airport taxi', value: 'Best option arriving at DPS. Fixed price, no negotiating needed. Pay at counter inside terminal.' },
        ],
      },
      {
        type: 'tip',
        body: 'Download Gojek and Grab before you arrive. Indonesian mobile numbers are required to register — you can use a tourist SIM (available at the airport for around IDR 50,000) to sign up. Once registered, you can use your foreign phone number going forward. Both apps work with international cards.',
      },
      {
        type: 'h2',
        heading: 'Bali Taxi Scams',
      },
      {
        type: 'ul',
        items: [
          'Airport touts quoting IDR 400,000–700,000 for Kuta — official prepaid price is IDR 80,000–100,000.',
          'Fake Blue Bird taxis: look-alike light blue cars with a similar logo but no official meter. Always check the meter model and the Blue Bird app booking.',
          '"Meter broken" — genuine Blue Bird meters never break. Exit the cab and order a new one.',
          'Extra fees added at the destination (parking, toll roads that don\'t exist on that route).',
          'Hotel-arranged taxis marked up 2–3× — ask reception to call Blue Bird directly or order Gojek yourself.',
          'Gojek/Grab driver cancelling and calling you to negotiate a higher cash fare — report them in the app and request a new driver.',
        ],
      },
      {
        type: 'h2',
        heading: 'Getting Around Between Areas',
      },
      {
        type: 'p',
        body: 'Bali\'s main tourist zones — Kuta, Legian, Seminyak, Canggu, Ubud, Nusa Dua, Uluwatu — are spread out and poorly connected by public transport. The local bemo (minibus) system is largely for locals and routes are not tourist-friendly. For most visitors the practical options are: Gojek/Grab for short trips, Blue Bird for metered reliability, or a private driver by the half/full day (IDR 400,000–700,000) for trips combining multiple destinations like Ubud + Mount Batur + Kintamani.',
      },
      {
        type: 'h2',
        heading: 'Tipping in Bali',
      },
      {
        type: 'p',
        body: 'Tipping taxi drivers is not obligatory in Bali. For metered Blue Bird trips, rounding up to the nearest IDR 5,000 is courteous. For Gojek and Grab, the app handles payment automatically and tips are not expected. For charter tourist taxis where you\'ve negotiated a price, the agreed fare is the final price — no need to add extra.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'Is Grab or Gojek available in Bali?',
            a: 'Yes, both are widely available in Kuta, Seminyak, Canggu, Ubud, Nusa Dua, and Uluwatu. You cannot use them to pick up from Ngurah Rai Airport, but they work everywhere else. Download both apps — availability and pricing vary by area.',
          },
          {
            q: 'How do I identify a genuine Blue Bird taxi in Bali?',
            a: 'Blue Bird taxis are light blue with a bird logo on the door. The driver wears a uniform. The meter is a digital display mounted on the dashboard. Book via the MyBluebird app for guaranteed authenticity — look-alike blue cabs from other companies are common and are unmetered.',
          },
          {
            q: 'How much is the airport taxi in Bali?',
            a: 'The official prepaid taxi counter inside the Ngurah Rai arrivals hall charges IDR 80,000–100,000 to Kuta, IDR 130,000–160,000 to Seminyak, and IDR 300,000–400,000 to Ubud. Pay at the counter — do not negotiate with drivers outside.',
          },
          {
            q: 'Should I tip taxi drivers in Bali?',
            a: 'Tipping is appreciated but not expected. For Blue Bird metered trips, rounding up to the nearest IDR 5,000–10,000 is a common courtesy. For Gojek/Grab, no tip is needed as payment is automatic. For negotiated charter taxis, stick to the agreed fare.',
          },
          {
            q: 'Can I use a credit card in Bali taxis?',
            a: 'Blue Bird accepts GoPay (digital wallet) and sometimes card via a mounted terminal — but cash (IDR) is the default. Gojek and Grab accept international cards and GoPay. Unmetered tourist taxis are cash only. Always carry some IDR for taxi rides.',
          },
          {
            q: 'How do I get from Bali airport to Canggu?',
            a: 'The official prepaid taxi counter price to Canggu is approximately IDR 170,000–220,000 (about 14 km, 45–90 minutes depending on traffic). Alternatively, pre-book a private transfer for a fixed price. Gojek and Grab cannot collect you from the airport.',
          },
        ],
      },
    ],
  },

  // ── 9. Rome ────────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-rome',
    title: 'How Much Does a Taxi Cost in Rome? (2026 Fixed & Metered Fares)',
    description:
      "Fiumicino Airport to central Rome is a fixed €50; Ciampino is €30 — both all-inclusive, no extras. Here's the full 2026 metered-fare breakdown for getting around the city, and how unlicensed drivers try to inflate that flat rate.",
    publishedAt: '2025-10-29',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Rome',
    country: 'Italy',
    citySlug: 'rome',
    countrySlug: 'italy',
    content: [
      {
        type: 'intro',
        body: 'Rome taxis are metered and regulated by the municipality — but the city has some of Europe\'s most persistent overcharging problems. Mandatory fixed fares from Fiumicino and Ciampino airports were introduced to combat scams, but unlicensed drivers and inflated "extras" remain common. Here\'s exactly what you should pay for every major route in Rome in 2026.',
      },
      {
        type: 'h2',
        heading: 'How Rome Taxi Pricing Works',
      },
      {
        type: 'p',
        body: 'Licensed Rome taxis are always white (bianco) and show a "TAXI" illuminated sign on the roof. The meter starts running from the moment you get in — there is no charge for the driver coming to collect you for a street hail. Journeys have three tariff bands: daytime (7 am–10 pm weekdays), night (10 pm–7 am), and Sunday/holiday. Each band has a different flag fall charge. For airport journeys and selected rail terminals, fixed all-inclusive rates apply regardless of the meter.',
      },
      {
        type: 'h2',
        heading: 'Rome Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall — daytime weekday (Tariff 1)', value: '€3.00' },
          { label: 'Flag fall — Sunday & public holiday (Tariff 2)', value: '€4.50' },
          { label: 'Flag fall — night 10 pm–7 am (Tariff 3)', value: '€6.50' },
          { label: 'Per km — daytime', value: '€1.10' },
          { label: 'Per km — night/holiday', value: '€1.30' },
          { label: 'Supplement per suitcase', value: '€1.00' },
          { label: 'Supplement 5th+ passenger', value: '€1.00' },
          { label: 'Radio taxi booking supplement', value: '€3.50' },
        ],
      },
      {
        type: 'h2',
        heading: 'Fixed Airport & Station Fares',
      },
      {
        type: 'p',
        body: 'Rome municipality mandates flat fares for the two main airports and Roma Termini. These are all-inclusive — luggage, multiple passengers, and tolls are included in the flat rate. No extras should be added.',
      },
      {
        type: 'table',
        rows: [
          { label: 'Fiumicino (FCO) → anywhere within Aurelian Walls', value: '€50 fixed' },
          { label: 'Ciampino (CIA) → anywhere within Aurelian Walls', value: '€30 fixed' },
          { label: 'Roma Termini → city centre (metered)', value: '€7–12' },
          { label: 'Roma Termini → Colosseum (metered)', value: '€10–15' },
          { label: 'Roma Termini → Vatican (metered)', value: '€15–22' },
          { label: 'Roma Termini → Trastevere (metered)', value: '€10–14' },
        ],
      },
      {
        type: 'tip',
        body: 'The €50 Fiumicino flat fare applies to any destination within the Aurelian Walls — this includes the Vatican, Trastevere, and all the historic centre. It does NOT apply if your hotel is outside the walls (e.g. EUR district, Prati neighbourhood beyond the walls). In those cases the meter applies from the airport.',
      },
      {
        type: 'h2',
        heading: 'Typical Metered Fares Across Rome',
      },
      {
        type: 'table',
        rows: [
          { label: 'Colosseum → Vatican (4 km)', value: '€12–17' },
          { label: 'Trevi Fountain → Piazza Navona (1 km)', value: '€7–10' },
          { label: 'Roma Termini → Piazza del Popolo (3 km)', value: '€10–14' },
          { label: 'Trastevere → Spanish Steps (3.5 km)', value: '€11–16' },
          { label: 'Centro storico → Villa Borghese (3 km)', value: '€10–14' },
          { label: 'Roma Termini → Fiumicino Airport (26 km, metered)', value: '€45–55 (fixed applies on arrival, not departure)' },
        ],
      },
      {
        type: 'h2',
        heading: 'Uber & FREE NOW in Rome',
      },
      {
        type: 'p',
        body: 'Uber operates in Rome as a licensed VTC (private hire vehicle) service — it is legal but significantly smaller than traditional taxis. The itTaxi and FREE NOW apps connect you to licensed white taxis with metered fares, making them the most convenient way to book a legitimate cab without hailing on the street. Bolt does not currently operate in Rome.',
      },
      {
        type: 'table',
        rows: [
          { label: 'itTaxi (official taxi app)', value: 'Licensed white taxis. Metered fare. Radio taxi supplement applies. Most reliable.' },
          { label: 'FREE NOW', value: 'Works with licensed taxis in Rome. Fixed or metered options. Good availability at airports.' },
          { label: 'Uber (UberX / Black)', value: 'Legal VTC — licensed private hire drivers. Usually 10–20% pricier than metered taxis for city trips. Airport fixed rate does not apply.' },
        ],
      },
      {
        type: 'h2',
        heading: 'Rome Taxi Scams to Avoid',
      },
      {
        type: 'warning',
        body: 'Fiumicino Airport is one of Europe\'s worst hotspots for unlicensed taxi touts. Drivers approach travellers inside the terminal, claim to be official taxis, and quote €80–120 for a trip that should cost €50 on the flat rate. Never accept a ride from anyone who approaches you inside the arrivals hall. The official taxi rank is outside the terminal exit — look for the white cars in the marked queue.',
      },
      {
        type: 'ul',
        items: [
          'Non-white taxis — all licensed Rome taxis are white. Any other colour is an abusivo (unlicensed).',
          'Running the meter on an airport trip — the flat rate is mandatory from FCO/CIA. Insist on the fixed fare.',
          'Inflating extras on the flat rate — the €50 Fiumicino fare is all-inclusive. No luggage, no passenger, no toll extras.',
          '"Scenic" detour through the ring road — for FCO trips, the route should go via the A91 motorway directly into the city.',
          'Broken card machine — licensed Rome taxis accepting over €5 must offer card payment. Insist or report via 06-0609.',
          'Fake "tourist tax" at the end of the journey — no such surcharge exists in Rome.',
        ],
      },
      {
        type: 'h2',
        heading: 'Tipping in Rome',
      },
      {
        type: 'p',
        body: 'Tipping taxi drivers is not expected in Italy. Most Romans round up to the nearest euro or add €1–2 for particularly helpful service (helping with heavy luggage, navigating difficult pick-up spots). For airport runs or late-night trips, a small tip is appreciated but never assumed.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from Fiumicino Airport to Rome city centre?',
            a: 'The mandatory fixed fare is €50 for any destination within the Aurelian Walls (the historic city centre including Vatican, Trastevere, Testaccio). The fare is all-inclusive — no extras for luggage or passengers. For destinations outside the walls, the meter applies.',
          },
          {
            q: 'How much is a taxi from Ciampino Airport to Rome?',
            a: 'The fixed fare from Ciampino (CIA) to within the Aurelian Walls is €30. This is all-inclusive. Ciampino serves mainly budget airlines (Ryanair, easyJet). The official taxi rank is outside the arrivals exit.',
          },
          {
            q: 'How do I book a taxi in Rome?',
            a: 'Use the itTaxi app (official city taxi app), FREE NOW, or call 06-0609 (city taxi booking line). At the airports, use the official taxi rank — white cars only. Do not accept rides from drivers who approach you.',
          },
          {
            q: 'Are Rome taxis metered?',
            a: 'Yes — all licensed Rome taxis use a taximeter. The meter starts when you get in. Fixed flat rates apply for airport journeys (FCO →€50, CIA →€30 within the Walls). If a driver quotes a flat rate higher than these for an airport trip, or refuses to use the meter for a city trip, refuse the ride.',
          },
          {
            q: 'Is Uber legal in Rome?',
            a: 'Yes. Uber VTC (licensed private hire) is legal in Rome. However, the standard Uber Pop (non-professional driver) model is banned in Italy. UberX in Rome uses licensed professional drivers. itTaxi and FREE NOW are generally more cost-effective for city trips.',
          },
          {
            q: 'Should I tip taxi drivers in Rome?',
            a: 'Tipping is not expected. Rounding up to the nearest euro is common and appreciated. For longer trips or exceptional service, adding €1–2 is a generous gesture. Tipping €5 or more on a short city trip is unnecessary.',
          },
        ],
      },
    ],
  },

  // ── 10. Istanbul ───────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-istanbul',
    title: 'How Much Does a Taxi Cost in Istanbul? (2026 Guide)',
    description:
      "Istanbul Airport to Taksim costs ₺550–750 by metered taxi — the M11 metro does it for ₺60. Here's the full 2026 fare breakdown, the banknote-switch scam every visitor should know, and when BiTaksi is the safer call.",
    publishedAt: '2025-10-17',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Istanbul',
    country: 'Turkey',
    citySlug: 'istanbul',
    countrySlug: 'turkey',
    content: [
      {
        type: 'intro',
        body: 'Istanbul taxis are cheap by European standards — but the city is famous for a very specific banknote-switch scam that has caught out even experienced travellers. Yellow cabs are metered and legitimate, yet overcharging and scams remain widespread. Using BiTaksi or Uber is the safest approach. Here\'s what you should pay for every major Istanbul route in 2026, plus how to protect yourself.',
      },
      {
        type: 'h2',
        heading: 'How Istanbul Taxi Pricing Works',
      },
      {
        type: 'p',
        body: 'All licensed Istanbul taxis are yellow (sarı taksi) and use a tamper-resistant digital meter. The meter starts at a fixed flag fall and runs by distance. A night surcharge (gece tarifesi) of 50% applies between midnight and 6 am — the driver should switch the meter to the night rate, which is displayed on the dashboard. Bridge and tunnel tolls (Bosphorus Bridge, Eurasia Tunnel) are added to the final fare — these are legitimate.',
      },
      {
        type: 'h2',
        heading: 'Istanbul Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall (açılış)', value: '₺49' },
          { label: 'Per km (daytime)', value: '₺32' },
          { label: 'Per km (night midnight–6 am)', value: '₺48 (50% night surcharge)' },
          { label: 'Minimum fare', value: '₺49' },
          { label: 'Bosphorus Bridge toll (if crossing)', value: '₺32–40 (added to fare)' },
          { label: 'Eurasia Tunnel toll (if crossing)', value: '₺55–65 (added to fare)' },
        ],
      },
      {
        type: 'h2',
        heading: 'Sample Fares from Istanbul Airport (IST)',
      },
      {
        type: 'p',
        body: 'Istanbul Airport (IST) opened in 2018 on the European side, about 35–45 km from the city centre. Taxi is the most convenient option if you have luggage, but the metro M11 line (open since 2023) reaches Gayrettepe for ₺60 and connects to the M2 line. For budget-conscious travellers, the metro is recommended.',
      },
      {
        type: 'table',
        rows: [
          { label: 'IST Airport → Taksim Square (40 km)', value: '₺550–750' },
          { label: 'IST Airport → Sultanahmet / Eminönü (45 km)', value: '₺600–800' },
          { label: 'IST Airport → Beşiktaş (35 km)', value: '₺500–650' },
          { label: 'IST Airport → Kadıköy (Asian side, via tunnel)', value: '₺700–900' },
          { label: 'Sabiha Gökçen (SAW) → Taksim (50 km)', value: '₺400–600 + bridge toll' },
          { label: 'Taksim → Sultanahmet (5 km)', value: '₺80–130' },
          { label: 'Taksim → Kadıköy (via bridge)', value: '₺150–220 + bridge toll' },
          { label: 'Grand Bazaar → Galata Tower (2 km)', value: '₺60–90' },
        ],
      },
      {
        type: 'warning',
        body: 'The Istanbul banknote-switch scam: you hand over a ₺200 or ₺500 note; the driver quickly swaps it for a ₺20 or ₺50, then shows you the smaller note claiming "you gave the wrong one." This scam is extremely well-practised — drivers do it in under a second. Defence: only pay with the exact amount or the smallest note possible. Better yet, use BiTaksi or Uber for in-app cashless payment to avoid cash entirely.',
      },
      {
        type: 'h2',
        heading: 'BiTaksi vs Uber in Istanbul',
      },
      {
        type: 'p',
        body: 'BiTaksi is Turkey\'s leading taxi-hailing app and the recommended choice for Istanbul. It connects you to licensed yellow taxis with upfront pricing and in-app card payment — eliminating the cash scam entirely. Uber also operates in Istanbul using licensed private-hire vehicles (VTC). For safety and transparency, either app is far better than street hailing.',
      },
      {
        type: 'table',
        rows: [
          { label: 'BiTaksi', value: 'Hails official yellow taxis. Upfront fare. In-app payment. Driver name + plate shown. Most reliable choice.' },
          { label: 'Uber', value: 'Licensed VTC drivers (not yellow taxis). Slightly pricier than metered taxis. Good app experience, surge pricing during peak.' },
          { label: 'Yandex Go', value: 'Russian-developed app popular in Turkey. Competitive pricing, wide driver availability across Istanbul.' },
          { label: 'Street yellow taxi', value: 'Metered. Legitimate but cash-only and banknote scam risk. Best avoided unless apps unavailable.' },
        ],
      },
      {
        type: 'h2',
        heading: 'Istanbul Taxi Scams',
      },
      {
        type: 'ul',
        items: [
          'Banknote switch — handing back a smaller note after taking your payment. Pay cashless via BiTaksi/Uber.',
          'Night-rate meter during daytime — verify the meter shows "gündüz" (daytime) before 10 pm.',
          'Long route to inflate the fare — share your location on Google Maps and verify the route.',
          'Meter not started — driver quotes a flat rate higher than the metered fare would be. Insist on the meter.',
          'Airport unofficial taxis — drivers outside the official rank at IST or SAW are often unlicensed. Use the marked taxi queue.',
          'Toll fraud — legitimate tolls exist but drivers sometimes add fictional "parking" or "waiting" fees.',
        ],
      },
      {
        type: 'h2',
        heading: 'Public Transport Alternatives from Istanbul Airport',
      },
      {
        type: 'p',
        body: 'The M11 metro line connects Istanbul Airport directly to Gayrettepe station (Metro M2 interchange) for around ₺60 — roughly 10× cheaper than a taxi. From Gayrettepe you can reach Taksim in two stops. For Sultanahmet and the Old City, change at Yenikapı. Journey time is 35–50 minutes depending on your final destination. Havaş airport buses also run to multiple city-centre stops for ₺100–150.',
      },
      {
        type: 'h2',
        heading: 'Tipping Istanbul Taxis',
      },
      {
        type: 'p',
        body: 'Tipping is not expected in Istanbul taxis. Rounding up to the nearest ₺10 or ₺20 is common courtesy. Avoid giving a large tip — it creates an opportunity for the driver to dispute change. With BiTaksi or Uber, tips can be added in-app if desired.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from Istanbul Airport (IST) to the city centre?',
            a: 'Expect ₺550–800 to Taksim Square or Sultanahmet from IST Airport (35–45 km). Night fares (midnight–6 am) are 50% more. The M11 metro is a far cheaper alternative at ₺60.',
          },
          {
            q: 'How much is a taxi from Sabiha Gökçen (SAW) to Istanbul?',
            a: 'Sabiha Gökçen is on the Asian side, about 50 km from Taksim. Taxi fares run ₺400–600 plus the Bosphorus Bridge toll (₺32–40). Havaş buses to Kadıköy or Taksim cost ₺100–150.',
          },
          {
            q: 'Are Istanbul taxis metered?',
            a: 'Yes. All licensed yellow taxis use a tamper-resistant digital meter. The driver must start the meter at the beginning of every trip. If they refuse or quote a flat rate without negotiating in advance, insist on the meter or use BiTaksi.',
          },
          {
            q: 'What is the BiTaksi app?',
            a: 'BiTaksi is Turkey\'s leading taxi-hailing app. It connects you to licensed yellow taxis with upfront pricing, in-app card payment, and driver tracking. Available on iOS and Android. Highly recommended to avoid cash scams.',
          },
          {
            q: 'Is Uber available in Istanbul?',
            a: 'Yes. Uber operates in Istanbul using licensed private-hire vehicles (VTC). It is legal and safe. Pricing is typically slightly higher than a metered yellow taxi, but you get cashless payment and driver accountability via the app.',
          },
          {
            q: 'How do I avoid the banknote scam in Istanbul?',
            a: 'Pay cashless via BiTaksi, Uber, or Yandex Go. If paying cash, use exact change or the smallest note possible. Never hand over a ₺200 or ₺500 note. Count your change before the driver drives away.',
          },
        ],
      },
    ],
  },
  // ── 10. Phuket ─────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-phuket',
    title: 'How Much Does a Taxi Cost in Phuket? (2026 Fare Guide)',
    description:
      'Phuket taxi fares, fixed-rate zones, airport scams, and when to use Grab instead — everything you need to know before hailing a cab in 2026.',
    publishedAt: '2025-10-05',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Phuket',
    country: 'Thailand',
    citySlug: 'phuket',
    countrySlug: 'thailand',
    content: [
      {
        type: 'intro',
        body: 'Phuket taxis are infamous for refusing meters and quoting inflated flat rates to tourists. Unlike Bangkok — where metered taxis are the norm — Phuket operates almost entirely on a fixed-zone pricing system controlled by local taxi mafia. Overcharging by 2–3× is standard practice for passengers who don\'t know the going rate. Here\'s the complete fare guide for Phuket in 2026, plus how to use Grab to bypass the overcharging entirely.',
      },
      {
        type: 'h2',
        heading: 'How Phuket Taxi Pricing Works',
      },
      {
        type: 'p',
        body: 'Phuket does not have a functioning metered taxi system outside of a handful of licensed cabs (Meter Taxi Phuket). The vast majority of vehicles — tuk-tuks, minivans, and cars parked outside hotels and beaches — operate on a fixed-zone system where each driver quotes a set price per route. Prices are not officially standardised, so the "fixed" rates vary by driver and time of day. The starting quote is almost always inflated for tourists. Knowing the typical ranges is your best negotiating leverage.',
      },
      {
        type: 'h2',
        heading: 'Phuket Airport Taxi Fares (HKT) — 2026',
      },
      {
        type: 'p',
        body: 'Phuket International Airport (HKT) has an official metered taxi queue outside the arrivals hall. These are the only metered taxis in Phuket — the meter starts at ฿35 and runs ฿5.50/km. In practice, most passengers use the airport limousine desk (inside arrivals) or negotiate with private taxi drivers. The table below shows typical fixed rates.',
      },
      {
        type: 'table',
        rows: [
          { label: 'HKT → Patong Beach (30 km)', value: '฿600–700' },
          { label: 'HKT → Kata / Karon Beach (35 km)', value: '฿700–800' },
          { label: 'HKT → Kamala Beach (20 km)', value: '฿500–600' },
          { label: 'HKT → Phuket Town (25 km)', value: '฿400–500' },
          { label: 'HKT → Nai Yang / Bang Tao (10 km)', value: '฿300–400' },
          { label: 'HKT → Rawai / Nai Harn (40 km)', value: '฿800–900' },
          { label: 'HKT → Surin Beach (18 km)', value: '฿450–550' },
        ],
      },
      {
        type: 'warning',
        body: 'Inside the arrivals hall, "AOT Limousine" counters charge ฿800–1,200 for routes that official airport taxis cover for ฿400–700. Exit the terminal building and use the official metered taxi queue on the ground floor — the sign reads "Public Taxi." The saving is significant, especially for longer routes.',
      },
      {
        type: 'h2',
        heading: 'Between-Beach Fares (Typical)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Patong → Karon Beach (5 km)', value: '฿200–300' },
          { label: 'Patong → Kata Beach (8 km)', value: '฿250–350' },
          { label: 'Patong → Phuket Town (12 km)', value: '฿300–400' },
          { label: 'Patong → Surin Beach (13 km)', value: '฿350–500' },
          { label: 'Phuket Town → Rawai (15 km)', value: '฿300–400' },
          { label: 'Kata → Chalong Pier (6 km)', value: '฿150–250' },
        ],
      },
      {
        type: 'h2',
        heading: 'Grab vs Private Taxi in Phuket',
      },
      {
        type: 'p',
        body: 'Grab operates in Phuket and is by far the most transparent pricing option. App-based upfront fares remove any negotiation and eliminate overcharging. The downside: Grab driver availability is lower than Bangkok, especially outside Patong and Phuket Town. During peak season (December–February) wait times can reach 15–30 minutes. Always have the fixed-rate zones as a fallback.',
      },
      {
        type: 'table',
        rows: [
          { label: 'Grab (GrabCar)', value: 'Upfront pricing. Cashless or cash. Available in Patong, Karon, Kata, Phuket Town. Lower availability at remote beaches.' },
          { label: 'Official metered taxi (airport)', value: 'Metered (฿35 flag fall + ฿5.50/km). Only reliably available at HKT airport queue. Cheapest for longer routes.' },
          { label: 'Private taxi (negotiated)', value: 'Flat rate by area. Agree before getting in. Starting quote is always 30–50% inflated. Non-refundable once in the car.' },
          { label: 'Tuk-tuk', value: 'Short hops within a beach area. Typically ฿100–200 for 2 km. Do not use for long journeys — overpriced and uncomfortable.' },
          { label: 'Songthaew (shared pickup)', value: 'Fixed route between main beaches. ฿30–50 per person. Very cheap, some waiting involved. Best for solo travellers on a budget.' },
        ],
      },
      {
        type: 'tip',
        body: 'Songthaew (baht bus) shared pickups run fixed routes between major beach areas — Patong to Kata, Karon to Phuket Town, Phuket Town to Rawai — for ฿30–50 per person. This is 8–12× cheaper than a private taxi for the same route. Songthaews are the blue or yellow pickup trucks with bench seats in the back. Flag one down or find it at the local bus terminus in Phuket Town.',
      },
      {
        type: 'h2',
        heading: 'Phuket Taxi Scams',
      },
      {
        type: 'ul',
        items: [
          'Airport quotes of ฿1,200–1,500 for Patong — the official rate is ฿600–700. Reject and walk to the metered taxi queue.',
          'Tuk-tuk "free ride" to a tailor/gem shop — you\'re not paying with cash, you\'re paying with your time and being pressured to buy overpriced goods.',
          '"Meter broken" on the handful of metered cabs — meters work or they don\'t drive. Use Grab.',
          'Late-night doubling — taxis quote double after midnight. Agree the price before getting in regardless of time.',
          'Hotel taxi markup — hotels arrange taxis at 2–3× street rate. Ask reception to call a taxi for the driver to negotiate rather than using a hotel-arranged vehicle.',
          'Driver changing the agreed price at destination — always confirm the rate, repeat it back, and agree it is final before the journey starts.',
        ],
      },
      {
        type: 'h2',
        heading: 'Renting a Scooter vs Taking Taxis',
      },
      {
        type: 'p',
        body: 'For visitors staying a week or more, scooter rental (฿200–350/day for a 110–150cc Honda) is the most cost-effective option for getting around Phuket. Roads between beaches are generally manageable, though traffic in Patong is heavy. An international driving permit is technically required but rarely checked. Note: injuries from scooter accidents are common among tourists — assess your confidence level honestly before renting.',
      },
      {
        type: 'h2',
        heading: 'Tipping in Phuket Taxis',
      },
      {
        type: 'p',
        body: 'Tipping is not expected for negotiated flat-rate taxi rides in Phuket. The agreed price is the final price. For Grab rides, a ฿20–50 tip can be added in the app and is appreciated. For tuk-tuks and songthaews, the posted fare is final — no tip expected.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from Phuket Airport to Patong Beach?',
            a: 'The official metered taxi queue at HKT airport charges approximately ฿600–700 to Patong Beach (30 km). Inside the terminal, limousine counters charge ฿800–1,200 for the same route. Always use the metered taxi queue outside the terminal.',
          },
          {
            q: 'Do Phuket taxis use meters?',
            a: 'Outside the official airport metered taxi queue, almost no Phuket taxis use meters. The island operates on a fixed-zone negotiated pricing system. Always agree the fare before getting in. Grab provides transparent upfront pricing as an alternative.',
          },
          {
            q: 'Is Grab available in Phuket?',
            a: 'Yes. Grab operates in Phuket, particularly in Patong, Karon, Kata, and Phuket Town. Driver availability is lower than Bangkok — wait times of 15–30 minutes are common in peak season. It is the best option for transparent, non-negotiated pricing.',
          },
          {
            q: 'What is the cheapest way to get around Phuket?',
            a: 'Songthaew (shared pickup trucks / baht bus) for ฿30–50 per person between major beaches. Scooter rental for ฿200–350 per day is cheapest for flexible individual travel. Grab is the best balance of cost and convenience.',
          },
          {
            q: 'Why are Phuket taxis so expensive?',
            a: 'Phuket taxis are controlled by local taxi associations that effectively set minimum prices. The lack of a mandatory meter system means drivers quote tourist rates without competition. Grab has disrupted this somewhat, but the local taxi cartel still dominates beach-to-beach routes.',
          },
          {
            q: 'How much should I pay for a tuk-tuk in Phuket?',
            a: 'Tuk-tuks in Phuket are for short hops within a beach area — typically ฿100–200 for up to 2 km. Do not use them for inter-beach travel; private taxis or songthaews are far better value for distances over 3 km.',
          },
        ],
      },
    ],
  },

  // ── 11. Barcelona ──────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-barcelona',
    title: 'How Much Does a Taxi Cost in Barcelona? (2026 Guide)',
    description:
      "El Prat Airport to Las Ramblas costs €25–35 by metered taxi, or €6.75 on the Aerobus. Here's the full 2026 fare breakdown — night tariffs, luggage fees, and when Uber beats a metered cab.",
    publishedAt: '2025-09-24',
    readingMinutes: 7,
    category: 'taxi',
    city: 'Barcelona',
    country: 'Spain',
    citySlug: 'barcelona',
    countrySlug: 'spain',
    content: [
      {
        type: 'intro',
        body: 'Barcelona\'s black-and-yellow taxis (Taxi Barcelonaand) are well-regulated and metered. Fares are set by AMB (Àrea Metropolitana de Barcelona) and posted inside every taxi. Overcharging is uncommon but knowing the rates eliminates any doubt.',
      },
      {
        type: 'h2',
        heading: 'Barcelona Taxi Meter Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall (Tariff T-1, day)', value: '€2.35' },
          { label: 'Flag fall (Tariff T-2, night/weekend)', value: '€2.95' },
          { label: 'Per km (T-1)', value: '€1.30' },
          { label: 'Per km (T-2 — night/weekend)', value: '€1.47' },
          { label: 'Airport supplement (BCN El Prat)', value: '€4.30' },
          { label: 'Large luggage supplement', value: '€1.10/bag' },
          { label: 'Night rate (21:00–08:00)', value: 'T-2 applies' },
        ],
      },
      {
        type: 'h2',
        heading: 'Sample Fares from Barcelona Airport (BCN)',
      },
      {
        type: 'table',
        rows: [
          { label: 'BCN Airport → Las Ramblas / Gothic Quarter', value: '€25–35' },
          { label: 'BCN Airport → Eixample', value: '€30–40' },
          { label: 'BCN Airport → Gràcia / Sagrada Família', value: '€32–42' },
          { label: 'BCN Airport → Barceloneta Beach', value: '€25–35' },
          { label: 'City centre → Sagrada Família', value: '€8–14' },
        ],
      },
      {
        type: 'h2',
        heading: 'Uber vs Official Taxi in Barcelona',
      },
      {
        type: 'p',
        body: 'Uber operates in Barcelona (legally, as a licensed VTC service). Uber is often comparable in price to metered taxis and offers upfront pricing — useful if you prefer certainty. During surge hours, metered taxis are cheaper. For airport runs, the fixed official taxi rate is competitive.',
      },
      {
        type: 'tip',
        body: 'The AEROBUS express coach connects both airport terminals to Plaça Catalunya in 35 minutes for €6.75 — far cheaper than a taxi for solo travellers heading to central Barcelona.',
      },
      {
        type: 'h2',
        heading: 'How to Find and Book a Taxi in Barcelona',
      },
      {
        type: 'p',
        body: 'Official Barcelona taxis are black and yellow — one of the most recognisable colour schemes in Europe. You can hail them on the street when the green "Lliure / Libre" sign is lit. There are also fixed taxi ranks outside major hotels, at Las Ramblas, Plaça de Catalunya, and the main train stations (Sants and Passeig de Gràcia).',
      },
      {
        type: 'p',
        body: 'To pre-book, use the FREE NOW app (formerly MyTaxi) which dispatches official metered taxis — the fare is metered, not fixed, but you get an estimated total before confirming. Phone dispatch (Taxi Class, Radio Taxi 033) is also available for early flights or luggage-heavy trips.',
      },
      {
        type: 'h2',
        heading: 'When T-2 (Night/Weekend) Rates Apply',
      },
      {
        type: 'p',
        body: 'Barcelona\'s T-2 tariff applies Monday–Friday 21:00–08:00, all day Saturday, all day Sunday, and on public holidays. The difference is meaningful: a €28 daytime airport fare becomes approximately €32–36 under T-2. The meter display will show "T-2" when the higher tariff is running. If in doubt, ask the driver before departing — they are legally required to tell you.',
      },
      {
        type: 'p',
        body: 'During major events (MWC Mobile World Congress, Primavera Sound, Barcelona FC home games), demand spikes sharply. Uber and Bolt surge prices at these moments can exceed the metered taxi rate, making the regulated taxi the more predictable choice. Book your ride home from the Camp Nou or Palau Sant Jordi at least 20 minutes ahead.',
      },
      {
        type: 'h2',
        heading: 'Paying for Your Taxi in Barcelona',
      },
      {
        type: 'p',
        body: 'All licensed Barcelona taxis are required to accept credit and debit cards. A surcharge of €0.30 applies to card payments on some older terminals, but many newer vehicles absorb it. Contactless payment (Apple Pay, Google Pay) is widely accepted. If you prefer cash, euros are the only accepted currency — no drivers accept US dollars or GBP.',
      },
      {
        type: 'h2',
        heading: 'Is Tipping Expected in Barcelona Taxis?',
      },
      {
        type: 'p',
        body: 'Tipping is not mandatory in Spain. Rounding up to the nearest euro or leaving €1–2 on longer trips is common and appreciated. For a €28 airport fare, rounding to €30 is perfectly normal. Do not feel obligated to tip if the driver did not use the meter or added unexpected charges.',
      },
      {
        type: 'faq',
        faqs: [
          { q: 'How much is a taxi from Barcelona airport to the city?', a: 'Expect €25–42 depending on traffic and destination, plus a €4.30 airport supplement. Night and weekend rates (T-2) apply after 21:00.' },
          { q: 'Are Barcelona taxis metered?', a: 'Yes — all official taxis use AMB-regulated meters. If the meter is not running, ask the driver to start it.' },
          { q: 'Is Uber available in Barcelona?', a: 'Yes, Uber operates legally in Barcelona as a licensed VTC service. Bolt is also available and often slightly cheaper.' },
          { q: 'What is the cheapest way from Barcelona airport to the city?', a: 'The AEROBUS coach is €6.75 and takes 35 minutes to Plaça Catalunya — roughly five times cheaper than a taxi for a solo traveller.' },
        ],
      },
    ],
  },

  // ── 12. Sydney ─────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-sydney',
    title: 'How Much Does a Taxi Cost in Sydney? (2026 Fare Guide)',
    description:
      "Sydney Airport to the CBD costs A$45–60 by taxi — the Airport Link train does the same trip in 13 minutes for A$21.60. Here's the full 2026 fare breakdown and when Uber's 10–20% discount actually holds up.",
    publishedAt: '2025-09-13',
    readingMinutes: 7,
    category: 'taxi',
    city: 'Sydney',
    country: 'Australia',
    citySlug: 'sydney',
    countrySlug: 'australia',
    content: [
      {
        type: 'intro',
        body: 'Sydney taxis are metered and regulated by Transport for NSW. They\'re reliable but significantly more expensive than Southeast Asia — knowing the rates helps you decide when Uber is genuinely cheaper.',
      },
      {
        type: 'h2',
        heading: 'Sydney Taxi Meter Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall', value: 'A$3.60' },
          { label: 'Per km (under 10 km/h or waiting)', value: 'A$0.99/min' },
          { label: 'Per km (over 10 km/h)', value: 'A$2.19/km' },
          { label: 'Airport booking fee (from SYD)', value: 'A$4.40' },
          { label: 'Night rate (10 pm–6 am)', value: '20% surcharge' },
          { label: 'Public holiday surcharge', value: 'A$2.50' },
        ],
      },
      {
        type: 'h2',
        heading: 'Sample Fares from Sydney Airport (SYD)',
      },
      {
        type: 'table',
        rows: [
          { label: 'SYD → CBD / Circular Quay', value: 'A$45–60' },
          { label: 'SYD → Surry Hills / Darlinghurst', value: 'A$35–50' },
          { label: 'SYD → Bondi Beach', value: 'A$40–55' },
          { label: 'SYD → Manly (to ferry terminal)', value: 'A$55–75' },
          { label: 'CBD → Bondi Beach', value: 'A$25–35' },
        ],
      },
      {
        type: 'h2',
        heading: 'Uber vs Taxi in Sydney',
      },
      {
        type: 'p',
        body: 'Uber is widely available in Sydney and is often 10–20% cheaper than a metered taxi for standard routes. However, Uber surge pricing during events (New Year\'s Eve, Sydney FC matches, Vivid festival) can make taxis the better value. The Airport Link train (A$21.60 from the airport to the CBD) is the cheapest option for solo travellers.',
      },
      {
        type: 'tip',
        body: 'The Airport Link train takes 13 minutes to Central Station for A$21.60 — about a third the price of a taxi. Combine with an Opal card for free transfer to buses and ferries.',
      },
      {
        type: 'h2',
        heading: 'Finding the Taxi Rank at Sydney Airport',
      },
      {
        type: 'p',
        body: 'At the International Terminal (T1), the taxi rank is on the ground floor of the arrivals hall — follow the ground transport signs past the customs exit. At the Domestic Terminals (T2/T3), taxis queue on the arrivals kerbside. All licensed Sydney taxis are yellow or white and display a roof light — accept rides only from these marked vehicles.',
      },
      {
        type: 'p',
        body: 'Rideshare (Uber, DiDi, Ola) pickups require walking to the dedicated rideshare zones, signposted from arrivals. The wait can be 5–15 minutes during peak periods. Rideshares pick up from designated bays, not the main kerbside — following app directions exactly saves time and avoids confusion.',
      },
      {
        type: 'h2',
        heading: 'Sydney Toll Roads: What to Expect',
      },
      {
        type: 'p',
        body: 'Sydney has one of the most extensive toll road networks in Australia, and passengers pay tolls on top of the metered fare. The key tolls for airport trips are the Eastern Distributor tunnel (A$8.65 inbound to city, free outbound) and the M5 East motorway to the southern suburbs (A$8.46 each way). The driver should take the most direct route — if you\'re heading somewhere other than the CBD, ask upfront which route they plan to use.',
      },
      {
        type: 'h2',
        heading: 'Taxi vs Uber vs Train: Which Makes Sense?',
      },
      {
        type: 'p',
        body: 'For solo travellers to the CBD, the Airport Link train (A$21.60) is unambiguously the best value — it\'s faster than a taxi in traffic and doesn\'t add toll costs. For groups of 3–4, a taxi or Uber splits to A$15–20 per person and door-to-door service offsets the price difference, especially with luggage. For outer suburbs not served by direct rail (Bondi, Manly, the Hills District), taxi or Uber is the practical choice.',
      },
      {
        type: 'p',
        body: 'Uber and DiDi are 10–20% cheaper than metered taxis on standard routes and both offer upfront pricing. However, during surge periods (Friday evenings, public holidays, New Year\'s Eve) app prices can spike to twice the taxi rate. Having the official taxi rank as a backup means you\'re never stranded.',
      },
      {
        type: 'h2',
        heading: 'Paying for Your Sydney Taxi',
      },
      {
        type: 'p',
        body: 'All licensed Sydney taxis accept EFTPOS (debit/credit card) and Visa/Mastercard contactless. A card payment surcharge of 5–10% applies — it\'s visible on the meter display before you tap. Cash is also accepted. If you\'re arriving without Australian dollars, the airport ATMs (pre-customs) offer reasonable exchange rates for small amounts.',
      },
      {
        type: 'faq',
        faqs: [
          { q: 'How much is a taxi from Sydney airport to the CBD?', a: 'Expect A$45–65 including the A$4.40 airport booking fee and the Eastern Distributor tunnel toll (A$8.65). The journey takes 20–45 minutes depending on traffic.' },
          { q: 'Are there toll roads from Sydney airport?', a: 'Yes — the Eastern Distributor tunnel adds A$8.65 (inbound) to most city routes. This is paid by the passenger on top of the meter. M5 East adds A$8.46 for southern suburbs.' },
          { q: 'Is tipping expected in Sydney taxis?', a: 'Tipping is not expected in Australia. Rounding up to the nearest dollar is common but entirely optional.' },
          { q: 'Is Uber cheaper than taxis in Sydney?', a: 'Usually 10–20% cheaper on standard routes. During surge pricing (events, public holidays) metered taxis can be better value. The Airport Link train is cheapest for solo travellers to the CBD.' },
        ],
      },
    ],
  },

  // ── 13. Amsterdam ──────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-amsterdam',
    title: 'How Much Does a Taxi Cost in Amsterdam? (2026 Guide)',
    description:
      'Amsterdam taxi meter rates, Schiphol airport fares, and why booking a pre-agreed taxi saves money — updated for 2026.',
    publishedAt: '2025-09-04',
    readingMinutes: 7,
    category: 'taxi',
    city: 'Amsterdam',
    country: 'Netherlands',
    citySlug: 'amsterdam',
    countrySlug: 'netherlands',
    content: [
      {
        type: 'intro',
        body: 'Amsterdam taxis have a reputation for overcharging tourists — but the city has a capped tariff system to protect passengers. Knowing the maximum allowable fare from Schiphol is your first line of defence.',
      },
      {
        type: 'h2',
        heading: 'Amsterdam Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall', value: '€3.19' },
          { label: 'Per km', value: '€2.35' },
          { label: 'Per minute (waiting/slow traffic)', value: '€0.38' },
          { label: 'Fixed Schiphol → Amsterdam city', value: 'Capped at €47' },
          { label: 'Night rate (22:00–07:00)', value: 'No separate night tariff — meter applies' },
        ],
      },
      {
        type: 'h2',
        heading: 'Schiphol Airport to Amsterdam — What to Pay',
      },
      {
        type: 'p',
        body: 'The municipality caps the Schiphol to Amsterdam city centre fare at approximately €47. If a driver quotes significantly more, you can legally dispute the charge. The train (Intercity Direct, €5.50, 17 minutes to Centraal Station) is by far the cheapest option.',
      },
      {
        type: 'warning',
        body: 'Unofficial taxi touts operate aggressively outside Schiphol arrivals. Only use TCA-licenced taxis (look for the blue "Taxi" oval sign) from the official taxi rank at exit 4 of the arrivals hall.',
      },
      {
        type: 'h2',
        heading: 'Sample City Fares',
      },
      {
        type: 'table',
        rows: [
          { label: 'Centraal Station → Rijksmuseum', value: '€12–18' },
          { label: 'Centraal Station → Vondelpark', value: '€14–20' },
          { label: 'Centraal Station → De Pijp', value: '€10–16' },
          { label: 'Centraal Station → Jordaan', value: '€8–14' },
        ],
      },
      {
        type: 'tip',
        body: 'Amsterdam\'s canal ring is compact — most city-centre attractions are walkable or a short tram ride apart. A GVB day pass (€9.50) covers all trams, buses and metro and is almost always better value than a taxi for daytime sightseeing.',
      },
      {
        type: 'h2',
        heading: 'Uber and Bolt in Amsterdam',
      },
      {
        type: 'p',
        body: 'Both Uber and Bolt operate legally in Amsterdam as licensed VTC services. Uber is generally 15–25% cheaper than a licensed TCA taxi for city routes, with upfront pricing — useful if you want certainty before you get in. Bolt often undercuts Uber slightly, particularly on shorter journeys. Neither platform uses the TCA tariff cap, but competition between them keeps prices competitive with metered taxis.',
      },
      {
        type: 'p',
        body: 'At Schiphol, Uber and Bolt have dedicated pickup zones separate from the official taxi rank. Follow in-app directions to the designated area — it\'s a short walk from the arrivals hall. During peak arrivals (morning rush, summer school holidays), wait times can reach 10–15 minutes. The train remains the quickest option if your destination is on the rail network.',
      },
      {
        type: 'h2',
        heading: 'When Taxis Are Worth It in Amsterdam',
      },
      {
        type: 'p',
        body: 'Amsterdam\'s tram network covers most tourist areas, making taxis unnecessary for daytime sightseeing. The cases where taxis genuinely make sense are: late-night journeys after trams stop (midnight weekdays, later weekends), trips with heavy luggage to or from the canal ring where parking is difficult, and groups of 3–4 splitting the cost of a direct airport run.',
      },
      {
        type: 'p',
        body: 'One scenario where a taxi saves money: Schiphol to a hotel in the De Pijp or Jordaan neighbourhood with 3–4 bags. The train takes you to Centraal Station but then requires a tram or taxi anyway. Door-to-door for €47 split between two people (€23.50 each) competes favourably with train + tram + luggage effort at €5.50 per person.',
      },
      {
        type: 'h2',
        heading: 'Paying for Your Taxi in Amsterdam',
      },
      {
        type: 'p',
        body: 'All TCA-licensed taxis are required to accept pin (debit card), Visa, and Mastercard. Contactless is widely supported. Cash (euros) is accepted but not always preferred by drivers. Schiphol pre-booked taxis (through the Schiphol website or Schiphol Travel Taxi) provide a fixed upfront price via card — useful if you want no surprises at drop-off.',
      },
      {
        type: 'faq',
        faqs: [
          { q: 'How much is a taxi from Schiphol to Amsterdam centre?', a: 'The municipality caps the fare at approximately €47 for Schiphol to Amsterdam city centre. Expect €40–50 in practice. The Intercity train takes 17 minutes for €5.50.' },
          { q: 'Are Amsterdam taxis metered?', a: 'Yes — all licensed TCA taxis use regulated meters. If the meter is not running, ask the driver to start it or leave the vehicle.' },
          { q: 'Is tipping expected in Amsterdam taxis?', a: 'Rounding up to the nearest euro or adding 5–10% is common courtesy. It is not mandatory.' },
          { q: 'Is Uber safe to use in Amsterdam?', a: 'Yes — Uber operates legally in the Netherlands as a licensed VTC service. All drivers are background-checked. Bolt is an equally safe alternative that is often slightly cheaper.' },
        ],
      },
    ],
  },

  // ── 14. Mumbai ─────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-mumbai',
    title: 'How Much Does a Taxi Cost in Mumbai? (2026 Guide)',
    description:
      'Mumbai taxi and auto-rickshaw rates, airport fares, meter conversion charts, and Ola vs Uber comparison for 2026.',
    publishedAt: '2025-09-17',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Mumbai',
    country: 'India',
    citySlug: 'mumbai',
    countrySlug: 'india',
    content: [
      {
        type: 'intro',
        body: 'Mumbai has two distinct taxi systems running in parallel: the iconic black-and-yellow Kaali-Peeli taxis (metered, but with a confusing legacy tariff card system) and modern app-based AC cabs from Ola and Uber. Add auto-rickshaws in the suburbs and a separate airport taxi zone and you have one of the most layered transport ecosystems in Asia. Here\'s exactly what you\'ll pay in 2026, and how to navigate the meter card system that trips up almost every visitor.',
      },
      {
        type: 'h2',
        heading: 'How Mumbai Taxi Meters Work',
      },
      {
        type: 'p',
        body: 'The black-and-yellow Kaali-Peeli taxis use a meter that displays readings based on a legacy 1970s tariff — not the current fare. The actual fare is calculated by multiplying the meter reading by a conversion factor printed on a government-issued tariff card (tarrif card), which every driver is legally required to carry. The card shows two columns: the meter reading and the corresponding actual fare in rupees. Always ask to see the card before paying. This system is deliberately confusing to many tourists, but it is entirely legal — the meter reading itself is not the final price.',
      },
      {
        type: 'h2',
        heading: 'Mumbai Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Kaali-Peeli flag fall (first 1.5 km)', value: '₹28' },
          { label: 'Kaali-Peeli per km (after 1.5 km)', value: '₹14.43' },
          { label: 'Night surcharge (midnight–5 am)', value: '25% added to meter reading conversion' },
          { label: 'AC Cool Cab / Meru flag fall', value: '₹25' },
          { label: 'AC app cabs per km', value: '₹16–18' },
          { label: 'Auto-rickshaw flag fall (suburbs)', value: '₹21' },
          { label: 'Auto-rickshaw per km', value: '₹13.48' },
          { label: 'Ola/Uber (estimate for 10 km)', value: '₹180–280 depending on category' },
        ],
      },
      {
        type: 'warning',
        body: 'The Kaali-Peeli meter displays a legacy figure that is NOT the actual fare. The driver should produce a printed tariff card and show you the corresponding real amount. If a driver quotes a price substantially higher than the card shows, that is a scam. Always ask for the tariff card ("tarrif card dikhao") before handing over money.',
      },
      {
        type: 'h2',
        heading: 'Sample Fares from Mumbai Airport (BOM)',
      },
      {
        type: 'p',
        body: 'Mumbai\'s Chhatrapati Shivaji Maharaj International Airport has two terminals: T2 (international and domestic Jet Airways/IndiGo) and T1 (domestic). Both have official prepaid taxi counters that allow you to pay a fixed rate before you reach the car. This is the recommended option for first-time visitors — no meter card confusion.',
      },
      {
        type: 'table',
        rows: [
          { label: 'BOM T2 → Bandra (12 km)', value: '₹400–600' },
          { label: 'BOM T2 → Colaba / South Mumbai (30 km)', value: '₹700–1,000' },
          { label: 'BOM T2 → Juhu Beach (8 km)', value: '₹200–350' },
          { label: 'BOM T2 → Andheri (7 km)', value: '₹150–250' },
          { label: 'BOM T2 → Bandra Kurla Complex (BKC)', value: '₹250–400' },
          { label: 'BOM T1 (domestic) → Andheri (3 km)', value: '₹100–180' },
          { label: 'BOM T2 → Powai / Hiranandani', value: '₹300–450' },
        ],
      },
      {
        type: 'h2',
        heading: 'Ola, Uber, and App Cabs in Mumbai',
      },
      {
        type: 'p',
        body: 'Ola and Uber are the most popular transport choices for visitors in Mumbai — upfront pricing, no tariff card confusion, and card payment via app. Both are typically 20–40% more expensive than a Kaali-Peeli for the same route, but the certainty and AC comfort are usually worth it. During peak hours (8–10 am, 6–9 pm), both apps apply surge pricing that can double the fare. Switching to a metered Kaali-Peeli becomes the better value when surge is active.',
      },
      {
        type: 'table',
        rows: [
          { label: 'Kaali-Peeli (metered)', value: 'Cheapest. Requires tariff card check. No AC. Best for short hops with luggage.' },
          { label: 'Ola Mini / Uber Go', value: 'Budget AC cars. Upfront pricing. Slight surge applies in peak hours.' },
          { label: 'Ola Prime / Uber Comfort', value: 'Larger AC cars. 20–30% more than Mini/Go. Good for airport runs.' },
          { label: 'Auto-rickshaw', value: 'Suburbs only (not South Mumbai). Metered. Cheapest for short suburban trips. Cash only.' },
        ],
      },
      {
        type: 'tip',
        body: 'Auto-rickshaws are not permitted in South Mumbai south of the Mahim Causeway and Sion Causeway — only taxis operate there. In the suburbs (Andheri, Bandra, Powai, etc.), auto-rickshaws are the most economical option for trips under 5 km. The meter conversion card applies to rickshaws too — a separate card from the taxi one.',
      },
      {
        type: 'h2',
        heading: 'Mumbai Taxi Scams',
      },
      {
        type: 'ul',
        items: [
          'Quoting the raw meter reading as the final fare — the actual fare is 40–60% higher per the tariff card. Always ask for the card.',
          'Driver "doesn\'t have" the tariff card — all Kaali-Peeli drivers are legally required to carry it. No card = dispute the fare or use Ola/Uber.',
          'Airport touts outside T2 arrivals offering "special rates" — use the official prepaid counter inside.',
          'Fake prepaid counter staff outside the terminal — the official counter is inside, past the exit.',
          'Surge price quoted as a fixed flat rate — for Ola/Uber, always confirm via the app, never accept a verbal quote.',
          'Luggage surcharge inflation — official luggage surcharge is ₹10 per piece, not per kg or per bag at driver discretion.',
        ],
      },
      {
        type: 'h2',
        heading: 'Local Transport Within Mumbai',
      },
      {
        type: 'p',
        body: 'Mumbai\'s suburban rail network (Western, Central, and Harbour lines) is the fastest way to travel between major areas during the day — and costs ₹5–30 per journey. It is extremely crowded during rush hour but remarkably efficient off-peak. The Mumbai Metro lines (Line 1, 2A, 7, 9) cover Andheri, Dahisar, and several suburban corridors. For tourists, Ola/Uber provides the most comfortable trade-off between speed and cost for cross-city journeys.',
      },
      {
        type: 'h2',
        heading: 'Paying for Mumbai Taxis',
      },
      {
        type: 'p',
        body: 'Kaali-Peeli taxis are cash only (Indian rupees). Auto-rickshaws are cash only. Ola and Uber accept card (Visa, Mastercard), UPI, Paytm, and cash. If you\'re arriving without rupees, airport ATMs (pre- and post-customs) are available at T2 — withdraw what you need for the first day. Cards are not widely accepted at street taxis.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from Mumbai Airport to South Mumbai (Colaba/CST)?',
            a: 'Expect ₹700–1,000 by Kaali-Peeli or app cab for the 30 km journey. The trip takes 45–90 minutes depending on traffic (Mumbai\'s traffic is notorious). Ola/Uber typically quote ₹600–900 with upfront pricing.',
          },
          {
            q: 'Why does the Mumbai taxi meter show a different amount to what I pay?',
            a: 'Kaali-Peeli meters use a 1970s legacy tariff and display a reference number, not the actual fare in rupees. The driver converts this to the real fare using a government-issued tariff card. This is legal and required. The real fare is approximately 1.5–2× the meter reading. Always ask to see the tariff card.',
          },
          {
            q: 'Is Ola or Uber better in Mumbai?',
            a: 'Both are reliable. Ola has a larger fleet and broader coverage in Mumbai\'s suburbs. Uber tends to have better international card acceptance. Both offer upfront pricing in rupees with no tariff card confusion. For airport trips, Ola Prime or Uber Comfort provide the most comfortable experience.',
          },
          {
            q: 'Can auto-rickshaws travel to South Mumbai?',
            a: 'No. Auto-rickshaws are prohibited south of the Mahim Causeway and Sion Causeway — covering most of the tourist areas (Colaba, Fort, Marine Drive, Bandra). For South Mumbai, use Kaali-Peeli taxis, Ola, or Uber.',
          },
          {
            q: 'Is tipping expected in Mumbai taxis?',
            a: 'Tipping is not mandatory but appreciated. Rounding up the final fare to the nearest ₹10–20 is common. For Ola/Uber, a cash tip to the driver or an in-app tip is a welcome gesture for good service.',
          },
          {
            q: 'What is the prepaid taxi counter at Mumbai Airport?',
            a: 'Both T1 and T2 have official prepaid taxi counters inside the arrivals hall. You pay a fixed fare upfront and get a slip to give the driver at the end — no meter card confusion. Rates are government-set and displayed at the counter. Highly recommended for first-time visitors.',
          },
        ],
      },
    ],
  },

  // ── Mexico City ────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-mexico-city',
    title: 'How Much Does a Taxi Cost in Mexico City? (2026 Guide)',
    description: 'Mexico City taxi rates, AICM airport taxi costs, Uber vs sitio taxis, and how to avoid tourist scams in CDMX for 2026.',
    publishedAt: '2025-09-27',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Mexico City',
    country: 'Mexico',
    citySlug: 'mexico_city',
    countrySlug: 'mexico',
    content: [
      {
        type: 'intro',
        body: 'Mexico City (CDMX) has one of the most complex — and potentially dangerous — taxi ecosystems in Latin America. Street hailing ("taxi libre") carries a genuine risk of express kidnapping; sitio taxis from stands are safe; and Uber, Cabify, and InDriver are the recommended default for most visitors. Knowing which type to use (and which to avoid) is not just about money — it is a safety issue. Here\'s everything you need to know about CDMX taxis in 2026.',
      },
      {
        type: 'h2',
        heading: 'Mexico City Taxi Types Explained',
      },
      {
        type: 'p',
        body: 'CDMX has three main taxi categories. Taxi libres (green-and-white cars on the street) are metered but carry a high risk of robbery and kidnapping — these should be avoided by tourists entirely. Sitio taxis operate from fixed stands (sitios) at hotels, shopping centres, and metro stations and are registered and relatively safe. App-based services (Uber, Cabify, InDriver) are the most transparent and recommended for visitors. At AICM airport, only the official prepaid booth taxis are safe — Uber is also available from a designated zone.',
      },
      {
        type: 'h2',
        heading: 'Mexico City Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Sitio taxi flag fall', value: '$16 MXN' },
          { label: 'Per km', value: '$12 MXN' },
          { label: 'Minimum fare', value: '$28 MXN' },
          { label: '5 km trip estimate', value: '$76–95 MXN' },
          { label: '10 km trip estimate', value: '$140–175 MXN' },
          { label: 'Night surcharge (10 pm–6 am)', value: '+20% on meter' },
          { label: 'Uber Go (10 km, off-peak)', value: '$100–150 MXN upfront' },
          { label: 'Cabify (10 km, off-peak)', value: '$110–160 MXN upfront' },
        ],
      },
      {
        type: 'warning',
        body: 'Never hail a taxi off the street in Mexico City. Free-roaming "taxi libre" vehicles (green and white) are a known vector for express kidnapping (secuestro exprés) — a crime where passengers are taken to ATMs and forced to withdraw cash before being released. This risk applies even in tourist areas like Condesa, Roma, and Polanco. Always use Uber, Cabify, or a registered sitio taxi.',
      },
      {
        type: 'h2',
        heading: 'Airport Taxi Fares — AICM (Benito Juárez International)',
      },
      {
        type: 'p',
        body: 'Aeropuerto Internacional de la Ciudad de México (AICM) has Terminals 1 and 2. Use only the official yellow "Taxi Autorizado" (or "Sitio 300") prepaid booths inside the terminal — pay at the booth before going to the taxi queue. Fares are fixed by destination zone. Uber is permitted from a designated lane outside Terminal 2 arrivals.',
      },
      {
        type: 'table',
        rows: [
          { label: 'AICM → Centro Histórico (8 km)', value: '$220–280 MXN (prepaid booth)' },
          { label: 'AICM → Condesa / Roma Norte (10 km)', value: '$260–300 MXN' },
          { label: 'AICM → Polanco (15 km)', value: '$280–340 MXN' },
          { label: 'AICM → Santa Fe (30 km)', value: '$380–460 MXN' },
          { label: 'AICM → Uber pickup zone (T2)', value: '$150–250 MXN typical (varies)' },
          { label: 'NAICM Felipe Ángeles → Centro (50 km)', value: '$500–650 MXN (highway)' },
        ],
      },
      {
        type: 'tip',
        body: 'Uber is available from a designated pickup zone outside Terminal 2 arrivals. It is typically $50–100 MXN cheaper than the official booth taxis and fully trackable. Walk past the taxi touts immediately upon exiting and follow the Uber/rideshare signs to the app pickup area.',
      },
      {
        type: 'h2',
        heading: 'Uber, Cabify, and InDriver in CDMX',
      },
      {
        type: 'p',
        body: 'App-based services are the recommended transport choice for tourists in Mexico City. Uber has the largest fleet and widest coverage across all 16 boroughs (alcaldías). Cabify is a strong alternative, particularly for business travel. InDriver allows you to propose your own fare — drivers bid to accept it, which can yield 15–30% savings during off-peak hours. All three provide upfront pricing, driver details, and route tracking.',
      },
      {
        type: 'table',
        rows: [
          { label: 'Uber Go', value: 'Largest fleet. Most reliable coverage across CDMX. Fixed upfront pricing.' },
          { label: 'Uber Black', value: 'Premium cars. Useful for business travel or late-night safety.' },
          { label: 'Cabify', value: 'Fixed upfront pricing. Slightly smaller fleet than Uber. Popular for professional travel.' },
          { label: 'InDriver', value: 'Negotiate your fare — propose a price, drivers bid to accept. Best off-peak savings.' },
          { label: 'Sitio taxi', value: 'Safe for street trips. Fixed stand registration. Metered. Ask concierge to call one.' },
        ],
      },
      {
        type: 'h2',
        heading: 'Sitio Taxis — The Safe Street Option',
      },
      {
        type: 'p',
        body: 'Sitio taxis operate from registered fixed stands outside hotels, shopping centres (like Antara, Perisur, and Patio Universidad), Walmart locations, and many metro stations. The driver\'s details are logged at the stand. Ask the attendant — not the driver directly — to assign you a cab. You can also phone or app-book many sitios. The meter starts at $16 MXN and runs $12 MXN per km — significantly cheaper than Uber for longer journeys outside peak hours.',
      },
      {
        type: 'h2',
        heading: 'CDMX Metro as an Alternative',
      },
      {
        type: 'p',
        body: 'The Mexico City Metro is one of the cheapest metro systems in the world — a flat ₩5 MXN per journey covers the entire network. It runs from 5 am to midnight (Sundays 6 am–midnight). The metro is extremely crowded during rush hour (7–10 am, 6–9 pm) but is efficient and covers most major areas including the airport (Terminal Aérea station, Line 5). At $5 MXN per ride versus $150–280 MXN for a taxi, the metro is the obvious budget choice for most city centre movements.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'Is it safe to take a taxi in Mexico City?',
            a: 'Yes — with the right type. Uber, Cabify, and InDriver are safe and recommended. Official sitio taxis from registered stands are also safe. Never hail a taxi off the street (taxi libre) — these carry a real risk of express kidnapping, even in tourist neighbourhoods like Condesa and Roma.',
          },
          {
            q: 'How much is a taxi from Mexico City Airport (AICM) to Polanco or Roma?',
            a: 'The official prepaid booth fare is $280–340 MXN to Polanco and $260–300 MXN to Roma Norte. Uber from the Terminal 2 designated zone is typically $150–250 MXN for the same routes.',
          },
          {
            q: 'Can I use Uber at Mexico City Airport?',
            a: 'Yes. Uber has a designated pickup zone outside Terminal 2 arrivals. It is permitted and safe. The app will direct you to the exact pickup bay. Typically $50–100 MXN cheaper than the official prepaid taxi booth for the same destination.',
          },
          {
            q: 'What is InDriver and is it safe in CDMX?',
            a: 'InDriver is a ride-hailing app where you propose a fare and drivers bid to accept it. It is legal and widely used in Mexico City. Driver details are visible in-app. Savings of 15–30% versus Uber are common during off-peak hours. It is a legitimate and safe option.',
          },
          {
            q: 'How do I find a sitio taxi in Mexico City?',
            a: 'Sitio taxi stands are located outside most major hotels, shopping centres, and some metro stations. Ask the hotel concierge or security guard to flag one — they\'ll know the nearest registered stand. Do not approach individual drivers on the street.',
          },
          {
            q: 'Should I tip a taxi driver in Mexico City?',
            a: 'Tipping is not expected for metered sitio taxis but rounding up to the nearest $10–20 MXN is appreciated. For Uber and Cabify, a 10–15% in-app tip after the ride is welcomed. InDriver drivers appreciate cash tips as they negotiated a lower upfront fare.',
          },
        ],
      },
    ],
  },

  // ── Buenos Aires ───────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-buenos-aires',
    title: 'How Much Does a Taxi Cost in Buenos Aires? (2026 Rates)',
    description: 'Buenos Aires taxi rates in ARS, Ezeiza and Aeroparque airport fares, Cabify vs metered cabs, and tips for navigating high inflation in 2026.',
    publishedAt: '2025-10-11',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Buenos Aires',
    country: 'Argentina',
    citySlug: 'buenos_aires',
    countrySlug: 'argentina',
    content: [
      {
        type: 'intro',
        body: 'Buenos Aires has one of South America\'s most accessible taxi networks — yellow-and-black Radio Taxis with meters are everywhere, street hailing is safe, and app-based services like Cabify have excellent coverage. The main complication is Argentina\'s inflation: taxi rates are updated by city decree multiple times per year, meaning any quoted ARS figure may be outdated by the time you arrive. Here\'s how the system works, what you\'ll roughly pay in 2026, and how to handle the inflation challenge.',
      },
      {
        type: 'h2',
        heading: 'How Buenos Aires Taxi Pricing Works',
      },
      {
        type: 'p',
        body: 'All licensed Buenos Aires taxis (Radio Taxis) use a taximeter. The flag fall rate and per-km rate are set by the Buenos Aires city government (GCBA) and updated periodically — sometimes multiple times per year due to inflation. The meter automatically applies the correct tariff. A night surcharge of 20% applies between 10 pm and 6 am. Due to inflation, the peso figures in this guide may be outdated by the time you arrive — use Cabify or InDriver for a real-time fare estimate in ARS.',
      },
      {
        type: 'h2',
        heading: 'Buenos Aires Taxi Rates (2026)',
      },
      {
        type: 'warning',
        body: 'Argentina\'s inflation means taxi rates are updated by city decree multiple times per year. The ARS figures below are approximate for early 2026 and may be significantly out of date. Always use Cabify or InDriver for a real-time fare quote in current ARS — or check the GCBA official website for current tariffs.',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall (bajada de bandera)', value: '~$8,000 ARS' },
          { label: 'Per km (ficha)', value: '~$3,000 ARS' },
          { label: 'Minimum fare', value: '~$8,000 ARS' },
          { label: '5 km trip (approximate)', value: '$23,000–28,000 ARS' },
          { label: '10 km trip (approximate)', value: '$38,000–50,000 ARS' },
          { label: 'Night surcharge (10 pm–6 am)', value: '+20% on meter' },
          { label: 'USD equivalent (10 km, approximate)', value: 'USD 8–15 at official rate' },
        ],
      },
      {
        type: 'h2',
        heading: 'Airport Fares — Ezeiza (EZE) and Aeroparque (AEP)',
      },
      {
        type: 'p',
        body: 'Buenos Aires has two airports. Ezeiza (EZE) is the main international hub, 35 km from the city centre. Aeroparque Jorge Newbery (AEP) handles domestic and some regional flights, just 4 km from Palermo. For EZE, the official Manuel Tienda León transfer service (remis) from booths inside arrivals offers fixed-price shared and private options — recommended over metered taxis for the long trip from Ezeiza.',
      },
      {
        type: 'table',
        rows: [
          { label: 'EZE → Palermo / Recoleta (35 km)', value: 'USD 35–50 / ~$35,000–50,000 ARS (remis)' },
          { label: 'EZE → Centro / Microcentro (38 km)', value: 'USD 35–55 / ~$35,000–55,000 ARS' },
          { label: 'EZE → San Telmo / La Boca (40 km)', value: 'USD 38–55 / ~$38,000–55,000 ARS' },
          { label: 'AEP → Palermo (4 km, metered)', value: '$5,000–10,000 ARS' },
          { label: 'AEP → Centro (8 km, metered)', value: '$10,000–16,000 ARS' },
          { label: 'AEP → San Telmo (8 km, metered)', value: '$10,000–16,000 ARS' },
        ],
      },
      {
        type: 'tip',
        body: 'Many official remis services from Ezeiza are priced in USD to hedge against peso inflation — and you often get a better deal paying in USD cash at the informal exchange rate ("dólar blue"). Confirm with the Manuel Tienda León booth whether they accept dollars and at what rate. Always use the official booth inside arrivals, not drivers who approach you outside.',
      },
      {
        type: 'h2',
        heading: 'Cabify, InDriver, and Uber in Buenos Aires',
      },
      {
        type: 'p',
        body: 'Cabify is the dominant ride-hailing app in Buenos Aires — far more popular and better accepted by local drivers than Uber. Cabify\'s prices are set in real-time ARS, so they automatically reflect current inflation. InDriver allows you to propose a fare, with drivers bidding to accept — useful for saving 15–25% on longer trips during quiet hours. Uber operates in Buenos Aires but exists in a legal grey area due to pressure from taxi unions. Drivers may ask passengers to sit in the front seat and pretend to be a friend. Cabify is the legally cleaner and more comfortable option.',
      },
      {
        type: 'table',
        rows: [
          { label: 'Cabify', value: 'Recommended. Fixed upfront ARS pricing. Legally clear. Widely available. In-app payment.' },
          { label: 'InDriver', value: 'Propose your fare; drivers accept or counter. Best for savings off-peak. Cash or card.' },
          { label: 'Uber', value: 'Available but legally grey. Driver relations with taxi unions create friction. Use Cabify instead.' },
          { label: 'Radio Taxi (metered)', value: 'Safe to hail on street. ARS meter — rates may be outdated. Confirm flag fall before departure.' },
        ],
      },
      {
        type: 'h2',
        heading: 'Radio Taxis — Street Hailing in Buenos Aires',
      },
      {
        type: 'p',
        body: 'Unlike Mexico City or parts of Brazil, street hailing in Buenos Aires is generally safe. Licensed Radio Taxis are yellow with a black roof and display an illuminated "Radio Taxi" sign. The driver must show a visible ID card inside. Always confirm the meter is running at the correct flag fall before the car moves. Ask "¿Está corriendo el taxímetro?" ("Is the meter running?") if in doubt. Reputable radio taxi companies include Radio Taxi Premium (011-5238-9000) and Radio Taxi Plus (011-4931-1200).',
      },
      {
        type: 'h2',
        heading: 'Navigating Buenos Aires — Transport Tips',
      },
      {
        type: 'p',
        body: 'Buenos Aires has an excellent Subte (metro) network with 6 lines covering the main tourist areas including San Telmo, Microcentro, Palermo, Recoleta, and Belgrano. Subte fares are charged via SUBE card (rechargeable, available at kioscos/newsstands) at a very low fixed fare — typically under $200 ARS per journey. For late-night travel after the Subte closes (around 11 pm), taxis and Cabify are the practical options.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from Ezeiza Airport (EZE) to Buenos Aires city centre?',
            a: 'Approximately USD 35–55 or the equivalent in ARS via the official Manuel Tienda León remis booth inside arrivals. The journey takes 40–70 minutes depending on traffic. Due to Argentina\'s inflation, ARS figures change frequently — check with the booth on arrival.',
          },
          {
            q: 'Is it safe to hail a taxi on the street in Buenos Aires?',
            a: 'Yes — Buenos Aires Radio Taxis (yellow with black roof) are generally safe to hail. Look for the illuminated Radio Taxi sign and a visible driver ID inside. Confirm the meter starts correctly. Cabify and InDriver are alternatives if you prefer app-based tracking.',
          },
          {
            q: 'Is Uber available in Buenos Aires?',
            a: 'Uber operates in Buenos Aires but in a legal grey area due to taxi union opposition. Drivers may ask you to sit in the front and act as a friend. Cabify is legally clearer, more comfortable, and equally well-priced. InDriver is a good budget alternative.',
          },
          {
            q: 'Why are Buenos Aires taxi fares so hard to quote accurately?',
            a: 'Argentina\'s inflation means the GCBA updates taxi tariffs multiple times per year. ARS figures quoted anywhere online can be outdated within weeks. Use Cabify for a real-time ARS fare estimate, or convert recent metered rates to USD at the current exchange rate for a stable reference.',
          },
          {
            q: 'Should I pay for Buenos Aires taxis in USD?',
            a: 'Many airport transfer services accept USD and price in dollars to hedge against peso inflation. In the city, Radio Taxi meters run in ARS. You can tip in USD at the unofficial exchange rate if the driver agrees, but the meter fare itself is in ARS.',
          },
          {
            q: 'Should I tip taxi drivers in Buenos Aires?',
            a: 'Rounding up to the nearest $500–1,000 ARS is customary and appreciated. A 5–10% tip is generous but not expected. For Cabify, an in-app tip can be added. Cash tips in USD are always welcomed by drivers.',
          },
        ],
      },
    ],
  },

  // ── Cairo ─────────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-cairo',
    title: 'How Much Does a Taxi Cost in Cairo? (2026 Fare Guide)',
    description: 'Cairo taxi fares in EGP, Cairo International Airport rates, Uber vs Careem vs white taxis, and what to know about meter negotiation in Egypt 2026.',
    publishedAt: '2025-10-24',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Cairo',
    country: 'Egypt',
    citySlug: 'cairo',
    countrySlug: 'egypt',
    content: [
      {
        type: 'intro',
        body: 'Cairo is one of the cheapest cities in the world for taxis — a 10 km trip should cost less than the equivalent of $2–4 USD. The challenge is that Cairo has three parallel taxi systems: modern white metered taxis, the old black-and-white negotiated cabs, and app-based Uber and Careem. Each has different rules. Knowing which to use — and how to deal with fare negotiation in the older system — makes getting around Cairo straightforward and affordable.',
      },
      {
        type: 'h2',
        heading: 'Cairo\'s Three Taxi Types',
      },
      {
        type: 'p',
        body: 'White taxis (introduced in the 2000s) have digital meters and are the official licensed system. The old black-and-white or black-and-orange Peugeot 504 cabs have no meters — fares are set by custom and negotiated before you get in. Uber and Careem use a mix of registered private cars and some white taxis, with upfront app pricing. For tourists, Uber/Careem is the easiest; for budget travel, learning to negotiate with white taxis or knowing the going rates for old cabs works well.',
      },
      {
        type: 'h2',
        heading: 'Cairo Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'White taxi flag fall', value: 'E£5' },
          { label: 'White taxi per km', value: 'E£3–4' },
          { label: 'Minimum fare (metered)', value: 'E£15' },
          { label: '5 km trip (white taxi)', value: 'E£20–30' },
          { label: '10 km trip (white taxi)', value: 'E£35–50' },
          { label: 'Old black-and-white cab (negotiated)', value: 'E£20–60 per trip' },
          { label: 'Uber Go (10 km)', value: 'E£80–130 (upfront app price)' },
          { label: 'Careem (10 km)', value: 'E£75–120 (upfront app price)' },
        ],
      },
      {
        type: 'warning',
        body: 'Many Cairo taxi drivers — even in white metered taxis — will not use the meter, especially for tourists. They will propose a flat rate. Always insist on the meter first ("el-adaad, min fadlak" = "the meter, please"). If the driver refuses, negotiate a flat rate in Egyptian pounds BEFORE getting in. Never agree to a fare quoted in US dollars — always deal in EGP.',
      },
      {
        type: 'h2',
        heading: 'Sample Fares in Cairo (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Cairo Airport (CAI) → Tahrir Square / Downtown (25 km)', value: 'E£150–250 negotiated / E£130–200 via app' },
          { label: 'Cairo Airport (CAI) → Zamalek (30 km)', value: 'E£150–230' },
          { label: 'Cairo Airport (CAI) → Giza / Pyramids (40 km)', value: 'E£250–380' },
          { label: 'Cairo Airport (CAI) → Heliopolis (local, 5 km)', value: 'E£60–100' },
          { label: 'Tahrir Square → Khan el-Khalili bazaar (3 km)', value: 'E£25–40' },
          { label: 'Tahrir Square → Giza Pyramids (18 km)', value: 'E£80–130' },
          { label: 'Zamalek → Cairo Citadel (8 km)', value: 'E£50–80' },
        ],
      },
      {
        type: 'tip',
        body: 'At Cairo International Airport, Uber and Careem have designated pickup zones in the arrivals area outside both Terminal 2 and Terminal 3. The app shows the exact pickup point. This is strongly recommended for airport trips — upfront pricing, no negotiation, and the driver\'s details recorded. Saves the stress of dealing with meter refusals after a long flight.',
      },
      {
        type: 'h2',
        heading: 'Uber and Careem in Cairo',
      },
      {
        type: 'p',
        body: 'Both Uber and Careem (Uber\'s regional brand, headquartered in Dubai) operate widely in Cairo and are the recommended option for most tourists. Careem has deeper driver networks and is often more reliable in suburbs and outlying areas. Both offer cash and card payment — cash is important in Egypt because card payment infrastructure outside tourist areas is limited. Prices are confirmed upfront before the trip starts.',
      },
      {
        type: 'table',
        rows: [
          { label: 'Uber Go', value: 'Most widely recognised. Upfront pricing. Card and cash. Good airport coverage.' },
          { label: 'Careem', value: 'Founded in the region — deep local driver network. Often cheaper than Uber. Cash or card.' },
          { label: 'White taxi (metered)', value: 'Cheapest if meter used. Insist on meter. Cash only (EGP). No tracking.' },
          { label: 'Old black-and-white cab', value: 'No meter — negotiate before entering. Know the going rate. EGP only.' },
        ],
      },
      {
        type: 'h2',
        heading: 'How to Negotiate Taxi Fares in Cairo',
      },
      {
        type: 'p',
        body: 'For old black-and-white cabs and for white taxis whose drivers refuse the meter, the negotiation follows a clear ritual: state your destination clearly in Arabic or show it on your phone, ask "bikam?" (how much?), then counter-offer at roughly 60–70% of their initial quote. The driver will usually accept somewhere between the two. Never get in before agreeing a fare. Once seated, the agreed price is binding — drivers rarely try to change it after arrival.',
      },
      {
        type: 'h2',
        heading: 'Cairo Taxi Scams',
      },
      {
        type: 'ul',
        items: [
          'Quoting a fare in USD or euros at the airport — always deal in Egyptian pounds (EGP).',
          'Meter "malfunction" on white taxis — meters rarely actually malfunction. Insist or use Uber.',
          'Airport touts outside the terminal offering "official" transfers at EGP 400–600 for routes that should be EGP 150–250.',
          'Driver changing the agreed price at the destination — agree clearly beforehand and confirm by repeating it back.',
          'Pyramid detour: drivers offering "free" stops or "short" Pyramids detours that result in extended tours and expected large tips.',
          'Change shortfall — always carry small EGP denominations as drivers sometimes claim not to have change.',
        ],
      },
      {
        type: 'h2',
        heading: 'Getting Around Cairo — Metro Alternative',
      },
      {
        type: 'p',
        body: 'Cairo Metro has three lines covering the main commuter corridors. Line 1 (Helwan–New El-Marg) passes through the city centre including Tahrir Square (Sadat station). Line 2 (Shubra–Giza) reaches Giza. Line 3 (Airport–Kit Kat) connects Cairo Airport to the city via Abbassia. Fares are very low (E£8–10 per journey). The metro avoids Cairo\'s notorious traffic and is the fastest option for many cross-city routes during peak hours.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from Cairo Airport to the city centre?',
            a: 'Expect E£150–250 for a negotiated white or old cab to Downtown Cairo (Tahrir area). Via Uber or Careem, the app price is typically E£130–200. The journey takes 30–60 minutes depending on traffic.',
          },
          {
            q: 'Should I negotiate taxi fares in Cairo?',
            a: 'For white taxis, always ask for the meter first ("el-adaad, min fadlak"). If refused, negotiate a flat fare in EGP before entering. For old black-and-white cabs, always negotiate — there is no meter. For Uber/Careem, pricing is automatic and upfront.',
          },
          {
            q: 'What is Careem and is it available in Cairo?',
            a: 'Careem is a Middle East-founded ride-hailing app (majority-owned by Uber) with strong coverage across Egypt. It is available throughout Greater Cairo with a large local driver network. Often slightly cheaper than Uber for city trips. Both cash and card are accepted.',
          },
          {
            q: 'Do Cairo taxis accept card payment?',
            a: 'Cash only for white metered taxis and old negotiated cabs. Uber and Careem accept both international cards and cash. Always carry Egyptian pounds (EGP) in small denominations for taxi travel outside app services.',
          },
          {
            q: 'Is it safe to take a taxi in Cairo?',
            a: 'Yes. Cairo taxis are generally safe. The main risk is overcharging, not personal safety. Using Uber or Careem is the safest approach — driver details are recorded and the route is tracked. For street taxis, use metered white cabs or negotiate old cabs firmly before entering.',
          },
          {
            q: 'How do I say "use the meter" in Arabic for Cairo taxis?',
            a: '"El-adaad, min fadlak" (الع داد، من فضلك) means "the meter, please." Showing this on your phone to the driver works effectively. If they still refuse, Uber or Careem is the simplest alternative.',
          },
        ],
      },
    ],
  },

  // ── Marrakech ─────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-marrakech',
    title: 'How Much Does a Taxi Cost in Marrakech? (2026 Fare Guide)',
    description: 'Marrakech petit taxi and grand taxi fares in MAD, Menara airport rates, medina zone pricing, and how to avoid overcharging in Morocco 2026.',
    publishedAt: '2025-11-04',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Marrakech',
    country: 'Morocco',
    citySlug: 'marrakech',
    countrySlug: 'morocco',
    content: [
      {
        type: 'intro',
        body: 'Marrakech has a two-tier taxi system that works very differently from most European or Asian cities. Red petit taxis are metered and operate within city limits. Beige grand taxis handle intercity routes on a shared or private negotiated basis. As a tourist, knowing which to use and how to handle the near-universal meter refusal culture will save you money on every ride. Here\'s the complete guide for 2026.',
      },
      {
        type: 'h2',
        heading: 'Petit Taxis vs Grand Taxis — Which to Use',
      },
      {
        type: 'p',
        body: 'Petit taxis are small red cars licensed for up to 3 passengers and restricted to journeys within Marrakech city limits. They have meters. Grand taxis are larger beige cars (usually old Mercedes) that operate intercity routes — to the Atlas Mountains, Essaouira, Casablanca, Ouarzazate. Grand taxis typically depart when full (6 passengers sharing) or can be hired privately. As a tourist in Marrakech, you\'ll use petit taxis for city journeys and grand taxis for day trips.',
      },
      {
        type: 'h2',
        heading: 'Marrakech Petit Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall', value: '5 MAD' },
          { label: 'Per km', value: '3.50 MAD' },
          { label: 'Minimum fare', value: '12 MAD' },
          { label: '5 km trip (estimate)', value: '22–28 MAD' },
          { label: '10 km trip (estimate)', value: '40–50 MAD' },
          { label: 'Night rate (8 pm–6 am)', value: '+50% on meter (meter resets to higher tariff)' },
          { label: 'Supplementary passenger (3rd)', value: '2–3 MAD added' },
        ],
      },
      {
        type: 'warning',
        body: 'Petit taxi drivers in Marrakech almost universally offer a flat rate to tourists before turning on the meter. The flat rate is almost always higher than the metered fare would be. The meter is legally required. Insist: "S\'il vous plaît, utilisez le compteur" (French) or "Istakhdem al-adad, afak" (Darija). If the driver refuses, exit and take the next cab — there are always others available.',
      },
      {
        type: 'h2',
        heading: 'Marrakech Airport Fares (RAK Menara Airport)',
      },
      {
        type: 'p',
        body: 'Marrakech Menara Airport (RAK) is just 3 km from the city centre — one of the closest international airports to any city in North Africa. The municipality posts official petit taxi fares from the airport to major destinations on a board inside the arrivals hall. These are fixed rates that apply between the airport and city — the meter is not used for airport fares.',
      },
      {
        type: 'table',
        rows: [
          { label: 'RAK → Jemaa el-Fnaa / Medina (3 km)', value: '70–80 MAD (official fixed rate)' },
          { label: 'RAK → Gueliz / Ville Nouvelle (4 km)', value: '50–60 MAD' },
          { label: 'RAK → Hivernage hotel zone (2 km)', value: '55–65 MAD' },
          { label: 'RAK → Palmeraie (8 km)', value: '90–120 MAD' },
          { label: 'RAK → Majorelle Garden / MAMC area (4 km)', value: '55–70 MAD' },
        ],
      },
      {
        type: 'tip',
        body: 'Check the official fare board inside Marrakech arrivals before walking out — prices are posted per destination zone. Memorise your zone before exiting. Drivers outside the terminal know tourists are disoriented from travel and will quote 120–150 MAD for routes that should cost 60–80 MAD.',
      },
      {
        type: 'h2',
        heading: 'Medina Navigation — Petit Taxis Cannot Enter',
      },
      {
        type: 'p',
        body: 'Petit taxis cannot enter the narrow lanes of the medina — its alleys are too narrow for cars. They drop you at the nearest accessible gate (bab): Bab Doukkala, Bab Laksour, Bab Khemis, or the edge of Jemaa el-Fnaa. From there, you walk or hire a handcart porter. Always tell the driver which gate you want — "Jemaa el-Fnaa" (the main square) drops you at the closest accessible edge. From Gueliz (the new town), the ride to the medina gates costs 15–25 MAD by meter.',
      },
      {
        type: 'h2',
        heading: 'Common Petit Taxi Routes in Marrakech',
      },
      {
        type: 'table',
        rows: [
          { label: 'Jemaa el-Fnaa → Majorelle Garden (2.5 km)', value: '15–25 MAD (metered)' },
          { label: 'Gueliz → Jemaa el-Fnaa (3 km)', value: '18–28 MAD' },
          { label: 'Jemaa el-Fnaa → Menara Gardens (4 km)', value: '22–32 MAD' },
          { label: 'Hivernage → Palmeraie (7 km)', value: '35–50 MAD' },
          { label: 'Medina → train station (Gare de Marrakech, 3 km)', value: '18–28 MAD' },
        ],
      },
      {
        type: 'h2',
        heading: 'Grand Taxis — Day Trips and Intercity',
      },
      {
        type: 'p',
        body: 'Grand taxis (beige Mercedes saloons) are the standard transport for intercity routes and rural day trips. They depart from fixed stations (place des ferblantiers for Ourika, place du 16 Novembre for Essaouira, etc.) when full — 6 passengers shared. You can also book the entire taxi (a grand taxi collectif) for a higher fixed price for private use. For Marrakech day trips to the Atlas Mountains, Ourika Valley, Ouzoud Waterfalls, or Essaouira, a private grand taxi negotiated for the full day typically costs 400–900 MAD depending on the destination and driver.',
      },
      {
        type: 'table',
        rows: [
          { label: 'Marrakech → Ourika Valley (60 km shared per seat)', value: '30–50 MAD/person' },
          { label: 'Marrakech → Essaouira (190 km, private)', value: '700–900 MAD full day' },
          { label: 'Marrakech → Ouarzazate (190 km, private)', value: '700–1,000 MAD' },
          { label: 'Day trip to Atlas Mountains (private, return)', value: '400–600 MAD' },
        ],
      },
      {
        type: 'h2',
        heading: 'Uber, Careem, and Apps in Marrakech',
      },
      {
        type: 'p',
        body: 'Neither Uber nor Bolt currently operates in Marrakech. Careem (Uber\'s regional brand) also has no coverage. Morocco\'s ride-hailing market remains undeveloped in tourist cities. Your options are petit taxis (metered), grand taxis (negotiated), or private transfers booked through your riad or hotel. Many riads arrange reliable private transfers to and from the airport at fixed rates — worth asking about if you prefer certainty.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from Marrakech Airport to the medina?',
            a: '70–80 MAD is the official posted rate for the petit taxi from RAK to the Jemaa el-Fnaa / medina area. The journey takes 10–15 minutes. Check the official fare board inside arrivals before walking out.',
          },
          {
            q: 'Why do Marrakech taxi drivers refuse the meter?',
            a: 'Meter refusal is widespread in Marrakech because drivers earn more from negotiated flat rates with tourists. The meter is legally required for all journeys. Insist firmly — "le compteur, s\'il vous plaît" in French. If they still refuse, take the next taxi.',
          },
          {
            q: 'Can I use Uber or Bolt in Marrakech?',
            a: 'No. Uber, Bolt, and Careem do not operate in Marrakech. Use petit taxis with the meter for city journeys, grand taxis for intercity, or arrange private transfers through your accommodation.',
          },
          {
            q: 'What is the night rate for Marrakech taxis?',
            a: 'After 8 pm, petit taxis legally apply a 50% surcharge — the meter switches to the night tariff automatically. A journey costing 28 MAD by day will cost approximately 42 MAD at night. This is legitimate.',
          },
          {
            q: 'How do I get from Marrakech to the Atlas Mountains?',
            a: 'The cheapest option is a shared grand taxi from the place du 16 Novembre for Ourika Valley (about 30–50 MAD per person each way). For flexibility, a private grand taxi for the day costs 400–600 MAD and includes multiple stops at your pace. Organised tours are also available from the medina.',
          },
          {
            q: 'How far is Marrakech Airport from the medina?',
            a: 'Just 3 km — about a 10–15 minute drive. It is one of the closest international airports to a city centre in North Africa. Petit taxi is the standard and should cost 70–80 MAD (official rate). Walk past the touts outside and negotiate at the official taxi rank.',
          },
        ],
      },
    ],
  },

  // ── Ho Chi Minh City ──────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-ho-chi-minh-city',
    title: 'How Much Does a Taxi Cost in Ho Chi Minh City? (2026 Guide)',
    description: 'Ho Chi Minh City (Saigon) taxi fares in VND, Tan Son Nhat airport rates, Grab vs Vinasun vs Mai Linh, and how to avoid fake taxi scams in 2026.',
    publishedAt: '2025-11-16',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    citySlug: 'ho_chi_minh',
    countrySlug: 'vietnam',
    content: [
      {
        type: 'intro',
        body: 'Ho Chi Minh City (Saigon) is one of Southeast Asia\'s most energetic cities to navigate — and one where knowing which taxi to trust matters more than in most places. Fake taxis with rigged meters are a documented problem, particularly at the airport and popular tourist areas. Stick to Grab or two specific metered brands and you\'ll pay the correct fare every time. Here\'s everything you need to know about HCMC taxis in 2026.',
      },
      {
        type: 'h2',
        heading: 'How HCMC Taxi Pricing Works',
      },
      {
        type: 'p',
        body: 'Legitimate metered taxis in Ho Chi Minh City use a digital taximeter regulated by the local transport authority. Flag fall covers the first 0.5–1 km, then the per-km rate kicks in. A small night surcharge applies between 11 pm and 6 am. The total is what you pay — no extras for luggage or passengers in a standard city cab. Fake taxis look identical to real ones but use rigged meters that run 10–20× faster. The defence is simple: only use Vinasun, Mai Linh, or Grab.',
      },
      {
        type: 'h2',
        heading: 'Ho Chi Minh City Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall (Vinasun / Mai Linh)', value: '₫12,000' },
          { label: 'Per km', value: '₫9,000–11,000' },
          { label: 'Minimum fare', value: '₫12,000' },
          { label: '5 km trip (estimate)', value: '₫57,000–75,000' },
          { label: '10 km trip (estimate)', value: '₫102,000–130,000' },
          { label: 'Night surcharge (11 pm–6 am)', value: '+10–15%' },
          { label: 'Grab Go (10 km, typical)', value: '₫90,000–130,000 upfront' },
        ],
      },
      {
        type: 'warning',
        body: 'Fake taxis in HCMC use names, colours, and logos nearly identical to Vinasun and Mai Linh. "Vina Sun", "Vina-sun", "Maillinh", or similar near-identical names are fake companies. Their meters run 10–20× the legal speed — a 10 km trip that should cost ₫110,000 can show ₫800,000 on a rigged meter. Always check the car door for the exact website URL and phone number before entering. When in doubt, book via Grab.',
      },
      {
        type: 'h2',
        heading: 'Trusted Taxi Brands in Ho Chi Minh City',
      },
      {
        type: 'p',
        body: 'Only two metered taxi companies are consistently reliable and recommended for tourists in HCMC:',
      },
      {
        type: 'ul',
        items: [
          'Vinasun — white cars with green logo. Exact URL: vinasun.com. Hotline: 1088. The most common legitimate metered cab in the city.',
          'Mai Linh — green cars. Exact URL: mailinh.vn. Hotline: 1055. Second largest legitimate fleet.',
          'Both companies display a working taximeter, carry licensed drivers, and operate throughout the city and airport.',
          'Any other metered taxi brand carries a meaningful risk of being a fake — use Grab as the alternative.',
        ],
      },
      {
        type: 'h2',
        heading: 'Grab and Be — App-Based Transport',
      },
      {
        type: 'p',
        body: 'Grab is the dominant and recommended transport choice for tourists in Ho Chi Minh City. Fixed upfront pricing, full driver tracking, and in-app payment mean there is no possibility of meter fraud. GrabCar is the standard car option; GrabBike (motorbike taxi) is faster in traffic for solo passengers and typically 30–50% cheaper. Be (formerly FastGo) is a local Vietnamese competitor often 10–15% cheaper than Grab.',
      },
      {
        type: 'table',
        rows: [
          { label: 'GrabCar', value: 'Most recommended. Fixed upfront price. Full route tracking. Card or cash.' },
          { label: 'GrabBike', value: 'Fastest in traffic. Solo only. 30–50% cheaper than GrabCar for the same route.' },
          { label: 'Be (BeRide / BeCar)', value: 'Vietnamese alternative. Often 10–15% cheaper. Good availability across the city.' },
          { label: 'Vinasun (metered)', value: 'Safe metered option. Use only official white cars with vinasun.com logo.' },
          { label: 'Mai Linh (metered)', value: 'Safe metered option. Green cars with mailinh.vn logo.' },
        ],
      },
      {
        type: 'h2',
        heading: 'Tan Son Nhat Airport (SGN) Taxi Fares',
      },
      {
        type: 'p',
        body: 'Tan Son Nhat International Airport (SGN) is 7 km from the District 1 city centre. Fake taxis are particularly active outside the arrivals hall — always use the official Vinasun/Mai Linh rank inside the terminal, or pre-book Grab from the designated app zone.',
      },
      {
        type: 'table',
        rows: [
          { label: 'SGN → District 1 / Bến Thành (7 km)', value: '₫130,000–180,000 metered; ₫110,000–160,000 Grab' },
          { label: 'SGN → District 3 (9 km)', value: '₫140,000–200,000' },
          { label: 'SGN → District 7 / Phú Mỹ Hưng (15 km)', value: '₫200,000–280,000' },
          { label: 'SGN → Bình Thạnh (7 km)', value: '₫100,000–150,000' },
          { label: 'SGN → Thủ Đức / District 9 (20 km)', value: '₫250,000–350,000' },
        ],
      },
      {
        type: 'tip',
        body: 'Book your Grab before exiting the arrivals terminal. At SGN, Grab pickups are from a designated zone in the international arrivals carpark — follow the Grab/Be signs after customs. The Grab price is confirmed upfront and is typically ₫20,000–50,000 less than the metered taxi rank. Avoid any driver who approaches you inside the terminal.',
      },
      {
        type: 'h2',
        heading: 'Getting Around HCMC by District',
      },
      {
        type: 'p',
        body: 'Most tourist activity is centred in District 1 (Ben Thanh, War Remnants Museum, Notre-Dame Cathedral area). District 3 has many restaurants and cafes. District 7 (Phú Mỹ Hưng) is a modern expat area further south. Grab or GrabBike between districts typically costs ₫50,000–150,000 depending on distance. For the Ben Thanh–Bui Vien–Notre-Dame area, distances are walkable (1–3 km) and GrabBike is faster than a car in daytime traffic.',
      },
      {
        type: 'h2',
        heading: 'HCMC Metro — New in 2024',
      },
      {
        type: 'p',
        body: 'Metro Line 1 (Bến Thành to Suối Tiên, 19.7 km) opened in December 2024 — the first metro line in Vietnam. It runs from Ben Thanh station (central District 1) east to Thu Duc city. Fares are ₫7,000–20,000 depending on distance. For tourists, it is useful for reaching Binh Thanh and points east but does not cover the airport (which is northwest of the city). Further metro lines are under construction.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from Ho Chi Minh City airport to District 1?',
            a: 'Expect ₫130,000–180,000 by Vinasun or Mai Linh meter (7 km). Via Grab, typically ₫110,000–160,000 with upfront pricing. Journey time is 20–50 minutes depending on traffic — HCMC airport road can be slow during rush hours.',
          },
          {
            q: 'How do I identify a fake taxi in Ho Chi Minh City?',
            a: 'Fake taxis copy Vinasun and Mai Linh branding with near-identical but slightly different names, logos, or phone numbers. Check the car door for the exact URL (vinasun.com or mailinh.vn) and hotline (1088 / 1055). If in doubt, do not get in — use Grab instead.',
          },
          {
            q: 'Is Grab safe in Ho Chi Minh City?',
            a: 'Yes. Grab is the safest and most convenient transport option in HCMC. All drivers are registered, the route is tracked, and the upfront price is fixed before the trip. Both card and cash are accepted. GrabBike is also safe and faster in traffic for solo passengers.',
          },
          {
            q: 'Should I tip taxi drivers in Ho Chi Minh City?',
            a: 'Tipping is not expected but appreciated. Rounding up to the nearest ₫10,000–20,000 is a common gesture. For Grab, a small cash tip to the driver at the end is welcomed but not required.',
          },
          {
            q: 'Can I pay by card in HCMC taxis?',
            a: 'Vinasun and Mai Linh are primarily cash only (Vietnamese dong). Grab accepts international cards, GrabPay wallet, and cash. Bring small VND denominations for metered taxi payments as drivers may not carry change for large notes.',
          },
          {
            q: 'Is GrabBike safe in Ho Chi Minh City?',
            a: 'Yes. GrabBike motorbike taxis are widely used by locals and tourists. All drivers are registered with Grab. Helmets are provided by the driver (legally required). GrabBike is the fastest way to travel 5–15 km in HCMC traffic — typically 30–50% cheaper than GrabCar for the same route.',
          },
        ],
      },
    ],
  },

  // ── Kuala Lumpur ──────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-kuala-lumpur',
    title: 'How Much Does a Taxi Cost in Kuala Lumpur? (2026 Guide)',
    description: 'Kuala Lumpur taxi rates in MYR, KLIA and KL Sentral airport fares, Grab vs metered cabs, and KLIA Ekspres train comparison for 2026.',
    publishedAt: '2025-11-30',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    citySlug: 'kuala_lumpur',
    countrySlug: 'malaysia',
    content: [
      {
        type: 'intro',
        body: 'Kuala Lumpur\'s taxi market has been largely displaced by Grab — which is faster, cheaper, and more reliable than metered cabs for the vast majority of journeys. The KLIA Ekspres train from the airport is one of the best airport rail connections in Southeast Asia. And metered taxis, while officially regulated, have a widespread flat-rate refusal problem that Grab completely sidesteps. Here\'s the complete guide to KL transport in 2026.',
      },
      {
        type: 'h2',
        heading: 'How KL Taxi Pricing Works',
      },
      {
        type: 'p',
        body: 'Licensed taxis in Kuala Lumpur use a government-regulated taximeter. The flag fall covers the first km, then the per-km rate runs until the destination. A 50% night surcharge applies between midnight and 6 am. In practice, KL taxi drivers — particularly in tourist areas (KLCC, Bukit Bintang, Brickfields, Chow Kit) — frequently refuse to use the meter and instead quote a flat rate. The flat rate is almost always higher than the metered fare. Insisting on the meter is your right, but Grab eliminates the confrontation entirely.',
      },
      {
        type: 'h2',
        heading: 'Kuala Lumpur Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall (first 1 km)', value: 'RM 3.00' },
          { label: 'Per km', value: 'RM 1.50' },
          { label: 'Minimum fare', value: 'RM 3.00' },
          { label: '5 km trip (estimate)', value: 'RM 10–13' },
          { label: '10 km trip (estimate)', value: 'RM 18–22' },
          { label: 'Waiting time', value: 'RM 0.40/min' },
          { label: 'Night surcharge (midnight–6 am)', value: '+50% on metered fare' },
          { label: 'Grab Go (10 km, typical)', value: 'RM 12–20 upfront' },
        ],
      },
      {
        type: 'warning',
        body: 'Metered taxi drivers in Kuala Lumpur — especially near KLCC, Bukit Bintang, and the Golden Triangle — routinely refuse the meter and quote flat rates of RM 15–40 for journeys that cost RM 8–15 by meter. The meter is legally required. Say "sila guna meter" (Malay for "please use the meter"). If refused, use Grab — it will almost always be cheaper than the flat rate being offered.',
      },
      {
        type: 'h2',
        heading: 'KLIA and KLIA2 Airport Taxi Fares',
      },
      {
        type: 'p',
        body: 'Kuala Lumpur International Airport (KLIA and KLIA2 for AirAsia) is 57 km from KL city centre. Both terminals have official fixed-price taxi booths inside the arrivals halls — pay at the booth before going to the car. Budget taxis are standard sedans; Premier taxis are larger/newer cars. Grab has a designated pickup zone at both terminals.',
      },
      {
        type: 'table',
        rows: [
          { label: 'Budget taxi → KL city centre (57 km)', value: 'RM 75–85' },
          { label: 'Premier taxi → KL city centre', value: 'RM 110–130' },
          { label: 'Budget taxi → Petaling Jaya / Subang (50 km)', value: 'RM 65–80' },
          { label: 'Budget taxi → Bangsar / Damansara (55 km)', value: 'RM 70–85' },
          { label: 'Grab from KLIA → KL city centre', value: 'RM 55–90 (varies by surge)' },
          { label: 'KLIA Ekspres train to KL Sentral', value: 'RM 55 (28 minutes — fastest)' },
        ],
      },
      {
        type: 'tip',
        body: 'The KLIA Ekspres train from KLIA (and KLIA2 via shuttle connection) to KL Sentral takes 28–33 minutes for RM 55 — faster than any taxi during peak hours and significantly cheaper for solo travellers. From KL Sentral you can connect to the MRT, LRT, Monorail, and KTM Komuter for any destination in the city. Highly recommended unless you have very heavy luggage or a very early/late arrival.',
      },
      {
        type: 'h2',
        heading: 'Grab in Kuala Lumpur',
      },
      {
        type: 'p',
        body: 'Grab is the default transport choice for the vast majority of KL residents and visitors. The app is available throughout Kuala Lumpur, Petaling Jaya, Shah Alam, Subang, and the Klang Valley. GrabCar pricing is typically 15–30% cheaper than metered taxis and provides upfront pricing with no meter refusal. GrabBike is not available in KL — it was banned in Malaysia for safety reasons. Booking via the Grab app from KLIA or KLIA2 is straightforward from the designated rideshare pickup bays.',
      },
      {
        type: 'table',
        rows: [
          { label: 'GrabCar (standard)', value: 'Most recommended. Upfront pricing. Cashless or cash. Wide availability.' },
          { label: 'GrabCar Plus', value: 'Newer or larger cars. 15–20% more than standard. Good for airport runs.' },
          { label: 'GrabPet / GrabFamily', value: 'Specialty categories for pet-friendly or child-seat trips.' },
          { label: 'Metered taxi (Comfort Cab etc.)', value: 'Use only if meter running — insist "sila guna meter." Avoid flat-rate offers.' },
          { label: 'Airport fixed booth taxi', value: 'Pre-paid at counter. Safe. Slightly more expensive than Grab. No surge risk.' },
        ],
      },
      {
        type: 'h2',
        heading: 'Sample Fares Within KL City',
      },
      {
        type: 'table',
        rows: [
          { label: 'KL Sentral → KLCC Petronas Towers (5 km)', value: 'RM 10–15 metered / RM 8–14 Grab' },
          { label: 'Bukit Bintang → Batu Caves (15 km)', value: 'RM 25–35 metered / RM 20–30 Grab' },
          { label: 'KLCC → Chinatown / Petaling Street (4 km)', value: 'RM 9–13 metered' },
          { label: 'KL Sentral → Bangsar (3 km)', value: 'RM 8–12 metered' },
          { label: 'Bukit Bintang → Mid Valley Megamall (7 km)', value: 'RM 14–20 metered / RM 12–18 Grab' },
        ],
      },
      {
        type: 'h2',
        heading: 'KL Public Transport — Metro and Rail',
      },
      {
        type: 'p',
        body: 'KL has a good rapid transit network: MRT (Klang Valley MRT lines 1 and 2), LRT (Kelana Jaya and Ampang lines), Monorail (city centre loop), and KTM Komuter (suburban). The MRT connects to most major tourist areas including Bukit Bintang, KLCC, Bangsar, and the suburbs. A single journey costs RM 1–5 depending on distance. For most city centre movements, the MRT/LRT is faster than a taxi during peak hours and significantly cheaper.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from KLIA Airport to Kuala Lumpur city centre?',
            a: 'The fixed-price booth taxi costs RM 75–85 (budget) or RM 110–130 (premier). Grab from the designated rideshare zone costs RM 55–90 depending on time. The KLIA Ekspres train is RM 55 and takes 28 minutes — fastest and often cheapest.',
          },
          {
            q: 'Is Grab cheaper than taxis in Kuala Lumpur?',
            a: 'Yes, typically 15–30% cheaper than a metered taxi — and Grab always uses upfront pricing, eliminating flat-rate disputes. During surge periods, Grab can occasionally match or exceed metered taxi prices, but this is uncommon in KL outside major events.',
          },
          {
            q: 'Why won\'t KL taxi drivers use the meter?',
            a: 'Meter refusal is a widespread problem in KL tourist areas. Drivers earn more from flat-rate negotiations with visitors who don\'t know the metered fare. The meter is legally required — say "sila guna meter." Grab sidesteps this entirely with upfront pricing.',
          },
          {
            q: 'Do taxis in Kuala Lumpur accept credit cards?',
            a: 'Most metered taxis are cash only (Malaysian ringgit). Grab accepts international Visa/Mastercard, e-wallets (GrabPay, Touch \'n Go eWallet), and cash. Airport fixed booth taxis typically accept card as well.',
          },
          {
            q: 'Is the KLIA Ekspres worth it from KL Airport?',
            a: 'Yes. At RM 55 for a 28-minute direct train to KL Sentral, it is faster than any taxi during peak hours and the same price as a Grab (often cheaper when surge applies). Essential for solo travellers with manageable luggage. Groups of 3–4 may find splitting a Grab or airport taxi more convenient door-to-door.',
          },
          {
            q: 'Is tipping expected in Kuala Lumpur taxis?',
            a: 'Tipping is not expected or common in Malaysia. Rounding up to the nearest RM 1–2 is a courteous gesture but not expected. For Grab, no tip is needed — payment is automatic via the app.',
          },
        ],
      },
    ],
  },

  // ── Lisbon ────────────────────────────────────────────────────────────────
  {
    slug: 'how-much-does-a-taxi-cost-in-lisbon',
    title: 'How Much Does a Taxi Cost in Lisbon? (2026 Fare Guide)',
    description: 'Lisbon taxi fares in euros, Humberto Delgado airport rates, Uber vs licensed taxis, and why trams are sometimes a better choice in 2026.',
    publishedAt: '2025-12-09',
    readingMinutes: 8,
    category: 'taxi',
    city: 'Lisbon',
    country: 'Portugal',
    citySlug: 'lisbon',
    countrySlug: 'portugal',
    content: [
      {
        type: 'intro',
        body: 'Lisbon taxis are reliable, metered, and relatively affordable by Western European standards. The city also has excellent Uber and Bolt coverage, making it one of the easiest European capitals for transparent, hassle-free transport. Overcharging is uncommon, meters are the norm, and the airport is just 7 km from the city centre. Here\'s what you\'ll pay for every major Lisbon route in 2026.',
      },
      {
        type: 'h2',
        heading: 'How Lisbon Taxi Pricing Works',
      },
      {
        type: 'p',
        body: 'Lisbon taxis operate on three tariff bands set by IMTT (Institute of Mobility and Transport). Tarifa 1 (daytime weekday) is the base rate. Tarifa 2 applies evenings, nights, and weekends — approximately 20% higher than Tarifa 1. Tarifa 3 applies to journeys outside the Lisbon city limits (e.g., to Sintra, Cascais, or Setúbal) and adds 20% on top of Tarifa 2. The current tariff is displayed on a sticker in the rear window of every licensed taxi. All taxis are cream/ivory coloured with a green stripe, or plain black (retro livery in the Bairro Alto area).',
      },
      {
        type: 'h2',
        heading: 'Lisbon Taxi Rates (2026)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Flag fall — Tarifa 1 (6 am–9 pm weekdays)', value: '€3.25' },
          { label: 'Per km — Tarifa 1', value: '€0.47' },
          { label: 'Flag fall — Tarifa 2 (evenings, nights, weekends)', value: '€3.90' },
          { label: 'Per km — Tarifa 2', value: '€0.57' },
          { label: 'Tarifa 3 (outside Lisbon city limits)', value: 'Tarifa 2 + 20%' },
          { label: 'Luggage surcharge (4th bag and beyond)', value: '€1.60 per item' },
          { label: 'Minimum fare', value: '€3.25' },
          { label: 'Waiting / slow traffic', value: '€14.80/hour (Tarifa 1)' },
        ],
      },
      {
        type: 'h2',
        heading: 'Lisbon Airport Taxi Fares — Humberto Delgado (LIS)',
      },
      {
        type: 'p',
        body: 'Humberto Delgado Airport is just 7 km from Baixa (city centre) — one of the closest international airports to a European capital. All licensed taxis use the meter. There is no fixed airport fare — Tarifa 1 applies on weekdays, Tarifa 2 on evenings and weekends. The official taxi rank is outside the arrivals exit on the ground level.',
      },
      {
        type: 'table',
        rows: [
          { label: 'LIS → Baixa / Rossio / Chiado (7 km)', value: '€12–18 (T1) / €15–22 (T2)' },
          { label: 'LIS → Alfama / Castelo (8 km)', value: '€14–20' },
          { label: 'LIS → Bairro Alto / Príncipe Real (9 km)', value: '€14–20' },
          { label: 'LIS → Belém (15 km)', value: '€18–28' },
          { label: 'LIS → Parque das Nações (6 km)', value: '€8–14' },
          { label: 'LIS → Sintra (32 km)', value: '€35–55 (Tarifa 3)' },
          { label: 'LIS → Cascais (35 km)', value: '€50–70 (Tarifa 3)' },
        ],
      },
      {
        type: 'tip',
        body: 'The Metro Red Line from the airport runs to Alameda (change for Green/Blue lines to Baixa-Chiado or Rossio) for €1.65 and takes about 25–30 minutes. The Aerobus (Bus 1) to Baixa and Cais do Sodré costs €4. Both are excellent alternatives for solo travellers with manageable luggage. Taxis and Uber/Bolt are better for groups, late arrivals, or when you have significant luggage.',
      },
      {
        type: 'h2',
        heading: 'Uber and Bolt in Lisbon',
      },
      {
        type: 'p',
        body: 'Uber is legal and extremely popular in Lisbon — one of its strongest markets in Southern Europe. Bolt is also well-established and frequently 10–15% cheaper than Uber for the same journeys. Both have dedicated pickup zones at LIS Airport and operate throughout the greater Lisbon area. Response times in the city centre are typically 3–5 minutes. Upfront pricing removes any meter tariff ambiguity, particularly helpful for late-night or weekend arrivals when Tarifa 2 applies.',
      },
      {
        type: 'table',
        rows: [
          { label: 'Licensed taxi (metered)', value: 'Cream with green stripe. Tarifa 1/2/3. Slightly pricier than apps. Card and cash.' },
          { label: 'Uber', value: 'Legal VTC. Upfront pricing. One of Europe\'s best Uber markets. Wide availability.' },
          { label: 'Bolt', value: 'Often 10–15% cheaper than Uber. Growing fleet. Upfront pricing. Good airport coverage.' },
          { label: 'FREE NOW (mytaxi)', value: 'Hails licensed metered taxis via app. Meter price + booking fee. Useful for guaranteed official taxi.' },
        ],
      },
      {
        type: 'h2',
        heading: 'Sample City Fares Within Lisbon',
      },
      {
        type: 'table',
        rows: [
          { label: 'Rossio → Belém (10 km, Tarifa 1)', value: '€10–16' },
          { label: 'Baixa → Alfama / Castelo (2 km)', value: '€6–9' },
          { label: 'Bairro Alto → Parque das Nações (14 km)', value: '€15–22' },
          { label: 'Praça Marquês de Pombal → Oriente Station (12 km)', value: '€13–19' },
          { label: 'Belém → Sintra (33 km, Tarifa 3)', value: '€40–60' },
        ],
      },
      {
        type: 'h2',
        heading: 'When Trams and Metro Are Better Value',
      },
      {
        type: 'p',
        body: 'Lisbon\'s yellow trams — especially Tram 28E (Martim Moniz to Prazeres, through Alfama and Graça) — are a slower but far cheaper and more atmospheric way to navigate the historic centre. A tram ticket is €3 (or included in a 24-hour Viva Viagem travel card at €6.65). The Metro covers five lines and connects all major areas from the airport through Baixa to Belém. For any journey over 3 km, the Metro is faster than a taxi in peak traffic. Uber and taxis make the most sense for late-night travel after public transport stops (around midnight on weekdays, later on weekends).',
      },
      {
        type: 'h2',
        heading: 'Paying for Taxis in Lisbon',
      },
      {
        type: 'p',
        body: 'All licensed Lisbon taxis are required to accept Visa and Mastercard for fares over €5. A card surcharge of up to €0.25 may apply. Contactless payment (including Apple Pay) is increasingly available. Cash (euros) is always accepted. Uber and Bolt are cashless by default via the app. If you\'re arriving without euros, the airport has ATMs both pre- and post-customs.',
      },
      {
        type: 'faq',
        faqs: [
          {
            q: 'How much is a taxi from Lisbon Airport to the city centre?',
            a: 'Expect €12–18 during daytime weekdays (Tarifa 1) or €15–22 evenings and weekends (Tarifa 2). The journey to Baixa/Rossio takes 15–25 minutes. Bolt is typically €2–5 cheaper than a metered taxi for the same route.',
          },
          {
            q: 'Is Uber or Bolt cheaper than taxis in Lisbon?',
            a: 'Yes — Bolt tends to be cheapest, followed by Uber, then licensed metered taxis. The difference is small for short city trips (€1–3) but can be €4–7 for longer journeys to Belém or Parque das Nações. All three are reliable and safe.',
          },
          {
            q: 'What is Tarifa 2 and when does it apply?',
            a: 'Tarifa 2 is the higher taxi rate in Lisbon — approximately 20% more expensive than Tarifa 1. It applies Monday–Saturday after 9 pm, all day Sunday, and on public holidays. If you\'re arriving on a Friday evening or Sunday, expect Tarifa 2.',
          },
          {
            q: 'Do Lisbon taxi drivers speak English?',
            a: 'Many do, particularly drivers at LIS Airport and in tourist areas. If not, showing the destination address on your phone works well. Uber and Bolt eliminate the language barrier entirely as all communication is via the app.',
          },
          {
            q: 'What is the cheapest way from Lisbon Airport to the city centre?',
            a: 'The Metro Red Line costs €1.65 and takes about 25–30 minutes to Baixa-Chiado or Rossio. The Aerobus (Bus 1) costs €4. Both are excellent for solo travellers. For groups of 3–4, splitting a Bolt or Uber taxi is comparable in cost to public transport and door-to-door.',
          },
          {
            q: 'Are Lisbon taxis metered?',
            a: 'Yes — all licensed Lisbon taxis use an official taximeter. The tariff is displayed in the rear window. If the meter is not running, ask the driver to start it. Meter refusal is much less common in Lisbon than in Southeast Asia or North Africa — overcharging is not a major issue in Lisbon.',
          },
        ],
      },
    ],
  },

  // ── Taxi Driver Phrases (Tier 2 — Linkable / Shareable) ───────────────────
  {
    slug: 'what-to-say-to-your-taxi-driver-in-15-languages',
    title: 'What to Say to Your Taxi Driver in 15 Languages',
    description: 'Essential taxi phrases in 15 languages — from "please use the meter" to "I\'d like a receipt." A reference guide for travellers visiting 120+ countries.',
    publishedAt: '2026-02-09',
    readingMinutes: 8,
    category: 'travel',
    content: [
      {
        type: 'intro',
        body: 'Knowing five phrases in the local language can transform a taxi ride from stressful to smooth. You don\'t need to be fluent — you just need to cover the moments that matter: destination, meter, price, receipt. Here\'s your cheat sheet for 15 languages covering most of the world\'s major tourist destinations.',
      },
      {
        type: 'h2',
        heading: 'Why These Six Phrases Matter',
      },
      {
        type: 'ul',
        items: [
          '"Please take me to [destination]" — the most fundamental phrase',
          '"Please use the meter" — combats the most common tourist overcharge tactic',
          '"How much does it cost?" — for routes where meters are not used',
          '"Is this the correct price?" — signals you\'re informed',
          '"Please stop here" — essential for flexible navigation',
          '"Can I have a receipt?" — important for business travellers and expense claims',
        ],
      },
      {
        type: 'h2',
        heading: 'Spanish',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"Por favor, lléveme a…"' },
          { label: 'Please use the meter', value: '"Por favor, use el taxímetro"' },
          { label: 'How much does it cost?', value: '"¿Cuánto cuesta?"' },
          { label: 'Stop here please', value: '"Pare aquí, por favor"' },
          { label: 'Can I have a receipt?', value: '"¿Me puede dar un recibo?"' },
        ],
      },
      {
        type: 'h2',
        heading: 'French',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"Emmenez-moi à… s\'il vous plaît"' },
          { label: 'Please use the meter', value: '"Utilisez le compteur, s\'il vous plaît"' },
          { label: 'How much does it cost?', value: '"Combien ça coûte ?"' },
          { label: 'Stop here please', value: '"Arrêtez-vous ici, s\'il vous plaît"' },
          { label: 'Can I have a receipt?', value: '"Puis-je avoir un reçu ?"' },
        ],
      },
      {
        type: 'h2',
        heading: 'Thai (ภาษาไทย)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"ไปที่… หน่อยครับ/ค่ะ" (Pai tee… noi khrap/kha)' },
          { label: 'Please use the meter', value: '"ใช้มิเตอร์ด้วยครับ/ค่ะ" (Chai miter duay khrap/kha)' },
          { label: 'How much does it cost?', value: '"ราคาเท่าไร?" (Raka thaorai?)' },
          { label: 'Stop here please', value: '"จอดตรงนี้ครับ/ค่ะ" (Jod trong nee khrap/kha)' },
          { label: 'Can I have a receipt?', value: '"ขอใบเสร็จด้วยครับ/ค่ะ" (Kho bai set duay khrap/kha)' },
        ],
      },
      {
        type: 'h2',
        heading: 'Japanese (日本語)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"…まで行ってください" (… made itte kudasai)' },
          { label: 'Please use the meter', value: '"メーターを使ってください" (Meter wo tsukatte kudasai)' },
          { label: 'How much does it cost?', value: '"いくらですか？" (Ikura desu ka?)' },
          { label: 'Stop here please', value: '"ここで止めてください" (Koko de tomete kudasai)' },
          { label: 'Can I have a receipt?', value: '"領収書をください" (Ryōshūsho wo kudasai)' },
        ],
      },
      {
        type: 'h2',
        heading: 'Arabic (العربية)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"من فضلك خذني إلى…" (Min fadlak khudhni ila…)' },
          { label: 'Please use the meter', value: '"من فضلك استخدم العداد" (Min fadlak istaakhdam al-adad)' },
          { label: 'How much does it cost?', value: '"بكم؟" (Bikam?)' },
          { label: 'Stop here please', value: '"قف هنا من فضلك" (Qif huna min fadlak)' },
          { label: 'Can I have a receipt?', value: '"ممكن فاتورة؟" (Mumkin fatora?)' },
        ],
      },
      {
        type: 'h2',
        heading: 'Vietnamese (Tiếng Việt)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"Cho tôi đến… với"' },
          { label: 'Please use the meter', value: '"Bật đồng hồ đi ạ"' },
          { label: 'How much does it cost?', value: '"Bao nhiêu tiền?"' },
          { label: 'Stop here please', value: '"Dừng ở đây nhé"' },
          { label: 'Can I have a receipt?', value: '"Cho tôi hóa đơn được không?"' },
        ],
      },
      {
        type: 'h2',
        heading: 'Indonesian / Malay (Bahasa)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"Tolong antar saya ke…"' },
          { label: 'Please use the meter', value: '"Tolong pakai argo"' },
          { label: 'How much does it cost?', value: '"Berapa harganya?"' },
          { label: 'Stop here please', value: '"Berhenti di sini, tolong"' },
          { label: 'Can I have a receipt?', value: '"Boleh minta kuitansi?"' },
        ],
      },
      {
        type: 'h2',
        heading: 'Portuguese (Português)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"Por favor, leve-me a…"' },
          { label: 'Please use the meter', value: '"Por favor, use o taxímetro"' },
          { label: 'How much does it cost?', value: '"Quanto custa?"' },
          { label: 'Stop here please', value: '"Pare aqui, por favor"' },
          { label: 'Can I have a receipt?', value: '"Pode me dar um recibo?"' },
        ],
      },
      {
        type: 'h2',
        heading: 'Italian (Italiano)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"Per favore, mi porti a…"' },
          { label: 'Please use the meter', value: '"Per favore, usi il tassametro"' },
          { label: 'How much does it cost?', value: '"Quanto costa?"' },
          { label: 'Stop here please', value: '"Si fermi qui, per favore"' },
          { label: 'Can I have a receipt?', value: '"Può darmi una ricevuta?"' },
        ],
      },
      {
        type: 'h2',
        heading: 'German (Deutsch)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"Bitte fahren Sie mich zu…"' },
          { label: 'Please use the meter', value: '"Bitte schalten Sie das Taxameter ein"' },
          { label: 'How much does it cost?', value: '"Wie viel kostet das?"' },
          { label: 'Stop here please', value: '"Halten Sie hier bitte an"' },
          { label: 'Can I have a receipt?', value: '"Kann ich eine Quittung bekommen?"' },
        ],
      },
      {
        type: 'h2',
        heading: 'Hindi (हिंदी)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"कृपया मुझे… ले चलिए" (Kripaya mujhe… le chaliye)' },
          { label: 'Please use the meter', value: '"कृपया मीटर चलाइए" (Kripaya meter chalaiye)' },
          { label: 'How much does it cost?', value: '"कितने का है?" (Kitne ka hai?)' },
          { label: 'Stop here please', value: '"यहाँ रोकिए" (Yahaan rokiye)' },
          { label: 'Can I have a receipt?', value: '"रसीद दीजिए" (Raseed dijiye)' },
        ],
      },
      {
        type: 'h2',
        heading: 'Korean (한국어)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"…으로 가주세요" (…euro gajuseyo)' },
          { label: 'Please use the meter', value: '"미터기 켜주세요" (Mitogi kyeojuseyo)' },
          { label: 'How much does it cost?', value: '"얼마예요?" (Eolmayeyo?)' },
          { label: 'Stop here please', value: '"여기 세워주세요" (Yeogi sewojuseyo)' },
          { label: 'Can I have a receipt?', value: '"영수증 주세요" (Yeongsujeung juseyo)' },
        ],
      },
      {
        type: 'h2',
        heading: 'Chinese Simplified (普通话)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"请送我去…" (Qǐng sòng wǒ qù…)' },
          { label: 'Please use the meter', value: '"请打表" (Qǐng dǎ biǎo)' },
          { label: 'How much does it cost?', value: '"多少钱？" (Duōshao qián?)' },
          { label: 'Stop here please', value: '"在这里停车" (Zài zhèlǐ tíngchē)' },
          { label: 'Can I have a receipt?', value: '"可以给我收据吗？" (Kěyǐ gěi wǒ shōujù ma?)' },
        ],
      },
      {
        type: 'h2',
        heading: 'Russian (Русский)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"Пожалуйста, отвезите меня в…" (Pozhaluista, otvezite menya v…)' },
          { label: 'Please use the meter', value: '"Включите счётчик, пожалуйста" (Vklyuchite schyotchik, pozhaluista)' },
          { label: 'How much does it cost?', value: '"Сколько стоит?" (Skol\'ko stoit?)' },
          { label: 'Stop here please', value: '"Остановитесь здесь" (Ostanovites\' zdes\')' },
          { label: 'Can I have a receipt?', value: '"Можно квитанцию?" (Mozhno kvitantsiyu?)' },
        ],
      },
      {
        type: 'h2',
        heading: 'Turkish (Türkçe)',
      },
      {
        type: 'table',
        rows: [
          { label: 'Please take me to…', value: '"Lütfen beni…\'ye götürün"' },
          { label: 'Please use the meter', value: '"Lütfen taksimetreyi açın"' },
          { label: 'How much does it cost?', value: '"Ne kadar tutar?"' },
          { label: 'Stop here please', value: '"Burada durun lütfen"' },
          { label: 'Can I have a receipt?', value: '"Fiş alabilir miyim?"' },
        ],
      },
      {
        type: 'tip',
        body: 'Screenshot the phrases for your destination before you travel — no WiFi required. In countries where meter refusal is common (Thailand, Vietnam, Egypt, Morocco), "Please use the meter" is the single most valuable phrase you can memorise.',
      },
      {
        type: 'faq',
        faqs: [
          { q: 'What is the most useful taxi phrase when travelling internationally?', a: '"Please use the meter" — or its equivalent in the local language. Meter refusal is the most common form of tourist overcharging worldwide. Knowing this phrase signals you\'re informed and deters opportunistic pricing.' },
          { q: 'How do I get city-specific advice on what to say to drivers?', a: 'Hootling\'s taxi fare checker includes local driver phrases in the local language for your specific route — including contextual tips for the city you\'re in. Available for 120+ cities after a route check.' },
          { q: 'Do I need to speak the local language to take a taxi safely?', a: 'Not fluently — but knowing two or three key phrases makes a significant difference. Showing your destination address on your phone is always a safe fallback. Ride-hailing apps like Grab, Uber, and Bolt eliminate the language barrier entirely.' },
        ],
      },
    ],
  },
]

import { GENERATED_BLOG_POSTS } from './blog-posts-generated'
import { BATCH2_BLOG_POSTS } from './blog-posts-batch2'
import { BATCH3_BLOG_POSTS } from './blog-posts-batch3'
import { BATCH3B_BLOG_POSTS } from './blog-posts-batch3b'
import { BATCH3C_BLOG_POSTS } from './blog-posts-batch3c'
import { BATCH3D_BLOG_POSTS } from './blog-posts-batch3d'
import { BATCH4_BLOG_POSTS } from './blog-posts-batch4'
import { BATCH5_BLOG_POSTS } from './blog-posts-batch5'
import { BATCH6_BLOG_POSTS } from './blog-posts-batch6'

/** All posts: hand-written + AI-generated. */
const ALL_POSTS: BlogPost[] = [...BLOG_POSTS, ...GENERATED_BLOG_POSTS, ...BATCH2_BLOG_POSTS, ...BATCH3_BLOG_POSTS, ...BATCH3B_BLOG_POSTS, ...BATCH3C_BLOG_POSTS, ...BATCH3D_BLOG_POSTS, ...BATCH4_BLOG_POSTS, ...BATCH5_BLOG_POSTS, ...BATCH6_BLOG_POSTS]

export function getBlogPost(slug: string): BlogPost | undefined {
  return ALL_POSTS.find((p) => p.slug === slug)
}

export function getAllBlogSlugs(): string[] {
  return ALL_POSTS.map((p) => p.slug)
}

/** Returns the first post marked featured: true, or the most-recent post as fallback. */
export function getFeaturedPost(): BlogPost {
  return (
    ALL_POSTS.find((p) => p.featured) ??
    [...ALL_POSTS].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0]
  )
}

/** Returns the N most-recent posts across all batches, optionally excluding a slug. */
export function getRecentPosts(n: number, excludeSlug?: string): BlogPost[] {
  return [...ALL_POSTS]
    .filter((p) => p.slug !== excludeSlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, n)
}

/**
 * Returns N related posts for a given post, ranked by relevance:
 *   city match  → 3 pts  (same city = most related)
 *   country match → 2 pts
 *   category match → 1 pt
 * Ties broken by most-recent publishedAt.
 * Used in the "Related Posts" section at the bottom of every article.
 */
export function getRelatedPosts(post: BlogPost, n = 3): BlogPost[] {
  return ALL_POSTS
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0
      if (post.city   && p.city    === post.city)    score += 3
      if (post.country && p.country === post.country) score += 2
      if (p.category === post.category)               score += 1
      return { post: p, score }
    })
    .sort((a, b) =>
      b.score - a.score ||
      new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime()
    )
    .slice(0, n)
    .map((s) => s.post)
}

/**
 * Counts words across all text content in a post (headings, body, list items,
 * FAQ questions + answers, table labels + values).
 *
 * Used for:
 *   1. `wordCount` field in BlogPosting JSON-LD (schema.org requirement)
 *   2. Thin-content detection — posts below 600 words may struggle to rank
 *      for competitive head terms. Aim for 800+ on city taxi-cost posts.
 */
export function getWordCount(post: BlogPost): number {
  const texts: string[] = []
  for (const s of post.content) {
    if (s.body)    texts.push(s.body)
    if (s.heading) texts.push(s.heading)
    if (s.items)   texts.push(...s.items)
    if (s.faqs)    s.faqs.forEach((f) => texts.push(f.q, f.a))
    if (s.rows)    s.rows.forEach((r) => texts.push(r.label, r.value))
  }
  return texts.join(' ').trim().split(/\s+/).filter(Boolean).length
}
