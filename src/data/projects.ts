import fintelScreen from "../assets/fintel-screen.webp";
import multimind from "../assets/multimind.webp";
import openworld from "../assets/openworld.webp";
import sip from "../assets/sip.webp";

type Lang = "tr" | "en" | "de" | "es";

/* A screenshot that differs by language: Turkish pages show the Turkish app,
   every other language the English one (Spanish too where the app ships it). */
export type Localized = string | ({ tr: string; en: string } & Partial<Record<Lang, string>>);

export const pickShot = (value: Localized, lang: string): string =>
    typeof value === "string" ? value : (value[lang as Lang] ?? value.en);

const shots = import.meta.glob<string>("../assets/{pausemenu,purescan}-*-{tr,en,es}.webp", {
    eager: true,
    import: "default",
});

const shot = (name: string, langs: Lang[] = ["tr", "en"]): Localized => {
    const entries = langs.map((l) => {
        const url = shots[`../assets/${name}-${l}.webp`];
        if (!url) throw new Error(`Missing screenshot ${name}-${l}.webp`);
        return [l, url];
    });
    return Object.fromEntries(entries) as Localized;
};

const FOODS_LANGS: Lang[] = ["tr", "en", "es"];

export interface ProjectBase {
    id: string;
    /* Resolved (hashed) asset URL. Archive-only entries render no image, so this is optional. */
    image?: Localized;
    /* Optional web/desktop screenshot — when set, the featured card shows a laptop+phone duo. */
    webImage?: Localized;
    /* Two extra phone screens shown behind the main one on the home page stage. */
    gallery?: [Localized, Localized];
    liveLink: string | null;
    githubLink: string | null;
    apkLink?: string | null;
    googlePlayLink?: string | null;
    appStoreLink?: string | null;
    /* App Store sürümü henüz incelemede: buton görünür ama pasif kalır. */
    appStoreSoon?: boolean;
    /* Google Play sürümü henüz incelemede: buton görünür ama pasif kalır. */
    googlePlaySoon?: boolean;
    badges?: ("live" | "beta" | "apk" | "new" | "experimental")[];
    pinned: boolean;
    mockupType?: "phone" | "laptop";
    accentColor?: string;
}

/* A project with every screenshot resolved for one language. */
export type ResolvedProject = Omit<ProjectBase, "image" | "webImage" | "gallery"> & {
    image?: string;
    webImage?: string;
    gallery?: [string, string];
};

export const resolveProject = (p: ProjectBase, lang: string): ResolvedProject => ({
    ...p,
    image: p.image && pickShot(p.image, lang),
    webImage: p.webImage && pickShot(p.webImage, lang),
    gallery: p.gallery && [pickShot(p.gallery[0], lang), pickShot(p.gallery[1], lang)],
});

export const projectsData: ProjectBase[] = [
    {
        id: "pausemenu",
        image: shot("pausemenu-home"),
        webImage: shot("pausemenu-web"),
        gallery: [shot("pausemenu-aibots"), shot("pausemenu-game")],
        liveLink: "https://pausemenu.app",
        githubLink: "https://github.com/AhmetDemiroglu/pause-menu",
        appStoreLink: "https://apps.apple.com/app/id6781281375",
        googlePlayLink: "https://play.google.com/store/apps/details?id=com.gghub.mobile",
        badges: ["live", "new"],
        pinned: true,
        mockupType: "phone",
        accentColor: "rgba(139,92,246,0.2)",
    },
    {
        id: "fintel",
        image: fintelScreen,
        liveLink: "https://app.fintel.septimuslab.com/",
        githubLink: "https://github.com/AhmetDemiroglu/expense-tracker-v2",
        googlePlayLink: "https://play.google.com/store/apps/details?id=com.fintel.app",
        appStoreSoon: true,
        badges: ["live"],
        pinned: false,
        mockupType: "phone",
        accentColor: "rgba(99,102,241,0.2)",
    },
    {
        id: "purescan",
        image: shot("purescan-home"),
        gallery: [shot("purescan-ingredients"), shot("purescan-result")],
        liveLink: null,
        githubLink: "https://github.com/AhmetDemiroglu/PureScan",
        googlePlayLink: "https://play.google.com/store/apps/details?id=com.septimuslab.purescan",
        appStoreSoon: true,
        badges: ["live"],
        pinned: false,
        mockupType: "phone",
        accentColor: "rgba(20,184,166,0.2)",
    },
    {
        id: "purescan_foods",
        image: shot("purescan-foods-home", FOODS_LANGS),
        gallery: [shot("purescan-foods-library", FOODS_LANGS), shot("purescan-foods-analysis", FOODS_LANGS)],
        liveLink: null,
        githubLink: "https://github.com/AhmetDemiroglu/PureScanFoods",
        googlePlayLink: "https://play.google.com/store/apps/details?id=com.purescan.foods",
        appStoreLink: "https://apps.apple.com/app/id6778348937",
        badges: ["live"],
        pinned: false,
        mockupType: "phone",
        accentColor: "rgba(249,115,22,0.2)",
    },
    {
        id: "openworld",
        image: openworld,
        liveLink: null,
        githubLink: "https://github.com/AhmetDemiroglu/OpenWorld",
        badges: ["experimental"],
        pinned: false,
        mockupType: "laptop",
        accentColor: "rgba(139,92,246,0.15)",
    },
    {
        id: "multimind",
        image: multimind,
        liveLink: null,
        githubLink: "https://github.com/AhmetDemiroglu/MultiMind",
        badges: ["experimental"],
        pinned: false,
        mockupType: "laptop",
        accentColor: "rgba(168,85,247,0.15)",
    },
    {
        id: "sip",
        image: sip,
        liveLink: null,
        githubLink: null,
        badges: ["beta"],
        pinned: false,
        mockupType: "laptop",
        accentColor: "rgba(56,189,248,0.15)",
    },
    {
        id: "rent_a_car",
        liveLink: null,
        githubLink: "https://github.com/AhmetDemiroglu/rota-rent-a-car",
        pinned: false,
    },
    {
        id: "not_defteri",
        liveLink: "https://interactive-notebook-4b92a.web.app/folder/-OHERE6EyPnNkjYdwwwk",
        githubLink: "https://github.com/AhmetDemiroglu/interactive-notebook",
        badges: ["live"],
        pinned: false,
    },
    {
        id: "butce_360",
        liveLink: "https://expense-tracker-1dc73.firebaseapp.com/",
        githubLink: "https://github.com/AhmetDemiroglu/expense-tracker",
        badges: ["live"],
        pinned: false,
    },
];
