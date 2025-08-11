import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { ThemeProvider } from '../contexts/ThemeContext'

// function GitHubPagesRedirectHandler() {
//   const router = useRouter();
  
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const redirectPath = params.get('p');

//     if (redirectPath) {
//       window.history.replaceState({}, '', window.location.pathname);
//       router.navigate({ to: redirectPath, replace: true });
//     }
//   }, [router]); 

//   return null;
// }

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      {/* <GitHubPagesRedirectHandler /> */}
      <Header />
      <main className="min-h-screen bg-white text-slate-800 dark:bg-slate-900 dark:text-white transition-colors duration-300 ">
        <Outlet />
      </main>
    </ThemeProvider>
  ),
})
