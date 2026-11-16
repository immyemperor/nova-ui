import { useEffect, useState } from 'react';
import { isMounted, nextPhase } from '@nova-ui/core';
import type { Phase } from '@nova-ui/core';

/**
 * Exit animations for React. Keeps an element mounted while it animates out, then removes it.
 *   const { mounted, phase } = usePresence(open, 180);
 *   {mounted && <div className={phase === 'exiting' ? 'fade-out' : 'fade-in'}>…</div>}
 * `duration` should match your CSS exit animation in ms. Reduced-motion users are removed immediately.
 */
export function usePresence(open: boolean, duration = 180): { mounted: boolean; phase: Phase } {
  const reduced = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [phase, setPhase] = useState<Phase>(open ? 'in' : 'out');

  useEffect(() => {
    setPhase((p) => nextPhase(p, open, false));
    if (open) return;
    const wait = reduced ? 0 : duration;
    const t = setTimeout(() => setPhase((p) => nextPhase(p, false, true)), wait);
    return () => clearTimeout(t);
  }, [open, duration, reduced]);

  return { mounted: isMounted(phase), phase };
}
