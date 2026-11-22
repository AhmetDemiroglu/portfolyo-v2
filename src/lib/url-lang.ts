import { DEFAULT_LANG, langFromPath, type Lang } from "../seo/site";

/* The language whose prefix the router puts on every URL it builds. Kept apart
   from i18n.language because i18next only switches after a lazy locale chunk has
   loaded, and links must carry the new prefix immediately. */
let current: Lang = typeof window === "undefined" ? DEFAULT_LANG : langFromPath(window.location.pathname);

export const getUrlLang = () => current;
export const setUrlLang = (lang: Lang) => {
    current = lang;
};
