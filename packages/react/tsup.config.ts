import { defineConfig } from 'tsup';

export default defineConfig([
  {
    // Client entry: components + hooks. "use client" lets Next.js App Router import it from server files.
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    external: ['react', 'react-dom', /^@nova-ui\/core/],
    banner: { js: '"use client";' },
  },
  {
    // Server-safe entry: no React, no "use client". Used for the pre-paint theme script.
    entry: { server: 'src/server.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
  },
]);
