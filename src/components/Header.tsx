import { Link, useRouterState } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { FiHome, FiUser, FiCode, FiBriefcase, FiMail, FiMenu, FiX } from 'react-icons/fi'
import { Logo } from './Logo'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export function Header() {
  const { t, i18n } = useTranslation()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [isOpen, setIsOpen] = useState(false)
  const [visualPath, setVisualPath] = useState(pathname)
  const [hoverPath, setHoverPath] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0, opacity: 0 })
  const [hoverIndicator, setHoverIndicator] = useState({ left: 0, width: 0, opacity: 0 })

  useEffect(() => {
    setIsOpen(false)
    setVisualPath(pathname)
  }, [pathname])

  const navLinks = [
    { href: '/', label: t('nav.home'), icon: FiHome },
    { href: '/about', label: t('nav.about'), icon: FiUser },
    { href: '/skills', label: t('nav.skills'), icon: FiCode },
    { href: '/projects', label: t('nav.projects'), icon: FiBriefcase },
    { href: '/contact', label: t('nav.contact'), icon: FiMail },
  ]

  const updateActiveIndicator = useCallback(() => {
    const container = navRef.current
    const activeLink = linkRefs.current[visualPath]

    if (!container || !activeLink) {
      setActiveIndicator((prev) => (prev.opacity ? { ...prev, opacity: 0 } : prev))
      return
    }

    const containerRect = container.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()

    setActiveIndicator({
      left: linkRect.left - containerRect.left,
      width: linkRect.width,
      opacity: 1,
    })
  }, [visualPath])

  const updateHoverIndicator = useCallback(() => {
    const container = navRef.current
    const hoveredLink = hoverPath ? linkRefs.current[hoverPath] : null

    if (!container || !hoveredLink) {
      setHoverIndicator((prev) => (prev.opacity ? { ...prev, opacity: 0 } : prev))
      return
    }

    const containerRect = container.getBoundingClientRect()
    const linkRect = hoveredLink.getBoundingClientRect()

    setHoverIndicator({
      left: linkRect.left - containerRect.left,
      width: linkRect.width,
      opacity: 1,
    })
  }, [hoverPath])

  useLayoutEffect(() => {
    const activeFrame = requestAnimationFrame(updateActiveIndicator)
    const hoverFrame = requestAnimationFrame(updateHoverIndicator)

    return () => {
      cancelAnimationFrame(activeFrame)
      cancelAnimationFrame(hoverFrame)
    }
  }, [updateActiveIndicator, updateHoverIndicator, i18n.language])

  useEffect(() => {
    const handleResize = () => {
      updateActiveIndicator()
      updateHoverIndicator()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateActiveIndicator, updateHoverIndicator])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto mt-4 rounded-lg border border-slate-200 bg-white/80 p-3 shadow-lg backdrop-blur-lg dark:border-slate-700/50 dark:bg-slate-900/50">
        <nav className="flex items-center justify-between">
          <Link to="/" preload="intent" onClick={() => setIsOpen(false)}>
            <Logo />
          </Link>

          <div
            ref={navRef}
            className="relative hidden md:flex items-center gap-2"
            onMouseLeave={() => setHoverPath(null)}
          >
            <motion.span
              initial={false}
              className="pointer-events-none absolute inset-y-1 left-0 rounded-md bg-sky-500/10 dark:bg-sky-400/15"
              animate={{
                x: activeIndicator.left,
                width: activeIndicator.width,
                opacity: activeIndicator.opacity,
              }}
              transition={{
                x: { type: 'spring', stiffness: 520, damping: 38, mass: 0.55 },
                width: { type: 'spring', stiffness: 520, damping: 38, mass: 0.55 },
                opacity: { duration: 0.12 },
              }}
            />
            <motion.span
              initial={false}
              className="pointer-events-none absolute inset-y-1 left-0 rounded-md bg-slate-300/40 dark:bg-slate-500/25"
              animate={{
                x: hoverIndicator.left,
                width: hoverIndicator.width,
                opacity: hoverIndicator.opacity,
              }}
              transition={{
                x: { type: 'spring', stiffness: 440, damping: 34, mass: 0.52 },
                width: { type: 'spring', stiffness: 440, damping: 34, mass: 0.52 },
                opacity: { duration: 0.1 },
              }}
            />

            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                preload="intent"
                ref={(el) => {
                  linkRefs.current[link.href] = el
                }}
                onClick={() => setVisualPath(link.href)}
                onMouseEnter={() => setHoverPath(link.href)}
                className={`relative z-10 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  visualPath === link.href
                    ? 'text-sky-500 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="rounded-md p-2 text-slate-600 dark:text-slate-300">
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden mt-3 border-t border-slate-200 pt-3 dark:border-slate-700/50"
            >
              <div className="flex flex-col items-start gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    preload="intent"
                    onClick={() => setVisualPath(link.href)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/50 ${
                      visualPath === link.href ? '!text-sky-500 dark:!text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-center gap-4 border-t border-slate-200 pt-4 dark:border-slate-700/50">
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
