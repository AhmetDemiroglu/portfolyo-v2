import { useLayoutEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import type { ResolvedShot } from "../data/projects";
import { SCREEN_SIZES, srcSetFor } from "../lib/responsive";

/* One <img> per theme, switched with the site's `dark` class. The hidden one
   has no layout box, so its lazy image is never fetched until it is shown. */
export function ThemedImg({
    src,
    className = "",
    ...rest
}: { src: ResolvedShot } & Omit<ImgHTMLAttributes<HTMLImageElement>, "src">) {
    const sized = (url: string) => ({ src: url, srcSet: srcSetFor(url), sizes: SCREEN_SIZES });
    if (!src.dark) return <img {...sized(src.light)} className={className} {...rest} />;
    return (
        <>
            <img {...sized(src.light)} className={`${className} dark:hidden`} {...rest} />
            <img {...sized(src.dark)} className={`${className} hidden dark:block`} {...rest} />
        </>
    );
}

/* A device screenshot that fills its screen. Until the file arrives the screen
   shows the page's soft surface with a gentle pulse instead of a black void,
   then the image fades in. */
function Layer({ src, alt, themeClass }: { src: string; alt: string; themeClass: string }) {
    const ref = useRef<HTMLImageElement>(null);
    const [loaded, setLoaded] = useState(false);

    /* A cached image can finish before React attaches onLoad. */
    useLayoutEffect(() => {
        const img = ref.current;
        setLoaded(Boolean(img?.complete && img.naturalWidth > 0));
    }, [src]);

    return (
        <div
            className={`relative h-full w-full bg-soft ${themeClass} ${
                loaded ? "" : "animate-pulse motion-reduce:animate-none"
            }`}
        >
            <img
                ref={ref}
                src={src}
                srcSet={srcSetFor(src)}
                sizes={SCREEN_SIZES}
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

export function ScreenImage({ src, alt }: { src: ResolvedShot; alt: string }) {
    if (!src.dark) return <Layer src={src.light} alt={alt} themeClass="" />;
    return (
        <>
            <Layer src={src.light} alt={alt} themeClass="dark:hidden" />
            <Layer src={src.dark} alt={alt} themeClass="hidden dark:block" />
        </>
    );
}
