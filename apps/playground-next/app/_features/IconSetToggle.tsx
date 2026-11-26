'use client';

import { useState } from 'react';
import { getIconLibrary, setIconLibrary } from '@kvui/react';
import type { IconLibrary } from '@kvui/react';

/** Switches every icon on the page between Kvui and Google Material Symbols. */
export function IconSetToggle() {
  const [iconSet, setIconSet] = useState<IconLibrary>(getIconLibrary());
  return (
    <button
      type="button"
      className="kvui-btn kvui-btn-ghost kvui-btn-sm"
      onClick={() => {
        const next: IconLibrary = iconSet === 'kvui' ? 'material' : 'kvui';
        setIconLibrary(next);
        setIconSet(next);
      }}
    >
      Icons: {iconSet === 'kvui' ? 'Kvui' : 'Material'}
    </button>
  );
}
