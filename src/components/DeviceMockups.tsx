interface PhoneMockupProps {
    src: string;
    alt: string;
    accentColor?: string;
}

export function PhoneMockup({ src, alt, accentColor = "rgba(226,84,14,0.18)" }: PhoneMockupProps) {
    return (
        <div className="relative flex h-full w-full justify-center">
            {/* Soft glow */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-40 -translate-x-1/2 -translate-y-1/2 rounded-[50%] opacity-50 blur-3xl sm:h-64 sm:w-48"
                style={{ background: `radial-gradient(ellipse at center, ${accentColor}, transparent 70%)` }}
            />

            {/* Phone: anchored top, overflowing bottom, faded by the overlay below */}
            <div className="absolute left-1/2 top-4 w-[160px] -translate-x-1/2 sm:top-5 sm:w-[180px]">
                <div className="overflow-hidden rounded-[1.4rem] border-[3px] border-ink/70 bg-black shadow-xl sm:rounded-[1.6rem] dark:border-line">
                    <div className="flex justify-center bg-black pb-1 pt-1.5">
                        <div className="h-[5px] w-12 rounded-full bg-zinc-800 sm:w-14" />
                    </div>
                    <div className="aspect-[9/19] w-full overflow-hidden">
                        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover object-top" />
                    </div>
                </div>
            </div>

            {/* Bottom fade into the card background */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-soft via-soft/80 to-transparent sm:h-24" />
        </div>
    );
}

interface LaptopMockupProps {
    src: string;
    alt: string;
    accentColor?: string;
}

export function LaptopMockup({ src, alt, accentColor = "rgba(226,84,14,0.14)" }: LaptopMockupProps) {
    return (
        <div className="relative flex h-full w-full flex-col items-center justify-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                    className="absolute h-40 w-56 rounded-[40%] opacity-40 blur-3xl sm:h-44 sm:w-64"
                    style={{ background: `radial-gradient(ellipse at center, ${accentColor}, transparent 70%)` }}
                />
            </div>

            <div className="relative w-full max-w-[280px] overflow-hidden rounded-t-lg border-[3px] border-b-0 border-ink/70 bg-zinc-900 shadow-xl sm:max-w-[320px] sm:border-[4px] dark:border-line">
                <div className="flex items-center gap-1 border-b border-zinc-700 bg-zinc-800 px-2 py-1 sm:py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500/70 sm:h-2 sm:w-2" />
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/70 sm:h-2 sm:w-2" />
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500/70 sm:h-2 sm:w-2" />
                    <div className="ml-1.5 h-3 max-w-[120px] flex-1 rounded-md bg-zinc-700/60 sm:ml-2 sm:h-4 sm:max-w-[160px]" />
                </div>
                <div className="aspect-[16/10] w-full overflow-hidden">
                    <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover object-top" />
                </div>
            </div>
            <div className="h-2 w-[108%] max-w-[305px] rounded-b-md bg-ink/70 sm:h-3 sm:max-w-[346px] dark:bg-line" />
            <div className="h-[3px] w-[40%] max-w-[120px] rounded-b-sm bg-ink/50 sm:h-1 sm:max-w-[140px] dark:bg-line/70" />
        </div>
    );
}

interface DeviceDuoProps {
    laptopSrc: string;
    phoneSrc: string;
    alt: string;
    accentColor?: string;
}

/**
 * A laptop + phone shown together in light 3D, gently turned toward each other:
 * the web build on the laptop, the mobile build on the phone. Used for products
 * that ship on both web and mobile (e.g. GGHub).
 */
export function DeviceDuo({ laptopSrc, phoneSrc, alt, accentColor = "rgba(139,92,246,0.18)" }: DeviceDuoProps) {
    return (
        <div className="relative mx-auto w-full max-w-[440px]" style={{ perspective: "1800px" }}>
            {/* Soft glow */}
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-[40%] opacity-50 blur-3xl"
                style={{ background: `radial-gradient(ellipse at center, ${accentColor}, transparent 70%)` }}
            />

            {/* Laptop (web build) — turned slightly toward the phone */}
            <div className="relative" style={{ transform: "rotateY(-13deg) rotateX(6deg)" }}>
                <div className="overflow-hidden rounded-t-xl border-[3px] border-b-0 border-ink/70 bg-zinc-900 shadow-2xl dark:border-line">
                    <div className="flex items-center gap-1.5 border-b border-zinc-700 bg-zinc-800 px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-red-500/70" />
                        <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
                        <span className="h-2 w-2 rounded-full bg-green-500/70" />
                        <div className="ml-2 h-4 flex-1 rounded-md bg-zinc-700/60" />
                    </div>
                    <div className="aspect-[16/10] w-full overflow-hidden bg-black">
                        <img src={laptopSrc} alt={alt} loading="lazy" className="h-full w-full object-cover object-top" />
                    </div>
                </div>
                <div className="mx-auto h-3 w-[110%] -translate-x-[4.5%] rounded-b-lg bg-ink/80 shadow-lg dark:bg-line" />
            </div>

            {/* Phone (mobile build) — overlaps front-right, turned toward the laptop */}
            <div className="absolute -bottom-5 right-1 w-[28%] sm:right-2" style={{ transform: "rotateY(16deg)" }}>
                <div className="overflow-hidden rounded-[1.5rem] border-[3px] border-ink/70 bg-black shadow-2xl dark:border-line">
                    <div className="flex justify-center bg-black pb-1 pt-1.5">
                        <div className="h-[4px] w-10 rounded-full bg-zinc-800" />
                    </div>
                    <div className="aspect-[9/19] w-full overflow-hidden bg-black">
                        <img src={phoneSrc} alt={alt} loading="lazy" className="h-full w-full object-cover object-top" />
                    </div>
                </div>
            </div>
        </div>
    );
}
