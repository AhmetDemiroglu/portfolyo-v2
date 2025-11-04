declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

export function trackPageView() {
    const { pathname, search, href } = window.location;
    window.gtag?.("event", "page_view", {
        page_title: document.title,
        page_location: href,
        page_path: pathname + search,
    });
}

export function trackEvent(name: string, params?: Record<string, any>) {
    window.gtag?.("event", name, params);
}
