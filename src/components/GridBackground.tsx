import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const darkParticleColors = [ '#64748b', '#94a3b8', '#0ea5e9', '#a855f7' ];
const lightParticleColors = [ '#d1d5db', '#e5e7eb', '#60a5fa', '#c084fc' ];

export function AnimatedGridBackground() {
  const { theme } = useTheme();

  const particles = useMemo(() => {
    const colors = theme === 'light' ? lightParticleColors : darkParticleColors;
    
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 0.5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 30,
      delay: Math.random() * 1,
      opacity: Math.random() * 0.3 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
  }, [theme]) 

  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: particle.opacity,
            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
          }}
          transition={{
            opacity: { duration: 3, delay: particle.delay },
            x: {
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
            },
            y: {
              duration: particle.duration * 0.8,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />
      ))}
    </div>
  )
}