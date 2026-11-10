import { createElement, useState } from 'react';
import { listIcons } from '@nova-ui/react';
import materialIconNames from '@nova-ui/css/icons.json';

type IconSource = 'nova' | 'material';

const iconNames = listIcons();
const iconElement = (name: string) => createElement('ui-icon', { name, 'aria-hidden': 'true' });
const PAGE_SIZE = 144;

export function IconDemo() {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState('');
  const [source, setSource] = useState<IconSource>('nova');
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const currentIcons = source === 'nova' ? iconNames : materialIconNames;
  const matchingIcons = currentIcons.filter((name) => name.includes(query.trim().toLowerCase()));
  const visibleIcons = matchingIcons.slice(0, displayCount);

  async function copyIconName(name: string) {
    const value = source === 'material' ? `nova-icon-${name.replaceAll('_', '-')}` : name;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(''), 1200);
    } catch {
      setCopied('Clipboard unavailable');
      window.setTimeout(() => setCopied(''), 1800);
    }
  }

  return (
    <section className="nova-stack nova-stack-lg" id="icons">
      <div className="nova-cluster nova-cluster-between">
        <h2 className="nova-h3">Icons</h2>
        <span className="nova-small nova-text-muted" role="status" aria-live="polite">
          {copied || `${visibleIcons.length} of ${matchingIcons.length} ${source === 'nova' ? 'Nova UI' : 'Material Symbols'} icons`}
        </span>
      </div>
      <div className="pg-icon-source" role="group" aria-label="Icon source">
        <button type="button" aria-pressed={source === 'nova'} onClick={() => { setSource('nova'); setDisplayCount(PAGE_SIZE); setCopied(''); }}>
          Nova UI <span>{iconNames.length}</span>
        </button>
        <button type="button" aria-pressed={source === 'material'} onClick={() => { setSource('material'); setDisplayCount(PAGE_SIZE); setCopied(''); }}>
          Material Symbols <span>{materialIconNames.length.toLocaleString()}</span>
        </button>
      </div>
      <label className="pg-icon-search">
        <span className="nova-sr-only">Filter icons by name</span>
        {iconElement('search')}
        <input
          type="search"
          value={query}
          onChange={(event) => { setQuery(event.currentTarget.value); setDisplayCount(PAGE_SIZE); }}
          placeholder={source === 'nova' ? 'Search Nova icons' : 'Search Material Symbols'}
        />
      </label>
      {visibleIcons.length ? (
        <div className="pg-icon-grid">
          {visibleIcons.map((name) => (
            <button
              className="pg-icon-tile"
              key={name}
              type="button"
              title={`Copy ${source === 'material' ? `nova-icon-${name.replaceAll('_', '-')}` : name}`}
              aria-label={`Copy icon name ${source === 'material' ? `nova-icon-${name.replaceAll('_', '-')}` : name}`}
              onClick={() => void copyIconName(name)}
            >
              {source === 'nova'
                ? iconElement(name)
                : <span className={`pg-icon-glyph nova-icon nova-icon-${name.replaceAll('_', '-')}`} aria-hidden="true" />}
              <code>{source === 'material' ? `nova-icon-${name.replaceAll('_', '-')}` : name}</code>
            </button>
          ))}
        </div>
      ) : (
        <p className="nova-text-muted" role="status">No icons match “{query}”.</p>
      )}
      {displayCount < matchingIcons.length && (
        <button className="nova-btn nova-btn-secondary nova-self-start" type="button" onClick={() => setDisplayCount((count) => count + PAGE_SIZE)}>
          Show more icons
        </button>
      )}
    </section>
  );
}