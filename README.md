# Olive Stack Gallery — Site Redesign

Implementation of the **Olive Stack Site** design (`Olive Stack Site.dc.html` from the
claude.ai/design project “Новый дизайн Olivestack”): a warm cream/olive editorial
storefront for the Olive Stack Gallery in Listowel, Co. Kerry.

## Stack

- Vite + React 19 + TypeScript
- No router dependency — a small hash router (`src/lib/routes.ts`) keeps every page
  shareable by URL (`#/collection/prints`, `#/product/landscapes/beenconeen-beckons`, …)
- CSS design tokens in `src/styles/tokens.css`; component/page styles live next to
  their components
- Vitest unit tests for the logic modules (cart reducer, search, routes, slugs, data)

## Pages

Home · Collections (landscapes, spaces & places, prints, pendants + live-site
fallbacks) · Product · Gift cards · Arts Week · Workshops · Sponsors · Residency ·
Residency information · Testimonials · Photo gallery · Contact — plus the search
overlay and cart drawer.

Checkout is a demo (the button flips to “DEMO · CHECKOUT ON LIVE SITE”); images are
served from the live olivestack.com Shopify CDN.

## Commands

```bash
npm run dev       # dev server
npm run build     # type-check + production build
npm run preview   # serve the production build
npm test          # vitest run
```
