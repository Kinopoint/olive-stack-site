import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = resolve(projectRoot, 'dist');
const serverEntryUrl = pathToFileURL(resolve(projectRoot, 'dist-ssr/entry-server.js')).href;
const { prerenderRoutes, renderRoute, routePathname, siteConfig } = await import(serverEntryUrl);

const template = await readFile(resolve(distDirectory, 'index.html'), 'utf8');
const headPattern = /\s*<!--app-head-start-->[\s\S]*?<!--app-head-end-->/;

if (!headPattern.test(template) || !template.includes('<!--app-html-->')) {
  throw new Error('The Vite HTML template is missing prerender insertion markers.');
}

const renderDocument = (route) => {
  const { appHtml, headHtml } = renderRoute(route);
  return template
    .replace(headPattern, `\n    ${headHtml}`)
    .replace('<!--app-html-->', appHtml);
};

const routes = prerenderRoutes();
for (const route of routes) {
  const pathname = routePathname(route);
  const outputPath =
    pathname === '/'
      ? resolve(distDirectory, 'index.html')
      : resolve(distDirectory, pathname.replace(/^\/+|\/+$/g, ''), 'index.html');
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderDocument(route));
}

const notFoundRoute = { page: 'not-found' };
const notFoundDocument = renderDocument(notFoundRoute);
await mkdir(resolve(distDirectory, '404'), { recursive: true });
await Promise.all([
  writeFile(resolve(distDirectory, '404.html'), notFoundDocument),
  writeFile(resolve(distDirectory, '404/index.html'), notFoundDocument),
]);

const escapeXml = (value) =>
  value.replace(/[<>&'\"]/g, (character) => {
    const entities = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };
    return entities[character];
  });

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(
    (route) =>
      `  <url><loc>${escapeXml(`${siteConfig.siteUrl}${routePathname(route)}`)}</loc></url>`,
  ),
  '</urlset>',
  '',
].join('\n');
await writeFile(resolve(distDirectory, 'sitemap.xml'), sitemap);

const robots = siteConfig.indexable
  ? `User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.siteUrl}/sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n';
await writeFile(resolve(distDirectory, 'robots.txt'), robots);

console.log(
  `Prerendered ${routes.length} public routes and the 404 page (${siteConfig.indexable ? 'indexable' : 'noindex'}).`,
);
