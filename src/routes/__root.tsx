import { Outlet, createRootRoute, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ThemeProvider } from "../contexts/ThemeContext";
import { trackPageView } from "../lib/analytics";

function RootLayout() {
    const routerState = useRouterState();
    const pathname = routerState.location.pathname;

    useEffect(() => {
        trackPageView();
    }, [routerState.location.href]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }, [pathname]);

    return (
        <ThemeProvider>
            <Header />
            <main className="min-h-screen bg-paper text-ink">
                <Outlet />
            </main>
            <Footer />
        </ThemeProvider>
    );
}

export const Route = createRootRoute({
    component: RootLayout,
});
