import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter, createBrowserHistory } from '@tanstack/react-router'
import { parseHref } from '@tanstack/history'
import './index.css'
import { routeTree } from './routeTree.gen'
import i18n from './i18n';
import { Suspense } from 'react';
import { HelmetProvider, Helmet} from 'react-helmet-async';
import { addLangPrefix, langFromPath, stripLangPrefix } from './seo/site';
import { getUrlLang, setUrlLang } from './lib/url-lang';

/* The routes know nothing about languages: "/en/about" reaches the router as
   "/about", and every link the router builds gets the current language's prefix
   back. This is the whole of the URL-per-language support; route files stay as
   they are. */
const history = createBrowserHistory({
  parseLocation: () =>
    parseHref(
      stripLangPrefix(`${window.location.pathname}${window.location.search}${window.location.hash}`),
      window.history.state,
    ),
  createHref: (href) => addLangPrefix(href, getUrlLang()),
})

const router = createRouter({
  routeTree,
  basepath: '/',
  history,
})

/* Back and forward can cross languages (/en/about -> /about), and the prefix in
   the address bar is the truth. */
history.subscribe(({ action }) => {
  // On PUSH/REPLACE the address bar is only written a microtask later, and the
  // language switcher has already set the language itself.
  if (action.type === 'PUSH' || action.type === 'REPLACE') return
  const lang = langFromPath(window.location.pathname)
  setUrlLang(lang)
  if (lang !== i18n.language) i18n.changeLanguage(lang)
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

/* The built HTML carries a text copy of the page and head tags for crawlers that
   do not run JavaScript. React replaces the copy on its first commit; the tags
   are dropped here so Helmet's identical ones are the only set. */
document.querySelectorAll('[data-seo]').forEach((node) => node.remove())

const rootElement = document.getElementById('root')!
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
