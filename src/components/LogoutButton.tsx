"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="group h-10 gap-2 border-rose-500/20 bg-rose-500/10 px-3.5 text-rose-600 shadow-sm hover:cursor-pointer hover:border-rose-500/40 hover:bg-rose-500/15 hover:text-rose-700 dark:text-rose-300 dark:hover:text-rose-600"
      onClick={handleLogout}
      disabled={isLoading}
      variant="secondary"
      size="sm"
    >
      {isLoading ? (
        <LoaderCircle size={15} className="animate-spin" />
      ) : (
        <LogOut size={15} className="transition group-hover:translate-x-0.5" />
      )}
      <span>{isLoading ? "Signing out..." : "Log out"}</span>
    </Button>
  );
}
