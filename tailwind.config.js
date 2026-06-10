/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                paper: "rgb(var(--c-base) / <alpha-value>)",
                soft: "rgb(var(--c-soft) / <alpha-value>)",
                surface: "rgb(var(--c-surface) / <alpha-value>)",
                ink: "rgb(var(--c-ink) / <alpha-value>)",
                "ink-soft": "rgb(var(--c-ink-soft) / <alpha-value>)",
                muted: "rgb(var(--c-muted) / <alpha-value>)",
                line: "rgb(var(--c-line) / <alpha-value>)",
                accent: "rgb(var(--c-accent) / <alpha-value>)",
                accent2: "rgb(var(--c-accent2) / <alpha-value>)",
            },
            fontFamily: {
                display: ['"Space Grotesk"', "system-ui", "sans-serif"],
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
            },
            keyframes: {
                "cloud-drift": {
                    "0%": { transform: "translateX(-6%)" },
                    "50%": { transform: "translateX(6%)" },
                    "100%": { transform: "translateX(-6%)" },
                },
                "star-twinkle": {
                    "0%, 100%": { opacity: "0.25" },
                    "50%": { opacity: "0.9" },
                },
                "scroll-dot": {
                    "0%": { transform: "translateY(0)", opacity: "1" },
                    "70%": { transform: "translateY(14px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "0" },
                },
            },
            animation: {
                "cloud-drift": "cloud-drift 26s ease-in-out infinite",
                "cloud-drift-slow": "cloud-drift 40s ease-in-out infinite",
                "star-twinkle": "star-twinkle 3.2s ease-in-out infinite",
                "scroll-dot": "scroll-dot 1.8s ease-in-out infinite",
            },
        },
    },
    plugins: [],
}
