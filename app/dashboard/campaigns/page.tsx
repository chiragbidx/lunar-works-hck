import { getAuthSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Client from "./client";

export default async function CampaignsPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  // Data layer will be wired after DB schema/migrations.
  return <Client />;
}