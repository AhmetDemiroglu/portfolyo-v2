/**
 * Renders each route to static HTML after the client build.
 *
 * Why a real browser rather than react-dom/server: the app reads localStorage,
 * matchMedia and navigator during render (theme + language detection). Running
 * it in Chromium means none of that needs server-side guards, so the shipped
 * code stays exactly what runs in production.
 *
 * This step is best-effort on purpose. If Chromium is unavailable the build
 * still succeeds and simply deploys the normal single-page HTML.
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const HELPER_DIR = path.join(ROOT, '.prerender');
const HELPER_PREFIX = '/__prerender/';
const ROUTES = ['/', '/about', '/skills', '/projects', '/contact'];
const PORT = 41731;

const MIME = {
    '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
    '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json',
    '.map': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain',
};

/* The pristine shell, read once before anything is written back. Every HTML
   request is answered from this copy: if the server handed back a file this run
   had already prerendered, the page would boot with markup in #root and we would
   end up snapshotting our own previous output instead of a fresh React render. */
const TEMPLATE = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

function serve() {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const url = decodeURIComponent(req.url.split('?')[0]);

            if (url.startsWith(HELPER_PREFIX)) {
                const helper = path.join(HELPER_DIR, url.slice(HELPER_PREFIX.length));
                res.writeHead(200, { 'Content-Type': 'text/javascript' });
                return fs.createReadStream(helper).pipe(res);
            }

            const file = path.join(DIST, url);
            const isAsset = fs.existsSync(file) && fs.statSync(file).isFile() && path.extname(file) !== '.html';

            if (!isAsset) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                return res.end(TEMPLATE);
            }
            res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
            fs.createReadStream(file).pipe(res);
        });
        server.listen(PORT, '127.0.0.1', () => resolve(server));
    });
}

/**
 * Loading the render helper leaves traces in <head>: Vite's preload runtime adds
 * modulepreload links for the helper's own chunks. Those paths exist only during
 * the build, so a deployed page would request them and get the SPA fallback HTML
 * back, logging a MIME type error. Rather than matching on known prefixes, drop
 * any local reference that has no matching file in dist.
 */
function dropDanglingRefs(html) {
    return html.replace(/<(link|script)\b[^>]*?(?:href|src)="(\/[^"]*)"[^>]*?>(?:<\/script>)?/g, (tag, _kind, url) => {
        const asset = path.join(DIST, decodeURIComponent(url.split('?')[0]));
        return fs.existsSync(asset) ? tag : '';
    });
}

let puppeteer;
try {
    puppeteer = (await import('puppeteer')).default;
} catch {
    console.warn('[prerender] puppeteer unavailable, shipping the SPA shell as-is.');
    process.exit(0);
}

const server = await serve();
let browser;

try {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });

    for (const route of ROUTES) {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });

        await page.evaluateOnNewDocument(() => {
            // Render in the default language so the markup matches what a
            // first-time visitor hydrates against (i18n falls back to Turkish
            // before the chunk for another language arrives).
            try {
                localStorage.setItem('i18nextLng', 'tr');
                localStorage.removeItem('theme');
            } catch {
                /* storage unavailable, the app falls back to its own defaults */
            }

        });

        await page.goto(`http://127.0.0.1:${PORT}${route}`, {
            waitUntil: 'networkidle0',
            timeout: 60000,
        });

        // Let the app finish booting so Helmet has written this route's <title>
        // and meta description into <head>, then render the body properly.
        await new Promise((r) => setTimeout(r, 300));
        await page.addScriptTag({ url: `${HELPER_PREFIX}entry.js`, type: 'module' });
        await page.waitForFunction(() => typeof window.__prerenderHTML === 'function', { timeout: 30000 });

        const html = await page.evaluate(async () => {
            const body = await window.__prerenderHTML();
            // The theme class is per visitor, decided by the inline head script,
            // so it must not be baked into the output.
            document.documentElement.removeAttribute('class');
            // Drop the injected helper: it only exists during the build, and a
            // deployed page asking for it would get the SPA fallback HTML back
            // and log a MIME type error.
            document.querySelectorAll('script[src^="/__prerender/"]').forEach((s) => s.remove());
            document.getElementById('root').innerHTML = body;
            return '<!doctype html>\n' + document.documentElement.outerHTML;
        });

        const cleaned = dropDanglingRefs(html);

        const outDir = route === '/' ? DIST : path.join(DIST, route);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), cleaned);

        const kb = (Buffer.byteLength(cleaned) / 1024).toFixed(1);
        console.log(`[prerender] ${route.padEnd(10)} -> ${path.relative(DIST, path.join(outDir, 'index.html'))} (${kb} kB)`);

        await page.close();
    }
} catch (error) {
    console.warn(`[prerender] skipped: ${error.message}`);
} finally {
    await browser?.close();
    server.close();
}
