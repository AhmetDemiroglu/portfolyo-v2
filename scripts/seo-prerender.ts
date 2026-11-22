/* Build step: writes one small static HTML file per page and language, plus
   404.html, sitemap.xml with hreflang, and nothing else.

   Why not a full prerender: one was built on 2026-08-02 (headless render +
   hydrateRoot) and reverted, because the 64 kB HTML and hydration work took the
   Lighthouse score from 89 to 57. This keeps the app exactly as it was (plain
   createRoot, same bundle) and only changes the raw HTML:

   - <head>: the page's own title, description, canonical, hreflang set, Open
     Graph tags and, on home pages, JSON-LD. Same values as components/Seo.tsx,
     from the same function (src/seo/site.ts).
   - <div id="root">: a short, visually hidden text copy of the page for crawlers
     that do not run JavaScript (GPTBot, ClaudeBot, PerplexityBot). React replaces
     it on its first commit. It is clipped, so it never paints and cannot become
     the LCP element or shift layout. */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import {
    LANGS,
    ROUTES,
    SITE_URL,
    DEFAULT_LANG,
    fileFor,
    headFor,
    pathFor,
    urlFor,
    type Lang,
    type RouteKey,
} from "../src/seo/site";

// Locale files are free-form JSON read by key path; typing them buys nothing here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dict = Record<string, any>;

const root = fileURLToPath(new URL("..", import.meta.url));
const locales = Object.fromEntries(
    LANGS.map((l) => [l, JSON.parse(readFileSync(resolve(root, `src/locales/${l}.json`), "utf8"))]),
) as Record<Lang, Dict>;

const esc = (value: unknown) =>
    String(value ?? "")
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

/* Project order and live links come from src/data/projects.ts, which imports
   images and cannot be loaded here; the fields needed are read as text. */
function readProjects(): { id: string; liveLink: string | null }[] {
    const src = readFileSync(resolve(root, "src/data/projects.ts"), "utf8");
    const list = src.slice(src.indexOf("export const projectsData"));
    return list
        .split(/\n {4}\{/)
        .slice(1)
        .map((block) => ({
            id: block.match(/id: "([^"]+)"/)?.[1] ?? "",
            liveLink: block.match(/liveLink: "([^"]+)"/)?.[1] ?? null,
        }))
        .filter((p) => p.id);
}

const SAME_AS = [
    "https://github.com/AhmetDemiroglu",
    "https://www.linkedin.com/in/ahmetdemiroglu/",
    "https://www.instagram.com/ahmetdemiroglu___/",
    "https://twitter.com/a__demiroglu",
];

function jsonLd(lang: Lang, t: Dict): string {
    const data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": `${SITE_URL}/#person`,
                name: "Ahmet Demiroğlu",
                url: `${SITE_URL}/`,
                image: `${SITE_URL}/og-image.png`,
                jobTitle: "Full-Stack Developer",
                description: t.seo.home_description,
                address: { "@type": "PostalAddress", addressLocality: "İzmir", addressCountry: "TR" },
                sameAs: SAME_AS,
            },
            {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: `${SITE_URL}/`,
                name: "Ahmet Demiroğlu",
                inLanguage: lang,
                publisher: { "@id": `${SITE_URL}/#person` },
            },
        ],
    };
    // "<" is escaped so no string in the data can close the script element.
    return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

function headBlock(route: RouteKey, lang: Lang): string {
    const t = locales[lang];
    const head = headFor(route, lang, t.seo);
    const lines = [
        `<title>${esc(head.title)}</title>`,
        `<meta data-seo name="description" content="${esc(head.description)}" />`,
        `<link data-seo rel="canonical" href="${head.canonical}" />`,
        ...head.alternates.map(
            (a) => `<link data-seo rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`,
        ),
        `<meta data-seo property="og:title" content="${esc(head.title)}" />`,
        `<meta data-seo property="og:description" content="${esc(head.description)}" />`,
        `<meta data-seo property="og:url" content="${head.canonical}" />`,
        `<meta data-seo property="og:locale" content="${head.ogLocale}" />`,
        ...LANGS.filter((l) => l !== lang).map(
            (l) => `<meta data-seo property="og:locale:alternate" content="${headFor(route, l, locales[l].seo).ogLocale}" />`,
        ),
        `<meta data-seo name="twitter:title" content="${esc(head.title)}" />`,
        `<meta data-seo name="twitter:description" content="${esc(head.description)}" />`,
    ];
    if (route === "home") lines.push(jsonLd(lang, t));
    return lines.join("\n        ");
}

/* Hidden the way screen-reader-only text is, so text extractors keep it. */
const HIDDEN = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap";

function navBlock(lang: Lang, t: Dict): string {
    const pages = ROUTES.map((r: RouteKey) => `<a href="${pathFor(r, lang)}">${esc(t.nav[r])}</a>`).join(" ");
    return `<nav>${pages}</nav>`;
}

function mainContent(route: RouteKey, t: Dict): string {
    const p = (s: unknown) => (s ? `<p>${esc(s)}</p>` : "");
    switch (route) {
        case "home": {
            const h = t.home;
            const projects = readProjects()
                .slice(0, 4)
                .map((pr) => t.projects_page.projects[pr.id]?.title)
                .filter(Boolean)
                .map((title: string) => `<li>${esc(title)}</li>`)
                .join("");
            return [
                `<h1>${esc(h.kicker)}. ${esc(h.line1)} ${esc(h.line2a)}${esc(h.line2b)}</h1>`,
                p(h.role),
                p(h.description),
                `<h2>${esc(h.career_title)}</h2>`,
                p(h.career_p1),
                p(h.career_p2),
                `<h2>${esc(h.featured_title)}</h2><ul>${projects}</ul>`,
                `<h2>SeptimusLab</h2>`,
                p(h.studio_desc),
            ].join("");
        }
        case "about": {
            const a = t.about;
            const items = Array.from({ length: 12 }, (_, i) => i + 1)
                .filter((i) => a[`timeline_${i}_title`])
                .map(
                    (i) =>
                        `<li><h3>${esc(a[`timeline_${i}_year`])} · ${esc(a[`timeline_${i}_title`])}, ${esc(a[`timeline_${i}_subtitle`])}</h3>${p(a[`timeline_${i}_content`])}</li>`,
                )
                .join("");
            return `<h1>${esc(a.title_line1)} ${esc(a.title_line2)}</h1>${p(a.subtitle)}<ol>${items}</ol>`;
        }
        case "skills": {
            const s = t.skills_page;
            const groups = (s.skill_categories as Dict[])
                .flatMap((c) => (c.subCategories ?? []).map((sub: Dict) => ({ cat: c.category, ...sub })))
                .map(
                    (sub) =>
                        `<h2>${esc(sub.title)}</h2><ul>${(sub.skills ?? [])
                            .map((k: Dict) => `<li>${esc(k.name)}: ${esc(k.description)}</li>`)
                            .join("")}</ul>`,
                )
                .join("");
            return `<h1>${esc(s.main_title)}</h1>${p(s.subtitle)}${groups}`;
        }
        case "projects": {
            const s = t.projects_page;
            const items = readProjects()
                .map((pr) => {
                    const text = s.projects[pr.id];
                    if (!text) return "";
                    const link = pr.liveLink ? ` <a href="${esc(pr.liveLink)}">${esc(pr.liveLink)}</a>` : "";
                    return `<li><h2>${esc(text.title)}</h2>${p(text.description)}${link}</li>`;
                })
                .join("");
            return `<h1>${esc(s.main_title)}</h1>${p(s.subtitle)}<ul>${items}</ul>`;
        }
        case "contact": {
            const c = t.contact_page;
            // No e-mail address here: plain HTML is where harvesters look. The app
            // shows it once JavaScript runs.
            const links = SAME_AS.map((u) => `<a href="${u}">${u}</a>`)
                .map((l) => `<li>${l}</li>`)
                .join("");
            return `<h1>${esc(c.main_title)}</h1>${p(c.subtitle)}<ul>${links}</ul>`;
        }
    }
}

function bodyBlock(route: RouteKey, lang: Lang): string {
    const t = locales[lang];
    return `<div style="${HIDDEN}">${navBlock(lang, t)}<main>${mainContent(route, t)}</main></div>`;
}

function render(template: string, head: string, body: string, lang: Lang): string {
    const out = template
        .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
        .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, head)
        .replace("<!--seo:body-->", body);
    if (out.includes("<!--seo:")) throw new Error("seo-prerender: template markers not replaced");
    return out;
}

function notFound(template: string): string {
    const t = locales[DEFAULT_LANG];
    const head = [
        `<title>${esc(t.seo["404_title"])}</title>`,
        `<meta data-seo name="description" content="${esc(t.seo["404_description"])}" />`,
        `<meta data-seo name="robots" content="noindex" />`,
    ].join("\n        ");
    const body = `<div style="${HIDDEN}"><h1>${esc(t["404_page"].title)}</h1><p>${esc(t["404_page"].subtitle)}</p><a href="/">${esc(t["404_page"].home_link)}</a></div>`;
    return render(template, head, body, DEFAULT_LANG);
}

/* Last real change to what a page shows, from git. A build-time timestamp on
   every URL is what Google learns to ignore, so a page without history gets no
   lastmod rather than a made-up one. */
function lastmod(route: RouteKey): string | null {
    const file = route === "home" ? "index" : route;
    const paths = [`src/routes/${file}.tsx`, "src/locales"];
    if (route === "home" || route === "projects") paths.push("src/data/projects.ts");
    try {
        const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...paths], {
            cwd: root,
            encoding: "utf8",
        }).trim();
        return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
    } catch {
        return null;
    }
}

function sitemap(): string {
    const urls = ROUTES.flatMap((route) => {
        const mod = lastmod(route);
        const alternates = headFor(route, DEFAULT_LANG, locales[DEFAULT_LANG].seo).alternates
            .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`)
            .join("\n");
        return LANGS.map(
            (lang) =>
                `  <url>\n    <loc>${urlFor(route, lang)}</loc>\n${mod ? `    <lastmod>${mod}</lastmod>\n` : ""}${alternates}\n  </url>`,
        );
    });
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

export function seoPrerender(): Plugin {
    let outDir = "dist";
    return {
        name: "seo-prerender",
        apply: "build",
        configResolved(config) {
            outDir = resolve(config.root, config.build.outDir);
        },
        closeBundle() {
            const template = readFileSync(resolve(outDir, "index.html"), "utf8");
            const write = (file: string, html: string) => {
                const target = resolve(outDir, file);
                mkdirSync(dirname(target), { recursive: true });
                writeFileSync(target, html);
            };
            for (const route of ROUTES) {
                for (const lang of LANGS) {
                    write(fileFor(route, lang), render(template, headBlock(route, lang), bodyBlock(route, lang), lang));
                }
            }
            write("404.html", notFound(template));
            write("sitemap.xml", sitemap());
        },
    };
}
