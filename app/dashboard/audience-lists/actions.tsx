"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { audienceLists, contacts, teamMembers } from "@/lib/db/schema";

// Zod schemas
const listSchema = z.object({
  name: z.string().min(2, "Audience list name required.").max(64, "List name too long."),
  description: z.string().max(280, "Description too long.").optional(),
});
const listUpdateSchema = listSchema.extend({
  id: z.string().min(1, "Invalid list id."),
});
const listDeleteSchema = z.object({
  id: z.string().min(1, "Invalid list id."),
});
const contactSchema = z.object({
  audienceListId: z.string().min(1, "Missing list."),
  email: z.string().email("Invalid email."),
  name: z.string().optional(),
  tags: z.string().optional(),
});
const contactUpdateSchema = contactSchema.extend({
  id: z.string().min(1, "Invalid contact id."),
  unsubscribed: z.boolean().optional(),
});
const contactDeleteSchema = z.object({
  id: z.string().min(1, "Invalid contact id."),
});

// Role helpers/guards
async function requireTeamMembership(userId: string) {
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);
  if (!membership) {
    redirect("/dashboard/audience-lists?status=error&message=Not authorized.");
  }
  return membership;
}
function canManage(role: string) {
  return ["admin", "owner"].includes(role);
}

// Audience list CRUD
export async function createAudienceListAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");
  const { teamId, role } = await requireTeamMembership(session.userId);
  if (!canManage(role)) redirect("/dashboard/audience-lists?status=error&message=Not allowed.");

  const parsed = listSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    redirect(`/dashboard/audience-lists?status=error&message=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid data")}`);
  }
  // Unique name per team
  const [existing] = await db.select({ id: audienceLists.id }).from(audienceLists)
    .where(and(eq(audienceLists.teamId, teamId), eq(audienceLists.name, parsed.data.name))).limit(1);
  if (existing) {
    redirect("/dashboard/audience-lists?status=error&message=List name must be unique.");
  }
  await db.insert(audienceLists).values({
    teamId,
    name: parsed.data.name,
    description: parsed.data.description,
    updatedAt: new Date(),
  });
  redirect("/dashboard/audience-lists?status=success&message=Audience list created.");
}

export async function updateAudienceListAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");
  const { teamId, role } = await requireTeamMembership(session.userId);
  if (!canManage(role)) redirect("/dashboard/audience-lists?status=error&message=Not allowed.");

  const parsed = listUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    redirect(`/dashboard/audience-lists?status=error&message=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid data")}`);
  }
  // Unique name constraint, allow self
  const [existing] = await db.select({ id: audienceLists.id }).from(audienceLists)
    .where(and(eq(audienceLists.teamId, teamId), eq(audienceLists.name, parsed.data.name))).limit(1);
  if (existing && existing.id !== parsed.data.id) {
    redirect("/dashboard/audience-lists?status=error&message=List name must be unique.");
  }
  await db.update(audienceLists).set({
    name: parsed.data.name,
    description: parsed.data.description,
    updatedAt: new Date(),
  }).where(and(eq(audienceLists.id, parsed.data.id), eq(audienceLists.teamId, teamId)));
  redirect("/dashboard/audience-lists?status=success&message=Audience list updated.");
}

export async function deleteAudienceListAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");
  const { teamId, role } = await requireTeamMembership(session.userId);
  if (!canManage(role)) redirect("/dashboard/audience-lists?status=error&message=Not allowed.");

  const parsed = listDeleteSchema.safeParse({
    id: formData.get("id"),
  });
  if (!parsed.success) {
    redirect(`/dashboard/audience-lists?status=error&message=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid data")}`);
  }
  // TODO: Optional - block delete if any campaign uses this list (requires join to campaigns table)
  await db.delete(audienceLists)
    .where(and(eq(audienceLists.id, parsed.data.id), eq(audienceLists.teamId, teamId)));
  redirect("/dashboard/audience-lists?status=success&message=Audience list deleted.");
}

// LISTS - fetch all for team/member
export async function listAudienceListsAction(userId: string) {
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);
  if (!membership) return [];
  const data = await db.select({
    id: audienceLists.id,
    name: audienceLists.name,
    description: audienceLists.description,
    updatedAt: audienceLists.updatedAt,
    createdAt: audienceLists.createdAt,
  })
    .from(audienceLists)
    .where(eq(audienceLists.teamId, membership.teamId));
  return data.map(d => ({
    ...d,
    updatedAt: d.updatedAt?.toISOString() ?? null,
    createdAt: d.createdAt?.toISOString() ?? null,
  }));
}

// Contacts CRUD + import
export async function createContactAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");
  const { teamId, role } = await requireTeamMembership(session.userId);
  if (!canManage(role)) redirect("/dashboard/audience-lists?status=error&message=Not allowed.");

  const parsed = contactSchema.safeParse({
    audienceListId: formData.get("audienceListId"),
    email: formData.get("email"),
    name: formData.get("name"),
    tags: formData.get("tags"),
  });
  if (!parsed.success) {
    redirect(`/dashboard/audience-lists?status=error&message=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid data")}`);
  }
  // Check for duplicate in same audience list
  const [existing] = await db.select({ id: contacts.id }).from(contacts)
    .where(and(eq(contacts.audienceListId, parsed.data.audienceListId), eq(contacts.email, parsed.data.email))).limit(1);
  if (existing) {
    redirect("/dashboard/audience-lists?status=error&message=Contact already exists in this list.");
  }
  await db.insert(contacts).values({
    audienceListId: parsed.data.audienceListId,
    email: parsed.data.email,
    name: parsed.data.name,
    tags: parsed.data.tags,
    updatedAt: new Date(),
  });
  redirect("/dashboard/audience-lists?status=success&message=Contact added.");
}

export async function updateContactAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");
  const { teamId, role } = await requireTeamMembership(session.userId);
  if (!canManage(role)) redirect("/dashboard/audience-lists?status=error&message=Not allowed.");

  const parsed = contactUpdateSchema.safeParse({
    id: formData.get("id"),
    audienceListId: formData.get("audienceListId"),
    email: formData.get("email"),
    name: formData.get("name"),
    tags: formData.get("tags"),
    unsubscribed: formData.get("unsubscribed") === "on" || formData.get("unsubscribed") === "true",
  });
  if (!parsed.success) {
    redirect(`/dashboard/audience-lists?status=error&message=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid data")}`);
  }
  await db.update(contacts).set({
    email: parsed.data.email,
    name: parsed.data.name,
    tags: parsed.data.tags,
    unsubscribed: parsed.data.unsubscribed,
    updatedAt: new Date(),
  }).where(and(eq(contacts.id, parsed.data.id), eq(contacts.audienceListId, parsed.data.audienceListId)));
  redirect("/dashboard/audience-lists?status=success&message=Contact updated.");
}

export async function deleteContactAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");
  const { teamId, role } = await requireTeamMembership(session.userId);
  if (!canManage(role)) redirect("/dashboard/audience-lists?status=error&message=Not allowed.");

  const parsed = contactDeleteSchema.safeParse({
    id: formData.get("id"),
  });
  if (!parsed.success) {
    redirect(`/dashboard/audience-lists?status=error&message=${encodeURIComponent(parsed.error.issues[0]?.message || "Invalid data")}`);
  }
  // TODO: Optional - block delete if used in sent campaigns (future)
  await db.delete(contacts).where(eq(contacts.id, parsed.data.id));
  redirect("/dashboard/audience-lists?status=success&message=Contact deleted.");
}

// LIST contacts by audience list
export async function listContactsAction(userId: string, audienceListId: string) {
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);
  if (!membership) return [];
  // Confirm audienceListId belongs to team
  const [list] = await db
    .select({ id: audienceLists.id, teamId: audienceLists.teamId })
    .from(audienceLists)
    .where(eq(audienceLists.id, audienceListId))
    .limit(1);
  if (!list || list.teamId !== membership.teamId) return [];
  const data = await db.select({
    id: contacts.id,
    email: contacts.email,
    name: contacts.name,
    tags: contacts.tags,
    unsubscribed: contacts.unsubscribed,
    updatedAt: contacts.updatedAt,
    createdAt: contacts.createdAt,
  })
    .from(contacts)
    .where(eq(contacts.audienceListId, audienceListId));
  return data.map(d => ({
    ...d,
    updatedAt: d.updatedAt?.toISOString() ?? null,
    createdAt: d.createdAt?.toISOString() ?? null,
  }));
}

// CSV Import: parsedRecords: Array<{email, name, tags?}>
export async function importContactsAction(userId: string, audienceListId: string, records: Array<{ email: string; name?: string; tags?: string }>) {
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);
  if (!membership) throw new Error("Not authorized");
  if (!canManage(membership.role)) throw new Error("Not allowed");

  const valid: typeof records = [];
  const errors: string[] = [];
  for (const rec of records) {
    const parsed = contactSchema.safeParse({
      audienceListId,
      email: rec.email,
      name: rec.name,
      tags: rec.tags,
    });
    if (!parsed.success) {
      errors.push(`Invalid: ${rec.email || "(missing email)"} - ${parsed.error.issues[0]?.message}`);
      continue;
    }
    // Check for dups can be in batch if needed (performance)
    valid.push(parsed.data);
  }
  // Single SQL batch insert attempt (skipping duplicates via ON CONFLICT DO NOTHING is not standardized in Drizzle, so handle one-by-one or customize)
  let created = 0;
  for (const item of valid) {
    const [existing] = await db.select({ id: contacts.id }).from(contacts)
      .where(and(eq(contacts.audienceListId, audienceListId), eq(contacts.email, item.email))).limit(1);
    if (!existing) {
      await db.insert(contacts).values({
        audienceListId: item.audienceListId,
        email: item.email,
        name: item.name,
        tags: item.tags,
        updatedAt: new Date(),
      });
      created++;
    }
  }
  return { created, errors };
}