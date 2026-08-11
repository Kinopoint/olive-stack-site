import { useEffect, useRef, useState } from 'react';
import { Link } from '../Link';
import { paths, routeHref, type Route } from '../../lib/routes';
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

type MenuId = 'shop' | 'arts-week' | 'residency';

const menuOf = (group: 'paintings' | 'jewellery' | 'more'): MenuLink[] =>
  collectionsInGroup(group).map((collection) => ({
    label: collection.label,
    path: paths.collection(collection.key),
  }));

const MORE_MENU: MenuLink[] = [
  ...menuOf('more'),
  { label: 'Gift Cards', path: paths.giftcard() },
  { label: 'Workshops', path: paths.workshops() },
];

const ARTS_WEEK_MENU: MenuLink[] = [
  { label: 'Listowel Visual Arts Week', path: paths.artsweek() },
  { label: '2026 Programme Archive', path: paths.workshops() },
  { label: 'Sponsors', path: paths.sponsors() },
];

const RESIDENCY_MENU: MenuLink[] = [
  { label: 'Artists Residency', path: paths.residency() },
  { label: 'Residency Information', path: paths.residencyInfo() },
  { label: 'Testimonials', path: paths.testimonials() },
  { label: 'Photo Gallery', path: paths.photos() },
];

function MenuColumn({
  heading,
  links,
  route,
  onNavigate,
}: {
  heading?: string;
  links: MenuLink[];
  route: Route;
  onNavigate: () => void;
}) {
  const currentHref = routeHref(route);
  return (
    <div className="nav-menu-col">
      {heading && <div className="menu-kicker">{heading}</div>}
      {links.map((link) => (
        <Link
          key={link.label}
          className="nav-menu-link"
          href={link.path}
          onClick={onNavigate}
          aria-current={currentHref === link.path ? 'page' : undefined}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export function Nav({ route, onToggleSearch, onToggleCart }: NavProps) {
  const cart = useCart();
  const headerRef = useRef<HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const page = route.page;
  const shopActive = page === 'collection' || page === 'product' || page === 'giftcard';
  const artsWeekActive = page === 'artsweek' || page === 'workshops' || page === 'sponsors';
  const residencyActive =
    page === 'residency' || page === 'residency-info' || page === 'testimonials' || page === 'photos';

  const closeNavigation = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  useEffect(closeNavigation, [route]);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) closeNavigation();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (
        event.key === 'Escape' &&
        !document.querySelector('[role="dialog"][aria-modal="true"]')
      ) {
        closeNavigation();
      }
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const toggleMenu = (menu: MenuId) => setOpenMenu((current) => (current === menu ? null : menu));
  const openSearch = () => {
    setOpenMenu(null);
    onToggleSearch();
  };
  const openCart = () => {
    closeNavigation();
    onToggleCart();
  };

  return (
    <header ref={headerRef} className="nav">
      <Link className="nav-brand serif" href={paths.home()} onClick={closeNavigation}>
        Olive Stack <em>Gallery</em>
      </Link>

      <div id="main-menu" className={`nav-panel${mobileOpen ? ' is-open' : ''}`}>
        <nav className="nav-links" aria-label="Main navigation">
          <div className="nav-item">
            <button
              className={`nav-link${shopActive ? ' is-active' : ''}`}
              onClick={() => toggleMenu('shop')}
              aria-expanded={openMenu === 'shop'}
              aria-controls="shop-menu"
            >
              Shop <span aria-hidden="true">⌄</span>
            </button>
            <div id="shop-menu" className="nav-menu nav-menu--wide" hidden={openMenu !== 'shop'}>
              <MenuColumn heading="PAINTINGS" links={menuOf('paintings')} route={route} onNavigate={closeNavigation} />
              <MenuColumn heading="MICRO MOSAIC JEWELLERY" links={menuOf('jewellery')} route={route} onNavigate={closeNavigation} />
              <MenuColumn heading="MORE" links={MORE_MENU} route={route} onNavigate={closeNavigation} />
            </div>
          </div>

          <div className="nav-item">
            <button
              className={`nav-link${artsWeekActive ? ' is-active' : ''}`}
              onClick={() => toggleMenu('arts-week')}
              aria-expanded={openMenu === 'arts-week'}
              aria-controls="arts-week-menu"
            >
              Arts Week <span aria-hidden="true">⌄</span>
            </button>
            <div id="arts-week-menu" className="nav-menu" hidden={openMenu !== 'arts-week'}>
              <MenuColumn links={ARTS_WEEK_MENU} route={route} onNavigate={closeNavigation} />
            </div>
          </div>

          <div className="nav-item">
            <button
              className={`nav-link${residencyActive ? ' is-active' : ''}`}
              onClick={() => toggleMenu('residency')}
              aria-expanded={openMenu === 'residency'}
              aria-controls="residency-menu"
            >
              Residency <span aria-hidden="true">⌄</span>
            </button>
            <div id="residency-menu" className="nav-menu" hidden={openMenu !== 'residency'}>
              <MenuColumn links={RESIDENCY_MENU} route={route} onNavigate={closeNavigation} />
            </div>
          </div>

          <Link
            className={`nav-link${page === 'contact' ? ' is-active' : ''}`}
            href={paths.contact()}
            onClick={closeNavigation}
            aria-current={page === 'contact' ? 'page' : undefined}
          >
            Contact
          </Link>
        </nav>

        <div className="nav-actions">
          <button className="nav-link" onClick={openSearch}>Search</button>
          <a href="https://www.olivestack.com/account">
            Log in
          </a>
        </div>
      </div>

      <button className="nav-cart" onClick={openCart}>
        Cart · {cart.items.length}
      </button>
      <button
        className="nav-mobile-toggle"
        onClick={() => setMobileOpen((open) => !open)}
        aria-expanded={mobileOpen}
        aria-controls="main-menu"
      >
        {mobileOpen ? 'Close' : 'Menu'}
      </button>
    </header>
  );
}
