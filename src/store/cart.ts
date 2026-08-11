export interface CartItem {
  id: string;
  variantId: string;
  productUrl: string;
  name: string;
  price: string;
  amount: number;
  meta: string;
  img: string;
}

export type CartAction =
  | { type: 'add'; item: CartItem }
  | { type: 'remove'; id: string }
  | { type: 'replace'; items: readonly CartItem[] };

export function cartReducer(cart: readonly CartItem[], action: CartAction): readonly CartItem[] {
  switch (action.type) {
    case 'add':
      if (cart.some((item) => item.id === action.item.id)) return cart;
      return [...cart, action.item];
    case 'remove':
      return cart.filter((item) => item.id !== action.id);
    case 'replace':
      return action.items;
  }
}

export function cartSubtotal(cart: readonly CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.amount, 0);
}

export function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  const productUrl = typeof item.productUrl === 'string' && URL.canParse(item.productUrl)
    ? new URL(item.productUrl)
    : null;
  const imageUrl = typeof item.img === 'string' && URL.canParse(item.img)
    ? new URL(item.img)
    : null;
  return (
    typeof item.id === 'string' &&
    typeof item.variantId === 'string' &&
    item.id === item.variantId &&
    item.variantId.startsWith('gid://shopify/ProductVariant/') &&
    productUrl?.protocol === 'https:' &&
    productUrl.hostname === 'www.olivestack.com' &&
    productUrl.pathname.startsWith('/products/') &&
    typeof item.name === 'string' &&
    item.name.length > 0 &&
    typeof item.price === 'string' &&
    typeof item.amount === 'number' &&
    Number.isFinite(item.amount) &&
    item.amount >= 0 &&
    typeof item.meta === 'string' &&
    imageUrl?.protocol === 'https:' &&
    imageUrl.hostname === 'www.olivestack.com'
  );
}
