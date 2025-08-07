import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { FiHome, FiUser, FiCode, FiBriefcase, FiMail } from 'react-icons/fi'
import { Logo } from './Logo'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Header() {
  const { t } = useTranslation();

  const navLinks = [
    { href: '/', label: t('nav.home'), icon: FiHome },
    { href: '/about', label: t('nav.about'), icon: FiUser },
    { href: '/skills', label: t('nav.skills'), icon: FiCode },
    { href: '/projects', label: t('nav.projects'), icon: FiBriefcase },
    { href: '/contact', label: t('nav.contact'), icon: FiMail },
  ]
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto mt-4 rounded-lg border border-slate-200 bg-white/80 p-3 shadow-lg backdrop-blur-lg dark:border-slate-700/50 dark:bg-slate-900/50">
        <nav className="flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  activeProps={{ className: '!text-sky-500 dark:!text-white' }}
                  activeOptions={{ exact: true }}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-sky-500"
                          layoutId="active-underline"
                        />
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center gap-3 over">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  )
}