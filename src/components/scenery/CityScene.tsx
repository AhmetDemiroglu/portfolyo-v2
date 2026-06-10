import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
    type MotionValue,
} from "framer-motion";
import type { RefObject } from "react";

/* Three skyline silhouettes at different depths + sky objects. Every layer is
   bound to the hero's scroll progress, so the parallax runs both ways. */

function FarSkyline() {
    return (
        <svg
            viewBox="0 0 1440 280"
            preserveAspectRatio="none"
            className="block h-[150px] w-full sm:h-[200px] lg:h-[240px]"
        >
            <path
                fill="rgb(var(--c-sky-far))"
                d="M0 280 L0 190 L48 190 L48 152 L96 152 L96 178 L150 178 L150 132 L208 132 L208 170 L262 170 L262 148 L320 148 L320 188 L378 188 L378 120 L430 120 L430 164 L494 164 L494 142 L552 142 L552 184 L614 184 L614 108 L640 108 L640 96 L652 96 L652 108 L678 108 L678 168 L742 168 L742 140 L806 140 L806 178 L868 178 L868 124 L926 124 L926 160 L992 160 L992 142 L1052 142 L1052 186 L1116 186 L1116 112 L1174 112 L1174 158 L1238 158 L1238 134 L1300 134 L1300 176 L1364 176 L1364 150 L1404 150 L1404 188 L1440 188 L1440 280 Z"
            />
        </svg>
    );
}

function MidSkyline() {
    return (
        <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="block h-[180px] w-full sm:h-[240px] lg:h-[300px]"
        >
            <g fill="rgb(var(--c-sky-mid))">
                <path d="M0 320 L0 170 L70 170 L70 120 L130 120 L130 200 L196 200 L196 92 L210 92 L210 78 L246 78 L246 92 L260 92 L260 176 L330 176 L330 140 L396 140 L396 214 L470 214 L470 100 L540 100 L540 188 L600 188 L600 150 L668 150 L668 220 L740 220 L740 124 L808 124 L808 196 L880 196 L880 84 L900 84 L900 64 L912 64 L912 84 L932 84 L932 168 L1080 168 L1080 210 L1158 210 L1158 116 L1226 116 L1226 184 L1296 184 L1296 142 L1366 142 L1366 206 L1440 206 L1440 320 Z" />
                {/* Construction crane, a small nod to the planning years */}
                <g>
                    <rect x="1006" y="96" width="7" height="180" />
                    <rect x="948" y="96" width="148" height="7" />
                    <rect x="1080" y="103" width="4" height="26" />
                    <rect x="1070" y="129" width="24" height="12" />
                    <path d="M1013 103 L1042 96 L1013 89 Z" />
                    <rect x="954" y="103" width="4" height="14" />
                </g>
            </g>
            {/* sparse lit windows */}
            <g fill="rgb(var(--c-base))" opacity="0.5">
                <rect x="212" y="100" width="6" height="8" />
                <rect x="228" y="118" width="6" height="8" />
                <rect x="482" y="120" width="6" height="8" />
                <rect x="506" y="142" width="6" height="8" />
                <rect x="754" y="142" width="6" height="8" />
                <rect x="778" y="164" width="6" height="8" />
                <rect x="1172" y="134" width="6" height="8" />
                <rect x="1196" y="156" width="6" height="8" />
            </g>
        </svg>
    );
}

function NearSkyline() {
    return (
        <svg
            viewBox="0 0 1440 260"
            preserveAspectRatio="none"
            className="block h-[110px] w-full sm:h-[150px] lg:h-[190px]"
        >
            <path
                fill="rgb(var(--c-sky-near))"
                d="M0 260 L0 120 L88 120 L88 66 L150 66 L150 130 L240 130 L240 90 L330 90 L330 150 L420 150 L420 56 L500 56 L500 124 L590 124 L590 96 L680 96 L680 158 L770 158 L770 70 L856 70 L856 134 L948 134 L948 104 L1040 104 L1040 162 L1130 162 L1130 60 L1216 60 L1216 128 L1306 128 L1306 92 L1440 92 L1440 260 Z"
            />
        </svg>
    );
}

function Clouds() {
    return (
        <>
            <svg
                viewBox="0 0 200 60"
                className="absolute left-[8%] top-[16%] w-32 animate-cloud-drift-slow opacity-70 transition-opacity duration-500 dark:opacity-0 sm:w-44"
            >
                <g fill="rgb(var(--c-surface))">
                    <ellipse cx="60" cy="38" rx="48" ry="16" />
                    <ellipse cx="100" cy="28" rx="36" ry="18" />
                    <ellipse cx="140" cy="38" rx="44" ry="14" />
                </g>
            </svg>
            <svg
                viewBox="0 0 200 60"
                className="absolute right-[12%] top-[30%] w-24 animate-cloud-drift opacity-60 transition-opacity duration-500 dark:opacity-0 sm:w-36"
            >
                <g fill="rgb(var(--c-surface))">
                    <ellipse cx="70" cy="36" rx="50" ry="15" />
                    <ellipse cx="115" cy="27" rx="34" ry="16" />
                </g>
            </svg>
        </>
    );
}

function Stars() {
    const stars: Array<[number, number, number, string]> = [
        [12, 18, 1.6, "0s"],
        [22, 34, 1.1, "0.8s"],
        [31, 12, 1.4, "1.6s"],
        [44, 26, 1.0, "0.4s"],
        [55, 10, 1.7, "2.1s"],
        [63, 30, 1.1, "1.2s"],
        [72, 16, 1.5, "0.6s"],
        [81, 28, 1.0, "1.9s"],
        [90, 14, 1.6, "0.2s"],
        [86, 44, 1.0, "2.6s"],
        [17, 48, 1.2, "1.4s"],
        [49, 42, 1.2, "2.4s"],
    ];

    return (
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 dark:opacity-100">
            {stars.map(([x, y, size, delay], i) => (
                <span
                    key={i}
                    className="absolute animate-star-twinkle rounded-full bg-ink"
                    style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: size * 2,
                        height: size * 2,
                        animationDelay: delay,
                    }}
                />
            ))}
        </div>
    );
}

function SunMoon({ y }: { y: MotionValue<string> | string }) {
    return (
        <motion.div
            style={{ y }}
            className="absolute right-[6%] top-[9%] sm:right-[18%] sm:top-[14%]"
        >
            {/* sun (light) */}
            <div className="relative h-16 w-16 rounded-full bg-accent opacity-90 shadow-[0_0_70px_rgb(var(--c-accent)/0.55)] transition-opacity duration-500 dark:opacity-0 sm:h-24 sm:w-24" />
            {/* moon (dark) */}
            <div className="absolute inset-0 h-16 w-16 rounded-full bg-[rgb(206_214_232)] opacity-0 shadow-[0_0_60px_rgba(160,180,230,0.35)] transition-opacity duration-500 dark:opacity-90 sm:h-24 sm:w-24">
                <span className="absolute left-[22%] top-[30%] h-3 w-3 rounded-full bg-[rgb(170_180_204)]" />
                <span className="absolute left-[55%] top-[55%] h-2 w-2 rounded-full bg-[rgb(170_180_204)]" />
                <span className="absolute left-[60%] top-[22%] h-1.5 w-1.5 rounded-full bg-[rgb(170_180_204)]" />
            </div>
        </motion.div>
    );
}

export function CityScene({ heroRef }: { heroRef: RefObject<HTMLElement | null> }) {
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const yFar = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
    const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "48%"]);
    const yNear = useTransform(scrollYProgress, [0, 1], ["0%", "76%"]);
    const ySky = useTransform(scrollYProgress, [0, 1], ["0%", "140%"]);

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* sky wash */}
            <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--c-sky-top))] via-paper to-paper" />
            <div className="blueprint-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_38%,black,transparent)]" />

            <Stars />
            <Clouds />
            <SunMoon y={reduce ? "0%" : ySky} />

            <motion.div style={{ y: reduce ? "0%" : yFar }} className="absolute inset-x-0 bottom-0">
                <FarSkyline />
            </motion.div>
            <motion.div style={{ y: reduce ? "0%" : yMid }} className="absolute inset-x-0 bottom-0">
                <MidSkyline />
            </motion.div>
            <motion.div style={{ y: reduce ? "0%" : yNear }} className="absolute inset-x-0 bottom-0">
                <NearSkyline />
            </motion.div>

            {/* ground fade into the page */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
        </div>
    );
}
