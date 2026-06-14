import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: user._id.toString(),
    username: user.username,
    name: user.name ?? null,
  });
}
