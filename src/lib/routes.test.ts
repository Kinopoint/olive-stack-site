import { describe, expect, test } from 'vitest';
import { COLLECTIONS } from '../data/collections';
import {
  BASE_PATH,
  parseLegacyHash,
  parsePathname,
  paths,
  routeHref,
  routePathname,
  staticRoutes,
  type Route,
} from './routes';

describe('parsePathname', () => {
  test('resolves the root with and without the configured base path', () => {
    expect(parsePathname('/')).toEqual({ page: 'home' });
    expect(parsePathname(BASE_PATH)).toEqual({ page: 'home' });
  });

  test('parses valid collection and product paths', () => {
    expect(parsePathname(`${BASE_PATH}collection/prints/`)).toEqual({
      page: 'collection',
      key: 'prints',
    });
    expect(parsePathname(`${BASE_PATH}product/landscapes/beenconeen-beckons/`)).toEqual({
      page: 'product',
      collectionKey: 'landscapes',
      slug: 'beenconeen-beckons',
    });
  });

  test('rejects incomplete, unknown, and overlong paths', () => {
    expect(parsePathname('/product/landscapes/')).toEqual({ page: 'not-found' });
    expect(parsePathname('/collection/not-a-collection/')).toEqual({ page: 'not-found' });
    expect(parsePathname('/product/landscapes/not-an-artwork/')).toEqual({ page: 'not-found' });
    expect(parsePathname('/contact/extra/')).toEqual({ page: 'not-found' });
    expect(parsePathname('/nope/')).toEqual({ page: 'not-found' });
  });

  test('parses every residency sub-page independently', () => {
    expect(parsePathname('/residency/')).toEqual({ page: 'residency' });
    expect(parsePathname('/residency/information/')).toEqual({ page: 'residency-info' });
    expect(parsePathname('/residency/testimonials/')).toEqual({ page: 'testimonials' });
    expect(parsePathname('/residency/photos/')).toEqual({ page: 'photos' });
  });
});

describe('clean route builders', () => {
  const routeCases: Array<[Route, string]> = [
    [{ page: 'home' }, '/'],
    [{ page: 'collection', key: 'pendants' }, '/collection/pendants/'],
    [
      { page: 'product', collectionKey: 'prints', slug: 'hawthorn-harmony' },
      '/product/prints/hawthorn-harmony/',
    ],
    [{ page: 'giftcard' }, '/gift-cards/'],
    [{ page: 'artsweek' }, '/arts-week/'],
    [{ page: 'workshops' }, '/workshops/'],
    [{ page: 'sponsors' }, '/sponsors/'],
    [{ page: 'residency' }, '/residency/'],
    [{ page: 'residency-info' }, '/residency/information/'],
    [{ page: 'testimonials' }, '/residency/testimonials/'],
    [{ page: 'photos' }, '/residency/photos/'],
    [{ page: 'contact' }, '/contact/'],
    [{ page: 'not-found' }, '/404/'],
  ];

  test.each(routeCases)('builds and parses %j', (route, pathname) => {
    expect(routePathname(route)).toBe(pathname);
    expect(routeHref(route)).not.toContain('#');
    expect(parsePathname(routeHref(route))).toEqual(route);
  });

  test('public path helpers emit real links rather than hash routes', () => {
    const hrefs = [
      paths.home(),
      paths.collection('prints'),
      paths.product('prints', 'hawthorn-harmony'),
      paths.giftcard(),
      paths.artsweek(),
      paths.workshops(),
      paths.sponsors(),
      paths.residency(),
      paths.residencyInfo(),
      paths.testimonials(),
      paths.photos(),
      paths.contact(),
    ];

    expect(hrefs.every((href) => href.startsWith('/') && !href.includes('#'))).toBe(true);
  });

  test('the static route manifest is complete, unique, and round-trippable', () => {
    const routes = staticRoutes();
    const expectedCount =
      1 +
      Object.keys(COLLECTIONS).length +
      Object.values(COLLECTIONS).reduce((count, collection) => count + collection.items.length, 0) +
      9;
    const pathnames = routes.map(routePathname);

    expect(routes).toHaveLength(expectedCount);
    expect(new Set(pathnames).size).toBe(expectedCount);
    expect(routes.some((route) => route.page === 'not-found')).toBe(false);

    for (const route of routes) {
      expect(parsePathname(routeHref(route))).toEqual(route);
    }
  });
});

describe('legacy hash compatibility', () => {
  test('converts old valid hashes to the corresponding route', () => {
    expect(parseLegacyHash('')).toEqual({ page: 'home' });
    expect(parseLegacyHash('#/')).toEqual({ page: 'home' });
    expect(parseLegacyHash('#/collection/prints')).toEqual({ page: 'collection', key: 'prints' });
    expect(parseLegacyHash('#/product/landscapes/beenconeen-beckons')).toEqual({
      page: 'product',
      collectionKey: 'landscapes',
      slug: 'beenconeen-beckons',
    });
  });

  test('does not turn a bad legacy hash into the home page', () => {
    expect(parseLegacyHash('#/product/landscapes')).toEqual({ page: 'not-found' });
    expect(parseLegacyHash('#/nope')).toEqual({ page: 'not-found' });
  });
});
