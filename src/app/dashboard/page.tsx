"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        fetch("/api/entries")
            .then((res) => res.json())
            .then((data) => setEntries(data));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Your Journal</h1>

            <Link href="/entry/new">
                <button>+ New Entry</button>
            </Link>

            <div style={{ marginTop: "20px" }}>
                {entries.map((entry: any) => (
                    <div
                        key={entry._id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            marginBottom: "10px",
                        }}
                    >
                        <Link href={`/entry/${entry._id}`}>
                            <h3>{entry.title || "Untitled"}</h3>
                        </Link>
                        <p>{entry.content.slice(0, 100)}...</p>
                    </div>
                ))}
            </div>
        </div>
    );
}