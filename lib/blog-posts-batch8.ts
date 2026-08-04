import type { BlogPost } from "./blog-posts";

export const BATCH8_BLOG_POSTS: BlogPost[] = [
  // ── Uber vs Taxi Lisbon ─────────────────────────────────────────────────────
  {
    slug: "uber-vs-taxi-lisbon",
    title: "Uber vs Taxi in Lisbon: Which Is Cheaper in 2026?",
    description:
      "Bolt is usually the cheapest option in Lisbon — often 20–30% less than Uber and 15–25% less than a metered taxi. Here's how they compare for the airport run, Alfama hills, and city hops.",
    publishedAt: "2026-08-04",
    readingMinutes: 6,
    category: "taxi",
    city: "Lisbon",
    country: "Portugal",
    citySlug: "lisbon",
    countrySlug: "portugal",
    content: [
      {
        type: "intro",
        body: "Lisbon has three realistic options for getting around: official metered taxis (white with a green roof band), Uber, and Bolt. In practice, Bolt tends to beat Uber on price by 15–25% and undercuts metered taxis for most routes. All three are legitimate and reliable — the choice usually comes down to price and wait time. Here's the full breakdown for 2026.",
      },
      { type: "h2", heading: "Lisbon Taxi Meter Rates (2026)" },
      {
        type: "table",
        rows: [
          { label: "Flag fall", value: "€3.25" },
          {
            label: "Rate per km — Tariff 1 (day, Mon–Sat 6 am–9 pm)",
            value: "€0.47",
          },
          {
            label: "Rate per km — Tariff 2 (nights, Sundays, holidays)",
            value: "€0.57",
          },
          { label: "Airport surcharge (LIS departures)", value: "€1.60" },
          { label: "Luggage supplement (per item over 50 cm)", value: "€1.60" },
          { label: "Minimum fare", value: "€3.25" },
        ],
      },
      { type: "h2", heading: "Airport (LIS) Fares Compared" },
      {
        type: "p",
        body: "Humberto Delgado Airport (LIS) is only 7–9 km from the city centre — a fast, reasonably affordable transfer by any option. Bolt and Uber both have fixed upfront fares, so you know the cost before you confirm the booking. Metered taxis are unpredictable in heavy traffic. During morning arrivals when the A2 motorway queues build, app-based upfront pricing offers a useful buffer.",
      },
      {
        type: "table",
        rows: [
          {
            label: "LIS → Baixa / Rossio / Chiado (8 km)",
            value: "Taxi: €14–20 · Uber: €11–16 · Bolt: €9–14",
          },
          {
            label: "LIS → Bairro Alto / Príncipe Real (9 km)",
            value: "Taxi: €15–22 · Uber: €12–17 · Bolt: €10–15",
          },
          {
            label: "LIS → Belém (11 km)",
            value: "Taxi: €18–26 · Uber: €14–20 · Bolt: €12–17",
          },
          {
            label: "LIS → Parque das Nações (6 km)",
            value: "Taxi: €11–16 · Uber: €9–13 · Bolt: €7–11",
          },
          {
            label: "LIS → Cascais (35 km)",
            value: "Taxi: €45–65 · Uber: €38–55 · Bolt: €30–45",
          },
          {
            label: "LIS → Sintra (30 km)",
            value: "Taxi: €40–55 · Uber: €32–48 · Bolt: €26–38",
          },
        ],
      },
      { type: "h2", heading: "City Hop Fares Compared" },
      {
        type: "table",
        rows: [
          {
            label: "Alfama → Bairro Alto (2.5 km through narrow streets)",
            value: "Taxi: €7–11 · Uber: €6–9 · Bolt: €5–7",
          },
          {
            label: "Baixa → Belém (7 km)",
            value: "Taxi: €10–16 · Uber: €8–12 · Bolt: €6–10",
          },
          {
            label: "Parque das Nações → Intendente (9 km)",
            value: "Taxi: €12–18 · Uber: €9–14 · Bolt: €8–12",
          },
          {
            label: "Cais do Sodré → Time Out Market (1 km)",
            value: "Walk or tram; taxi minimum €3.25",
          },
        ],
      },
      { type: "h2", heading: "Uber vs Bolt vs Taxi — Head to Head" },
      {
        type: "table",
        rows: [
          {
            label: "Metered taxi (white / green-and-black)",
            value:
              "Regulated fare. No surge pricing. Drivers can navigate narrow alleys and hills. Card machines now mandatory. Best for late-night reliability.",
          },
          {
            label: "Uber",
            value:
              "Upfront fixed price. Wider app interface, English support. Slightly pricier than Bolt. Surge applies on busy evenings and rainy days.",
          },
          {
            label: "Bolt",
            value:
              "Usually cheapest by 15–25%. Large driver pool in Lisbon. Upfront pricing. App tip prompt is optional. Strongest price advantage on airport runs.",
          },
          {
            label: "Free Now (formerly myTaxi)",
            value:
              "Hails official metered taxis via app with cashless payment. Fare is always the metered rate — no surge, no discount.",
          },
        ],
      },
      {
        type: "tip",
        body: "Download Bolt before you land — it's often half the price of what you'll be quoted by hotel staff for a \"private transfer.\" For Sintra and Cascais day trips, negotiate a fixed return price directly with your taxi driver at the destination (typically €40–60 round-trip from Lisbon).",
      },
      { type: "h2", heading: "Navigating Lisbon's Hills" },
      {
        type: "p",
        body: "Lisbon's historic neighbourhoods — Alfama, Mouraria, Bica, and parts of Bairro Alto — have streets too narrow or steep for conventional vehicles. Metered taxis and app drivers often know alternative routes, but some addresses are genuinely pedestrian-only. For destinations in Alfama's upper reaches, expect to be dropped at the nearest navigable point and walk the final 100–200 m. The iconic trams (28, 15E) cover many of these routes cheaply but are extremely crowded with tourists.",
      },
      { type: "h2", heading: "When to Use Which Option in Lisbon" },
      {
        type: "ul",
        items: [
          "From LIS Airport with luggage → Bolt for price (book in arrivals, meet at Zone B exterior)",
          "Late-night return to hotel (after midnight) → metered taxi from rank is most reliable",
          "Short Alfama or Chiado city hop → walk if under 1.5 km; Bolt if you want a ride",
          "Day trip to Sintra or Cascais → train from Rossio or Cais do Sodré (€2.30) is far cheaper than taxi or Uber",
          "Group of 3–4 with luggage → taxi or Bolt XL; split cost makes it comparable to public transport",
        ],
      },
      {
        type: "faq",
        faqs: [
          {
            q: "Is Uber cheaper than taxis in Lisbon?",
            a: "Uber is usually 10–20% cheaper than a metered taxi in Lisbon, but Bolt is typically 15–25% cheaper than Uber. For most routes, Bolt is the best-value app option. Metered taxis are often the most expensive but have no surge pricing.",
          },
          {
            q: "Is Uber available at Lisbon Airport?",
            a: "Yes — both Uber and Bolt operate from Humberto Delgado Airport. After clearing arrivals, exit to Zone B (exterior) where rideshare pickups are designated. Metered taxi ranks are immediately outside the arrivals exit.",
          },
          {
            q: "How much is a taxi from Lisbon Airport to the city centre?",
            a: "A metered taxi from LIS to Baixa or Chiado costs approximately €14–20 including the airport surcharge and luggage. Traffic on Avenida Almirante Reis at rush hour can add €3–5 to the metered total. Bolt quotes €9–14 for the same journey.",
          },
          {
            q: "Are taxis safe in Lisbon?",
            a: "Yes — Lisbon taxis are licensed and regulated. Fare scams are rare and the meter is mandatory. The only common issue is drivers offering a flat rate for airport trips that exceeds the metered fare — always insist on the meter or use an app with upfront pricing.",
          },
        ],
      },
    ],
    references: [
      {
        label: "ANTRAL — Portuguese taxi operators association",
        url: "https://www.antral.pt",
      },
    ],
  },

  // ── Uber vs Taxi Barcelona ──────────────────────────────────────────────────
  {
    slug: "uber-vs-taxi-barcelona",
    title: "Uber vs Taxi in Barcelona: Which Should You Use in 2026?",
    description:
      "Barcelona's official black-and-yellow taxis are metered and genuinely competitive — Uber and Bolt exist but availability is lower than other European cities. Here's the airport fare breakdown and when each option wins.",
    publishedAt: "2026-08-04",
    readingMinutes: 6,
    category: "taxi",
    city: "Barcelona",
    country: "Spain",
    citySlug: "barcelona",
    countrySlug: "spain",
    content: [
      {
        type: "intro",
        body: "Barcelona is unusual among major European cities: official metered taxis are genuinely competitive with Uber and Bolt, and rideshare availability is lower than you might expect. Spain strictly limits the number of VTC (private hire vehicle) licences — there is a 1:30 ratio cap between rideshare cars and licensed taxis — so you'll wait longer for Uber or Bolt here than in London or Paris. For most airport runs and city trips, a Barcelona taxi is fast, reliable, and often within €5 of the app price.",
      },
      { type: "h2", heading: "Barcelona Taxi Meter Rates (2026)" },
      {
        type: "table",
        rows: [
          { label: "Flag fall — Tariff 1 (Mon–Fri 8 am–8 pm)", value: "€2.60" },
          { label: "Rate per km — Tariff 1", value: "€1.25" },
          {
            label: "Flag fall — Tariff 2 (evenings, weekends, holidays)",
            value: "€2.60",
          },
          { label: "Rate per km — Tariff 2", value: "€1.51" },
          { label: "Airport supplement (El Prat T1 or T2)", value: "€3.10" },
          { label: "Port / cruise terminal supplement", value: "€1.50" },
          { label: "Large luggage (over 50 cm)", value: "€0.30 per item" },
          { label: "Minimum fare", value: "€4.20" },
        ],
      },
      { type: "h2", heading: "Airport (BCN) Fares Compared" },
      {
        type: "p",
        body: "El Prat Airport (BCN) is 14 km from the city centre — a 20–35 minute drive depending on traffic. Terminal 1 and Terminal 2 both have official taxi ranks immediately outside arrivals. The metered fare plus the €3.10 airport supplement makes taxis very competitive with Uber and Bolt for this route.",
      },
      {
        type: "table",
        rows: [
          {
            label: "BCN T1/T2 → Las Ramblas / Barri Gòtic (14 km)",
            value:
              "Taxi: €28–38 · Uber: €24–34 · Bolt: €20–30 · Cabify: €22–32",
          },
          {
            label: "BCN → Eixample / Passeig de Gràcia (15 km)",
            value: "Taxi: €28–38 · Uber: €24–33 · Bolt: €20–28",
          },
          {
            label: "BCN → Barceloneta / Port Olímpic (16 km)",
            value: "Taxi: €30–40 · Uber: €25–35 · Bolt: €21–30",
          },
          {
            label: "BCN → Gràcia / Park Güell area (18 km)",
            value: "Taxi: €32–44 · Uber: €27–38 · Bolt: €23–33",
          },
          {
            label: "BCN → Sitges (35 km)",
            value: "Taxi: €60–80 · Uber: €50–70 · Bolt: €42–58",
          },
        ],
      },
      { type: "h2", heading: "City Hop Fares Compared" },
      {
        type: "table",
        rows: [
          {
            label: "Sagrada Família → Las Ramblas (3 km)",
            value: "Taxi: €8–12 · Uber: €7–10 · Bolt: €6–9",
          },
          {
            label: "Barceloneta → Camp Nou (10 km)",
            value: "Taxi: €16–22 · Uber: €13–18 · Bolt: €11–16",
          },
          {
            label: "Gràcia → Barceloneta (5 km)",
            value: "Taxi: €10–15 · Uber: €8–12 · Bolt: €7–10",
          },
          {
            label: "Eixample → Tibidabo (8 km)",
            value: "Taxi: €13–19 · Uber: €11–16 · Bolt: €9–14",
          },
        ],
      },
      { type: "h2", heading: "Uber, Bolt, and Cabify in Barcelona" },
      {
        type: "table",
        rows: [
          {
            label: "Official taxi (black and yellow)",
            value:
              "Regulated meter. No surge. Wide availability — far more taxis than rideshare cars. All accept contactless card payments. Airport supplement applies. Fastest pickup on the street.",
          },
          {
            label: "Uber",
            value:
              "Fixed upfront price. Longer wait times (5–15 min) due to VTC licence limits. No surge in the same way taxis work, but prices adjust with demand. Available at airport via dedicated pickup zone.",
          },
          {
            label: "Bolt",
            value:
              "Usually 10–20% cheaper than Uber in Barcelona. Same VTC pool as Uber so wait times similar. Best value on airport runs.",
          },
          {
            label: "Cabify",
            value:
              "Spanish company, strong in Barcelona. Professional executive-style cars. Often priced similarly to Uber but with a reputation for reliability. Also subject to VTC cap.",
          },
          {
            label: "Free Now",
            value:
              "Aggregates official metered taxis via app. Metered fare always applies — no surge discount, but no surge premium either. Good for cashless metered taxi rides.",
          },
        ],
      },
      {
        type: "warning",
        body: "Barcelona has experienced significant taxi vs. rideshare conflict in recent years. In 2019, taxi drivers staged a major strike to protest VTC growth. Spain now enforces a strict 1:30 rideshare-to-taxi licence ratio in the Barcelona metropolitan area — meaning far fewer Uber/Bolt cars are available than in cities like Madrid or London. Expect longer waits for rideshare apps, especially during peak hours and events.",
      },
      { type: "h2", heading: "Public Transport Alternatives" },
      {
        type: "p",
        body: "The Aerobus runs from both T1 and T2 to Plaça Catalunya every 5–10 minutes for €6.75 single, €10.65 return. Journey time is 35–40 minutes. The metro L9 Sud connects T1 and T2 to the broader network but requires a transfer at Zona Universitaria to reach the city centre — total journey 50+ minutes with the transfer. For solo travellers without heavy luggage, the Aerobus is the most cost-effective airport connection.",
      },
      {
        type: "tip",
        body: "At El Prat Airport, Uber and Bolt pickups are from specific designated zones — check the app for the exact location (it differs between T1 and T2). For taxi: the official rank is immediately outside arrivals at both terminals. No prebooking needed.",
      },
      { type: "h2", heading: "When to Use Which Option in Barcelona" },
      {
        type: "ul",
        items: [
          "From BCN Airport with luggage → official taxi rank (fast, reliable, €28–38 to centre with no waiting)",
          "Budget airport transfer → Aerobus (€6.75) to Plaça Catalunya, then local transport",
          "Short city hops → taxi; rideshare wait times often exceed 10 minutes",
          "Busy Saturday night (Las Ramblas, Born, Barceloneta) → taxi rank at major squares; apps may surge or have long waits",
          "Day trip to Sitges or Montserrat → train from Passeig de Gràcia (€4–6) is far cheaper",
        ],
      },
      {
        type: "faq",
        faqs: [
          {
            q: "Is Uber available in Barcelona?",
            a: "Yes, but availability is limited compared to other major European cities. Spain caps the number of rideshare (VTC) licences at 1 for every 30 taxis in the Barcelona metropolitan area, so wait times for Uber, Bolt, and Cabify are typically 5–15 minutes even in central areas.",
          },
          {
            q: "Are Barcelona taxis cheaper than Uber?",
            a: "For the airport run, taxis and Uber are usually within €5 of each other. On the street, taxis are often faster (no wait) and competitively priced compared to the limited rideshare supply. Bolt is typically the cheapest app option by 10–20%.",
          },
          {
            q: "How much is a taxi from Barcelona Airport to the city centre?",
            a: "Expect €28–38 from El Prat (T1 or T2) to Las Ramblas or the Eixample during daytime hours. This includes the mandatory €3.10 airport supplement. Tariff 2 (evenings and weekends) adds roughly 20% to the per-km rate.",
          },
          {
            q: "Can I take the metro from Barcelona Airport?",
            a: "Yes — the L9 Sud connects T1 and T2 to the metro network. However, it requires a transfer at Zona Universitaria to reach the city centre, making the total journey 50+ minutes. The Aerobus (€6.75, 35 min, no transfer) is a better option for most visitors.",
          },
        ],
      },
    ],
    references: [
      {
        label:
          "Institut Metropolità del Taxi — Barcelona official taxi authority",
        url: "https://taxibarcelona.cat/en",
      },
    ],
  },

  // ── Uber vs Taxi Bali ───────────────────────────────────────────────────────
  {
    slug: "uber-vs-taxi-bali",
    title: "Uber vs Taxi in Bali: Why You'll Use Gojek Instead (2026)",
    description:
      "Uber does not operate in Bali. The real choice is Gojek or Grab vs Bluebird metered taxis — and the apps are usually 30–50% cheaper. Here's what changes at the airport, and the one scam to avoid.",
    publishedAt: "2026-08-04",
    readingMinutes: 7,
    category: "taxi",
    city: "Bali",
    country: "Indonesia",
    citySlug: "bali",
    countrySlug: "indonesia",
    content: [
      {
        type: "intro",
        body: "Uber exited Southeast Asia in 2018 — it is not available in Bali and there are no plans to return. The relevant comparison is between Gojek and Grab (the dominant ride-hailing apps) versus Bluebird (the only metered taxi company worth using). For most city trips, Gojek or Grab cost 30–50% less than Bluebird. At the airport, the rules change: apps are restricted from picking up, so for airport arrivals you'll need a Bluebird or an authorised airport transfer — or a short walk.",
      },
      {
        type: "warning",
        body: 'Uber is not available in Bali. Any driver who claims to offer "Uber" in Bali is referring to an unofficial arrangement — not the licensed Uber platform. Do not accept these rides.',
      },
      { type: "h2", heading: "Bluebird Taxi Rates in Bali (2026)" },
      {
        type: "p",
        body: "Bluebird Group is the only fully licensed, metered taxi operator in Bali worth recommending to tourists. Their cars are blue, immaculate, and always use the meter. Several other taxi companies operate but use unregulated meters and are a common source of tourist overcharging. If the car is not distinctively Bluebird blue, use the app instead.",
      },
      {
        type: "table",
        rows: [
          { label: "Bluebird flag fall", value: "IDR 7,000" },
          { label: "Bluebird rate per km", value: "IDR 5,500–6,500" },
          { label: "Bluebird minimum fare", value: "IDR 25,000" },
          {
            label: "Bluebird app (MyBluebird)",
            value: "Same rates as street hail; upfront estimate available",
          },
        ],
      },
      { type: "h2", heading: "Gojek vs Grab vs Bluebird — Fare Comparison" },
      {
        type: "table",
        rows: [
          {
            label: "Airport (DPS) → Kuta (5 km)",
            value:
              "Bluebird: IDR 70,000–90,000 (fixed zone) · Gojek: IDR 35,000–50,000* · Grab: IDR 40,000–55,000*",
          },
          {
            label: "Airport (DPS) → Seminyak (10 km)",
            value:
              "Bluebird: IDR 120,000–150,000 (fixed zone) · Gojek: IDR 65,000–85,000* · Grab: IDR 70,000–90,000*",
          },
          {
            label: "Airport (DPS) → Canggu (18 km)",
            value:
              "Bluebird: IDR 160,000–200,000 (fixed zone) · Gojek: IDR 100,000–130,000* · Grab: IDR 110,000–140,000*",
          },
          {
            label: "Airport (DPS) → Ubud (40 km)",
            value:
              "Bluebird: IDR 300,000–380,000 · Gojek: IDR 180,000–230,000* · Grab: IDR 190,000–240,000*",
          },
          {
            label: "Airport (DPS) → Nusa Dua (12 km)",
            value:
              "Bluebird: IDR 150,000–180,000 (fixed zone) · Gojek: IDR 90,000–120,000* · Grab: IDR 95,000–125,000*",
          },
          {
            label: "Seminyak → Canggu (8 km, city trip)",
            value:
              "Bluebird metered: IDR 60,000–80,000 · Gojek: IDR 35,000–50,000 · Grab: IDR 40,000–55,000",
          },
          {
            label: "Kuta → Ubud (40 km, city trip)",
            value:
              "Bluebird metered: IDR 250,000–320,000 · Gojek: IDR 160,000–210,000 · Grab: IDR 170,000–220,000",
          },
        ],
      },
      {
        type: "p",
        body: "* App fares from airport require walking slightly off airport property (see Airport section below). Prices are estimates and vary with traffic and surge.",
      },
      {
        type: "h2",
        heading: "The Airport Rule — The Most Important Thing to Know",
      },
      {
        type: "p",
        body: "Ngurah Rai International Airport (DPS) restricts Gojek and Grab from operating inside the airport grounds. App drivers who accept airport pickups must meet passengers outside the official airport zone. The practical workaround: book your Gojek or Grab ride before you clear customs, walk through the car park and past the taxi ranks, exit the airport compound (a 3–5 minute walk), then meet your driver at the agreed pickup point outside the gates. This saves 30–50% versus the Bluebird airport transfer but requires a short walk with luggage.",
      },
      {
        type: "tip",
        body: "Walk through the airport car park and out through the official vehicle exit gate — the public road is just outside. Book your Gojek or Grab to the nearest address outside the airport boundary. The driver waits for you there. If you have heavy luggage or are travelling with children, the Bluebird zone counter inside arrivals is more convenient, just pricier.",
      },
      { type: "h2", heading: "Gojek vs Grab — Which App Is Better in Bali?" },
      {
        type: "table",
        rows: [
          {
            label: "Gojek",
            value:
              "Indonesian-built. Larger driver pool in Bali than Grab. Typically slightly cheaper. Covers motorcycles (GoRide) and cars (GoCar). Works well across Seminyak, Kuta, Canggu, Nusa Dua.",
          },
          {
            label: "Grab",
            value:
              "Pan-Asian app. Driver coverage in Bali is growing but smaller than Gojek. GrabCar pricing comparable to GoCar. Useful backup if Gojek has long waits.",
          },
          {
            label: "Bluebird (MyBluebird app)",
            value:
              "Official metered taxi. Most reliable at times when app cars are scarce (late night, rain, Balinese holiday days). Higher price but guaranteed honest meter.",
          },
        ],
      },
      { type: "h2", heading: "The Taxi Scam to Know About in Bali" },
      {
        type: "p",
        body: 'Unofficial taxis (non-Bluebird) are extremely common in Bali. Many are private vehicles with a handwritten "TAXI" sign in the window or nothing at all. They approach tourists at the airport, in Kuta\'s tourist strips, and outside popular venues. They do not use meters and routinely quote 3–5× the fair rate. Some have fake meters that run faster than official ones. The rule is simple: only use Bluebird (which you can identify by the distinctive blue livery and lit roof sign) or book through Gojek or Grab.',
      },
      {
        type: "ul",
        items: [
          'Unofficial "taxi" touts at DPS Airport arrivals: always quote €40–60 USD for trips that cost IDR 70,000–150,000 on Bluebird',
          'Drivers claiming "Gojek is not allowed here" — this is a sales tactic; the app restriction is only inside the airport compound',
          "Fake Bluebird cars (imitation blue colour without the official logo/registration) — always check the app or call Bluebird directly",
          'Drivers offering to take you to a "better" temple or restaurant on the way — they receive commissions from these stops',
        ],
      },
      { type: "h2", heading: "When to Use Which Option in Bali" },
      {
        type: "ul",
        items: [
          "Arriving at DPS with light luggage → walk outside the airport compound, use Gojek or Grab (saves 40–50%)",
          "Arriving at DPS with heavy luggage or late night → Bluebird counter inside arrivals (convenient, honest meter)",
          "City trips in Seminyak, Kuta, Canggu → Gojek GoCar or GoRide (motorbike) for shorter hops",
          "Ubud round trip → charter a driver for the day (IDR 400,000–600,000 for 8–10 hours, negotiated in person)",
          "Temple visits or Uluwatu at sunset → charter a driver; Gojek pricing for 40 km+ runs can be inconsistent",
        ],
      },
      {
        type: "faq",
        faqs: [
          {
            q: "Is Uber available in Bali?",
            a: "No — Uber exited Southeast Asia in 2018 when it sold its regional operations to Grab. Uber is not available in Indonesia and has no plans to return to Bali. Use Gojek (Indonesian) or Grab instead.",
          },
          {
            q: "Can I use Gojek at Bali Airport?",
            a: "Not from inside the terminal — Gojek and Grab cannot legally pick up from within the airport grounds. The workaround is to book via the app and walk 3–5 minutes outside the airport compound, where your driver meets you. This saves 40–50% vs the official Bluebird transfer.",
          },
          {
            q: "What is Bluebird taxi in Bali?",
            a: "Bluebird is Indonesia's largest and most reputable taxi company. In Bali their cars are distinctively blue with the Bluebird logo and a lit roof sign. All Bluebird taxis use regulated meters — it is the only conventional taxi company in Bali consistently recommended by travel experts. The MyBluebird app lets you book and track a car with an upfront estimate.",
          },
          {
            q: "How much is a taxi from Bali Airport to Seminyak?",
            a: "Bluebird charges IDR 120,000–150,000 for the fixed zone fare from DPS to Seminyak. Gojek or Grab (booked outside the airport compound) quotes IDR 65,000–90,000 for the same trip. A USD equivalent is approximately $8–10 for Bluebird and $4–6 for app rides.",
          },
          {
            q: "Is Grab or Gojek better in Bali?",
            a: "Gojek has a larger driver pool in Bali and is generally slightly cheaper. Download both before you arrive — when one app shows a long wait, the other often has a driver nearby. Gojek's GoRide (motorbike) is the fastest option for solo travellers for short trips through traffic.",
          },
        ],
      },
    ],
    references: [
      {
        label: "Ngurah Rai Airport — official ground transport information",
        url: "https://bali-airport.com/en/transportation",
      },
    ],
  },
];
