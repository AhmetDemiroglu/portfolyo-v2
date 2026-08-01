import React, { useEffect } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { routeTree } from './routeTree.gen'
import i18n, { preferredLanguage } from './i18n';
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

/* The app boots in Turkish so hydration matches the prerendered HTML. Switching
   to the visitor's own language is deliberately deferred to an effect, which
   React only runs once hydration has committed. */
// eslint-disable-next-line react-refresh/only-export-components -- entry module, never hot-reloaded
function ApplyPreferredLanguage() {
  useEffect(() => {
    if (preferredLanguage !== i18n.language) {
      i18n.changeLanguage(preferredLanguage)
    }
  }, [])
  return null
}

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <Helmet defaultTitle="Ahmet Demiroğlu | Full-Stack Developer" />
      <ApplyPreferredLanguage />
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
)

/* The build prerenders each route to static HTML. When that markup is present we
   have to hydrate it rather than render over it: a fresh render would tear the
   text out of the DOM and repaint it, and the browser would record that later
   paint as LCP, undoing the whole point of prerendering.
   router.load() resolves the matched route's lazy chunk first, so hydration does
   not suspend and swap the prerendered content for a fallback. */
if (rootElement.hasChildNodes()) {
  router.load().then(() => hydrateRoot(rootElement, app))
} else {
  createRoot(rootElement).render(app)
}
