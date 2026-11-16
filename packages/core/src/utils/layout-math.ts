/** Sizing rules for split panes and resizable columns. Pure: no DOM. */

export const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

/**
 * Split ratio (0..1 for the first pane) that keeps both panes at least their minimum size.
 * If the container is too small for both minimums, the first pane gets what it can and the rest goes to the second.
 */
export function clampSplit(ratio: number, total: number, minA: number, minB: number): number {
  if (total <= 0) return 0.5;
  const lo = Math.min(1, minA / total);
  const hi = Math.max(0, 1 - minB / total);
  if (lo > hi) return clamp(ratio, 0, 1); // container too small for both minimums: honour the ratio
  return clamp(ratio, lo, hi);
}

/** New ratio after a pointer moves `delta` px along the split axis. */
export function ratioFromDrag(startRatio: number, delta: number, total: number, minA: number, minB: number): number {
  if (total <= 0) return startRatio;
  return clampSplit(startRatio + delta / total, total, minA, minB);
}

/** Keyboard control for a divider: arrows move by `step`, Home/End go to the limits. Returns undefined if the key isn't handled. */
export function dividerKey(key: string, ratio: number, step: number, total: number, minA: number, minB: number, large = false): number | undefined {
  const s = (large ? step * 5 : step) / Math.max(1, total);
  switch (key) {
    case 'ArrowLeft': case 'ArrowUp': return clampSplit(ratio - s, total, minA, minB);
    case 'ArrowRight': case 'ArrowDown': return clampSplit(ratio + s, total, minA, minB);
    case 'Home': return clampSplit(0, total, minA, minB);
    case 'End': return clampSplit(1, total, minA, minB);
    default: return undefined;
  }
}

/** New column width after a drag of `delta` px, kept between min and max. */
export function resizeColumn(width: number, delta: number, min = 48, max = 1200): number {
  return Math.round(clamp(width + delta, min, max));
}
