import { useEffect, useState } from "react";

/* True at Tailwind's `md` breakpoint and above. Starts from the real match so
   the first render does not flash the mobile layout on desktop. */
export function useIsDesktop() {
    const [desktop, setDesktop] = useState(() =>
        typeof window === "undefined" ? true : window.matchMedia("(min-width: 768px)").matches,
    );
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 768px)");
        const onChange = () => setDesktop(mq.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);
    return desktop;
}
