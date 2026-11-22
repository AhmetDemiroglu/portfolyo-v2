import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { headFor, isLang, DEFAULT_LANG, LANGS, OG_LOCALES, type RouteKey } from "../seo/site";

/* Renders exactly the tags scripts/seo-prerender.ts writes into the raw HTML, from
   the same function, so the served and the rendered head always agree. main.tsx
   removes the static copies (marked data-seo) before React mounts, which keeps
   one of each tag in the live DOM. */
export function Seo({ route }: { route: RouteKey | "404" }) {
    const { t, i18n } = useTranslation();
    const lang = isLang(i18n.resolvedLanguage) ? i18n.resolvedLanguage : DEFAULT_LANG;
    const seo = t("seo", { returnObjects: true }) as Record<string, string>;

    if (route === "404") {
        return (
            <Helmet key={lang} defer={false} prioritizeSeoTags htmlAttributes={{ lang }}>
                <title>{seo["404_title"]}</title>
                <meta name="description" content={seo["404_description"]} />
                <meta name="robots" content="noindex" />
            </Helmet>
        );
    }

    const head = headFor(route, lang, seo);
    return (
        <Helmet key={lang} defer={false} prioritizeSeoTags htmlAttributes={{ lang }}>
            <title>{head.title}</title>
            <meta name="description" content={head.description} />
            <link rel="canonical" href={head.canonical} />
            {head.alternates.map((alt) => (
                <link key={alt.hreflang} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
            ))}
            <meta property="og:title" content={head.title} />
            <meta property="og:description" content={head.description} />
            <meta property="og:url" content={head.canonical} />
            <meta property="og:locale" content={head.ogLocale} />
            {LANGS.filter((l) => l !== lang).map((l) => (
                <meta key={l} property="og:locale:alternate" content={OG_LOCALES[l]} />
            ))}
            <meta name="twitter:title" content={head.title} />
            <meta name="twitter:description" content={head.description} />
        </Helmet>
    );
}
