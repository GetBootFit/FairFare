/**
 * Static fare data for the 5 busiest international airports.
 * Distances are approximate — used to generate fare tables only.
 * All fares are in local currency unless noted.
 */

export interface AirportRoute {
  label: string          // destination label
  km: number             // approximate distance
  note?: string          // e.g. "fixed rate", "expressway tolls extra"
}

export interface AirportData {
  code: string           // IATA code
  name: string           // full airport name
  city: string           // nearest city
  country: string
  currency: string
  currencySymbol: string
  baseRate: number       // flag fall
  ratePerKm: number
  minimumFare: number
  taxiColor?: string     // e.g. "yellow cab", "red metered taxi"
  approxCityFare: string // "~THB 250–350 to city centre" — human summary
  blogSlug?: string      // matching /blog/[slug] if a city fare guide exists
  routes: AirportRoute[] // specific routes with fares
  tips: string[]         // practical tips for this airport
  scams: string[]        // airport-specific scam warnings
  alternatives: string[] // ride-hailing / rail options
}

export const AIRPORT_DATA: Record<string, AirportData> = {
  BKK: {
    code: 'BKK',
    name: 'Suvarnabhumi Airport',
    city: 'Bangkok',
    country: 'Thailand',
    currency: 'THB',
    currencySymbol: '฿',
    baseRate: 35,
    ratePerKm: 6.5,
    minimumFare: 35,
    taxiColor: 'metered taxi (any colour)',
    approxCityFare: '฿250–450 to central Bangkok',
    blogSlug: 'how-much-does-a-taxi-cost-in-bangkok',
    routes: [
      { label: 'Sukhumvit / Asok (city centre)', km: 30, note: 'expressway toll ~฿50–75 extra' },
      { label: 'Silom / Bang Rak', km: 33, note: 'expressway toll ~฿75 extra' },
      { label: 'Khao San Road', km: 38, note: 'expressway toll ~฿75 extra' },
      { label: 'Don Mueang Airport (DMK)', km: 60, note: 'fixed negotiated fare common' },
      { label: 'Pattaya', km: 120, note: 'negotiate fixed price before departure' },
    ],
    tips: [
      'Use the official metered taxi queue on Level 1 — ignore touts inside the arrivals hall.',
      'Always insist the driver turns on the meter. If they refuse, take the next taxi.',
      'Expressway tolls (฿25–75 per toll) are paid by the passenger on top of the meter.',
      'Airport Taxi surcharge of ฿50 is added to all metered fares from the airport.',
      'BTS Suvarnabhumi Link rail (City Line) runs every 10 minutes to Phaya Thai — fastest for light luggage.',
    ],
    scams: [
      'Driver offers a "flat rate" of ฿500–1,000 — the meter will cost less.',
      'Tout approaches you before the taxi queue and quotes inflated fixed prices.',
      'Driver claims your hotel is "closed" or "fully booked" and diverts to a different one (commission scam).',
      'Driver takes the long surface road to avoid expressway toll fees while charging more time.',
    ],
    alternatives: [
      'Grab — available throughout Bangkok, set price before departure',
      'BTS Airport Rail Link (City Line) — ฿15–45 to central stations, 30 min',
      'BTS Airport Rail Link (Express) — ฿150 direct to Phaya Thai, 15 min',
    ],
  },

  DXB: {
    code: 'DXB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'UAE',
    currency: 'AED',
    currencySymbol: 'AED ',
    baseRate: 12,
    ratePerKm: 1.97,
    minimumFare: 12,
    taxiColor: 'cream/beige Dubai Taxi Corporation',
    approxCityFare: 'AED 50–80 to Downtown Dubai',
    blogSlug: 'how-much-does-a-taxi-cost-in-dubai',
    routes: [
      { label: 'Downtown Dubai / Burj Khalifa', km: 10 },
      { label: 'Dubai Marina / JBR', km: 35 },
      { label: 'Palm Jumeirah', km: 38 },
      { label: 'Deira / Bur Dubai (city centre)', km: 5 },
      { label: 'Abu Dhabi city centre', km: 145, note: 'inter-emirate, higher rate applies' },
      { label: 'Sharjah city centre', km: 20, note: 'inter-emirate surcharge ~AED 20' },
    ],
    tips: [
      'All taxis are metered — the meter must be running from the start of the trip.',
      'Airport departure surcharge of AED 3 is applied to fares from DXB.',
      'Tipping is not expected but rounding up is appreciated.',
      'Dubai Taxi app lets you pre-book an official taxi with a fixed price.',
      'Late-night (midnight–6 am) fares carry a 25% surcharge.',
    ],
    scams: [
      'Unofficial drivers approach in arrivals — only use Dubai Taxi Corporation or RTA ranks.',
      'Driver claims the meter is "not working" and offers a fixed price.',
      'Inflated fares for the "scenic" route to Dubai Marina through the city instead of the highway.',
    ],
    alternatives: [
      'Uber / Careem — price shown upfront, widely used in Dubai',
      'Dubai Metro (Red Line) — AED 3–8.50 to central stations, no luggage limit',
      'RTA Dubai Taxi app — same metered taxis, book ahead',
    ],
  },

  SIN: {
    code: 'SIN',
    name: 'Changi Airport',
    city: 'Singapore',
    country: 'Singapore',
    currency: 'SGD',
    currencySymbol: 'S$',
    baseRate: 3.90,
    ratePerKm: 0.55,
    minimumFare: 3.90,
    taxiColor: 'multiple colours (regulated)',
    approxCityFare: 'S$20–35 to city centre',
    blogSlug: 'how-much-does-a-taxi-cost-in-singapore',
    routes: [
      { label: 'Orchard Road / city centre', km: 20, note: '+S$5–8 airport surcharge + ERP tolls' },
      { label: 'Marina Bay Sands', km: 18, note: '+S$5–8 airport surcharge + ERP tolls' },
      { label: 'Sentosa Island', km: 25, note: '+S$3 Sentosa surcharge' },
      { label: 'Jurong East', km: 30 },
      { label: 'Woodlands (Singapore-JB causeway)', km: 35 },
    ],
    tips: [
      'Airport surcharge of S$5 (Mon–Fri 6 pm–midnight) or S$3 (other peak hours) applies.',
      'ERP electronic road pricing tolls are added when passing through city gantries.',
      'Grab is extremely reliable and price is fixed upfront — often cheaper than taxis.',
      'MRT (East-West line from Terminal 1/2/3) runs to the city in 30 min for S$2.30.',
    ],
    scams: [
      'Singapore is very low-risk for taxi scams — taxis are well regulated.',
      'Decline rides from non-metered private drivers who approach in the terminal.',
      'Avoid "limousine" touts who quote inflated flat fares at arrivals.',
    ],
    alternatives: [
      'Grab — fixed price, reliable, often matches taxi fare',
      'MRT (East-West and Thomson-East Coast Lines) — S$2.30, 30 min to city',
      'Airport Shuttle Bus — S$9 to city hotels, door-to-door',
    ],
  },

  LHR: {
    code: 'LHR',
    name: 'London Heathrow Airport',
    city: 'London',
    country: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    baseRate: 3.80,
    ratePerKm: 2.10,
    minimumFare: 3.80,
    taxiColor: 'black London cab (hackney carriage)',
    approxCityFare: '£50–80 to central London',
    blogSlug: 'how-much-does-a-taxi-cost-in-london',
    routes: [
      { label: 'Central London (Zone 1)', km: 25, note: 'depends heavily on traffic, can exceed £100 in rush hour' },
      { label: 'Paddington / Bayswater', km: 23 },
      { label: 'Canary Wharf', km: 35 },
      { label: 'Greenwich', km: 40 },
      { label: 'Gatwick Airport (LGW)', km: 65, note: 'fixed minicab rate usually cheaper' },
    ],
    tips: [
      'Black cabs (hackney carriages) are metered — always legal and regulated by TfL.',
      'Avoid minicabs hailed on the street — they must be pre-booked to be legal.',
      'Uber and Bolt are licensed in London and much cheaper than black cabs.',
      'Heathrow Express train: £25 to Paddington in 15 minutes, or £5.50 by Tube (45 min).',
      'Night tariff (10 pm–6 am) and weekend surcharges apply to black cab meters.',
    ],
    scams: [
      '"Uber driver" approaches you in arrivals — always check the app for your assigned vehicle.',
      'Unlicensed minicab touts approach in the terminal — never get in an unbooked car.',
      'Fixed fare offers from unofficial drivers well above the metered equivalent.',
    ],
    alternatives: [
      'Uber / Bolt — book in-app, significantly cheaper than black cabs',
      'Heathrow Express — £25 to Paddington, 15 min',
      'Elizabeth line (Tube) — £5.50 to central London, 45 min',
      'National Express coach — £6–10 to Victoria, 60–90 min',
    ],
  },

  JFK: {
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    baseRate: 70,  // fixed flat rate to Manhattan
    ratePerKm: 2.17,
    minimumFare: 70,
    taxiColor: 'yellow cab',
    approxCityFare: '$70–110 to Manhattan (flat rate + tolls + tip)',
    blogSlug: 'how-much-does-a-taxi-cost-in-new-york',
    routes: [
      { label: 'Manhattan (all neighbourhoods)', km: 25, note: 'FLAT RATE $70 + tolls ($8.50–19) + tip' },
      { label: 'Brooklyn (not Manhattan flat rate)', km: 18, note: 'metered fare ~$45–60 + tip' },
      { label: 'Queens (not Manhattan flat rate)', km: 15, note: 'metered fare ~$35–50 + tip' },
      { label: 'Newark (EWR)', km: 40, note: 'metered + $20 NJ surcharge + tolls ~$100 total' },
      { label: 'LaGuardia Airport (LGA)', km: 20, note: 'metered fare ~$35–50 + tolls' },
    ],
    tips: [
      'The flat rate to Manhattan is $70 — agree on this before departure (not on the meter).',
      'Tolls (bridges/tunnels) are added on top: Midtown Tunnel ~$8.50, Triborough ~$8.',
      'Standard tip is 20%. Add $1–2 per bag for assistance.',
      'Congestion Surcharge of $2.50 applies to all yellow cab rides in NYC.',
      'AirTrain to Jamaica station + LIRR/Subway to Manhattan is $8.50 and ~45 min.',
    ],
    scams: [
      'Driver ignores the $70 flat rate and runs the meter instead — insist on the flat rate.',
      'Driver uses the Williamsburg/Manhattan Bridge (toll-free) then charges a "bridge toll" anyway.',
      'Driver does not mention tolls until arrival and inflates the amount.',
      '"Limo" or "car service" drivers approach in baggage claim — use app-based or official yellow cabs only.',
    ],
    alternatives: [
      'Uber / Lyft / Via — usually $55–80 to Manhattan with fixed upfront price',
      'AirTrain + LIRR — $8.50–14, ~45 min to Penn Station',
      'AirTrain + Subway (E/J/Z) — $8.50, ~75 min to Midtown',
      'NYC Express Bus — $20, direct to Midtown',
    ],
  },

  CDG: {
    code: 'CDG',
    name: 'Paris Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France',
    currency: 'EUR',
    currencySymbol: '€',
    baseRate: 1.12,
    ratePerKm: 1.12,
    minimumFare: 7.30,
    taxiColor: 'white with "TAXI PARISIEN" light',
    approxCityFare: '€55–75 to central Paris (fixed fare zones)',
    blogSlug: 'how-much-does-a-taxi-cost-in-paris',
    routes: [
      { label: 'Right Bank (1st–8th, 10th–12th arrondissements)', km: 30, note: 'FIXED RATE €56' },
      { label: 'Left Bank (5th–7th, 13th–15th arrondissements)', km: 32, note: 'FIXED RATE €65' },
      { label: 'Disneyland Paris', km: 35, note: 'fixed rate ~€55' },
      { label: 'Orly Airport (ORY)', km: 55, note: 'metered ~€80–100' },
      { label: 'Versailles', km: 50, note: 'metered ~€90–110' },
    ],
    tips: [
      'Fixed-rate fares (tarif forfaitaire) apply for rides between CDG and Paris city limits — insist on the fixed rate.',
      'Right Bank fixed fare is €56, Left Bank is €65 (prices set by Paris Préfecture, valid 2024–2026).',
      'A supplement of €1 applies per piece of luggage over 5 kg.',
      'Booking a taxi in advance via G7 or Taxi Bleu apps guarantees the fixed fare with no surprises.',
      'Night and weekend surcharges apply outside fixed-rate zones.',
    ],
    scams: [
      'Driver claims fixed rates "do not apply today" and uses the meter — they always apply.',
      'Unofficial taxis (sans plaque) solicit arrivals — only use licensed taxis with "TAXI PARISIEN" signage.',
      'Inflated surcharges added for "airport fee" or "luggage handling" beyond the permitted €1/bag.',
      'Driver takes the A1 motorway toll without mentioning tolls are extra (they are).',
    ],
    alternatives: [
      'Uber — reliable, price shown upfront; often cheaper than taxis',
      'RER B train — €11.80 to Gare du Nord/Châtelet, 35 min',
      'Roissybus — €16.10 to Opéra, 60–75 min',
      'Le Bus Direct (formerly Air France Bus) — €17 to key Paris stops',
    ],
  },

  AMS: {
    code: 'AMS',
    name: 'Amsterdam Airport Schiphol',
    city: 'Amsterdam',
    country: 'Netherlands',
    currency: 'EUR',
    currencySymbol: '€',
    baseRate: 3.19,
    ratePerKm: 2.35,
    minimumFare: 3.19,
    taxiColor: 'black or silver (Schiphol Taxi)',
    approxCityFare: '€40–55 to Amsterdam city centre',
    blogSlug: 'how-much-does-a-taxi-cost-in-amsterdam',
    routes: [
      { label: 'Amsterdam city centre (Centrum)', km: 17, note: 'Schiphol Taxi fixed rate ~€47' },
      { label: 'Amsterdam Central Station area', km: 18 },
      { label: 'Rotterdam city centre', km: 65, note: '~€120–140' },
      { label: 'The Hague (Den Haag)', km: 55, note: '~€90–110' },
      { label: 'Utrecht city centre', km: 55, note: '~€90–110' },
    ],
    tips: [
      'Use the official Schiphol Taxi rank outside Arrivals — pre-booked and rank taxis are equally regulated.',
      'Schiphol Travel Taxi offers fixed fares to many Dutch cities — book via schiphol.nl.',
      'The Amstelveenlijn tram and train (Intercity/Sprinter) from Schiphol Station are far cheaper.',
      'Tipping is not expected but rounding up is common practice.',
      'Uber is available and often 20–30% cheaper than regulated taxis.',
    ],
    scams: [
      'Unofficial taxis approach inside the terminal — only use the official rank or a pre-booked app.',
      'Driver quotes a "flat rate" that exceeds the metered or Schiphol-fixed fare.',
      'Meter set to Tariff 2 (nighttime rate) during daytime — check the meter tariff displayed.',
    ],
    alternatives: [
      'Intercity/Sprinter train — €5.50 to Amsterdam Central, 17 min',
      'Uber — fixed upfront price, usually €35–45 to city centre',
      'NS train to Leiden / Rotterdam / The Hague — cheaper than taxis for longer distances',
    ],
  },

  HND: {
    code: 'HND',
    name: 'Tokyo Haneda Airport',
    city: 'Tokyo',
    country: 'Japan',
    currency: 'JPY',
    currencySymbol: '¥',
    baseRate: 500,
    ratePerKm: 400,
    minimumFare: 500,
    taxiColor: 'black or dark blue (multiple licensed companies)',
    approxCityFare: '¥4,000–7,000 to central Tokyo',
    blogSlug: 'how-much-does-a-taxi-cost-in-tokyo',
    routes: [
      { label: 'Shinjuku / Shibuya', km: 20, note: 'highway toll extra ~¥500–750' },
      { label: 'Ginza / Tokyo Station', km: 18, note: 'highway toll extra ~¥500' },
      { label: 'Roppongi / Minato', km: 16, note: 'highway toll extra ~¥500' },
      { label: 'Asakusa / Ueno', km: 24, note: 'highway toll extra ~¥750' },
      { label: 'Yokohama city centre', km: 30, note: 'highway toll extra ~¥750–1,000' },
    ],
    tips: [
      'Taxis are metered and fully regulated — all drivers are licensed and meters are accurate.',
      'Highway (expressway) tolls are charged on top of the meter and can add ¥500–1,000.',
      'Late-night surcharge (22:00–05:00) adds 20% to the metered fare.',
      'Japan Taxi app allows pre-booking with English support and fixed-price options.',
      'Tipping is not practiced in Japan — do not tip taxi drivers.',
    ],
    scams: [
      'Tokyo taxi scams are extremely rare — drivers are highly professional and honest.',
      'Taking surface roads to avoid the expressway toll can increase travel time significantly.',
      'Ensure the driver uses the route you expect; you can show the destination on Google Maps.',
    ],
    alternatives: [
      'Tokyo Monorail — ¥500 to Hamamatsucho, 13 min (connects to JR Yamanote Line)',
      'Keikyu Line — ¥300–650 to Shinagawa/Asakusa/Narita, 13–37 min',
      'Limousine Bus — ¥1,200–3,200 to major Tokyo hotels, 60–90 min',
    ],
  },

  SYD: {
    code: 'SYD',
    name: 'Sydney Kingsford Smith Airport',
    city: 'Sydney',
    country: 'Australia',
    currency: 'AUD',
    currencySymbol: 'A$',
    baseRate: 4.20,
    ratePerKm: 2.19,
    minimumFare: 4.20,
    taxiColor: 'yellow (Silver Service black available)',
    approxCityFare: 'A$45–65 to Sydney CBD',
    blogSlug: 'how-much-does-a-taxi-cost-in-sydney',
    routes: [
      { label: 'Sydney CBD / Circular Quay', km: 10, note: 'airport access fee A$4.70 + possible tolls' },
      { label: 'Bondi Beach', km: 12, note: 'airport access fee + tunnel toll ~A$8 extra' },
      { label: 'North Sydney', km: 18, note: 'Harbour Bridge toll ~A$4 extra' },
      { label: 'Parramatta', km: 35, note: 'M4 motorway toll possible' },
      { label: 'Manly (via ferry)', km: 20, note: 'taxi to Circular Quay + Manly Ferry (A$9.60) is cheapest option' },
    ],
    tips: [
      'An Airport Access Fee of A$4.70 is charged on all taxi and rideshare trips from the domestic and international terminals.',
      'The Eastern Distributor and Cross City Tunnel tolls are extra and vary by route.',
      'iCabs and 13Cabs apps allow pre-booking with upfront estimate.',
      'GST (10%) is included in all metered taxi fares — no additional tax is charged.',
      'Silver Service (black luxury cabs) are available for premium rides at higher tariffs.',
    ],
    scams: [
      'Driver quotes a flat rate that exceeds the metered estimate — always use the meter.',
      'Claims of "credit card surcharge" above the permitted 5% maximum.',
      'Accepting rides from unofficial drivers outside the taxi rank — only board at the official rank.',
    ],
    alternatives: [
      'Uber / DiDi / Ola — fixed upfront price, often 10–20% cheaper than taxis',
      'Train (Airport & East Hills Line) — A$19.93 to Central Station, 13 min',
      '400 bus — A$2.50 to Sydenham via Mascot (slow but cheap)',
    ],
  },

  LAX: {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    baseRate: 2.85,
    ratePerKm: 1.68,
    minimumFare: 20,
    taxiColor: 'various (metered)',
    approxCityFare: '$45–75 to Downtown LA',
    routes: [
      { label: 'Downtown Los Angeles', km: 25, note: 'depends on traffic; can exceed $90 during rush hour' },
      { label: 'Santa Monica / Venice Beach', km: 18 },
      { label: 'Beverly Hills / West Hollywood', km: 20 },
      { label: 'Hollywood / Los Feliz', km: 28 },
      { label: 'Anaheim / Disneyland', km: 50, note: 'fixed-rate offers common; negotiate before departure' },
    ],
    tips: [
      'Rideshares (Uber/Lyft) pick up from dedicated LAX-it lot — do not accept rides curbside at arrivals.',
      'Standard taxis queue at arrivals — all are metered; confirm the driver uses the meter.',
      'FlyAway bus runs 24/7 to Union Station downtown for $11 — cheapest option.',
      'Traffic on the 405 and I-105 can double travel time during peak hours (7–10 am, 3–7 pm).',
      'Credit cards are accepted in all licensed LAX taxis.',
    ],
    scams: [
      'Unofficial "private car" or "shuttle" drivers approach in arrivals — ignore them.',
      'Driver offers a flat rate that exceeds the metered fare — always use the meter.',
      'Curbside pickup for rideshares is illegal at LAX; legitimate Uber/Lyft require the LAX-it lot.',
    ],
    alternatives: [
      'Uber / Lyft — pick up from LAX-it lot, price shown upfront',
      'FlyAway Bus — $11 to Union Station, every 30 min',
      'Metro C Line (Green) — $1.75 to Aviation/LAX station, connect to regional lines',
    ],
  },

  ORD: {
    code: 'ORD',
    name: "Chicago O'Hare International Airport",
    city: 'Chicago',
    country: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    baseRate: 3.25,
    ratePerKm: 1.40,
    minimumFare: 3.25,
    taxiColor: 'various (metered)',
    approxCityFare: '$40–60 to downtown Chicago',
    routes: [
      { label: 'The Loop / downtown Chicago', km: 27, note: 'flat-rate taxi zones apply from O\'Hare' },
      { label: 'River North / Gold Coast', km: 28 },
      { label: 'Navy Pier', km: 30 },
      { label: "Midway Airport (MDW)", km: 35 },
      { label: 'Evanston / North Shore', km: 30, note: 'metered fare' },
    ],
    tips: [
      'Flat-rate taxi fares to downtown zones are set by the city — ask the dispatcher for the current rate.',
      'The Blue Line L train runs 24/7 to downtown for $5 — fastest and cheapest option.',
      'Rideshares use the dedicated pickup area on the lower level of each terminal.',
      'Add $2 per bag for standard baggage assistance.',
    ],
    scams: [
      'Unofficial drivers solicit rides inside the terminal — all legitimate taxis queue at the taxi stand outside.',
      'Driver avoids the expressway to increase the meter — confirm the route before departing.',
      '"Limo" service solicited in arrivals with inflated rates — book rideshare in-app instead.',
    ],
    alternatives: [
      'Uber / Lyft — pickup from rideshare area, lower level',
      'Blue Line L train — $5, 45 min to downtown (24/7)',
      'Coach USA / Pace bus — $5–10 to various Chicago suburbs',
    ],
  },

  FRA: {
    code: 'FRA',
    name: 'Frankfurt Airport',
    city: 'Frankfurt',
    country: 'Germany',
    currency: 'EUR',
    currencySymbol: '€',
    baseRate: 3.80,
    ratePerKm: 2.00,
    minimumFare: 3.80,
    taxiColor: 'cream/beige (Frankfurt taxi standard)',
    approxCityFare: '€30–45 to Frankfurt city centre',
    routes: [
      { label: 'Frankfurt city centre / Innenstadt', km: 12 },
      { label: 'Frankfurt Messe (exhibition centre)', km: 10 },
      { label: 'Sachsenhausen / Westend', km: 13 },
      { label: 'Darmstadt city centre', km: 35, note: '~€65–80' },
      { label: 'Mainz city centre', km: 40, note: '~€70–85' },
    ],
    tips: [
      'Taxis queue outside Terminal 1 (Arrival Hall B) and Terminal 2 (Arrival Hall D).',
      'S-Bahn S8 and S9 trains run every 15 minutes to Frankfurt Hbf in 15 minutes for €5.25.',
      'Tipping 5–10% is customary; rounding up to the nearest euro is common.',
      'During trade fairs (Messe events), taxi fares and demand spike significantly — book in advance.',
      'Frankfurt taxis accept credit cards; confirm before departure if travelling without cash.',
    ],
    scams: [
      'Driver takes the longer motorway route via A5 instead of the more direct city road — costs extra.',
      'Unlicensed private cars approach in arrivals — only use vehicles from the official taxi rank.',
      'Inflated fixed-rate quotes during Messe trade fair weeks — always insist on the meter.',
    ],
    alternatives: [
      'S-Bahn S8/S9 — €5.25 to Frankfurt Hbf, 15 min',
      'Uber — available, price shown upfront; often 15–20% cheaper than taxis',
      'ICE/InterCity train from Frankfurt Airport Fernbahnhof — direct to Berlin, Munich, Cologne',
    ],
  },

  MAD: {
    code: 'MAD',
    name: 'Adolfo Suárez Madrid–Barajas Airport',
    city: 'Madrid',
    country: 'Spain',
    currency: 'EUR',
    currencySymbol: '€',
    baseRate: 3.00,
    ratePerKm: 1.20,
    minimumFare: 3.00,
    taxiColor: 'white with red stripe (Taxi Madrid)',
    approxCityFare: '€33 fixed rate to city centre (M-30)',
    routes: [
      { label: 'Madrid city centre (within M-30)', km: 15, note: 'FIXED RATE €33 (day) / €35 (night/weekends)' },
      { label: 'Puerta del Sol', km: 14, note: 'within fixed-rate zone' },
      { label: 'Salamanca / Retiro', km: 12, note: 'within fixed-rate zone' },
      { label: 'Getafe / Leganés', km: 25, note: 'outside M-30 — metered' },
      { label: 'Toledo city centre', km: 75, note: 'negotiate fixed price; ~€90–120' },
    ],
    tips: [
      'Fixed rate of €33 (day) / €35 (night & weekends) applies to all rides between the airport and Madrid within the M-30 motorway ring.',
      'The fixed rate includes up to 4 passengers and luggage — no extra charges within the zone.',
      'A €5.50 supplement applies for airport pickups on top of the fixed rate outside M-30.',
      'Metro Line 8 (pink) runs to Nuevos Ministerios in 12 min for €4.50–6 (airport supplement applies).',
      'Tipping is not expected in Spain; rounding up is appreciated.',
    ],
    scams: [
      'Driver claims the fixed rate "doesn\'t apply today" — it always applies to city-centre trips.',
      'Unlicensed VTC (private hire) drivers without the mandatory airport decal — check for official taxi livery.',
      'Extra charges for luggage within the fixed-rate zone — bags are included.',
    ],
    alternatives: [
      'Metro Line 8 — €4.50–6 to Nuevos Ministerios, 12 min (airport supplement applies)',
      'Uber / Cabify — pre-book in-app, competitive with taxi fixed rate',
      'ALSA / DiscoverMadrid bus — €5–8 to Atocha/city centre',
    ],
  },

  FCO: {
    code: 'FCO',
    name: 'Rome Fiumicino Airport',
    city: 'Rome',
    country: 'Italy',
    currency: 'EUR',
    currencySymbol: '€',
    baseRate: 4.50,
    ratePerKm: 1.10,
    minimumFare: 4.50,
    taxiColor: 'white (official Rome taxi)',
    approxCityFare: '€50 fixed rate to historic city centre',
    blogSlug: 'how-much-does-a-taxi-cost-in-rome',
    routes: [
      { label: 'Historic centre (within Aurelian Walls)', km: 32, note: 'FIXED RATE €50' },
      { label: 'Vatican / Prati', km: 30, note: 'FIXED RATE €50' },
      { label: 'Termini Station', km: 33, note: 'FIXED RATE €50' },
      { label: 'Parioli / Parioli / EUR (outside walls)', km: 35, note: 'metered fare ~€60–75' },
      { label: 'Ciampino Airport (CIA)', km: 45, note: 'metered ~€75–90' },
    ],
    tips: [
      'Fixed rate of €50 applies for all rides between FCO and destinations within the Aurelian Walls.',
      'The fixed rate covers all luggage and up to 4 passengers — no extras within the zone.',
      'Night surcharge (22:00–06:00) and Sunday supplement apply outside the fixed-rate zone.',
      'Leonardo Express train runs to Roma Termini in 32 minutes for €14 — cheapest and fastest.',
      'Insist the driver quotes the €50 fixed rate before departing; confirm the destination is within the walls.',
    ],
    scams: [
      'Driver uses the meter instead of the €50 fixed rate — the result is always higher.',
      'Unofficial "taxi" drivers in arrivals quote €80–120 — only use white official taxis from the rank.',
      'Driver claims your hotel is "outside the walls" when it is not — verify on Google Maps.',
      'Inflated luggage surcharges on top of the fixed rate — luggage is included.',
    ],
    alternatives: [
      'Leonardo Express train — €14 to Roma Termini, 32 min',
      'FL1 regional train — €8 to various stations, 45–65 min',
      'Itabus / FlixBus — €5–10 to Termini, 60+ min',
    ],
  },

  BOM: {
    code: 'BOM',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    city: 'Mumbai',
    country: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    baseRate: 25,
    ratePerKm: 20,
    minimumFare: 25,
    taxiColor: 'black & yellow (Kaali-Peeli), AC silver/white (Cool Cab)',
    approxCityFare: '₹400–800 to south Mumbai',
    blogSlug: 'how-much-does-a-taxi-cost-in-mumbai',
    routes: [
      { label: 'Bandra / Andheri (west)', km: 12, note: 'short trip; Ola/Uber often cheaper' },
      { label: 'Juhu Beach area', km: 8 },
      { label: 'Nariman Point / Fort (south Mumbai)', km: 26, note: 'sea-link toll ₹85 extra if used' },
      { label: 'Colaba / Gateway of India', km: 28, note: 'sea-link toll ₹85 extra if used' },
      { label: 'Navi Mumbai / Vashi', km: 30, note: 'bridge toll ₹75 extra' },
    ],
    tips: [
      'Prepaid taxi counters inside arrivals give a fixed price to your destination — good for first-time visitors.',
      'Cool Cabs (AC sedans) cost 25–30% more than Kaali-Peeli but are more comfortable.',
      'Ola and Uber are widely available and typically 20–30% cheaper than metered taxis.',
      'Bandra-Worli Sea Link toll (₹85) is extra and reduces journey time significantly.',
      'Traffic in Mumbai is severe — allow extra time, especially 8–11 am and 5–9 pm.',
    ],
    scams: [
      'Driver refuses the prepaid receipt and quotes a higher price at drop-off.',
      'Meter starts at inflated night-rate tariff during daytime — check the meter card displayed inside.',
      '"Touts" outside the terminal who offer rides to their preferred hotels for commission.',
    ],
    alternatives: [
      'Ola / Uber — book in-app, significantly cheaper than taxis',
      'Metro Line 1 (to Versova) — ₹10–40 for western suburbs (limited coverage)',
      'BEST airport bus — ₹70–100 to various city destinations (slow but cheap)',
    ],
  },

  DEL: {
    code: 'DEL',
    name: 'Indira Gandhi International Airport',
    city: 'Delhi',
    country: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    baseRate: 25,
    ratePerKm: 17,
    minimumFare: 25,
    taxiColor: 'black & yellow (metered), white AC (radio cab)',
    approxCityFare: '₹400–700 to central Delhi',
    routes: [
      { label: 'Connaught Place / city centre', km: 16, note: 'Delhi Metro Airport Express fastest option' },
      { label: 'Karol Bagh / Paharganj', km: 20 },
      { label: 'South Delhi / Hauz Khas', km: 18 },
      { label: 'Gurgaon / Gurugram', km: 25, note: 'NH-48 expressway; Ola/Uber common' },
      { label: 'Noida', km: 45, note: 'heavy traffic; allow 90–120 min' },
    ],
    tips: [
      'Prepaid taxi counters (T3 arrivals) provide fixed-price receipts — always get one before leaving the terminal.',
      'Delhi Metro Airport Express (orange line) runs every 10–15 min to New Delhi station for ₹60–100, 18 min.',
      'Ola and Uber are cheapest and most reliable — book from inside the terminal Wi-Fi before exiting.',
      'Night surcharge (11 pm–5 am) adds 25% to all metered taxi fares.',
      'Always ensure the AC is working in the car before departure.',
    ],
    scams: [
      'Driver claims the prepaid receipt is "not valid tonight" — it always is; escalate to airport police.',
      '"Welcome" hotel touts who claim your hotel is closed or overbooked — ignore them.',
      'Unofficial taxi drivers outside the terminal charge 3–5× the metered rate.',
      'Driver tampers with the meter or uses a rigged device (uncommon but documented).',
    ],
    alternatives: [
      'Delhi Metro Airport Express — ₹60–100 to New Delhi/Dwarka, 18–23 min',
      'Ola / Uber — book in-app from inside the terminal, cheapest option',
      'DTC airport bus — ₹75 to central Delhi (slow, limited luggage)',
    ],
  },

  PEK: {
    code: 'PEK',
    name: 'Beijing Capital International Airport',
    city: 'Beijing',
    country: 'China',
    currency: 'CNY',
    currencySymbol: '¥',
    baseRate: 13,
    ratePerKm: 2.30,
    minimumFare: 13,
    taxiColor: 'various (gold, blue, green regulated fleets)',
    approxCityFare: '¥80–130 to central Beijing',
    routes: [
      { label: 'Tiananmen / Wangfujing (city centre)', km: 28 },
      { label: 'Chaoyang / CBD / Sanlitun', km: 22, note: 'expressway toll ~¥10 extra' },
      { label: 'Zhongguancun / Haidian', km: 35 },
      { label: 'Dongcheng / Qianmen', km: 28 },
      { label: 'Beijing Daxing Airport (PKX)', km: 90, note: 'very expensive — use high-speed train instead' },
    ],
    tips: [
      'Only take taxis from the official taxi rank on the arrivals level — avoid approaches inside the terminal.',
      'The Airport Express train runs to Dongzhimen and Sanyuanqiao stations in 20 minutes for ¥25.',
      'Didi (Chinese Uber equivalent) is cheaper and reliable — set up the app before arriving.',
      'Expressway tolls (¥10–15) are added to the meter on top of the fare.',
      'Night tariff (23:00–05:00) applies a 20% surcharge.',
    ],
    scams: [
      '"Black cabs" (unlicensed) approach you in arrivals with very attractive prices — they always overcharge.',
      'Driver turns off the meter and quotes a fixed price at the end of the trip.',
      'Fake taxis that look similar to official ones — check for the metre and official license plates.',
    ],
    alternatives: [
      'Airport Express train — ¥25 to Dongzhimen/Sanyuanqiao, 20–30 min',
      'Didi — set up the app in advance; cheapest and most convenient',
      'Airport shuttle bus — ¥16–30 to various city districts',
    ],
  },

  NRT: {
    code: 'NRT',
    name: 'Tokyo Narita International Airport',
    city: 'Tokyo',
    country: 'Japan',
    currency: 'JPY',
    currencySymbol: '¥',
    baseRate: 500,
    ratePerKm: 400,
    minimumFare: 500,
    taxiColor: 'black or dark blue (multiple licensed companies)',
    approxCityFare: '¥25,000–40,000 to central Tokyo (impractical — use train)',
    routes: [
      { label: 'Chiba city centre', km: 30, note: 'most practical taxi destination; ~¥8,000–10,000' },
      { label: 'Narita city centre', km: 7, note: '~¥2,500–3,000' },
      { label: 'Makuhari Messe / Chiba', km: 25 },
      { label: 'Tokyo city centre (Shinjuku/Ginza)', km: 65, note: '¥25,000–40,000+ — use Narita Express instead' },
      { label: 'Haneda Airport (HND)', km: 85, note: 'very expensive — Narita Express + Keikyu is much better' },
    ],
    tips: [
      'A taxi to central Tokyo costs ¥25,000–40,000 and takes 60–90 min. The Narita Express (N\'EX) is a far better option.',
      'Narita Express (N\'EX) runs directly to Shinjuku, Shibuya, Ikebukuro — ¥3,070, 90 min.',
      'Limousine Bus is comfortable and affordable (¥3,200) to major Tokyo hotels, 70–90 min.',
      'Tipping is not practiced in Japan — do not tip.',
      'All Japanese taxis are fully metered and honest — if you must take a taxi, it is safe.',
    ],
    scams: [
      'Narita taxi scams are very rare due to Japan\'s strict regulation.',
      'Ensure you are boarding an official taxi from the designated rank — avoid informal vehicles.',
      'Confirm the route before departure if heading to Chiba rather than Tokyo.',
    ],
    alternatives: [
      "Narita Express (N'EX) — ¥3,070–4,070 to Shinjuku/Ikebukuro/Yokohama, 90 min",
      'Limousine Bus — ¥3,200 to Tokyo city hotels, 70–90 min',
      'Keisei Skyliner — ¥2,570 to Ueno/Nippori, 41 min (fastest option)',
    ],
  },

  GRU: {
    code: 'GRU',
    name: 'Guarulhos International Airport',
    city: 'São Paulo',
    country: 'Brazil',
    currency: 'BRL',
    currencySymbol: 'R$',
    baseRate: 5.50,
    ratePerKm: 2.90,
    minimumFare: 5.50,
    taxiColor: 'white (TAXI plate), sedan (regulated radio cabs)',
    approxCityFare: 'R$100–180 to central São Paulo',
    routes: [
      { label: 'Paulista / Jardins / Bela Vista', km: 28, note: 'Anhanguera Expressway + Bandeirantes toll ~R$10' },
      { label: 'Berrini / Vila Olímpia / Itaim', km: 35 },
      { label: 'Liberdade / Centro Histórico', km: 32 },
      { label: 'Congonhas Airport (CGH)', km: 40, note: 'Uber often cheaper for this transfer' },
      { label: 'Campinas city centre', km: 90, note: 'fixed negotiated rate; ~R$250–350' },
    ],
    tips: [
      'Use the official prepaid taxi counters inside arrivals (Guarucoop or Cootaxi) for a fixed price — safer than street hail.',
      '99Taxi and Uber are widely available from the airport and typically 20–30% cheaper than metered taxis.',
      'Traffic on the Ayrton Senna Highway can be severe — allow extra time during rush hour (7–9 am, 5–8 pm).',
      'Airportbus EMTU runs to Tietê Bus Terminal and Guarulhos city for R$10.',
      'Keep your belongings secured during the ride — window smash-and-grab can occur in slow traffic.',
    ],
    scams: [
      'Unofficial taxi drivers approach inside arrivals quoting high fixed prices — use prepaid counters only.',
      'Driver tampers with the meter rate (Tariff 2 during daytime) — check the tariff displayed on the meter.',
      'Driver claims a "highway closure" and takes a longer surface route — confirm on Google Maps.',
    ],
    alternatives: [
      'Uber / 99Taxi — book in-app, 20–30% cheaper than taxis',
      'EMTU bus — R$10 to Tietê Terminal / Guarulhos, 60+ min',
      'Airport bus to Congonhas (for connecting domestic flights) — R$30–40',
    ],
  },

  ICN: {
    code: 'ICN',
    name: 'Incheon International Airport',
    city: 'Seoul',
    country: 'South Korea',
    currency: 'KRW',
    currencySymbol: '₩',
    baseRate: 4800,
    ratePerKm: 1500,
    minimumFare: 4800,
    taxiColor: 'silver (general), black (deluxe), yellow (international)',
    approxCityFare: '₩60,000–80,000 to central Seoul',
    blogSlug: 'taxi-fares-in-south-korea',
    routes: [
      { label: 'Gangnam / COEX (Seoul)', km: 60, note: 'expressway toll ~₩7,700 extra' },
      { label: 'Myeongdong / Jung-gu (Seoul CBD)', km: 65, note: 'expressway toll ~₩7,700 extra' },
      { label: 'Hongdae / Mapo', km: 60, note: 'expressway toll ~₩7,700 extra' },
      { label: 'Incheon city centre', km: 15 },
      { label: 'Suwon', km: 75, note: 'long-distance fare; AREX + KTX often faster' },
    ],
    tips: [
      'International Taxis (yellow) have English-speaking drivers and fixed fares — recommended for non-Korean speakers.',
      'Deluxe (black) and International taxis charge 20–30% more than regular silver taxis.',
      'Expressway tolls are paid by the passenger on top of the meter.',
      'KakaoTaxi app works in Korea (similar to Uber) and allows English-language booking.',
      'Tipping is not customary in South Korea — do not tip.',
    ],
    scams: [
      'Driver takes the slower city road instead of the expressway to increase the metered fare — always confirm you want the expressway (고속도로, gosokdoro) before setting off.',
      'Unlicensed drivers outside the airport — always use the official taxi rank on Level 1 of the arrivals hall, marked with a taxi sign.',
      'Overcharging tourists by silently switching to the Deluxe (black) tariff instead of the standard silver meter rate without disclosure.',
      'Fake "fixed airport fare" quotes from touts in the arrivals hall — licensed ICN taxis always use the meter plus the expressway toll, never a pre-negotiated flat rate.',
      'Running the meter before departure while loading luggage — the meter should only start when the taxi begins moving.',
    ],
    alternatives: [
      'AREX (Airport Railroad Express) — ₩9,500 direct to Seoul Station, 43 min',
      'AREX all-stop train — ₩4,150 to Seoul Station, 66 min',
      'Airport Bus (limousine) — ₩17,000 to major Seoul hotels, 60–90 min',
      'KakaoTaxi — app-based, same licensed taxis, English support',
    ],
  },
  CAI: {
    code: 'CAI',
    name: 'Cairo International Airport',
    city: 'Cairo',
    country: 'Egypt',
    currency: 'EGP',
    currencySymbol: 'E£',
    baseRate: 10,
    ratePerKm: 8,
    minimumFare: 25,
    taxiColor: 'white (official airport taxis)',
    approxCityFare: 'E£200–400 to downtown Cairo (negotiated)',
    blogSlug: 'taxi-scams-in-cairo',
    routes: [
      { label: 'Downtown Cairo / Tahrir Square', km: 22, note: 'negotiate fare before boarding; E£200–350 typical' },
      { label: 'Giza / Pyramids area', km: 30, note: 'E£300–450; heavy traffic via Ring Road' },
      { label: 'Zamalek / Garden City', km: 26, note: 'E£250–380; riverside neighbourhoods' },
      { label: 'Heliopolis (adjacent)', km: 6, note: 'E£60–100; closest major district' },
      { label: 'New Cairo / Fifth Settlement', km: 38, note: 'E£350–550; use Careem/Uber for fixed price' },
      { label: 'Maadi', km: 35, note: 'E£300–480; expat district south of downtown' },
    ],
    tips: [
      'Meters exist but are almost never used — always agree on a price before you get in the taxi.',
      'Careem and Uber both operate from Cairo Airport and offer upfront fixed pricing — strongly recommended over street taxis.',
      'Official white airport taxis are licensed and generally more reliable than unmetered kerb taxis.',
      'Night surcharges (25%) apply on metered fares if the driver agrees to use the meter.',
      'Egyptian pounds have fluctuated significantly — check the current exchange rate before arriving.',
    ],
    scams: [
      'Driver claims Uber/Careem is unavailable or banned — it is not; both apps work throughout Cairo.',
      'Unofficial drivers approach arrivals inside the terminal before the official taxi rank — always exit to the kerb rank.',
      'Driver "helps with luggage" then demands payment for the assistance on top of the fare.',
      'Sudden detours claiming road closures that extend the journey and the negotiated fare.',
      'Quoting fares in USD at unfavourable rates — insist on paying in Egyptian pounds.',
    ],
    alternatives: [
      'Careem — preferred app-based option, upfront pricing, Arabic + English, widely used',
      'Uber — available throughout Cairo, similar pricing to Careem',
      'Cairo Metro — no direct airport connection; take a taxi/Careem to nearest metro station',
      'Airport Bus — limited public bus routes; not recommended with luggage',
    ],
  },
}

export function getAirportData(code: string): AirportData | null {
  return AIRPORT_DATA[code.toUpperCase()] ?? null
}

export function getAllAirportCodes(): string[] {
  return Object.keys(AIRPORT_DATA)
}

/**
 * Keywords to match each airport in a freeform autocomplete string.
 * Uses distinctive words only — generic terms like "international" and "airport" are excluded.
 * IATA codes are matched separately as whole-word patterns (e.g. \bBKK\b).
 */
const AIRPORT_KEYWORDS: Record<string, string[]> = {
  BKK: ['suvarnabhumi'],
  DXB: ['dubai international'],
  SIN: ['changi'],
  LHR: ['heathrow'],
  JFK: ['kennedy', 'john f. kennedy'],
  CDG: ['de gaulle', 'gaulle', 'roissy'],
  AMS: ['schiphol'],
  HND: ['haneda'],
  SYD: ['kingsford smith'],
  LAX: ['los angeles international'],
  ORD: ["o'hare", 'ohare'],
  FRA: ['frankfurt airport', 'frankfurt flughafen'],
  MAD: ['barajas'],
  FCO: ['fiumicino'],
  BOM: ['chhatrapati shivaji', 'mumbai international'],
  DEL: ['indira gandhi'],
  PEK: ['beijing capital'],
  NRT: ['narita'],
  GRU: ['guarulhos'],
  ICN: ['incheon'],
  CAI: ['cairo international'],
}

/**
 * Returns the matching AirportData if the query string contains a known IATA code
 * (as a whole word) or a distinctive keyword from AIRPORT_KEYWORDS.
 * Used in TaxiForm to surface a contextual hint linking to the airport page.
 */
export function matchAirport(query: string): AirportData | null {
  if (!query.trim()) return null
  const q = query.toLowerCase()

  for (const [code, keywords] of Object.entries(AIRPORT_KEYWORDS)) {
    // Whole-word IATA code match (e.g. "BKK" but not "AOBKKA")
    if (new RegExp(`\\b${code}\\b`, 'i').test(query)) {
      return AIRPORT_DATA[code] ?? null
    }
    // Distinctive keyword match
    if (keywords.some((kw) => q.includes(kw))) {
      return AIRPORT_DATA[code] ?? null
    }
  }
  return null
}

/**
 * Related airports by code — 3 suggestions per airport, organised by region proximity.
 * Shown at the bottom of each airport page to improve crawlability and time-on-site.
 */
const RELATED_AIRPORTS: Record<string, string[]> = {
  // Asia-Pacific
  BKK: ['SIN', 'HND', 'DXB'],
  SIN: ['BKK', 'HND', 'DXB'],
  HND: ['SIN', 'BKK', 'BOM'],
  SYD: ['BKK', 'SIN', 'LHR'],
  MEL: ['SYD', 'BKK', 'SIN'],
  BOM: ['DEL', 'DXB', 'SIN'],
  DEL: ['BOM', 'DXB', 'SIN'],
  NRT: ['HND', 'SIN', 'BKK'],
  ICN: ['HND', 'SIN', 'BKK'],
  PEK: ['HND', 'SIN', 'DXB'],
  // Middle East
  DXB: ['SIN', 'LHR', 'BKK'],
  // Europe
  LHR: ['CDG', 'AMS', 'FRA'],
  CDG: ['LHR', 'AMS', 'MAD'],
  AMS: ['LHR', 'CDG', 'FRA'],
  FRA: ['LHR', 'CDG', 'AMS'],
  MAD: ['CDG', 'LHR', 'FCO'],
  FCO: ['MAD', 'CDG', 'LHR'],
  // Americas
  JFK: ['LAX', 'ORD', 'LHR'],
  LAX: ['JFK', 'ORD', 'SIN'],
  ORD: ['JFK', 'LAX', 'LHR'],
  GRU: ['JFK', 'LHR', 'MAD'],
}

/**
 * Returns up to 3 related airports for a given IATA code.
 * Only returns airports that exist in AIRPORT_DATA (safe to link to).
 */
export function getRelatedAirports(code: string): AirportData[] {
  const codes = RELATED_AIRPORTS[code] ?? []
  return codes.map((c) => AIRPORT_DATA[c]).filter((a): a is AirportData => !!a)
}

/**
 * City name → primary IATA airport code.
 * Used in blog posts to surface a contextual airport CTA without needing each
 * post to declare an airportCode field manually.
 *
 * Covers all airports in AIRPORT_DATA plus common alternate city spellings.
 */
const CITY_TO_AIRPORT_CODE: Record<string, string> = {
  // Asia-Pacific
  Bangkok: 'BKK', Suvarnabhumi: 'BKK',
  Singapore: 'SIN',
  Tokyo: 'HND', 'Tokyo (Haneda)': 'HND', 'Tokyo (Narita)': 'NRT',
  Sydney: 'SYD',
  Melbourne: 'MEL',
  Beijing: 'PEK',
  Seoul: 'ICN',
  Mumbai: 'BOM', Bombay: 'BOM',
  Delhi: 'DEL', 'New Delhi': 'DEL',
  // Middle East & Africa
  Dubai: 'DXB',
  Cairo: 'CAI',
  // Europe
  London: 'LHR',
  Paris: 'CDG',
  Amsterdam: 'AMS',
  Frankfurt: 'FRA',
  Madrid: 'MAD',
  Rome: 'FCO',
  // Americas
  'New York': 'JFK', 'New York City': 'JFK', NYC: 'JFK',
  'Los Angeles': 'LAX',
  Chicago: 'ORD',
  'São Paulo': 'GRU', 'Sao Paulo': 'GRU',
}

/**
 * Returns the AirportData for a city name, or null if no airport page exists.
 * Used by blog posts to auto-link city taxi articles → /taxi/airport/[code].
 */
export function getAirportForCity(city: string): AirportData | null {
  const code = CITY_TO_AIRPORT_CODE[city]
  return code ? (AIRPORT_DATA[code] ?? null) : null
}

/** Calculate a fare estimate for a given route */
export function estimateAirportFare(
  airport: AirportData,
  km: number
): { min: number; max: number } {
  const base = Math.max(airport.baseRate + airport.ratePerKm * km, airport.minimumFare)
  return {
    min: Math.round(base * 0.85),
    max: Math.round(base * 1.15),
  }
}
