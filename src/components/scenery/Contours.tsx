import { ParallaxY } from "../motion/primitives";

/* Topographic contour lines — a quiet echo of the map-making years.
   Dropped behind sections, drifting slowly against the scroll. */
export function Contours({ className }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
        >
            <ParallaxY from={70} to={-70} className="h-full w-full">
                <svg
                    viewBox="0 0 1200 800"
                    preserveAspectRatio="xMidYMid slice"
                    className="h-full w-full opacity-[0.45]"
                >
                    <g fill="none" stroke="rgb(var(--c-line))" strokeWidth="1.4">
                        <path d="M-80 120 C 180 40, 380 220, 640 150 S 1080 60, 1300 170" />
                        <path d="M-80 200 C 160 110, 400 290, 660 215 S 1060 130, 1300 245" />
                        <path d="M-80 290 C 150 190, 420 360, 680 285 S 1050 210, 1300 330" />
                        <path d="M-80 390 C 140 280, 430 450, 700 365 S 1040 300, 1300 425" />
                        <path d="M-80 500 C 130 380, 440 560, 710 465 S 1030 400, 1300 530" />
                        <path d="M-80 620 C 120 490, 450 680, 720 575 S 1020 510, 1300 645" />
                        <path d="M-80 740 C 110 600, 460 800, 730 690 S 1010 630, 1300 760" />
                    </g>
                    <g fill="rgb(var(--c-accent))" opacity="0.7">
                        <circle cx="240" cy="170" r="4" />
                        <circle cx="860" cy="300" r="4" />
                        <circle cx="500" cy="540" r="4" />
                        <circle cx="1080" cy="640" r="4" />
                    </g>
                </svg>
            </ParallaxY>
        </div>
    );
}
