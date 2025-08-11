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
    sitemap({ hostname: 'https://ahmetdemiroglu.dev' })
  ],
})
