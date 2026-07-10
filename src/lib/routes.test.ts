import { describe, expect, test } from 'vitest';
import { parseHash, paths } from './routes';

describe('parseHash', () => {
  test('empty hash resolves to home', () => {
    expect(parseHash('')).toEqual({ page: 'home' });
    expect(parseHash('#/')).toEqual({ page: 'home' });
    expect(parseHash('#')).toEqual({ page: 'home' });
  });

  test('collection route carries the collection key', () => {
    expect(parseHash('#/collection/prints')).toEqual({ page: 'collection', key: 'prints' });
  });

  test('product route carries collection key and slug', () => {
    expect(parseHash('#/product/landscapes/beenconeen-beckons')).toEqual({
      page: 'product',
      collectionKey: 'landscapes',
      slug: 'beenconeen-beckons',
    });
  });

  test('incomplete product route falls back to home', () => {
    expect(parseHash('#/product/landscapes')).toEqual({ page: 'home' });
  });

  test('residency sub-pages parse to their own routes', () => {
    expect(parseHash('#/residency')).toEqual({ page: 'residency' });
    expect(parseHash('#/residency/information')).toEqual({ page: 'residency-info' });
    expect(parseHash('#/residency/testimonials')).toEqual({ page: 'testimonials' });
    expect(parseHash('#/residency/photos')).toEqual({ page: 'photos' });
  });

  test('unknown paths fall back to home', () => {
    expect(parseHash('#/nope')).toEqual({ page: 'home' });
  });

  test('every path builder round-trips through parseHash', () => {
    expect(parseHash(paths.home())).toEqual({ page: 'home' });
    expect(parseHash(paths.collection('pendants'))).toEqual({
      page: 'collection',
      key: 'pendants',
    });
    expect(parseHash(paths.product('prints', 'hawthorn-harmony'))).toEqual({
      page: 'product',
      collectionKey: 'prints',
      slug: 'hawthorn-harmony',
    });
    expect(parseHash(paths.giftcard())).toEqual({ page: 'giftcard' });
    expect(parseHash(paths.artsweek())).toEqual({ page: 'artsweek' });
    expect(parseHash(paths.workshops())).toEqual({ page: 'workshops' });
    expect(parseHash(paths.sponsors())).toEqual({ page: 'sponsors' });
    expect(parseHash(paths.residency())).toEqual({ page: 'residency' });
    expect(parseHash(paths.residencyInfo())).toEqual({ page: 'residency-info' });
    expect(parseHash(paths.testimonials())).toEqual({ page: 'testimonials' });
    expect(parseHash(paths.photos())).toEqual({ page: 'photos' });
    expect(parseHash(paths.contact())).toEqual({ page: 'contact' });
  });
});
