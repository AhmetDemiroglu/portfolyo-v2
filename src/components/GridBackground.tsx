import { useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const darkParticleColors = ['#64748b', '#94a3b8', '#0ea5e9', '#a855f7'];
const lightParticleColors = ['#d1d5db', '#e5e7eb', '#60a5fa', '#c084fc'];

export function AnimatedGridBackground() {
  const { theme } = useTheme();

  const particles = useMemo(() => {
    const colors = theme === 'light' ? lightParticleColors : darkParticleColors;

    return Array.from({ length: 60 }, (_, i) => {
      const size = Math.random() * 3 + 0.5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 20 + 30;
      const delay = Math.random() * 10;
      const opacity = Math.random() * 0.3 + 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const moveX = Math.random() * 100 - 50;
      const moveY = Math.random() * 100 - 50;

      return { id: i, size, x, y, duration, delay, opacity, color, moveX, moveY };
    });
  }, [theme]);

  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-particle-drift"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            opacity: p.opacity,
            '--drift-x': `${p.moveX}px`,
            '--drift-y': `${p.moveY}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
