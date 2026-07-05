import { defineConfig } from 'tsup';

// Emits the exact files the published exports point at:
//   dist/humanizeKey.js   (CJS  -> "main")
//   dist/humanizeKey.mjs  (ESM  -> "module")
//   dist/humanizeKey.d.ts (types -> "types")
export default defineConfig({
   entry: ['src/humanizeKey.ts'],
   format: ['cjs', 'esm'],
   dts: true,
   clean: true,
   sourcemap: false,
   target: 'es2020',
});
