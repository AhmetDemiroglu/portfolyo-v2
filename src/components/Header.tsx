import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

const navHrefs = ["/", "/about", "/skills", "/projects", "/contact"] as const;
const navKeys = ["home", "about", "skills", "projects", "contact"] as const;

export function Header() {
    const { t } = useTranslation();
    const pathname = useRouterState({ select: (state) => state.location.pathname });
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <div
                className={`transition-all duration-300 ${
                    scrolled
                        ? "border-b border-line/70 bg-paper/85 backdrop-blur-md"
                        : "border-b border-transparent bg-transparent"
                }`}
            >
                <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
                    <Link to="/" preload="intent" aria-label="Ana sayfa">
                        <Logo />
                    </Link>

                    <div className="hidden items-center gap-1 md:flex">
                        {navHrefs.map((href, i) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    to={href}
                                    preload="intent"
                                    className={`relative px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                                        active ? "text-ink" : "text-muted hover:text-ink"
                                    }`}
                                >
                                    <span className="mr-1.5 text-accent">{active ? "●" : ""}</span>
                                    {t(`nav.${navKeys[i]}`)}
                                    {active && (
                                        <motion.span
                                            layoutId="nav-underline"
                                            className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                                            transition={{ type: "spring", stiffness: 480, damping: 40 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeSwitcher />
                        <button
                            onClick={() => setIsOpen((v) => !v)}
                            aria-label="Menü"
                            className="rounded-md p-2 text-ink-soft hover:text-ink"
                        >
                            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Full-screen mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 top-16 z-40 flex flex-col bg-paper/95 backdrop-blur-lg md:hidden"
                    >
                        <div className="flex flex-1 flex-col justify-center gap-1 px-8">
                            {navHrefs.map((href, i) => (
                                <motion.div
                                    key={href}
                                    initial={{ opacity: 0, x: -24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <Link
                                        to={href}
                                        preload="intent"
                                        className={`group flex items-baseline gap-4 py-3 ${
                                            pathname === href ? "text-accent" : "text-ink"
                                        }`}
                                    >
                                        <span className="font-mono text-xs text-muted">0{i + 1}</span>
                                        <span className="font-display text-4xl font-bold tracking-tight transition-colors group-hover:text-accent">
                                            {t(`nav.${navKeys[i]}`)}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between border-t border-line/70 px-8 py-6">
                            <span className="font-mono text-xs tracking-[0.2em] text-muted">
                                ahmetdemiroglu<span className="text-accent">.dev</span>
                            </span>
                            <LanguageSwitcher />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
