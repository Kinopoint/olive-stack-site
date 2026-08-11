import { Link } from '../Link';
import { paths } from '../../lib/routes';

const NEWSLETTER_URL = 'https://www.olivestack.com/pages/contact#contact_form';

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
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link className="serif footer-logo" href={paths.home()}>
            Olive Stack <em className="footer-logo-em">Gallery</em>
          </Link>
          <div className="footer-blurb">
            Subscribe to the newsletter for new work, workshops and Arts Week news.
          </div>
          <a className="footer-signup footer-signup-link" href={NEWSLETTER_URL}>
            <span>Email updates</span>
            <strong>JOIN →</strong>
          </a>
        </div>

        <nav className="footer-col" aria-label="Shop">
          <div className="footer-heading">SHOP</div>
          {SHOP_LINKS.map((link) => (
            <Link key={link.label} href={link.path}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="footer-col" aria-label="Experience">
          <div className="footer-heading">EXPERIENCE</div>
          {EXPERIENCE_LINKS.map((link) => (
            <Link key={link.label} href={link.path}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="footer-col">
          <div className="footer-heading">VISIT</div>
          <div className="footer-address">
            4 Main Street, Listowel,
            <br />
            Co. Kerry, V31 HW30, Ireland
          </div>
          <a href="https://www.instagram.com/olivestackgallery/">Instagram</a>
          <a href="https://www.facebook.com/OliveStackGallery">Facebook</a>
        </div>
      </div>

      <div className="footer-legal">
        <div>© {new Date().getFullYear()} Olive Stack Gallery</div>
        <nav className="footer-policies" aria-label="Policies">
          {POLICY_LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
