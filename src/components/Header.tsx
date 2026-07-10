import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import { BookOpen, Sparkles } from "lucide-react";
import HeaderNav from "./HeaderNav";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";

  const user = await getCurrentUser(cookieHeader);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[30px] bg-surface/80 px-3 py-3 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:px-4 lg:px-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.16),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_36%)]" />

          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-3xl border border-border/70 bg-surface/90 px-3 py-2.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface-strong"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-inner transition duration-200 group-hover:scale-105">
                <BookOpen size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-semibold tracking-tight text-foreground">SSJ</p>
              </div>
            </Link>

            <HeaderNav />

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <div className="items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-600 sm:inline-flex dark:text-emerald-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    {user.username}
                  </div>
                  <LogoutButton />
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background shadow-[0_14px_40px_rgba(79,70,229,0.22)] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  <Sparkles size={15} />
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
