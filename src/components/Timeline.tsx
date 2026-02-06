import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
    GraduationCap,
    Building2,
    Sparkles,
    Monitor,
    Gamepad2,
    Rocket,
    Map,
    FileText,
    BarChart3,
    Code2,
    Database,
    Globe,
    Layers,
    Smartphone,
    Users,
    Braces,
    Terminal,
    Palette,
    Bot,
    ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Icon map for timeline badge ───
const TIMELINE_ICONS: Record<string, LucideIcon> = {
    graduation: GraduationCap,
    building: Building2,
    sparkles: Sparkles,
    monitor: Monitor,
    gamepad: Gamepad2,
    rocket: Rocket,
};

// ─── Tech icons per scene ───
const SCENE_TECH_ICONS: Record<string, LucideIcon[]> = {
    graduation: [Map, FileText, BarChart3, Palette],
    building: [FileText, BarChart3, Building2, Globe],
    sparkles: [Code2, Braces, Database, Layers],
    monitor: [Code2, Globe, Database, Terminal],
    gamepad: [Globe, Smartphone, Users, Gamepad2],
    rocket: [Smartphone, Bot, Layers, Rocket],
};

// ─── Tech Icon Cluster ───
function TechIconCluster({ iconKey, isEven }: { iconKey: string; isEven: boolean }) {
    const icons = SCENE_TECH_ICONS[iconKey] || [Code2, Globe, Database, Layers];

    const positions = [
        { x: -28, y: -28, delay: 0 },
        { x: 28, y: -20, delay: 0.1 },
        { x: -20, y: 28, delay: 0.2 },
        { x: 32, y: 24, delay: 0.15 },
    ];

    const glowColor = isEven ? "rgba(56,189,248,0.08)" : "rgba(168,85,247,0.08)";
    const iconColor = isEven
        ? "text-sky-400/25 dark:text-sky-400/20"
        : "text-purple-400/25 dark:text-purple-400/20";

    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Background glow */}
            <div
                className="absolute w-32 h-32 rounded-full"
                style={{
                    background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                    boxShadow: `0 0 80px ${glowColor}`,
                }}
            />

            {/* Tech icons */}
            {icons.map((Icon, i) => {
                const pos = positions[i];
                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.5 }}
                        transition={{
                            duration: 0.6,
                            delay: pos.delay + 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="absolute"
                        style={{
                            left: `calc(50% + ${pos.x}px)`,
                            top: `calc(50% + ${pos.y}px)`,
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                                duration: 3 + i * 0.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.3,
                            }}
                            className={`p-2.5 rounded-xl border border-slate-200/10 dark:border-slate-700/30 bg-white/5 dark:bg-slate-800/30 backdrop-blur-sm ${iconColor}`}
                        >
                            <Icon className="w-5 h-5" strokeWidth={1.5} />
                        </motion.div>
                    </motion.div>
                );
            })}
        </div>
    );
}

// ─── Scene Progress Indicator ───
function SceneIndicator({ number, total }: { number: number; total: number }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1.5">
                {Array.from({ length: total }, (_, i) => (
                    <div
                        key={i}
                        className="h-[2px] rounded-full transition-all duration-500"
                        style={{
                            width: i === number ? 32 : 8,
                            backgroundColor: i === number ? "rgb(56,189,248)" : "rgba(148,163,184,0.25)",
                        }}
                    />
                ))}
            </div>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-400/50">
                {String(number + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
        </div>
    );
}

// ─── Cinematic Divider ───
export function CinematicDivider() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });

    return (
        <motion.div
            ref={ref}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="h-[1px] mx-auto my-4"
            style={{
                maxWidth: 200,
                background: "linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.3) 50%, transparent 100%)",
            }}
        />
    );
}

// ─── Main Timeline Section ───
export interface TimelineSectionProps {
    year: string;
    iconKey: string;
    title: string;
    subtitle?: string;
    content: string;
    index: number;
    total: number;
    link?: string;
}

export function TimelineSection({ year, iconKey, title, subtitle, content, index, total, link }: TimelineSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });
    const isEven = index % 2 === 0;

    const IconComponent = TIMELINE_ICONS[iconKey] || Monitor;

    return (
        <div ref={ref} className="relative py-8 md:py-16">
            {/* Background accent glow */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: isEven
                        ? "radial-gradient(ellipse 60% 40% at 20% 50%, rgba(56,189,248,0.03) 0%, transparent 70%)"
                        : "radial-gradient(ellipse 60% 40% at 80% 50%, rgba(168,85,247,0.03) 0%, transparent 70%)",
                }}
            />

            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-center">
                {/* Content Side */}
                <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`md:col-span-7 ${isEven ? "md:col-start-1" : "md:col-start-6"}`}
                >
                    <SceneIndicator number={index} total={total} />

                    {/* Year Badge + Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center gap-3 mb-5"
                    >
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-500/10 dark:bg-sky-400/10 border border-sky-500/20 dark:border-sky-400/15">
                            <IconComponent className="w-[18px] h-[18px] text-sky-600 dark:text-sky-400" strokeWidth={1.5} />
                        </div>
                        <span className="font-mono text-xs tracking-[0.25em] font-semibold px-3 py-1.5 rounded-full border border-sky-500/20 dark:border-sky-400/20 text-sky-600 dark:text-sky-400 bg-sky-500/5 dark:bg-sky-400/5">
                            {year}
                        </span>
                    </motion.div>

                    {/* Title (with optional link) */}
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-2xl md:text-3xl font-bold mb-2 leading-tight text-slate-800 dark:text-slate-200"
                    >
                        {link ? (
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-300"
                            >
                                {title}
                                <ExternalLink className="w-5 h-5 opacity-40" strokeWidth={1.5} />
                            </a>
                        ) : (
                            title
                        )}
                    </motion.h3>

                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-sm mb-4 font-medium text-sky-600/70 dark:text-sky-400/70"
                        >
                            {subtitle}
                        </motion.p>
                    )}

                    {/* Content with left accent bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.7, delay: 0.45 }}
                        className="relative"
                    >
                        <div
                            className="absolute -left-4 top-0 bottom-0 w-[2px] rounded-full"
                            style={{
                                background: "linear-gradient(180deg, rgba(56,189,248,0.5) 0%, rgba(34,211,238,0.3) 50%, transparent 100%)",
                            }}
                        />
                        <p className="text-base md:text-lg leading-[1.8] pl-4 text-slate-600 dark:text-slate-300/85">
                            {content}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Visual Side — Tech Icon Cluster */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className={`hidden md:flex md:col-span-5 items-center justify-center ${isEven ? "md:col-start-8" : "md:col-start-1 md:row-start-1"
                        }`}
                >
                    <TechIconCluster iconKey={iconKey} isEven={isEven} />
                </motion.div>
            </div>
        </div>
    );
}