import { Link, createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { FiArrowDown, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { CityScene } from "../components/scenery/CityScene";
import { Contours } from "../components/scenery/Contours";
import { TechRibbon } from "../components/Marquee";
import { SectionHeading } from "../components/SectionHeading";
import { GhostWord, ParallaxY, Reveal } from "../components/motion/primitives";
import { PhoneMockup, LaptopMockup } from "../components/DeviceMockups";
import { projectsData } from "../data/projects";

export const Route = createFileRoute("/")({
    component: HomePage,
});

const RIBBON = [
    "React",
    "Vue.js",
    ".NET Core",
    "TypeScript",
    "Next.js",
    "React Native",
    "PostgreSQL",
    "SQL Server",
    "Python",
    "UI / UX",
];

const FEATURED_IDS = ["gghub", "purescan_foods", "purescan"] as const;

function Hero() {
    const { t } = useTranslation();
    const heroRef = useRef<HTMLElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-36%"]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

    return (
        <section
            ref={heroRef}
            className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
        >
            <CityScene heroRef={heroRef} />

            <motion.div
                style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
                className="relative z-10 mx-auto -mt-16 max-w-4xl px-5 text-center sm:px-8"
            >
                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="flex min-h-[3.75rem] items-end justify-center"
                >
                    <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent sm:text-base">
                        {t("home.kicker")}
                    </p>
                </motion.div>

                <h1 className="mt-5 font-display text-[2.6rem] font-bold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                    <motion.span
                        className="block"
                        initial={reduce ? false : { opacity: 0, y: 34 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {t("home.line1")}
                    </motion.span>
                    <motion.span
                        className="block"
                        initial={reduce ? false : { opacity: 0, y: 34 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {t("home.line2a")}
                        <span className="text-accent">{t("home.line2b")}</span>
                    </motion.span>
                </h1>

                <motion.p
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg"
                >
                    {t("home.description")}
                </motion.p>

                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-4"
                >
                    <Link
                        to="/projects"
                        className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-accent hover:text-white sm:text-sm"
                    >
                        {t("home.cta_projects")}
                        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-3 rounded-full border border-line bg-surface/60 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.15em] text-ink backdrop-blur-sm transition-colors hover:border-accent hover:text-accent sm:text-sm"
                    >
                        {t("home.cta_contact")}
                    </Link>
                </motion.div>
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
    );
}

function CareerSection() {
    const { t } = useTranslation();
    const stats = t("home.stats", { returnObjects: true }) as Array<{
        value: string;
        label: string;
    }>;

    return (
        <section className="relative overflow-hidden pb-16 pt-24 sm:pb-20 sm:pt-32">
            <GhostWord word={t("home.career_ghost")} className="top-8" from={100} to={-160} />

            <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
                <SectionHeading label={t("home.career_label")} title={t("home.career_title")} />

                <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
                    <Reveal delay={0.1}>
                        <p className="border-l-2 border-accent pl-6 text-lg leading-relaxed text-ink-soft">
                            {t("home.career_p1")}
                        </p>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="text-lg leading-relaxed text-ink-soft">{t("home.career_p2")}</p>
                    </Reveal>
                </div>

                <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/70 bg-line/70 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <Reveal key={stat.label} delay={0.08 * i} className="bg-surface">
                            <div className="p-7 sm:p-9">
                                <p className="font-display text-4xl font-bold text-accent sm:text-5xl">
                                    {stat.value}
                                </p>
                                <p className="mt-3 text-sm leading-snug text-muted">{stat.label}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function StudioSection() {
    const { t } = useTranslation();

    return (
        <section className="relative py-12 sm:py-16">
            <Contours />
            <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
                <div className="overflow-hidden rounded-3xl border border-line/70 bg-surface shadow-sm">
                    <div className="grid items-center lg:grid-cols-2">
                        <div className="p-9 sm:p-14">
                            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
                                <span className="inline-block h-px w-8 bg-accent" />
                                {t("home.studio_label")}
                            </p>
                            <h2 className="mt-5 flex items-center gap-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                                <img
                                    src="/septimuslab.png"
                                    alt="SeptimusLab"
                                    className="h-12 w-12 rounded-xl object-contain sm:h-14 sm:w-14"
                                />
                                SeptimusLab
                            </h2>
                            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
                                {t("home.studio_desc")}
                            </p>
                            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                                {t("home.studio_apps_label")}: GGHub · Fintel · PureScan Foods · PureScan Cosmetics
                            </p>
                            <a
                                href="https://septimuslab.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group mt-9 inline-flex items-center gap-3 rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink transition-colors hover:border-accent hover:text-accent"
                            >
                                {t("home.studio_cta")}
                                <FiArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </a>
                        </div>

                        <div className="relative hidden h-[420px] overflow-hidden bg-soft lg:block">
                            <div className="blueprint-grid absolute inset-0" />
                            <ParallaxY from={50} to={-30} className="absolute left-6 top-16 w-44">
                                <img
                                    src="/gghub-screen.jpg"
                                    alt="GGHub"
                                    loading="lazy"
                                    className="rounded-2xl border-4 border-ink/70 shadow-2xl dark:border-line"
                                />
                            </ParallaxY>
                            <ParallaxY from={-30} to={40} className="absolute left-52 top-6 w-44">
                                <img
                                    src="/purescan-screen.png"
                                    alt="PureScan"
                                    loading="lazy"
                                    className="rounded-2xl border-4 border-ink/70 shadow-2xl dark:border-line"
                                />
                            </ParallaxY>
                            <ParallaxY from={70} to={-50} className="absolute left-[24rem] top-24 w-44">
                                <img
                                    src="/purescan-foods-screen.png"
                                    alt="PureScan Foods"
                                    loading="lazy"
                                    className="rounded-2xl border-4 border-ink/70 shadow-2xl dark:border-line"
                                />
                            </ParallaxY>
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-soft to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturedSection() {
    const { t } = useTranslation();
    const featured = FEATURED_IDS.map((id) => projectsData.find((p) => p.id === id)!);

    return (
        <section className="relative py-24 sm:py-28">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <SectionHeading
                        label={t("home.featured_label")}
                        title={t("home.featured_title")}
                    />
                    <Reveal delay={0.15}>
                        <Link
                            to="/projects"
                            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ink-soft transition-colors hover:text-accent"
                        >
                            {t("home.featured_link")}
                            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </Reveal>
                </div>

                <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
                    {featured.map((project, i) => (
                        <Reveal key={project.id} delay={0.1 * i} className="h-full">
                            <Link
                                to="/projects"
                                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/70 bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-xl"
                            >
                                <div className="relative h-60 shrink-0 overflow-hidden bg-soft">
                                    {project.mockupType === "phone" ? (
                                        <PhoneMockup
                                            src={`/${project.image}`}
                                            alt={t(`projects_page.projects.${project.id}.title`)}
                                            accentColor={project.accentColor}
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center p-6">
                                            <LaptopMockup
                                                src={`/${project.image}`}
                                                alt={t(`projects_page.projects.${project.id}.title`)}
                                                accentColor={project.accentColor}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-grow items-start justify-between gap-4 p-6">
                                    <div>
                                        <h3 className="font-display text-lg font-bold text-ink transition-colors group-hover:text-accent">
                                            {t(`projects_page.projects.${project.id}.title`)}
                                        </h3>
                                        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                                            {(
                                                t(`projects_page.projects.${project.id}.tags`, {
                                                    returnObjects: true,
                                                }) as string[]
                                            )
                                                .slice(0, 3)
                                                .join(" · ")}
                                        </p>
                                    </div>
                                    <FiArrowUpRight className="mt-1 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HomePage() {
    const { t, i18n } = useTranslation();

    return (
        <div>
            <Helmet key={i18n.language} defer={false} prioritizeSeoTags>
                <title>{t("seo.home_title")}</title>
                <meta name="description" content={t("seo.home_description") ?? ""} />
            </Helmet>

            <Hero />
            <TechRibbon items={RIBBON} />
            <CareerSection />
            <StudioSection />
            <TechRibbon items={RIBBON} flip />
            <FeaturedSection />
        </div>
    );
}
