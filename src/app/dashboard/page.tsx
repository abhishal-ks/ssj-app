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

    useEffect(() => {
        fetch("/api/entries")
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => setEntries(data))
            .catch(() => setError("Unable to load entries. Please try again."))
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
        <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-6">
            <div className="max-w-3xl mx-auto">

                {/* Upper section */}

                <div className="sticky top-0 z-20 backdrop-blur-xl bg-neutral-950/95 border-b border-neutral-800 pb-4 pt-4">

                    {/* Top bar */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                                Journal
                            </p>
                            <div className="mt-1 flex items-center gap-3">
                                <h1 className="text-3xl font-semibold">SSJ</h1>
                                <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs text-neutral-400">
                                    {totalEntries} {totalEntries === 1 ? "entry" : "entries"}
                                </span>
                            </div>
                        </div>

                        <Link href="/entry/new" className="shrink-0">
                            <button className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-sm transition hover:scale-[1.02] sm:px-4 sm:py-2">
                                + New entry
                            </button>
                        </Link>
                    </div>

                    {/* Search bar */}

                    <div className="mt-5">
                        <label htmlFor="search" className="sr-only">
                            Search entries
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-500">
                                🔍
                            </span>
                            <input
                                id="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search entries..."
                                className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/90 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-white focus:ring-2 focus:ring-white/10"
                            />
                        </div>
                    </div>
                </div>

                {/* Past journal entries */}

                <div className="mt-6 space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((index) => (
                                <div
                                    key={index}
                                    className="animate-pulse rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5"
                                >
                                    <div className="h-6 w-1/3 rounded-full bg-neutral-800"></div>
                                    <div className="mt-4 h-4 w-5/6 rounded-full bg-neutral-800"></div>
                                    <div className="mt-3 h-4 w-full rounded-full bg-neutral-800"></div>
                                    <div className="mt-3 h-4 w-4/6 rounded-full bg-neutral-800"></div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="rounded-3xl border border-red-600 bg-red-950/40 p-6 text-red-100">
                            <p className="text-sm font-semibold">Failed to load entries</p>
                            <p className="mt-2 text-sm text-red-200">{error}</p>
                        </div>
                    ) : visibleEntries.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-neutral-800 bg-neutral-900/80 p-10 text-center">
                            <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">
                                No entries yet
                            </p>
                            <h2 className="mt-4 text-2xl font-semibold">
                                Start your first journal entry
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-neutral-400">
                                Capture thoughts, ideas, and reflections in one place.
                            </p>
                            <Link href="/entry/new" className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]">
                                Write your first entry
                            </Link>
                        </div>
                    ) : (

                        // The Entries
                        
                        sectionOrder.map((section) => {
                            const sectionEntries = groupedEntries[section] || [];
                            if (!sectionEntries.length) return null;

                            return (
                                <section key={section} className="space-y-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <h2 className="text-lg font-semibold text-white">
                                            {section}
                                        </h2>
                                        <span className="text-xs uppercase tracking-[0.22em] text-neutral-500">
                                            {sectionEntries.length} {sectionEntries.length === 1 ? "entry" : "entries"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {sectionEntries.map((entry) => {
                                            const createdAt = new Date(entry.createdAt);
                                            const excerpt = entry.content.length > 120 ? `${entry.content.slice(0, 120).trim()}...` : entry.content;
                                            const wordCount = getWordCount(entry.content);

                                            return (
                                                <Link key={entry._id} href={`/entry/${entry._id}`}>
                                                    <div className="group cursor-pointer overflow-hidden rounded-3xl border border-transparent bg-neutral-900 p-5 transition duration-150 hover:border-neutral-700 hover:bg-neutral-800 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.05)] hover:scale-[1.01]">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                                <h3 className="text-xl font-semibold text-white">
                                                                    {entry.title?.trim() ? entry.title : "Untitled"}
                                                                </h3>
                                                                <span className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                                                                    {formatIndianDate(createdAt)}
                                                                </span>
                                                            </div>
                                                            <p className="line-clamp-3 text-sm leading-6 text-neutral-300">
                                                                {excerpt}
                                                            </p>
                                                            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                                                                <span>✦ {wordCount} words</span>
                                                                <span className="inline-flex items-center gap-2">
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-600"></span>
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

            <Link href="/entry/new" className="fixed bottom-5 right-5 z-30 rounded-full bg-white p-4 text-black shadow-xl transition hover:scale-[1.03] sm:hidden">
                +
            </Link>
        </div>
    );
}
