import { COLLECTIONS, type Artwork } from '../data/collections';

export interface SearchResult {
  item: Artwork;
  collectionKey: string;
}

const ALL_PRODUCTS: SearchResult[] = Object.values(COLLECTIONS).flatMap((collection) =>
  collection.items.map((item) => ({ item, collectionKey: collection.key })),
);

const FEATURED_KEYS = [
  'landscapes/watching-over-coumeenoole',
  'prints/deenish-and-scariff',
  'pendants/oval-mosaic-pendant',
  'interiors/william-street-listowel',
  'landscapes/out-west',
  'prints/hawthorn-harmony',
  'pendants/large-mandala-pendant',
  'interiors/fireside-companions',
  'landscapes/clogher-pace',
  'prints/ballybunion-reflection',
];

const resultKey = ({ collectionKey, item }: SearchResult) => `${collectionKey}/${item.slug}`;

const FEATURED_PRODUCTS = FEATURED_KEYS.map((key) =>
  ALL_PRODUCTS.find((result) => resultKey(result) === key),
).filter((result): result is SearchResult => Boolean(result));

const searchText = ({ item, collectionKey }: SearchResult): string => {
  const collection = COLLECTIONS[collectionKey];
  return [
    item.name,
    item.meta,
    item.description,
    collection.label,
    collection.title,
    collection.titleEm,
    collection.desc,
    collection.productDesc,
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase('en');
};

const matches = (result: SearchResult, query: string): boolean =>
  query
    .trim()
    .toLocaleLowerCase('en')
    .split(/\s+/)
    .every((term) => searchText(result).includes(term));

export const FEATURED_COUNT = FEATURED_PRODUCTS.length;
export const MAX_RESULTS = 15;

export function searchProducts(query: string): SearchResult[] {
  if (!query.trim()) return FEATURED_PRODUCTS;
  return ALL_PRODUCTS.filter((result) => matches(result, query)).slice(0, MAX_RESULTS);
}

export function countMatches(query: string): number {
  if (!query.trim()) return FEATURED_PRODUCTS.length;
  return ALL_PRODUCTS.filter((result) => matches(result, query)).length;
}
