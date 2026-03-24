interface PhoneMockupProps {
    src: string;
    alt: string;
    accentColor?: string;
}

export function PhoneMockup({ src, alt, accentColor = "rgba(14,165,233,0.15)" }: PhoneMockupProps) {
    return (
        <div className="relative w-full h-full flex justify-center">
            {/* Soft glow */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-56 sm:w-48 sm:h-64 rounded-[50%] blur-3xl opacity-40 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at center, ${accentColor}, transparent 70%)` }}
            />

            {/* Phone - positioned from top, overflows bottom, faded at bottom via parent */}
            <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 w-[160px] sm:w-[180px]">
                {/* Phone shell */}
                <div className="rounded-[1.4rem] sm:rounded-[1.6rem] border-[3px] border-slate-700 dark:border-slate-500 bg-black shadow-xl overflow-hidden">
                    {/* Notch */}
                    <div className="flex justify-center pt-1.5 pb-1 bg-black">
                        <div className="w-12 sm:w-14 h-[5px] bg-slate-800 rounded-full" />
                    </div>
                    {/* Screen */}
                    <div className="w-full aspect-[9/19] overflow-hidden">
                        <img
                            src={src}
                            alt={alt}
                            loading="lazy"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom fade overlay - matches ProjectImageArea bg */}
            <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 pointer-events-none z-10 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent" />
        </div>
    );
}

interface LaptopMockupProps {
    src: string;
    alt: string;
    accentColor?: string;
}

export function LaptopMockup({ src, alt, accentColor = "rgba(14,165,233,0.12)" }: LaptopMockupProps) {
    return (
        <div className="relative flex flex-col items-center w-full h-full justify-center">
            {/* Soft glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className="absolute w-56 h-40 sm:w-64 sm:h-44 rounded-[40%] blur-3xl opacity-35"
                    style={{ background: `radial-gradient(ellipse at center, ${accentColor}, transparent 70%)` }}
                />
            </div>

            {/* Screen */}
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] rounded-t-lg border-[3px] sm:border-[4px] border-b-0 border-slate-700 dark:border-slate-500 bg-slate-900 shadow-xl overflow-hidden">
                {/* Browser bar */}
                <div className="flex items-center gap-1 px-2 py-1 sm:py-1.5 bg-slate-800 border-b border-slate-700">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500/70" />
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500/70" />
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500/70" />
                    <div className="ml-1.5 sm:ml-2 flex-1 h-3 sm:h-4 rounded-md bg-slate-700/60 max-w-[120px] sm:max-w-[160px]" />
                </div>
                {/* Screen content */}
                <div className="w-full aspect-[16/10] overflow-hidden">
                    <img
                        src={src}
                        alt={alt}
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                    />
                </div>
            </div>
            {/* Keyboard base */}
            <div className="w-[108%] max-w-[305px] sm:max-w-[346px] h-2 sm:h-3 bg-slate-700 dark:bg-slate-500 rounded-b-md" />
            <div className="w-[40%] max-w-[120px] sm:max-w-[140px] h-[3px] sm:h-1 bg-slate-600 dark:bg-slate-400 rounded-b-sm" />
        </div>
    );
}
