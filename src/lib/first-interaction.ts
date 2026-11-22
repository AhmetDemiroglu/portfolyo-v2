/* The visitor's first scroll, touch, click, key press or mouse move. Work that
   does not help the first paint (the analytics script, the Leaflet map, the
   endlessly looping scenery animations) waits for it, so it never competes with
   the page's own code and text while they load.

   Also sets `html.interacted`, which index.css uses to start the looping
   animations. */

const EVENTS = ["pointerdown", "pointermove", "touchstart", "keydown", "wheel", "scroll"] as const;

let fired = false;
const callbacks: Array<() => void> = [];

function fire() {
    if (fired) return;
    fired = true;
    for (const name of EVENTS) window.removeEventListener(name, fire, true);
    document.documentElement.classList.add("interacted");
    for (const cb of callbacks.splice(0)) cb();
}

if (typeof window !== "undefined") {
    for (const name of EVENTS) {
        window.addEventListener(name, fire, { capture: true, passive: true });
    }
}

export function hasInteracted(): boolean {
    return fired;
}

/* Runs `cb` on the first interaction, or right away if it already happened. */
export function onFirstInteraction(cb: () => void): () => void {
    if (fired) {
        cb();
        return () => {};
    }
    callbacks.push(cb);
    return () => {
        const i = callbacks.indexOf(cb);
        if (i !== -1) callbacks.splice(i, 1);
    };
}
