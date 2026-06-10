import { createFileRoute } from "@tanstack/react-router";
import type { IconType } from "react-icons";
import {
    FaBootstrap,
    FaBuilding,
    FaBullhorn,
    FaChartLine,
    FaClock,
    FaCreditCard,
    FaCss3Alt,
    FaDocker,
    FaDraftingCompass,
    FaFigma,
    FaGithub,
    FaHtml5,
    FaJs,
    FaMapMarkedAlt,
    FaPuzzlePiece,
    FaPython,
    FaReact,
    FaRobot,
    FaUsers,
    FaVuejs,
} from "react-icons/fa";
import {
    SiAdobephotoshop,
    SiCapacitor,
    SiDotnet,
    SiFirebase,
    SiJquery,
    SiNextdotjs,
    SiPostgresql,
    SiSharp,
    SiTailwindcss,
    SiTypescript,
} from "react-icons/si";
import { DiNetmagazine } from "react-icons/di";
import { TbBrandReactNative, TbSql } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Contours } from "../components/scenery/Contours";
import { SectionHeading } from "../components/SectionHeading";
import { GhostWord, Reveal } from "../components/motion/primitives";

interface Skill {
    name: string;
    description: string;
    icon?: IconType;
    level?: number;
}

interface SubCategory {
    title: string;
    skills: Skill[];
}

interface MainCategory {
    category: string;
    subCategories?: SubCategory[];
    skills?: Skill[] | Record<string, { name: string; description: string }>;
}

const skillDetails: { [key: string]: { icon: IconType; level: number } } = {
    HTML: { icon: FaHtml5, level: 5 },
    CSS: { icon: FaCss3Alt, level: 5 },
    JavaScript: { icon: FaJs, level: 4 },
    TypeScript: { icon: SiTypescript, level: 4 },
    React: { icon: FaReact, level: 4 },
    "Vue.js": { icon: FaVuejs, level: 4 },
    "Next.js": { icon: SiNextdotjs, level: 4 },
    jQuery: { icon: SiJquery, level: 2 },
    Bootstrap: { icon: FaBootstrap, level: 4 },
    "Tailwind CSS": { icon: SiTailwindcss, level: 3 },
    "C#": { icon: SiSharp, level: 4 },
    ".NET Core": { icon: SiDotnet, level: 4 },
    "ASP.NET Core": { icon: SiDotnet, level: 4 },
    "Entity Framework": { icon: DiNetmagazine, level: 3 },
    "SQL Server": { icon: TbSql, level: 4 },
    PostgreSQL: { icon: SiPostgresql, level: 4 },
    Python: { icon: FaPython, level: 3 },
    "React Native": { icon: TbBrandReactNative, level: 3 },
    firebase: { icon: SiFirebase, level: 4 },
    capacitor: { icon: SiCapacitor, level: 3 },
    docker: { icon: FaDocker, level: 3 },
    figma: { icon: FaFigma, level: 1 },
    github: { icon: FaGithub, level: 4 },
    revenuecat: { icon: FaCreditCard, level: 3 },
    admob: { icon: FaBullhorn, level: 3 },
    mcp: { icon: FaRobot, level: 3 },
    photoshop: { icon: SiAdobephotoshop, level: 4 },
    autocad: { icon: FaDraftingCompass, level: 2 },
    netcad: { icon: FaMapMarkedAlt, level: 3 },
    gis_systems: { icon: FaMapMarkedAlt, level: 3 },
    real_estate_appraisal: { icon: FaBuilding, level: 5 },
    reporting_analysis: { icon: FaChartLine, level: 5 },
    problem_solving: { icon: FaPuzzlePiece, level: 5 },
    teamwork: { icon: FaUsers, level: 5 },
    time_management: { icon: FaClock, level: 5 },
};

function LevelBar({ level = 3 }: { level?: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className={`h-1 w-4 rounded-full ${i < level ? "bg-accent" : "bg-line"}`}
                />
            ))}
        </div>
    );
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
    return (
        <Reveal delay={Math.min(index * 0.05, 0.3)} className="h-full">
            <div className="group flex h-full flex-col rounded-2xl border border-line/70 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg">
                <div className="flex items-start justify-between">
                    {skill.icon && (
                        <skill.icon className="h-8 w-8 text-ink-soft transition-colors duration-300 group-hover:text-accent" />
                    )}
                    <span className="font-mono text-[10px] text-muted">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                </div>
                <h4 className="mt-4 font-display text-lg font-bold text-ink">{skill.name}</h4>
                <p className="mt-2 flex-grow text-sm leading-relaxed text-ink-soft">
                    {skill.description}
                </p>
                <div className="mt-4">
                    <LevelBar level={skill.level} />
                </div>
            </div>
        </Reveal>
    );
}

function SkillGroup({
    title,
    skills,
    indexLabel,
}: {
    title: string;
    skills: Skill[];
    indexLabel: string;
}) {
    return (
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
                <Reveal>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                        {indexLabel}
                    </p>
                    <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
                        {title}
                    </h3>
                    <span className="mt-4 block h-px w-16 bg-accent" />
                </Reveal>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {skills.map((skill, i) => (
                    <SkillCard key={skill.name} skill={skill} index={i} />
                ))}
            </div>
        </div>
    );
}

export const Route = createFileRoute("/skills")({
    component: SkillsPage,
});

function SkillsPage() {
    const { t, i18n } = useTranslation();
    const categories = t("skills_page.skill_categories", { returnObjects: true }) as MainCategory[];

    const withDetails = (skill: { name: string; description: string }, key?: string): Skill => ({
        ...skill,
        ...(skillDetails[key ?? skill.name] || {}),
    });

    const technical = categories[0];
    const frontEnd = technical?.subCategories?.[0];
    const backEnd = technical?.subCategories?.[1];
    const tools = categories[1];
    const soft = categories[2];

    const toolSkills = tools?.skills
        ? Object.entries(tools.skills as Record<string, { name: string; description: string }>).map(
              ([key, value]) => withDetails(value, key),
          )
        : [];
    const softSkills = soft?.skills
        ? Object.entries(soft.skills as Record<string, { name: string; description: string }>).map(
              ([key, value]) => withDetails(value, key),
          )
        : [];

    return (
        <div className="relative overflow-hidden">
            <Helmet key={i18n.language} defer={false} prioritizeSeoTags>
                <title>{t("seo.skills_title")}</title>
                <meta name="description" content={t("seo.skills_description") ?? ""} />
            </Helmet>

            <Contours className="opacity-60" />
            <GhostWord word={t("skills_page.ghost")} className="top-32" from={120} to={-120} />

            <div className="relative mx-auto max-w-6xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
                <SectionHeading
                    label={t("skills_page.label")}
                    title={t("skills_page.main_title")}
                />
                <Reveal delay={0.1}>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                        {t("skills_page.subtitle")}
                    </p>
                </Reveal>

                <div className="mt-24 space-y-24">
                    {frontEnd && (
                        <SkillGroup
                            indexLabel="01"
                            title={frontEnd.title}
                            skills={frontEnd.skills.map((s) => withDetails(s))}
                        />
                    )}
                    {backEnd && (
                        <SkillGroup
                            indexLabel="02"
                            title={backEnd.title}
                            skills={backEnd.skills.map((s) => withDetails(s))}
                        />
                    )}
                    {tools && <SkillGroup indexLabel="03" title={tools.category} skills={toolSkills} />}
                    {soft && <SkillGroup indexLabel="04" title={soft.category} skills={softSkills} />}
                </div>
            </div>
        </div>
    );
}
