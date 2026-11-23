'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { CATEGORIES } from './catalog';
import { hashHref } from './route';
import type { Route } from './route';

const DEMO_SECTIONS: [string, string][] = [
  ['forms', 'Forms'], ['display', 'Display'], ['layout', 'Layout + components'], ['features', 'New features'], ['charts', 'Charts'],
  ['blocks', 'Page blocks'], ['new-features', 'Newest features'], ['editor', 'Rich text editor'], ['data', 'Data'],
  ['navigation', 'Navigation'], ['overlays', 'Overlays'],
];

/** Sidebar: the catalogue, icon browsers, and every component grouped by category, with search. */
export function Explorer({ active, onNavigate, hrefFor = hashHref }: { active: string; onNavigate?: () => void; hrefFor?: (target: Route) => string }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const visible = CATEGORIES
    .map((c) => ({ ...c, tags: c.tags.filter((t) => !q || t.includes(q) || c.label.toLowerCase().includes(q)) }))
    .filter((c) => c.tags.length > 0);

  return (
    <nav aria-label="Component explorer" className="explorer">
      <div className="nova-field nova-mb-3">
        <label className="nova-sr-only" htmlFor="explorer-search">Find a component</label>
        <input id="explorer-search" className="nova-input" type="search" placeholder="Find a component" autoComplete="off"
          value={query} onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} />
      </div>

      <ul className="explorer__list" role="list">
        <li><a href={hrefFor({ kind: 'catalogue' })} className="explorer__link" aria-current={active === 'catalogue' ? 'page' : undefined} onClick={onNavigate}>All demos</a></li>
        <li><a href={hrefFor({ kind: 'icons', family: 'material' })} className="explorer__link" aria-current={active === 'icons-material' ? 'page' : undefined} onClick={onNavigate}>Icons: Material</a></li>
        <li><a href={hrefFor({ kind: 'icons', family: 'nova' })} className="explorer__link" aria-current={active === 'icons-nova' ? 'page' : undefined} onClick={onNavigate}>Icons: Nova</a></li>
      </ul>

      {!q && (
        <details className="explorer__group">
          <summary>Demo catalogue</summary>
          <ul className="explorer__list" role="list">
            {DEMO_SECTIONS.map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="explorer__link" onClick={onNavigate}>{label}</a></li>
            ))}
          </ul>
        </details>
      )}

      {visible.map((c) => (
        <details key={c.id} className="explorer__group" open={!!q || c.tags.includes(active)}>
          <summary>{c.label} <span className="nova-caption">({c.tags.length})</span></summary>
          <ul className="explorer__list" role="list">
            {c.tags.map((t) => (
              <li key={t}>
                <a href={hrefFor({ kind: 'component', tag: t })} className="explorer__link" aria-current={active === t ? 'page' : undefined} onClick={onNavigate}>
                  <code>{t}</code>
                </a>
              </li>
            ))}
          </ul>
        </details>
      ))}
      {visible.length === 0 && <p className="nova-caption">No component matches “{query}”.</p>}
    </nav>
  );
}
