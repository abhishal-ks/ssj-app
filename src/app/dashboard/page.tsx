"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type EntryData = {
    _id: string;
    title?: string;
    content: string;
    createdAt: string;
};

function formatIndianDate(date: Date) {
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatRelativeDate(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) {
        return "Just now";
    }
    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}m ago`;
    }
    if (seconds < 86400) {
        return `${Math.floor(seconds / 3600)}h ago`;
    }
    if (seconds < 172800) {
        return "Yesterday";
    }
    if (seconds < 604800) {
        return `${Math.floor(seconds / 86400)} days ago`;
    }

    return formatIndianDate(date);
}

function getSectionLabel(date: Date) {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

    if (diffDays === 0) {
        return "Today";
    }
    if (diffDays === 1) {
        return "Yesterday";
    }
    if (diffDays < 7) {
        return "Last 7 days";
    }

    return "Earlier";
}

function getWordCount(text: string) {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function Dashboard() {
    const [entries, setEntries] = useState<EntryData[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [unauthorized, setUnauthorized] = useState(false);

    useEffect(() => {
        let isUnauthorized = false;

        fetch("/api/entries")
            .then(async (res) => {
                if (res.status === 401) {
                    isUnauthorized = true;
                    setUnauthorized(true);
                    throw new Error("Unauthorized");
                }
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => setEntries(data))
            .catch(() => {
                if (!isUnauthorized) {
                    setError("Unable to load entries. Please try again.");
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const visibleEntries = useMemo(() => {
        if (!search.trim()) return entries;

        const query = search.toLowerCase();
        return entries.filter((entry) => {
            const title = entry.title?.toLowerCase() ?? "";
            const content = entry.content.toLowerCase();
            return title.includes(query) || content.includes(query);
        });
    }, [entries, search]);

    const groupedEntries = useMemo(() => {
        return visibleEntries.reduce<Record<string, EntryData[]>>((groups, entry) => {
            const date = new Date(entry.createdAt);
            const section = getSectionLabel(date);
            if (!groups[section]) {
                groups[section] = [];
            }
            groups[section].push(entry);
            return groups;
        }, {});
    }, [visibleEntries]);

    const sectionOrder = ["Today", "Yesterday", "Last 7 days", "Earlier"];
    const totalEntries = entries.length;

    return (
        <div className="min-h-screen bg-neutral-950 text-white px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8 rounded-4xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Journal</p>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-4xl font-semibold tracking-tight">SSJ</h1>
                                <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs text-neutral-400">
                                    {totalEntries} {totalEntries === 1 ? "entry" : "entries"}
                                </span>
                            </div>
                        </div>
                        <Link href="/entry/new" className="inline-flex items-center justify-center rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:scale-[1.01]">
                            + New entry
                        </Link>
                    </div>
                    <p className="mt-4 max-w-2xl text-sm text-neutral-400">
                        A focused journaling workspace with fast search, clean previews, and quick entry flow.
                    </p>
                </header>

                <div className="sticky top-4 z-10 mb-6 rounded-4xl border border-neutral-800 bg-neutral-950/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                    <label htmlFor="search" className="sr-only">Search entries</label>
                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-500">🔍</span>
                        <input
                            id="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search entries..."
                            className="w-full rounded-3xl border border-neutral-800 bg-neutral-900/90 py-4 pl-14 pr-4 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((index) => (
                                <div key={index} className="animate-pulse rounded-4xl border border-neutral-800 bg-neutral-900/80 p-6" />
                            ))}
                        </div>
                    ) : unauthorized ? (
                        <div className="rounded-4xl border border-sky-500/30 bg-sky-950/20 p-6 text-sky-100">
                            <p className="text-sm font-semibold text-sky-200">Sign in required</p>
                            <p className="mt-2 text-sm text-sky-100">
                                Log in to view your private journal entries. If you don&apos;t have an account yet, register to get started.
                            </p>
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                <Link href="/auth/login" className="rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
                                    Login
                                </Link>
                                <Link href="/auth/register" className="rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-3 text-sm text-white transition hover:border-sky-400">
                                    Register
                                </Link>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="rounded-4xl border border-red-600 bg-red-950/40 p-6 text-red-100">
                            <p className="text-sm font-semibold">Failed to load entries</p>
                            <p className="mt-2 text-sm text-red-200">{error}</p>
                        </div>
                    ) : visibleEntries.length === 0 ? (
                        <div className="rounded-4xl border border-dashed border-neutral-800 bg-neutral-900/80 p-10 text-center">
                            <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">No entries yet</p>
                            <h2 className="mt-4 text-2xl font-semibold">Start your first journal entry</h2>
                            <p className="mt-3 text-sm leading-6 text-neutral-400">Capture thoughts, ideas, and reflections in one place.</p>
                            <Link href="/entry/new" className="mt-6 inline-flex rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]">
                                Write your first entry
                            </Link>
                        </div>
                    ) : (
                        sectionOrder.map((section) => {
                            const sectionEntries = groupedEntries[section] || [];
                            if (!sectionEntries.length) return null;

                            return (
                                <section key={section} className="space-y-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <h2 className="text-lg font-semibold text-white">{section}</h2>
                                        <span className="text-xs uppercase tracking-[0.22em] text-neutral-500">
                                            {sectionEntries.length} {sectionEntries.length === 1 ? "entry" : "entries"}
                                        </span>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {sectionEntries.map((entry) => {
                                            const createdAt = new Date(entry.createdAt);
                                            const excerpt = entry.content.length > 120 ? `${entry.content.slice(0, 120).trim()}...` : entry.content;
                                            const wordCount = getWordCount(entry.content);

                                            return (
                                                <Link key={entry._id} href={`/entry/${entry._id}`}>
                                                    <div className="group overflow-hidden rounded-[1.75rem] border border-transparent bg-neutral-900 p-5 transition duration-150 hover:border-neutral-700 hover:bg-neutral-800 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
                                                        <div className="flex flex-col gap-3">
                                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                                <h3 className="text-xl font-semibold text-white">{entry.title?.trim() ? entry.title : "Untitled"}</h3>
                                                                <span className="text-xs uppercase tracking-[0.25em] text-neutral-500">{formatIndianDate(createdAt)}</span>
                                                            </div>
                                                            <p className="line-clamp-3 text-sm leading-6 text-neutral-300">{excerpt}</p>
                                                            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                                                                <span>✦ {wordCount} words</span>
                                                                <span className="inline-flex items-center gap-2">
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
                                                                    {formatRelativeDate(createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </section>
                            );
                        })
                    )}
                </div>
            </div>

            <Link href="/entry/new" className="fixed bottom-5 right-5 z-30 rounded-full bg-sky-400 p-4 text-slate-950 shadow-xl shadow-sky-500/30 transition hover:scale-[1.03] sm:hidden">
                +
            </Link>
        </div>
    );
}
