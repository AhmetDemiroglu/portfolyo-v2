import {
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    type MotionValue,
} from "framer-motion";
import { useMemo, type RefObject } from "react";

export interface HeroProgress {
    /* 0..1 across the pinned travel, spring-smoothed. */
    progress: MotionValue<number>;
    /* 0..1 while the released stage scrolls out of view. */
    exit: MotionValue<number>;
    /* `?p=` override is active (dev only). */
    debug: boolean;
    /* prefers-reduced-motion: no pin, static scene. */
    reduce: boolean;
}

/* `?p=0.5` freezes the hero at that progress so a state can be screenshotted
   and compared with the scrolled one. Stripped from production builds. */
function readDebugProgress(): number | null {
    if (!import.meta.env.DEV || typeof window === "undefined") return null;
    const raw = new URLSearchParams(window.location.search).get("p");
    if (raw === null) return null;
    const value = Number(raw.replace(",", "."));
    return Number.isFinite(value) && value >= 0 && value <= 1 ? value : null;
}

/* `?spring=0` bypasses the spring so its cost can be measured. Dev only. */
function readDebugSpringOff(): boolean {
    if (!import.meta.env.DEV || typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("spring") === "0";
}

export function useHeroProgress(target: RefObject<HTMLElement | null>): HeroProgress {
    const reduce = useReducedMotion() ?? false;
    const debugValue = useMemo(readDebugProgress, []);
    const springOff = useMemo(readDebugSpringOff, []);

    const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
    const { scrollYProgress: exitRaw } = useScroll({ target, offset: ["end end", "end start"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 });
    const fixed = useMotionValue(debugValue ?? 0);
    const zero = useMotionValue(0);

    if (reduce) return { progress: zero, exit: zero, debug: false, reduce: true };
    if (debugValue !== null) return { progress: fixed, exit: zero, debug: true, reduce: false };
    if (springOff) return { progress: scrollYProgress, exit: exitRaw, debug: true, reduce: false };
    return { progress: smooth, exit: exitRaw, debug: false, reduce: false };
}
