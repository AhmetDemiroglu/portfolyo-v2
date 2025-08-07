import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { ThemeProvider } from '../contexts/ThemeContext'


export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <Header />
      <main className="min-h-screen bg-white text-slate-800 dark:bg-slate-900 dark:text-white transition-colors duration-300 ">
        <Outlet />
      </main>
    </ThemeProvider>
  ),
})
