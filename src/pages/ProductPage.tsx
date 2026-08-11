import { useEffect, useMemo, useState } from 'react';
import { Link } from '../components/Link';
import { paths } from '../lib/routes';
import { euro } from '../lib/format';
import { findArtwork, imageSrcSet } from '../data/collections';
import { availableVariants, shopifyProduct } from '../data/shopify';
import { useCart } from '../store/CartContext';
import './product.css';

interface ProductPageProps {
  collectionKey: string;
  slug: string;
  onAdded: () => void;
}

export function ProductPage({ collectionKey, slug, onAdded }: ProductPageProps) {
  const cart = useCart();
  const match = findArtwork(collectionKey, slug);
  const liveProduct = shopifyProduct(collectionKey, slug);
  const variants = useMemo(
    () => (liveProduct ? availableVariants(liveProduct) : []),
    [liveProduct],
  );
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.length === 1 ? variants[0].id : '',
  );

  useEffect(() => {
    setSelectedVariantId(variants.length === 1 ? variants[0].id : '');
  }, [collectionKey, slug, variants]);

  if (!match) return null;

  const { collection, item } = match;
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId);
  const sold = !liveProduct?.available || variants.length === 0;
  const inCart = selectedVariant ? cart.has(selectedVariant.id) : false;
  const details = item.details ?? [
    { label: 'TYPE', value: item.meta },
    { label: 'COLLECTION', value: collection.label },
  ];
  const related = collection.items.filter((relatedItem) => relatedItem.slug !== item.slug).slice(0, 4);

  const addToCart = () => {
    if (!liveProduct || !selectedVariant || sold) return;
    if (!inCart) {
      cart.add({
        id: selectedVariant.id,
        variantId: selectedVariant.id,
        productUrl: liveProduct.url,
        name: item.name,
        price: euro(selectedVariant.price),
        amount: selectedVariant.price,
        meta:
          selectedVariant.title === 'Default Title'
            ? item.meta
            : `${item.meta} · ${selectedVariant.title.toUpperCase()}`,
        img: item.img.replace(/width=\d+/, 'width=300'),
      });
    }
    onAdded();
  };

  const addLabel = sold
    ? 'SOLD OR UNAVAILABLE'
    : variants.length > 1 && !selectedVariant
      ? 'CHOOSE AN OPTION'
      : inCart
        ? 'IN CART ✓'
        : 'ADD TO CART';

  return (
    <div>
      <div className="product-layout">
        <div className="product-media">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href={paths.home()}>HOME</Link> /{' '}
            <Link href={paths.collection(collection.key)}>
              {collection.label.toUpperCase()}
            </Link>{' '}
            / <span className="crumb-current" aria-current="page">{item.name.toUpperCase()}</span>
          </nav>
          <img
            src={item.img.replace(/width=\d+/, 'width=1400')}
            srcSet={imageSrcSet(item.img)}
            sizes="(max-width: 1024px) calc(100vw - 40px), 54vw"
            alt={item.name}
            className="product-img"
            fetchPriority="high"
          />
        </div>

        <div className="product-info">
          <div className="kicker">{collection.kicker}</div>
          <h1 className="serif product-name">{item.name}</h1>
          <div className="product-price-row">
            <div className="serif product-price">
              {selectedVariant ? euro(selectedVariant.price) : item.price}
            </div>
            <div className="product-tax-note">
              Taxes included · shipping calculated at checkout
            </div>
          </div>
          <dl className="product-details">
            {details.map((detail) => (
              <div key={detail.label} className="product-detail">
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
          {variants.length > 1 && (
            <label className="product-variant-label">
              FORMAT
              <select
                className="product-variant-select"
                value={selectedVariantId}
                onChange={(event) => setSelectedVariantId(event.target.value)}
              >
                <option value="">Choose an option</option>
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.title} · {euro(variant.price)}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            className={`product-add${sold ? ' is-sold' : ''}`}
            onClick={addToCart}
            disabled={sold || !selectedVariant}
          >
            {addLabel}
          </button>
          <Link className="pill pill--outline product-enquire" href={paths.contact()}>
            ENQUIRE ABOUT THIS PIECE
          </Link>
          {liveProduct && (
            <a className="product-live-link" href={liveProduct.url}>
              View current availability on the secure shop →
            </a>
          )}
          <p className="product-desc">{item.description || collection.productDesc}</p>
          <div className="product-notes">
            <span>✳ Ships worldwide, fully insured</span>
            <span>✳ Certificate of authenticity</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="product-related">
          <div className="product-related-head">
            <h2 className="serif product-related-title">
              More from this <em>collection</em>
            </h2>
            <Link className="link-underline" href={paths.collection(collection.key)}>
              VIEW ALL →
            </Link>
          </div>
          <div className="product-related-grid">
            {related.map((relatedItem) => (
              <Link
                key={relatedItem.slug}
                className="product-related-card"
                href={paths.product(collection.key, relatedItem.slug)}
              >
                <img
                  src={relatedItem.img}
                  srcSet={imageSrcSet(relatedItem.img, [240, 360, 480, 640])}
                  sizes="(max-width: 1024px) 46vw, 23vw"
                  alt={relatedItem.name}
                  loading="lazy"
                  decoding="async"
                />
                <div className="product-related-row">
                  <span className="serif">{relatedItem.name}</span>
                  <span className="product-related-price">{relatedItem.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
