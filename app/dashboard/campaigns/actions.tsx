"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { campaigns, templates, teams, teamMembers } from "@/lib/db/schema";

// Accepts "", null, or browser datetime-local (YYYY-MM-DDTHH:mm) and validates as local/future.
const scheduledAtSchema = z
  .string()
  .optional()
  .refine(
    val => {
      if (!val || val === "") return true; // Allow blank/unscheduled
      const maybeDate = new Date(val);
      return !isNaN(maybeDate.getTime());
    },
    { message: "Invalid date" }
  );

// Zod schema for campaign creation/updating
const createCampaignSchema = z.object({
  name: z.string().min(2, "Campaign name is required.").max(64, "Campaign name too long."),
  subject: z.string().min(2, "Subject is required."),
  templateId: z.string().nullable().optional(), // can be null
  scheduledAt: scheduledAtSchema,
});

const updateCampaignSchema = createCampaignSchema.extend({
  id: z.string().min(1, "Missing campaign id."),
  status: z.string().optional(), // For status updates/drafts/etc
});

const deleteCampaignSchema = z.object({
  id: z.string().min(1, "Missing campaign id."),
});

async function requireTeamManageRole(userId: string) {
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);

  if (!membership || !["owner", "admin"].includes(membership.role)) {
    redirect("/dashboard/campaigns?status=error&message=Not authorized.");
  }

  return membership.teamId;
}

// CREATE
export async function createCampaignAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const teamId = await requireTeamManageRole(session.userId);
  const rawScheduledAt = (formData.get("scheduledAt") ?? "") as string;
  const parsed = createCampaignSchema.safeParse({
    name: formData.get("name"),
    subject: formData.get("subject"),
    templateId: formData.get("templateId"),
    scheduledAt: rawScheduledAt,
  });

  if (!parsed.success) {
    redirect(
      `/dashboard/campaigns?status=error&message=${encodeURIComponent(
        parsed.error.issues[0]?.message || "Invalid data"
      )}`
    );
  }

  // Prevent duplicate campaign names per tenant
  const [existing] = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(and(eq(campaigns.teamId, teamId), eq(campaigns.name, parsed.data.name)))
    .limit(1);

  if (existing) {
    redirect(`/dashboard/campaigns?status=error&message=This campaign name is already used.`);
  }

  let scheduledAtDate: Date | null = null;
  if (parsed.data.scheduledAt && parsed.data.scheduledAt !== "") {
    scheduledAtDate = new Date(parsed.data.scheduledAt);
    // Defensive: ensure scheduled time is in the future if provided
    if (isNaN(scheduledAtDate.getTime())) {
      redirect(`/dashboard/campaigns?status=error&message=Invalid datetime for schedule.`);
    }
    if (scheduledAtDate < new Date()) {
      redirect(`/dashboard/campaigns?status=error&message=Scheduled time cannot be in the past.`);
    }
  }

  // Optional: Validate template exists
  if (parsed.data.templateId) {
    const [tpl] = await db
      .select({ id: templates.id })
      .from(templates)
      .where(and(eq(templates.id, parsed.data.templateId), eq(templates.teamId, teamId)))
      .limit(1);
    if (!tpl) {
      redirect(`/dashboard/campaigns?status=error&message=Invalid template selected.`);
    }
  }

  await db.insert(campaigns).values({
    teamId,
    name: parsed.data.name,
    subject: parsed.data.subject,
    templateId: parsed.data.templateId || null,
    scheduledAt: scheduledAtDate,
    status: "draft",
    updatedAt: new Date(),
  });

  redirect(`/dashboard/campaigns?status=success&message=Campaign created successfully.`);
}

// UPDATE
export async function updateCampaignAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const teamId = await requireTeamManageRole(session.userId);
  const rawScheduledAt = (formData.get("scheduledAt") ?? "") as string;
  const parsed = updateCampaignSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    subject: formData.get("subject"),
    templateId: formData.get("templateId"),
    scheduledAt: rawScheduledAt,
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect(
      `/dashboard/campaigns?status=error&message=${encodeURIComponent(
        parsed.error.issues[0]?.message || "Invalid data"
      )}`
    );
  }

  // Only allow updates if campaign is not sent/failed
  const [camp] = await db
    .select({ id: campaigns.id, status: campaigns.status, name: campaigns.name })
    .from(campaigns)
    .where(and(eq(campaigns.id, parsed.data.id), eq(campaigns.teamId, teamId)))
    .limit(1);

  if (!camp) {
    redirect(`/dashboard/campaigns?status=error&message=Campaign not found.`);
  }
  if (["sent", "failed"].includes(camp.status)) {
    redirect(`/dashboard/campaigns?status=error&message=Cannot edit sent or failed campaigns.`);
  }

  // Prevent duplicate name (other than self)
  if (camp.name !== parsed.data.name) {
    const [dup] = await db
      .select({ id: campaigns.id })
      .from(campaigns)
      .where(and(eq(campaigns.teamId, teamId), eq(campaigns.name, parsed.data.name)))
      .limit(1);
    if (dup) {
      redirect(`/dashboard/campaigns?status=error&message=Duplicate campaign name.`);
    }
  }

  let scheduledAtDate: Date | null = null;
  if (parsed.data.scheduledAt && parsed.data.scheduledAt !== "") {
    scheduledAtDate = new Date(parsed.data.scheduledAt);
    if (isNaN(scheduledAtDate.getTime())) {
      redirect(`/dashboard/campaigns?status=error&message=Invalid datetime for schedule.`);
    }
    if (scheduledAtDate < new Date()) {
      redirect(`/dashboard/campaigns?status=error&message=Scheduled time cannot be in the past.`);
    }
  }

  await db
    .update(campaigns)
    .set({
      name: parsed.data.name,
      subject: parsed.data.subject,
      templateId: parsed.data.templateId || null,
      scheduledAt: scheduledAtDate,
      status: parsed.data.status || camp.status,
      updatedAt: new Date(),
    })
    .where(and(eq(campaigns.id, parsed.data.id), eq(campaigns.teamId, teamId)));

  redirect(`/dashboard/campaigns?status=success&message=Campaign updated successfully.`);
}

// DELETE
export async function deleteCampaignAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const teamId = await requireTeamManageRole(session.userId);
  const parsed = deleteCampaignSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    redirect(
      `/dashboard/campaigns?status=error&message=${encodeURIComponent(
        parsed.error.issues[0]?.message || "Invalid data"
      )}`
    );
  }

  const [camp] = await db
    .select({ id: campaigns.id, status: campaigns.status })
    .from(campaigns)
    .where(and(eq(campaigns.id, parsed.data.id), eq(campaigns.teamId, teamId)))
    .limit(1);

  if (!camp) {
    redirect(`/dashboard/campaigns?status=error&message=Campaign not found.`);
  }
  if (["sent", "failed"].includes(camp.status)) {
    redirect(`/dashboard/campaigns?status=error&message=Cannot delete a sent or failed campaign.`);
  }

  await db
    .delete(campaigns)
    .where(and(eq(campaigns.id, parsed.data.id), eq(campaigns.teamId, teamId)));

  redirect(`/dashboard/campaigns?status=success&message=Campaign deleted successfully.`);
}

// LIST ALL FOR TEAM
export async function listCampaignsAction(userId: string) {
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);
  if (!membership) return [];

  const data = await db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      subject: campaigns.subject,
      status: campaigns.status,
      scheduledAt: campaigns.scheduledAt,
      templateId: campaigns.templateId,
      updatedAt: campaigns.updatedAt,
      createdAt: campaigns.createdAt,
    })
    .from(campaigns)
    .where(eq(campaigns.teamId, membership.teamId));

  return data.map((d) => ({
    ...d,
    updatedAt: d.updatedAt?.toISOString() ?? null,
    createdAt: d.createdAt?.toISOString() ?? null,
    scheduledAt: d.scheduledAt?.toISOString() ?? null,
  }));
}

// GET ONE (for edit/view)
export async function getCampaignByIdAction(userId: string, campaignId: string) {
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);
  if (!membership) return null;

  const [camp] = await db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      subject: campaigns.subject,
      status: campaigns.status,
      scheduledAt: campaigns.scheduledAt,
      templateId: campaigns.templateId,
      updatedAt: campaigns.updatedAt,
      createdAt: campaigns.createdAt,
    })
    .from(campaigns)
    .where(and(eq(campaigns.teamId, membership.teamId), eq(campaigns.id, campaignId)))
    .limit(1);

  if (!camp) return null;

  return {
    ...camp,
    updatedAt: camp.updatedAt?.toISOString() ?? null,
    createdAt: camp.createdAt?.toISOString() ?? null,
    scheduledAt: camp.scheduledAt?.toISOString() ?? null,
  };
}