import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { metadataForRoute, renderMetadataHead, siteConfig } from './lib/metadata';
import { routePathname, staticRoutes, type Route } from './lib/routes';

export const prerenderRoutes = (): Route[] => staticRoutes();

export const renderRoute = (route: Route) => ({
  appHtml: renderToString(
    <StrictMode>
      <App initialRoute={route} />
    </StrictMode>,
  ),
  headHtml: renderMetadataHead(metadataForRoute(route)),
});

export { routePathname, siteConfig };
