/**
 * Motion primitives built on the Web Animations API: no runtime dependency,
 * and every function respects `prefers-reduced-motion`.
 */
export type AnimationName =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale';

export interface AnimateOptions {
  duration?: number; // ms
  delay?: number; // ms
  easing?: string;
  distance?: number; // px, for slide-* animations
}

const DEFAULT_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function frames(name: AnimationName, distance: number): Keyframe[] {
  switch (name) {
    case 'fade':
      return [{ opacity: 0 }, { opacity: 1 }];
    case 'slide-up':
      return [
        { opacity: 0, transform: `translateY(${distance}px)` },
        { opacity: 1, transform: 'translateY(0)' },
      ];
    case 'slide-down':
      return [
        { opacity: 0, transform: `translateY(${-distance}px)` },
        { opacity: 1, transform: 'translateY(0)' },
      ];
    case 'slide-left':
      return [
        { opacity: 0, transform: `translateX(${distance}px)` },
        { opacity: 1, transform: 'translateX(0)' },
      ];
    case 'slide-right':
      return [
        { opacity: 0, transform: `translateX(${-distance}px)` },
        { opacity: 1, transform: 'translateX(0)' },
      ];
    case 'scale':
      return [
        { opacity: 0, transform: 'scale(0.96)' },
        { opacity: 1, transform: 'scale(1)' },
      ];
  }
}

/** Animate an element in. Resolves when finished; resolves immediately under reduced motion. */
export function animateIn(el: Element, name: AnimationName = 'fade', opts: AnimateOptions = {}): Promise<void> {
  if (prefersReducedMotion() || typeof (el as HTMLElement).animate !== 'function') {
    return Promise.resolve();
  }
  const { duration = 400, delay = 0, easing = DEFAULT_EASING, distance = 16 } = opts;
  const anim = (el as HTMLElement).animate(frames(name, distance), {
    duration,
    delay,
    easing,
    fill: 'backwards',
  });
  return anim.finished.then(
    () => undefined,
    () => undefined, // cancelled
  );
}

/** Animate a list of elements in sequence, `step` ms apart. */
export function staggerIn(
  els: Element[],
  name: AnimationName = 'slide-up',
  opts: AnimateOptions & { step?: number } = {},
): Promise<void> {
  const { step = 60, delay = 0, ...rest } = opts;
  return Promise.all(els.map((el, i) => animateIn(el, name, { ...rest, delay: delay + i * step }))).then(() => undefined);
}
