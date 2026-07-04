"use client";

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
      className="hover:cursor-pointer"
      onClick={handleLogout}
      disabled={isLoading}
      variant="secondary"
      size="sm"
    >
      {isLoading ? "Logging out..." : "Log out"}
    </Button>
  );
}
