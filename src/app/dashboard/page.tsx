"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Sparkles, Plus } from "lucide-react";
import { Card, Button, PageShell, StatusPill, Input } from "@/components/ui";

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
        <PageShell className="py-8 sm:py-10">
            <div className="mx-auto max-w-6xl space-y-8">
                <Card className="overflow-hidden border-0 bg-surface/95 p-0 shadow-[0_28px_70px_rgba(15,23,42,0.08)]">
                    <div className="relative overflow-hidden p-8 sm:p-10">
                        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
                        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                            <div className="max-w-2xl">
                                <p className="text-xs uppercase tracking-[0.35em] text-muted">Journal</p>
                                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">A calm place for your thoughts.</h1>
                                <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                                    Review your recent reflections, search quickly, and add a new entry in a gentle writing experience.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
                                <StatusPill color="accent">
                                    {totalEntries} {totalEntries === 1 ? "entry" : "entries"}
                                </StatusPill>
                                <Link href="/entry/new">
                                    <Button variant="primary" size="lg" className="inline-flex items-center gap-2">
                                        <Plus size={18} />
                                        New entry
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="sticky top-4 z-20 pb-2 pt-2">
                    <Card variant="muted" className="border-0 bg-surface/90 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
                        <label htmlFor="search" className="sr-only">Search entries</label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted">
                                <Search size={16} />
                            </span>
                            <Input
                                id="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search entries..."
                                className="pl-12"
                            />
                        </div>
                    </Card>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((index) => (
                                <Card key={index} className="animate-pulse h-32" />
                            ))}
                        </div>
                    ) : unauthorized ? (
                        <Card className="border-0 bg-accent/10 text-accent shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-background/60">
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <p className="font-semibold">Sign in required</p>
                                    <p className="mt-1 text-sm text-accent/80">
                                        Log in to view your private journal entries. If you don&apos;t have an account yet, register to get started.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link href="/auth/login">
                                    <Button variant="primary">Login</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button variant="secondary">Register</Button>
                                </Link>
                            </div>
                        </Card>
                    ) : error ? (
                        <Card className="border-red-600/50 bg-red-500/10 text-red-500">
                            <p className="font-semibold">Failed to load entries</p>
                            <p className="mt-2 text-sm text-red-500/80">{error}</p>
                        </Card>
                    ) : totalEntries === 0 ? (
                        <Card variant="muted" className="border-0 bg-surface/70 py-12 text-center shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                                <Sparkles size={22} />
                            </div>
                            <p className="mt-6 text-xs uppercase tracking-[0.24em] text-muted">No entries yet</p>
                            <h2 className="mt-3 text-2xl font-semibold text-foreground">Start your first journal entry</h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">Capture thoughts, ideas, and reflections in one place with a calm, distraction-free writing experience.</p>
                            <div className="mt-6 flex justify-center">
                                <Link href="/entry/new">
                                    <Button variant="primary" className="inline-flex items-center gap-2">
                                        <Plus size={18} />
                                        Write your first entry
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ) : visibleEntries.length === 0 ? (
                        <Card variant="muted" className="border-0 bg-surface/70 py-12 text-center shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface/70 text-muted">
                                <Search size={22} />
                            </div>
                            <p className="mt-6 text-xs uppercase tracking-[0.24em] text-muted">No results found</p>
                            <h2 className="mt-3 text-xl font-semibold text-foreground">No entries match &quot;{search}&quot;</h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm text-muted">Try adjusting your search terms or browse all entries to find what you are looking for.</p>
                            <div className="mt-6 flex justify-center">
                                <Button variant="secondary" onClick={() => setSearch("")}>
                                    Clear search
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        sectionOrder.map((section) => {
                            const sectionEntries = groupedEntries[section] || [];
                            if (!sectionEntries.length) return null;

                            return (
                                <section key={section} className="space-y-4">
                                    <div className="flex items-center justify-between gap-4 px-2">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-lg font-semibold text-foreground">{section}</h2>
                                            <span className="h-px w-10 bg-accent/50" />
                                        </div>
                                        <span className="text-xs uppercase tracking-[0.22em] text-muted">
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
                                                    <Card className="group relative h-full cursor-pointer overflow-hidden border-0 bg-surface/75 shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-1.5 hover:bg-surface-strong/85 hover:shadow-[0_20px_44px_rgba(15,23,42,0.08)]">
                                                        <div className="absolute inset-y-0 left-0 w-1.5 bg-accent/70" />
                                                        <div className="ml-3 flex flex-col gap-3">
                                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                                <h3 className="text-lg font-semibold text-foreground transition group-hover:text-accent">{entry.title?.trim() ? entry.title : "Untitled"}</h3>
                                                                <span className="whitespace-nowrap text-xs uppercase tracking-[0.25em] text-muted">{formatIndianDate(createdAt)}</span>
                                                            </div>
                                                            <p className="line-clamp-3 text-sm leading-6 text-muted">{excerpt}</p>
                                                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                                                                <span className="rounded-full bg-surface px-2.5 py-1">✦ {wordCount} words</span>
                                                                <span className="inline-flex items-center gap-2 rounded-full bg-surface px-2.5 py-1">
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                                                                    {formatRelativeDate(createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Card>
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

            {/* FAB */}
            <Link href="/entry/new" className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-background shadow-[0_20px_45px_rgba(0,0,0,0.22)] transition hover:scale-[1.03]" title="New entry">
                <Plus size={22} />
            </Link>
        </PageShell>
    );
}
