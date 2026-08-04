import type { BlogPost } from "./blog-posts";

export const BATCH7_BLOG_POSTS: BlogPost[] = [
  // ── Tipping in Germany ──────────────────────────────────────────────────────
  {
    slug: "tipping-in-germany",
    title: "Tipping in Germany: How Much to Tip in 2026",
    description:
      "Tipping in Germany is expected but at lower rates than the US — 5–10% at restaurants, round up in taxis. The key rule: tell the waiter the total you want to pay, don't leave money on the table.",
    publishedAt: "2026-08-03",
    readingMinutes: 6,
    category: "tipping",
    country: "Germany",
    countrySlug: "germany",
    content: [
      {
        type: "intro",
        body: "Tipping in Germany is expected but nowhere near as obligatory — or as high — as in the United States. Germans tip 5–10% at restaurants, round up taxi fares to the nearest euro, and leave nothing in cafés unless the service was exceptional. The most important difference: you don't leave money on the table. You tell the server the total you want to pay, they give you the change. Get this wrong and your tip will be returned to you.",
      },
      { type: "h2", heading: "Restaurant Tipping in Germany" },
      {
        type: "p",
        body: "At sit-down restaurants, a 5–10% tip is the norm for good service. This is significantly less than the 15–20% expected in North America. If the service was poor, leaving nothing is acceptable — Germans are direct about this. There is no culture of tipping automatically regardless of experience.",
      },
      {
        type: "tip",
        body: 'To tip in Germany: when the server brings the bill and asks how you\'d like to pay, say the total amount you want them to take. If the bill is €34.50 and you want to tip €3, say "Siebenunddreißig" (37 euros). They give you change for €37. Alternatively, say "Stimmt so" (shtimmt zo) — "that\'s fine" — to keep the full change.',
      },
      {
        type: "table",
        rows: [
          { label: "Restaurants (good service)", value: "5–10% of the bill" },
          { label: "Restaurants (exceptional service)", value: "10–15%" },
          {
            label: "Restaurants (poor service)",
            value: "0% — acceptable to leave nothing",
          },
          {
            label: "Cafés and bakeries",
            value: "Round up or leave small coins — not required",
          },
          {
            label: "Bars and pubs",
            value: "Round up per round, or €0.50–1 per drink",
          },
          { label: "Food delivery", value: "€1–2 per order" },
        ],
      },
      { type: "h2", heading: "Taxi Tipping in Germany" },
      {
        type: "p",
        body: 'For taxis, round up to the nearest convenient amount. A €13.80 fare becomes €15. A €22.30 fare becomes €24 or €25. A 5–10% tip for longer journeys is appreciated but not expected. Simply tell the driver the amount when paying cash — "Fünfzehn" (fifteen) — and they will give you change accordingly. Card payments in German taxis are not always available, so carry some euros.',
      },
      { type: "h2", heading: "Hotel Tipping in Germany" },
      {
        type: "table",
        rows: [
          { label: "Porters / bellhops", value: "€1–2 per bag" },
          { label: "Housekeeping", value: "€1–2 per day, left at end of stay" },
          {
            label: "Concierge (special service)",
            value: "€5–10 for significant help",
          },
          {
            label: "Room service",
            value: "Check if service charge already included; €1–2 if not",
          },
        ],
      },
      { type: "h2", heading: "Tour Guides and Other Services" },
      {
        type: "table",
        rows: [
          {
            label: "Tour guide (group tour, half-day)",
            value: "€3–5 per person",
          },
          { label: "Tour guide (private, full-day)", value: "€15–25 total" },
          { label: "Spa and massage", value: "5–10% optional" },
          { label: "Hair salon", value: "5–10% optional" },
          { label: "Coat check", value: "€0.50–1 (often a fixed fee anyway)" },
        ],
      },
      { type: "h2", heading: "Is a Service Charge Already Included?" },
      {
        type: "p",
        body: 'German restaurants rarely add a mandatory service charge to the bill. The printed total is almost always the base price only — no hidden Bedienungsgeld (service fee) unless explicitly stated on the menu or bill. If you see "inkl. Bedienungsgeld" (service included), no further tip is needed.',
      },
      { type: "h2", heading: "Common Tipping Mistakes in Germany" },
      {
        type: "ul",
        items: [
          "Leaving cash on the table and walking out — servers may think you forgot it and chase you",
          "Tipping 20% — this reads as very unusual and sometimes causes confusion",
          "Expecting a tip prompt on card machines — most German card terminals do not have tip screens",
          "Not tipping at all at nice restaurants — a small tip is expected for table service",
          "Tipping at self-service cafeterias (Mensa, IKEA-style restaurants) — not done",
        ],
      },
      { type: "h2", heading: "Useful German Phrases" },
      {
        type: "table",
        rows: [
          {
            label: '"Stimmt so"',
            value: 'Shtimmt zo — "Keep the change" (tip included)',
          },
          {
            label: '"Das stimmt so, danke"',
            value: "That's right, thank you — same as above, more polite",
          },
          {
            label: 'Stating the total: "Fünfzig, bitte"',
            value: '"Fifty, please" — they take €50 and give correct change',
          },
          {
            label: '"Getrennt, bitte"',
            value: 'Geh-trennt — "Separate bills, please"',
          },
          {
            label: '"Zusammen, bitte"',
            value: 'Zoo-zah-men — "Together, please" (one bill)',
          },
        ],
      },
      {
        type: "faq",
        faqs: [
          {
            q: "Is tipping mandatory in Germany?",
            a: "No — tipping is not legally or socially obligatory in Germany, but it is customary at sit-down restaurants to leave 5–10% for good service. Leaving nothing after poor service is entirely acceptable and not considered rude.",
          },
          {
            q: "How do you tip in German restaurants?",
            a: 'Tell the server the total you want to pay when they collect your cash. If the bill is €28.50 and you say "dreißig" (thirty), they give you €1.50 change and keep €1.50 as a tip. Alternatively, say "stimmt so" (keep the change) for the exact tip amount.',
          },
          {
            q: "Do Germans tip with credit cards?",
            a: "Card tipping is uncommon in Germany. Most card terminals do not have a tip field. If you want to tip when paying by card, ask the server if they can add it — some can, many cannot. Carrying a few euros in coins for tipping is advisable.",
          },
          {
            q: "How much do you tip a taxi driver in Germany?",
            a: 'Round up to the nearest convenient amount — typically the next whole euro or a 5–10% addition. A €13.80 fare rounded to €15 is generous. Tell the driver the amount when paying: "Fünfzehn" means they take €15 from your €20 and return €5.',
          },
        ],
      },
    ],
    references: [
      {
        label: "German Taxi Association — official fare information",
        url: "https://www.taxi-deutschland.de",
      },
    ],
  },

  // ── Tipping in Australia ────────────────────────────────────────────────────
  {
    slug: "tipping-in-australia",
    title: "Tipping in Australia: Is It Expected? (2026 Guide)",
    description:
      "Tipping is not expected in Australia — workers earn a high minimum wage ($23+/hour) and service charges are rare. A 10% tip at a nice restaurant is generous; rounding up a taxi fare is polite but never required.",
    publishedAt: "2026-08-03",
    readingMinutes: 5,
    category: "tipping",
    country: "Australia",
    countrySlug: "australia",
    content: [
      {
        type: "intro",
        body: "Australia has no tipping culture to speak of. Workers are protected by one of the world's highest minimum wages (over AUD $23 per hour in 2026), and service charges are almost never added to bills. Tipping is entirely optional everywhere — leaving nothing is completely normal and carries no social stigma. If you had exceptional service, a 10% tip at a restaurant is a genuine compliment; a gold coin ($1 or $2) in a café jar is generous.",
      },
      { type: "h2", heading: "Tipping at Restaurants in Australia" },
      {
        type: "p",
        body: "Australian restaurant staff earn award wages that are significantly higher than in the US or UK — plus penalty rates on weekends (typically 25% higher on Saturdays, 50% on Sundays). This is why you'll sometimes see a weekend surcharge of 10–15% on your bill at restaurants. If a surcharge is already applied, no additional tip is needed or expected. At nice restaurants without a surcharge, 10% for outstanding service is a genuine compliment.",
      },
      {
        type: "table",
        rows: [
          {
            label: "Casual café or coffee shop",
            value: "Not expected; a gold coin in the tip jar is appreciated",
          },
          {
            label: "Sit-down restaurant (standard service)",
            value: "Not expected",
          },
          { label: "Restaurant (outstanding service)", value: "10% optional" },
          {
            label: "Fine dining",
            value: "10% optional — well-received for excellent service",
          },
          {
            label: "Sunday / public holiday surcharge",
            value: "Already on your bill (10–15%) — no extra tip needed",
          },
          {
            label: "Food delivery (Uber Eats, DoorDash)",
            value: "App tip prompt — $2–3 optional",
          },
        ],
      },
      { type: "h2", heading: "Taxi and Rideshare Tipping" },
      {
        type: "p",
        body: "Taxi drivers in Australia do not expect tips. Rounding up to the nearest dollar is a common polite gesture — a $23.60 fare might be paid as $25 — but it is not required. Uber and DiDi in Australia do not have the same tipping culture as in the US. In-app tip prompts exist but are rarely used. Drivers are paid Australian rates and do not rely on tips to make a living wage.",
      },
      { type: "h2", heading: "Hotel Tipping in Australia" },
      {
        type: "table",
        rows: [
          {
            label: "Porters / baggage handlers",
            value: "Not expected; $2/bag if you wish",
          },
          {
            label: "Housekeeping",
            value: "Not expected; $5/day at end of stay if you wish",
          },
          {
            label: "Concierge (major effort)",
            value: "$5–10 for significant assistance",
          },
          { label: "Room service", value: "Not expected; $2–3 optional" },
        ],
      },
      { type: "h2", heading: "Bar and Nightlife Tipping" },
      {
        type: "p",
        body: "Tipping at bars is essentially unheard of in Australia. Bartenders earn good wages and do not receive, or expect, tip jars. Shout culture (buying rounds for a group) is the Australian version of expressing generosity, not tipping per drink. If you genuinely loved the cocktails, saying so is more culturally appropriate than leaving cash.",
      },
      { type: "h2", heading: "Tour Guides and Experiences" },
      {
        type: "table",
        rows: [
          {
            label: "City or nature tour guide",
            value: "Not required; $5–10 per person if exceptional",
          },
          { label: "Wildlife sanctuary staff", value: "Not expected" },
          {
            label: "Surf lesson instructor",
            value: "Not expected; $10–20 for a private lesson well done",
          },
          {
            label: "Dive instructor (extended course)",
            value:
              "$20–30 for multi-day courses if you want to show appreciation",
          },
        ],
      },
      { type: "h2", heading: "Card Tip Prompts in Australia" },
      {
        type: "p",
        body: 'Many Australian EFTPOS (card) terminals now display a tip prompt when you tap or insert your card. This is increasingly common but culturally relatively new — Australians routinely press "No tip" or "0%" without any social awkwardness. The introduction of tip prompts has been controversial and doesn\'t reflect a shift in tipping expectations.',
      },
      {
        type: "tip",
        body: "The golden rule for tipping in Australia: you will never offend anyone by not tipping. You will genuinely delight someone by tipping 10% at a restaurant. Unlike the US, Australian hospitality workers earn a proper wage and are not financially dependent on gratuities.",
      },
      {
        type: "faq",
        faqs: [
          {
            q: "Is it rude not to tip in Australia?",
            a: "No — not tipping in Australia is entirely normal and carries no social stigma. Australian workers earn among the highest minimum wages in the world and service charges are rare. A tip is a genuine bonus, not an expectation.",
          },
          {
            q: "Why are there Sunday surcharges on Australian restaurant bills?",
            a: "Under Australian workplace law, staff who work Sundays and public holidays are entitled to penalty rates (higher pay). Rather than absorbing this cost, many restaurants add a 10–15% surcharge to Sunday bills. This is disclosed on menus and replaces any need for a tip.",
          },
          {
            q: "Should I tip Uber drivers in Australia?",
            a: "It's not expected. Uber and DiDi drivers in Australia earn Australian wages. An in-app tip option exists but very few Australians use it. A 5-star rating and a friendly ride is the standard way to show appreciation.",
          },
          {
            q: "How much should I tip at an Australian restaurant?",
            a: "10% for genuinely excellent service at a sit-down restaurant is a generous and appreciated tip. For standard service, nothing is completely normal. Check your bill first — if a weekend surcharge is already applied, no additional tip is needed.",
          },
        ],
      },
    ],
    references: [
      {
        label: "Fair Work Commission — National Minimum Wage",
        url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages",
      },
    ],
  },

  // ── Tipping in Japan ────────────────────────────────────────────────────────
  {
    slug: "tipping-in-japan",
    title: "Tipping in Japan: Why You Should Never Tip (2026)",
    description:
      "Tipping is not done in Japan — it can be considered rude. From sushi restaurants to taxis and ryokan, Japanese service staff do not expect or want tips. Here's why, and what to do instead.",
    publishedAt: "2026-08-03",
    readingMinutes: 5,
    category: "tipping",
    country: "Japan",
    countrySlug: "japan",
    content: [
      {
        type: "intro",
        body: "Japan is one of the few countries where tipping is not just unnecessary — it can be genuinely confusing or uncomfortable for the recipient. Japanese service culture is built on the concept of omotenashi: wholehearted hospitality given without expectation of reward. Leaving extra money implies the staff weren't paid fairly, which can feel insulting. Taxi drivers have been known to chase down passengers to return overpayment. Do not tip anywhere in Japan.",
      },
      {
        type: "warning",
        body: "Never leave cash on a restaurant table as a tip in Japan. Staff will assume you forgot it and may call after you or hand it to the manager. Attempting to press money into a staff member's hand can cause embarrassment on both sides.",
      },
      { type: "h2", heading: "No-Tip Summary for Japan" },
      {
        type: "table",
        rows: [
          {
            label: "Restaurants (all types)",
            value: "No tip — pay only what is on the bill",
          },
          { label: "Ramen, sushi, izakaya", value: "No tip" },
          { label: "Cafés and coffee shops", value: "No tip" },
          { label: "Taxis", value: "No tip — pay the exact meter amount" },
          {
            label: "Hotels",
            value: "No tip for porters, housekeeping, or concierge",
          },
          {
            label: "Ryokan (traditional inns)",
            value: "No tip (see note below on oshibori)",
          },
          { label: "Tour guides", value: "No tip expected" },
          { label: "Spa, onsen, massage", value: "No tip" },
          { label: "Delivery drivers", value: "No tip" },
        ],
      },
      { type: "h2", heading: "Why Japanese Culture Doesn't Tip" },
      {
        type: "p",
        body: "Japanese workplace culture values precision, pride, and professional standards that are considered intrinsic to the job — not something extra that requires a financial reward. Service workers are paid standard wages and are not expected to supplement income through tips. The concept of tipping implies that pay is inadequate, which can feel disrespectful within this cultural framework. This applies uniformly across all service sectors — from a convenience store clerk to a Michelin-starred restaurant.",
      },
      { type: "h2", heading: "Ryokan — The One Nuance" },
      {
        type: "p",
        body: "At traditional Japanese inns (ryokan), particularly high-end ones, some guests leave a small monetary thank-you (called a kokoro-dzuke, or an envelope of money) for the nakai-san (the personal attendant who prepares your room and serves kaiseki meals). This is a cultural gesture, not a tip — it is placed in an envelope, presented formally, and only done at very traditional establishments by guests who feel they have received exceptional personal service. For most ryokan stays, it is entirely unnecessary and not expected.",
      },
      { type: "h2", heading: "How to Express Appreciation in Japan" },
      {
        type: "ul",
        items: [
          'Say "Oishikatta desu" (oh-ee-shee-kah-tah dess) — "That was delicious" — after a meal',
          'Say "Arigatou gozaimashita" (ah-ree-gah-toh go-zah-ee-mah-shee-tah) — "Thank you very much"',
          "Bow slightly when receiving or returning change",
          "Return your tray neatly at self-service restaurants",
          "Rate drivers 5 stars on the GO app",
          "At ryokan: thank your nakai-san by name at checkout",
        ],
      },
      { type: "h2", heading: "International Hotels in Japan" },
      {
        type: "p",
        body: "Some international hotel chains (Hilton, Hyatt, Marriott) operating in Japan have adapted to accommodate guests who expect to tip, particularly in Tokyo and Osaka. Tip boxes occasionally appear in rooms or at concierge desks. These are not culturally Japanese — they exist for foreign guest comfort only. Japanese staff are not expecting them and will not be offended if you ignore them.",
      },
      {
        type: "tip",
        body: "The best way to show appreciation in Japan is through eye contact, a smile, a small bow, and genuine verbal thanks in Japanese. Oishikatta desu after a meal is worth far more to a Japanese chef than any amount of cash.",
      },
      {
        type: "faq",
        faqs: [
          {
            q: "Is it rude to tip in Japan?",
            a: "Not exactly rude — but it can be confusing and uncomfortable. Staff are trained to return extra money to customers, assuming it was given by mistake. At traditional establishments, attempting to press cash on a staff member can cause genuine awkwardness. It's best to simply not tip.",
          },
          {
            q: "What happens if I accidentally leave a tip in Japan?",
            a: "A staff member will typically call after you to return the money, or hand it to the manager for lost property. It will not be pocketed. This is why Japanese service culture has such a strong reputation for honesty — the incentives are entirely different from tip-dependent cultures.",
          },
          {
            q: "Do taxi drivers in Japan accept tips?",
            a: "No. Pay the exact meter amount. Japanese taxis are scam-free and meters are honest — there is no need to round up or add anything extra. If you overpay by accident, the driver will give you exact change.",
          },
          {
            q: "Should I tip a tour guide in Japan?",
            a: 'No — tour guides in Japan are professionally employed and do not expect or particularly want tips. A genuine verbal thank-you in Japanese ("Arigatou gozaimashita") and a positive review online is far more meaningful.',
          },
        ],
      },
    ],
    references: [
      {
        label: "Japan Tourism Agency — cultural guidance for visitors",
        url: "https://www.mlit.go.jp/kankocho/en",
      },
    ],
  },

  // ── Tipping in Thailand ─────────────────────────────────────────────────────
  {
    slug: "tipping-in-thailand",
    title: "Tipping in Thailand: How Much to Tip in 2026",
    description:
      "Tipping in Thailand is expected at restaurants (10–15%), essential for massage therapists (50–100 THB), and appreciated for tour guides (200–500 THB/day). Taxi drivers expect a round-up, not a percentage.",
    publishedAt: "2026-08-03",
    readingMinutes: 6,
    category: "tipping",
    country: "Thailand",
    countrySlug: "thailand",
    content: [
      {
        type: "intro",
        body: "Tipping in Thailand is not mandatory but it is very much appreciated — and for some workers, particularly massage therapists and tour guides, tips make up a significant portion of take-home pay. At tourist-facing restaurants a 10–15% tip is the norm for good service. For massage and spa workers, tipping is effectively essential: base wages are very low and therapists rely on tips. Budget ฿50–100 per hour of massage and ฿200–500 per day for guides.",
      },
      { type: "h2", heading: "Restaurant and Café Tipping" },
      {
        type: "p",
        body: "At sit-down tourist restaurants and mid-range dining venues, 10–15% is the accepted norm for good service. Many upscale restaurants and hotel restaurants add a 10% service charge to the bill — check the itemised total before adding more. Street food stalls, market food courts, and casual canteens do not expect tips: pay the quoted price and receive exact change.",
      },
      {
        type: "table",
        rows: [
          {
            label: "Tourist restaurants (good service)",
            value: "฿50–150 or 10–15%",
          },
          {
            label: "Hotel restaurants",
            value: "Check if 10% service charge already added",
          },
          { label: "Street food / market stalls", value: "No tip expected" },
          {
            label: "Food courts (MBK, Terminal 21 etc.)",
            value: "No tip expected",
          },
          {
            label: "Bars and rooftop venues",
            value: "฿20–50 per round or 10% on drinks tab",
          },
          { label: "Food delivery", value: "฿20–50 appreciated" },
        ],
      },
      { type: "h2", heading: "Massage and Spa Tipping — Most Important" },
      {
        type: "p",
        body: "This is the most important tipping scenario in Thailand. Massage therapists typically earn ฿150–300 base pay for a 1-hour massage that you pay ฿300–600 for — the shop keeps the majority. Tips are the primary way therapists top up their wages. Tipping 50–100 THB for a 1-hour massage is considered the minimum expected from a foreign tourist.",
      },
      {
        type: "table",
        rows: [
          {
            label: "Traditional Thai massage (1 hour, ฿300–500)",
            value: "฿50–100 tip",
          },
          { label: "Foot massage (1 hour, ฿250–400)", value: "฿50–100 tip" },
          {
            label: "Oil or aromatherapy massage (1 hour, ฿500–800)",
            value: "฿100–150 tip",
          },
          {
            label: "Full-body spa treatment (2 hours, ฿1,000+)",
            value: "฿150–250 tip",
          },
          {
            label: "Hotel spa (premium, ฿2,500+)",
            value: "10% tip or ฿200–300",
          },
        ],
      },
      {
        type: "tip",
        body: 'Give the tip directly to your therapist, not at the front desk — it may not reach them otherwise. A small envelope or handing it to them personally while saying "khob khun kha/khrab" (thank you) is the right approach.',
      },
      { type: "h2", heading: "Taxi and Grab Tipping" },
      {
        type: "p",
        body: "Metered taxis in Bangkok: round up to the nearest ฿10 or 20. A ฿147 fare becomes ฿150 or ฿160 — just leave the coins. Drivers do not expect a percentage-based tip. For Grab, a small in-app tip of ฿20–50 is appreciated but not expected. The driver rating is more important than a tip.",
      },
      { type: "h2", heading: "Tour Guides" },
      {
        type: "table",
        rows: [
          {
            label: "Group tour guide (half-day)",
            value: "฿100–200 per person",
          },
          {
            label: "Group tour guide (full-day)",
            value: "฿200–500 per person",
          },
          { label: "Private tour guide (full-day)", value: "฿500–1,000 total" },
          {
            label: "Driver (day trip, not guide role)",
            value: "฿100–200 total",
          },
          {
            label: "Wildlife / elephant sanctuary staff",
            value: "฿100–200 total",
          },
          {
            label: "Snorkelling / boat trip crew",
            value: "฿100–200 total per person",
          },
        ],
      },
      { type: "h2", heading: "Hotel Tipping" },
      {
        type: "table",
        rows: [
          { label: "Porters / luggage assistance", value: "฿20–50 per bag" },
          { label: "Housekeeping", value: "฿20–50 per day, left each morning" },
          {
            label: "Pool/beach attendant (larger resort)",
            value: "฿20–50 per session",
          },
          {
            label: "Concierge (booking, tour arrangements)",
            value: "฿100–200 for substantial help",
          },
        ],
      },
      {
        type: "faq",
        faqs: [
          {
            q: "Is tipping mandatory in Thailand?",
            a: "Not legally, but it is very much part of the tourism culture and many service workers rely heavily on tips due to low base wages. For massage therapists in particular, tipping is strongly expected from foreign visitors.",
          },
          {
            q: "How much should I tip for a Thai massage?",
            a: "฿50–100 is the standard tip for a 1-hour traditional Thai massage or foot massage. For oil massages or longer treatments, ฿100–200 is more appropriate. Give it directly to your therapist after the session.",
          },
          {
            q: "Do you tip Grab drivers in Thailand?",
            a: "It's not expected in the same way as in the US, but a small in-app tip of ฿20–50 for a good ride is appreciated. A 5-star rating is at least as important for the driver.",
          },
          {
            q: "Is the service charge at Thai restaurants shared with staff?",
            a: "Not always — Thai law does not require the 10% service charge on bills to go directly to staff. Some restaurants keep it as revenue. If you want the money to reach your server, leave a cash tip directly.",
          },
        ],
      },
    ],
  },

  // ── Taxi Costs in Cancun ────────────────────────────────────────────────────
  {
    slug: "how-much-does-a-taxi-cost-in-cancun",
    title: "How Much Does a Taxi Cost in Cancun? (2026 Zone Fares)",
    description:
      "Cancun taxis don't use meters — the Hotel Zone runs on fixed zone fares ($15–40 USD within Zona Hotelera). Airport to Hotel Zone costs $35–55 USD. Here's the full 2026 zone map, SETRA airport taxi guide, and how to avoid overpaying.",
    publishedAt: "2026-08-03",
    readingMinutes: 7,
    category: "taxi",
    city: "Cancun",
    country: "Mexico",
    citySlug: "cancun",
    countrySlug: "mexico",
    content: [
      {
        type: "intro",
        body: "Cancun taxis do not use meters — fares are based on a zone system, and tourists who don't know the zones routinely pay 2–3x the correct price. The Hotel Zone (Zona Hotelera) is divided into numbered zones, each with a fixed fare. Within Zone 2, a short hop between beach clubs costs $10–15 USD. From Cancun International Airport to the Hotel Zone, SETRA cooperative taxis charge $35–55 USD. Knowing the zones before you get in is the difference between a fair fare and a tourist trap.",
      },
      { type: "h2", heading: "Cancun Taxi Zone System Explained" },
      {
        type: "p",
        body: "The Hotel Zone (Kukulcán Boulevard) runs 23 km from downtown Cancun to the southern tip near Punta Nizuc. Hotels are grouped into numbered zones. Official zone fare tables are posted inside most taxi cabs and at many hotel lobbies. Fares are generally quoted in USD, though pesos are always accepted at the current exchange rate.",
      },
      {
        type: "table",
        rows: [
          { label: "Within Zone 1 (northern Hotel Zone)", value: "$12–18 USD" },
          {
            label: "Within Zone 2 (mid Hotel Zone, km 9–14)",
            value: "$15–20 USD",
          },
          {
            label: "Within Zone 3 (southern Hotel Zone, km 14–20)",
            value: "$18–25 USD",
          },
          { label: "Zone 1 to Zone 2", value: "$18–25 USD" },
          { label: "Zone 1 to Zone 3", value: "$28–40 USD" },
          {
            label: "Hotel Zone to Downtown Cancun (Centro)",
            value: "$22–35 USD",
          },
          { label: "Hotel Zone to Puerto Morelos", value: "$35–50 USD" },
          {
            label: "Hotel Zone to Playa del Carmen",
            value: "$60–90 USD (ADO bus recommended)",
          },
        ],
      },
      { type: "h2", heading: "Cancun Airport Taxis (CUN)" },
      {
        type: "p",
        body: "Cancun International Airport (CUN) is served by SETRA, the official taxi cooperative. SETRA booths are located immediately after customs/baggage claim in the arrivals hall. Fares are fixed by zone and paid upfront at the booth — you receive a printed ticket that the driver collects. This system is secure but SETRA fares are among the most expensive airport-to-city taxi options in the Caribbean.",
      },
      {
        type: "table",
        rows: [
          {
            label: "CUN Airport → Hotel Zone Zone 1 (north)",
            value: "$35–45 USD (SETRA)",
          },
          {
            label: "CUN Airport → Hotel Zone Zone 2",
            value: "$40–50 USD (SETRA)",
          },
          {
            label: "CUN Airport → Hotel Zone Zone 3 (south)",
            value: "$48–60 USD (SETRA)",
          },
          {
            label: "CUN Airport → Downtown Cancun",
            value: "$22–30 USD (SETRA)",
          },
          {
            label: "CUN Airport → Playa del Carmen",
            value: "$65–85 USD (SETRA)",
          },
          { label: "CUN Airport → Tulum", value: "$90–130 USD (SETRA)" },
        ],
      },
      {
        type: "tip",
        body: "The ADO bus from Cancun Airport Terminal 2 costs $10–15 USD to downtown Cancun and around $16 USD to Playa del Carmen — far cheaper than SETRA for solo travellers or couples. If your hotel is in the Hotel Zone, the ADO bus drops you at the Hotel Zone terminal and you take a short taxi from there.",
      },
      { type: "h2", heading: "Uber and InDriver in Cancun" },
      {
        type: "p",
        body: "Uber officially operates in Cancun but has faced significant resistance from local taxi unions — particularly in the Hotel Zone, where taxis have lobbied to exclude rideshare apps. As of 2026, Uber pickups from the Hotel Zone can be unpredictable and drivers sometimes cancel. InDriver (bid-your-own-price rideshare) and Cabify operate with fewer restrictions in Cancun proper and downtown. From the airport, Uber is not permitted to pick up — SETRA has exclusive rights to the airport zone.",
      },
      { type: "h2", heading: "Downtown Cancun City Taxis" },
      {
        type: "p",
        body: "In downtown Cancun (Centro), taxis operate on short fixed fares rather than a strict zone grid. A typical short city ride runs $4–8 USD or 70–140 MXN. Drivers here are more willing to quote in pesos and negotiate. Always agree on the fare before getting in — meters are not used in Cancun city either.",
      },
      { type: "h2", heading: "Common Cancun Taxi Scams" },
      {
        type: "ul",
        items: [
          'Freelance airport drivers in arrivals halls offering "official" rates that are 2–3× SETRA prices — always go to the SETRA booth inside the terminal',
          'Drivers claiming the zone fare table doesn\'t apply to your hotel and quoting a higher "special" rate — ask to see the printed zone table',
          "Charging per person rather than per trip — Cancun taxis are priced per taxi, not per passenger",
          "Accepting payment in USD and giving change in pesos at an unfavourable rate — agree on currency and rate upfront",
          'Hotel Zone "transfer" desks in hotel lobbies that charge premium rates with markups — these are private concierge services, not regulated taxis',
        ],
      },
      { type: "h2", heading: "Negotiating Taxi Fares in Cancun" },
      {
        type: "p",
        body: "While zone fares are supposed to be fixed, negotiation is commonplace — especially outside the airport. It's always worth asking for the zone fare at your hotel's front desk before you need a taxi, so you have a reference point. Tipping ฿20–30 MXN (about $1 USD) for a driver who helped with luggage is appreciated but not expected.",
      },
      {
        type: "faq",
        faqs: [
          {
            q: "How much is a taxi from Cancun Airport to the Hotel Zone?",
            a: "The official SETRA cooperative taxis charge $35–60 USD depending on which part of the Hotel Zone (Zona Hotelera). You purchase a ticket at the SETRA booth before leaving arrivals. Never pay more than this or accept rides from unlicensed drivers inside the terminal.",
          },
          {
            q: "Do Cancun taxis use meters?",
            a: "No — Cancun taxis do not use meters anywhere in the city or Hotel Zone. All fares are negotiated or set by zone tables. Always agree on the fare before getting in the taxi.",
          },
          {
            q: "Is Uber available in Cancun?",
            a: "Uber operates in Cancun but is restricted in the Hotel Zone and completely banned from the airport. InDriver and Cabify are alternatives with more availability downtown. In the Hotel Zone, the zone taxi system remains dominant.",
          },
          {
            q: "What is the cheapest way from Cancun Airport to the Hotel Zone?",
            a: "The ADO bus from the airport to the Hotel Zone terminal costs $10–15 USD and is the most economical option. From the Hotel Zone ADO terminal you can take a short zone taxi to your hotel. SETRA taxis are direct but 3–4× more expensive for solo travellers.",
          },
          {
            q: "Should I tip taxi drivers in Cancun?",
            a: "It's not expected but $1–2 USD or 20–30 MXN for luggage help or a friendly ride is a polite gesture. Tipping is not a standard part of Mexican taxi culture — it's entirely optional.",
          },
        ],
      },
    ],
    references: [
      {
        label: "Cancun Airport — official ground transport information",
        url: "https://cancun-airport.com/en/transportation/taxi",
      },
    ],
  },

  // ── Tipping in Spain ────────────────────────────────────────────────────────
  {
    slug: "tipping-in-spain",
    title: "Tipping in Spain: What's Expected in 2026",
    description:
      "Tipping in Spain is optional and lower than in the US — 5–10% at restaurants, round up taxis, leave coins at tapas bars. Service charges are rare on bills. Here's what locals actually do.",
    publishedAt: "2026-08-03",
    readingMinutes: 5,
    category: "tipping",
    country: "Spain",
    countrySlug: "spain",
    content: [
      {
        type: "intro",
        body: "Tipping in Spain is genuinely optional and much lower than North American norms. Locals at tapas bars leave small coins — sometimes nothing at all. At sit-down restaurants, 5–10% for good service is generous; 15–20% would seem unusual. Service charges are rarely included on Spanish bills, so what you see is what you pay — any tip is added by you on top, in cash, left on the table. There is no social pressure to tip and no awkwardness in not doing so.",
      },
      { type: "h2", heading: "Restaurant and Tapas Bar Tipping" },
      {
        type: "p",
        body: "At a formal sit-down restaurant, 5–10% for good service is appropriate and appreciated. For a €60 dinner for two, leaving €5–6 on the table is a genuinely generous gesture by Spanish standards. At a tapas bar where you're standing and drinking, leaving the loose coins from your change (€0.50–1) is the local norm. At a tourist-facing restaurant in central Barcelona or Madrid, staff may have adapted to expect slightly more from international visitors — 10% is well-received.",
      },
      {
        type: "table",
        rows: [
          {
            label: "Sit-down restaurant (good service)",
            value: "5–10% of the bill",
          },
          {
            label: "Tapas bar (standing, eating)",
            value: "Leave coins — €0.50–2",
          },
          {
            label: "Hotel restaurant",
            value: "Check if service is included; 5–10% if not",
          },
          {
            label: "Café, coffee shop",
            value: "Not expected; round up optional",
          },
          {
            label: "Fine dining (Michelin, high-end)",
            value: "10% is a respectful gesture",
          },
          {
            label: "Food delivery (Glovo, Uber Eats)",
            value: "€1–2 in-app tip optional",
          },
        ],
      },
      { type: "h2", heading: '"Servicio Incluido" — Is Service Included?' },
      {
        type: "p",
        body: 'Spanish law does not require restaurants to include a service charge. Most bills do not include one. If you see "Servicio incluido" or "Servicio e IVA incluido" on the bill, no additional tip is expected — the stated price already covers it. This is relatively uncommon at standard restaurants but appears at some tourist-oriented venues.',
      },
      { type: "h2", heading: "Taxi Tipping in Spain" },
      {
        type: "p",
        body: "Spanish taxi drivers do not expect a percentage-based tip. Rounding up to the nearest euro or leaving the coins from a fare is the local norm. A €14.40 fare becomes €15. For a longer journey (airport transfer, etc.), €1–2 extra is a polite gesture if the driver helped with luggage. Meter taxis in Spain are fully regulated — no negotiation needed. In Barcelona and Madrid, accept only taxis with a meter running.",
      },
      { type: "h2", heading: "Hotel Tipping in Spain" },
      {
        type: "table",
        rows: [
          { label: "Porters / luggage to room", value: "€1–2 per bag" },
          { label: "Housekeeping", value: "€1–2 per day, left at end of stay" },
          {
            label: "Concierge (restaurant booking, tour help)",
            value: "€5–10 for significant assistance",
          },
          {
            label: "Room service",
            value: "Check if service charge on bill; €1–2 if not",
          },
        ],
      },
      { type: "h2", heading: "Tour Guides and Activities" },
      {
        type: "table",
        rows: [
          {
            label: "Free walking tour guide",
            value: "€5–10 per person (this is their income)",
          },
          { label: "Paid group tour guide", value: "€3–5 per person" },
          { label: "Private guide (full day)", value: "€15–25 total" },
          {
            label: "Flamenco show (restaurant/venue staff)",
            value: "Included in show price; additional tip optional",
          },
        ],
      },
      {
        type: "tip",
        body: "Free walking tours are popular in Barcelona and Madrid — guides work for tips only. For these, €10 per person is a fair benchmark for a 2-hour tour. Pay in cash directly to the guide at the end.",
      },
      { type: "h2", heading: "Barcelona vs Madrid Tipping Culture" },
      {
        type: "p",
        body: "Barcelona's more international tourist base means restaurant staff sometimes expect slightly higher tips than in Madrid or smaller Spanish cities. In the Gothic Quarter or near La Barceloneta, 10% has become more normal at tourist restaurants. In Madrid's historic tapas bars (Malasaña, La Latina), the local norm of leaving coins prevails. In rural Spain and smaller towns, tipping is minimal — leaving nothing is the local standard.",
      },
      {
        type: "faq",
        faqs: [
          {
            q: "Is tipping expected in Spain?",
            a: "No — tipping is genuinely optional in Spain. Leaving 5–10% at a sit-down restaurant for good service is appreciated but not expected. At tapas bars, leaving coins is common. Not tipping carries no social stigma.",
          },
          {
            q: "Do Spanish restaurants charge a service fee?",
            a: 'Rarely — "Servicio incluido" is unusual at most Spanish restaurants. The printed total is what you owe. Any tip is left separately in cash, on the table.',
          },
          {
            q: "Should I tip in cash in Spain?",
            a: "Yes — cash tips in Spain are the norm. Most Spanish card terminals do not have a tip prompt, and even where they do, leaving cash directly on the table is more common and more likely to reach your server.",
          },
          {
            q: "How much do I tip a tour guide in Spain?",
            a: "For paid group tours, €3–5 per person is appropriate. For free walking tours (where tips are the guide's only income), €10 per person for a 2-hour tour is fair. For private guides, €15–25 for a full day is generous.",
          },
        ],
      },
    ],
  },

  // ── Tipping in Portugal ─────────────────────────────────────────────────────
  {
    slug: "tipping-in-portugal",
    title: "Tipping in Portugal: How Much to Tip in 2026",
    description:
      "Tipping in Portugal is optional — 10% at restaurants is generous, round up in taxis. Watch out for the couvert (bread and olives brought to your table) — it's not free and will appear on your bill.",
    publishedAt: "2026-08-03",
    readingMinutes: 5,
    category: "tipping",
    country: "Portugal",
    countrySlug: "portugal",
    content: [
      {
        type: "intro",
        body: "Tipping in Portugal is optional but appreciated — the culture sits midway between the non-tipping norms of northern Europe and the higher expectations of tourist-heavy southern Europe. At sit-down restaurants, 10% for good service is generous; 5% is fine. Taxis: round up to the nearest euro. The most important thing to know before eating in Portugal is the couvert: bread, butter, olives, or cheese brought to your table without being ordered. It is not free. You are charged for whatever you eat — push it back if you don't want it.",
      },
      { type: "h2", heading: "The Couvert — What Tourists Always Ask About" },
      {
        type: "p",
        body: "In Portugal (particularly in Lisbon and Porto), restaurants routinely bring small appetisers to the table without asking: bread, butter, olives, local cheese, or pâté. This is called the couvert. The rule is simple: if you eat it, you pay for it; if you don't want it, push it aside and it will be removed and not charged. The cost is typically €1–4 per person. Complaining about the couvert after eating it is a common tourist mistake. Check if it's on your bill and factor it into your tip calculation.",
      },
      { type: "h2", heading: "Restaurant Tipping in Portugal" },
      {
        type: "table",
        rows: [
          { label: "Casual restaurant (good service)", value: "5–10%" },
          {
            label: "Tourist restaurant (Lisbon/Porto center)",
            value: "10% is a generous benchmark",
          },
          { label: "Fine dining", value: "10% for excellent service" },
          {
            label: "Taberna / tasca (traditional local)",
            value: "Round up or €2–5 — locals tip modestly",
          },
          {
            label: "Café / pastelaria",
            value: "Not expected; leave coins if you wish",
          },
          {
            label: "Fado dinner venue",
            value: "10% for food service; small tip for musicians appreciated",
          },
        ],
      },
      { type: "h2", heading: "Taxi Tipping in Portugal" },
      {
        type: "p",
        body: "Portuguese taxi drivers expect nothing beyond the metered fare, but rounding up to the nearest euro is a common courtesy. A €13.40 fare becomes €14 or €15. For airport transfers with luggage, €2–3 extra is a polite gesture. Taxis in Lisbon and Porto are metered and regulated — always insist on the meter.",
      },
      { type: "h2", heading: "Hotel Tipping" },
      {
        type: "table",
        rows: [
          { label: "Porters / luggage assistance", value: "€1–2 per bag" },
          { label: "Housekeeping", value: "€1–2 per day, left at end of stay" },
          {
            label: "Concierge (restaurant booking, advice)",
            value: "€5–10 for substantial help",
          },
        ],
      },
      { type: "h2", heading: "Tour Guides and Experiences" },
      {
        type: "table",
        rows: [
          {
            label: "Free walking tour (Lisbon, Porto, Sintra)",
            value: "€10–15 per person (guide's only income)",
          },
          { label: "Paid group tour", value: "€3–5 per person" },
          { label: "Private guide (full day)", value: "€15–25 total" },
          {
            label: "Tuk-tuk driver (Lisbon city tours)",
            value: "Negotiate price upfront; small tip (€2–5) appreciated",
          },
          {
            label: "Fado musicians (casa de fado)",
            value: "Small note (€5) in the collection is appreciated",
          },
        ],
      },
      { type: "h2", heading: "Tipping in Lisbon vs Porto vs the Algarve" },
      {
        type: "p",
        body: "Lisbon's central tourist areas (Alfama, Bairro Alto, Chiado) have adapted to international visitors and 10% is now common at tourist restaurants. Porto's Ribeira district is similar. Away from tourist hotspots and in the Algarve's more traditional restaurants, locals tip modestly — €2–5 on a €30 bill for a table of two. At village restaurants inland, tipping above leaving coins is unusual.",
      },
      {
        type: "tip",
        body: "Carry a few €1 and €2 coins in Portugal — tip prompts on card machines are not standard at most Portuguese restaurants, and cash tips on the table are the norm. Your server keeps what you leave physically at the table.",
      },
      {
        type: "faq",
        faqs: [
          {
            q: "Is tipping required in Portugal?",
            a: "No — tipping is voluntary in Portugal. Leaving 5–10% at a sit-down restaurant is appreciated; leaving nothing carries no stigma. Portuguese workers are not as tip-dependent as US hospitality staff.",
          },
          {
            q: "What is a couvert in Portugal?",
            a: "The couvert is bread, butter, olives, cheese, or other small appetisers brought to your table without being ordered. You pay for whatever you eat — typically €1–4 per person. Push it back if you don't want it and you won't be charged.",
          },
          {
            q: "Do I tip in cash or by card in Portugal?",
            a: "Cash is strongly preferred. Most Portuguese card terminals do not have a tip screen, and even where they do, leaving cash on the table is the most reliable way to ensure the tip reaches your server.",
          },
          {
            q: "How much should I tip at a Lisbon restaurant?",
            a: "10% for good service at a tourist-facing restaurant in Lisbon is generous and well-received. In a traditional tasca away from the tourist areas, €2–5 on a €25–30 bill for two is the local norm.",
          },
        ],
      },
    ],
    references: [
      {
        label: "Visit Portugal — official tourism board",
        url: "https://www.visitportugal.com/en",
      },
    ],
  },
];
