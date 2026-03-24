/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg) translateY(-1px)' },
          '75%': { transform: 'rotate(5deg) translateY(1px)' },
        }
      },
      animation: {
        'wave-slow': 'wave 3s ease-in-out infinite',
      }
    },
  },
  plugins: [
  ],
}