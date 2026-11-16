import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, type CSSProperties } from "react";
import { useIsDesktop } from "../motion/useIsDesktop";
import { useTheme } from "../../contexts/ThemeContext";
import {
    BUILD_END,
    FAR,
    MID,
    MID_STATIC_WINDOWS,
    NEAR,
    RISE,
    buildingPath,
    outlinePath,
    type Building,
    type Layer,
} from "./city-data";

/* The hero skyline that builds itself while the hero is pinned
   (docs/MOTION_SPEC.md 12). Three depth layers; each building is its own <g>,
   drawn at finished height and translated down by `--dy` until `--p` reaches
   its slot. Its dim window grid is part of the building; lit groups light up
   once it has finished and the sky (`--day`) is below their threshold.
   The stage root carries `--p` and `--day`; everything below is CSS. */

const CAMERA = { near: 1.18, mid: 1.1, far: 1.04 };
const CAMERA_MOBILE = { near: 1.09, mid: 1.05, far: 1.02 };

/* Day cycle (12.3). Dark theme: night -> day -> night. Light theme: the inverse. */
const DAY_KEYS = [0, 0.3, 0.45, 0.6, 0.9, 1];
const DAY_DARK = [0, 0, 0.85, 0.85, 0, 0];
const DAY_LIGHT = [1, 1, 0.15, 0.15, 1, 1];

const riseStyle = (start: number, dy: number) => ({ "--s": start, "--dy": `${dy}px` }) as CSSProperties;

function BuildingGroup({ b, baseline, mid }: { b: Building; baseline: number; mid?: boolean }) {
    return (
        <g className="city-building" style={riseStyle(b.start, b.extra)}>
            <path d={buildingPath(b, baseline)} />
            <path d={b.grid} className="city-grid" />
            {b.lit.map((g, i) => (
                <path
                    key={i}
                    d={g.d}
                    className="city-lit"
                    style={{ "--s": b.start + RISE + g.delay, "--thr": g.thr } as CSSProperties}
                />
            ))}
            {mid && b.crane && <Crane extra={b.extra} />}
        </g>
    );
}

/* Construction crane, parked on the 932..1080 block of the mid layer. It rises
   with its building; the hook rope pays out and the jib swings while it works. */
function Crane({ extra }: { extra: number }) {
    const top = 96 + 320 - extra;
    return (
        <g className="city-crane">
            <rect x="1006" y={top} width="7" height="180" />
            <g className="city-crane-jib">
                <rect x="948" y={top} width="148" height="7" />
                <path d={`M1013 ${top + 7} L1042 ${top} L1013 ${top - 7} Z`} />
                <rect x="954" y={top + 7} width="4" height="14" />
                <g className="city-crane-rope">
                    <rect x="1080" y={top + 7} width="4" height="26" />
                    <rect x="1070" y={top + 33} width="24" height="12" />
                </g>
            </g>
        </g>
    );
}

function SkylineSvg({
    layer,
    tone,
    className,
    outlines,
    mid,
    children,
}: {
    layer: Layer;
    tone: "near" | "mid";
    className: string;
    outlines?: boolean;
    mid?: boolean;
    children?: React.ReactNode;
}) {
    return (
        <svg viewBox={`0 0 ${layer.width} ${layer.height}`} preserveAspectRatio="none" className={className}>
            <g className={`city-fill-${tone}`}>
                {layer.buildings.map((b, i) => (
                    <BuildingGroup key={i} b={b} baseline={layer.height} mid={mid} />
                ))}
                {children}
            </g>
            {/* Outlines sit outside the rising groups, at finished coordinates. */}
            {outlines && (
                <g className="city-plans">
                    {layer.buildings.map((b, i) => (
                        <path
                            key={i}
                            d={outlinePath(b, layer.height)}
                            className="city-plan"
                            pathLength={1}
                            vectorEffect="non-scaling-stroke"
                            style={{ "--s": b.start } as CSSProperties}
                        />
                    ))}
                </g>
            )}
        </svg>
    );
}

function Clouds({ y, opacity }: { y: MotionValue<string>; opacity: MotionValue<number> }) {
    return (
        <motion.div style={{ y, opacity }} className="absolute inset-0">
            <svg viewBox="0 0 200 60" className="absolute left-[8%] top-[16%] w-32 animate-cloud-drift-slow opacity-70 sm:w-44">
                <g fill="rgb(var(--sky-day-surface))">
                    <ellipse cx="60" cy="38" rx="48" ry="16" />
                    <ellipse cx="100" cy="28" rx="36" ry="18" />
                    <ellipse cx="140" cy="38" rx="44" ry="14" />
                </g>
            </svg>
            <svg viewBox="0 0 200 60" className="absolute right-[12%] top-[30%] w-24 animate-cloud-drift opacity-60 sm:w-36">
                <g fill="rgb(var(--sky-day-surface))">
                    <ellipse cx="70" cy="36" rx="50" ry="15" />
                    <ellipse cx="115" cy="27" rx="34" ry="16" />
                </g>
            </svg>
        </motion.div>
    );
}

const STARS: Array<[number, number, number, string]> = [
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

function Stars({ opacity }: { opacity: MotionValue<number> }) {
    return (
        <motion.div style={{ opacity }} className="absolute inset-0">
            {STARS.map(([x, y, size, delay], i) => (
                <span
                    key={i}
                    className="absolute animate-star-twinkle rounded-full bg-[rgb(var(--sky-night-ink))]"
                    style={{ left: `${x}%`, top: `${y}%`, width: size * 2, height: size * 2, animationDelay: delay }}
                />
            ))}
        </motion.div>
    );
}

interface Body {
    x: MotionValue<string>;
    y: MotionValue<string>;
    opacity: MotionValue<number>;
    scale: MotionValue<number>;
}

function Sun({ body }: { body: Body }) {
    return (
        <motion.div style={body} className="absolute right-[4%] top-[9%] sm:right-[18%] sm:top-[14%]">
            <div className="h-10 w-10 rounded-full bg-accent opacity-90 shadow-[0_0_44px_rgb(var(--c-accent)/0.55)] sm:h-24 sm:w-24 sm:shadow-[0_0_70px_rgb(var(--c-accent)/0.55)]" />
        </motion.div>
    );
}

function Moon({ body }: { body: Body }) {
    return (
        <motion.div style={body} className="absolute right-[4%] top-[9%] sm:right-[18%] sm:top-[14%]">
            <div className="relative h-10 w-10 rounded-full bg-[rgb(206_214_232)] opacity-90 shadow-[0_0_40px_rgba(160,180,230,0.35)] sm:h-24 sm:w-24 sm:shadow-[0_0_60px_rgba(160,180,230,0.35)]">
                <span className="absolute left-[22%] top-[30%] h-2 w-2 rounded-full bg-[rgb(170_180_204)] sm:h-3 sm:w-3" />
                <span className="absolute left-[55%] top-[55%] h-1.5 w-1.5 rounded-full bg-[rgb(170_180_204)] sm:h-2 sm:w-2" />
                <span className="absolute left-[60%] top-[22%] h-1 w-1 rounded-full bg-[rgb(170_180_204)] sm:h-1.5 sm:w-1.5" />
            </div>
        </motion.div>
    );
}

/* Sky bodies (12.3). "Home" is the scroll-0 spot; the resting body sits there,
   the other one travels an arc from the left horizon to the right horizon.
   Keys: [home .. sets], [rises .. peak .. sets], [returns .. home]. */
function useBodies(progress: MotionValue<number>, dark: boolean) {
    // The body that is home at scroll 0 (moon in dark theme, sun in light).
    const homeX = useTransform(progress, [0, 0.25, 0.42, 0.7, 0.92, 1], ["0%", "0%", "8%", "30%", "0%", "0%"]);
    const homeY = useTransform(progress, [0, 0.25, 0.42, 0.7, 0.92, 1], ["0%", "0%", "45%", "60%", "0%", "0%"]);
    const homeOpacity = useTransform(progress, [0, 0.25, 0.4, 0.7, 0.86, 1], [1, 1, 0, 0, 1, 1]);
    const homeScale = useTransform(progress, [0, 0.9, 1], [1, 1, 0.9]);
    // The visiting body: rises from the left, peaks at 0.53, sets on the right.
    const visitX = useTransform(progress, [0.36, 0.53, 0.74], ["-140%", "-40%", "40%"]);
    const visitY = useTransform(progress, [0.36, 0.53, 0.74], ["70%", "-10%", "70%"]);
    const visitOpacity = useTransform(progress, [0.36, 0.44, 0.64, 0.74], [0, 1, 1, 0]);
    const visitScale = useTransform(progress, [0, 1], [1, 1]);
    const home: Body = { x: homeX, y: homeY, opacity: homeOpacity, scale: homeScale };
    const visit: Body = { x: visitX, y: visitY, opacity: visitOpacity, scale: visitScale };
    return dark ? { moon: home, sun: visit } : { moon: visit, sun: home };
}

export function CityScene({
    progress,
    exit,
    reduce,
}: {
    progress: MotionValue<number>;
    exit: MotionValue<number>;
    reduce: boolean;
}) {
    const stageRef = useRef<HTMLDivElement>(null);
    const desktop = useIsDesktop();
    const cam = desktop ? CAMERA : CAMERA_MOBILE;
    const dark = useTheme().theme === "dark";

    const day = useTransform(progress, DAY_KEYS, dark ? DAY_DARK : DAY_LIGHT);

    /* Two style writes per frame feed every building, grid, lit group, outline
       and the sky layers through CSS clamp() (index.css "City build"). */
    useMotionValueEvent(progress, "change", (v) => {
        stageRef.current?.style.setProperty("--p", v.toFixed(4));
    });
    useMotionValueEvent(day, "change", (v) => {
        stageRef.current?.style.setProperty("--day", v.toFixed(4));
    });
    useEffect(() => {
        stageRef.current?.style.setProperty("--p", progress.get().toFixed(4));
        stageRef.current?.style.setProperty("--day", day.get().toFixed(4));
    }, [progress, day]);

    const bodies = useBodies(progress, dark);
    const starOpacity = useTransform(day, [0, 0.85], [1, 0]);
    const cloudOpacity = useTransform(day, [0.15, 1], [0, 1]);
    const cloudY = useTransform(progress, [0, 1], ["0%", "-10%"]);
    const nightOpacity = useTransform(day, [0, 1], [1, 0]);
    const dayOpacity = useTransform(day, [0, 1], [0, 1]);

    // Camera (pin) + exit parallax (after release). Scale stays at its final value on exit.
    const exitSky = useTransform(exit, [0, 1], ["0%", "70%"]);
    const exitFar = useTransform(exit, [0, 1], ["0%", "13%"]);
    const exitMid = useTransform(exit, [0, 1], ["0%", "24%"]);
    const exitNear = useTransform(exit, [0, 1], ["0%", "38%"]);
    const scaleFar = useTransform(progress, [0.35, 1], [1, cam.far]);
    const scaleMid = useTransform(progress, [0.35, 1], [1, cam.mid]);
    const scaleNear = useTransform(progress, [0.35, 1], [1, cam.near]);

    const layer = "absolute inset-x-0 bottom-0 origin-bottom will-change-transform";

    return (
        <div
            ref={stageRef}
            aria-hidden="true"
            data-build-end={BUILD_END.toFixed(3)}
            className={`city-stage pointer-events-none absolute inset-0 overflow-hidden ${reduce ? "city-static" : ""}`}
        >
            {/* sky: day wash underneath, night wash fading on top */}
            <div className="city-sky-day absolute inset-0" />
            <motion.div style={{ opacity: nightOpacity }} className="city-sky-night absolute inset-0" />
            <div className="blueprint-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_38%,black,transparent)]" />

            <Stars opacity={starOpacity} />
            <Clouds y={cloudY} opacity={cloudOpacity} />
            <motion.div style={{ y: exitSky }} className="absolute inset-0">
                <Sun body={bodies.sun} />
                <Moon body={bodies.moon} />
            </motion.div>

            {/* far */}
            <motion.div style={{ y: exitFar, scale: scaleFar }} className={layer}>
                <svg
                    viewBox={`0 0 ${FAR.width} ${FAR.height}`}
                    preserveAspectRatio="none"
                    className="block h-[420px] w-full md:h-[400px] lg:h-[480px]"
                >
                    <g className="city-far city-fill-far" style={{ "--s": FAR.start, "--d": FAR.dur, "--dy": `${FAR.extra}px` } as CSSProperties}>
                        <path d={FAR.d} />
                    </g>
                </svg>
            </motion.div>

            {/* mid + crane + the eight windows that were always lit */}
            <motion.div style={{ y: exitMid, scale: scaleMid }} className={layer}>
                <SkylineSvg layer={MID} tone="mid" mid className="block h-[500px] w-full md:h-[480px] lg:h-[600px]">
                    <path d={MID_STATIC_WINDOWS} className="city-window-static" />
                </SkylineSvg>
            </motion.div>

            {/* near, with outlines */}
            <motion.div style={{ y: exitNear, scale: scaleNear }} className={layer}>
                <SkylineSvg layer={NEAR} tone="near" outlines className="block h-[310px] w-full md:h-[300px] lg:h-[380px]" />
            </motion.div>

            {/* ground fade into the page: day and night versions cross-fade.
                Both fade to transparent, so each gets its own opacity; a
                permanent day layer would bleed a grey band through the night one. */}
            <motion.div style={{ opacity: dayOpacity }} className="city-ground-day absolute inset-x-0 bottom-0 h-24" />
            <motion.div style={{ opacity: nightOpacity }} className="city-ground-night absolute inset-x-0 bottom-0 h-24" />
        </div>
    );
}
