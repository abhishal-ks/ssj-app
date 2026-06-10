"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NewEntry() {
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [entryId, setEntryId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (!title.trim() && !content.trim()) return;

            setStatus("saving");

            try {
                if (!entryId) {
                    const res = await fetch("/api/entries", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ title, content }),
                    });

                    if (!res.ok) {
                        throw new Error("Unable to create entry");
                    }

                    const data = await res.json();
                    setEntryId(data._id);
                    window.history.replaceState(null, "", `/entry/${data._id}`);
                } else {
                    const res = await fetch(`/api/entries/${entryId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ title, content }),
                    });

                    if (!res.ok) {
                        throw new Error("Unable to save entry");
                    }
                }

                setStatus("saved");
                const reset = setTimeout(() => setStatus("idle"), 2000);
                return () => clearTimeout(reset);
            } catch (err) {
                console.error(err);
                setStatus("error");
            }
        }, 800);

        return () => clearTimeout(timeout);
    }, [title, content, entryId]);

    return (
        <div className="min-h-screen bg-neutral-950 text-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20 backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">New entry</p>
                        <h1 className="mt-1 text-3xl font-semibold">Write something memorable</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-200 transition hover:border-sky-400 hover:text-white">
                            Back to journal
                        </Link>
                        <span className="rounded-2xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950">
                            {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : status === "error" ? "Save failed" : "Drafting"}
                        </span>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-neutral-800 bg-neutral-900/90 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                    <input
                        placeholder="Untitled entry"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border-b border-neutral-800 bg-transparent pb-4 text-4xl font-semibold text-white outline-none placeholder:text-neutral-500 focus:border-sky-400"
                    />

                    <textarea
                        placeholder="Write your thoughts..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-8 h-[60vh] w-full rounded-[1.5rem] border border-neutral-800 bg-neutral-950/80 px-5 py-5 text-sm leading-7 text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10 resize-none"
                    />

                    <div className="mt-5 flex flex-col gap-2 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
                        <p>Autosave is enabled. Keep typing and your draft is saved automatically.</p>
                        <p>{entryId ? `Entry ID: ${entryId}` : "Starting a new draft..."}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
