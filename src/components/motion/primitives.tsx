import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

/* Scroll-linked (therefore fully bidirectional) parallax wrapper.
   The element drifts from `from`px to `to`px while it crosses the viewport. */
export function ParallaxY({
    children,
    from = 48,
    to = -48,
    className,
}: {
    children: ReactNode;
    from?: number;
    to?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [from, to]);

    return (
        <motion.div ref={ref} style={{ y: reduce ? 0 : y }} className={className}>
            {children}
        </motion.div>
    );
}

/* Horizontal scroll-linked drift — used for oversized ghost words. */
export function ParallaxX({
    children,
    from = 60,
    to = -60,
    className,
}: {
    children: ReactNode;
    from?: number;
    to?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const x = useTransform(scrollYProgress, [0, 1], [from, to]);

    return (
        <motion.div ref={ref} style={{ x: reduce ? 0 : x }} className={className}>
            {children}
        </motion.div>
    );
}

/* One-time entrance reveal for content blocks. */
export function Reveal({
    children,
    delay = 0,
    y = 28,
    className,
}: {
    children: ReactNode;
    delay?: number;
    y?: number;
    className?: string;
}) {
    const reduce = useReducedMotion();

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* Oversized outlined word drifting sideways behind a section. */
export function GhostWord({
    word,
    className,
    from = 80,
    to = -80,
}: {
    word: string;
    className?: string;
    from?: number;
    to?: number;
}) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 overflow-hidden ${className ?? ""}`}
        >
            <ParallaxX from={from} to={to}>
                <span className="text-stroke block whitespace-nowrap text-center font-display text-[18vw] font-bold uppercase leading-none tracking-tight">
                    {word}
                </span>
            </ParallaxX>
        </div>
    );
}
