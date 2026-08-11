import { readFile } from 'node:fs/promises';

const rootUrl = new URL('../', import.meta.url);
const manifestUrl = new URL('config/shopify-catalog.json', rootUrl);
const catalogUrl = new URL('src/data/shopify.generated.json', rootUrl);
const endpoint =
  process.env.SHOPIFY_STOREFRONT_API_URL ||
  'https://www.olivestack.com/api/2026-07/graphql.json';
const groups = ['products', 'workshops', 'giftCards'];

const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
const generated = JSON.parse(await readFile(catalogUrl, 'utf8'));

const fail = (message) => {
  throw new Error(message);
};

const assert = (condition, message) => {
  if (!condition) fail(message);
};

const sortedKeys = (value) => Object.keys(value).sort();
const sameKeys = (left, right) =>
  left.length === right.length && left.every((key, index) => key === right[index]);

assert(generated.schemaVersion === 1, 'Generated Shopify catalog schemaVersion must be 1');
assert(
  typeof generated.syncedAt === 'string' && Number.isFinite(Date.parse(generated.syncedAt)),
  'Generated Shopify catalog must have a valid syncedAt timestamp',
);
assert(
  Date.parse(generated.syncedAt) <= Date.now() + 5 * 60_000,
  'Generated Shopify catalog syncedAt timestamp is in the future',
);

const records = [];
for (const group of groups) {
  assert(manifest[group] && typeof manifest[group] === 'object', `Manifest group ${group} is missing`);
  assert(
    generated[group] && typeof generated[group] === 'object',
    `Generated catalog group ${group} is missing`,
  );

  const manifestKeys = sortedKeys(manifest[group]);
  const generatedKeys = sortedKeys(generated[group]);
  assert(
    sameKeys(manifestKeys, generatedKeys),
    `${group} keys differ between config/shopify-catalog.json and generated catalog`,
  );

  for (const key of manifestKeys) {
    const definition = manifest[group][key];
    assert(
      Array.isArray(definition) && definition.length === 2,
      `${group}/${key} manifest entry must be [productId, handle]`,
    );
    const [expectedNumericId, expectedHandle] = definition;
    assert(
      expectedNumericId === null || /^\d+$/.test(expectedNumericId),
      `${group}/${key} has an invalid expected product id`,
    );
    assert(
      typeof expectedHandle === 'string' && expectedHandle.length > 0,
      `${group}/${key} has an invalid Shopify handle`,
    );

    records.push({
      group,
      key,
      expectedNumericId,
      expectedHandle,
      snapshot: generated[group][key],
    });
  }
}

const liveRecords = records.filter((record) => record.expectedNumericId !== null);
const archivedRecords = records.filter((record) => record.expectedNumericId === null);
const expectedIds = liveRecords.map(
  (record) => `gid://shopify/Product/${record.expectedNumericId}`,
);
assert(new Set(expectedIds).size === expectedIds.length, 'Manifest contains duplicate Shopify product ids');
assert(
  new Set(records.map((record) => record.expectedHandle)).size === records.length,
  'Manifest contains duplicate Shopify product handles',
);

for (const record of records) {
  const { group, key, expectedNumericId, expectedHandle, snapshot } = record;
  const label = `${group}/${key}`;
  assert(snapshot && typeof snapshot === 'object', `${label} is missing from generated catalog`);
  assert(snapshot.handle === expectedHandle, `${label} generated handle differs from the manifest`);
  assert(typeof snapshot.title === 'string' && snapshot.title.length > 0, `${label} has no title`);
  assert(typeof snapshot.url === 'string', `${label} has no product URL`);
  assert(typeof snapshot.available === 'boolean', `${label} has invalid product availability`);
  assert(typeof snapshot.archived === 'boolean', `${label} has invalid archived state`);
  assert(Array.isArray(snapshot.variants), `${label} variants must be an array`);

  if (expectedNumericId === null) {
    assert(snapshot.id === null, `${label} is archived but retains a generated product id`);
    assert(snapshot.archived === true, `${label} must be marked archived`);
    assert(snapshot.available === false, `${label} archived product cannot be available`);
    assert(snapshot.variants.length === 0, `${label} archived product cannot retain variants`);
    continue;
  }

  const expectedId = `gid://shopify/Product/${expectedNumericId}`;
  assert(snapshot.id === expectedId, `${label} generated id differs from the manifest`);
  assert(snapshot.archived === false, `${label} live product is incorrectly marked archived`);
  assert(snapshot.variants.length > 0, `${label} has no generated variants`);
  assert(
    new Set(snapshot.variants.map((variant) => variant.id)).size === snapshot.variants.length,
    `${label} contains duplicate generated variant ids`,
  );

  const productUrl = new URL(snapshot.url);
  assert(productUrl.protocol === 'https:', `${label} product URL must use HTTPS`);
  assert(
    productUrl.hostname === 'www.olivestack.com',
    `${label} product URL must point to www.olivestack.com`,
  );

  for (const variant of snapshot.variants) {
    assert(
      /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(variant.id),
      `${label} has an invalid generated variant id`,
    );
    assert(typeof variant.title === 'string' && variant.title.length > 0, `${label} variant has no title`);
    assert(
      typeof variant.price === 'number' && Number.isFinite(variant.price) && variant.price >= 0,
      `${label} variant has an invalid generated price`,
    );
    assert(typeof variant.available === 'boolean', `${label} variant has invalid availability`);
  }
}

const productQuery = `
  query VerifyCatalogProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      __typename
      ... on Product {
        id
        handle
        title
        availableForSale
        onlineStoreUrl
        variants(first: 100) {
          nodes {
            id
            title
            availableForSale
            price { amount currencyCode }
          }
        }
      }
    }
  }
`;

const request = async (query, variables) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(30_000),
  });

  assert(response.ok, `Shopify Storefront API returned HTTP ${response.status}`);
  const payload = await response.json();
  if (payload.errors?.length) {
    fail(`Shopify GraphQL error: ${payload.errors.map((error) => error.message).join('; ')}`);
  }
  assert(payload.data && typeof payload.data === 'object', 'Shopify returned no GraphQL data');
  return payload.data;
};

const liveById = new Map();
for (let index = 0; index < expectedIds.length; index += 25) {
  const ids = expectedIds.slice(index, index + 25);
  const data = await request(productQuery, { ids });
  assert(Array.isArray(data.nodes) && data.nodes.length === ids.length, 'Shopify nodes response is incomplete');
  for (let offset = 0; offset < ids.length; offset += 1) {
    const product = data.nodes[offset];
    const expectedId = ids[offset];
    assert(product !== null, `${expectedId} is no longer published to the Storefront API`);
    assert(product.__typename === 'Product', `${expectedId} no longer resolves to a Shopify Product`);
    assert(product.id === expectedId, `Shopify nodes response did not preserve requested id order`);
    liveById.set(product.id, product);
  }
}

const compareVariants = (record, liveProduct) => {
  const label = `${record.group}/${record.key}`;
  const generatedById = new Map(
    record.snapshot.variants.map((variant) => [variant.id, variant]),
  );
  const liveVariants = liveProduct.variants?.nodes;
  assert(Array.isArray(liveVariants), `${label} returned no live variants`);
  assert(
    generatedById.size === liveVariants.length,
    `${label} variant count changed (generated ${generatedById.size}, live ${liveVariants.length})`,
  );

  for (const liveVariant of liveVariants) {
    const snapshotVariant = generatedById.get(liveVariant.id);
    assert(snapshotVariant, `${label} has a new or changed live variant ${liveVariant.id}`);
    assert(snapshotVariant.title === liveVariant.title, `${label}/${liveVariant.id} title changed`);
    assert(
      snapshotVariant.available === liveVariant.availableForSale,
      `${label}/${liveVariant.id} availability changed`,
    );
    assert(
      liveVariant.price?.currencyCode === 'EUR',
      `${label}/${liveVariant.id} is no longer priced in EUR`,
    );
    const livePrice = Number(liveVariant.price.amount);
    assert(Number.isFinite(livePrice), `${label}/${liveVariant.id} returned an invalid price`);
    assert(snapshotVariant.price === livePrice, `${label}/${liveVariant.id} price changed`);
  }
};

for (const record of liveRecords) {
  const label = `${record.group}/${record.key}`;
  const liveProduct = liveById.get(record.snapshot.id);
  assert(liveProduct, `${label} was not returned by Shopify`);
  assert(liveProduct.handle === record.expectedHandle, `${label} live handle changed`);
  assert(liveProduct.title === record.snapshot.title, `${label} live title changed`);
  assert(
    liveProduct.availableForSale === record.snapshot.available,
    `${label} live availability changed`,
  );
  assert(liveProduct.onlineStoreUrl === record.snapshot.url, `${label} online store URL changed`);
  compareVariants(record, liveProduct);
}

if (archivedRecords.length > 0) {
  const selections = archivedRecords
    .map(
      (record, index) =>
        `archived${index}: product(handle: ${JSON.stringify(record.expectedHandle)}) { id handle }`,
    )
    .join('\n');
  const data = await request(`query VerifyArchivedProducts { ${selections} }`, {});
  for (let index = 0; index < archivedRecords.length; index += 1) {
    const record = archivedRecords[index];
    assert(
      data[`archived${index}`] === null,
      `${record.group}/${record.key} is published again but remains marked archived`,
    );
  }
}

const availableProducts = liveRecords.filter((record) => record.snapshot.available).length;
const availableVariants = liveRecords.reduce(
  (count, record) => count + record.snapshot.variants.filter((variant) => variant.available).length,
  0,
);

process.stdout.write(
  `Verified ${records.length} Shopify records (${liveRecords.length} live, ${archivedRecords.length} archived), ` +
    `${availableProducts} available products and ${availableVariants} available variants.\n`,
);
