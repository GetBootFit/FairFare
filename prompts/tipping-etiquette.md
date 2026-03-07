# Prompt: Tipping Etiquette Guide

## Purpose
Generate a complete tipping guide for a country across 6 service scenarios.

## Input variables
- `{country}` — e.g. "Japan"

## Output contract (JSON)
```json
{
  "country": "Japan",
  "currency": "JPY",
  "currencySymbol": "¥",
  "scenarios": {
    "restaurant": {
      "isExpected": false,
      "rating": "avoid",
      "percentageMin": null,
      "percentageMax": null,
      "typicalAmount": null,
      "notes": "Tipping can be considered rude — it implies the price was unfair."
    },
    "taxi": { ... },
    "hotel_porter": { ... },
    "bar": { ... },
    "tour_guide": { ... },
    "delivery": { ... }
  }
}
```

## Rating definitions
| Rating | Meaning |
|--------|---------|
| `expected` | Not tipping is considered rude or offensive |
| `appreciated` | Welcomed and common, but not required |
| `optional` | Uncommon; never inappropriate |
| `avoid` | Tipping can cause offence or confusion |

## Design principles
- One sentence per `notes` field, under 20 words
- Use `typicalAmount` for porter/delivery (per-bag or per-item amounts)
- Use `percentageMin` / `percentageMax` for restaurant, bar, tour guide
- Accuracy over generosity — report what is actually practised, not what tourists assume
