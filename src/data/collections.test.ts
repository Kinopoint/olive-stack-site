import { describe, expect, test } from 'vitest';
import { COLLECTIONS, collectionsInGroup, findArtwork } from './collections';

describe('COLLECTIONS', () => {
  test('every collection key matches its record key', () => {
    for (const [key, collection] of Object.entries(COLLECTIONS)) {
      expect(collection.key).toBe(key);
    }
  });

  test('slugs are unique within each collection', () => {
    for (const collection of Object.values(COLLECTIONS)) {
      const slugs = collection.items.map((i) => i.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  test('populated collections carry the expected catalogue sizes', () => {
    expect(COLLECTIONS.landscapes.items).toHaveLength(15);
    expect(COLLECTIONS.interiors.items).toHaveLength(12);
    expect(COLLECTIONS.prints.items).toHaveLength(15);
    expect(COLLECTIONS.pendants.items).toHaveLength(9);
  });

  test('sold items have zero amount so they never affect subtotals', () => {
    const soldItems = Object.values(COLLECTIONS)
      .flatMap((c) => c.items)
      .filter((i) => i.sold);
    expect(soldItems.length).toBeGreaterThan(0);
    expect(soldItems.every((i) => i.amount === 0)).toBe(true);
  });

  test('image URLs include an explicit width parameter', () => {
    for (const collection of Object.values(COLLECTIONS)) {
      for (const item of collection.items) {
        expect(item.img).toMatch(/[?&]width=\d+/);
      }
    }
  });
});

describe('collectionsInGroup', () => {
  test('groups cover the whole catalogue', () => {
    const total =
      collectionsInGroup('paintings').length +
      collectionsInGroup('jewellery').length +
      collectionsInGroup('more').length;
    expect(total).toBe(Object.keys(COLLECTIONS).length);
  });
});

describe('findArtwork', () => {
  test('finds an artwork by collection key and slug', () => {
    const match = findArtwork('landscapes', 'beenconeen-beckons');
    expect(match?.item.name).toBe('Beenconeen Beckons');
    expect(match?.collection.key).toBe('landscapes');
  });

  test('returns null for an unknown collection or slug', () => {
    expect(findArtwork('nope', 'beenconeen-beckons')).toBeNull();
    expect(findArtwork('landscapes', 'nope')).toBeNull();
  });
});
