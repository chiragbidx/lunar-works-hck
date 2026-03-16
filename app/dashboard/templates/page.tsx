import { getAuthSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Client from "./client";

export default async function TemplatesPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  // Data integration (CRUD) coming after migration/schema
  return <Client />;
}