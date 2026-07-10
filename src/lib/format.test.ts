import { describe, expect, test } from 'vitest';
import { euro } from './format';

describe('euro', () => {
  test('formats with thousands separator', () => {
    expect(euro(3600)).toBe('€3,600');
  });

  test('formats zero', () => {
    expect(euro(0)).toBe('€0');
  });

  test('formats small amounts without separator', () => {
    expect(euro(145)).toBe('€145');
  });
});
