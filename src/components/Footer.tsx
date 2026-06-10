import { Link, useRouterState } from "@tanstack/react-router";
import { FiArrowUpRight } from "react-icons/fi";
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { Reveal } from "./motion/primitives";

const socials = [
    { label: "GitHub", href: "https://github.com/AhmetDemiroglu", icon: FaGithub },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ahmetdemiroglu/", icon: FaLinkedin },
    { label: "Instagram", href: "https://www.instagram.com/ahmetdemiroglu___/", icon: FaInstagram },
    { label: "X", href: "https://twitter.com/a__demiroglu", icon: BsTwitterX },
    { label: "E-mail", href: "mailto:ahmetdemiroglu89@gmail.com", icon: FaEnvelope },
];

const ctaClass =
    "group inline-flex shrink-0 items-center gap-3 rounded-full bg-ink px-6 py-3.5 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-accent hover:text-white";

export function Footer() {
    const { t } = useTranslation();
    const pathname = useRouterState({ select: (state) => state.location.pathname });
    const onContactPage = pathname === "/contact";
    const year = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden border-t border-line/70 bg-soft/50">
            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
                <Reveal>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                        {t("footer.cta_kicker")}
                    </p>
                    <div className="mt-5 flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-end">
                        <h2 className="max-w-2xl font-display text-3xl font-bold leading-[1.05] tracking-tight text-ink sm:text-4xl lg:text-5xl">
                            {t("footer.cta_title")}
                        </h2>
                        {onContactPage ? (
                            // Already on the contact page: route the CTA straight to e-mail instead.
                            <a href="mailto:ahmetdemiroglu89@gmail.com" className={ctaClass}>
                                {t("footer.cta_button_email")}
                                <FiArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </a>
                        ) : (
                            <Link to="/contact" className={ctaClass}>
                                {t("footer.cta_button")}
                                <FiArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </Link>
                        )}
                    </div>
                </Reveal>

                <div className="mt-10 flex flex-col gap-5 border-t border-line/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-5">
                        {socials.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={s.label}
                                className="text-muted transition-all duration-300 hover:-translate-y-1 hover:text-accent"
                            >
                                <s.icon size={19} />
                            </a>
                        ))}
                    </div>
                    <div className="font-mono text-xs leading-relaxed text-muted sm:text-right">
                        <p>
                            © {year} Ahmet Demiroğlu · {t("footer.rights")}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
