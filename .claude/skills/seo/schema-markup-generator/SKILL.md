---
description: >
  Generate valid, paste-ready JSON-LD structured data for a page: Article, Product,
  FAQPage, LocalBusiness, HowTo, or Organization. Use when the user says "schema
  markup", "JSON-LD", "structured data", or "rich results markup". Not for on-page
  content audits (use on-page-seo-audit) or sitemap work.
user-invocable: true
version: 2.1.0
arguments:
  - name: page
    description: the page URL or description and the schema type wanted
paths:
  - "**/*.jsonld"
---

# Schema Markup Generator

The output is the JSON-LD block itself, valid JSON that parses, with @context and
@type set, ready to paste into a script tag. Never emit pseudo-JSON or bracketed
stand-ins; ask for missing required fields instead.

## Procedure

1. Identify the page type and pick the schema.org type. If two fit (Article vs
   BlogPosting), pick the more specific and say why in one line.
2. Collect required properties for that type from the user or the page content.
   Required minimums: Article needs headline, datePublished, author; Product needs
   name, offers with price and priceCurrency; FAQPage needs 2+ Question/Answer
   pairs; LocalBusiness needs name, address, telephone.
3. Emit one fenced json block wrapped for a script tag, then validate mentally:
   valid JSON, ISO 8601 dates, absolute URLs, no empty strings.
4. Flag any property you inferred rather than were told, so the user can correct
   it before publishing.

## Worked example (fictional business)

Request: LocalBusiness markup for "Harbor Lane Coffee", 12 Harbor Lane, Brighton.

```json
{
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "name": "Harbor Lane Coffee",
  "url": "https://harborlanecoffee.example.com",
  "telephone": "+44-1273-555-0142",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "12 Harbor Lane",
    "addressLocality": "Brighton",
    "postalCode": "BN1 1AA",
    "addressCountry": "GB"
  },
  "openingHours": "Mo-Sa 07:30-17:00",
  "priceRange": "££"
}
```

Inferred, please confirm: the URL and opening hours are examples; replace with the
real values before deploying.

## Output contract

Deliver: the chosen @type with a one-line justification, one fenced json block that
parses as strict JSON with @context and @type present, an "inferred, please confirm"
list for any assumed value, and the exact placement instruction (inside
`<script type="application/ld+json">` in the page head). Validate before returning:
no trailing commas, no comments inside the JSON.
