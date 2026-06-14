import { getCurrentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import EntryClient from "./client";

export default async function EntryPage() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";
  
  const userId = await getCurrentUserId(cookieHeader);

  if (!userId) {
    redirect("/auth/login");
  }

  return <EntryClient />;
}
