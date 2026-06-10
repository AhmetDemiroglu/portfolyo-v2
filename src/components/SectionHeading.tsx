import { Reveal } from "./motion/primitives";

export function SectionHeading({
    label,
    title,
    align = "left",
    className,
}: {
    label: string;
    title: string;
    align?: "left" | "center";
    className?: string;
}) {
    return (
        <Reveal className={`${align === "center" ? "text-center" : ""} ${className ?? ""}`}>
            <p
                className={`flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-accent ${
                    align === "center" ? "justify-center" : ""
                }`}
            >
                <span className="inline-block h-px w-8 bg-accent" />
                {label}
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {title}
            </h2>
        </Reveal>
    );
}
