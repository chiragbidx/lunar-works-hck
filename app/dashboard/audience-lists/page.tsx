import { getAuthSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Client from "./client";

export default async function AudienceListsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");
  // Data model integration will follow after DB schema/migrations
  return <Client />;
}