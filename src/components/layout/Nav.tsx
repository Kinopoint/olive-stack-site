import { navigate } from '../../hooks/useHashRoute';
import { paths, type Route } from '../../lib/routes';
import { collectionsInGroup } from '../../data/collections';
import { useCart } from '../../store/CartContext';

interface NavProps {
  route: Route;
  onToggleSearch: () => void;
  onToggleCart: () => void;
}

interface MenuLink {
  label: string;
  path: string;
}

const menuOf = (group: 'paintings' | 'jewellery' | 'more'): MenuLink[] =>
  collectionsInGroup(group).map((c) => ({ label: c.label, path: paths.collection(c.key) }));

const MORE_MENU: MenuLink[] = [
  ...menuOf('more'),
  { label: 'Gift Cards', path: paths.giftcard() },
  { label: 'Workshops', path: paths.workshops() },
];

const ARTS_WEEK_MENU: MenuLink[] = [
  { label: 'Listowel Visual Arts Week', path: paths.artsweek() },
  { label: 'Workshops', path: paths.workshops() },
  { label: 'Arts Week Gift Card', path: paths.giftcard() },
  { label: 'Sponsors 2026', path: paths.sponsors() },
];

const RESIDENCY_MENU: MenuLink[] = [
  { label: 'Artists Residency', path: paths.residency() },
  { label: 'Residency Information', path: paths.residencyInfo() },
  { label: 'Testimonials', path: paths.testimonials() },
  { label: 'Photo Gallery', path: paths.photos() },
];

function MenuColumn({ heading, links }: { heading?: string; links: MenuLink[] }) {
  return (
    <div className="nav-menu-col">
      {heading && <div className="menu-kicker">{heading}</div>}
      {links.map((link) => (
        <button key={link.label} className="nav-menu-link" onClick={() => navigate(link.path)}>
          {link.label}
        </button>
      ))}
    </div>
  );
}

export function Nav({ route, onToggleSearch, onToggleCart }: NavProps) {
  const cart = useCart();
  const page = route.page;

  const shopActive = page === 'collection' || page === 'product' || page === 'giftcard';
  const artsweekActive = page === 'artsweek' || page === 'workshops' || page === 'sponsors';
  const residencyActive =
    page === 'residency' || page === 'residency-info' || page === 'testimonials' || page === 'photos';

  return (
    <header className="nav">
      <button className="nav-brand serif" onClick={() => navigate(paths.home())}>
        Olive Stack <em>Gallery</em>
      </button>

      <nav className="nav-links" aria-label="Main navigation">
        <div className="nav-item">
          <button
            className={`nav-link${shopActive ? ' is-active' : ''}`}
            onClick={() => navigate(paths.collection('landscapes'))}
          >
            Shop ▾
          </button>
          <div className="nav-menu nav-menu--wide">
            <MenuColumn heading="PAINTINGS" links={menuOf('paintings')} />
            <MenuColumn heading="MICRO MOSAIC JEWELLERY" links={menuOf('jewellery')} />
            <MenuColumn heading="MORE" links={MORE_MENU} />
          </div>
        </div>

        <div className="nav-item">
          <button
            className={`nav-link${artsweekActive ? ' is-active' : ''}`}
            onClick={() => navigate(paths.artsweek())}
          >
            Arts Week ▾
          </button>
          <div className="nav-menu">
            <MenuColumn links={ARTS_WEEK_MENU} />
          </div>
        </div>

        <div className="nav-item">
          <button
            className={`nav-link${residencyActive ? ' is-active' : ''}`}
            onClick={() => navigate(paths.residency())}
          >
            Residency ▾
          </button>
          <div className="nav-menu">
            <MenuColumn links={RESIDENCY_MENU} />
          </div>
        </div>

        <button
          className={`nav-link${page === 'contact' ? ' is-active' : ''}`}
          onClick={() => navigate(paths.contact())}
        >
          Contact
        </button>
      </nav>

      <div className="nav-actions">
        <button className="nav-link" onClick={onToggleSearch}>
          Search
        </button>
        <a
          href="https://www.olivestack.com/customer_authentication/redirect?locale=en&region_country=IE"
          target="_blank"
          rel="noreferrer"
        >
          Log in
        </a>
        <button className="nav-cart" onClick={onToggleCart}>
          Cart · {cart.items.length}
        </button>
      </div>
    </header>
  );
}
