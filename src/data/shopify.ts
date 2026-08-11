import catalogJson from './shopify.generated.json';

export interface ShopifyVariant {
  id: string;
  title: string;
  price: number;
  available: boolean;
}

export interface ShopifyProduct {
  id: string | null;
  handle: string;
  title: string;
  url: string;
  available: boolean;
  archived: boolean;
  variants: ShopifyVariant[];
}

interface ShopifyCatalog {
  schemaVersion: number;
  syncedAt: string;
  products: Record<string, ShopifyProduct>;
  workshops: Record<string, ShopifyProduct>;
  giftCards: Record<string, ShopifyProduct>;
}

export const shopifyCatalog = catalogJson as ShopifyCatalog;

export const productKey = (collectionKey: string, slug: string): string =>
  `${collectionKey}/${slug}`;

export const shopifyProduct = (
  collectionKey: string,
  slug: string,
): ShopifyProduct | undefined => shopifyCatalog.products[productKey(collectionKey, slug)];

export const shopifyWorkshop = (key: string): ShopifyProduct | undefined =>
  shopifyCatalog.workshops[key];

export const shopifyGiftCard = (key: 'gallery' | 'artsWeek'): ShopifyProduct =>
  shopifyCatalog.giftCards[key];

export const availableVariants = (product: ShopifyProduct): ShopifyVariant[] =>
  product.variants.filter((variant) => variant.available);

export const singleAvailableVariant = (product: ShopifyProduct): ShopifyVariant | undefined => {
  const variants = availableVariants(product);
  return variants.length === 1 ? variants[0] : undefined;
};
