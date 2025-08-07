import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { FaEnvelope, FaWhatsapp, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa'
import { BsTwitterX } from 'react-icons/bs'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { AnimatedGridBackground } from "../components/GridBackground";
import { useTranslation } from 'react-i18next'
import { useTheme } from '../contexts/ThemeContext'


const directContactLinks = [
  { id: 'email', href: 'mailto:ahmetdemiroglu89@gmail.com', icon: FaEnvelope, handle: 'ahmetdemiroglu89@gmail.com' },
  { id: 'whatsapp', href: 'https://wa.me/905557137064', icon: FaWhatsapp, handle: '+90 555 713 70 64' },
];

const socialLinks = [
    { id: 'github', href: 'https://github.com/AhmetDemiroglu', icon: FaGithub },
    { id: 'linkedin', href: 'https://www.linkedin.com/in/ahmet-d-a11b8853/', icon: FaLinkedin },
    { id: 'instagram', href: 'https://www.instagram.com/ahmetdemiroglu___/', icon: FaInstagram },
    { id: 'twitter', href: 'https://twitter.com/a__demiroglu', icon: BsTwitterX },
];


export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const { t } = useTranslation();

  const { theme } = useTheme();
  
  const lightMapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const darkMapUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const mapUrl = theme === 'light' ? lightMapUrl : darkMapUrl;


  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ success: false, message: '' });

  const translatedDirectLinks = t('contact_page.direct_links', { returnObjects: true }) as Record<string, { label: string }>;
  const fullDirectContactLinks = directContactLinks.map(link => ({
    ...link,
    label: translatedDirectLinks[link.id]?.label || link.id
  }));

  const translatedSocialLinks = t('contact_page.social_links', { returnObjects: true }) as Record<string, { label: string }>;
  const fullSocialLinks = socialLinks.map(link => ({
    ...link,
    label: translatedSocialLinks[link.id]?.label || link.id
  }));
  
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setIsSubmitting(true);

    emailjs
      .sendForm(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, formRef.current, import.meta.env.VITE_EMAILJS_PUBLIC_KEY)
      .then(() => {
          setFormStatus({ success: true, message: t('contact_page.form_status_success') });
          formRef.current?.reset();
        }, (error) => {
          setFormStatus({ success: false, message: t('contact_page.form_status_error') + error.text });
        })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return ( 
    <div className="relative min-h-screen pt-16">
      <AnimatedGridBackground />
      <div className="relative z-10 container mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-center text-5xl font-bold text-slate-900 dark:text-white">{t('contact_page.main_title')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-xl text-slate-600 dark:text-slate-400">{t('contact_page.subtitle')}</p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} >
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">{t('contact_page.direct_contact_title')}</h2>
              <div className="mt-4 space-y-4">
                {fullDirectContactLinks.map((link) => (
                    <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-lg bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:-translate-y-1" >
                      <link.icon className="h-8 w-8 flex-shrink-0 text-sky-500 dark:text-sky-400" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{link.label}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{link.handle}</p>
                      </div>
                    </a>
                ))}
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} >
              <h2 className="text-3xl font-semibold text-white">{t('contact_page.location_title')}</h2>
                <div className="mt-4 rounded-lg border border-slate-700 h-64 overflow-hidden">
                  <MapContainer center={[38.4237, 27.1428]} zoom={10} scrollWheelZoom={false} className="h-full w-full">
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url={mapUrl} />
                    <Marker position={[38.4237, 27.1428]}>
                      <Popup>
                        <span dangerouslySetInnerHTML={{ __html: t('contact_page.location_popup') }} />
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
            </motion.div>
          </div>

          <motion.div className="flex flex-col h-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} >
            <h2 className="text-3xl font-semibold text-white">{t('contact_page.form_title')}</h2>
            <form ref={formRef} onSubmit={sendEmail} className="mt-4 flex-grow flex flex-col gap-4 rounded-lg bg-white dark:bg-slate-800 p-8 border border-slate-200 dark:border-slate-700" >
              <input type="text" name="from_name" placeholder={t('contact_page.form_placeholder_name')} required className="w-full rounded-md bg-slate-100 dark:bg-slate-700 p-3 text-slate-900 dark:text-white placeholder-slate-400 border border-transparent focus:border-sky-500 focus:outline-none" />
              <input type="email" name="from_email" placeholder={t('contact_page.form_placeholder_email')} required className="w-full rounded-md bg-slate-100 dark:bg-slate-700 p-3 text-slate-900 dark:text-white placeholder-slate-400 border border-transparent focus:border-sky-500 focus:outline-none" />
              <textarea name="message" placeholder={t('contact_page.form_placeholder_message')} required rows={10} className="w-full rounded-md bg-slate-100 dark:bg-slate-700 p-3 text-slate-900 dark:text-white placeholder-slate-400 border border-transparent focus:border-sky-500 focus:outline-none" />
              <button type="submit" disabled={isSubmitting} className="rounded-md bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed" >
                {isSubmitting ? t('contact_page.form_button_submitting') : t('contact_page.form_button_submit')}
              </button>
              {formStatus.message && (
                <p className={`mt-1 mb-0 text-center text-sm font-medium w-full p-1 rounded-md ${ formStatus.success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300' }`}>
                  {formStatus.message}
                </p>
              )}
            </form>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="mt-16 pt-8 border-t-2 border-slate-200 dark:border-slate-700" >
            <h2 className="text-center text-2xl font-semibold text-slate-900 dark:text-white">{t('contact_page.social_title')}</h2>
            <div className="mt-6 flex justify-center items-center gap-8">
                {fullSocialLinks.map((link) => (
                    <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer" title={link.label} className="text-slate-500 dark:text-slate-400 transition-all duration-300 hover:text-sky-500 dark:hover:text-sky-400 hover:scale-110" >
                        <link.icon size={32} />
                    </a>
                ))}
            </div>
        </motion.div>
      </div>
    </div>
  )
}