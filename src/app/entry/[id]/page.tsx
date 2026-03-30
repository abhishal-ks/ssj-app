"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EntryPage() {
    const { id } = useParams();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch(`/api/entries/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setTitle(data.title);
                setContent(data.content);
            });
    }, [id]);

    // Autosave
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!content) return;

            fetch(`/api/entries/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, content }),
            });
        }, 800); // debounce

        return () => clearTimeout(timeout);
    }, [title, content]);

    const handleUpdate = async () => {
        await fetch(`/api/entries/${id}`, {
            method: "PUT",
            body: JSON.stringify({ title, content }),
        });

        router.push("/dashboard");
    };

    const handleDelete = async () => {
        await fetch(`/api/entries/${id}`, {
            method: "DELETE",
        });

        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-slate-200 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-[#fffdf7]/90 backdrop-blur-md border border-slate-300 rounded-2xl shadow-xl p-8">

                <h1 className="text-3xl font-serif text-slate-800 mb-6 tracking-wide">
                    ✒️ Edit Entry
                </h1>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title..."
                    className="w-full mb-4 px-4 py-2 bg-amber-50/80 border border-slate-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                 focus:border-cyan-400 transition
                 text-slate-800 placeholder-slate-400 font-medium"
                />

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    placeholder="Write your thoughts..."
                    className="w-full mb-6 px-4 py-3 bg-amber-50/80 border border-slate-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                 focus:border-cyan-400 transition
                 text-slate-800 placeholder-slate-400 leading-relaxed resize-none font-serif"
                />

                <div className="flex gap-3">
                    <button
                        onClick={handleUpdate}
                        className="px-5 py-2 bg-slate-800 text-amber-50 rounded-lg 
                   hover:bg-slate-900 transition shadow-md
                   hover:shadow-cyan-400/30"
                    >
                        Save Changes
                    </button>

                    <button
                        onClick={handleDelete}
                        className="px-5 py-2 bg-red-100 text-red-700 rounded-lg 
                   hover:bg-red-200 transition border border-red-200"
                    >
                        Delete
                    </button>
                </div>

            </div>
        </div>
    );
}