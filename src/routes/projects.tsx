import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaAndroid, FaGooglePlay } from "react-icons/fa";
import { BsPinAngleFill } from "react-icons/bs";
import { projectsData, type ProjectBase } from "../data/projects";
import { AnimatedGridBackground } from "../components/GridBackground";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Helmet } from "react-helmet-async";

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
};

const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

export const Route = createFileRoute("/projects")({
    component: ProjectsPage,
});

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
            <div className="relative z-10 container mx-auto px-8 py-16">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-center text-5xl font-bold text-slate-900 dark:text-white">{t("projects_page.main_title")}</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-center text-xl text-slate-600 dark:text-slate-400">{t("projects_page.subtitle")}</p>
                </motion.div>

                {pinnedProject && <PinnedProjectCard project={pinnedProject} t={t} />}

                <motion.div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8" variants={containerVariants} initial="hidden" animate="visible">
                    {otherProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} t={t} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

function ProjectCard({ project, t }: { project: FullProject; t: TFunction }) {
    return (
        <motion.div
            className="flex flex-col rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden h-full transition-colors duration-300"
            variants={itemVariants}
            whileHover={{ y: -5, borderColor: "#0ea5e9" }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <div className="overflow-hidden rounded-lg px-5 pt-5">
                <img src={project.image} alt={project.title} className="rounded-lg w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="p-6 flex flex-col flex-grow dark:bg-slate-800/50">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{project.title}</h3>
                {project.badges && project.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-0 mt-1">
                        {project.badges.map((badge) => (
                            <span
                                key={badge}
                                className={`${badgeConfig[badge].bg} ${badgeConfig[badge].text} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-flex items-center gap-1`}
                            >
                                <div className={`relative flex h-2 w-2`}>
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badgeConfig[badge].dot}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${badgeConfig[badge].dot}`}></span>
                                </div>
                                {t(`projects_page.badges.${badge}`)}
                            </span>
                        ))}
                    </div>
                )}
                <div className="flex flex-wrap gap-2 my-4">
                    {(project.tags || []).map((tag) => (
                        <span key={tag} className="bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 flex-grow">{project.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                    {project.liveLink && (
                        <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-800 bg-slate-200 rounded-md hover:bg-slate-300 dark:text-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition"
                        >
                            <FaExternalLinkAlt /> {t("projects_page.view_live_button")}
                        </a>
                    )}
                    {project.githubLink && (
                        <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition"
                        >
                            <FaGithub /> {t("projects_page.view_github_button")}
                        </a>
                    )}
                    {project.apkLink && (
                        <a
                            href={project.apkLink}
                            download
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-700 transition"
                        >
                            <FaAndroid /> {t("projects_page.download_apk_button")}
                        </a>
                    )}
                    {project.googlePlayLink && (
                        <a
                            href={project.googlePlayLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition"
                        >
                            <FaGooglePlay /> {t("projects_page.view_google_play_button")}
                        </a>
                    )}
                </div>
            </div>
        </motion.div >
    );
}

function PinnedProjectCard({ project, t }: { project: FullProject; t: TFunction }) {
    return (
        <motion.div
            className="relative mt-16 rounded-lg bg-white/50 dark:bg-slate-800/50 border-2 border-sky-500 dark:border-sky-400 p-8 shadow-2xl shadow-sky-500/10 backdrop-blur-sm"
            whileHover={{ y: -5, borderColor: "#38bdf8" }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className="absolute -top-3 -left-1 -rotate-90">
                <BsPinAngleFill size={35} className="text-sky-500 dark:text-sky-300 drop-shadow-lg" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-2/5">
                    <img src={project.image} alt={project.title} className="w-full rounded-lg object-cover shadow-lg" />
                </div>
                <div className="md:w-3/5 flex flex-col justify-center">
                    <span className="text-sm font-bold text-sky-600 dark:text-sky-400">{t("projects_page.featured_badge")}</span>
                    <div className="flex items-start gap-3 flex-wrap mt-2">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">{project.title}</h2>
                        {project.badges && project.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {project.badges.map((badge) => (
                                    <span
                                        key={badge}
                                        className={`${badgeConfig[badge].bg} ${badgeConfig[badge].text} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-flex items-center gap-1`}
                                    >
                                        <span className="relative flex h-2 w-2">
                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badgeConfig[badge].dot}`}></span>
                                            <span className={`relative inline-flex rounded-full h-2 w-2 ${badgeConfig[badge].dot}`}></span>
                                        </span>
                                        {t(`projects_page.badges.${badge}`)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 my-4">
                        {(project.tags || []).map((tag) => (
                            <span key={tag} className="bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">{project.description}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        {project.liveLink && (
                            <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-3 text-base font-medium text-slate-800 bg-slate-200 rounded-md hover:bg-slate-300 dark:text-white dark:bg-slate-700 dark:hover:bg-slate-600 transition"
                            >
                                <FaExternalLinkAlt /> {t("projects_page.view_live_button")}
                            </a>
                        )}
                        {project.githubLink && (
                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-3 text-base font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition"
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
