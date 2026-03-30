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
        <div className="min-h-screen bg-neutral-950 text-white p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Journal</h1>

                    <Link href="/entry/new">
                        <button className="bg-white text-black px-4 py-2 rounded-lg hover:opacity-80">
                            + New
                        </button>
                    </Link>
                </div>

                {/* Entries */}
                <div className="flex flex-col space-y-1">
                    {entries.map((entry: any) => (
                        <Link key={entry._id} href={`/entry/${entry._id}`}>
                            <div className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition cursor-pointer">
                                <h3 className="font-medium text-lg">
                                    {entry.title || "Untitled"}
                                </h3>
                                <p className="text-sm text-neutral-400 mt-1 line-clamp-2">
                                    {entry.content}
                                </p>
                                <p className="text-xs text-neutral-600 mt-1">
                                    {entry.createdAt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}