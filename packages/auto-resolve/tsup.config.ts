import { defineConfig } from 'tsup'

export default defineConfig([
  // ESM and CJS builds - keep dependencies external
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    outExtension({ format }) {
      return {
        js: format === 'cjs' ? '.cjs' : '.mjs',
      }
    },
    dts: true,
    clean: true,
    splitting: false,
    sourcemap: true,
    minify: false,
    external: ['@ens-rush-resolution/core'],
  },
  // IIFE build for CDN - bundle all dependencies
  {
    entry: ['src/index.ts'],
    format: ['iife'],
    outExtension: () => ({ js: '.global.js' }),
    clean: false,
    splitting: false,
    sourcemap: true,
    minify: false,
    globalName: 'ENSRushResolution',
    // Don't mark anything as external for IIFE - bundle everything
  },
])