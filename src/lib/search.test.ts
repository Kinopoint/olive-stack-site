import { describe, expect, test } from 'vitest';
import { countMatches, FEATURED_COUNT, MAX_RESULTS, searchProducts } from './search';

describe('searchProducts', () => {
  test('returns a balanced, duplicate-free featured selection for a blank query', () => {
    const results = searchProducts('');
    const keys = results.map(({ collectionKey, item }) => `${collectionKey}/${item.slug}`);

    expect(results).toHaveLength(FEATURED_COUNT);
    expect(new Set(keys).size).toBe(results.length);
    expect(new Set(results.map((result) => result.collectionKey)).size).toBeGreaterThan(1);
  });

  test('matches artwork names case-insensitively', () => {
    const results = searchProducts('BEENconeen');

    expect(results.map((result) => `${result.collectionKey}/${result.item.slug}`)).toEqual(
      expect.arrayContaining([
        'landscapes/beenconeen-beckons',
        'prints/beenconeen-beckons',
      ]),
    );
  });

  test('indexes collection names, metadata, and descriptions', () => {
    expect(searchProducts('jewellery').every((result) => result.collectionKey === 'pendants')).toBe(
      true,
    );
    expect(searchProducts('oil canvas').some((result) => result.collectionKey === 'landscapes')).toBe(
      true,
    );
    expect(searchProducts('wild atlantic').length).toBeGreaterThan(0);
  });

  test('requires every search term, even when terms match different fields', () => {
    const results = searchProducts('beenconeen limited edition');

    expect(results).toHaveLength(1);
    expect(results[0]?.collectionKey).toBe('prints');
    expect(results[0]?.item.slug).toBe('beenconeen-beckons');
  });

  test('normalises surrounding and repeated whitespace', () => {
    expect(searchProducts('  mosaic   pendant  ')).toEqual(searchProducts('mosaic pendant'));
  });

  test('returns no result for a term absent from the catalogue', () => {
    expect(searchProducts('zzz-no-such-piece')).toEqual([]);
  });

  test('caps displayed results without changing the total match count', () => {
    const results = searchProducts('a');

    expect(results.length).toBeLessThanOrEqual(MAX_RESULTS);
    expect(countMatches('a')).toBeGreaterThanOrEqual(results.length);
  });
});

describe('countMatches', () => {
  test('uses the featured count for a blank query', () => {
    expect(countMatches('   ')).toBe(FEATURED_COUNT);
  });

  test('returns zero for no matches', () => {
    expect(countMatches('zzz-no-such-piece')).toBe(0);
  });
});
