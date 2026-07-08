import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import { BookOpen, MoonStar, Sparkles } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";

  const user = await getCurrentUser(cookieHeader);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-[28px] border border-border/70 bg-surface/90 px-3 py-2 transition hover:border-accent hover:bg-surface-strong"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-inner">
            <BookOpen size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">SSJ</p>
            <p className="text-[11px] uppercase tracking-[0.4em] text-muted">Private journal</p>
          </div>
        </Link>

        <div className="items-center gap-3 md:flex">
          <Link
            href="/dashboard"
            className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:text-foreground hover:bg-surface/80"
          >
            Journal
          </Link>
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/80 px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-strong hover:text-foreground"
          >
            <MoonStar size={15} />
            Theme
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden rounded-full border border-border/70 bg-surface/80 px-3 py-2 text-sm font-medium text-muted sm:inline-flex">
                {user.username}
              </span>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background shadow-[0_14px_40px_rgba(79,70,229,0.2)] transition hover:brightness-105"
            >
              <Sparkles size={15} />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
