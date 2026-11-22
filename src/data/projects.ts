import fintelScreen from "../assets/fintel-screen.webp";
import multimind from "../assets/multimind.webp";
import openworld from "../assets/openworld.webp";
import sip from "../assets/sip.webp";

type Lang = "tr" | "en" | "de" | "es";

/* A screenshot that differs by language: Turkish pages show the Turkish app,
   every other language the English one (Spanish too where the app ships it). */
export type Localized = string | ({ tr: string; en: string } & Partial<Record<Lang, string>>);

/* One screenshot in the app's light theme and, once captured, its dark theme.
   The page shows the one that matches the site theme; without a dark capture
   the light one is used in both themes. */
export interface Themed {
    light: Localized;
    dark?: Localized;
}

export interface ResolvedShot {
    light: string;
    dark?: string;
}

const pickLang = (value: Localized, lang: string): string =>
    typeof value === "string" ? value : (value[lang as Lang] ?? value.en);

export const resolveShot = (value: Themed, lang: string): ResolvedShot => ({
    light: pickLang(value.light, lang),
    dark: value.dark === undefined ? undefined : pickLang(value.dark, lang),
});

const shots = import.meta.glob<string>("../assets/{pausemenu,purescan,fintel}-*-{tr,en,es}.webp", {
    eager: true,
    import: "default",
});

/* Files are <name>-<lang>.webp (light) and <name>-dark-<lang>.webp (dark). The
   dark set is used only when every language of it exists. */
const shot = (name: string, langs: Lang[] = ["tr", "en"]): Themed => {
    const collect = (base: string): Localized | undefined => {
        const entries = langs.map((l) => [l, shots[`../assets/${base}-${l}.webp`]] as const);
        if (entries.some(([, url]) => !url)) return undefined;
        return Object.fromEntries(entries) as Localized;
    };
    const light = collect(name);
    if (!light) throw new Error(`Missing screenshot ${name}-<lang>.webp`);
    return { light, dark: collect(`${name}-dark`) };
};

/* A screenshot with a single language and theme. */
const plain = (url: string, dark?: string): Themed => ({ light: url, dark });

const FOODS_LANGS: Lang[] = ["tr", "en", "es"];

export interface ProjectBase {
    id: string;
    /* Resolved (hashed) asset URL. Archive-only entries render no image, so this is optional. */
    image?: Themed;
    /* Optional web/desktop screenshot — when set, the featured card shows a laptop+phone duo. */
    webImage?: Themed;
    /* Two extra phone screens shown behind the main one on the home page stage. */
    gallery?: [Themed, Themed];
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
    image?: ResolvedShot;
    webImage?: ResolvedShot;
    gallery?: [ResolvedShot, ResolvedShot];
};

export const resolveProject = (p: ProjectBase, lang: string): ResolvedProject => ({
    ...p,
    image: p.image && resolveShot(p.image, lang),
    webImage: p.webImage && resolveShot(p.webImage, lang),
    gallery: p.gallery && [resolveShot(p.gallery[0], lang), resolveShot(p.gallery[1], lang)],
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
        image: plain(fintelScreen),
        liveLink: "https://app.fintel.septimuslab.com/",
        githubLink: "https://github.com/AhmetDemiroglu/expense-tracker-v2",
        googlePlayLink: "https://play.google.com/store/apps/details?id=com.fintel.app",
        appStoreLink: "https://apps.apple.com/app/id6835149318",
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
        /* App Store'a girince: appStoreSoon satırını sil, appStoreLink: "https://apps.apple.com/app/id..." ekle. */
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
        image: plain(openworld),
        liveLink: null,
        githubLink: "https://github.com/AhmetDemiroglu/OpenWorld",
        badges: ["experimental"],
        pinned: false,
        mockupType: "laptop",
        accentColor: "rgba(139,92,246,0.15)",
    },
    {
        id: "multimind",
        image: plain(multimind),
        liveLink: null,
        githubLink: "https://github.com/AhmetDemiroglu/MultiMind",
        badges: ["experimental"],
        pinned: false,
        mockupType: "laptop",
        accentColor: "rgba(168,85,247,0.15)",
    },
    {
        id: "sip",
        image: plain(sip),
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
