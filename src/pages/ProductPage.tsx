import { useEffect } from 'react';
import { navigate } from '../hooks/useHashRoute';
import { paths } from '../lib/routes';
import { findArtwork } from '../data/collections';
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

  useEffect(() => {
    if (!match) navigate(paths.home());
  }, [match]);

  if (!match) return null;

  const { collection, item } = match;
  const inCart = cart.has(item.name);
  const details = item.details ?? [
    { label: 'TYPE', value: item.meta },
    { label: 'COLLECTION', value: collection.label },
  ];
  const related = collection.items.filter((i) => i.slug !== item.slug).slice(0, 4);

  const addToCart = () => {
    if (item.sold) return;
    if (!inCart) {
      cart.add({
        name: item.name,
        price: item.price,
        amount: item.amount,
        meta: item.meta,
        img: item.img.replace(/width=\d+/, 'width=300'),
      });
    }
    onAdded();
  };

  return (
    <div>
      <div className="product-layout">
        <div className="product-media">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => navigate(paths.home())}>HOME</button> /{' '}
            <button onClick={() => navigate(paths.collection(collection.key))}>
              {collection.label.toUpperCase()}
            </button>{' '}
            / <span className="crumb-current">{item.name.toUpperCase()}</span>
          </nav>
          <img
            src={item.img.replace(/width=\d+/, 'width=1400')}
            alt={item.name}
            className="product-img"
          />
        </div>

        <div className="product-info">
          <div className="kicker">{collection.kicker}</div>
          <h1 className="serif product-name">{item.name}</h1>
          <div className="product-price-row">
            <div className="serif product-price">{item.price}</div>
            <div className="product-tax-note">
              Taxes included · shipping calculated at checkout
            </div>
          </div>
          <dl className="product-details">
            {details.map((d) => (
              <div key={d.label} className="product-detail">
                <dt>{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            ))}
          </dl>
          <button
            className={`product-add${item.sold ? ' is-sold' : ''}`}
            onClick={addToCart}
            disabled={item.sold}
          >
            {item.sold ? 'SOLD' : inCart ? 'IN CART ✓' : 'ADD TO CART'}
          </button>
          <button
            className="pill pill--outline product-enquire"
            onClick={() => navigate(paths.contact())}
          >
            ENQUIRE ABOUT THIS PIECE
          </button>
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
            <button
              className="link-underline"
              onClick={() => navigate(paths.collection(collection.key))}
            >
              VIEW ALL →
            </button>
          </div>
          <div className="product-related-grid">
            {related.map((r) => (
              <button
                key={r.slug}
                className="product-related-card"
                onClick={() => navigate(paths.product(collection.key, r.slug))}
              >
                <img src={r.img} alt={r.name} loading="lazy" />
                <div className="product-related-row">
                  <span className="serif">{r.name}</span>
                  <span className="product-related-price">{r.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
