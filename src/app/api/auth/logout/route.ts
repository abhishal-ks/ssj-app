import { deleteSessionByToken, getSessionToken, sessionCookieOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = getSessionToken(req);

  if (token) {
    await deleteSessionByToken(token);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("ssj_session", "", {
    ...sessionCookieOptions,
    maxAge: 0,
  });

  return response;
}
