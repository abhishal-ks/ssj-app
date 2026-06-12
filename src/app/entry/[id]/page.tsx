"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EntryPage() {
    const { id } = useParams();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

    // Load Entry Data - on mount and when the id changes
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError("");

        fetch(`/api/entries/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Unable to load entry");
                return res.json();
            })
            .then((data) => {
                setTitle(data.title ?? "");
                setContent(data.content ?? "");
            })
            .catch(() => setError("Could not load this entry."))
            .finally(() => setLoading(false));
    }, [id]);

    // Autosave - when title or content changes
    useEffect(() => {
        if (!id) return;
        const timeout = setTimeout(async () => {
            if (!title.trim() && !content.trim()) return;

            setStatus("saving");

            try {
                const res = await fetch(`/api/entries/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ title, content }),
                });

                if (!res.ok) {
                    throw new Error("Unable to save entry");
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
    }, [id, title, content]);

    const handleDelete = async () => {
        const res = await fetch(`/api/entries/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">

                {/* Upper Section */}
                
                <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-lg shadow-black/20 backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Edit entry</p>
                        <h1 className="mt-1 text-3xl font-semibold">Continue your story</h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link href="/dashboard" className="rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-200 transition hover:border-sky-400 hover:text-white">
                            Back to journal
                        </Link>
                        <span className="rounded-2xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950">
                            {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : status === "error" ? "Save failed" : "Live draft"}
                        </span>
                    </div>
                </div>

                {/* Writing Section */}

                <div className="rounded-4xl border border-neutral-800 bg-neutral-900/90 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-10 rounded-2xl bg-neutral-800"></div>
                            <div className="h-[52vh] rounded-3xl bg-neutral-800"></div>
                        </div>
                    ) : error ? (
                        <div className="rounded-3xl border border-red-600 bg-red-950/50 p-6 text-sm text-red-100">
                            {error}
                        </div>
                    ) : (
                        <>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                className="w-full border-b border-neutral-800 bg-transparent pb-4 text-4xl font-semibold text-white outline-none placeholder:text-neutral-500 focus:border-sky-400"
                            />

                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={14}
                                placeholder="Write your thoughts..."
                                className="mt-8 h-[55vh] w-full rounded-3xl border border-neutral-800 bg-neutral-950/80 px-5 py-5 text-sm leading-7 text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10 resize-none"
                            />

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-neutral-400">
                                <p>Live autosave is enabled. Your changes are stored automatically.</p>
                                <button
                                    onClick={handleDelete}
                                    className="rounded-2xl border border-red-600 bg-red-600/10 px-4 py-2 text-sm text-red-200 transition hover:bg-red-600/20"
                                >
                                    Delete entry
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
