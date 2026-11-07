/** Small positioning engine for floating UI: flips to the opposite side and stays inside the viewport. */
export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';
export type Placement = Side | `${Side}-start` | `${Side}-end`;

export interface PositionResult {
  x: number;
  y: number;
  placement: Placement;
}

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

function parse(p: Placement): [Side, Align] {
  const [side, align] = p.split('-') as [Side, Align | undefined];
  return [side, align ?? 'center'];
}

export function computePosition(
  anchor: DOMRect,
  floating: { width: number; height: number },
  placement: Placement = 'bottom',
  offset = 8,
  padding = 8,
): PositionResult {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  let [side, align] = parse(placement);

  const space = (s: Side) =>
    s === 'top' ? anchor.top : s === 'bottom' ? vh - anchor.bottom : s === 'left' ? anchor.left : vw - anchor.right;
  const need = (s: Side) => (s === 'top' || s === 'bottom' ? floating.height : floating.width) + offset;
  if (space(side) < need(side) && space(OPPOSITE[side]) > space(side)) side = OPPOSITE[side];

  let x: number;
  let y: number;
  if (side === 'top' || side === 'bottom') {
    y = side === 'top' ? anchor.top - floating.height - offset : anchor.bottom + offset;
    x = align === 'start' ? anchor.left : align === 'end' ? anchor.right - floating.width : anchor.left + anchor.width / 2 - floating.width / 2;
  } else {
    x = side === 'left' ? anchor.left - floating.width - offset : anchor.right + offset;
    y = align === 'start' ? anchor.top : align === 'end' ? anchor.bottom - floating.height : anchor.top + anchor.height / 2 - floating.height / 2;
  }
  x = Math.max(padding, Math.min(x, vw - floating.width - padding));
  y = Math.max(padding, Math.min(y, vh - floating.height - padding));
  return { x, y, placement: (align === 'center' ? side : `${side}-${align}`) as Placement };
}

/** Re-run `update` on scroll, resize and size changes. Returns a cleanup function. */
export function autoUpdate(anchor: Element | null, floating: Element, update: () => void): () => void {
  const opts: AddEventListenerOptions = { capture: true, passive: true };
  window.addEventListener('scroll', update, opts);
  window.addEventListener('resize', update, opts);
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : undefined;
  ro?.observe(floating);
  if (anchor) ro?.observe(anchor);
  return () => {
    window.removeEventListener('scroll', update, opts);
    window.removeEventListener('resize', update, opts);
    ro?.disconnect();
  };
}

/** The Popover API renders into the top layer: no z-index fights, no clipping by overflow:hidden parents. */
export const supportsPopover = (): boolean => typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;

export function showFloating(el: HTMLElement): void {
  if (!supportsPopover()) {
    el.hidden = false;
    return;
  }
  try {
    (el as any).showPopover();
  } catch {
    /* already open */
  }
}

export function hideFloating(el: HTMLElement): void {
  if (!supportsPopover()) {
    el.hidden = true;
    return;
  }
  try {
    (el as any).hidePopover();
  } catch {
    /* already closed */
  }
}
