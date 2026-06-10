import { createFileRoute } from "@tanstack/react-router";
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FiArrowUpRight } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useTheme } from "../contexts/ThemeContext";
import { Contours } from "../components/scenery/Contours";
import { SectionHeading } from "../components/SectionHeading";
import { Reveal } from "../components/motion/primitives";

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const directContactLinks = [
    {
        id: "email",
        href: "mailto:ahmetdemiroglu89@gmail.com",
        icon: FaEnvelope,
        handle: "ahmetdemiroglu89@gmail.com",
    },
    {
        id: "whatsapp",
        href: "https://wa.me/905557137064",
        icon: FaWhatsapp,
        handle: "+90 555 713 70 64",
    },
];

const socialLinks = [
    { id: "github", href: "https://github.com/AhmetDemiroglu", icon: FaGithub },
    { id: "linkedin", href: "https://www.linkedin.com/in/ahmetdemiroglu/", icon: FaLinkedin },
    { id: "instagram", href: "https://www.instagram.com/ahmetdemiroglu___/", icon: FaInstagram },
    { id: "twitter", href: "https://twitter.com/a__demiroglu", icon: BsTwitterX },
];

export const Route = createFileRoute("/contact")({
    component: ContactPage,
});

const inputClass =
    "w-full rounded-xl border border-line/80 bg-soft/60 p-3.5 text-ink placeholder-muted transition-colors focus:border-accent focus:outline-none";

function ContactPage() {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();

    const lightMapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const darkMapUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    const mapUrl = theme === "light" ? lightMapUrl : darkMapUrl;

    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState({ success: false, message: "" });

    const translatedDirectLinks = t("contact_page.direct_links", { returnObjects: true }) as Record<
        string,
        { label: string }
    >;
    const fullDirectContactLinks = directContactLinks.map((link) => ({
        ...link,
        label: translatedDirectLinks[link.id]?.label || link.id,
    }));

    const translatedSocialLinks = t("contact_page.social_links", { returnObjects: true }) as Record<
        string,
        { label: string }
    >;
    const fullSocialLinks = socialLinks.map((link) => ({
        ...link,
        label: translatedSocialLinks[link.id]?.label || link.id,
    }));

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;
        setIsSubmitting(true);

        emailjs
            .sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                formRef.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
            )
            .then(
                () => {
                    setFormStatus({ success: true, message: t("contact_page.form_status_success") });
                    formRef.current?.reset();
                },
                (error) => {
                    setFormStatus({
                        success: false,
                        message: t("contact_page.form_status_error") + error.text,
                    });
                },
            )
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="relative overflow-hidden">
            <Helmet key={i18n.language} defer={false} prioritizeSeoTags>
                <title>{t("seo.contact_title")}</title>
                <meta name="description" content={t("seo.contact_description") ?? ""} />
            </Helmet>

            <Contours className="opacity-60" />

            <div className="relative mx-auto max-w-6xl px-5 pb-28 pt-36 sm:px-8 sm:pt-44">
                <SectionHeading
                    label={t("contact_page.label")}
                    title={t("contact_page.main_title")}
                />
                <Reveal delay={0.1}>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                        {t("contact_page.subtitle")}
                    </p>
                </Reveal>

                <div className="mt-16 grid items-start gap-8 lg:grid-cols-2">
                    {/* Left column — direct contact + map */}
                    <div className="space-y-8">
                        <Reveal delay={0.15}>
                            <div className="space-y-4">
                                {fullDirectContactLinks.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center justify-between gap-4 rounded-2xl border border-line/70 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-soft text-ink-soft transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                                                <link.icon size={20} />
                                            </span>
                                            <div>
                                                <h3 className="font-display font-bold text-ink">{link.label}</h3>
                                                <p className="mt-0.5 text-sm text-muted">{link.handle}</p>
                                            </div>
                                        </div>
                                        <FiArrowUpRight className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                                    </a>
                                ))}
                            </div>
                        </Reveal>

                        <Reveal delay={0.25}>
                            <div className="overflow-hidden rounded-2xl border border-line/70">
                                <div className="flex items-center justify-between border-b border-line/70 bg-surface px-6 py-4">
                                    <h2 className="font-display font-bold text-ink">
                                        {t("contact_page.location_title")}
                                    </h2>
                                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                                        38.42°N · 27.14°E
                                    </span>
                                </div>
                                <div className="h-64">
                                    <MapContainer
                                        center={[38.4237, 27.1428]}
                                        zoom={10}
                                        scrollWheelZoom={false}
                                        className="h-full w-full"
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url={mapUrl}
                                        />
                                        <Marker position={[38.4237, 27.1428]}>
                                            <Popup>
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: t("contact_page.location_popup"),
                                                    }}
                                                />
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delay={0.3}>
                            <div className="flex items-center gap-4">
                                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                                    {t("contact_page.social_title")}
                                </span>
                                <span className="h-px flex-grow bg-line/80" />
                                {fullSocialLinks.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={link.label}
                                        className="text-ink-soft transition-all duration-300 hover:-translate-y-1 hover:text-accent"
                                    >
                                        <link.icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </Reveal>
                    </div>

                    {/* Right column — form */}
                    <Reveal delay={0.2}>
                        <form
                            ref={formRef}
                            onSubmit={sendEmail}
                            className="flex flex-col gap-4 rounded-2xl border border-line/70 bg-surface p-8 shadow-sm sm:p-10"
                        >
                            <h2 className="font-display text-2xl font-bold text-ink">
                                {t("contact_page.form_title")}
                            </h2>
                            <input
                                type="text"
                                name="from_name"
                                placeholder={t("contact_page.form_placeholder_name")}
                                required
                                className={inputClass}
                            />
                            <input
                                type="email"
                                name="from_email"
                                placeholder={t("contact_page.form_placeholder_email")}
                                required
                                className={inputClass}
                            />
                            <textarea
                                name="message"
                                placeholder={t("contact_page.form_placeholder_message")}
                                required
                                rows={8}
                                className={`${inputClass} resize-none`}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-xl bg-ink px-6 py-4 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? t("contact_page.form_button_submitting")
                                    : t("contact_page.form_button_submit")}
                            </button>
                            {formStatus.message && (
                                <p
                                    className={`rounded-lg p-3 text-center text-sm font-medium ${
                                        formStatus.success
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                                    }`}
                                >
                                    {formStatus.message}
                                </p>
                            )}
                        </form>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}
