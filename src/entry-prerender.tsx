/**
 * Build-time only. Never shipped to visitors.
 *
 * The prerender step used to snapshot the live DOM, but React's hydration looks
 * for the `<!--$-->` comment markers that only a real server render emits around
 * Suspense boundaries - and TanStack Router puts every route inside one. Without
 * them React rejects the markup and repaints the whole tree, which is exactly the
 * LCP we are trying to save. renderToString produces those markers, so the
 * prerendered HTML is something React can actually hydrate.
 *
 * It runs inside the prerender browser rather than in Node so the app's normal
 * browser-only code (localStorage, matchMedia, navigator) needs no SSR guards.
 */
import { renderToString } from 'react-dom/server';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { HelmetProvider } from 'react-helmet-async';
import { routeTree } from './routeTree.gen';
import './i18n';

declare global {
    interface Window {
        __prerenderHTML?: () => Promise<string>;
    }
}

window.__prerenderHTML = async () => {
    const router = createRouter({ routeTree, basepath: '/' });
    // resolve the matched route (and its code-split component) before rendering
    await router.load();

    return renderToString(
        <HelmetProvider>
            <RouterProvider router={router} />
        </HelmetProvider>,
    );
};

export {};
