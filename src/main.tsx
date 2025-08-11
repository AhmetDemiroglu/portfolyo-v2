import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { routeTree } from './routeTree.gen'
import 'leaflet/dist/leaflet.css'
import './i18n';
import { Suspense } from 'react';
import { HelmetProvider, Helmet} from 'react-helmet-async'; 

const router = createRouter({
  routeTree,
  // basepath: import.meta.env.DEV ? '/' : '/portfolyo-v2/',
  basepath: '/',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      
      <HelmetProvider>
        <Helmet defaultTitle="Ahmet Demiroğlu | Portfolyo" titleTemplate="%s | Ahmet Demiroğlu" />
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </HelmetProvider>
    </React.StrictMode>,
  )
}