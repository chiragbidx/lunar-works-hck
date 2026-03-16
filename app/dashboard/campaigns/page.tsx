import { getAuthSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Client from "./client";
import { listCampaignsAction } from "./actions";

// Next.js convention: destructure and await searchParams as a Promise
export default async function CampaignsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string }>;
}) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  // Await searchParams for Next.js server component contract
  const params = (await searchParams) ?? {};
  const status = typeof params.status === "string" ? params.status : null;
  const message = typeof params.message === "string" ? params.message : null;

  const items = await listCampaignsAction(session.userId);

  return <Client status={status} message={message} items={items} canManage={true} />;
}