import { useLayoutEffect, useRef, useState } from "react";

interface ScreenImageProps {
    src: string;
    alt: string;
}

/* A device screenshot that fills its screen. The above-the-fold one on the
   projects page is also preloaded from the prerendered head (desktop only). Until the file arrives the screen
   shows the page's soft surface with a gentle pulse instead of a black void,
   then the image fades in. */
export function ScreenImage({ src, alt }: ScreenImageProps) {
    const ref = useRef<HTMLImageElement>(null);
    const [loaded, setLoaded] = useState(false);

    /* A cached image can finish before React attaches onLoad. */
    useLayoutEffect(() => {
        const img = ref.current;
        setLoaded(Boolean(img?.complete && img.naturalWidth > 0));
    }, [src]);

    return (
        <div className={`relative h-full w-full bg-soft ${loaded ? "" : "animate-pulse motion-reduce:animate-none"}`}>
            <img
                ref={ref}
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={`h-full w-full object-cover object-top transition-opacity duration-300 ${
                    loaded ? "opacity-100" : "opacity-0"
                }`}
            />
        </div>
    );
}
