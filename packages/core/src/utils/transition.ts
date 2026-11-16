/**
 * View Transitions for route or content changes: the browser cross-fades (or morphs) between the old and
 * new page state. Falls back to a plain update where the API is missing or motion is reduced.
 */
export function withViewTransition(update: () => void | Promise<void>): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve(update());
  const reduced = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const start = (document as any).startViewTransition?.bind(document);
  if (!start || reduced) return Promise.resolve(update());
  const t = start(() => update());
  return t.finished.then(() => undefined, () => undefined);
}
