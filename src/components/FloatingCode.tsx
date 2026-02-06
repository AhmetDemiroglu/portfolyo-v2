import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
    const [snippets, setSnippets] = useState<FloatingSnippet[]>([]);

    useEffect(() => {
        const generated: FloatingSnippet[] = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
            x: (i % 30) * 3.3 + Math.random() * 2,
            delay: (i % 20) * 0.8,
            duration: 18 + Math.random() * 12,
        }));
        setSnippets(generated);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
            {snippets.map((snippet) => (
                <motion.div
                    key={snippet.id}
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: "105vh", opacity: [0, 0.5, 0.5, 0] }}
                    transition={{
                        duration: snippet.duration,
                        delay: snippet.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{ left: `${snippet.x}%`, position: "absolute" }}
                    className="font-mono text-[11px] tracking-wider text-sky-400/15 dark:text-sky-300/15"
                >
                    {snippet.text}
                </motion.div>
            ))}
        </div>
    );
}