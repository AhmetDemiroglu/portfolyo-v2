import { Menu, Transition, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { FiGlobe, FiChevronDown } from 'react-icons/fi'
import ReactCountryFlag from 'react-country-flag'

const languageOptions = [
  { code: 'tr', name: 'Türkçe', country: 'TR' },
  { code: 'en', name: 'English', country: 'GB' },
  { code: 'de', name: 'Deutsch', country: 'DE' },
  { code: 'es', name: 'Español', country: 'ES' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const currentLanguage = languageOptions.find(lang => lang.code === i18n.language)

  return (
    <Menu as="div" className="relative inline-block text-left over">
      <div>
        <MenuButton className="inline-flex w-full justify-center items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ...">
          <FiGlobe />
          {currentLanguage?.code.toUpperCase()}
          <FiChevronDown className="-mr-1 h-5 w-5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems static className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-slate-100 dark:divide-slate-700 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black/5 focus:outline-none border border-slate-200 dark:border-slate-700">
          <div className="px-1 py-1 ">
            {languageOptions.map((lang) => (
              <MenuItem key={lang.code}>
                <button
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-700 dark:text-slate-300 transition-colors data-[active]:bg-sky-500 data-[active]:text-white"
                >
                  <ReactCountryFlag
                    countryCode={lang.country}
                    svg
                    className="mr-2 text-lg"
                    title={lang.country}
                  />
                  {lang.name}
                </button>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}