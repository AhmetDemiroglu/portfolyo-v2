import { createFileRoute } from "@tanstack/react-router";
import { FaApple, FaGithub, FaGooglePlay } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { projectsData, type ProjectBase } from "../data/projects";
import { PhoneMockup, LaptopMockup } from "../components/DeviceMockups";
import { SectionHeading } from "../components/SectionHeading";
import { GhostWord, ParallaxY, Reveal } from "../components/motion/primitives";

interface ProjectTranslation {
    title: string;
    description: string;
    tags: string[];
}

type FullProject = ProjectBase & ProjectTranslation;

const FEATURED_ID = "gghub";
const MAIN_ORDER = ["purescan_foods", "purescan", "fintel", "openworld", "multimind", "sip"];
const ARCHIVE_IDS = ["rent_a_car", "not_defteri", "butce_360"];

const badgeStyles: Record<string, string> = {
    live: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
    beta: "border-amber-500/40 text-amber-600 dark:text-amber-400",
    apk: "border-cyan-500/40 text-cyan-600 dark:text-cyan-400",
    new: "border-accent/50 text-accent",
    experimental: "border-violet-500/40 text-violet-600 dark:text-violet-400",
};

export const Route = createFileRoute("/projects")({
    component: ProjectsPage,
});

function Badges({ project }: { project: FullProject }) {
    const { t } = useTranslation();
    if (!project.badges?.length) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {project.badges.map((badge) => (
                <span
                    key={badge}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] ${badgeStyles[badge]}`}
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {t(`projects_page.badges.${badge}`)}
                </span>
            ))}
        </div>
    );
}

const linkBtn =
    "inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-mono text-[10px] tracking-[0.12em] text-ink transition-colors hover:border-accent hover:text-accent";

function ProjectLinks({ project }: { project: FullProject }) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-wrap items-center gap-2">
            {project.liveLink && (
                <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 font-mono text-[10px] tracking-[0.12em] text-paper transition-colors hover:bg-accent hover:text-white"
                >
                    {t("projects_page.view_live_button")}
                    <FiArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
            )}
            {project.googlePlayLink && (
                <a
                    href={project.googlePlayLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkBtn}
                >
                    <FaGooglePlay size={11} />
                    Google Play
                </a>
            )}
            {project.appStoreLink && (
                <a
                    href={project.appStoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkBtn}
                >
                    <FaApple size={12} />
                    App Store
                </a>
            )}
            {project.appStoreSoon && (
                <span
                    title={t("projects_page.app_store_review")}
                    aria-disabled="true"
                    className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-line px-4 py-2 font-mono text-[10px] tracking-[0.12em] text-muted opacity-60"
                >
                    <FaApple size={12} />
                    App Store
                </span>
            )}
            {project.githubLink && (
                <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkBtn}
                >
                    <FaGithub size={12} />
                    GitHub
                </a>
            )}
        </div>
    );
}

function Tags({ tags }: { tags: string[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="rounded-md bg-soft px-2.5 py-1 font-mono text-[11px] text-ink-soft"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}

function ExpandableText({ text }: { text: string }) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const isLong = text.length > 220;

    return (
        <div>
            <p
                className={`text-sm leading-relaxed text-ink-soft ${
                    !expanded && isLong ? "line-clamp-4" : ""
                }`}
            >
                {text}
            </p>
            {isLong && (
                <button
                    onClick={() => setExpanded((v) => !v)}
                    className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-accent hover:underline"
                >
                    {expanded ? t("projects_page.show_less") : t("projects_page.show_more")}
                </button>
            )}
        </div>
    );
}

function ImageArea({ project, tall = false }: { project: FullProject; tall?: boolean }) {
    const height = tall ? "h-[340px] sm:h-[420px]" : "h-[280px]";

    return (
        <div className={`relative overflow-hidden bg-soft ${height}`}>
            <div className="blueprint-grid absolute inset-0 opacity-60" />
            {project.mockupType === "phone" ? (
                <PhoneMockup src={`/${project.image}`} alt={project.title} accentColor={project.accentColor} />
            ) : project.mockupType === "laptop" ? (
                <div className="flex h-full items-center justify-center p-6">
                    <ParallaxY from={14} to={-14} className="w-full">
                        <LaptopMockup
                            src={`/${project.image}`}
                            alt={project.title}
                            accentColor={project.accentColor}
                        />
                    </ParallaxY>
                </div>
            ) : (
                <ParallaxY from={10} to={-10} className="h-full w-full">
                    <img
                        src={`/${project.image}`}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                    />
                </ParallaxY>
            )}
        </div>
    );
}

function FeaturedProject({ project }: { project: FullProject }) {
    const { t } = useTranslation();

    return (
        <Reveal>
            <div className="overflow-hidden rounded-3xl border border-line/70 bg-surface shadow-sm">
                <div className="grid lg:grid-cols-5">
                    <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-2">
                        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
                            {t("projects_page.featured_badge")}
                        </p>
                        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                            {project.title}
                        </h2>
                        <div className="mt-4">
                            <Badges project={project} />
                        </div>
                        <p className="mt-5 text-sm leading-relaxed text-ink/90 sm:text-base">
                            {project.description}
                        </p>
                        <div className="mt-6">
                            <Tags tags={project.tags} />
                        </div>
                        <div className="mt-8">
                            <ProjectLinks project={project} />
                        </div>
                    </div>
                    <div className="relative lg:col-span-3">
                        <div className="relative flex h-full min-h-[300px] items-center justify-center overflow-hidden bg-soft p-8 sm:min-h-[420px]">
                            <div className="blueprint-grid absolute inset-0 opacity-60" />
                            <ParallaxY from={24} to={-24} className="w-full max-w-xl">
                                <img
                                    src={`/${project.image}`}
                                    alt={project.title}
                                    className="rounded-xl border border-line/70 shadow-2xl"
                                />
                            </ParallaxY>
                        </div>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}

function ProjectCard({ project, index }: { project: FullProject; index: number }) {
    return (
        <Reveal delay={Math.min((index % 2) * 0.1, 0.2)} className="h-full">
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line/70 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl">
                <ImageArea project={project} />
                <div className="flex flex-grow flex-col gap-4 p-7">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-xl font-bold text-ink">{project.title}</h3>
                        <Badges project={project} />
                    </div>
                    <ExpandableText text={project.description} />
                    <Tags tags={project.tags} />
                    <div className="mt-auto pt-2">
                        <ProjectLinks project={project} />
                    </div>
                </div>
            </article>
        </Reveal>
    );
}

function ArchiveRow({ project }: { project: FullProject }) {
    return (
        <Reveal>
            <div className="group flex flex-col gap-4 border-b border-line/70 py-7 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                    <h3 className="font-display text-lg font-bold text-ink transition-colors group-hover:text-accent">
                        {project.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
                        {project.description}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                        {project.tags.slice(0, 4).join(" · ")}
                    </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                    {project.liveLink && (
                        <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Live"
                            className="rounded-full border border-line p-2.5 text-ink-soft transition-colors hover:border-accent hover:text-accent"
                        >
                            <FiArrowUpRight size={15} />
                        </a>
                    )}
                    {project.githubLink && (
                        <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GitHub"
                            className="rounded-full border border-line p-2.5 text-ink-soft transition-colors hover:border-accent hover:text-accent"
                        >
                            <FaGithub size={15} />
                        </a>
                    )}
                </div>
            </div>
        </Reveal>
    );
}

function ProjectsPage() {
    const { t, i18n } = useTranslation();

    const withTranslation = (project: ProjectBase): FullProject => ({
        ...project,
        title: t(`projects_page.projects.${project.id}.title`),
        description: t(`projects_page.projects.${project.id}.description`),
        tags: t(`projects_page.projects.${project.id}.tags`, { returnObjects: true }) as string[],
    });

    const featured = withTranslation(projectsData.find((p) => p.id === FEATURED_ID)!);
    const mainProjects = MAIN_ORDER.map((id) => projectsData.find((p) => p.id === id)!)
        .filter(Boolean)
        .map(withTranslation);
    const archive = ARCHIVE_IDS.map((id) => projectsData.find((p) => p.id === id)!).map(
        withTranslation,
    );

    return (
        <div className="relative overflow-hidden">
            <Helmet key={i18n.language} defer={false} prioritizeSeoTags>
                <title>{t("seo.projects_title")}</title>
                <meta name="description" content={t("seo.projects_description") ?? ""} />
            </Helmet>

            <GhostWord word={t("projects_page.ghost")} className="top-28" from={-100} to={140} />

            <div className="relative mx-auto max-w-6xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
                <SectionHeading
                    label={t("projects_page.label")}
                    title={t("projects_page.main_title")}
                />
                <Reveal delay={0.1}>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                        {t("projects_page.subtitle")}
                    </p>
                </Reveal>

                <div className="mt-16">
                    <FeaturedProject project={featured} />
                </div>

                <div className="mt-8 grid gap-8 md:grid-cols-2">
                    {mainProjects.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                </div>

                <div className="mt-28">
                    <Reveal>
                        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">
                            <span className="inline-block h-px w-8 bg-accent" />
                            {t("projects_page.archive_label")}
                        </p>
                        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                            {t("projects_page.archive_title")}
                        </h2>
                    </Reveal>
                    <div className="mt-8 border-t border-line/70">
                        {archive.map((project) => (
                            <ArchiveRow key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
