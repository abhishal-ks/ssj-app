"use client";

import { useEffect, useState } from "react";

export default function NewEntry() {
    const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
    const [entryId, setEntryId] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // Autosave
    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (!content) return;

            setStatus("saving");

            try {
                // CREATE
                if (!entryId) {
                    const res = await fetch("/api/entries", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ title, content }),
                    });

                    const data = await res.json();
                    setEntryId(data._id);

                    window.history.replaceState(null, "", `/entry/${data._id}`);
                } else {
                    // UPDATE
                    await fetch(`/api/entries/${entryId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ title, content }),
                    });
                }

                setStatus("saved");

                // Optional: revert back to idle after 2s
                setTimeout(() => setStatus("idle"), 2000);

            } catch (err) {
                console.error(err);
                setStatus("idle"); // later we’ll add "error"
            }

        }, 800);

        return () => clearTimeout(timeout);
    }, [title, content, entryId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-neutral-100 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,200,150,0.08),transparent_40%)] pointer-events-none" />

            <div className="w-full max-w-2xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.05)] p-8 space-y-6">

                {/* Title */}
                <input
                    placeholder="Untitled entry..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-3xl font-serif tracking-wide outline-none placeholder-neutral-500 focus:placeholder-neutral-700 transition"
                />

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

                {/* Content */}
                <textarea
                    placeholder="Write your thoughts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[55vh] bg-transparent outline-none text-neutral-300 leading-relaxed tracking-wide placeholder-neutral-600 resize-none"
                />

                {/* Footer */}
                <div className="flex items-center justify-between pt-4">

                    {/* Subtle hint */}
                    <span className="text-xs text-neutral-500 italic transition-opacity duration-300">
                        {status === "saving" && "Saving..."}
                        {status === "saved" && "Saved ✓"}
                        {status === "idle" && "大切な記録 ✨"}
                    </span>
                </div>
            </div>
        </div>
    );
}