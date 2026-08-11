// Global styles first so page/component CSS wins ties in the cascade.
import './styles/global.css';
import './components/layout/layout.css';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { parseLegacyHash, parsePathname, routeHref } from './lib/routes';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found');

const legacyRedirect = window.location.hash.startsWith('#/');
if (legacyRedirect) {
  const legacyRoute = parseLegacyHash(window.location.hash);
  window.history.replaceState(null, '', `${routeHref(legacyRoute)}${window.location.search}`);
  rootElement.replaceChildren();
}

const initialRoute = parsePathname(window.location.pathname);
const app = (
  <StrictMode>
    <App initialRoute={initialRoute} />
  </StrictMode>
);

if (!legacyRedirect && rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
