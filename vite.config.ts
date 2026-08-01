import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  base: '/',
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    sitemap({ hostname: 'https://ahmetdemiroglu.dev',
      dynamicRoutes: [
        '/about',
        '/skills',
        '/projects',
        '/contact',
      ],
    })
  ],
  build: {
    // Lets Lighthouse (and us) read the shipped bundle; maps are never fetched
    // by visitors, only by devtools when they are opened.
    sourcemap: true,
    rollupOptions: {
      output: {
        // Keep the rarely-changing vendor code in its own long-lived file so a
        // content edit does not invalidate the whole bundle for return visitors.
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
          router: ['@tanstack/react-router'],
          motion: ['framer-motion'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
})
