import { Link, createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { FiArrowLeft } from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import { Contours } from "../components/scenery/Contours";
import { Reveal } from "../components/motion/primitives";

export const Route = createFileRoute("/$")({
    component: NotFoundPage,
});

function NotFoundPage() {
    const { t, i18n } = useTranslation();

    return (
        <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
            <Helmet key={i18n.language} defer={false} prioritizeSeoTags>
                <title>{t("seo.404_title")}</title>
                <meta name="description" content={t("seo.404_description") ?? ""} />
            </Helmet>

            <Contours />

            <div className="relative z-10 mx-auto max-w-3xl px-5 py-32 text-center sm:px-8">
                <Reveal>
                    <p className="text-stroke select-none font-display text-[9rem] font-bold leading-none sm:text-[14rem]">
                        404
                    </p>
                </Reveal>
                <Reveal delay={0.1}>
                    <h1 className="-mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                        {t("404_page.title")}
                    </h1>
                </Reveal>
                <Reveal delay={0.2}>
                    <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">
                        {t("404_page.subtitle")}
                    </p>
                </Reveal>
                <Reveal delay={0.3}>
                    <Link
                        to="/"
                        className="group mt-10 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-accent hover:text-white"
                    >
                        <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                        {t("404_page.home_link")}
                    </Link>
                </Reveal>
                <Reveal delay={0.4}>
                    <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                        {t("404_page.error_code")}
                    </p>
                </Reveal>
            </div>
        </div>
    );
}
