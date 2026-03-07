# Prompt: Taxi Scam Warnings & City Advice

## Purpose
Generate city-specific taxi scam warnings and safety information for travellers.

## Input variables
- `{city}` — e.g. "Bangkok"
- `{country}` — e.g. "Thailand"

## Output contract (JSON)
```json
{
  "scamWarnings": [
    "Drivers claim meter is broken — insist or leave",
    "Long routes via toll roads — know your route before boarding",
    "Unlicensed touts at airport — use official taxi counter only"
  ],
  "tipping": {
    "isExpected": false,
    "recommendation": "Round up fare to nearest 5฿"
  },
  "confirmationPhrase": {
    "localLanguage": "ใช้มิเตอร์ได้ไหมครับ",
    "transliteration": "Chai meetuh dai mai krap",
    "english": "Can you use the meter please?"
  }
}
```

## Design principles
- Warnings must be **city-specific** — never generic
- Maximum 3 warnings, each under 15 words
- Calm, factual tone — this is safety info, not fear-mongering
- Confirmation phrase should be practical and commonly understood
