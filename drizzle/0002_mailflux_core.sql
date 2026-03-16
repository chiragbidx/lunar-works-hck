-- 0002_mailflux_core.sql
-- MailFlux database extension: audiences, contacts, templates, campaigns, deliveries, stats

CREATE TABLE "audience_lists" (
  "id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "team_id" text NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "description" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "audience_lists_team_name_idx" ON "audience_lists" ("team_id", "name");

CREATE TABLE "contacts" (
  "id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "audience_list_id" text NOT NULL REFERENCES "audience_lists"("id") ON DELETE CASCADE,
  "email" text NOT NULL,
  "name" text,
  "tags" text,
  "unsubscribed" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "contacts_list_email_idx" ON "contacts" ("audience_list_id", "email");

CREATE TABLE "templates" (
  "id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "team_id" text NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "templates_team_name_idx" ON "templates" ("team_id", "name");

CREATE TABLE "campaigns" (
  "id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "team_id" text NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "subject" text NOT NULL,
  "template_id" text REFERENCES "templates"("id") ON DELETE SET NULL,
  "scheduled_at" timestamptz,
  "status" text NOT NULL DEFAULT 'draft',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "campaigns_team_name_idx" ON "campaigns" ("team_id", "name");

CREATE TABLE "campaign_deliveries" (
  "id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "campaign_id" text NOT NULL REFERENCES "campaigns"("id") ON DELETE CASCADE,
  "contact_id" text NOT NULL REFERENCES "contacts"("id") ON DELETE CASCADE,
  "status" text NOT NULL,
  "delivered_at" timestamptz,
  "opened_at" timestamptz,
  "clicked_at" timestamptz,
  "bounced_at" timestamptz,
  "unsubscribed_at" timestamptz
);

CREATE TABLE "campaign_stats" (
  "id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "campaign_id" text NOT NULL REFERENCES "campaigns"("id") ON DELETE CASCADE,
  "total_delivered" integer NOT NULL DEFAULT 0,
  "opened" integer NOT NULL DEFAULT 0,
  "clicked" integer NOT NULL DEFAULT 0,
  "bounced" integer NOT NULL DEFAULT 0,
  "unsubscribed" integer NOT NULL DEFAULT 0
);