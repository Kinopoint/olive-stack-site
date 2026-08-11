import { useRef, useState } from 'react';
import { Link } from '../Link';
import { useDialog } from '../../hooks/useDialog';
import { paths } from '../../lib/routes';
import { euro } from '../../lib/format';
import { createShopifyCheckout } from '../../lib/shopifyCheckout';
import { useCart } from '../../store/CartContext';
import './cart.css';

interface CartDrawerProps {
  onClose: () => void;
}

export function CartDrawer({ onClose }: CartDrawerProps) {
  const cart = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useDialog(onClose, closeRef);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const hasItems = cart.items.length > 0;

  const checkout = async () => {
    if (checkingOut) return;
    setCheckingOut(true);
    setCheckoutError('');
    try {
      const checkoutUrl = await createShopifyCheckout(cart.items);
      window.location.assign(checkoutUrl);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Checkout failed. Please retry.');
      setCheckingOut(false);
    }
  };

  return (
    <div
      ref={dialogRef}
      className="cart-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      tabIndex={-1}
    >
      <div className="overlay-scrim" onClick={onClose} aria-hidden="true" />
      <div className="cart-drawer">
        <div className="cart-header">
          <div id="cart-title" className="serif cart-title">
            Your <em>cart</em> · {cart.items.length}
          </div>
          <button ref={closeRef} className="overlay-close" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className="cart-body">
          {!hasItems && (
            <div className="cart-empty">
              <div className="serif cart-empty-note">Your cart is empty</div>
              <Link className="pill pill--deep cart-browse" href={paths.collection('landscapes')} onClick={onClose}>
                BROWSE PAINTINGS
              </Link>
            </div>
          )}

          {cart.items.map((item) => (
            <div key={item.id} className="cart-line">
              <img src={item.img} alt="" />
              <div className="cart-line-info">
                <div className="cart-line-top">
                  <a className="serif cart-line-name" href={item.productUrl}>
                    {item.name}
                  </a>
                  <span className="cart-line-price">{item.price}</span>
                </div>
                <div className="cart-line-meta">{item.meta}</div>
                <button className="cart-remove" onClick={() => cart.remove(item.id)}>
                  REMOVE
                </button>
              </div>
            </div>
          ))}

          {hasItems && (
            <div className="cart-note">
              ✳ Shopify verifies current availability and price before secure checkout.
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
            {checkoutError && <div className="cart-checkout-error" role="alert">{checkoutError}</div>}
            <button
              className="pill pill--deep cart-checkout"
              onClick={checkout}
              disabled={checkingOut}
            >
              {checkingOut ? 'OPENING SECURE CHECKOUT…' : 'CHECK OUT SECURELY'}
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
