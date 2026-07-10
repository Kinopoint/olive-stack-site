import { describe, expect, test } from 'vitest';
import { countMatches, MAX_RESULTS, POPULAR_COUNT, searchProducts } from './search';

describe('searchProducts', () => {
  test('returns popular pieces when the query is empty', () => {
    const results = searchProducts('');

    expect(results).toHaveLength(POPULAR_COUNT);
  });

  test('matches case-insensitively on the artwork name', () => {
    const results = searchProducts('beenconeen');

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.item.name.toLowerCase().includes('beenconeen'))).toBe(true);
  });

  test('finds the same piece across collections (painting and print)', () => {
    const results = searchProducts('Beenconeen Beckons');
    const collectionKeys = results.map((r) => r.collectionKey);

    expect(collectionKeys).toContain('landscapes');
    expect(collectionKeys).toContain('prints');
  });

  test('returns empty array when nothing matches', () => {
    expect(searchProducts('zzz-no-such-piece')).toEqual([]);
  });

  test('ignores surrounding whitespace', () => {
    expect(searchProducts('  pendant  ').length).toBeGreaterThan(0);
  });

  test('caps results at MAX_RESULTS', () => {
    // "a" matches most of the catalogue.
    expect(searchProducts('a').length).toBeLessThanOrEqual(MAX_RESULTS);
  });
});

describe('countMatches', () => {
  test('counts matches beyond the display cap', () => {
    expect(countMatches('a')).toBeGreaterThanOrEqual(searchProducts('a').length);
  });

  test('returns 0 for no matches', () => {
    expect(countMatches('zzz-no-such-piece')).toBe(0);
  });
});
