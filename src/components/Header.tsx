import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";

  const user = await getCurrentUser(cookieHeader);

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold text-white hover:text-sky-400 transition"
          >
            SSJ
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-400">
                {user.username}
              </span>
              <LogoutButton />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
