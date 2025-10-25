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

export function FloatingCode() {
    const [snippets, setSnippets] = useState<Array<{ id: number; text: string; x: number; delay: number }>>([]);

    useEffect(() => {
        const generated = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
            x: (i % 50) * 2 + Math.random() * 2,
            delay: (i % 30) * 0.5,
        }));
        setSnippets(generated);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
            {snippets.map((snippet) => (
                <motion.div
                    key={snippet.id}
                    initial={{ y: -50 }}
                    animate={{ y: "100vh" }}
                    transition={{
                        duration: 12 + Math.random() * 6,
                        delay: snippet.delay,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 0,
                    }}
                    style={{
                        left: `${snippet.x}%`,
                        position: "absolute",
                    }}
                    className="text-sky-400/20 dark:text-sky-300/20 font-mono text-sm md:text-base font-light whitespace-nowrap"
                >
                    {snippet.text}
                </motion.div>
            ))}
        </div>
    );
}
