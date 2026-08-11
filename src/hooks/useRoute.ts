import { useEffect, useState } from 'react';
import { parsePathname, type Route } from '../lib/routes';

export function navigate(href: string): void {
  const target = new URL(href, window.location.href);
  if (target.href === window.location.href) return;
  window.history.pushState(null, '', target);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function useRoute(initialRoute?: Route): Route {
  const [route, setRoute] = useState<Route>(
    () => initialRoute ?? parsePathname(window.location.pathname),
  );

  useEffect(() => {
    const onPopState = () => setRoute(parsePathname(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return route;
}
