'use client';

import { useState } from 'react';

/** Copy text to the clipboard, falling back to a hidden textarea where the async API is blocked. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

/** Read-only source with a copy button, wrapping toggle and keyboard-scrollable region. */
export function CodeBlock({ code, title }: { code: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [wrap, setWrap] = useState(false);
  const copy = async () => {
    const ok = await copyText(code);
    setCopied(ok);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="pg-code">
      <div className="pg-code__bar">
        <span className="pg-code__title">{title}</span>
        <span className="pg-code__actions">
          <button type="button" className="nova-btn nova-btn-ghost nova-btn-sm" aria-pressed={wrap} onClick={() => setWrap((w) => !w)}>
            {wrap ? 'No wrap' : 'Wrap lines'}
          </button>
          <button type="button" className="nova-btn nova-btn-sm" onClick={copy}>
            {copied ? 'Copied' : 'Copy code'}
          </button>
        </span>
      </div>
      <pre className={wrap ? 'pg-code__pre pg-code__pre--wrap' : 'pg-code__pre'} tabIndex={0} aria-label={`Source of ${title}`}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

/** A disclosure that shows a file's source only when asked (keeps the page light). */
export function SourceFile({ title, code }: { title: string; code: string }) {
  return (
    <details className="pg-source">
      <summary>View source: {title}</summary>
      <CodeBlock title={title} code={code} />
    </details>
  );
}
