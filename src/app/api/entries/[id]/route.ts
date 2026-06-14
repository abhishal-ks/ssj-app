import { connectDB } from "@/lib/db";
import { Entry } from "@/lib/models/Entry";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();
    const userId = await getCurrentUserId(req);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const entry = await Entry.findOne({ _id: id, userId, isDeleted: false });

    if (!entry) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(entry);
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();
    const userId = await getCurrentUserId(req);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await Entry.findOneAndUpdate(
        { _id: id, userId, isDeleted: false },
        {
            title: body.title,
            content: body.content,
        },
        { returnDocument: "after" }
    );

    if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();
    const userId = await getCurrentUserId(req);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const deleted = await Entry.findOneAndUpdate(
        { _id: id, userId, isDeleted: false },
        { isDeleted: true }
    );

    if (!deleted) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted" });
}