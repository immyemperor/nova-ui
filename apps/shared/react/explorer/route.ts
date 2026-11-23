'use client';

import { useSyncExternalStore } from 'react';

/** What the main area shows, taken from the URL hash. */
export type Route =
  | { kind: 'catalogue' }
  | { kind: 'component'; tag: string }
  | { kind: 'icons'; family: 'material' | 'nova' };

export function parseRoute(hash: string): Route {
  const component = /^#\/component\/([\w-]+)/.exec(hash);
  if (component) return { kind: 'component', tag: component[1] };
  if (hash.startsWith('#/icons/nova')) return { kind: 'icons', family: 'nova' };
  if (hash.startsWith('#/icons')) return { kind: 'icons', family: 'material' };
  return { kind: 'catalogue' };
}

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};

/** The current route. Re-renders when the hash changes. */
export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => '');
  return parseRoute(hash);
}

/** Where a route points, as a hash link (single-page apps that route with the URL hash). */
export function hashHref(target: Route): string {
  if (target.kind === 'component') return `#/component/${target.tag}`;
  if (target.kind === 'icons') return `#/icons/${target.family}`;
  return '#/';
}
