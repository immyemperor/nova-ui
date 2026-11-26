'use client';

import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { ApiTable } from './ApiTable';
import type { ManifestDeclaration } from './ApiTable';
import { EXAMPLES } from './examples';
import { CodeBlock } from '../CodeBlock';
import { DECLARATIONS, REACT_EXAMPLE_SOURCES } from '../../generated/library';
import { CATEGORIES } from './catalog';

const declarations = DECLARATIONS as unknown as ManifestDeclaration[];

/** Imports plus one example block, as generated from examples.tsx by the snapshot script. */
export function exampleSource(tag: string): string | undefined {
  return REACT_EXAMPLE_SOURCES[tag];
}

export function ComponentPage({ tag }: { tag: string }) {
  const decl = declarations.find((d) => d.tagName === tag);
  const category = CATEGORIES.find((c) => c.tags.includes(tag));
  const Example = EXAMPLES[tag] as (() => ReactElement) | undefined;
  const code = useMemo(() => exampleSource(tag), [tag]);

  if (!decl) {
    return (
      <div className="kvui-stack">
        <h2 className="kvui-h3">Unknown component</h2>
        <p>No component is called <code>{tag}</code>. Choose one from the list.</p>
      </div>
    );
  }

  return (
    <article className="kvui-stack kvui-stack-lg" aria-labelledby="component-title">
      <header className="kvui-stack kvui-stack-xs">
        <p className="kvui-caption">{category?.label}</p>
        <h2 id="component-title" className="kvui-h2"><code>&lt;{decl.tagName}&gt;</code></h2>
        {decl.description && <p className="kvui-lead">{decl.description}</p>}
      </header>

      <section className="kvui-stack kvui-stack-sm" aria-labelledby="example-heading">
        <h3 id="example-heading" className="kvui-h4">Example</h3>
        {Example && code ? (
          <>
            <div className="kvui-card kvui-card-raised kvui-p-5">
              <Example />
            </div>
            <CodeBlock title={`${tag} example`} code={code} />
          </>
        ) : (
          <p className="kvui-caption">No live example for this component yet. Its properties, events and methods are below.</p>
        )}
      </section>

      <section className="kvui-stack kvui-stack-sm" aria-labelledby="api-heading">
        <h3 id="api-heading" className="kvui-h4">API</h3>
        <ApiTable decl={decl} />
      </section>
    </article>
  );
}
