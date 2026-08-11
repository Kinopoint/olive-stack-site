import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const rootUrl = new URL('../', import.meta.url);
const manifestUrl = new URL('config/shopify-catalog.json', rootUrl);
const outputUrl = new URL('src/data/shopify.generated.json', rootUrl);
const endpoint =
  process.env.SHOPIFY_STOREFRONT_API_URL ||
  'https://www.olivestack.com/api/2026-07/graphql.json';

const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
const entries = Object.entries(manifest).flatMap(([group, records]) =>
  Object.entries(records).map(([key, [expectedProductId, handle]]) => ({
    group,
    key,
    expectedProductId,
    handle,
  })),
);

const queryBatch = async (batch) => {
  const selections = batch
    .map(
      ({ handle }, index) => `
        p${index}: product(handle: ${JSON.stringify(handle)}) {
          id
          handle
          title
          availableForSale
          onlineStoreUrl
          variants(first: 20) {
            nodes {
              id
              title
              availableForSale
              price { amount currencyCode }
            }
          }
        }`,
    )
    .join('\n');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `query CatalogSync { ${selections} }` }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`Shopify catalog request failed with HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${payload.errors.map((error) => error.message).join('; ')}`);
  }

  return batch.map((entry, index) => ({ entry, product: payload.data[`p${index}`] }));
};

const batches = [];
for (let index = 0; index < entries.length; index += 20) {
  batches.push(entries.slice(index, index + 20));
}

const results = (await Promise.all(batches.map(queryBatch))).flat();
const catalog = { schemaVersion: 1, products: {}, workshops: {}, giftCards: {} };

for (const { entry, product } of results) {
  if (entry.expectedProductId === null) {
    if (product !== null) {
      throw new Error(
        `${entry.group}/${entry.key} was intentionally archived but Shopify returned ${product.id}`,
      );
    }
    catalog[entry.group][entry.key] = {
      id: null,
      handle: entry.handle,
      title: entry.key,
      url: `https://www.olivestack.com/products/${encodeURIComponent(entry.handle)}`,
      available: false,
      archived: true,
      variants: [],
    };
    continue;
  }

  if (!product) {
    throw new Error(`${entry.group}/${entry.key} is missing from Shopify (${entry.handle})`);
  }

  const actualProductId = product.id.split('/').at(-1);
  if (actualProductId !== entry.expectedProductId) {
    throw new Error(
      `${entry.group}/${entry.key} expected product ${entry.expectedProductId}, received ${product.id}`,
    );
  }
  if (product.handle !== entry.handle) {
    throw new Error(
      `${entry.group}/${entry.key} expected handle ${entry.handle}, received ${product.handle}`,
    );
  }
  if (!product.variants.nodes.length) {
    throw new Error(`${entry.group}/${entry.key} has no Shopify variants`);
  }

  const variants = product.variants.nodes.map((variant) => {
    const price = Number(variant.price.amount);
    if (!Number.isFinite(price) || variant.price.currencyCode !== 'EUR') {
      throw new Error(`${entry.group}/${entry.key} has an invalid EUR price`);
    }
    return {
      id: variant.id,
      title: variant.title,
      price,
      available: variant.availableForSale,
    };
  });

  catalog[entry.group][entry.key] = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    url: product.onlineStoreUrl,
    available: product.availableForSale,
    archived: false,
    variants,
  };
}

const previous = existsSync(fileURLToPath(outputUrl))
  ? JSON.parse(await readFile(outputUrl, 'utf8'))
  : null;
const previousCatalog = previous ? { ...previous, syncedAt: undefined } : null;
const unchanged = JSON.stringify(previousCatalog) === JSON.stringify({ ...catalog, syncedAt: undefined });

if (unchanged) {
  process.stdout.write(`Shopify catalog is current (${entries.length} records).\n`);
} else {
  await writeFile(
    outputUrl,
    `${JSON.stringify({ ...catalog, syncedAt: new Date().toISOString() }, null, 2)}\n`,
  );
  process.stdout.write(`Updated ${fileURLToPath(outputUrl)} (${entries.length} records).\n`);
}
