import { COLLECTIONS } from '../data/collections';

export type Route =
  | { page: 'home' }
  | { page: 'collection'; key: string }
  | { page: 'product'; collectionKey: string; slug: string }
  | { page: 'giftcard' }
  | { page: 'artsweek' }
  | { page: 'workshops' }
  | { page: 'sponsors' }
  | { page: 'residency' }
  | { page: 'residency-info' }
  | { page: 'testimonials' }
  | { page: 'photos' }
  | { page: 'contact' }
  | { page: 'not-found' };

const normalizedBase = `/${import.meta.env.BASE_URL.replace(/^\/+|\/+$/g, '')}/`;

export const BASE_PATH = normalizedBase === '//' ? '/' : normalizedBase;

const routePath = (route: Route): string => {
  switch (route.page) {
    case 'home':
      return '/';
    case 'collection':
      return `/collection/${route.key}/`;
    case 'product':
      return `/product/${route.collectionKey}/${route.slug}/`;
    case 'giftcard':
      return '/gift-cards/';
    case 'artsweek':
      return '/arts-week/';
    case 'workshops':
      return '/workshops/';
    case 'sponsors':
      return '/sponsors/';
    case 'residency':
      return '/residency/';
    case 'residency-info':
      return '/residency/information/';
    case 'testimonials':
      return '/residency/testimonials/';
    case 'photos':
      return '/residency/photos/';
    case 'contact':
      return '/contact/';
    case 'not-found':
      return '/404/';
  }
};

export const routePathname = (route: Route): string => routePath(route);

export const routeHref = (route: Route): string => {
  const suffix = routePath(route).replace(/^\//, '');
  return `${BASE_PATH}${suffix}`.replace(/\/{2,}/g, '/');
};

export const paths = {
  home: () => routeHref({ page: 'home' }),
  collection: (key: string) => routeHref({ page: 'collection', key }),
  product: (collectionKey: string, slug: string) =>
    routeHref({ page: 'product', collectionKey, slug }),
  giftcard: () => routeHref({ page: 'giftcard' }),
  artsweek: () => routeHref({ page: 'artsweek' }),
  workshops: () => routeHref({ page: 'workshops' }),
  sponsors: () => routeHref({ page: 'sponsors' }),
  residency: () => routeHref({ page: 'residency' }),
  residencyInfo: () => routeHref({ page: 'residency-info' }),
  testimonials: () => routeHref({ page: 'testimonials' }),
  photos: () => routeHref({ page: 'photos' }),
  contact: () => routeHref({ page: 'contact' }),
};

const stripBase = (pathname: string): string => {
  const normalized = `/${pathname}`.replace(/\/{2,}/g, '/');
  if (BASE_PATH === '/') return normalized;
  return normalized.startsWith(BASE_PATH) ? `/${normalized.slice(BASE_PATH.length)}` : normalized;
};

const parseRoutePath = (pathname: string): Route => {
  const segments = stripBase(pathname).split('/').filter(Boolean);

  if (segments.length === 0) return { page: 'home' };

  switch (segments[0]) {
    case 'collection': {
      const key = segments[1];
      return key && segments.length === 2 && COLLECTIONS[key]
        ? { page: 'collection', key }
        : { page: 'not-found' };
    }
    case 'product': {
      const collectionKey = segments[1];
      const slug = segments[2];
      const collection = collectionKey ? COLLECTIONS[collectionKey] : undefined;
      return collection && slug && segments.length === 3 && collection.items.some((item) => item.slug === slug)
        ? { page: 'product', collectionKey, slug }
        : { page: 'not-found' };
    }
    case 'gift-cards':
      return segments.length === 1 ? { page: 'giftcard' } : { page: 'not-found' };
    case 'arts-week':
      return segments.length === 1 ? { page: 'artsweek' } : { page: 'not-found' };
    case 'workshops':
      return segments.length === 1 ? { page: 'workshops' } : { page: 'not-found' };
    case 'sponsors':
      return segments.length === 1 ? { page: 'sponsors' } : { page: 'not-found' };
    case 'residency':
      if (segments.length === 1) return { page: 'residency' };
      if (segments.length !== 2) return { page: 'not-found' };
      switch (segments[1]) {
        case 'information':
          return { page: 'residency-info' };
        case 'testimonials':
          return { page: 'testimonials' };
        case 'photos':
          return { page: 'photos' };
        default:
          return { page: 'not-found' };
      }
    case 'contact':
      return segments.length === 1 ? { page: 'contact' } : { page: 'not-found' };
    case '404':
      return { page: 'not-found' };
    default:
      return { page: 'not-found' };
  }
};

export const parsePathname = (pathname: string): Route => parseRoutePath(pathname);

export const parseLegacyHash = (hash: string): Route =>
  parseRoutePath(hash.replace(/^#\/?/, '/'));

export const staticRoutes = (): Route[] => [
  { page: 'home' },
  ...Object.values(COLLECTIONS).flatMap((collection): Route[] => [
    { page: 'collection', key: collection.key },
    ...collection.items.map(
      (item): Route => ({ page: 'product', collectionKey: collection.key, slug: item.slug }),
    ),
  ]),
  { page: 'giftcard' },
  { page: 'artsweek' },
  { page: 'workshops' },
  { page: 'sponsors' },
  { page: 'residency' },
  { page: 'residency-info' },
  { page: 'testimonials' },
  { page: 'photos' },
  { page: 'contact' },
];
