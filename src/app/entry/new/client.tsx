"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, PenLine, Sparkles } from "lucide-react";
import { Button, Card, Input, PageShell, StatusPill, Textarea } from "@/components/ui";

export default function NewEntryClient() {
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

    const getStatusColor = (): "accent" | "success" | "error" | "warning" | "muted" => {
        if (status === "saved") return "success";
        if (status === "error") return "error";
        if (status === "saving") return "warning";
        return "muted";
    };

    return (
        <PageShell className="py-8 sm:py-10">
            <div className="mx-auto max-w-5xl space-y-6">
                {/* Header Card */}
                <Card className="space-y-4 border-border/60 bg-surface/95 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-accent">
                                <PenLine size={18} />
                                <p className="text-xs uppercase tracking-[0.3em]">New entry</p>
                            </div>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Write something memorable</h1>
                            <p className="mt-3 text-sm leading-6 text-muted">Your draft saves automatically while you type, so you can focus on the flow.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link href="/dashboard">
                                <Button variant="secondary" className="inline-flex items-center gap-2">
                                    <ArrowLeft size={16} />
                                    Back to journal
                                </Button>
                            </Link>
                            <StatusPill color={getStatusColor()}>
                                {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : status === "error" ? "Save failed" : "Drafting"}
                            </StatusPill>
                        </div>
                    </div>
                </Card>

                <Card className="border-border/60 bg-surface/95 p-7 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                    <Input
                        placeholder="Untitled entry"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border-b border-border bg-transparent pb-4 text-4xl font-semibold text-foreground placeholder:text-muted focus:border-accent"
                    />

                    <Textarea
                        placeholder="Write your thoughts..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={14}
                        className="mt-8 h-[60vh] rounded-[22px] border-border bg-surface px-5 py-5 text-sm leading-7 text-foreground placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/10"
                    />

                    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-background/60 p-4 text-sm text-muted">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                            <Sparkles size={16} />
                        </div>
                        <p>Autosave is enabled. Keep typing and your draft is saved automatically.</p>
                    </div>
                </Card>
            </div>
        </PageShell>
    );
}
