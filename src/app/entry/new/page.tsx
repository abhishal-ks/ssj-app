"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEntry() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const router = useRouter();

    const handleSave = async () => {
        await fetch("/api/entries", {
            method: "POST",
            body: JSON.stringify({ title, content }),
        });

        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6">
            <div className="max-w-2xl mx-auto space-y-4">
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-2xl outline-none placeholder-neutral-500"
                />

                <textarea
                    placeholder="Write your thoughts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[60vh] bg-transparent outline-none text-neutral-300 placeholder-neutral-600"
                />

                <button
                    onClick={handleSave}
                    className="bg-white text-black px-4 py-2 rounded-lg"
                >
                    Save
                </button>
            </div>
        </div>
    );
}