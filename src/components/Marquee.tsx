import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

const wrap = (min: number, max: number, v: number) => {
    const range = max - min;
    return ((((v - min) % range) + range) % range) + min;
};

/* Infinite text band that follows scroll velocity: scrolling down pushes it
   forward, scrolling up reverses it, creating a bidirectional recap-style effect. */
export function VelocityMarquee({
    children,
    baseVelocity = 2.4,
    className,
}: {
    children: ReactNode;
    baseVelocity?: number;
    className?: string;
}) {
    const reduce = useReducedMotion();
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 380,
    });
    const velocityFactor = useTransform(smoothVelocity, [-900, 0, 900], [-4, 0, 4], {
        clamp: true,
    });
    const directionFactor = useRef(1);
    const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

    useAnimationFrame((_, delta) => {
        if (reduce) return;
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
        const vf = velocityFactor.get();
        if (vf < 0) {
            directionFactor.current = -1;
        } else if (vf > 0) {
            directionFactor.current = 1;
        }
        moveBy += moveBy * Math.abs(vf);
        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className={`overflow-hidden whitespace-nowrap ${className ?? ""}`}>
            <motion.div className="inline-flex w-max" style={{ x }}>
                {[0, 1, 2, 3].map((i) => (
                    <span key={i} aria-hidden={i > 0} className="inline-flex shrink-0 items-center">
                        {children}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

/* Convenience: a themed tech ribbon used between sections. */
export function TechRibbon({ items, flip = false }: { items: string[]; flip?: boolean }) {
    return (
        <div className="border-y border-line/70 bg-soft/60 py-4">
            <VelocityMarquee baseVelocity={flip ? -2.2 : 2.2}>
                {items.map((item) => (
                    <span
                        key={item}
                        className="mx-5 inline-flex items-center gap-5 font-mono text-sm uppercase tracking-[0.2em] text-ink-soft"
                    >
                        {item}
                        <span className="text-accent">✦</span>
                    </span>
                ))}
            </VelocityMarquee>
        </div>
    );
}
