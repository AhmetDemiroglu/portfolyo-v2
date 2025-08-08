import { createFileRoute } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  const { t } = useTranslation(); 
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  
  const backgroundTextY = useTransform(scrollYProgress, [0, 1], ['-90%', '-10%'])

  const opacityImage1 = useTransform(scrollYProgress, [0.3, 0.5], [1, 0]);
  const opacityImage2 = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);

  const pointerEventsImage1 = useTransform(opacityImage1, (opacity) => (opacity < 0.5 ? 'none' : 'auto'));
  const pointerEventsImage2 = useTransform(opacityImage2, (opacity) => (opacity < 0.5 ? 'none' : 'auto'));

  return (
    <div ref={containerRef} className="relative bg-gray-50 dark:bg-slate-900 pt-32 min-h-screen transition-colors duration-300">
      {/* Arka Planlar */}
      <motion.div
        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"
      />
      <motion.div
        animate={{ y: [15, -15, 15] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute whitespace-nowrap text-[15vw] font-extrabold text-slate-200 dark:text-slate-800 pointer-events-none"
      />
      <motion.h1
        style={{ 
          y: backgroundTextY, 
          x: '-50%',
          left: '50%',
          top: '50%',          
        }}
        className="absolute whitespace-nowrap text-[15vw] font-extrabold text-slate-200 dark:text-slate-800 pointer-events-none"
      >
        {t('about.background_text')}
      </motion.h1>

      <div className="relative z-10 container mx-auto px-8 pb-16">
        <div className="flex flex-col items-start gap-12 md:flex-row">
          
          {/* Sol Taraf */}
          <div className="w-full md:w-1/3 md:sticky md:top-32 h-[calc(100vh-8rem)]">
            <div className="relative w-full h-full">
              <motion.img
                style={{ opacity: opacityImage1, pointerEvents: pointerEventsImage1 }}
                src="ben4.png"
                alt="Ahmet Demiroğlu Karikatür-1"
                className="absolute inset-0 w-full h-full object-contain rounded-lg transition-all duration-500 dark:brightness-50 dark:saturate-90 hover:!brightness-100 hover:!saturate-100"              />
              <motion.img
                style={{ opacity: opacityImage2, pointerEvents: pointerEventsImage2 }}
                src="ben3.png"
                alt="Ahmet Demiroğlu Karikatür-2"
                className="absolute inset-0 w-full h-full object-contain rounded-lg transition-all duration-500 dark:brightness-50 dark:saturate-90 hover:!brightness-100 hover:!saturate-100"              />
            </div>
          </div>

          {/* Sağ Taraf */}
          <div className="w-full md:w-2/3">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">{t('about.title')}</h2>
            <div className="mt-6 space-y-6 text-lg text-slate-600 dark:text-slate-300">
                <p> {t('about.p1')} </p>
                <p> {t('about.p2')} </p>
                <p> {t('about.p3')} </p>
                <p> {t('about.p4')} </p>
                <p> {t('about.p5')} </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}