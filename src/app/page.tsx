import { getCurrentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Home() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";
  
  const userId = await getCurrentUserId(cookieHeader);

  if (userId) {
    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }
}