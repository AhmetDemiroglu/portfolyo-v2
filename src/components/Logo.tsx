export function Logo() {
    return (
        <span className="group inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink font-display text-sm font-bold text-paper transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                AD
            </span>
            <span className="hidden font-mono text-sm tracking-tight text-ink sm:block">
                ahmetdemiroglu<span className="text-accent">.dev</span>
            </span>
        </span>
    );
}
