import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowRight } from "react-icons/fi";
import type { ProjectBase } from "../data/projects";
import { PhoneMockup } from "./DeviceMockups";
import { SectionHeading } from "./SectionHeading";

/* Featured projects as a pinned, stepped stage (docs/MOTION_SPEC.md 4.6):
   280vh wrapper = 100vh stage + 3 steps x 60vh. The progress bar and the
   mockup drift follow the smoothed progress; the content swaps per step with
   4% hysteresis so the threshold never flickers. Desktop only; the caller
   renders the plain grid on narrow screens and under reduced motion. */

const STEPS = 3;
const HYSTERESIS = 0.04;

export function FeaturedPinned({ projects }: { projects: ProjectBase[] }) {
    const { t } = useTranslation();
    const wrapperRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 });
    const [index, setIndex] = useState(0);

    useMotionValueEvent(progress, "change", (p) => {
        setIndex((current) => {
            const upper = (current + 1) / STEPS + HYSTERESIS / 2;
            const lower = current / STEPS - HYSTERESIS / 2;
            if (p >= upper && current < STEPS - 1) return Math.min(STEPS - 1, Math.floor(p * STEPS));
            if (p < lower && current > 0) return Math.max(0, Math.floor(p * STEPS));
            return current;
        });
    });

    const barScale = useTransform(progress, [0, 1], [0, 1]);
    /* Within each step the mockup drifts +12 -> -12 px. */
    const drift = useTransform(progress, (p) => (0.5 - ((p * STEPS) % 1)) * 24);

    const active = projects[index];
    const title = (p: ProjectBase) => t(`projects_page.projects.${p.id}.title`);
    const tags = (t(`projects_page.projects.${active.id}.tags`, { returnObjects: true }) as string[]).slice(0, 3);

    return (
        <section ref={wrapperRef} className="relative h-[280vh]">
            <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden pt-16">
                <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
                    {/* left: heading, list, counter, tags */}
                    <div className="relative pl-6">
                        <motion.span
                            aria-hidden="true"
                            style={{ scaleY: barScale }}
                            className="absolute inset-y-0 left-0 w-px origin-top bg-accent"
                        />
                        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-line/80" />

                        <SectionHeading label={t("home.featured_label")} title={t("home.featured_title")} />

                        <ol className="mt-10 space-y-3">
                            {projects.map((p, i) => (
                                <li key={p.id}>
                                    <Link
                                        to="/projects"
                                        onFocus={() => setIndex(i)}
                                        className={`font-display text-3xl font-bold tracking-tight transition-colors duration-300 lg:text-4xl ${
                                            i === index ? "text-ink" : "text-muted hover:text-ink-soft"
                                        }`}
                                    >
                                        {title(p)}
                                    </Link>
                                </li>
                            ))}
                        </ol>

                        <div className="mt-8 flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                            <span>
                                {String(index + 1).padStart(2, "0")} / {String(STEPS).padStart(2, "0")}
                            </span>
                            <span className="h-px w-8 bg-line" />
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={active.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {tags.join(" · ")}
                                </motion.span>
                            </AnimatePresence>
                        </div>

                        <Link
                            to="/projects"
                            className="group mt-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ink-soft transition-colors hover:text-accent"
                        >
                            {t("home.featured_link")}
                            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {/* right: device stage */}
                    <div className="relative h-[520px] overflow-hidden rounded-3xl border border-line/70 bg-soft">
                        <div className="blueprint-grid absolute inset-0 opacity-60" />
                        <motion.div
                            animate={{ background: `radial-gradient(ellipse at 50% 40%, ${active.accentColor ?? "rgba(226,84,14,0.18)"}, transparent 70%)` }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0"
                        />
                        <motion.div style={{ y: drift }} className="absolute inset-0">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={active.id}
                                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -24, scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 220, damping: 28 }}
                                    className="absolute inset-0 scale-[1.6] origin-top pt-10"
                                >
                                    <PhoneMockup src={active.image!} alt={title(active)} accentColor={active.accentColor} />
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
