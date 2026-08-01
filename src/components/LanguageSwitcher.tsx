import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiChevronDown } from 'react-icons/fi'
import { FlagIcon } from './FlagIcon'

const languageOptions = [
  { code: 'tr', name: 'Türkçe', country: 'TR' },
  { code: 'en', name: 'English', country: 'GB' },
  { code: 'de', name: 'Deutsch', country: 'DE' },
  { code: 'es', name: 'Español', country: 'ES' },
]

/* Hand-rolled on purpose: Headless UI's Menu pulled ~100 KB of JS into the entry
   chunk of every page for this one dropdown. */
export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentLanguage =
    languageOptions.find(lang => lang.code === i18n.resolvedLanguage) ?? languageOptions[0]

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const selectLanguage = (code: string) => {
    i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={currentLanguage.name}
        className="group inline-flex items-center justify-center gap-1.5 rounded-full p-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 focus:outline-none"
      >
        <span className="relative flex items-center justify-center w-6 h-6 overflow-hidden rounded-full ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-sky-500/50 transition-all duration-300 shadow-sm shrink-0">
          <FlagIcon country={currentLanguage.country} className="absolute inset-0 w-full h-full" />
        </span>
        <FiChevronDown
          className={`h-4 w-4 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        role="menu"
        className={`absolute right-0 mt-2 w-40 origin-top-right divide-y divide-slate-100 dark:divide-slate-700 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black/5 focus:outline-none border border-slate-200 dark:border-slate-700 transition duration-100 ease-out ${
          open
            ? 'opacity-100 scale-100'
            : 'pointer-events-none opacity-0 scale-95'
        }`}
      >
        <div className="px-1 py-1">
          {languageOptions.map(lang => (
            <button
              key={lang.code}
              type="button"
              role="menuitem"
              tabIndex={open ? 0 : -1}
              onClick={() => selectLanguage(lang.code)}
              className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-700 dark:text-slate-300 transition-colors hover:bg-sky-500 hover:text-white focus:bg-sky-500 focus:text-white focus:outline-none"
            >
              <span className="relative flex items-center justify-center w-5 h-5 overflow-hidden rounded-full mr-2 shrink-0 bg-slate-100 dark:bg-slate-700">
                <FlagIcon country={lang.country} className="absolute inset-0 w-full h-full" />
              </span>
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
