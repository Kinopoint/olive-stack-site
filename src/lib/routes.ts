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
  | { page: 'contact' };

export const paths = {
  home: () => '#/',
  collection: (key: string) => `#/collection/${key}`,
  product: (collectionKey: string, slug: string) => `#/product/${collectionKey}/${slug}`,
  giftcard: () => '#/gift-cards',
  artsweek: () => '#/arts-week',
  workshops: () => '#/workshops',
  sponsors: () => '#/sponsors',
  residency: () => '#/residency',
  residencyInfo: () => '#/residency/information',
  testimonials: () => '#/residency/testimonials',
  photos: () => '#/residency/photos',
  contact: () => '#/contact',
};

/** Parse a location hash (e.g. "#/collection/prints") into a Route. Unknown paths fall back to home. */
export function parseHash(hash: string): Route {
  const segments = hash.replace(/^#\/?/, '').split('/').filter(Boolean);

  if (segments.length === 0) return { page: 'home' };

  switch (segments[0]) {
    case 'collection':
      return segments[1] ? { page: 'collection', key: segments[1] } : { page: 'home' };
    case 'product':
      return segments[1] && segments[2]
        ? { page: 'product', collectionKey: segments[1], slug: segments[2] }
        : { page: 'home' };
    case 'gift-cards':
      return { page: 'giftcard' };
    case 'arts-week':
      return { page: 'artsweek' };
    case 'workshops':
      return { page: 'workshops' };
    case 'sponsors':
      return { page: 'sponsors' };
    case 'residency':
      switch (segments[1]) {
        case 'information':
          return { page: 'residency-info' };
        case 'testimonials':
          return { page: 'testimonials' };
        case 'photos':
          return { page: 'photos' };
        default:
          return { page: 'residency' };
      }
    case 'contact':
      return { page: 'contact' };
    default:
      return { page: 'home' };
  }
}
