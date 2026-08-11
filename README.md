# Olive Stack Gallery

Static, prerendered React storefront for Olive Stack Gallery in Listowel, County Kerry. The public GitHub Pages build is a non-indexable redesign preview; Shopify remains the source of truth for catalogue availability, contact/newsletter forms and secure checkout.

## Architecture

- Vite, React 19 and TypeScript.
- Clean pathname routes with prerendered HTML for every collection, product and content page.
- Unique canonical metadata, Open Graph/Twitter cards and JSON-LD for the gallery, breadcrumbs, products, offers and events.
- Self-hosted Archivo and Instrument Serif fonts plus responsive Shopify CDN image sources.
- Accessible mobile disclosures, search/cart dialogs, focus management, skip navigation and persistent local cart state.

Catalogue identity is explicit in `config/shopify-catalog.json`; product titles are never used as identifiers. Before each build, `scripts/sync-shopify-catalog.mjs` reads the tokenless Shopify Storefront API and writes the validated snapshot in `src/data/shopify.generated.json`. The build stops if a product ID, handle, currency or required record no longer matches.

At checkout, the browser revalidates every variant and its EUR price with Shopify, calls `cartCreate`, then redirects only to Shopify’s returned HTTPS `checkoutUrl`. No Shopify token or other secret is shipped to the browser. Contact and newsletter actions hand off to Shopify-hosted forms so the store’s hCaptcha protection remains intact.

## Commands

```bash
npm ci
npm test                  # unit tests
npm run sync:shopify      # refresh and validate the build-time catalogue
npm run build             # typecheck, client/SSR builds and 74-route prerender
npm run check:dist        # verify HTML, metadata, schema, links, robots and sitemap
npm run test:integration  # read-only live Shopify catalogue verification
npm run preview           # serve the built preview
```

`npm run test:integration` performs read-only GraphQL queries. It does not create carts, orders, customers or messages.

## Deployment modes

The default GitHub Pages preview uses:

```bash
BASE_PATH=/olive-stack-site/ \
VITE_SITE_URL=https://kinopoint.github.io/olive-stack-site \
VITE_INDEXABLE=false \
npm run build
```

It emits `noindex, nofollow` metadata and a blocking `robots.txt`. The deploy workflow publishes the verified `dist/` directory to `gh-pages` after changes to `main` and on a daily catalogue refresh.

For an indexable root-domain build:

```bash
BASE_PATH=/ \
VITE_SITE_URL=https://www.olivestack.com \
VITE_INDEXABLE=true \
EXPECT_INDEXABLE=true \
npm run build && npm run check:dist
```

Do not enable indexation for the GitHub preview while the Shopify storefront remains canonical. The Storefront API version is pinned to `2026-07` in the sync, integration and checkout modules and should be reviewed as part of Shopify’s regular API-version maintenance.
