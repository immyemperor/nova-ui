import { defineConfig } from 'tsup';

export default defineConfig([
  {
    // Client entry: components + hooks. "use client" lets Next.js App Router import it from server files.
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    external: ['react', 'react-dom', /^@omni\/core/],
    banner: { js: '"use client";' },
  },
  {
    // Server-safe entry: no React, no "use client". Used for the pre-paint theme script.
    entry: { server: 'src/server.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
  },
  {
    // Optional editor entry: "@omni/react/editor". Kept separate so the editor (and Tiptap) is never pulled in by accident.
    entry: { editor: 'src/editor.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    external: ['react', 'react-dom', /^@omni\//],
    banner: { js: '"use client";' },
  },
]);
