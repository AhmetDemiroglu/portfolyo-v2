import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { Contours } from "../components/scenery/Contours";
import { GhostWord, ParallaxY, Reveal } from "../components/motion/primitives";

export const Route = createFileRoute("/about")({
    component: AboutPage,
});

const MILESTONES = [1, 2, 3, 4, 5, 6] as const;
const DARK_PHOTO_MASK =
    "radial-gradient(ellipse 82% 78% at 50% 38%, black 55%, transparent 80%)";

function TimelineItem({ index }: { index: number }) {
    const { t } = useTranslation();
    const isLeft = index % 2 === 1;
    const link = index === 6 ? t("about.timeline_6_link") : null;

    return (
        <div className="relative grid gap-6 py-10 md:grid-cols-2 md:gap-16 lg:py-16">
            {/* node on the spine */}
            <span className="absolute left-[7px] top-12 z-10 hidden h-3.5 w-3.5 rounded-full border-2 border-accent bg-paper md:left-1/2 md:block md:-translate-x-1/2" />

            {/* oversized year, drifting on scroll */}
            <ParallaxY
                from={50}
                to={-50}
                className={`hidden items-start md:flex ${
                    isLeft ? "justify-end md:order-2 md:pl-10" : "justify-start md:pr-10"
                }`}
            >
                <span className="text-stroke select-none font-display text-7xl font-bold leading-none lg:text-8xl">
                    {t(`about.timeline_${index}_year`)}
                </span>
            </ParallaxY>

            <Reveal className={isLeft ? "md:order-1" : ""}>
                <div className="rounded-2xl border border-line/70 bg-surface p-7 shadow-sm transition-colors hover:border-accent/50 sm:p-9">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent md:hidden">
                        {t(`about.timeline_${index}_year`)}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-ink md:mt-0">
                        {t(`about.timeline_${index}_title`)}
                    </h3>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-muted">
                        {t(`about.timeline_${index}_subtitle`)}
                    </p>
                    <p className="mt-4 leading-relaxed text-ink-soft">
                        {t(`about.timeline_${index}_content`)}
                    </p>
                    {link && (
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent"
                        >
                            septimuslab.com
                            <FiArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                    )}
                </div>
            </Reveal>
        </div>
    );
}

function AboutPage() {
    const { t, i18n } = useTranslation();
    const reduce = useReducedMotion();
    const timelineRef = useRef<HTMLDivElement>(null);

    // Spine grows and shrinks with scroll, fully bidirectional.
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start 0.7", "end 0.6"],
    });
    const spineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const heroY = useTransform(heroProgress, [0, 1], ["0%", "-30%"]);
    const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);

    return (
        <div>
            <Helmet key={i18n.language} defer={false} prioritizeSeoTags>
                <title>{t("seo.about_title")}</title>
                <meta name="description" content={t("seo.about_description") ?? ""} />
            </Helmet>

            {/* Hero */}
            <section
                ref={heroRef}
                className="relative flex min-h-[88svh] items-center justify-center overflow-hidden"
            >
                <Contours />
                <motion.div
                    style={reduce ? undefined : { y: heroY, opacity: heroOpacity }}
                    className="relative z-10 mx-auto grid max-w-5xl items-center gap-12 px-5 pb-10 pt-28 sm:px-8 lg:grid-cols-[1fr_auto] lg:gap-20"
                >
                    <div className="text-center lg:text-left">
                        <Reveal>
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent sm:text-sm">
                                {t("about.label")}
                            </p>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight text-ink sm:text-7xl">
                                <span className="block">{t("about.title_line1")}</span>
                                <span className="block text-accent">{t("about.title_line2")}</span>
                            </h1>
                        </Reveal>
                        <Reveal delay={0.2}>
                            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft lg:mx-0">
                                {t("about.subtitle")}
                            </p>
                        </Reveal>
                    </div>

                    <Reveal delay={0.25} className="justify-self-center lg:justify-self-end">
                        <ParallaxY from={24} to={-24}>
                            {/* Light mode: one transparent frame, with the photo anchored to its
                                left and bottom edges. The source image keeps its natural alpha. */}
                            <div className="relative w-56 overflow-hidden rounded-[1.75rem] border border-accent/55 sm:w-64 dark:hidden">
                                <img
                                    src="/ahmet-.webp"
                                    alt="Ahmet Demiroğlu"
                                    className="block w-full"
                                />
                            </div>

                            {/* Dark mode intentionally keeps the original offset frames and fade. */}
                            <div className="relative hidden w-56 sm:w-64 dark:block">
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 translate-x-4 translate-y-4 rounded-[1.75rem] border border-accent/55"
                                />
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 -translate-x-2 -translate-y-2 rounded-[1.75rem] border border-line/50"
                                />
                                <img
                                    src="/ahmet-.webp"
                                    alt="Ahmet Demiroğlu"
                                    className="relative block w-full"
                                    style={{
                                        WebkitMaskImage: DARK_PHOTO_MASK,
                                        maskImage: DARK_PHOTO_MASK,
                                    }}
                                />
                            </div>
                        </ParallaxY>
                    </Reveal>
                </motion.div>

                <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2">
                    <div className="flex flex-col items-center gap-2 text-muted">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
                            {t("common.scroll")}
                        </span>
                        <FiArrowDown className="animate-scroll-dot" />
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="relative overflow-hidden pb-24 sm:pb-32">
                <GhostWord word={t("about.ghost")} className="top-0" from={-120} to={120} />

                <div ref={timelineRef} className="relative mx-auto max-w-5xl px-5 sm:px-8">
                    {/* spine */}
                    <div className="absolute inset-y-0 left-[12px] w-px bg-line/80 md:left-1/2" />
                    <motion.div
                        style={{ scaleY: reduce ? 1 : spineScale }}
                        className="absolute inset-y-0 left-[12px] w-px origin-top bg-accent md:left-1/2"
                    />

                    <div className="relative pl-8 md:pl-0">
                        {MILESTONES.map((index) => (
                            <TimelineItem key={index} index={index} />
                        ))}
                    </div>
                </div>

                {/* Closing quote */}
                <div className="mx-auto mt-24 max-w-4xl px-5 text-center sm:px-8">
                    <Reveal>
                        <span className="font-display text-7xl leading-none text-accent">“</span>
                        <blockquote className="-mt-6 font-display text-3xl font-bold leading-snug tracking-tight text-ink sm:text-4xl">
                            {t("about.closing_quote")}
                        </blockquote>
                        <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-muted">
                            Ahmet Demiroğlu
                        </p>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
