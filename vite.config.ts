import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({presets: [hydrogen.preset()]}),
    tsconfigPaths(),
    commonjs(),
    nodeResolve(),
  ],
  resolve: {
    alias: {
      // Polyfill for module if necessary
      'module': 'module-polyfill',
    },
  },
  ssr: {
    optimizeDeps: {
      include: ['typographic-base/index', 'textr', '@material-tailwind/react','react-responsive', 'react-use/esm/useScroll',
        'react-circular-progressbar'],
    },
  },
  optimizeDeps: {
    include: [
      'clsx',
      '@headlessui/react',
      'typographic-base/index',
      'react-intersection-observer',
      'react-use/esm/useScroll',
      'react-use/esm/useDebounce',
      'react-use/esm/useWindowScroll',
      '@material-tailwind/react',
      'react-responsive',
      'react-circular-progressbar'
    ],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        globals: {
          // Define globals if needed
        },
      },
      plugins: [
        commonjs(),
        nodeResolve(),
      ],
    },
    commonjsOptions: {
      // Ensure CommonJS dependencies are properly handled
      include: /node_modules/,
    },
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
});
