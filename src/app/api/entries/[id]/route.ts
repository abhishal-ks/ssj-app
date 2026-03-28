import { connectDB } from "@/lib/db";
import { Entry } from "@/lib/models/Entry";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: any) {
    await connectDB();

    const entry = await Entry.findById(params.id);

    return NextResponse.json(entry);
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }

) {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const updated = await Entry.findByIdAndUpdate(
        id,
        {
            title: body.title,
            content: body.content,
        },
        { returnDocument: "after" }
    );

    if (!updated) {
        return Response.json(
            { error: "Not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(updated);
}

export async function DELETE(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await params;

    const deleted = await Entry.findByIdAndUpdate(id, {
        isDeleted: true,
    });

    if (!deleted) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted" });
}