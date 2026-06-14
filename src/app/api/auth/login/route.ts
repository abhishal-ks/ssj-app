import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { createSession, hashPassword, sessionCookieOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const username = String(body.username ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 }
    );
  }

  const user = await User.findOne({ username });
  if (!user || user.passwordHash !== hashPassword(password)) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 }
    );
  }

  const token = await createSession(user._id.toString());
  const response = NextResponse.json({
    ok: true,
    user: { id: user._id.toString(), username: user.username, name: user.name },
  });

  response.cookies.set("ssj_session", token, sessionCookieOptions);
  return response;
}
