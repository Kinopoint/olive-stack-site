import { useState } from 'react';
import { navigate } from '../hooks/useHashRoute';
import { paths } from '../lib/routes';
import { useCart } from '../store/CartContext';
import './giftcard.css';

const AMOUNTS = [50, 100, 150, 250];
const DEFAULT_AMOUNT = 100;
const GIFT_CARD_IMG =
  'https://www.olivestack.com/cdn/shop/collections/Hawthorn_Harmony.jpg?v=1763732386&width=400';

interface GiftCardPageProps {
  onAdded: () => void;
}

export function GiftCardPage({ onAdded }: GiftCardPageProps) {
  const cart = useCart();
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);

  const giftName = `Gallery Gift Card · €${amount}`;
  const inCart = cart.has(giftName);

  const addGift = () => {
    if (!inCart) {
      cart.add({
        name: giftName,
        price: `€${amount}`,
        amount,
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
          <div className="giftcard-amounts">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                className={`giftcard-amount${a === amount ? ' is-active' : ''}`}
                onClick={() => setAmount(a)}
              >
                €{a}
              </button>
            ))}
          </div>
          <button className="pill pill--deep giftcard-add" onClick={addGift}>
            {inCart ? 'IN CART ✓' : `ADD €${amount} CARD TO CART`}
          </button>
        </div>

        <div className="giftcard-card giftcard-card--artsweek">
          <div className="menu-kicker">ARTS WEEK 2026</div>
          <h2 className="serif giftcard-card-title">Listowel Visual Arts Week Gift Card</h2>
          <div className="giftcard-review">
            From €50. Redeemable against 2026 workshops, life drawing and events during the ten-day
            gathering.
          </div>
          <div className="giftcard-ctas">
            <button className="pill pill--bronze" onClick={() => navigate(paths.workshops())}>
              SEE 2026 WORKSHOPS
            </button>
            <a
              className="pill pill--outline"
              href="https://www.olivestack.com/products/listowel-visual-arts-week-gift-card"
              target="_blank"
              rel="noreferrer"
            >
              BUY ON LIVE SITE →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
