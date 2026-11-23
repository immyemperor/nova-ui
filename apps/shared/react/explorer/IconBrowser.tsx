'use client';

import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { UiIcon, listIcons } from '@nova-ui/react';
import { copyText } from '../CodeBlock';

import { MATERIAL_NAMES } from '../../generated/library';

// The Material stylesheet is linked by each app's page (public/nova-icons.css). It is empty until icons:update has run.
const MATERIAL: string[] = [...MATERIAL_NAMES];
const NOVA: string[] = listIcons();
const PAGE = 180;

export function IconBrowser({ family }: { family: 'material' | 'nova' }) {
  const names = family === 'material' ? MATERIAL : NOVA;
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const [filled, setFilled] = useState(false);
  const [size, setSize] = useState('1.75rem');
  const [copied, setCopied] = useState<string | null>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/-/g, '_');
    return q ? names.filter((n) => n.includes(q)) : names;
  }, [names, query]);
  const shown = matches.slice(0, limit);
  const className = (n: string) => (family === 'material' ? `nova-icon nova-icon-${n.replaceAll('_', '-')}` : '');
  const snippet = (n: string) => (family === 'material'
    ? `<span class="nova-icon nova-icon-${n.replaceAll('_', '-')}${filled ? ' nova-icon-filled' : ''}" aria-hidden="true"></span>`
    : `<ui-icon name="${n}"></ui-icon>`);

  const copy = async (n: string) => {
    if (await copyText(snippet(n))) {
      setCopied(n);
      setTimeout(() => setCopied(null), 1400);
    }
  };

  return (
    <section className="nova-stack nova-stack-lg" aria-labelledby="icons-heading">
      <header className="nova-stack nova-stack-xs">
        <p className="nova-caption">Icons</p>
        <h2 id="icons-heading" className="nova-h2">{family === 'material' ? 'Material Symbols' : 'Nova icons'}</h2>
        <p className="nova-lead">
          {family === 'material'
            ? `${MATERIAL.length.toLocaleString()} Google Material Symbols, drawn with the bundled font. Select an icon to copy its markup.`
            : `${NOVA.length} built-in SVG icons. Select an icon to copy its markup.`}
        </p>
      </header>

      {family === 'material' && MATERIAL.length === 0 && (
        <div className="nova-alert nova-alert-warning" role="status">
          <p className="nova-alert__title">Material names not generated yet</p>
          Run <code>pnpm --filter @nova-ui/css icons:update</code>, then <code>pnpm --filter @nova-ui/css build</code>, and reload.
        </div>
      )}

      <div className="nova-cluster nova-cluster-between">
        <div className="nova-field" style={{ minInlineSize: '14rem', flex: '1 1 16rem' }}>
          <label className="nova-label" htmlFor="icon-search">Search by name</label>
          <input id="icon-search" className="nova-input" type="search" placeholder="e.g. arrow, home, chart" autoComplete="off"
            value={query} onChange={(e: ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); setLimit(PAGE); }} />
        </div>
        <div className="nova-cluster">
          {family === 'material' && (
            <label className="nova-check nova-small"><input type="checkbox" checked={filled} onChange={(e: ChangeEvent<HTMLInputElement>) => setFilled(e.target.checked)} /> Filled</label>
          )}
          <label className="nova-small">Size{' '}
            <select className="nova-select" value={size} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSize(e.target.value)}>
              <option value="1.25rem">Small</option>
              <option value="1.75rem">Medium</option>
              <option value="2.5rem">Large</option>
              <option value="3.5rem">XL</option>
            </select>
          </label>
        </div>
      </div>

      <p className="nova-caption" role="status" aria-live="polite">
        {matches.length ? `Showing ${shown.length.toLocaleString()} of ${matches.length.toLocaleString()}` : 'No icons match'}
      </p>

      <ul className="nova-grid-auto nova-grid-auto-xs nova-gap-2" role="list" aria-label="Icons">
        {shown.map((n) => (
          <li key={n}>
            <button type="button" className="nova-card nova-p-3 nova-stack nova-stack-xs" style={{ width: '100%', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => copy(n)} aria-label={`Copy ${n}`}>
              {family === 'material'
                ? <span className={className(n) + (filled ? ' nova-icon-filled' : '')} style={{ fontSize: size }} aria-hidden="true" />
                : <UiIcon name={n} size={size} />}
              <span className="nova-caption nova-break-words">{copied === n ? 'Copied' : n}</span>
            </button>
          </li>
        ))}
      </ul>

      {limit < matches.length && (
        <div className="nova-cluster nova-cluster-center">
          <button type="button" className="nova-btn nova-btn-secondary" onClick={() => setLimit((l) => l + PAGE)}>
            Show more ({(matches.length - limit).toLocaleString()} left)
          </button>
        </div>
      )}
    </section>
  );
}
