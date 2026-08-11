import { COLLECTIONS, findArtwork } from '../data/collections';
import { WORKSHOP_CART_IMG, WORKSHOPS, type Workshop } from '../data/events';
import {
  shopifyGiftCard,
  shopifyProduct,
  shopifyWorkshop,
  type ShopifyProduct,
} from '../data/shopify';
import { routePathname, type Route } from './routes';

type JsonLdNode = Record<string, unknown>;

export interface PageMetadata {
  title: string;
  description: string;
  canonical: string;
  image: string;
  imageAlt: string;
  type: 'website' | 'product';
  robots: string;
  jsonLd: JsonLdNode;
}

const INDEXABLE = import.meta.env.VITE_INDEXABLE === 'true';
const DEFAULT_SITE_URL = INDEXABLE
  ? 'https://www.olivestack.com'
  : 'https://kinopoint.github.io/olive-stack-site';
const SITE_URL = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
const DEFAULT_IMAGE =
  'https://www.olivestack.com/cdn/shop/files/Beenconeen-Beckons.jpg?v=1732103660&width=1200';
const GALLERY_ID = `${SITE_URL}/#gallery`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const POSTAL_ADDRESS: JsonLdNode = {
  '@type': 'PostalAddress',
  streetAddress: '4 Main Street',
  addressLocality: 'Listowel',
  addressRegion: 'County Kerry',
  postalCode: 'V31 HW30',
  addressCountry: 'IE',
};

export const siteConfig = {
  indexable: INDEXABLE,
  siteUrl: SITE_URL,
  name: 'Olive Stack Gallery',
} as const;

const canonicalFor = (route: Route): string => `${SITE_URL}${routePathname(route)}`;

const concise = (value: string, maxLength = 165): string => {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  const shortened = text.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, lastSpace > 100 ? lastSpace : maxLength - 1)}…`;
};

interface PageCopy {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'product';
}

const pageCopy = (route: Route): PageCopy => {
  if (route.page === 'collection') {
    const collection = COLLECTIONS[route.key];
    return {
      title: `${collection.label} | Olive Stack Gallery`,
      description: concise(`${collection.desc} Discover work by Irish artist Olive Stack.`),
      image: collection.items[0]?.img || DEFAULT_IMAGE,
      imageAlt: collection.items[0]
        ? `${collection.items[0].name} by Olive Stack`
        : `${collection.label} at Olive Stack Gallery`,
    };
  }

  if (route.page === 'product') {
    const result = findArtwork(route.collectionKey, route.slug);
    if (!result) return pageCopy({ page: 'not-found' });
    const { collection, item } = result;
    return {
      title: `${item.name} — ${collection.label} | Olive Stack Gallery`,
      description: concise(
        `${item.name} — ${item.meta}. ${item.description || collection.productDesc || collection.desc}`,
      ),
      image: item.img,
      imageAlt: `${item.name} by Olive Stack`,
      type: 'product',
    };
  }

  switch (route.page) {
    case 'home':
      return {
        title: 'Olive Stack Gallery | Contemporary Irish Art in Listowel',
        description:
          'Original paintings, fine art prints and one-of-a-kind micro mosaic jewellery by Irish artist Olive Stack. Gallery and studio in Listowel, County Kerry.',
      };
    case 'giftcard':
      return {
        title: 'Gallery Gift Cards | Olive Stack Gallery',
        description:
          'Give art from Olive Stack Gallery with a digital gift card, available in values from €25 for paintings, prints, jewellery and workshops.',
        type: 'product',
      };
    case 'artsweek':
      return {
        title: 'Listowel Visual Arts Week 2026 | Olive Stack Gallery',
        description:
          'Explore the archive of Listowel Visual Arts Week 2026, a ten-day celebration of exhibitions, artist-led workshops and creativity in County Kerry.',
        image: WORKSHOP_CART_IMG,
        imageAlt: 'Listowel Visual Arts Week at Olive Stack Gallery',
      };
    case 'workshops':
      return {
        title: '2026 Workshop Programme | Olive Stack Gallery',
        description:
          'Browse the archived 2026 Listowel Visual Arts Week programme of mosaic, painting, printmaking, felting and lantern-making workshops.',
        image: WORKSHOP_CART_IMG,
        imageAlt: 'Creative workshop at Olive Stack Gallery',
      };
    case 'sponsors':
      return {
        title: 'Arts Week Sponsors | Olive Stack Gallery',
        description:
          'Meet the local organisations and creative partners who supported Listowel Visual Arts Week at Olive Stack Gallery in County Kerry.',
        image: WORKSHOP_CART_IMG,
        imageAlt: 'Listowel Visual Arts Week at Olive Stack Gallery',
      };
    case 'residency':
      return {
        title: 'International Artist Residency | Olive Stack Gallery',
        description:
          'Discover the Olive Stack Gallery international artist residency in Listowel, offering visiting artists time, space and connection in County Kerry.',
      };
    case 'residency-info':
      return {
        title: 'Residency Information | Olive Stack Gallery',
        description:
          'Read practical information about applying for and taking part in the Olive Stack Gallery international artist residency in Listowel, Ireland.',
      };
    case 'testimonials':
      return {
        title: 'Artist and Guest Testimonials | Olive Stack Gallery',
        description:
          'Hear from artists, collectors and workshop guests about their experiences with Olive Stack Gallery, its residency and creative programme.',
      };
    case 'photos':
      return {
        title: 'Gallery and Residency Photos | Olive Stack Gallery',
        description:
          'View photographs of Olive Stack Gallery, original Irish art, mosaic jewellery, visiting artists and creative life in Listowel.',
      };
    case 'contact':
      return {
        title: 'Visit and Contact | Olive Stack Gallery',
        description:
          'Visit Olive Stack Gallery at 4 Main Street, Listowel, County Kerry, or get in touch about artworks, commissions, workshops and the residency.',
      };
    case 'not-found':
      return {
        title: 'Page Not Found | Olive Stack Gallery',
        description:
          'The requested page could not be found. Return to Olive Stack Gallery to explore original Irish paintings, prints and mosaic jewellery.',
      };
  }
};

interface Crumb {
  name: string;
  route: Route;
}

const breadcrumbs = (route: Route): Crumb[] => {
  const home: Crumb = { name: 'Home', route: { page: 'home' } };
  switch (route.page) {
    case 'home':
      return [home];
    case 'collection':
      return [home, { name: COLLECTIONS[route.key].label, route }];
    case 'product': {
      const collection = COLLECTIONS[route.collectionKey];
      const item = collection.items.find((candidate) => candidate.slug === route.slug);
      return [
        home,
        { name: collection.label, route: { page: 'collection', key: collection.key } },
        { name: item?.name || 'Artwork', route },
      ];
    }
    case 'giftcard':
      return [home, { name: 'Gift Cards', route }];
    case 'artsweek':
      return [home, { name: 'Listowel Visual Arts Week', route }];
    case 'workshops':
      return [
        home,
        { name: 'Listowel Visual Arts Week', route: { page: 'artsweek' } },
        { name: 'Workshop Programme', route },
      ];
    case 'sponsors':
      return [
        home,
        { name: 'Listowel Visual Arts Week', route: { page: 'artsweek' } },
        { name: 'Sponsors', route },
      ];
    case 'residency':
      return [home, { name: 'Artist Residency', route }];
    case 'residency-info':
      return [
        home,
        { name: 'Artist Residency', route: { page: 'residency' } },
        { name: 'Information', route },
      ];
    case 'testimonials':
      return [
        home,
        { name: 'Artist Residency', route: { page: 'residency' } },
        { name: 'Testimonials', route },
      ];
    case 'photos':
      return [
        home,
        { name: 'Artist Residency', route: { page: 'residency' } },
        { name: 'Photos', route },
      ];
    case 'contact':
      return [home, { name: 'Contact', route }];
    case 'not-found':
      return [home, { name: 'Page Not Found', route }];
  }
};

const gallerySchema = (): JsonLdNode => ({
  '@type': ['Organization', 'ArtGallery'],
  '@id': GALLERY_ID,
  name: 'Olive Stack Gallery',
  url: `${SITE_URL}/`,
  image: DEFAULT_IMAGE,
  email: 'olive@olivestack.com',
  telephone: '+353 68 23843',
  openingHours: 'Tu-Sa 10:30-18:00',
  founder: {
    '@type': 'Person',
    name: 'Olive Stack',
  },
  address: POSTAL_ADDRESS,
  sameAs: [
    'https://www.instagram.com/olivestackgallery/',
    'https://www.facebook.com/OliveStackGallery',
  ],
});

const breadcrumbSchema = (route: Route): JsonLdNode => ({
  '@type': 'BreadcrumbList',
  '@id': `${canonicalFor(route)}#breadcrumb`,
  itemListElement: breadcrumbs(route).map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: canonicalFor(crumb.route),
  })),
});

const offerNodes = (
  product: ShopifyProduct | undefined,
  fallbackPrice?: number,
  fallbackUrl?: string,
): JsonLdNode[] => {
  if (product?.variants.length) {
    return product.variants.map((variant) => ({
      '@type': 'Offer',
      price: variant.price,
      priceCurrency: 'EUR',
      availability: `https://schema.org/${variant.available ? 'InStock' : 'OutOfStock'}`,
      url: product.url,
      seller: { '@id': GALLERY_ID },
    }));
  }
  return fallbackPrice === undefined
    ? []
    : [
        {
          '@type': 'Offer',
          price: fallbackPrice,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/SoldOut',
          url: fallbackUrl,
          seller: { '@id': GALLERY_ID },
        },
      ];
};

const productSchema = (route: Extract<Route, { page: 'product' }>): JsonLdNode | null => {
  const result = findArtwork(route.collectionKey, route.slug);
  if (!result) return null;
  const { collection, item } = result;
  const liveProduct = shopifyProduct(route.collectionKey, route.slug);
  return {
    '@type': 'Product',
    '@id': `${canonicalFor(route)}#product`,
    name: item.name,
    description: item.description || collection.productDesc || collection.desc,
    image: [item.img],
    category: collection.label,
    brand: {
      '@type': 'Brand',
      name: 'Olive Stack',
    },
    offers: offerNodes(liveProduct),
  };
};

const giftCardSchema = (route: Extract<Route, { page: 'giftcard' }>): JsonLdNode => {
  const giftCard = shopifyGiftCard('gallery');
  return {
    '@type': 'Product',
    '@id': `${canonicalFor(route)}#product`,
    name: 'Olive Stack Gallery Gift Card',
    description: pageCopy(route).description,
    image: [DEFAULT_IMAGE],
    category: 'Gift Cards',
    brand: {
      '@type': 'Brand',
      name: 'Olive Stack Gallery',
    },
    offers: offerNodes(giftCard),
  };
};

const workshopSchema = (workshop: Workshop, pageRoute: Route): JsonLdNode => {
  const liveWorkshop = shopifyWorkshop(workshop.key);
  return {
    '@type': 'Event',
    '@id': `${canonicalFor(pageRoute)}#${workshop.key}`,
    name: workshop.name,
    description: workshop.desc,
    startDate: workshop.startDate,
    endDate: workshop.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: [WORKSHOP_CART_IMG],
    location: {
      '@type': 'Place',
      name: 'Olive Stack Gallery',
      address: POSTAL_ADDRESS,
    },
    organizer: { '@id': GALLERY_ID },
    offers: offerNodes(
      liveWorkshop,
      workshop.amount,
      `${canonicalFor(pageRoute)}#${workshop.key}`,
    ),
  };
};

const pageEntity = (route: Route): JsonLdNode | null => {
  if (route.page === 'product') return productSchema(route);
  if (route.page === 'giftcard') return giftCardSchema(route);
  if (route.page === 'artsweek') {
    return {
      '@type': 'Event',
      '@id': `${canonicalFor(route)}#event`,
      name: 'Listowel Visual Arts Week 2026',
      description: pageCopy(route).description,
      startDate: '2026-07-31T00:00:00+01:00',
      endDate: '2026-08-10T00:00:00+01:00',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      image: [WORKSHOP_CART_IMG],
      location: {
        '@type': 'Place',
        name: 'Olive Stack Gallery',
        address: POSTAL_ADDRESS,
      },
      organizer: { '@id': GALLERY_ID },
      subEvent: WORKSHOPS.map((workshop) => ({
        '@id': `${canonicalFor(route)}#${workshop.key}`,
      })),
    };
  }
  if (route.page === 'workshops') {
    return {
      '@type': 'ItemList',
      '@id': `${canonicalFor(route)}#programme`,
      name: 'Listowel Visual Arts Week 2026 Workshop Programme',
      itemListElement: WORKSHOPS.map((workshop, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: workshopSchema(workshop, route),
      })),
    };
  }
  return null;
};

const structuredData = (route: Route, copy: PageCopy): JsonLdNode => {
  const canonical = canonicalFor(route);
  const entity = pageEntity(route);
  const graph: JsonLdNode[] = [
    gallerySchema(),
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: `${SITE_URL}/`,
      name: 'Olive Stack Gallery',
      publisher: { '@id': GALLERY_ID },
      inLanguage: 'en-IE',
    },
    breadcrumbSchema(route),
    {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: copy.title,
      description: copy.description,
      isPartOf: { '@id': WEBSITE_ID },
      breadcrumb: { '@id': `${canonical}#breadcrumb` },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: copy.image || DEFAULT_IMAGE,
      },
      inLanguage: 'en-IE',
    },
  ];
  if (entity) graph.push(entity);
  if (route.page === 'artsweek') {
    graph.push(...WORKSHOPS.map((workshop) => workshopSchema(workshop, route)));
  }
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
};

export const metadataForRoute = (route: Route): PageMetadata => {
  const copy = pageCopy(route);
  return {
    title: copy.title,
    description: copy.description,
    canonical: canonicalFor(route),
    image: copy.image || DEFAULT_IMAGE,
    imageAlt: copy.imageAlt || 'Olive Stack Gallery in Listowel, County Kerry',
    type: copy.type || 'website',
    robots:
      INDEXABLE && route.page !== 'not-found'
        ? 'index, follow, max-image-preview:large'
        : 'noindex, nofollow',
    jsonLd: structuredData(route, copy),
  };
};

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });

export const renderMetadataHead = (metadata: PageMetadata): string => {
  const attribute = escapeHtml;
  const jsonLd = JSON.stringify(metadata.jsonLd).replace(/</g, '\\u003c');
  return [
    `<title>${escapeHtml(metadata.title)}</title>`,
    `<meta name="description" content="${attribute(metadata.description)}">`,
    `<meta name="robots" content="${attribute(metadata.robots)}">`,
    `<link rel="canonical" href="${attribute(metadata.canonical)}">`,
    '<meta property="og:locale" content="en_IE">',
    '<meta property="og:site_name" content="Olive Stack Gallery">',
    `<meta property="og:type" content="${metadata.type}">`,
    `<meta property="og:title" content="${attribute(metadata.title)}">`,
    `<meta property="og:description" content="${attribute(metadata.description)}">`,
    `<meta property="og:url" content="${attribute(metadata.canonical)}">`,
    `<meta property="og:image" content="${attribute(metadata.image)}">`,
    `<meta property="og:image:alt" content="${attribute(metadata.imageAlt)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${attribute(metadata.title)}">`,
    `<meta name="twitter:description" content="${attribute(metadata.description)}">`,
    `<meta name="twitter:image" content="${attribute(metadata.image)}">`,
    `<meta name="twitter:image:alt" content="${attribute(metadata.imageAlt)}">`,
    `<script id="structured-data" type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ');
};

const setMeta = (selector: string, attributeName: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, key);
    document.head.append(element);
  }
  element.content = content;
};

export const applyDocumentMetadata = (route: Route): void => {
  const metadata = metadataForRoute(route);
  document.title = metadata.title;
  setMeta('meta[name="description"]', 'name', 'description', metadata.description);
  setMeta('meta[name="robots"]', 'name', 'robots', metadata.robots);
  setMeta('meta[property="og:locale"]', 'property', 'og:locale', 'en_IE');
  setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Olive Stack Gallery');
  setMeta('meta[property="og:type"]', 'property', 'og:type', metadata.type);
  setMeta('meta[property="og:title"]', 'property', 'og:title', metadata.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', metadata.description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', metadata.canonical);
  setMeta('meta[property="og:image"]', 'property', 'og:image', metadata.image);
  setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', metadata.imageAlt);
  setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', metadata.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', metadata.description);
  setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', metadata.image);
  setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', metadata.imageAlt);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.append(canonical);
  }
  canonical.href = metadata.canonical;

  let jsonLd = document.getElementById('structured-data');
  if (!jsonLd) {
    jsonLd = document.createElement('script');
    jsonLd.id = 'structured-data';
    jsonLd.setAttribute('type', 'application/ld+json');
    document.head.append(jsonLd);
  }
  jsonLd.textContent = JSON.stringify(metadata.jsonLd);
};
