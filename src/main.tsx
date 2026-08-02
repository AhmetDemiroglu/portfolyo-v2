import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { routeTree } from './routeTree.gen'
import './i18n';
import { Suspense } from 'react';
import { HelmetProvider, Helmet} from 'react-helmet-async';

const router = createRouter({
  routeTree,
  basepath: '/',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <Helmet defaultTitle="Ahmet Demiroğlu | Full-Stack Developer" />
        <Suspense fallback={null}>
          <RouterProvider router={router} />
        </Suspense>
      </HelmetProvider>
    </React.StrictMode>,
  )
}
