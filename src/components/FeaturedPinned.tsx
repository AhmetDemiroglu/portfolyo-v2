import { Link } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowRight } from "react-icons/fi";
import type { ResolvedProject } from "../data/projects";
import { ScreenImage } from "./ScreenImage";
import { SectionHeading } from "./SectionHeading";

/* Featured projects as a pinned, stepped stage (docs/MOTION_SPEC.md 4.6, 15):
   280vh wrapper = 100vh stage + 3 steps x 60vh. The list on the left works
   like bookmarks: clicking a title scrolls to that project's step. Each
   project shows a fan of three phones. All three fans stay mounted and
   cross-fade on plain CSS transitions, so a fast scroll that skips a step
   only retargets the transition instead of queueing exits (the old
   AnimatePresence + per-step drift caused the visible jitter). */

const STEPS = 3;
const HYSTERESIS = 0.04;

function Phone({ src, alt, className }: { src: string; alt: string; className: string }) {
    return (
        <div className={`absolute overflow-hidden rounded-[1.6rem] border-[3px] border-ink/70 bg-black shadow-2xl dark:border-line ${className}`}>
            <div className="aspect-[9/19.5] w-full overflow-hidden">
                <ScreenImage src={src} alt={alt} />
            </div>
        </div>
    );
}

/* Centre phone in front, two behind it fanned out. When inactive the side
   phones tuck in behind the centre one, so activation reads as a fan opening. */
function PhoneFan({ project, title, active }: { project: ResolvedProject; title: string; active: boolean }) {
    const [left, right] = project.gallery ?? [];
    const ease = "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";
    return (
        <div
            aria-hidden={!active}
            className={`absolute inset-0 ${ease} ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
            {left && (
                <Phone
                    src={left}
                    alt=""
                    className={`left-1/2 top-[16%] w-[34%] ${ease} ${
                        active ? "-translate-x-[128%] -rotate-6" : "-translate-x-1/2 rotate-0 scale-95"
                    }`}
                />
            )}
            {right && (
                <Phone
                    src={right}
                    alt=""
                    className={`left-1/2 top-[16%] w-[34%] ${ease} ${
                        active ? "translate-x-[28%] rotate-6" : "-translate-x-1/2 rotate-0 scale-95"
                    }`}
                />
            )}
            <Phone
                src={project.image!}
                alt={title}
                className={`left-1/2 top-[7%] z-10 w-[40%] -translate-x-1/2 ${ease} ${active ? "scale-100" : "scale-95"}`}
            />
        </div>
    );
}

export function FeaturedPinned({ projects }: { projects: ResolvedProject[] }) {
    const { t } = useTranslation();
    const wrapperRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 });
    const [index, setIndex] = useState(0);

    /* The step follows the raw scroll position (no spring lag), with 4%
       hysteresis around each threshold. */
    useMotionValueEvent(scrollYProgress, "change", (p) => {
        setIndex((current) => {
            const upper = (current + 1) / STEPS + HYSTERESIS / 2;
            const lower = current / STEPS - HYSTERESIS / 2;
            if (p >= upper || p < lower) return Math.min(STEPS - 1, Math.max(0, Math.floor(p * STEPS)));
            return current;
        });
    });

    const barScale = useTransform(smooth, [0, 1], [0, 1]);

    /* Bookmark: jump the page to the middle of that project's step. */
    const goTo = (i: number) => {
        const el = wrapperRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const travel = el.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + travel * ((i + 0.5) / STEPS), behavior: "smooth" });
    };

    const active = projects[index];
    const title = (p: ResolvedProject) => t(`projects_page.projects.${p.id}.title`);
    const tags = (t(`projects_page.projects.${active.id}.tags`, { returnObjects: true }) as string[]).slice(0, 3);

    return (
        <section ref={wrapperRef} className="relative h-[280vh]">
            <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden pt-16">
                <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
                    {/* left: heading, bookmarks, counter, tags */}
                    <div className="relative pl-6">
                        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-line/80" />
                        <motion.span
                            aria-hidden="true"
                            style={{ scaleY: barScale }}
                            className="absolute inset-y-0 left-0 w-px origin-top bg-accent"
                        />

                        <SectionHeading label={t("home.featured_label")} title={t("home.featured_title")} />

                        <ol className="mt-10 space-y-3">
                            {projects.map((p, i) => (
                                <li key={p.id}>
                                    <button
                                        type="button"
                                        onClick={() => goTo(i)}
                                        aria-current={i === index ? "true" : undefined}
                                        className={`text-left font-display text-3xl font-bold tracking-tight transition-colors duration-300 lg:text-4xl ${
                                            i === index ? "text-ink" : "text-muted hover:text-ink-soft"
                                        }`}
                                    >
                                        {title(p)}
                                    </button>
                                </li>
                            ))}
                        </ol>

                        <div className="mt-8 flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                            <span>
                                {String(index + 1).padStart(2, "0")} / {String(STEPS).padStart(2, "0")}
                            </span>
                            <span className="h-px w-8 bg-line" />
                            <span>{tags.join(" · ")}</span>
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
                    <div className="relative h-[540px] overflow-hidden rounded-3xl border border-line/70 bg-soft">
                        <div className="blueprint-grid absolute inset-0 opacity-60" />
                        {projects.map((p, i) => (
                            <div
                                key={p.id}
                                aria-hidden="true"
                                className={`absolute inset-0 transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}
                                style={{
                                    background: `radial-gradient(ellipse at 50% 45%, ${p.accentColor ?? "rgba(226,84,14,0.18)"}, transparent 70%)`,
                                }}
                            />
                        ))}
                        {projects.map((p, i) => (
                            <PhoneFan key={p.id} project={p} title={title(p)} active={i === index} />
                        ))}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-soft to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
}
