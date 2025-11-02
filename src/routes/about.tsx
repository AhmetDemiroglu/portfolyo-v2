import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { TimelineSection } from "../components/Timeline";
import { FloatingCode } from "../components/FloatingCode";

export const Route = createFileRoute("/about")({
    component: AboutPage,
});

function AboutPage() {
    const { t, i18n } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const backgroundTextY = useTransform(scrollYProgress, [0, 1], ["-90%", "-10%"]);

    return (
        <div ref={containerRef} className="relative bg-gray-50 dark:bg-slate-900 pt-32 min-h-screen transition-colors duration-300">
            <Helmet key={`${i18n.language}`} defer={false} prioritizeSeoTags>
                <title>{t("seo.about_title")}</title>
                <meta name="description" content={t("seo.about_description") ?? ""} />
            </Helmet>

            <FloatingCode />

            {/* Arka Plan Gradient */}
            <motion.div
                animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"
            />

            {/* HAKKIMDA Parallax Yazısı */}
            <motion.h1
                style={{
                    y: backgroundTextY,
                    x: "-50%",
                    left: "50%",
                    top: "50%",
                }}
                className="absolute whitespace-nowrap text-[15vw] font-extrabold text-slate-200 dark:text-slate-800 pointer-events-none"
            >
                {t("about.background_text")}
            </motion.h1>

            {/* Ana İçerik */}
            <div className="relative container mx-auto px-6 md:px-12 pb-16 max-w-7xl" style={{ zIndex: 10 }}>
                {/* Başlık */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-20 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">{t("about.title")}</h2>
                </motion.div>

                {/* Timeline + Paragraf Akışı */}
                <div className="relative">
                    {/* Dikey Çizgi */}
                    <div className="absolute left-[66.66%] top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 via-purple-500 to-pink-500 hidden md:block" />

                    {/* İçerik Akışı */}
                    <div className="space-y-12">
                        <TimelineSection year="2013" icon="🎓" title={t("about.timeline_1_title")} subtitle={t("about.timeline_1_subtitle")} content={t("about.p1")} index={0} />

                        <TimelineSection year="2014-2023" icon="🏢" title={t("about.timeline_2_title")} subtitle={t("about.timeline_2_subtitle")} content={t("about.p2")} index={1} />

                        <TimelineSection year="2023" icon="✨" title={t("about.timeline_3_title")} subtitle={t("about.timeline_3_subtitle")} content={t("about.p3")} index={2} />

                        <TimelineSection year="2025" icon="🖥️" title={t("about.timeline_4_title")} subtitle={t("about.timeline_4_subtitle")} content={t("about.p4")} index={3} />

                        <TimelineSection year="2025" icon="🎮" title={t("about.timeline_5_title")} subtitle={t("about.timeline_5_subtitle")} content={t("about.p5")} index={4} />
                    </div>
                </div>
            </div>
        </div>
    );
}
