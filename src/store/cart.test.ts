import { describe, expect, test } from 'vitest';
import { cartReducer, cartSubtotal, type CartItem } from './cart';

const painting: CartItem = {
  name: 'Beenconeen Beckons',
  price: '€3,500',
  amount: 3500,
  meta: 'OIL ON CANVAS',
  img: 'painting.jpg',
};

const pendant: CartItem = {
  name: 'Oval Mosaic Pendant',
  price: '€145',
  amount: 145,
  meta: 'MICRO MOSAIC',
  img: 'pendant.jpg',
};

describe('cartReducer', () => {
  test('adds an item to an empty cart', () => {
    // Arrange
    const cart: CartItem[] = [];

    // Act
    const next = cartReducer(cart, { type: 'add', item: painting });

    // Assert
    expect(next).toEqual([painting]);
  });

  test('does not duplicate a one-of-a-kind item added twice', () => {
    // Arrange
    const cart = [painting];

    // Act
    const next = cartReducer(cart, { type: 'add', item: painting });

    // Assert
    expect(next).toHaveLength(1);
    expect(next).toBe(cart);
  });

  test('removes an item by name and keeps the rest', () => {
    // Arrange
    const cart = [painting, pendant];

    // Act
    const next = cartReducer(cart, { type: 'remove', name: painting.name });

    // Assert
    expect(next).toEqual([pendant]);
  });

  test('does not mutate the previous cart when adding', () => {
    // Arrange
    const cart = [painting];

    // Act
    cartReducer(cart, { type: 'add', item: pendant });

    // Assert
    expect(cart).toEqual([painting]);
  });
});

describe('cartSubtotal', () => {
  test('returns 0 for an empty cart', () => {
    expect(cartSubtotal([])).toBe(0);
  });

  test('sums item amounts', () => {
    expect(cartSubtotal([painting, pendant])).toBe(3645);
  });
});
