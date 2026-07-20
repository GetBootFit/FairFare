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

  // ── Colombo / Sri Lanka Taxi Fares ─────────────────────────────────────────

  {
    slug: 'how-much-does-a-taxi-cost-in-colombo',
    title: 'How Much Does a Taxi Cost in Colombo? Sri Lanka Meter Rates (2026)',
    description: 'Sri Lanka metered taxis charge Rs80 flag-fall then Rs80/km — a 10km Colombo city ride costs Rs880. But most tuk-tuks are unmetered. Here\'s the full 2026 guide: PickMe vs Uber, airport fares from BIA, and three-wheeler vs sedan.',
    publishedAt: '2026-07-20',
    readingMinutes: 7,
    category: 'taxi',
    city: 'Colombo',
    country: 'Sri Lanka',
    citySlug: 'colombo',
    content: [
      {
        type: 'intro',
        body: 'Sri Lanka has a proper metered taxi system — Rs80 flag-fall, then Rs80 per kilometre — but only a fraction of the vehicles you\'ll be offered actually use it. Air-conditioned sedans booked through PickMe or Uber run on the meter and charge those regulated rates. The three-wheelers (tuk-tuks) that dominate Colombo\'s streets are almost always unmetered and require negotiation. Understanding which vehicle you\'re in — and insisting on the meter or agreeing a price first — is the difference between paying Rs300 and Rs900 for the same 5km journey.',
      },
      { type: 'h2', heading: 'Sri Lanka Taxi Meter Rates at a Glance' },
      {
        type: 'table',
        rows: [
          { label: 'Metered taxi flag-fall', value: 'Rs80' },
          { label: 'Rate per km (metered sedan)', value: 'Rs80' },
          { label: 'Minimum fare', value: 'Rs100' },
          { label: '5 km journey (e.g. Fort → Pettah)', value: 'Rs480' },
          { label: '10 km journey (e.g. Fort → Nugegoda)', value: 'Rs880' },
          { label: '15 km journey (e.g. Fort → Dehiwala)', value: 'Rs1,280' },
          { label: 'Tuk-tuk (negotiated, 5 km)', value: 'Rs300–500 — tourist-facing rates' },
          { label: 'BIA Airport (CMB) → Colombo city centre', value: 'Rs2,500–4,000 by metered taxi' },
          { label: 'Night surcharge (after 22:00)', value: '+30–50% on negotiated tuk-tuk fares' },
        ],
      },
      { type: 'h2', heading: 'PickMe vs Uber — Use One of These' },
      {
        type: 'p',
        body: 'The single most useful advice for any visitor to Colombo: download PickMe before you land. PickMe is Sri Lanka\'s dominant ride-hailing platform, built locally, and used by the vast majority of residents. It offers both tuk-tuks and air-conditioned sedans, shows the fare upfront, and charges metered rates — no negotiation, no surprises. Uber also operates in Colombo and connects you to licensed taxi sedans at similar fares. Between the two, PickMe has higher driver density in Colombo and shorter wait times; Uber is useful as a backup when PickMe shows no cars nearby. Both apps accept card payment and keep a trip record.',
      },
      {
        type: 'ul',
        items: [
          'PickMe sedan: metered rate (Rs80/km), air-conditioned, app-tracked — the safest and most consistent option',
          'PickMe tuk-tuk: slightly cheaper than sedan, open-air, good for short daytime hops under 5km',
          'Uber: metered sedan rates comparable to PickMe — useful backup, slightly fewer drivers',
          'Street-hailed tuk-tuk: always negotiate first; Rs50–80/km is a fair local rate if you can achieve it',
          'Hotel taxi desks: convenient but typically 50–100% more expensive than app rates — ask the price before committing',
          'Radio cabs (CABS, Quick Cabs): metered, reliable, bookable by phone — good for pre-scheduled airport runs',
        ],
      },
      { type: 'h2', heading: 'Bandaranaike International Airport (CMB) to Colombo' },
      {
        type: 'p',
        body: 'Bandaranaike International Airport (BIA/CMB), also known as Katunayake Airport, sits 35km north of Colombo city centre. In normal traffic the drive takes 45–60 minutes; during rush hour (7–9am, 5–8pm) on the Colombo–Katunayake Expressway it can stretch to 90 minutes or more. Official metered taxis at the BIA taxi rank charge Rs2,500–4,000 depending on your Colombo destination — Fort, Kollupitiya, and Bambalapitiya at the lower end; Mount Lavinia or Rajagiriya at the higher. Pre-book a PickMe or radio cab from the arrivals hall for the most transparent pricing. Avoid drivers who approach you before you exit arrivals — quoted prices will be Rs5,000–8,000 for the same journey.',
      },
      {
        type: 'tip',
        body: 'Negombo, the beach resort town 8km north of the airport, is a popular first stop for visitors arriving on evening flights. A tuk-tuk or PickMe tuk-tuk from BIA to Negombo beach hotels costs Rs400–700 and takes 15–25 minutes — far cheaper and closer than making the full Colombo run after a long flight.',
      },
      { type: 'h2', heading: 'Tuk-Tuks — The Street Reality' },
      {
        type: 'p',
        body: 'Three-wheelers (locally called three-wheelers or tuk-tuks) are the most visible form of transport in Colombo and the most likely to cause fare confusion. The vast majority operate without meters — the driver quotes a price, you counter, you agree. For residents, the going rate is Rs50–70 per km. For tourists in the Pettah, Fort, and Galle Face areas, opening quotes of Rs500–800 for a 3km journey are common. Use PickMe tuk-tuk to see the fair market price before negotiating with a street driver — it anchors the conversation. At major tourist sites (the Galle Face promenade, Gangaramaya Temple), a polite but firm counter-offer of 40–50% of the opening quote will usually succeed.',
      },
      {
        type: 'warning',
        body: 'Four common Colombo taxi scams: (1) Gem shop detour — tuk-tuk drivers in Fort and Pettah offer sightseeing tours that "happen" to stop at a gem or batik shop where they earn commission. State your destination clearly and refuse diversions. (2) Off-meter sedan — a metered taxi that starts driving without turning on the meter, then invents a flat rate at the destination. Watch for the meter to click on before you leave the kerb. (3) Airport tout pricing — drivers outside arrivals quoting Rs6,000–10,000 for a Colombo run that should be Rs2,500–4,000; walk to the official metered rank or use PickMe. (4) Currency confusion — quoting in USD then converting at an unfavourable rate; all local fares are in Sri Lankan Rupees.',
      },
      { type: 'h2', heading: 'Getting Around Beyond Colombo' },
      {
        type: 'p',
        body: 'For long-distance travel — Colombo to Kandy (115km), Galle (130km), or Mirissa (175km) — metered taxis become impractical. The meter would run Rs9,200–14,000 one-way to Kandy. For these journeys, negotiate a fixed intercity rate with a radio cab or app-based driver: Rs5,000–8,000 Colombo–Kandy, Rs6,000–10,000 Colombo–Galle depending on vehicle and driver. Sri Lanka Railways is often the better choice — the Colombo–Kandy train (Rs3 hours, Rs300–800 depending on class) is one of the most scenic rail journeys in Asia.',
      },
      { type: 'h2', heading: 'Frequently Asked Questions' },
      {
        type: 'faq',
        faqs: [
          {
            q: 'What are the taxi meter rates in Sri Lanka?',
            a: 'Licensed metered taxis (sedans) in Colombo charge Rs80 flag-fall and Rs80 per kilometre. A 5km city journey costs approximately Rs480; 10km costs Rs880. These rates apply to app-booked PickMe and Uber sedans. Three-wheelers (tuk-tuks) are almost always unmetered — negotiate before boarding.',
          },
          {
            q: 'How much is a taxi from Colombo Airport (BIA) to the city?',
            a: 'A metered taxi from Bandaranaike International Airport (CMB/BIA) to central Colombo costs Rs2,500–4,000 depending on your destination, covering 35km in 45–90 minutes. Pre-book via PickMe or a radio cab for transparent pricing. Avoid touts at arrivals who quote Rs5,000–8,000.',
          },
          {
            q: 'Is PickMe better than Uber in Sri Lanka?',
            a: 'For most journeys in Colombo, yes — PickMe has higher driver density, faster pickup times, and was built specifically for Sri Lanka\'s road conditions. Uber is a reliable backup. Fares on both platforms are comparable. Download PickMe before you land.',
          },
          {
            q: 'How do I negotiate a fair tuk-tuk fare in Colombo?',
            a: 'Open PickMe and check the tuk-tuk estimate for your journey — this gives you the honest market rate. Then negotiate with the street driver starting from that number. In tourist areas, expect to start at 40–50% of the driver\'s opening quote. Always agree the price before getting in.',
          },
          {
            q: 'Do taxis in Sri Lanka take card payment?',
            a: 'App-booked PickMe and Uber rides accept card through the app. Street-hailed tuk-tuks and metered sedans are cash only — Sri Lankan Rupees. ATMs are widely available in Colombo; Hatton National Bank (HNB) and Commercial Bank ATMs reliably accept foreign cards.',
          },
          {
            q: 'How much does a taxi from Colombo to Kandy cost?',
            a: 'A metered taxi would run Rs9,000–14,000 at meter rates — impractical. Negotiate a fixed intercity rate: Rs5,000–8,000 is the going range for a private air-conditioned sedan (3–4 hour journey, 115km). The train (Rs300–800 depending on class) is cheaper and more scenic.',
          },
        ],
      },
    ],
    references: [
      { label: 'PickMe — Sri Lanka\'s leading ride-hailing app', url: 'https://pickme.lk' },
      { label: 'National Transport Commission Sri Lanka', url: 'https://www.ntc.gov.lk' },
    ],
  },

]
