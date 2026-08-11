import { useEffect, useState } from 'react';
import { useRoute } from './hooks/useRoute';
import { applyDocumentMetadata } from './lib/metadata';
import { paths, type Route } from './lib/routes';
import { CartProvider } from './store/CartContext';
import { Link } from './components/Link';
import { Ticker } from './components/layout/Ticker';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { SearchOverlay } from './components/search/SearchOverlay';
import { CartDrawer } from './components/cart/CartDrawer';
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductPage } from './pages/ProductPage';
import { GiftCardPage } from './pages/GiftCardPage';
import { ArtsWeekPage } from './pages/ArtsWeekPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { SponsorsPage } from './pages/SponsorsPage';
import { ResidencyPage } from './pages/ResidencyPage';
import { ResidencyInfoPage } from './pages/ResidencyInfoPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { PhotosPage } from './pages/PhotosPage';
import { ContactPage } from './pages/ContactPage';

function NotFoundPage() {
  return (
    <section className="collection-empty" aria-labelledby="not-found-heading">
      <div className="kicker">404 · PAGE NOT FOUND</div>
      <h1 id="not-found-heading" className="serif collection-empty-note">
        This page has <em>moved on</em>
      </h1>
      <p>
        The address may be out of date. Return to the gallery or continue browsing Olive’s work.
      </p>
      <Link className="pill pill--deep" href={paths.home()}>
        RETURN TO THE GALLERY
      </Link>
    </section>
  );
}

function Page({ route, onCartOpen }: { route: Route; onCartOpen: () => void }) {
  switch (route.page) {
    case 'home':
      return <HomePage />;
    case 'collection':
      return <CollectionPage collectionKey={route.key} />;
    case 'product':
      return (
        <ProductPage
          collectionKey={route.collectionKey}
          slug={route.slug}
          onAdded={onCartOpen}
        />
      );
    case 'giftcard':
      return <GiftCardPage onAdded={onCartOpen} />;
    case 'artsweek':
      return <ArtsWeekPage onBooked={onCartOpen} />;
    case 'workshops':
      return <WorkshopsPage onBooked={onCartOpen} />;
    case 'sponsors':
      return <SponsorsPage />;
    case 'residency':
      return <ResidencyPage />;
    case 'residency-info':
      return <ResidencyInfoPage />;
    case 'testimonials':
      return <TestimonialsPage />;
    case 'photos':
      return <PhotosPage />;
    case 'contact':
      return <ContactPage />;
    case 'not-found':
      return <NotFoundPage />;
  }
}

export interface AppProps {
  initialRoute?: Route;
}

export default function App({ initialRoute }: AppProps) {
  const route = useRoute(initialRoute);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    applyDocumentMetadata(route);
    setSearchOpen(false);
    setCartOpen(false);
    window.scrollTo(0, 0);
  }, [route]);

  return (
    <CartProvider>
      <div id="app-shell">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Ticker />
        <Nav
          route={route}
          onToggleSearch={() => setSearchOpen((open) => !open)}
          onToggleCart={() => setCartOpen((open) => !open)}
        />
        <main id="main-content" tabIndex={-1}>
          <Page route={route} onCartOpen={() => setCartOpen(true)} />
        </main>
        <Footer />
      </div>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </CartProvider>
  );
}
