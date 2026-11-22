import { onFirstInteraction } from "./first-interaction";

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

const GTAG_SRC = "https://www.googletagmanager.com/gtag/js?id=G-MFJXL2E2NV";
const FALLBACK_MS = 3000;

let requested = false;

function injectGtag() {
    if (requested) return;
    requested = true;
    const s = document.createElement("script");
    s.async = true;
    s.src = GTAG_SRC;
    document.head.appendChild(s);
}

/* Called once the first page has rendered. The 183 KB gtag script is fetched on
   the visitor's first interaction, or a few seconds later if there is none, so
   it never shares the network with the page's own code and image. Calls made
   before then wait in the dataLayer stub from index.html; no event is lost. */
export function loadAnalytics() {
    if (requested) return;
    onFirstInteraction(injectGtag);
    window.setTimeout(() => {
        if ("requestIdleCallback" in window) requestIdleCallback(injectGtag, { timeout: 2000 });
        else injectGtag();
    }, FALLBACK_MS);
}

export function trackPageView() {
    const { pathname, search, href } = window.location;
    window.gtag?.("event", "page_view", {
        page_title: document.title,
        page_location: href,
        page_path: pathname + search,
    });
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
    window.gtag?.("event", name, params);
}
