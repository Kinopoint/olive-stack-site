import { describe, expect, test } from 'vitest';
import { slugify } from './slug';

describe('slugify', () => {
  test('lowercases and hyphenates spaces', () => {
    expect(slugify('Beenconeen Beckons')).toBe('beenconeen-beckons');
  });

  test('handles curly apostrophes and punctuation', () => {
    expect(slugify('St John’s and St Mary’s')).toBe('st-john-s-and-st-mary-s');
  });

  test('handles commas and ampersands', () => {
    expect(slugify('Deenish and Scariff, Wild and Free')).toBe('deenish-and-scariff-wild-and-free');
    expect(slugify('Blue & Lime Green Pendant')).toBe('blue-lime-green-pendant');
  });

  test('trims leading and trailing separators', () => {
    expect(slugify(' “Quoted” ')).toBe('quoted');
  });
});
