import { useTheme } from '../contexts/ThemeContext';
import { CloudSun, MoonStar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 overflow-hidden"
      aria-label="Temayı değiştir"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={theme} 
          initial={{ y: -20, opacity: 0, scale: 0.8, rotate: -30 }}
          animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, scale: 0.8, rotate: 30 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute" 
        >
          {theme === 'light' ? <CloudSun size={20} strokeWidth={1.5} /> : <MoonStar size={20} strokeWidth={1.5} />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}