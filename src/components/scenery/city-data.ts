/* Geometry and schedule for the scroll-built city (docs/MOTION_SPEC.md 12).

   Every building keeps the exact top profile of the old single-path skylines
   (so scroll 0 looks the same) and is drawn at its finished height inside a
   viewBox twice as tall as before. It starts translated down by `extra` px and
   rises during its slot [start, start + RISE]. Slots come from one queue with
   three lanes, ordered edges first, centre last, lightly shuffled.

   Windows are paths, not rects: one dim grid path per building (static part
   of the building) and one path per lit group. Each lit group carries its own
   night threshold `thr`: it is lit while `--day` is below it. */

export const RISE = 0.045; // rise duration, both layers
export const LINE_LEAD = 0.05; // the outline starts drawing this long before the slot
export const LINE_DUR = 0.04;
export const QUEUE_START = 0.15;

export interface LitGroup {
    d: string;
    thr: number;
    /* Lights up this long after the building has finished rising. */
    delay: number;
}

export interface Building {
    /* Top edge, left to right, in finished coordinates (viewBox units). */
    profile: Array<[number, number]>;
    x0: number;
    x1: number;
    /* Rise distance in px (1px = 1 viewBox unit inside the SVG). */
    extra: number;
    /* Slot start in progress units (rise runs start .. start + RISE). */
    start: number;
    /* Dim window grid, one path. */
    grid: string;
    lit: LitGroup[];
    /* Houses the crane (mid layer only). */
    crane?: boolean;
}

export interface Layer {
    width: number;
    /* Finished viewBox height; the old height was exactly half of this. */
    height: number;
    buildings: Building[];
}

/* Deterministic pseudo-random in [0, 1) so builds are stable between renders. */
const noise = (i: number) => {
    const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
};

type Seg = { x0: number; x1: number; top: number; detail?: Array<[number, number]> };

interface Pending {
    layer: "near" | "mid";
    index: number;
    seg: Seg;
    profile: Array<[number, number]>;
    extra: number;
    finalTop: number;
    sortKey: number;
}

const CELL_W = 5;
const CELL_H = 7;

/* Window grid: 22 x 20 unit steps, 12-unit margins, and it stops 120 units
   above the baseline so the street level and the ground fade stay empty. */
const COL_STEP = 22;
const ROW_STEP = 20;
const MARGIN = 12;
const GROUND = 120;

function cellsFor(b: { x0: number; x1: number; finalTop: number }, baseline: number) {
    const cells: Array<[number, number]> = [];
    for (let x = b.x0 + MARGIN; x + CELL_W <= b.x1 - MARGIN; x += COL_STEP) {
        for (let y = b.finalTop + MARGIN; y + CELL_H <= baseline - GROUND; y += ROW_STEP) {
            cells.push([x, y]);
        }
    }
    return cells;
}

const cellPath = (cells: Array<[number, number]>) =>
    cells.map(([x, y]) => `M${x} ${y}h${CELL_W}v${CELL_H}h-${CELL_W}z`).join("");

function prepare(segs: Seg[], oldHeight: number, factor: [number, number], layer: "near" | "mid", seed: number): Pending[] {
    const shift = oldHeight;
    return segs.map((s, i) => {
        const hNow = oldHeight - s.top;
        const f = factor[0] + (factor[1] - factor[0]) * noise(seed + i);
        const extra = Math.round(hNow * (f - 1));
        const finalTop = s.top + shift - extra;
        const profile: Array<[number, number]> = s.detail
            ? s.detail.map(([x, y]) => [x, y + shift - extra])
            : [
                  [s.x0, finalTop],
                  [s.x1, finalTop],
              ];
        const centre = (s.x0 + s.x1) / 2;
        /* Edges first: larger distance from the centre sorts earlier. Jitter of
           up to 120 units keeps it from being a strict wave. */
        const sortKey = Math.abs(centre - 720) + (noise(seed * 13 + i) - 0.5) * 240;
        return { layer, index: i, seg: s, profile, extra, finalTop, sortKey };
    });
}

/* One queue, three lanes, greedy: each building takes the lane that frees up first. */
function schedule(items: Pending[]): Map<Pending, number> {
    const order = [...items].sort((a, b) => b.sortKey - a.sortKey);
    const lanes = [QUEUE_START, QUEUE_START, QUEUE_START];
    const out = new Map<Pending, number>();
    for (const it of order) {
        let lane = 0;
        for (let k = 1; k < lanes.length; k++) if (lanes[k] < lanes[lane]) lane = k;
        const start = lanes[lane];
        out.set(it, Number(start.toFixed(4)));
        lanes[lane] = start + RISE;
    }
    return out;
}

function finish(
    items: Pending[],
    starts: Map<Pending, number>,
    baseline: number,
    groups: number,
    seed: number,
    craneAt?: number,
): Building[] {
    return items.map((it) => {
        const b = { x0: it.seg.x0, x1: it.seg.x1, finalTop: it.finalTop };
        const cells = cellsFor(b, baseline);
        const lit: LitGroup[] = [];
        const n = cells.length >= 12 ? groups : cells.length >= 4 ? 1 : 0;
        for (let g = 0; g < n; g++) {
            /* Each group takes 12..22% of the cells as a cluster of neighbouring
               cells: pick a start, then walk forward with some gaps. */
            const share = 0.12 + 0.1 * noise(seed * 31 + it.index * 7 + g);
            const want = Math.max(2, Math.round(cells.length * share));
            const startIdx = Math.floor(noise(seed * 37 + it.index * 11 + g) * Math.max(1, cells.length - want));
            const picked: Array<[number, number]> = [];
            for (let k = startIdx; k < cells.length && picked.length < want; k++) {
                if (noise(seed * 41 + it.index * 5 + g * 3 + k) < 0.8) picked.push(cells[k]);
            }
            if (picked.length === 0) continue;
            lit.push({
                d: cellPath(picked),
                thr: Number((0.2 + 0.5 * noise(seed * 43 + it.index * 17 + g)).toFixed(3)),
                delay: Number((g * 0.02).toFixed(3)),
            });
        }
        return {
            profile: it.profile,
            x0: it.seg.x0,
            x1: it.seg.x1,
            extra: it.extra,
            start: starts.get(it)!,
            grid: cellPath(cells),
            lit,
            crane: craneAt !== undefined && it.seg.x0 === craneAt,
        };
    });
}

const NEAR_SEGS: Seg[] = [
    { x0: 0, x1: 88, top: 120 },
    { x0: 88, x1: 150, top: 66 },
    { x0: 150, x1: 240, top: 130 },
    { x0: 240, x1: 330, top: 90 },
    { x0: 330, x1: 420, top: 150 },
    { x0: 420, x1: 500, top: 56 },
    { x0: 500, x1: 590, top: 124 },
    { x0: 590, x1: 680, top: 96 },
    { x0: 680, x1: 770, top: 158 },
    { x0: 770, x1: 856, top: 70 },
    { x0: 856, x1: 948, top: 134 },
    { x0: 948, x1: 1040, top: 104 },
    { x0: 1040, x1: 1130, top: 162 },
    { x0: 1130, x1: 1216, top: 60 },
    { x0: 1216, x1: 1306, top: 128 },
    { x0: 1306, x1: 1440, top: 92 },
];

const MID_SEGS: Seg[] = [
    { x0: 0, x1: 70, top: 170 },
    { x0: 70, x1: 130, top: 120 },
    { x0: 130, x1: 196, top: 200 },
    {
        x0: 196,
        x1: 260,
        top: 92,
        detail: [
            [196, 92],
            [210, 92],
            [210, 78],
            [246, 78],
            [246, 92],
            [260, 92],
        ],
    },
    { x0: 260, x1: 330, top: 176 },
    { x0: 330, x1: 396, top: 140 },
    { x0: 396, x1: 470, top: 214 },
    { x0: 470, x1: 540, top: 100 },
    { x0: 540, x1: 600, top: 188 },
    { x0: 600, x1: 668, top: 150 },
    { x0: 668, x1: 740, top: 220 },
    { x0: 740, x1: 808, top: 124 },
    { x0: 808, x1: 880, top: 196 },
    {
        x0: 880,
        x1: 932,
        top: 84,
        detail: [
            [880, 84],
            [900, 84],
            [900, 64],
            [912, 64],
            [912, 84],
            [932, 84],
        ],
    },
    { x0: 932, x1: 1080, top: 168 },
    { x0: 1080, x1: 1158, top: 210 },
    { x0: 1158, x1: 1226, top: 116 },
    { x0: 1226, x1: 1296, top: 184 },
    { x0: 1296, x1: 1366, top: 142 },
    { x0: 1366, x1: 1440, top: 206 },
];

const nearPending = prepare(NEAR_SEGS, 260, [1.6, 2.1], "near", 1);
const midPending = prepare(MID_SEGS, 320, [1.4, 1.6], "mid", 2);
const starts = schedule([...nearPending, ...midPending]);

/* Near layer: old viewBox 1440x260, 16 buildings, 2 lit groups each. */
export const NEAR: Layer = { width: 1440, height: 520, buildings: finish(nearPending, starts, 520, 2, 1) };

/* Mid layer: old viewBox 1440x320, 20 buildings, crane on the 932..1080 block. */
export const MID: Layer = { width: 1440, height: 640, buildings: finish(midPending, starts, 640, 1, 2, 932) };

/* The eight windows that were lit at scroll 0 (old mid coordinates, +320), one path. */
export const MID_STATIC_WINDOWS = (
    [
        [212, 420],
        [228, 438],
        [482, 440],
        [506, 462],
        [754, 462],
        [778, 484],
        [1172, 454],
        [1196, 476],
    ] as Array<[number, number]>
)
    .map(([x, y]) => `M${x} ${y}h6v8h-6z`)
    .join("");

/* When the last building has finished rising. */
export const BUILD_END = Math.max(...[...NEAR.buildings, ...MID.buildings].map((b) => b.start + RISE));

/* Far layer: old viewBox 1440x280, one path that rises as a group by 35%. */
export const FAR = {
    width: 1440,
    height: 560,
    extra: 42,
    start: 0.15,
    dur: 0.2,
    d: "M0 560 L0 428 L48 428 L48 390 L96 390 L96 416 L150 416 L150 370 L208 370 L208 408 L262 408 L262 386 L320 386 L320 426 L378 426 L378 358 L430 358 L430 402 L494 402 L494 380 L552 380 L552 422 L614 422 L614 346 L640 346 L640 334 L652 334 L652 346 L678 346 L678 406 L742 406 L742 378 L806 378 L806 416 L868 416 L868 362 L926 362 L926 398 L992 398 L992 380 L1052 380 L1052 424 L1116 424 L1116 350 L1174 350 L1174 396 L1238 396 L1238 372 L1300 372 L1300 414 L1364 414 L1364 388 L1404 388 L1404 426 L1440 426 L1440 560 Z",
};

/* Path for one building: its finished top profile closed down to the baseline. */
export function buildingPath(b: Building, baseline: number): string {
    /* Neighbours overlap by 1 unit so no hairline seam shows while they move. */
    const right = b.x1 < 1440 ? b.x1 + 1 : b.x1;
    const top = b.profile
        .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x === b.x1 ? right : x} ${y}`)
        .join(" ");
    return `${top} L${right} ${baseline} L${b.x0} ${baseline} Z`;
}

/* Closed outline of the finished building, drawn from the bottom-left corner
   clockwise: up the left wall, across the top profile, down the right wall. */
export function outlinePath(b: Building, baseline: number): string {
    const top = b.profile.map(([x, y]) => `L${x} ${y}`).join(" ");
    return `M${b.x0} ${baseline} ${top} L${b.x1} ${baseline} Z`;
}
