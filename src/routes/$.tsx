import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, type Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaHome } from 'react-icons/fa'
import { AnimatedGridBackground } from '../components/GridBackground'

export const Route = createFileRoute('/$')({
  component: NotFoundPage,
})

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

function NotFoundPage() {
  const { t } = useTranslation()

  if (!t) { return <div>Yükleniyor...</div> }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-8">
      <AnimatedGridBackground />
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: 'url(/404.jpg)' }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
      
      <motion.div
        className="relative z-20 flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <motion.h2
            className="bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text text-8xl font-black text-transparent opacity-50 md:text-9xl"
            animate={{y: [-10, 10, -10], rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            404
          </motion.h2>
        </motion.div>

        <motion.h1 variants={itemVariants} className="mt-4 text-4xl font-extrabold text-white sm:text-5xl" >
          {t('404_page.title')}
        </motion.h1>

        <motion.p variants={itemVariants} className="mt-4 max-w-lg text-lg text-slate-400">
          {t('404_page.subtitle')}
        </motion.p>
        
        <motion.div variants={itemVariants} className="group relative mt-8">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 blur transition-opacity duration-300 group-hover:opacity-60" />
          <Link
            to="/"
            className="relative inline-flex items-center gap-2 rounded-lg bg-slate-800/80 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-slate-700/80"
          >
            <FaHome className="transition-transform group-hover:-translate-x-1" />
            {t('404_page.home_link')}
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 border-t border-slate-800 pt-4">
          <p className="text-sm text-slate-500">
            {t('404_page.error_code')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}