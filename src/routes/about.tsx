import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { TimelineSection, CinematicDivider } from "../components/Timeline";
import { FloatingCode } from "../components/FloatingCode";

export const Route = createFileRoute("/about")({
    component: AboutPage,
});

// ─── Timeline config (6 scenes) ───
const TIMELINE_ITEMS = [
    { yearKey: "about.timeline_1_year", iconKey: "graduation", titleKey: "about.timeline_1_title", subtitleKey: "about.timeline_1_subtitle", contentKey: "about.timeline_1_content" },
    { yearKey: "about.timeline_2_year", iconKey: "building", titleKey: "about.timeline_2_title", subtitleKey: "about.timeline_2_subtitle", contentKey: "about.timeline_2_content" },
    { yearKey: "about.timeline_3_year", iconKey: "sparkles", titleKey: "about.timeline_3_title", subtitleKey: "about.timeline_3_subtitle", contentKey: "about.timeline_3_content" },
    { yearKey: "about.timeline_4_year", iconKey: "monitor", titleKey: "about.timeline_4_title", subtitleKey: "about.timeline_4_subtitle", contentKey: "about.timeline_4_content" },
    { yearKey: "about.timeline_5_year", iconKey: "gamepad", titleKey: "about.timeline_5_title", subtitleKey: "about.timeline_5_subtitle", contentKey: "about.timeline_5_content" },
    { yearKey: "about.timeline_6_year", iconKey: "rocket", titleKey: "about.timeline_6_title", subtitleKey: "about.timeline_6_subtitle", contentKey: "about.timeline_6_content", linkKey: "about.timeline_6_link" },
] as const;

// ─── Grain Overlay ───
function GrainOverlay() {
    return (
        <div
            className="pointer-events-none fixed inset-0"
            style={{
                zIndex: 9999,
                opacity: 0.035,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
        />
    );
}

function AboutPage() {
    const { t, i18n } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const heroInView = useInView(heroRef, { once: false, amount: 0.3 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
    const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -60]);
    const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Helmet key={`${i18n.language}`} defer={false} prioritizeSeoTags>
                <title>{t("seo.about_title")}</title>
                <meta name="description" content={t("seo.about_description") ?? ""} />
            </Helmet>

            <GrainOverlay />
            <FloatingCode />

            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 h-[2px]"
                style={{
                    width: progressWidth,
                    background: "linear-gradient(90deg, rgb(56,189,248) 0%, rgb(34,211,238) 50%, rgb(20,184,166) 100%)",
                    zIndex: 100,
                }}
            />

            {/* ═══════════ HERO ═══════════ */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                className="relative flex items-center justify-center pt-32 pb-24 md:pt-40 md:pb-32 px-6"
            >
                {/* Large background text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 2 }}
                        className="text-[18vw] md:text-[14vw] font-black tracking-tight whitespace-nowrap text-slate-200/60 dark:text-slate-700/30"
                        style={{ WebkitTextStroke: "1px rgba(148,163,184,0.06)" }}
                    >
                        {t("about.background_text")}
                    </motion.span>
                </div>

                <div className="relative text-center max-w-3xl mx-auto">
                    {/* Cinematic reveal line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={heroInView ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="w-24 h-[1px] mx-auto mb-8"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.6), transparent)" }}
                    />

                    {/* Label */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="font-mono text-[11px] tracking-[0.4em] uppercase mb-6 text-sky-600/60 dark:text-sky-400/60"
                    >
                        {t("about.hero_label")}
                    </motion.p>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
                    >
                        <span className="text-slate-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-slate-100 dark:via-slate-300 dark:to-slate-500">
                            {t("about.hero_title_line1")}
                        </span>
                        <br />
                        <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 text-5xl md:text-7xl lg:text-8xl"
                            style={{ fontFamily: "'Caveat', cursive" }}
                        >
                            {t("about.hero_title_line2")}
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.7, delay: 0.7 }}
                        className="text-lg md:text-xl leading-relaxed max-w-xl mx-auto text-slate-500 dark:text-slate-400/60"
                    >
                        {t("about.hero_subtitle")}
                    </motion.p>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        className="mt-16"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-400/30">
                                {t("about.scroll_hint")}
                            </span>
                            <div
                                className="w-[1px] h-8"
                                style={{ background: "linear-gradient(180deg, rgba(56,189,248,0.4) 0%, transparent 100%)" }}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* ═══════════ TIMELINE ═══════════ */}
            <section className="relative px-6 md:px-12 pb-32 max-w-6xl mx-auto" style={{ zIndex: 10 }}>
                {TIMELINE_ITEMS.map((item, index) => (
                    <div key={index}>
                        {index > 0 && <CinematicDivider />}
                        <TimelineSection
                            year={t(item.yearKey)}
                            iconKey={item.iconKey}
                            title={t(item.titleKey)}
                            subtitle={t(item.subtitleKey)}
                            content={t(item.contentKey)}
                            index={index}
                            total={TIMELINE_ITEMS.length}
                            link={"linkKey" in item ? (t(item.linkKey as string) ?? undefined) : undefined}
                        />
                    </div>
                ))}
            </section>

            {/* ═══════════ CLOSING QUOTE ═══════════ */}
            <section className="relative py-24 px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 1.5 }}
                    className="text-center max-w-2xl mx-auto"
                >
                    <div
                        className="w-16 h-[1px] mx-auto mb-8"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)"
                        }}
                    />
                    <p className="text-2xl md:text-3xl font-light leading-relaxed italic text-slate-400 dark:text-slate-400/50">
                        "{t("about.closing_quote")}"
                    </p>
                    <div
                        className="w-16 h-[1px] mx-auto mt-8"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)"
                        }}
                    />
                </motion.div>
            </section>
        </div>
    );
}