'use client';

import type { ReactNode } from 'react';
import { UiThemeToggle } from '@omni/react';
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
    <div className="nova-shell nova-shell-sidebar nova-shell-sticky-side">
      <header className="nova-shell__header nova-sticky-top nova-z-20 nova-bg-surface nova-border-b">
        <div className="nova-cluster nova-cluster-between nova-px-4 nova-py-3">
          <div className="nova-cluster">
            <a className="nova-link" href={backHref}>{backLabel}</a>
            <strong>{appName}</strong>
          </div>
          <div className="nova-cluster">{extra}<UiThemeToggle /></div>
        </div>
      </header>

      <nav className="nova-shell__sidebar nova-hide-below-md nova-p-4 nova-border-e" aria-label="Component explorer">
        <Explorer active={active} hrefFor={hrefFor} />
      </nav>

      <main className="nova-shell__main nova-p-4 nova-md-p-6" id="main">
        <details className="nova-hide-md-up nova-mb-6">
          <summary>Components and icons</summary>
          <div className="nova-pt-2"><Explorer active={active} hrefFor={hrefFor} /></div>
        </details>
        <div className="nova-container-lg nova-stack nova-stack-lg nova-ps-0 nova-pe-0">
          {route.kind === 'component' && <ComponentPage tag={route.tag} />}
          {route.kind === 'icons' && <IconBrowser family={route.family} />}
          {route.kind === 'catalogue' && (
            <section className="nova-stack nova-stack-sm" aria-labelledby="welcome">
              <h2 id="welcome" className="nova-h2">Component explorer</h2>
              <p className="nova-lead">Choose a component from the sidebar to see a live example, copyable source and its full API. {CATEGORIES.reduce((n, c) => n + c.tags.length, 0)} components in {CATEGORIES.length} categories.</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
