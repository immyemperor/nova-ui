import { createElement, useMemo, useState } from 'react';

const components = [
  'ui-accordion', 'ui-accordion-item', 'ui-alert', 'ui-avatar', 'ui-badge', 'ui-breadcrumb', 'ui-breadcrumb-item',
  'ui-button', 'ui-calendar', 'ui-card', 'ui-carousel', 'ui-checkbox', 'ui-color-picker', 'ui-command-palette',
  'ui-context-menu', 'ui-counter', 'ui-date-picker', 'ui-drawer', 'ui-dropdown', 'ui-icon', 'ui-input', 'ui-marquee',
  'ui-menu-item', 'ui-menubar', 'ui-menubar-menu', 'ui-modal', 'ui-nav-item', 'ui-nav-menu', 'ui-otp-input',
  'ui-pagination', 'ui-popover', 'ui-progress', 'ui-radio', 'ui-radio-group', 'ui-rating', 'ui-reveal', 'ui-select',
  'ui-skeleton', 'ui-slider', 'ui-spinner', 'ui-stagger', 'ui-step', 'ui-stepper', 'ui-switch', 'ui-tab',
  'ui-tab-panel', 'ui-table', 'ui-tabs', 'ui-tag-input', 'ui-textarea', 'ui-theme-toggle', 'ui-toaster', 'ui-tooltip', 'ui-tree',
  'ui-editor',
] as const;

const pascal = (tag: string) => `Ui${tag.slice(3).split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('')}`;

const previewProps: Record<string, Record<string, string | number | boolean>> = {
  'ui-alert': { heading: 'Example alert', tone: 'info' },
  'ui-avatar': { name: 'Ada Lovelace' },
  'ui-badge': { tone: 'accent' },
  'ui-breadcrumb': { label: 'Example breadcrumb' },
  'ui-button': { variant: 'primary' },
  'ui-checkbox': { label: 'Example checkbox' },
  'ui-icon': { name: 'check' },
  'ui-editor': { label: 'Example editor', placeholder: 'Write something' },
  'ui-input': { label: 'Example input', placeholder: 'Type here' },
  'ui-menu-item': { value: 'example' },
  'ui-menubar-menu': { label: 'Example menu' },
  'ui-modal': { label: 'Modal preview', open: false },
  'ui-nav-item': { label: 'Example navigation item' },
  'ui-nav-menu': { label: 'Example navigation' },
  'ui-progress': { label: 'Example progress', value: 64, showValue: true },
  'ui-radio': { value: 'example' },
  'ui-radio-group': { label: 'Example radio group' },
  'ui-rating': { label: 'Example rating', value: 3 },
  'ui-select': { label: 'Example select', options: [{ value: 'one', label: 'Option one' }, { value: 'two', label: 'Option two' }] },
  'ui-slider': { label: 'Example slider', value: 40 },
  'ui-step': { heading: 'Example step' },
  'ui-stepper': { current: 0 },
  'ui-switch': { label: 'Example switch' },
  'ui-tab': { value: 'example' },
  'ui-tab-panel': { value: 'example' },
  'ui-tabs': { label: 'Example tabs', value: 'example' },
  'ui-textarea': { label: 'Example textarea', placeholder: 'Type here' },
  'ui-tooltip': { content: 'Example tooltip' },
  'ui-tree': { label: 'Example tree', nodes: [{ id: 'one', label: 'Example node' }] },
};

function exampleMarkup(tag: string): string {
  const props = previewProps[tag] ?? {};
  const attributes = Object.entries(props)
    .filter(([key, value]) => key !== 'options' && key !== 'nodes' && typeof value !== 'boolean')
    .map(([key, value]) => `${key}="${String(value)}"`)
    .join(' ');
  const body = tag === 'ui-icon' ? '' : `Example ${tag.replace('ui-', '')}`;
  return `<${tag}${attributes ? ` ${attributes}` : ''}>${body}</${tag}>`;
}

function angularClass(tag: string, markup: string): string {
  const packageName = tag === 'ui-editor' ? '@nova-ui/angular/editor' : '@nova-ui/angular';
  return `import { Component } from '@angular/core';
import { ${pascal(tag)} } from '${packageName}';

@Component({
  standalone: true,
  imports: [${pascal(tag)}],
  template: \`${markup}\`,
})
export class ExampleComponent {}`;
}

export function ComponentExplorer() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string>('ui-button');
  const [framework, setFramework] = useState<'vite' | 'react' | 'angular'>('vite');
  const [source, setSource] = useState('');
  const [copied, setCopied] = useState(false);
  const visible = useMemo(() => components.filter((tag) => tag.includes(query.trim().toLowerCase())), [query]);
  const props = previewProps[selected] ?? {};
  const markup = exampleMarkup(selected);
  const jsx = `<${pascal(selected)}${Object.entries(props)
    .filter(([key, value]) => key !== 'options' && key !== 'nodes' && typeof value !== 'boolean')
    .map(([key, value]) => ` ${key}=${JSON.stringify(value)}`)
    .join('')}>${selected === 'ui-icon' ? '' : `Example ${selected.slice(3)}`}</${pascal(selected)}>`;
  const packageName = selected === 'ui-editor' ? '@nova-ui/editor' : '@nova-ui/core';
  const reactPackage = selected === 'ui-editor' ? '@nova-ui/react/editor' : '@nova-ui/react';
  const example = framework === 'vite'
    ? `import '${packageName}/components/${selected}.js';\n\n${markup}`
    : framework === 'react'
      ? `import { ${pascal(selected)} } from '${reactPackage}';\n\nexport function Example() {\n  return ${jsx};\n}`
      : angularClass(selected, markup);

  function choose(tag: string) {
    setSelected(tag);
    setSource('');
    setCopied(false);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(source || example);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="nova-stack nova-stack-lg" id="component-explorer">
      <div className="nova-stack nova-stack-sm">
        <h2 className="nova-h3">Component explorer</h2>
        <p className="nova-text-muted">Browse every core component and the optional editor, inspect live previews, and edit or copy Vite, React, and Angular starter code.</p>
      </div>
      <div className="pg-component-explorer">
        <div className="pg-component-browser">
          <label className="pg-icon-search">
            <span className="nova-sr-only">Filter components</span>
            <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search components" />
          </label>
          <div className="pg-component-list" role="listbox" aria-label="Components">
            {visible.map((tag) => (
              <button key={tag} type="button" role="option" aria-selected={selected === tag} onClick={() => choose(tag)}>
                {tag}
              </button>
            ))}
          </div>
          <span className="nova-small nova-text-muted">{visible.length} of {components.length} workspace components</span>
        </div>
        <div className="pg-component-detail">
          <div className="nova-cluster nova-cluster-between">
            <h3 className="nova-h4">{selected}</h3>
            <div className="pg-code-tabs" role="group" aria-label="Example framework">
              {(['vite', 'react', 'angular'] as const).map((name) => (
                <button key={name} type="button" aria-pressed={framework === name} onClick={() => { setFramework(name); setSource(''); }}>
                  {name === 'vite' ? 'Vite' : name === 'react' ? 'React' : 'Angular'}
                </button>
              ))}
            </div>
          </div>
          <div className="pg-component-preview" aria-label={`${selected} live preview`}>
            {createElement(selected, props, selected === 'ui-icon' ? undefined : `Example ${selected.slice(3)}`)}
          </div>
          <div className="pg-code-heading">
            <span className="nova-small nova-text-muted">Starter example · edit before copying</span>
            <button type="button" className="nova-btn nova-btn-secondary nova-btn-sm" onClick={() => void copyCode()}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            className="pg-code-editor"
            aria-label={`${selected} ${framework} example code`}
            spellCheck={false}
            value={source || example}
            onChange={(event) => { setSource(event.currentTarget.value); setCopied(false); }}
          />
        </div>
      </div>
    </section>
  );
}