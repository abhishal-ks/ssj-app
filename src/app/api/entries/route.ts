import { connectDB } from "@/lib/db";
import { Entry } from "@/lib/models/Entry";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();

    const entries = await Entry.find({ isDeleted: false }).sort({
        createdAt: -1,
    });

    return NextResponse.json(entries);
}

export async function POST(req: Request) {
    await connectDB();

    const body = await req.json();

    const entry = await Entry.create({
        userId: "demo-user", // replace later with auth
        title: body.title,
        content: body.content,
    });

    return NextResponse.json(entry);
}