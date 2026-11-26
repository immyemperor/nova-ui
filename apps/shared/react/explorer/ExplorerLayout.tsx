'use client';

import type { ReactNode } from 'react';
import { UiThemeToggle } from '@kvui/react';
import { Explorer } from './Explorer';
import { ComponentPage } from './ComponentPage';
import { IconBrowser } from './IconBrowser';
import { CATEGORIES } from './catalog';
import { hashHref } from './route';
import type { Route } from './route';

/**
 * The component explorer as a full page: header, categorised sidebar, and the selected component, icon set or welcome.
 * `hrefFor` builds links for the host app (hash links by default; use paths in Next.js).
 */
export function ExplorerLayout({
  route,
  hrefFor = hashHref,
  appName,
  backHref,
  backLabel,
  extra,
}: {
  route: Route;
  hrefFor?: (target: Route) => string;
  appName: string;
  backHref: string;
  backLabel: string;
  extra?: ReactNode;
}) {
  const active = route.kind === 'component' ? route.tag : route.kind === 'icons' ? `icons-${route.family}` : 'catalogue';
  return (
    <div className="kvui-shell kvui-shell-sidebar kvui-shell-sticky-side">
      <header className="kvui-shell__header kvui-sticky-top kvui-z-20 kvui-bg-surface kvui-border-b">
        <div className="kvui-cluster kvui-cluster-between kvui-px-4 kvui-py-3">
          <div className="kvui-cluster">
            <a className="kvui-link" href={backHref}>{backLabel}</a>
            <strong>{appName}</strong>
          </div>
          <div className="kvui-cluster">{extra}<UiThemeToggle /></div>
        </div>
      </header>

      <nav className="kvui-shell__sidebar kvui-hide-below-md kvui-p-4 kvui-border-e" aria-label="Component explorer">
        <Explorer active={active} hrefFor={hrefFor} />
      </nav>

      <main className="kvui-shell__main kvui-p-4 kvui-md-p-6" id="main">
        <details className="kvui-hide-md-up kvui-mb-6">
          <summary>Components and icons</summary>
          <div className="kvui-pt-2"><Explorer active={active} hrefFor={hrefFor} /></div>
        </details>
        <div className="kvui-container-lg kvui-stack kvui-stack-lg kvui-ps-0 kvui-pe-0">
          {route.kind === 'component' && <ComponentPage tag={route.tag} />}
          {route.kind === 'icons' && <IconBrowser family={route.family} />}
          {route.kind === 'catalogue' && (
            <section className="kvui-stack kvui-stack-sm" aria-labelledby="welcome">
              <h2 id="welcome" className="kvui-h2">Component explorer</h2>
              <p className="kvui-lead">Choose a component from the sidebar to see a live example, copyable source and its full API. {CATEGORIES.reduce((n, c) => n + c.tags.length, 0)} components in {CATEGORIES.length} categories.</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
