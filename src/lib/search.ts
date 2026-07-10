import { COLLECTIONS, type Artwork } from '../data/collections';

export interface SearchResult {
  item: Artwork;
  collectionKey: string;
}

const ALL_PRODUCTS: SearchResult[] = Object.values(COLLECTIONS).flatMap((collection) =>
  collection.items.map((item) => ({ item, collectionKey: collection.key })),
);

export const POPULAR_COUNT = 10;
export const MAX_RESULTS = 15;

/** Case-insensitive name search; an empty query returns the first few popular pieces. */
export function searchProducts(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_PRODUCTS.slice(0, POPULAR_COUNT);
  return ALL_PRODUCTS.filter((r) => r.item.name.toLowerCase().includes(q)).slice(0, MAX_RESULTS);
}

/** Number of matches before the display cap, for the "N RESULTS" label. */
export function countMatches(query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_PRODUCTS.length;
  return ALL_PRODUCTS.filter((r) => r.item.name.toLowerCase().includes(q)).length;
}
