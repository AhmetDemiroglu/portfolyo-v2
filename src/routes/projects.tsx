import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaAndroid, FaGooglePlay } from "react-icons/fa";
import { BsPinAngleFill } from "react-icons/bs";
import { projectsData, type ProjectBase } from "../data/projects";
import { AnimatedGridBackground } from "../components/GridBackground";
import { PhoneMockup, LaptopMockup } from "../components/DeviceMockups";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Helmet } from "react-helmet-async";
import { useState } from "react";

interface ProjectTranslation {
    title: string;
    description: string;
    tags: string[];
}

type FullProject = ProjectBase & ProjectTranslation;

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

const badgeConfig: Record<string, { bg: string; text: string; dot: string }> = {
    live: { bg: "bg-emerald-100 dark:bg-emerald-900/50", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
    beta: { bg: "bg-amber-100 dark:bg-amber-900/50", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
    apk: { bg: "bg-violet-100 dark:bg-violet-900/50", text: "text-violet-700 dark:text-violet-300", dot: "bg-violet-500" },
    new: { bg: "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50", text: "text-purple-700 dark:text-purple-300", dot: "bg-purple-500" },
    experimental: { bg: "bg-cyan-100 dark:bg-cyan-900/50", text: "text-cyan-700 dark:text-cyan-300", dot: "bg-cyan-500" },
};

const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

export const Route = createFileRoute("/projects")({
    component: ProjectsPage,
});

/* ─── Image area (sabit yükseklikte, mockup veya düz görsel) ─── */
function ProjectImageArea({ project }: { project: FullProject }) {
    if (project.mockupType === "phone") {
        return (
            <div className="relative h-[280px] sm:h-[300px] bg-gradient-to-br from-slate-200 via-slate-100 to-white dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 rounded-t-xl overflow-hidden">
                <PhoneMockup src={project.image} alt={project.title} accentColor={project.accentColor} />
            </div>
        );
    }
    if (project.mockupType === "laptop") {
        return (
            <div className="relative h-[280px] sm:h-[300px] flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-white dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 rounded-t-xl overflow-hidden p-4 sm:p-6">
                <LaptopMockup src={project.image} alt={project.title} accentColor={project.accentColor} />
            </div>
        );
    }
    return (
        <div className="relative h-[280px] sm:h-[300px] overflow-hidden rounded-t-xl">
            <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover"
            />
        </div>
    );
}

/* ─── Badge bileşeni ─── */
function BadgeList({ badges, t }: { badges?: string[]; t: TFunction }) {
    if (!badges || badges.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
            {badges.map((badge) => {
                const config = badgeConfig[badge];
                if (!config) return null;
                return (
                    <span
                        key={badge}
                        className={`${config.bg} ${config.text} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-flex items-center gap-1`}
                    >
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
                        </span>
                        {t(`projects_page.badges.${badge}`)}
                    </span>
                );
            })}
        </div>
    );
}

/* ─── Açıklama: sabit yükseklik + devamını gör ─── */
const DESC_CHAR_LIMIT = 150;

function ExpandableDescription({ text, t }: { text: string; t: TFunction }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = text && text.length > DESC_CHAR_LIMIT;

    return (
        <div className="mt-2">
            <p className={`text-sm text-slate-600 dark:text-slate-400 leading-relaxed ${!expanded && isLong ? "line-clamp-3" : ""}`}>
                {text}
            </p>
            {isLong && (
                <button
                    onClick={() => setExpanded((v) => !v)}
                    className="mt-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                    {expanded ? t("projects_page.show_less") : t("projects_page.show_more")}
                </button>
            )}
        </div>
    );
}

/* ─── Buton grubu ─── */
function ActionButtons({ project, t }: { project: FullProject; t: TFunction }) {
    return (
        <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
            {project.liveLink && (
                <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-800 bg-slate-200 rounded-md hover:bg-slate-300 dark:text-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition"
                >
                    <FaExternalLinkAlt className="text-[10px] sm:text-xs" /> {t("projects_page.view_live_button")}
                </a>
            )}
            {project.githubLink && (
                <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition"
                >
                    <FaGithub className="text-xs sm:text-sm" /> {t("projects_page.view_github_button")}
                </a>
            )}
            {project.apkLink && (
                <a
                    href={project.apkLink}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-700 transition"
                >
                    <FaAndroid className="text-xs sm:text-sm" /> {t("projects_page.download_apk_button")}
                </a>
            )}
            {project.googlePlayLink && (
                <a
                    href={project.googlePlayLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
                >
                    <FaGooglePlay className="text-xs sm:text-sm" /> {t("projects_page.view_google_play_button")}
                </a>
            )}
        </div>
    );
}

/* ─── SAYFA ─── */
function ProjectsPage() {
    const { t, i18n } = useTranslation();

    const translatedProjects = (t('projects_page.projects', { returnObjects: true, defaultValue: {} }) || {}) as Record<string, ProjectTranslation>;
    const fullProjectsData: FullProject[] = projectsData.map((projectBase) => ({
        ...projectBase,
        ...(translatedProjects[projectBase.id] || {}),
    }));

    const pinnedProject = fullProjectsData.find((p) => p.pinned);
    const otherProjects = fullProjectsData.filter((p) => !p.pinned);

    return (
        <div className="relative min-h-screen pt-16">
            <Helmet key={`${i18n.language}`} defer={false} prioritizeSeoTags>
                <title>{t("seo.projects_title")}</title>
                <meta name="description" content={t("seo.projects_description") ?? ""} />
            </Helmet>
            <AnimatedGridBackground />
            <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">{t("projects_page.main_title")}</h1>
                    <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-center text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400">{t("projects_page.subtitle")}</p>
                </motion.div>

                {pinnedProject && <PinnedProjectCard project={pinnedProject} t={t} />}

                <motion.div
                    className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {otherProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} t={t} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

/* ─── PROJE KARTI ─── */
function ProjectCard({ project, t }: { project: FullProject; t: TFunction }) {
    return (
        <motion.div
            className="flex flex-col rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/5"
            variants={itemVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 200 }}
        >
            {/* Sabit yükseklikte görsel alanı */}
            <ProjectImageArea project={project} />

            {/* İçerik alanı */}
            <div className="p-4 sm:p-5 flex flex-col flex-grow">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">{project.title}</h3>
                <BadgeList badges={project.badges} t={t} />

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {(project.tags || []).map((tag) => (
                        <span key={tag} className="bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Açıklama: sabit alan + devamını gör */}
                <ExpandableDescription text={project.description} t={t} />

                {/* Butonlar */}
                <ActionButtons project={project} t={t} />
            </div>
        </motion.div>
    );
}

/* ─── ÖNE ÇIKAN PROJE ─── */
function PinnedProjectCard({ project, t }: { project: FullProject; t: TFunction }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = project.description && project.description.length > 200;

    return (
        <motion.div
            className="relative mt-10 sm:mt-16 rounded-xl bg-white/60 dark:bg-slate-800/60 border-2 border-sky-500 dark:border-sky-400 p-4 sm:p-6 md:p-8 shadow-2xl shadow-sky-500/10 backdrop-blur-sm"
            whileHover={{ y: -4, borderColor: "#38bdf8" }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className="absolute -top-3 -left-1 -rotate-90">
                <BsPinAngleFill size={28} className="text-sky-500 dark:text-sky-300 drop-shadow-lg sm:text-[35px]" />
            </div>

            <div className="flex flex-col md:flex-row gap-5 sm:gap-8 items-center">
                {/* Görsel */}
                <div className="w-full md:w-2/5">
                    <img src={project.image} alt={project.title} loading="lazy" className="w-full rounded-lg object-cover shadow-lg" />
                </div>

                {/* İçerik */}
                <div className="w-full md:w-3/5 flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400">{t("projects_page.featured_badge")}</span>
                    <div className="flex items-start gap-3 flex-wrap mt-1 sm:mt-2">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{project.title}</h2>
                        <BadgeList badges={project.badges} t={t} />
                    </div>

                    <div className="flex flex-wrap gap-1.5 my-3 sm:my-4">
                        {(project.tags || []).map((tag) => (
                            <span key={tag} className="bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300 text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <p className={`text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed ${!expanded && isLong ? "line-clamp-4" : ""}`}>
                        {project.description}
                    </p>
                    {isLong && (
                        <button
                            onClick={() => setExpanded((v) => !v)}
                            className="mt-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline self-start"
                        >
                            {expanded ? t("projects_page.show_less") : t("projects_page.show_more")}
                        </button>
                    )}

                    <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
                        {project.liveLink && (
                            <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-base font-medium text-slate-800 bg-slate-200 rounded-md hover:bg-slate-300 dark:text-white dark:bg-slate-700 dark:hover:bg-slate-600 transition"
                            >
                                <FaExternalLinkAlt /> {t("projects_page.view_live_button")}
                            </a>
                        )}
                        {project.githubLink && (
                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-base font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition"
                            >
                                <FaGithub /> {t("projects_page.view_github_button_long")}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
