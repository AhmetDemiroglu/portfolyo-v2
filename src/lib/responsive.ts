/* srcset for the screenshots, from the smaller copies that
   scripts/screen-variants.mjs writes to src/assets/w (npm run images).

   The originals are 400-1200 px wide but drawn at 84-670 CSS px, so phones
   downloaded up to five times the pixels they show. The lookup is by file name,
   so callers keep passing the plain asset URL; a file without copies gets no
   srcset and behaves exactly as before. */

import widths from "../assets/w/widths.json";

const variants = import.meta.glob<string>("../assets/w/*.webp", { eager: true, import: "default" });

const nameOf = (path: string) => path.slice(path.lastIndexOf("/") + 1, -".webp".length);

/* "/assets/pausemenu-home-tr-CxHagoQx.webp" -> "pausemenu-home-tr". Read from the
   URL rather than globbing the originals: a glob would also import images that
   other modules import (the about portrait), and Rollup then splits those into
   tiny shared chunks that sit on the home page's critical path. */
const originalName = (url: string) => url.match(/\/([^/]+)-[\w-]{8}\.webp$/)?.[1];

const copies = new Map<string, Array<[string, number]>>();
for (const [path, url] of Object.entries(variants)) {
    const match = nameOf(path).match(/^(.*)-(\d+)$/);
    if (!match) continue;
    const list = copies.get(match[1]) ?? [];
    list.push([url, Number(match[2])]);
    copies.set(match[1], list);
}

const ownWidth = widths as Record<string, number>;

export function srcSetFor(url: string): string | undefined {
    const name = originalName(url);
    if (!name) return undefined;
    const list = copies.get(name);
    const full = ownWidth[name];
    if (!list?.length || !full) return undefined;
    return [...list.sort((a, b) => a[1] - b[1]), [url, full] as [string, number]]
        .map(([u, w]) => `${u} ${w}w`)
        .join(", ");
}

/* "auto" lets the browser use the drawn width of a lazy image (Chrome, Edge).
   Elsewhere, and for eager images where "auto" is not allowed, 100vw makes the
   browser take the largest file, which is what every visitor got before. */
export const SCREEN_SIZES = "auto, 100vw";
