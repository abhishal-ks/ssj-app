import { connectDB } from "@/lib/db";
import { Entry } from "@/lib/models/Entry";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await connectDB();
    const userId = await getCurrentUserId(req);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await Entry.find({ userId, isDeleted: false }).sort({
        createdAt: -1,
    });

    return NextResponse.json(entries);
}

export async function POST(req: Request) {
    await connectDB();

    const userId = await getCurrentUserId(req);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const entry = await Entry.create({
        userId,
        title: body.title,
        content: body.content,
    });

    return NextResponse.json(entry);
}