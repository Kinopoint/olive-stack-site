import { useEffect, useState } from 'react';
import { parseHash, type Route } from '../lib/routes';

export function navigate(path: string): void {
  window.location.hash = path;
}

/** Current route derived from location.hash; re-renders on hash changes. */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
