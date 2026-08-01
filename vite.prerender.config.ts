import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath } from 'node:url'

/* Builds the build-time-only render helper (src/entry-prerender.tsx) into
   .prerender/, which the prerender script injects into the page. It is never
   part of dist/ and never reaches a visitor. */
export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
  ],
  // react-dom/server reads process.env.NODE_ENV, which Vite does not shim in
  // library builds the way it does for app builds.
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env': '{}',
  },
  base: '/',
  build: {
    outDir: '.prerender',
    emptyOutDir: true,
    sourcemap: false,
    // Deliberately NOT build.lib: library mode always inlines assets as data
    // URIs, which baked ~140 kB of base64 screenshots into every prerendered
    // page and gave React a different src than the client bundle renders.
    // A plain build with a custom entry keeps Vite's normal asset handling, so
    // the emitted paths and hashes match the client build exactly.
    rollupOptions: {
      input: fileURLToPath(new URL('src/entry-prerender.tsx', import.meta.url)),
      output: {
        format: 'es',
        entryFileNames: 'entry.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
