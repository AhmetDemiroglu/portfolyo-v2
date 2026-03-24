import { createFileRoute, Link } from "@tanstack/react-router";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { FiArrowDownCircle, FiExternalLink } from "react-icons/fi";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    const { t, i18n } = useTranslation();
    const heroSectionRef = useRef(null);
    const aboutSectionRef = useRef(null);
    const studioSectionRef = useRef(null);

    const isHeroInView = useInView(heroSectionRef, { once: true, amount: 0.2 });
    const isStudioInView = useInView(studioSectionRef, { once: false, amount: 0.3 });

    const { scrollYProgress: windowScrollYProgress } = useScroll();

    const { scrollYProgress: aboutSectionScrollYProgress } = useScroll({
        target: aboutSectionRef,
        offset: ["start end", "end start"],
    });

    const heroOpacity = useTransform(windowScrollYProgress, [0.1, 0.3], [1, 0]);
    const heroTextX = useTransform(windowScrollYProgress, [0.1, 0.3], ["0%", "-100%"]);

    const opacity = useTransform(aboutSectionScrollYProgress, [0, 0.4], [0, 1]);
    const scale = useTransform(aboutSectionScrollYProgress, [0, 0.4], [0.8, 1]);
    const rotate = useTransform(aboutSectionScrollYProgress, [0, 0.4], [-15, 0]);
    const backgroundTextY = useTransform(aboutSectionScrollYProgress, [0, 1], ["-60%", "-40%"]);

    return (
        <div>
            <Helmet key={`${location.pathname}-${i18n.language}`} defer={false} prioritizeSeoTags>
                <title>{t("seo.home_title")}</title>
                <meta name="description" content={t("seo.home_description") ?? ""} />
            </Helmet>

            {/* HERO SECTION */}
            <section ref={heroSectionRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
                {/* Aurora gradient mesh background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/4 w-[80vw] h-[80vw] rounded-full bg-gradient-to-br from-sky-500/10 via-cyan-400/5 to-transparent blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
                    <div className="absolute -bottom-1/3 -right-1/4 w-[70vw] h-[70vw] rounded-full bg-gradient-to-tl from-purple-500/10 via-violet-400/5 to-transparent blur-3xl animate-pulse" style={{ animationDuration: "10s" }} />
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50vw] h-[30vw] rounded-full bg-gradient-to-r from-teal-400/5 via-sky-300/5 to-purple-400/5 blur-3xl animate-pulse" style={{ animationDuration: "12s" }} />
                </div>

                {/* Content */}
                <div className="container z-10 mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-4 sm:px-6 md:px-8">
                    <motion.div
                        className="w-full md:w-3/5 mt-6 md:mt-0"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: isHeroInView ? 1 : 0, x: isHeroInView ? 0 : -100 }}
                        transition={{ duration: 0.8 }}
                        style={{ x: heroTextX, opacity: heroOpacity }}
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold drop-shadow-lg z-50">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400">
                                {t("home.greeting")}
                            </span>
                        </h1>
                        <TypeAnimation
                            key={i18n.language}
                            sequence={t("home.typing_sequences", { returnObjects: true }) as (string | number)[]}
                            wrapper="span"
                            speed={50}
                            className="mt-3 sm:mt-4 block text-xl sm:text-2xl md:text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-400"
                            repeat={Infinity}
                        />
                        <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg text-slate-500 dark:text-slate-400">{t("home.description")}</p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                to="/projects"
                                className="group relative transform rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-sky-500/25"
                            >
                                {t("home.button")}
                            </Link>
                        </div>
                        <div className="mt-8 flex items-center gap-6">
                            <a href="https://github.com/AhmetDemiroglu" target="_blank" rel="noopener noreferrer" className="text-slate-400 transition-all hover:text-sky-500 hover:scale-110">
                                <FaGithub size={28} />
                            </a>
                            <a href="https://www.linkedin.com/in/ahmet-d-a11b8853/" target="_blank" rel="noopener noreferrer" className="text-slate-400 transition-all hover:text-sky-500 hover:scale-110">
                                <FaLinkedin size={28} />
                            </a>
                        </div>
                    </motion.div>
                    <motion.div
                        className="w-[65%] sm:w-[45%] md:w-[32%] lg:w-[30%] md:-mr-4"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: isHeroInView ? 1 : 0, y: isHeroInView ? 0 : 40 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ opacity: heroOpacity }}
                    >
                        <div className="relative mx-auto">
                            {/* Soft ambient glow */}
                            <div className="absolute -inset-6 bg-gradient-to-b from-sky-400/15 to-transparent dark:from-sky-500/10 dark:to-transparent blur-2xl rounded-full" />
                            {/* Portrait - all edges fade smoothly */}
                            <div
                                className="relative"
                                style={{
                                    WebkitMaskImage: "radial-gradient(ellipse 90% 85% at 50% 40%, black 45%, transparent 75%)",
                                    maskImage: "radial-gradient(ellipse 90% 85% at 50% 40%, black 45%, transparent 75%)",
                                }}
                            >
                                <img
                                    src="ahmet-.webp"
                                    alt="Ahmet Demiroğlu"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 z-20">
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <FiArrowDownCircle size={32} className="text-slate-400 dark:text-slate-500" />
                    </motion.div>
                </div>
            </section>

            {/* CAREER SECTION */}
            <section ref={aboutSectionRef} className="relative flex min-h-[70vh] md:min-h-screen items-center bg-slate-100 dark:bg-slate-800 py-16 sm:py-20 overflow-hidden transition-colors duration-300">
                <motion.h1
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        x: "-50%",
                        y: backgroundTextY,
                    }}
                    className="whitespace-nowrap text-[20vw] md:text-[18vw] font-extrabold text-slate-200 dark:text-slate-700/50 pointer-events-none"
                >
                    {t("home.career_section_background")}
                </motion.h1>

                <div className="container z-10 mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-0 md:justify-between px-4 sm:px-6 md:px-8">
                    <motion.div
                        className="hidden md:block w-full md:w-1/3"
                        style={{ opacity, scale, rotate }}
                    >
                        <img src="career_change.png" alt="Ahmet Demiroğlu" loading="lazy" className="max-h-[70vh] w-full object-contain opacity-25" />
                    </motion.div>
                    <motion.div className="w-full md:w-2/3" style={{ opacity }}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{t("home.career_section_title")}</h2>
                        <div className="mt-3 sm:mt-4 max-w-2xl space-y-3 sm:space-y-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
                            <p>{t("home.career_section_p1")}</p>
                            <p>{t("home.career_section_p2")}</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SEPTIMUSLAB STUDIO SECTION */}
            <section
                ref={studioSectionRef}
                className="relative py-16 sm:py-20 md:py-24 bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-300"
            >
                {/* Subtle background accent */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-br from-sky-500/5 via-teal-400/3 to-purple-500/5 blur-3xl" />
                </div>

                <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={isStudioInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-5xl mx-auto"
                    >
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isStudioInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex-shrink-0"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-400/10 to-teal-400/10 blur-2xl scale-150" />
                                <img
                                    src="septimuslab.png"
                                    alt="SeptimusLab"
                                    loading="lazy"
                                    className="relative w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
                                />
                            </div>
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={isStudioInView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="text-sm font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-2"
                            >
                                {t("home.studio_section_title")}
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={isStudioInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white"
                            >
                                SeptimusLab
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={isStudioInView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-lg"
                            >
                                {t("home.studio_section_description")}
                            </motion.p>

                            {/* App showcase pills */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={isStudioInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="mt-5"
                            >
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                                    {t("home.studio_section_apps_label")}
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <Link to="/projects" className="px-3 py-1.5 text-sm font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-500 transition">
                                        Fintel
                                    </Link>
                                    <Link to="/projects" className="px-3 py-1.5 text-sm font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition">
                                        PureScan Cosmetics
                                    </Link>
                                    <Link to="/projects" className="px-3 py-1.5 text-sm font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-orange-500 transition">
                                        PureScan Foods
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Visit studio link */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={isStudioInView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                                className="mt-6"
                            >
                                <a
                                    href="https://www.septimuslab.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 font-medium hover:underline transition"
                                >
                                    {t("home.studio_section_visit")}
                                    <FiExternalLink size={16} />
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
