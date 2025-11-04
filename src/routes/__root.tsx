import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { ThemeProvider } from "../contexts/ThemeContext";
import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { trackPageView } from "../lib/analytics";

function RootLayout() {
    const routerState = useRouterState();

    useEffect(() => {
        trackPageView();
    }, [routerState.location.href]);

    return (
        <ThemeProvider>
            <Header />
            <main className="min-h-screen bg-white text-slate-800 dark:bg-slate-900 dark:text-white transition-colors duration-300">
                <Outlet />
            </main>
        </ThemeProvider>
    );
}

export const Route = createRootRoute({
    component: RootLayout,
});
