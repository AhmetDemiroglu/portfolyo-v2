/* Single source of truth for URLs, languages and head tags.

   Used twice with the same inputs: by the build (scripts/seo-prerender.ts writes
   these tags into the raw HTML of every page) and by the app (components/Seo.tsx
   renders the same tags through Helmet). Google may pick either the served or the
   rendered canonical, so the two must never disagree. Keep this file free of DOM
   and React imports so the Vite config can load it. */

export const SITE_URL = "https://ahmetdemiroglu.dev";

export const LANGS = ["tr", "en", "de", "es"] as const;
export type Lang = (typeof LANGS)[number];

/* Turkish lives at the root and doubles as x-default; the rest get a prefix. */
export const DEFAULT_LANG: Lang = "tr";

export const ROUTES = ["home", "about", "skills", "projects", "contact"] as const;
export type RouteKey = (typeof ROUTES)[number];

export const ROUTE_PATHS: Record<RouteKey, string> = {
    home: "/",
    about: "/about",
    skills: "/skills",
    projects: "/projects",
    contact: "/contact",
};

export const OG_LOCALES: Record<Lang, string> = {
    tr: "tr_TR",
    en: "en_US",
    de: "de_DE",
    es: "es_ES",
};

export const isLang = (value: unknown): value is Lang =>
    typeof value === "string" && (LANGS as readonly string[]).includes(value);

/* "/en/about" -> "en", "/about" -> "tr". Only a whole first segment counts. */
export function langFromPath(pathname: string): Lang {
    const first = pathname.split("/")[1];
    return isLang(first) && first !== DEFAULT_LANG ? first : DEFAULT_LANG;
}

/* "/en/about?x#y" -> "/about?x#y", "/en" -> "/". Leaves unprefixed paths alone. */
export function stripLangPrefix(href: string): string {
    const match = href.match(/^\/(en|de|es)(?=$|[/?#])/);
    if (!match) return href;
    const rest = href.slice(match[0].length);
    if (rest === "" || rest[0] === "?" || rest[0] === "#") return "/" + rest;
    return rest;
}

/* Inverse of stripLangPrefix. A language home keeps its trailing slash ("/en/"):
   it is served from en/index.html, and a folder index is addressed with a slash.
   Inner pages have none ("/en/about" from en/about.html), like the Turkish ones. */
export function addLangPrefix(href: string, lang: Lang): string {
    if (lang === DEFAULT_LANG) return href;
    return `/${lang}${href}`;
}

export const pathFor = (route: RouteKey, lang: Lang) => addLangPrefix(ROUTE_PATHS[route], lang);

export const urlFor = (route: RouteKey, lang: Lang) => `${SITE_URL}${pathFor(route, lang)}`;

/* Where the build writes each page: "/" -> index.html, "/about" -> about.html,
   "/en/" -> en/index.html, "/en/about" -> en/about.html. Flat .html files are
   used for inner pages so the host never has to redirect "/about" to "/about/". */
export function fileFor(route: RouteKey, lang: Lang): string {
    const path = pathFor(route, lang);
    return path.endsWith("/") ? `${path.slice(1)}index.html` : `${path.slice(1)}.html`;
}

export interface SeoStrings {
    [key: string]: string;
}

export interface HeadData {
    lang: Lang;
    title: string;
    description: string;
    canonical: string;
    ogLocale: string;
    alternates: { hreflang: string; href: string }[];
}

export function headFor(route: RouteKey, lang: Lang, seo: SeoStrings): HeadData {
    return {
        lang,
        title: seo[`${route}_title`],
        description: seo[`${route}_description`],
        canonical: urlFor(route, lang),
        ogLocale: OG_LOCALES[lang],
        alternates: [
            ...LANGS.map((l) => ({ hreflang: l, href: urlFor(route, l) })),
            { hreflang: "x-default", href: urlFor(route, DEFAULT_LANG) },
        ],
    };
}
