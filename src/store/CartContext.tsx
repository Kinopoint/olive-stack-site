import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { cartReducer, cartSubtotal, type CartItem } from './cart';

interface CartContextValue {
  items: readonly CartItem[];
  subtotal: number;
  has: (name: string) => boolean;
  add: (item: CartItem) => void;
  remove: (name: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      subtotal: cartSubtotal(items),
      has: (name) => items.some((c) => c.name === name),
      add: (item) => dispatch({ type: 'add', item }),
      remove: (name) => dispatch({ type: 'remove', name }),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
