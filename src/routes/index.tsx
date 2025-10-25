import { createFileRoute, Link } from "@tanstack/react-router";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { FiArrowDownCircle } from "react-icons/fi";
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

    const isHeroInView = useInView(heroSectionRef, { once: true, amount: 0.2 });

    const { scrollYProgress: windowScrollYProgress } = useScroll();

    const { scrollYProgress: aboutSectionScrollYProgress } = useScroll({
        target: aboutSectionRef,
        offset: ["start end", "end start"],
    });

    const heroOpacity = useTransform(windowScrollYProgress, [0.1, 0.3], [1, 0]);
    const heroTextX = useTransform(windowScrollYProgress, [0.1, 0.3], ["0%", "-100%"]);
    const heroImageX = useTransform(windowScrollYProgress, [0.1, 0.3], ["0%", "100%"]);

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
            {/* BÖLÜM 1: HERO ALANI */}
            <section ref={heroSectionRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
                {/* Arka Plan */}
                <motion.div
                    animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-sky-500/20 blur-3xl"
                />
                <motion.div
                    animate={{ y: [15, -15, 15] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"
                />

                {/* Ana İçerik */}
                <div className="container z-10 mx-auto flex items-center justify-between px-8">
                    <motion.div
                        className="w-full md:w-3/5"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: isHeroInView ? 1 : 0, x: isHeroInView ? 0 : -100 }}
                        transition={{ duration: 0.8 }}
                        style={{ x: heroTextX, opacity: heroOpacity }}
                    >
                        <h1 className="text-5xl font-extrabold text-white md:text-7xl">{t("home.greeting")}</h1>
                        <TypeAnimation
                            key={i18n.language}
                            sequence={t("home.typing_sequences", { returnObjects: true }) as (string | number)[]}
                            wrapper="span"
                            speed={50}
                            className="mt-4 block text-2xl text-slate-400 md:text-3xl"
                            repeat={Infinity}
                        />
                        <p className="mt-6 max-w-xl text-lg text-slate-300">{t("home.description")}</p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link to="/projects" className="transform rounded-md bg-sky-500 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-sky-600">
                                {t("home.button")}
                            </Link>
                        </div>
                        <div className="mt-8 flex items-center gap-6">
                            <a href="https://github.com/AhmetDemiroglu" target="_blank" rel="noopener noreferrer" className="text-slate-400 transition hover:text-white">
                                {" "}
                                <FaGithub size={28} />{" "}
                            </a>
                            <a href="https://www.linkedin.com/in/ahmet-d-a11b8853/" target="_blank" rel="noopener noreferrer" className="text-slate-400 transition hover:text-white">
                                {" "}
                                <FaLinkedin size={28} />{" "}
                            </a>
                        </div>
                    </motion.div>
                    <motion.div
                        className="hidden w-2/5 md:block mt-20"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: isHeroInView ? 1 : 0, x: isHeroInView ? 0 : 100 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ x: heroImageX, opacity: heroOpacity }}
                    >
                        <img src="ahmetfoto_t.webp" alt="Ahmet Demiroğlu Portre" className="rounded-full" />
                    </motion.div>
                </div>

                {/* Aşağı Kaydır İkonu */}
                <div className="absolute bottom-10 z-20">
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <FiArrowDownCircle size={32} className="text-slate-500" />
                    </motion.div>
                </div>
            </section>

            {/* BÖLÜM 2: GELİŞMİŞ ANİMASYONLU "KISACA BEN" BÖLÜMÜ */}
            <section ref={aboutSectionRef} className="relative flex min-h-screen items-center bg-slate-100 dark:bg-slate-800 py-20 overflow-hidden transition-colors duration-300">
                {/* VİZYON - Katman 1: Parallax Arka Plan Yazısı */}
                <motion.h1
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        x: "-50%", // ← Tam ortada
                        y: backgroundTextY,
                    }}
                    className="whitespace-nowrap text-[18vw] font-extrabold text-slate-200 dark:text-slate-700/50 pointer-events-none"
                >
                    {t("home.career_section_background")}
                </motion.h1>

                <div className="container z-10 mx-auto flex flex-col items-center gap-12 px-8 md:flex-row">
                    {/* Sol Taraf*/}
                    <motion.div
                        className="w-full md:w-1/3"
                        style={{
                            opacity,
                            scale,
                            rotate,
                        }}
                    >
                        <img src="career_change.png" alt="Ahmet Demiroğlu" className="max-h-[70vh] w-full object-contain opacity-25" />{" "}
                    </motion.div>

                    {/* Sağ Taraf */}
                    <motion.div className="w-full md:w-2/3" style={{ opacity }}>
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">{t("home.career_section_title")}</h2>
                        <div className="mt-4 max-w-2xl space-y-4 text-lg text-slate-600 dark:text-slate-300">
                            <p>{t("home.career_section_p1")}</p>
                            <p>{t("home.career_section_p2")}</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
