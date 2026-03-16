import { getAuthSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Client from "./client";
import { listAudienceListsAction, listContactsAction } from "./actions";

export default async function AudienceListsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; message?: string; listId?: string }>;
}) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");
  const params = (await searchParams) ?? {};
  const status = typeof params.status === "string" ? params.status : null;
  const message = typeof params.message === "string" ? params.message : null;
  const listId = typeof params.listId === "string" ? params.listId : null;

  const items = await listAudienceListsAction(session.userId);
  let contacts: any[] = [];
  if (listId) contacts = await listContactsAction(session.userId, listId);

  return <Client status={status} message={message} items={items} contacts={contacts} activeListId={listId} canManage={true} />;
}