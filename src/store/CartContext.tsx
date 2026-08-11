import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import { cartReducer, cartSubtotal, isCartItem, type CartItem } from './cart';

const STORAGE_KEY = 'olive-stack-cart-v1';

interface CartContextValue {
  items: readonly CartItem[];
  subtotal: number;
  has: (id: string) => boolean;
  add: (item: CartItem) => void;
  remove: (id: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const restore = (stored: string | null) => {
      if (!stored) {
        dispatch({ type: 'replace', items: [] });
        return;
      }
      try {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'replace', items: parsed.filter(isCartItem) });
          return;
        }
      } catch {
        // Invalid persisted data is cleared below and never reaches the cart.
      }
      window.localStorage.removeItem(STORAGE_KEY);
      dispatch({ type: 'replace', items: [] });
    };

    try {
      restore(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      console.warn('Cart persistence is unavailable in this browser.');
    }
    setHydrated(true);

    const syncAcrossTabs = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) restore(event.newValue);
    };
    window.addEventListener('storage', syncAcrossTabs);
    return () => window.removeEventListener('storage', syncAcrossTabs);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      console.warn('Cart changes could not be saved in this browser.');
    }
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      subtotal: cartSubtotal(items),
      has: (id) => items.some((item) => item.id === id),
      add: (item) => dispatch({ type: 'add', item }),
      remove: (id) => dispatch({ type: 'remove', id }),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
