import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const rootDir = process.cwd();
const distDir = resolve(rootDir, process.argv[2] || 'dist');
const serverEntryPath = resolve(rootDir, 'dist-ssr/entry-server.js');
const catalogPath = resolve(rootDir, 'src/data/shopify.generated.json');
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
const errors = [];

const report = (condition, message) => {
  if (!condition) errors.push(message);
  return condition;
};

const decodeEntities = (value) =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');

const parseAttributes = (source) => {
  const attributes = {};
  const expression = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of source.matchAll(expression)) {
    attributes[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attributes;
};

const tags = (html, tagName) => {
  const expression = new RegExp(`<${tagName}\\b([^>]*)>`, 'gi');
  return [...html.matchAll(expression)].map((match) => parseAttributes(match[1]));
};

const metadataValue = (html, selector, value, label) => {
  const matches = tags(html, 'meta').filter(
    (attributes) => attributes[selector]?.toLowerCase() === value.toLowerCase(),
  );
  report(matches.length === 1, `${label} must contain exactly one meta ${selector}="${value}"`);
  const content = matches[0]?.content?.trim() || '';
  report(content.length > 0, `${label} meta ${selector}="${value}" has empty content`);
  return content;
};

if (!existsSync(serverEntryPath)) {
  throw new Error(`SSR route manifest is missing: ${serverEntryPath}`);
}
const { prerenderRoutes, routePathname } = await import(pathToFileURL(serverEntryPath).href);
const routeSuffixes = prerenderRoutes().map(routePathname);

report(
  routeSuffixes.length === new Set(routeSuffixes).size,
  'Derived static route list contains duplicate paths',
);
for (const key of Object.keys(catalog.products)) {
  report(
    /^[^/]+\/[^/]+$/.test(key),
    `Generated Shopify product key cannot map to a static route: ${key}`,
  );
  report(
    routeSuffixes.includes(`/product/${key}/`),
    `Shopify-backed product is absent from the static route manifest: ${key}`,
  );
}

const htmlPathForRoute = (route) =>
  route === '/' ? resolve(distDir, 'index.html') : resolve(distDir, route.slice(1), 'index.html');

const readRequiredFile = async (path, label) => {
  if (!report(existsSync(path), `${label} is missing: ${path}`)) return '';
  const fileStat = await stat(path);
  report(fileStat.isFile() && fileStat.size > 0, `${label} is empty or not a regular file: ${path}`);
  return readFile(path, 'utf8');
};

const pageInputs = await Promise.all(
  routeSuffixes.map(async (route) => ({
    route,
    filePath: htmlPathForRoute(route),
    html: await readRequiredFile(htmlPathForRoute(route), `Prerendered route ${route}`),
    is404: false,
  })),
);

for (const filePath of [resolve(distDir, '404.html'), resolve(distDir, '404', 'index.html')]) {
  pageInputs.push({
    route: '/404/',
    filePath,
    html: await readRequiredFile(filePath, 'Prerendered 404 page'),
    is404: true,
  });
}

const pageData = [];
for (const page of pageInputs) {
  const { route, filePath, html, is404 } = page;
  const label = `${route} (${filePath})`;
  if (!html) continue;

  report(/<html\b[^>]*\blang=["']en["']/i.test(html), `${label} must declare lang="en"`);
  report(/<main\b/i.test(html), `${label} has no semantic main element`);
  report(/<h1\b/i.test(html), `${label} has no h1`);
  report(
    /<div\b[^>]*\bid=["']root["'][^>]*>\s*\S/i.test(html),
    `${label} root is empty; the route was not server-rendered`,
  );
  report(!/(?:href|action)\s*=\s*["'][^"']*#\//i.test(html), `${label} contains a legacy hash route`);
  report(!/<head\b[^>]*>[\s\S]*?\b(?:undefined|null)\b[\s\S]*?<\/head>/i.test(html), `${label} head contains an unresolved value`);

  const titleMatches = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  report(titleMatches.length === 1, `${label} must contain exactly one title`);
  const title = decodeEntities(titleMatches[0]?.[1]?.replace(/<[^>]+>/g, '').trim() || '');
  report(title.length > 0, `${label} title is empty`);

  const description = metadataValue(html, 'name', 'description', label);
  const robots = metadataValue(html, 'name', 'robots', label).toLowerCase();
  const canonicalTags = tags(html, 'link').filter((attributes) =>
    attributes.rel?.toLowerCase().split(/\s+/).includes('canonical'),
  );
  report(canonicalTags.length === 1, `${label} must contain exactly one canonical link`);
  const canonical = canonicalTags[0]?.href?.trim() || '';
  report(canonical.length > 0, `${label} canonical URL is empty`);

  let canonicalUrl = null;
  if (canonical) {
    canonicalUrl = new URL(canonical);
    report(canonicalUrl.protocol === 'https:', `${label} canonical must use HTTPS`);
    report(!canonicalUrl.search && !canonicalUrl.hash, `${label} canonical cannot contain query or hash`);
    report(canonicalUrl.pathname.endsWith('/'), `${label} canonical must have a trailing slash`);
  }

  const ogTitle = metadataValue(html, 'property', 'og:title', label);
  const ogDescription = metadataValue(html, 'property', 'og:description', label);
  const ogUrl = metadataValue(html, 'property', 'og:url', label);
  const ogImage = metadataValue(html, 'property', 'og:image', label);
  const ogType = metadataValue(html, 'property', 'og:type', label);
  const twitterCard = metadataValue(html, 'name', 'twitter:card', label);
  const twitterTitle = metadataValue(html, 'name', 'twitter:title', label);
  const twitterDescription = metadataValue(html, 'name', 'twitter:description', label);
  const twitterImage = metadataValue(html, 'name', 'twitter:image', label);

  report(ogTitle === title, `${label} og:title differs from title`);
  report(ogDescription === description, `${label} og:description differs from description`);
  report(ogUrl === canonical, `${label} og:url differs from canonical`);
  report(['website', 'product'].includes(ogType), `${label} has unsupported og:type ${ogType}`);
  report(twitterCard === 'summary_large_image', `${label} must use twitter:card summary_large_image`);
  report(twitterTitle === title, `${label} twitter:title differs from title`);
  report(twitterDescription === description, `${label} twitter:description differs from description`);
  report(twitterImage === ogImage, `${label} Twitter and Open Graph images differ`);
  for (const [kind, image] of [
    ['Open Graph', ogImage],
    ['Twitter', twitterImage],
  ]) {
    if (image) {
      const imageUrl = new URL(image);
      report(imageUrl.protocol === 'https:', `${label} ${kind} image must use HTTPS`);
    }
  }

  const structuredScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(
    (match) => {
      const attributes = parseAttributes(match[1]);
      return attributes.id === 'structured-data' && attributes.type === 'application/ld+json';
    },
  );
  report(
    structuredScripts.length === 1,
    `${label} must contain exactly one script#structured-data[type="application/ld+json"]`,
  );
  let structuredData = null;
  if (structuredScripts.length === 1) {
    structuredData = JSON.parse(structuredScripts[0][2]);
    report(
      structuredData['@context'] === 'https://schema.org',
      `${label} structured data has the wrong @context`,
    );
    report(
      Array.isArray(structuredData['@graph']) && structuredData['@graph'].length > 0,
      `${label} structured data must contain a non-empty @graph`,
    );
    for (const [index, node] of (structuredData['@graph'] || []).entries()) {
      report(node && typeof node === 'object', `${label} schema node ${index} is not an object`);
      report(node?.['@type'], `${label} schema node ${index} has no @type`);
    }
    report(!JSON.stringify(structuredData).includes('#/'), `${label} schema contains a hash route`);
  }

  if (route.startsWith('/product/') && structuredData) {
    const productSchema = structuredData['@graph'].find((node) => {
      const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      return types.includes('Product');
    });
    report(productSchema, `${label} product page has no Product schema`);
    report(productSchema?.name, `${label} Product schema has no name`);
    report(productSchema?.image, `${label} Product schema has no image`);
    report(productSchema?.offers, `${label} Product schema has no offers`);
    if (productSchema?.offers) {
      const offers = Array.isArray(productSchema.offers) ? productSchema.offers : [productSchema.offers];
      report(offers.length > 0, `${label} Product schema offers are empty`);
      for (const offer of offers) {
        report(offer.priceCurrency === 'EUR', `${label} Product offer is not priced in EUR`);
        report(Number.isFinite(Number(offer.price)), `${label} Product offer has an invalid price`);
        report(
          typeof offer.availability === 'string' && offer.availability.startsWith('https://schema.org/'),
          `${label} Product offer has invalid availability`,
        );
      }
    }
  }

  pageData.push({
    ...page,
    title,
    description,
    robots,
    canonical,
    canonicalUrl,
    structuredData,
  });
}

const staticPages = pageData.filter((page) => !page.is404);
const homePage = staticPages.find((page) => page.route === '/');
if (!report(homePage?.canonicalUrl, 'Home page has no valid canonical URL')) {
  throw new Error(errors.join('\n'));
}

const siteUrl = homePage.canonicalUrl;
const basePath = siteUrl.pathname.endsWith('/') ? siteUrl.pathname : `${siteUrl.pathname}/`;
const expectedIndexable =
  process.env.EXPECT_INDEXABLE === undefined
    ? siteUrl.hostname === 'www.olivestack.com'
    : process.env.EXPECT_INDEXABLE === 'true';

if (process.env.EXPECT_INDEXABLE !== undefined) {
  report(
    ['true', 'false'].includes(process.env.EXPECT_INDEXABLE),
    'EXPECT_INDEXABLE must be exactly true or false',
  );
}

for (const page of pageData) {
  if (!page.canonicalUrl) continue;
  const expectedCanonical = new URL(page.route.slice(1), siteUrl).href;
  report(
    page.canonical === expectedCanonical,
    `${page.route} canonical mismatch: expected ${expectedCanonical}, found ${page.canonical}`,
  );
  if (page.is404 || !expectedIndexable) {
    report(
      page.robots.includes('noindex') && page.robots.includes('nofollow'),
      `${page.route} must be noindex, nofollow`,
    );
  } else {
    report(
      page.robots.includes('index') &&
        page.robots.includes('follow') &&
        !page.robots.includes('noindex') &&
        !page.robots.includes('nofollow'),
      `${page.route} must be index, follow`,
    );
  }
}

for (const [field, values] of [
  ['title', staticPages.map((page) => page.title)],
  ['description', staticPages.map((page) => page.description)],
  ['canonical', staticPages.map((page) => page.canonical)],
]) {
  report(
    new Set(values).size === staticPages.length,
    `Static routes do not have unique ${field} values`,
  );
}

const pageByCanonicalPath = new Map(
  staticPages.map((page) => [page.canonicalUrl?.pathname, page]),
);
const knownShopifyHandoffs = [
  '/products/',
  '/pages/',
  '/account',
  '/customer_authentication/',
  '/collections/',
  '/policies/',
  '/cdn/',
];

const destinationForInternalPath = (pathname) => {
  if (!pathname.startsWith(basePath)) return null;
  const relative = pathname.slice(basePath.length);
  if (!relative) return resolve(distDir, 'index.html');
  return resolve(distDir, decodeURIComponent(relative));
};

for (const page of pageData) {
  if (!page.canonicalUrl) continue;
  const ids = new Set(
    [...page.html.matchAll(/\bid\s*=\s*(?:"([^"]+)"|'([^']+)')/gi)].map(
      (match) => match[1] || match[2],
    ),
  );
  const referenceTags = [...page.html.matchAll(/<(a|link|script|img|source)\b([^>]*)>/gi)];

  for (const match of referenceTags) {
    const tagName = match[1].toLowerCase();
    const attributes = parseAttributes(match[2]);
    const references = [];
    if (attributes.href) references.push(['href', attributes.href]);
    if (attributes.src) references.push(['src', attributes.src]);
    if (attributes.srcset) {
      for (const candidate of attributes.srcset.split(',')) {
        const source = candidate.trim().split(/\s+/)[0];
        if (source) references.push(['srcset', source]);
      }
    }

    for (const [attribute, reference] of references) {
      report(!/^javascript:/i.test(reference), `${page.route} contains a javascript: URL`);
      if (/^(?:mailto|tel|sms|data):/i.test(reference)) continue;
      if (reference.startsWith('#')) {
        const fragment = decodeURIComponent(reference.slice(1));
        report(fragment.length > 0, `${page.route} contains an empty hash href`);
        report(ids.has(fragment), `${page.route} links to missing local fragment #${fragment}`);
        continue;
      }

      const target = new URL(reference, page.canonical);
      if (target.protocol !== 'http:' && target.protocol !== 'https:') continue;
      if (target.origin !== siteUrl.origin) continue;
      if (
        siteUrl.hostname === 'www.olivestack.com' &&
        knownShopifyHandoffs.some((prefix) => target.pathname.startsWith(prefix))
      ) {
        continue;
      }

      report(
        target.pathname.startsWith(basePath),
        `${page.route} ${tagName}[${attribute}] escapes the deployed base path: ${reference}`,
      );
      if (!target.pathname.startsWith(basePath)) continue;

      const routeTarget = pageByCanonicalPath.get(target.pathname);
      if (routeTarget) {
        report(
          target.pathname === basePath || target.pathname.endsWith('/'),
          `${page.route} internal route lacks a trailing slash: ${reference}`,
        );
        if (target.hash) {
          const targetIds = new Set(
            [...routeTarget.html.matchAll(/\bid\s*=\s*(?:"([^"]+)"|'([^']+)')/gi)].map(
              (idMatch) => idMatch[1] || idMatch[2],
            ),
          );
          const fragment = decodeURIComponent(target.hash.slice(1));
          report(
            targetIds.has(fragment),
            `${page.route} links to missing fragment ${target.pathname}${target.hash}`,
          );
        }
        continue;
      }

      const destination = destinationForInternalPath(target.pathname);
      if (!destination) continue;
      const resolvedDestination = target.pathname.endsWith('/')
        ? resolve(destination, 'index.html')
        : destination;
      report(
        existsSync(resolvedDestination),
        `${page.route} references missing internal file ${target.pathname}`,
      );
    }

    if (tagName === 'a' && attributes.target === '_blank') {
      const rel = new Set((attributes.rel || '').toLowerCase().split(/\s+/));
      report(
        rel.has('noopener') || rel.has('noreferrer'),
        `${page.route} target="_blank" link must use rel="noopener" or rel="noreferrer"`,
      );
    }
  }
}

const robotsPath = resolve(distDir, 'robots.txt');
const sitemapPath = resolve(distDir, 'sitemap.xml');
const robotsText = await readRequiredFile(robotsPath, 'robots.txt');
const sitemapText = await readRequiredFile(sitemapPath, 'sitemap.xml');

report(/^User-agent:\s*\*\s*$/im.test(robotsText), 'robots.txt has no User-agent: * group');
if (expectedIndexable) {
  report(/^Allow:\s*\/\s*$/im.test(robotsText), 'Production robots.txt must contain Allow: /');
  report(!/^Disallow:\s*\/\s*$/im.test(robotsText), 'Production robots.txt blocks the whole site');
} else {
  report(/^Disallow:\s*\/\s*$/im.test(robotsText), 'Preview robots.txt must contain Disallow: /');
}

const expectedSitemapUrl = new URL('sitemap.xml', siteUrl).href;
const robotsSitemaps = [...robotsText.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map((match) => match[1]);
if (expectedIndexable) {
  report(
    robotsSitemaps.length === 1 && robotsSitemaps[0] === expectedSitemapUrl,
    `Production robots.txt must reference ${expectedSitemapUrl}`,
  );
} else if (robotsSitemaps.length > 0) {
  report(
    robotsSitemaps.length === 1 && robotsSitemaps[0] === expectedSitemapUrl,
    `robots.txt contains an unexpected sitemap URL`,
  );
}

report(/^<\?xml\b/i.test(sitemapText.trim()), 'sitemap.xml has no XML declaration');
report(/<urlset\b[^>]*xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/i.test(sitemapText), 'sitemap.xml has an invalid urlset namespace');
const sitemapLocations = [...sitemapText.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) =>
  decodeEntities(match[1].trim()),
);
const expectedLocations = staticPages.map((page) => page.canonical).sort();
report(
  new Set(sitemapLocations).size === sitemapLocations.length,
  'sitemap.xml contains duplicate locations',
);
report(
  JSON.stringify([...sitemapLocations].sort()) === JSON.stringify(expectedLocations),
  `sitemap.xml locations do not match all ${staticPages.length} static route canonicals`,
);
report(!sitemapLocations.some((location) => /\/404\/$/.test(location)), 'sitemap.xml includes the 404 page');

for (const match of sitemapText.matchAll(/<lastmod>([\s\S]*?)<\/lastmod>/gi)) {
  report(Number.isFinite(Date.parse(match[1].trim())), `sitemap.xml has invalid lastmod ${match[1]}`);
}

if (errors.length > 0) {
  process.stderr.write(`Distribution verification failed with ${errors.length} issue(s):\n`);
  for (const error of errors) process.stderr.write(`- ${error}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    `Verified ${staticPages.length} prerendered routes, 2 not-found documents, unique metadata, ` +
      `structured data, internal references, robots.txt and sitemap.xml (${expectedIndexable ? 'indexable' : 'noindex'}).\n`,
  );
}
