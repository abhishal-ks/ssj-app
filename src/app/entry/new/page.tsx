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
        <div style={{ padding: "20px" }}>
            <h1>New Entry</h1>

            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />

            <textarea
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                style={{ width: "100%" }}
            />

            <button onClick={handleSave}>Save</button>
        </div>
    );
}