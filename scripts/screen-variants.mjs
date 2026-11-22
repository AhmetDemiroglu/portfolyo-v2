/* Writes smaller copies of the screenshots for srcset: src/assets/w/<name>-<width>.webp,
   plus widths.json with each original's own width. Run after adding or replacing a
   screenshot (npm run images) and commit the output; the build only reads it, so
   Netlify needs no image tools. Needs cwebp (brew install webp).

   Only files tracked by git are processed, so a half-finished capture is not
   picked up. A screenshot without copies still works: it just has no srcset. */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = resolve(root, "src/assets/w");

/* Phones are drawn 84-180 CSS px wide, laptops up to ~320, the featured web
   shot up to ~670. These cover 1x-2x screens without sending the full file. */
const TARGETS = [280, 480, 800];
const SCREENS = /^(pausemenu|purescan|fintel|openworld|sip|multimind)-.*\.webp$/;

const width = (file) =>
    Number(execFileSync("sips", ["-g", "pixelWidth", file], { encoding: "utf8" }).match(/pixelWidth: (\d+)/)[1]);

mkdirSync(outDir, { recursive: true });
const files = execFileSync("git", ["ls-files", "src/assets/*.webp"], { cwd: root, encoding: "utf8" })
    .split("\n")
    .filter((f) => f && SCREENS.test(basename(f)));

const widths = {};
for (const rel of files) {
    const src = resolve(root, rel);
    const name = basename(rel, ".webp");
    const w = width(src);
    widths[name] = w;
    for (const t of TARGETS.filter((t) => t <= w * 0.8)) {
        const out = resolve(outDir, `${name}-${t}.webp`);
        if (existsSync(out)) continue;
        execFileSync("cwebp", ["-quiet", "-q", "80", "-m", "6", "-resize", String(t), "0", src, "-o", out]);
        console.log(`${name}-${t}.webp`);
    }
}
writeFileSync(resolve(outDir, "widths.json"), JSON.stringify(widths, null, 2) + "\n");
