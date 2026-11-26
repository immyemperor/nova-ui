'use client';

import { ExplorerLayout } from '../../../shared/react/explorer/ExplorerLayout';
import type { Route } from '../../../shared/react/explorer/route';

/** Path links for the explorer (Next.js routes by URL, not by hash). */
export function pathHref(target: Route): string {
  if (target.kind === 'component') return `/components/${target.tag}`;
  if (target.kind === 'icons') return `/icons/${target.family}`;
  return '/components';
}

/** Client wrapper: the server pages pass only serialisable data (the route), never functions. */
export function ExplorerClient({ route }: { route: Route }) {
  return <ExplorerLayout route={route} hrefFor={pathHref} appName="Kvui UI on Next.js" backHref="/" backLabel="Home" />;
}
