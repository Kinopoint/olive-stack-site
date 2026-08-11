import type { CartItem } from '../store/cart';

const endpoint = 'https://www.olivestack.com/api/2026-07/graphql.json';

interface GraphqlPayload<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

const storefrontRequest = async <T,>(query: string, variables: object): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new Error('The secure shop could not be reached. Check your connection and retry.');
  }

  if (!response.ok) throw new Error('The secure shop is temporarily unavailable. Please retry.');

  let payload: GraphqlPayload<T>;
  try {
    payload = (await response.json()) as GraphqlPayload<T>;
  } catch {
    throw new Error('The secure shop returned an unreadable response. Please retry.');
  }
  if (payload.errors?.length || !payload.data) {
    throw new Error('Shopify could not prepare the cart. Please retry.');
  }
  return payload.data;
};

const validateItems = async (items: readonly CartItem[]): Promise<void> => {
  const data = await storefrontRequest<{
    nodes: Array<
      | {
          id: string;
          availableForSale: boolean;
          price: { amount: string; currencyCode: string };
        }
      | null
    >;
  }>(
    `query ValidateVariants($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on ProductVariant {
          id
          availableForSale
          price { amount currencyCode }
        }
      }
    }`,
    { ids: items.map((item) => item.variantId) },
  );

  const unavailable = items.filter((_, index) => !data.nodes[index]?.availableForSale);
  if (unavailable.length) {
    throw new Error(`${unavailable.map((item) => item.name).join(', ')} is no longer available.`);
  }

  const changed = items.filter((item, index) => {
    const price = data.nodes[index]?.price;
    return !price || price.currencyCode !== 'EUR' || Math.round(Number(price.amount) * 100) !== Math.round(item.amount * 100);
  });
  if (changed.length) {
    throw new Error(`The price of ${changed.map((item) => item.name).join(', ')} has changed. Refresh the page before checkout.`);
  }
};

export async function createShopifyCheckout(items: readonly CartItem[]): Promise<string> {
  if (!items.length) throw new Error('Your cart is empty.');
  if (items.some((item) => !item.variantId.startsWith('gid://shopify/ProductVariant/'))) {
    throw new Error('The cart contains an invalid product. Remove it and retry.');
  }
  await validateItems(items);

  const data = await storefrontRequest<{
    cartCreate: {
      cart: { checkoutUrl: string; totalQuantity: number } | null;
      userErrors: Array<{ message: string }>;
      warnings: Array<{ message: string }>;
    };
  }>(
    `mutation CreateCheckout($input: CartInput!) {
      cartCreate(input: $input) {
        cart { checkoutUrl totalQuantity }
        userErrors { message }
        warnings { message }
      }
    }`,
    {
      input: {
        lines: items.map((item) => ({ merchandiseId: item.variantId, quantity: 1 })),
        attributes: [{ key: 'Source', value: window.location.host }],
      },
    },
  );

  const result = data.cartCreate;
  if (result.userErrors.length) throw new Error(result.userErrors[0].message);
  if (result.warnings.length) throw new Error(result.warnings[0].message);
  if (!result.cart || result.cart.totalQuantity !== items.length) {
    throw new Error('Shopify could not add every item. Please retry.');
  }

  const checkoutUrl = new URL(result.cart.checkoutUrl);
  const trustedHost =
    checkoutUrl.hostname === 'www.olivestack.com' ||
    checkoutUrl.hostname === 'olivestack.com' ||
    checkoutUrl.hostname.endsWith('.myshopify.com');
  if (checkoutUrl.protocol !== 'https:' || !trustedHost || !checkoutUrl.searchParams.has('key')) {
    throw new Error('Shopify returned an invalid checkout link. Please retry.');
  }
  return checkoutUrl.href;
}
