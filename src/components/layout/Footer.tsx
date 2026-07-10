import { useState } from 'react';
import { navigate } from '../../hooks/useHashRoute';
import { paths } from '../../lib/routes';

const SHOP_LINKS = [
  { label: 'Paintings', path: paths.collection('landscapes') },
  { label: 'Prints', path: paths.collection('prints') },
  { label: 'Jewellery', path: paths.collection('pendants') },
  { label: 'Gift cards', path: paths.giftcard() },
];

const EXPERIENCE_LINKS = [
  { label: 'Arts Week', path: paths.artsweek() },
  { label: 'Workshops', path: paths.workshops() },
  { label: 'Residency', path: paths.residency() },
  { label: 'Testimonials', path: paths.testimonials() },
];

const POLICY_LINKS = [
  { label: 'Privacy', href: 'https://www.olivestack.com/policies/privacy-policy' },
  { label: 'Shipping', href: 'https://www.olivestack.com/policies/shipping-policy' },
  { label: 'Refunds', href: 'https://www.olivestack.com/policies/refund-policy' },
  { label: 'Terms', href: 'https://www.olivestack.com/policies/terms-of-service' },
  { label: 'Legal', href: 'https://www.olivestack.com/policies/legal-notice' },
];

export function Footer() {
  const [joined, setJoined] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="serif footer-logo">
            Olive Stack <em className="footer-logo-em">Gallery</em>
          </div>
          <div className="footer-blurb">
            Subscribe to the newsletter for new work, workshops and Arts Week news.
          </div>
          <form
            className="footer-signup"
            onSubmit={(e) => {
              e.preventDefault();
              setJoined(true);
            }}
          >
            <input placeholder="Email address" type="email" aria-label="Email address" />
            <button type="submit">{joined ? '✓' : 'JOIN'}</button>
          </form>
        </div>

        <div className="footer-col">
          <div className="footer-heading">SHOP</div>
          {SHOP_LINKS.map((l) => (
            <button key={l.label} onClick={() => navigate(l.path)}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="footer-col">
          <div className="footer-heading">EXPERIENCE</div>
          {EXPERIENCE_LINKS.map((l) => (
            <button key={l.label} onClick={() => navigate(l.path)}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="footer-col">
          <div className="footer-heading">VISIT</div>
          <div className="footer-address">
            Main Street, Listowel,
            <br />
            Co. Kerry, Ireland
          </div>
          <a href="https://www.instagram.com/olivestackgallery/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://www.facebook.com/OliveStackGallery" target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </div>

      <div className="footer-legal">
        <div>© 2026 Olive Stack Gallery</div>
        <div className="footer-policies">
          {POLICY_LINKS.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
