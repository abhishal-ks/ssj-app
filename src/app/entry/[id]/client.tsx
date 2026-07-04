"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, PenLine, Sparkles, Trash2 } from "lucide-react";
import { Button, Card, Input, PageShell, StatusPill, Textarea, Modal } from "@/components/ui";

export default function EntryClient() {
    const { id } = useParams();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/entries/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/dashboard");
            } else {
                setError("Failed to delete entry");
                setIsDeleting(false);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to delete entry");
            setIsDeleting(false);
        }
    };

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
                                <p className="text-xs uppercase tracking-[0.3em]">Edit entry</p>
                            </div>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Continue your story</h1>
                            <p className="mt-3 text-sm leading-6 text-muted">Auto-saving changes as you type so your draft stays protected.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link href="/dashboard">
                                <Button variant="secondary" className="inline-flex items-center gap-2">
                                    <ArrowLeft size={16} />
                                    Back to journal
                                </Button>
                            </Link>
                            <StatusPill color={getStatusColor()}>
                                {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : status === "error" ? "Save failed" : "Live draft"}
                            </StatusPill>
                        </div>
                    </div>
                </Card>

                <Card className="border-border/60 bg-surface/95 p-7 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-10 rounded-lg bg-surface-strong"></div>
                            <div className="h-[52vh] rounded-lg bg-surface-strong"></div>
                        </div>
                    ) : error ? (
                        <div className="rounded-lg border border-red-600/50 bg-red-500/10 p-6 text-sm text-red-500">
                            {error}
                        </div>
                    ) : (
                        <>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title (optional)"
                                className="border-b border-border bg-transparent pb-4 text-4xl font-semibold text-foreground placeholder:text-muted focus:border-accent"
                            />

                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={14}
                                placeholder="Write your thoughts..."
                                className="mt-8 h-[55vh] rounded-[22px] border-border bg-surface px-5 py-5 text-sm leading-7 text-foreground placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/10"
                            />

                            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/60 p-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                                        <Sparkles size={16} />
                                    </div>
                                    <p>Live autosave is enabled. Your changes are stored automatically.</p>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="inline-flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
                                >
                                    <Trash2 size={16} />
                                    Delete entry
                                </Button>
                            </div>
                        </>
                    )}
                </Card>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete entry?"
                description="This action cannot be undone. Your journal entry will be permanently deleted."
                onConfirm={handleDelete}
                confirmText="Delete permanently"
                cancelText="Cancel"
                isDangerous
                isLoading={isDeleting}
            />
        </PageShell>
    );
}
