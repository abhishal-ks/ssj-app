"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoonStar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeaderNav() {
  const pathname = usePathname();
  const isJournalActive = pathname === "/" || pathname.startsWith("/dashboard") || pathname.startsWith("/entry");
  const isThemeActive = pathname.startsWith("/settings");

  return (
    <nav className="flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 p-1.5 shadow-inner">
      <Link
        href="/dashboard"
        aria-current={isJournalActive ? "page" : undefined}
        className={cn(
          "rounded-full px-3.5 py-2 text-sm font-medium transition",
          isJournalActive
            ? "bg-accent/10 text-accent shadow-sm"
            : "text-muted hover:bg-surface/80 hover:text-foreground"
        )}
      >
        Journal
      </Link>
      <Link
        href="/settings"
        aria-current={isThemeActive ? "page" : undefined}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition",
          isThemeActive
            ? "border-accent/30 bg-accent/10 text-accent shadow-sm"
            : "border-transparent bg-surface/80 text-muted hover:border-border/70 hover:bg-surface-strong hover:text-foreground"
        )}
      >
        <MoonStar size={15} />
        Theme
      </Link>
    </nav>
  );
}
