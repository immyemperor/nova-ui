/**
 * Exit animations for content that is removed. A framework keeps the element mounted in phase "exiting"
 * until the animation finishes, then unmounts it. This module is the state machine; the React hook and the
 * Angular helper use it. Pure, so the rules are tested directly.
 */
export type Phase = 'out' | 'in' | 'exiting';

/** Next phase given whether the element should be shown and whether a running exit has finished. */
export function nextPhase(phase: Phase, open: boolean, exitDone = false): Phase {
  if (open) return phase === 'in' ? 'in' : 'in';
  if (phase === 'in') return 'exiting';
  if (phase === 'exiting' && exitDone) return 'out';
  return phase;
}

/** The element should stay in the DOM while it is entering, shown, or exiting. */
export const isMounted = (phase: Phase): boolean => phase !== 'out';

/** Run an element's exit animation (Web Animations API), then resolve. Resolves at once if motion is reduced or unsupported. */
export function playExit(el: Element, keyframes: Keyframe[] = [{ opacity: 1 }, { opacity: 0 }], duration = 180): Promise<void> {
  const reduced = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const anim = (el as HTMLElement).animate?.bind(el as HTMLElement);
  if (reduced || !anim) return Promise.resolve();
  return anim(keyframes, { duration, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'forwards' }).finished.then(() => undefined, () => undefined);
}
