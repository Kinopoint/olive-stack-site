import { describe, expect, test } from 'vitest';
import { cartReducer, cartSubtotal, isCartItem, type CartItem } from './cart';

const painting: CartItem = {
  id: 'gid://shopify/ProductVariant/54828594004317',
  variantId: 'gid://shopify/ProductVariant/54828594004317',
  productUrl: 'https://www.olivestack.com/products/beenconeen-beckons',
  name: 'Beenconeen Beckons',
  price: '€3,500',
  amount: 3500,
  meta: 'OIL ON CANVAS',
  img: 'https://www.olivestack.com/cdn/shop/files/Beenconeen-Beckons.jpg?width=300',
};

const print: CartItem = {
  id: 'gid://shopify/ProductVariant/62917804425565',
  variantId: 'gid://shopify/ProductVariant/62917804425565',
  productUrl: 'https://www.olivestack.com/products/beenconeen-beckons-1',
  name: 'Beenconeen Beckons',
  price: '€300',
  amount: 300,
  meta: 'LIMITED EDITION PRINT',
  img: 'https://www.olivestack.com/cdn/shop/files/Beenconeen-Beckons.jpg?width=300',
};

const pendant: CartItem = {
  id: 'gid://shopify/ProductVariant/58887485063517',
  variantId: 'gid://shopify/ProductVariant/58887485063517',
  productUrl: 'https://www.olivestack.com/products/oval-mosaic-pendant',
  name: 'Oval Mosaic Pendant',
  price: '€145',
  amount: 145,
  meta: 'MICRO MOSAIC',
  img: 'https://www.olivestack.com/cdn/shop/files/pendant.jpg?width=300',
};

describe('cartReducer', () => {
  test('adds an item without mutating the original cart', () => {
    const cart = [painting];
    const next = cartReducer(cart, { type: 'add', item: pendant });

    expect(next).toEqual([painting, pendant]);
    expect(cart).toEqual([painting]);
  });

  test('does not duplicate the same Shopify variant', () => {
    const cart = [painting];
    const next = cartReducer(cart, { type: 'add', item: painting });

    expect(next).toBe(cart);
    expect(next).toHaveLength(1);
  });

  test('allows products with the same display name when variant ids differ', () => {
    const next = cartReducer([painting], { type: 'add', item: print });

    expect(next).toEqual([painting, print]);
  });

  test('removes exactly one item by stable id', () => {
    const next = cartReducer([painting, print, pendant], { type: 'remove', id: print.id });

    expect(next).toEqual([painting, pendant]);
  });

  test('replaces persisted contents without mutating the replacement array', () => {
    const restored = [print, pendant] as const;

    expect(cartReducer([painting], { type: 'replace', items: restored })).toBe(restored);
  });
});

describe('cartSubtotal', () => {
  test('returns zero for an empty cart and sums valid item amounts', () => {
    expect(cartSubtotal([])).toBe(0);
    expect(cartSubtotal([painting, print, pendant])).toBe(3945);
  });
});

describe('isCartItem', () => {
  test('accepts a complete persisted cart item', () => {
    expect(isCartItem(painting)).toBe(true);
  });

  test.each([
    null,
    {},
    { ...painting, id: 12 },
    { ...painting, variantId: 'not-a-shopify-gid' },
    { ...painting, id: print.id },
    { ...painting, amount: Number.NaN },
    { ...painting, amount: -1 },
    { ...painting, productUrl: null },
    { ...painting, productUrl: 'javascript:alert(1)' },
    { ...painting, img: 'https://example.com/art.jpg' },
  ])('rejects malformed persisted data: %j', (value) => {
    expect(isCartItem(value)).toBe(false);
  });
});
