import { getAuthSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Client from "./client";
import { listCampaignsAction } from "./actions";

export default async function CampaignsPage({ searchParams = {} }: { searchParams?: { status?: string; message?: string } }) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const items = await listCampaignsAction(session.userId);
  const status = searchParams.status ?? null;
  const message = searchParams.message ?? null;

  return <Client status={status} message={message} items={items} canManage={true} />;
}