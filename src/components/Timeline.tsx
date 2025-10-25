import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TimelineSectionProps {
    year: string;
    icon: string;
    title: string;
    subtitle?: string;
    content: string;
    index: number;
}

export function TimelineSection({ year, icon, title, subtitle, content, index }: TimelineSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.4 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className="relative grid grid-cols-1 md:grid-cols-12 gap-8"
        >
            {/* Sol Taraf */}
            <div className="md:col-span-8 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed flex items-center">
                <p>{content}</p>
            </div>

            {/* Sağ Taraf */}
            <div className="md:col-span-4 relative flex items-center pl-4">
                {/* Nokta */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 + 0.2 }}
                    className="absolute -left-0.5 h-4 w-4 rounded-full bg-gradient-to-br from-sky-400 to-purple-600 shadow-lg shadow-sky-500/50 z-10"
                />

                {/* Bilgi */}
                <div className="pl-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30 px-2 py-0.5 rounded">{year}</span>
                        <span className="text-lg">{icon}</span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
                    </div>
                    {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 font-light pl-1">{subtitle}</p>}
                </div>
            </div>
        </motion.div>
    );
}
