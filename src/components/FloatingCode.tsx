import { useMemo } from "react";

const CODE_SNIPPETS = [
    "const data = ref([])",
    "import { useState }",
    "public async Task",
    ".then(res => data)",
    "builder.Services",
    'v-model="form"',
    "<script setup>",
    "useEffect(() => {",
    'className="flex"',
    'api.get("/users")',
    "<template>",
    "return { data }",
    "app.UseRouting()",
    "const [state, setState]",
    "async/await",
    "npm install",
    "git commit -m",
    "interface Props",
    "export default",
    "function handle()",
    '@click="submit"',
    "let result =",
    "try { ... }",
    "catch (err)",
    "finally { }",
];

interface FloatingSnippet {
    id: number;
    text: string;
    x: number;
    delay: number;
    duration: number;
}

export function FloatingCode() {
    const snippets = useMemo<FloatingSnippet[]>(
        () =>
            Array.from({ length: 20 }, (_, i) => ({
                id: i,
                text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
                x: (i % 20) * 5 + Math.random() * 2,
                delay: Math.random() * 8,
                duration: 20 + Math.random() * 15,
            })),
        [],
    );

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
            {snippets.map((snippet) => (
                <div
                    key={snippet.id}
                    className="absolute font-mono text-[11px] tracking-wider text-sky-400/15 dark:text-sky-300/15 animate-float-down"
                    style={{
                        left: `${snippet.x}%`,
                        animationDuration: `${snippet.duration}s`,
                        animationDelay: `${snippet.delay}s`,
                    }}
                >
                    {snippet.text}
                </div>
            ))}
        </div>
    );
}
