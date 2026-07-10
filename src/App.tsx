import { useEffect, useState } from 'react';
import { useHashRoute } from './hooks/useHashRoute';
import { CartProvider } from './store/CartContext';
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
import type { Route } from './lib/routes';

function Page({
  route,
  onCartOpen,
}: {
  route: Route;
  onCartOpen: () => void;
}) {
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
  }
}

export default function App() {
  const route = useHashRoute();
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // A navigation closes overlays and returns to the top, as on a page load.
  useEffect(() => {
    setSearchOpen(false);
    setCartOpen(false);
    window.scrollTo(0, 0);
  }, [route]);

  return (
    <CartProvider>
      <Ticker />
      <Nav
        route={route}
        onToggleSearch={() => setSearchOpen((open) => !open)}
        onToggleCart={() => setCartOpen((open) => !open)}
      />
      <main>
        <Page route={route} onCartOpen={() => setCartOpen(true)} />
      </main>
      <Footer />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </CartProvider>
  );
}
