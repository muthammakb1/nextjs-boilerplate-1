import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig([
  // UI components
  {
    entry: { 'ui/index': 'packages/ui/src/index.js' },
    format: ['cjs', 'esm'],
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    outDir: 'dist',
    external: ['react', 'react-dom'],
    banner: {
      js: "'use client';",
    },
    esbuildOptions(options) {
      options.jsx = 'automatic';
      options.alias = {
        ...options.alias,
        '@indigo-shared-lib/utils': resolve('./packages/utils/src/index.js'),
      };
      options.loader = {
        ...options.loader,
        '.css': 'empty',
      };
    },
  },
  // UI styles
  {
    entry: { 'ui/styles': 'packages/ui/src/styles.css' },
    outDir: 'dist',
  },
  // Hooks
  {
    entry: { 'hooks/index': 'packages/hooks/src/index.js' },
    format: ['cjs', 'esm'],
    splitting: true,
    sourcemap: true,
    treeshake: true,
    outDir: 'dist',
    external: ['react', 'react-dom'],
    banner: {
      js: "'use client';",
    },
    esbuildOptions(options) {
      options.jsx = 'automatic';
    },
  },
  // Tokens
  {
    entry: { 'tokens/index': 'packages/tokens/src/index.js' },
    format: ['cjs', 'esm'],
    splitting: true,
    sourcemap: true,
    treeshake: true,
    outDir: 'dist',
  },
  // Utils
  {
    entry: { 'utils/index': 'packages/utils/src/index.js' },
    format: ['cjs', 'esm'],
    splitting: true,
    sourcemap: true,
    treeshake: true,
    outDir: 'dist',
    external: ['crypto-js'],
  },
  // AEM Renderer
  {
    entry: { 'aem-renderer/index': 'packages/aem-renderer/src/index.js' },
    format: ['cjs', 'esm'],
    splitting: true,
    sourcemap: true,
    treeshake: true,
    outDir: 'dist',
    external: ['react', 'react-dom'],
    banner: {
      js: "'use client';",
    },
    esbuildOptions(options) {
      options.jsx = 'automatic';
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      };
    },
  },
  // AEM Renderer styles
  {
    entry: {
      'aem-renderer/styles/grid': 'packages/aem-renderer/src/styles/grid.css',
      'aem-renderer/styles/grid.module': 'packages/aem-renderer/src/styles/grid.module.css',
    },
    outDir: 'dist',
  },
]);
