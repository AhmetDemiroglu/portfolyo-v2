import { Link, useRouterState } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHome, FiUser, FiCode, FiBriefcase, FiMail, FiMenu, FiX } from 'react-icons/fi'
import { Logo } from './Logo'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useState, useEffect } from 'react';


export function Header() {
  const { t } = useTranslation();
  // 1. Mobil menünün açık/kapalı durumunu tutacak state'i ekliyoruz.
  const [isOpen, setIsOpen] = useState(false);
  
  // Sayfa değiştiğinde menünün otomatik kapanmasını sağlamak için router state'ini dinliyoruz.
  const { location } = useRouterState();
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
          {/* Logo her zaman görünür */}
          <Link to="/" onClick={() => setIsOpen(false)}>
            <Logo />
          </Link>
          
          {/* 2. Masaüstü Navigasyon: Sadece orta ekran (md) ve üzerinde görünür */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
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
                      <link.icon className="h-4 w-4" />
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
            ))}
          </div>
          
          {/* Masaüstü Ayarlar: Sadece orta ekran (md) ve üzerinde görünür */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>

          {/* 3. Mobil Menü Butonu: Sadece mobil ekranda (md altı) görünür */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-slate-600 dark:text-slate-300">
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </nav>
        
        {/* 4. Açılır Mobil Menü */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50"
            >
              <div className="flex flex-col items-start gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-slate-600 transition-colors hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                    activeProps={{ className: '!text-sky-500 dark:!text-white' }}
                    activeOptions={{ exact: true }}
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-center gap-4">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
