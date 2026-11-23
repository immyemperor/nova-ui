'use client';

import { useState } from 'react';
import { getIconLibrary, setIconLibrary } from '@nova-ui/react';
import type { IconLibrary } from '@nova-ui/react';

/** Switches every icon on the page between Nova and Google Material Symbols. */
export function IconSetToggle() {
  const [iconSet, setIconSet] = useState<IconLibrary>(getIconLibrary());
  return (
    <button
      type="button"
      className="nova-btn nova-btn-ghost nova-btn-sm"
      onClick={() => {
        const next: IconLibrary = iconSet === 'nova' ? 'material' : 'nova';
        setIconLibrary(next);
        setIconSet(next);
      }}
    >
      Icons: {iconSet === 'nova' ? 'Nova' : 'Material'}
    </button>
  );
}
