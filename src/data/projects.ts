export interface ProjectBase {
    id: string;
    image: string;
    liveLink: string | null;
    githubLink: string;
    apkLink?: string | null;
    badges?: ("live" | "beta" | "apk" | "new")[];
    pinned: boolean;
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
        image: "fintel-placeholder.svg",
        liveLink: "https://expense-tracker-v2-f5a0b.web.app/",
        githubLink: "https://github.com/AhmetDemiroglu/expense-tracker-v2",
        apkLink: "/fintel.apk",
        badges: ["live", "apk", "new"],
        pinned: false,
    },
    {
        id: "purescan",
        image: "purescan-placeholder.svg",
        liveLink: null,
        githubLink: "https://github.com/AhmetDemiroglu/PureScan",
        apkLink: "/purescan.apk",
        badges: ["apk", "new"],
        pinned: false,
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
