import { Menu, Transition, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { FiChevronDown } from 'react-icons/fi'
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
        <MenuButton className="group inline-flex items-center justify-center gap-1.5 rounded-full p-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 focus:outline-none">
          <div className="relative flex items-center justify-center w-6 h-6 overflow-hidden rounded-full ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-sky-500/50 transition-all duration-300 shadow-sm shrink-0">
            <ReactCountryFlag
              countryCode={currentLanguage?.country || 'GB'}
              svg
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              className="absolute inset-0 w-full h-full object-cover"
              title={currentLanguage?.name}
            />
          </div>
          <FiChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400 transition-transform duration-300 group-data-[open]:rotate-180" aria-hidden="true" />
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
                  <div className="relative flex items-center justify-center w-5 h-5 overflow-hidden rounded-full mr-2 shrink-0 bg-slate-100 dark:bg-slate-700">
                    <ReactCountryFlag
                      countryCode={lang.country}
                      svg
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                      title={lang.country}
                    />
                  </div>
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