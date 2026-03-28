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
        <div style={{ padding: "20px" }}>
            <h1>Edit Entry</h1>

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                style={{ width: "100%" }}
            />

            <button onClick={handleUpdate}>Update</button>
            <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
                Delete
            </button>
        </div>
    );
}