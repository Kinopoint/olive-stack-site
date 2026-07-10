export interface CartItem {
  name: string;
  price: string;
  amount: number;
  meta: string;
  img: string;
}

export type CartAction =
  | { type: 'add'; item: CartItem }
  | { type: 'remove'; name: string };

/**
 * Items are unique by name (every piece is one of a kind), so adding an
 * item that is already in the cart is a no-op.
 */
export function cartReducer(cart: readonly CartItem[], action: CartAction): readonly CartItem[] {
  switch (action.type) {
    case 'add':
      if (cart.some((c) => c.name === action.item.name)) return cart;
      return [...cart, action.item];
    case 'remove':
      return cart.filter((c) => c.name !== action.name);
  }
}

export function cartSubtotal(cart: readonly CartItem[]): number {
  return cart.reduce((sum, c) => sum + c.amount, 0);
}
