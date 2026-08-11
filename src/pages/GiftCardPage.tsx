import { useState } from 'react';
import { Link } from '../components/Link';
import { artsWeekPhase } from '../data/events';
import { availableVariants, shopifyGiftCard } from '../data/shopify';
import { paths } from '../lib/routes';
import { euro } from '../lib/format';
import { useCart } from '../store/CartContext';
import './giftcard.css';

const GIFT_CARD_IMG =
  'https://www.olivestack.com/cdn/shop/collections/Hawthorn_Harmony.jpg?v=1763732386&width=400';

interface GiftCardPageProps {
  onAdded: () => void;
}

export function GiftCardPage({ onAdded }: GiftCardPageProps) {
  const cart = useCart();
  const giftCard = shopifyGiftCard('gallery');
  const variants = availableVariants(giftCard);
  const defaultVariant = variants.find((variant) => variant.price === 100) || variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant?.id || '');
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) || defaultVariant;
  const inCart = selectedVariant ? cart.has(selectedVariant.id) : false;
  const artsWeekEnded = artsWeekPhase() === 'past';

  const addGift = () => {
    if (!selectedVariant) return;
    if (!inCart) {
      cart.add({
        id: selectedVariant.id,
        variantId: selectedVariant.id,
        productUrl: giftCard.url,
        name: `Gallery Gift Card · ${euro(selectedVariant.price)}`,
        price: euro(selectedVariant.price),
        amount: selectedVariant.price,
        meta: 'GIFT CARD · DELIVERED BY EMAIL',
        img: GIFT_CARD_IMG,
      });
    }
    onAdded();
  };

  return (
    <div className="giftcard-page">
      <div className="giftcard-intro">
        <div className="kicker">GIFT CARDS</div>
        <h1 className="serif giftcard-title">
          The perfect present for the <em>creative person</em> in your life
        </h1>
        <p className="giftcard-blurb">
          Delivered by email, redeemable against any painting, print, piece of jewellery or
          workshop.
        </p>
      </div>

      <div className="giftcard-grid">
        <div className="giftcard-card giftcard-card--gallery">
          <div className="menu-kicker">THE GALLERY</div>
          <h2 className="serif giftcard-card-title">Olive Stack Gallery Gift Card</h2>
          <div className="giftcard-review">
            “Very easy to navigate website and voucher received promptly.”{' '}
            <span className="giftcard-review-tag">· VERIFIED REVIEW</span>
          </div>
          {variants.length > 0 ? (
            <div className="giftcard-amounts" role="group" aria-label="Gift card amount">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  className={`giftcard-amount${variant.id === selectedVariant?.id ? ' is-active' : ''}`}
                  onClick={() => setSelectedVariantId(variant.id)}
                  aria-pressed={variant.id === selectedVariant?.id}
                >
                  {euro(variant.price)}
                </button>
              ))}
            </div>
          ) : (
            <p className="giftcard-unavailable">Gift cards are temporarily unavailable online.</p>
          )}
          <button
            className="pill pill--deep giftcard-add"
            onClick={addGift}
            disabled={!selectedVariant}
          >
            {!selectedVariant
              ? 'CURRENTLY UNAVAILABLE'
              : inCart
                ? 'IN CART ✓'
                : `ADD ${euro(selectedVariant.price)} CARD TO CART`}
          </button>
          <a className="giftcard-live-link" href={giftCard.url}>
            View gift card details on the secure shop →
          </a>
        </div>

        <div className="giftcard-card giftcard-card--artsweek">
          <div className="menu-kicker">ARTS WEEK 2026</div>
          <h2 className="serif giftcard-card-title">Listowel Visual Arts Week</h2>
          <div className="giftcard-review">
            {artsWeekEnded
              ? 'The 2026 gathering has concluded. Revisit the programme and watch for future announcements.'
              : 'Workshop gift cards are available on the secure Olive Stack Gallery shop.'}
          </div>
          <div className="giftcard-ctas">
            <Link className="pill pill--bronze" href={paths.workshops()}>
              {artsWeekEnded ? 'VIEW 2026 PROGRAMME' : 'SEE 2026 WORKSHOPS'}
            </Link>
            {!artsWeekEnded && (
              <a className="pill pill--outline" href={shopifyGiftCard('artsWeek').url}>
                BUY ON SECURE SHOP →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
