import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* "9+" -> counts 0..9 once it scrolls into view, keeps the "+" suffix.
   Values without a leading number render as they are. */
export function CountUp({ value, className }: { value: string; className?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const reduce = useReducedMotion();
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const match = value.match(/^(\d+)(.*)$/);
    const target = match ? Number(match[1]) : null;
    const suffix = match ? match[2] : "";
    const [shown, setShown] = useState(reduce || target === null ? value : `0${suffix}`);

    useEffect(() => {
        if (!inView || reduce || target === null) return;
        const controls = animate(0, target, {
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (v) => setShown(`${Math.round(v)}${suffix}`),
        });
        return () => controls.stop();
    }, [inView, reduce, target, suffix]);

    return (
        <span ref={ref} className={className}>
            {reduce || target === null ? value : shown}
        </span>
    );
}
