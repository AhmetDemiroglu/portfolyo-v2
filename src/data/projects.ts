import fintelScreen from "../assets/fintel-screen.webp";
import gghubScreen from "../assets/gghub-screen.webp";
import gghubWeb from "../assets/gghub-web.webp";
import multimind from "../assets/multimind.webp";
import openworld from "../assets/openworld.webp";
import purescanFoodsScreen from "../assets/purescan-foods-screen.webp";
import purescanScreen from "../assets/purescan-screen.webp";
import sip from "../assets/sip.webp";

export interface ProjectBase {
    id: string;
    /* Resolved (hashed) asset URL. Archive-only entries render no image, so this is optional. */
    image?: string;
    /* Optional web/desktop screenshot — when set, the featured card shows a laptop+phone duo. */
    webImage?: string;
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

export const projectsData: ProjectBase[] = [
    {
        id: "gghub",
        image: gghubScreen,
        webImage: gghubWeb,
        liveLink: "https://gghub.social",
        githubLink: "https://github.com/AhmetDemiroglu/GGHub",
        appStoreLink: "https://apps.apple.com/us/app/gghub-games-community/id6781281375",
        googlePlayLink: "https://play.google.com/store/apps/details?id=com.gghub.mobile",
        badges: ["live", "new"],
        pinned: true,
        mockupType: "phone",
        accentColor: "rgba(139,92,246,0.2)",
    },
    {
        id: "fintel",
        image: fintelScreen,
        liveLink: "https://expense-tracker-v2-f5a0b.web.app/",
        githubLink: "https://github.com/AhmetDemiroglu/expense-tracker-v2",
        googlePlayLink: "https://play.google.com/store/apps/details?id=com.fintel.app",
        badges: ["live"],
        pinned: false,
        mockupType: "phone",
        accentColor: "rgba(99,102,241,0.2)",
    },
    {
        id: "purescan",
        image: purescanScreen,
        liveLink: null,
        githubLink: "https://github.com/AhmetDemiroglu/PureScan",
        googlePlayLink: "https://play.google.com/store/apps/details?id=com.septimuslab.purescan",
        badges: ["live"],
        pinned: false,
        mockupType: "phone",
        accentColor: "rgba(20,184,166,0.2)",
    },
    {
        id: "purescan_foods",
        image: purescanFoodsScreen,
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
