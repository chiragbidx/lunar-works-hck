import { getAuthSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Client from "./client";

export default async function ReportsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  // Once data and stats exist, surface them here.
  return <Client />;
}