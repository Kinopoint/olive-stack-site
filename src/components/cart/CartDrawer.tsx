import { useState } from 'react';
import { navigate } from '../../hooks/useHashRoute';
import { paths } from '../../lib/routes';
import { euro } from '../../lib/format';
import { useCart } from '../../store/CartContext';
import './cart.css';

interface CartDrawerProps {
  onClose: () => void;
}

export function CartDrawer({ onClose }: CartDrawerProps) {
  const cart = useCart();
  const [checkedOut, setCheckedOut] = useState(false);
  const hasItems = cart.items.length > 0;

  return (
    <div className="cart-overlay" role="dialog" aria-label="Shopping cart">
      <button className="overlay-scrim" onClick={onClose} aria-label="Close cart" />
      <div className="cart-drawer">
        <div className="cart-header">
          <div className="serif cart-title">
            Your <em>cart</em> · {cart.items.length}
          </div>
          <button className="overlay-close" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className="cart-body">
          {!hasItems && (
            <div className="cart-empty">
              <div className="serif cart-empty-note">Your cart is empty</div>
              <button
                className="pill pill--deep cart-browse"
                onClick={() => navigate(paths.collection('landscapes'))}
              >
                BROWSE PAINTINGS
              </button>
            </div>
          )}

          {cart.items.map((item) => (
            <div key={item.name} className="cart-line">
              <img src={item.img} alt={item.name} />
              <div className="cart-line-info">
                <div className="cart-line-top">
                  <span className="serif cart-line-name">{item.name}</span>
                  <span className="cart-line-price">{item.price}</span>
                </div>
                <div className="cart-line-meta">{item.meta}</div>
                <button className="cart-remove" onClick={() => cart.remove(item.name)}>
                  REMOVE
                </button>
              </div>
            </div>
          ))}

          {hasItems && (
            <div className="cart-note">
              ✳ Ships worldwide, fully insured · certificate of authenticity included with every
              original.
            </div>
          )}
        </div>

        {hasItems && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span className="cart-subtotal-label">Subtotal</span>
              <span className="serif cart-subtotal-value">{euro(cart.subtotal)}</span>
            </div>
            <div className="cart-taxes">Taxes included. Shipping calculated at checkout.</div>
            <button className="pill pill--deep cart-checkout" onClick={() => setCheckedOut(true)}>
              {checkedOut ? 'DEMO · CHECKOUT ON LIVE SITE' : 'CHECK OUT'}
            </button>
            <button className="cart-continue" onClick={onClose}>
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
