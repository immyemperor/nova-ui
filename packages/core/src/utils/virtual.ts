/**
 * Virtual scrolling maths: which rows are on screen for a given scroll position.
 * Fixed row heights keep this O(1). The virtual list renders only [start, end) and pads the rest.
 */
export interface VirtualWindow { start: number; end: number; offsetTop: number; totalHeight: number }

export function virtualRange(scrollTop: number, viewportHeight: number, rowHeight: number, count: number, overscan = 5): VirtualWindow {
  const totalHeight = Math.max(0, count * rowHeight);
  if (count <= 0 || rowHeight <= 0) return { start: 0, end: 0, offsetTop: 0, totalHeight };
  const first = Math.floor(Math.max(0, scrollTop) / rowHeight);
  const visible = Math.ceil(Math.max(0, viewportHeight) / rowHeight);
  const start = Math.max(0, first - overscan);
  const end = Math.min(count, first + visible + overscan);
  return { start, end, offsetTop: start * rowHeight, totalHeight };
}

/** Scroll offset that brings row `index` into view (minimal movement). */
export function scrollToRow(index: number, currentScroll: number, viewportHeight: number, rowHeight: number): number {
  const top = index * rowHeight, bottom = top + rowHeight;
  if (top < currentScroll) return top;
  if (bottom > currentScroll + viewportHeight) return bottom - viewportHeight;
  return currentScroll;
}
