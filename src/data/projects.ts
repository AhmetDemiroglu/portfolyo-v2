export interface ProjectBase {
    id: string;
    image: string;
    liveLink: string | null;
    githubLink: string;
    apkLink?: string | null;
    googlePlayLink?: string | null;
    badges?: ("live" | "beta" | "apk" | "new" | "experimental")[];
    pinned: boolean;
    mockupType?: "phone" | "laptop";
    accentColor?: string;
}

export const projectsData: ProjectBase[] = [
    {
        id: "gghub",
        image: "gghub-placeholder.webp",
        liveLink: "https://gghub.social",
        githubLink: "https://github.com/AhmetDemiroglu/GGHub",
        badges: ["live", "beta", "new"],
        pinned: true,
    },
    {
        id: "fintel",
        image: "fintel-screen.png",
        liveLink: "https://expense-tracker-v2-f5a0b.web.app/",
        githubLink: "https://github.com/AhmetDemiroglu/expense-tracker-v2",
        googlePlayLink: "https://play.google.com/store/apps/details?id=com.fintel.app",
        badges: ["live", "new"],
        pinned: false,
        mockupType: "phone",
        accentColor: "rgba(99,102,241,0.2)",
    },
    {
        id: "purescan",
        image: "purescan-screen.png",
        liveLink: null,
        githubLink: "https://github.com/AhmetDemiroglu/PureScan",
        googlePlayLink: "https://play.google.com/store/apps/details?id=com.septimuslab.purescan",
        badges: ["live", "new"],
        pinned: false,
        mockupType: "phone",
        accentColor: "rgba(20,184,166,0.2)",
    },
    {
        id: "purescan_foods",
        image: "purescan-foods-screen.png",
        liveLink: null,
        githubLink: "https://github.com/AhmetDemiroglu/PureScanFoods",
        googlePlayLink: "https://play.google.com/store/apps/details?id=com.purescan.foods",
        badges: ["live", "new"],
        pinned: false,
        mockupType: "phone",
        accentColor: "rgba(249,115,22,0.2)",
    },
    {
        id: "openworld",
        image: "openworld.png",
        liveLink: null,
        githubLink: "https://github.com/AhmetDemiroglu/OpenWorld",
        badges: ["experimental"],
        pinned: false,
        mockupType: "laptop",
        accentColor: "rgba(139,92,246,0.15)",
    },
    {
        id: "rent_a_car",
        image: "Rent A Car Svg.svg",
        liveLink: null,
        githubLink: "https://github.com/AhmetDemiroglu/rota-rent-a-car",
        pinned: false,
    },
    {
        id: "not_defteri",
        image: "Not Defteri svg.svg",
        liveLink: "https://interactive-notebook-4b92a.web.app/folder/-OHERE6EyPnNkjYdwwwk",
        githubLink: "https://github.com/AhmetDemiroglu/interactive-notebook",
        badges: ["live"],
        pinned: false,
    },
    {
        id: "butce_360",
        image: "butce360 svg.svg",
        liveLink: "https://expense-tracker-1dc73.firebaseapp.com/",
        githubLink: "https://github.com/AhmetDemiroglu/expense-tracker",
        badges: ["live"],
        pinned: false,
    },
];
