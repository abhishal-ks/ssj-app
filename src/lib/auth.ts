import crypto from "crypto";
import { connectDB } from "./db";
import { Session } from "./models/Session";
import { User } from "./models/User";

export const SESSION_COOKIE_NAME = "ssj_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function parseCookies(cookieHeader: string) {
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((cookies, cookie) => {
      const [name, ...rest] = cookie.split("=");
      cookies[name] = decodeURIComponent(rest.join("=") ?? "");
      return cookies;
    }, {});
}

export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export const sessionCookieOptions = {
  httpOnly: true,
  maxAge: SESSION_MAX_AGE,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function createSession(userId: string) {
  const token = generateSessionToken();
  await connectDB();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await Session.create({
    userId,
    token,
    expiresAt,
  });

  return token;
}

function getCookieHeader(reqOrCookie: Request | string) {
  return typeof reqOrCookie === "string"
    ? reqOrCookie
    : reqOrCookie.headers.get("cookie") ?? "";
}

export function getSessionToken(reqOrCookie: Request | string) {
  const cookieHeader = getCookieHeader(reqOrCookie);
  const cookies = parseCookies(cookieHeader);
  return cookies[SESSION_COOKIE_NAME] ?? null;
}

export async function deleteSessionByToken(token: string) {
  await connectDB();
  await Session.deleteOne({ token });
}

export async function getCurrentUserId(reqOrCookie: Request | string) {
  const token = getSessionToken(reqOrCookie);
  if (!token) {
    return null;
  }

  await connectDB();
  const session = await Session.findOne({
    token,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    return null;
  }

  return session.userId;
}

export async function getCurrentUser(reqOrCookie: Request | string) {
  const userId = await getCurrentUserId(reqOrCookie);
  if (!userId) {
    return null;
  }

  await connectDB();
  return User.findById(userId);
}
