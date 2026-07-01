import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { createSession, hashPassword, sessionCookieOptions, validateRegistrationPassword, validateUsername } from "@/lib/auth";
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

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this username already exists." },
      { status: 409 }
    );
  }

  // Check username on defined parameters
  const usernameError = validateUsername(username);
  if (usernameError) {
    return NextResponse.json(
      { error: usernameError },
      { status: 400 }
    );
  }

  // Check password on defined parameters
  const passwordError = validateRegistrationPassword(password);
  if (passwordError) {
    return NextResponse.json(
      { error: passwordError },
      { status: 400 }
    );
  }

  const user = await User.create({
    username,
    passwordHash: hashPassword(password),
  });

  const token = await createSession(user._id.toString());
  const response = NextResponse.json({
    ok: true,
    user: { id: user._id.toString(), username: user.username },
  });

  response.cookies.set("ssj_session", token, sessionCookieOptions);
  return response;
}
