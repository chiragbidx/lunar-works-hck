# CHANGELOG.md

## 2024-06-11 MailFlux Branding Launch

- Rebranded all homepage sections: hero, features, testimonials, pricing, footer, and navigation to "MailFlux" with startup-focused language.
- Updated content copy and structure in `content/home.ts` for MailFlux positioning.
- Updated Navbar in `components/layout/navbar.tsx` for MailFlux, new feature dropdown, and sections.
- Branded homepage hero section, features grid, testimonials, pricing, and footer for MailFlux.
- Updated authentication UI in `app/auth/client.tsx` for MailFlux: onboarding, login, messaging, and value proposition.
- Updated dashboard layout in `app/dashboard/layout.tsx` to show MailFlux branding.
- Updated dashboard sidebar via `components/dashboard/sidebar-nav.tsx` for new MailFlux features: Campaigns, Audience Lists, Templates, Reporting, etc.
- Updated dashboard overview UI (`app/dashboard/page.tsx`, `app/dashboard/client.tsx`, `components/dashboard/dashboard-content.tsx`) with MailFlux tone, empty states, and next-action CTAs.
- All UI elements, labels, and empty/success states now reference MailFlux.
- Contact email updated to hi@chirag.co for all support links/CTAs.

## 2024-06-11 MailFlux Feature Scaffold

- Added new dashboard feature directories for Campaigns, Audience Lists, Templates, and Reports.
- Scaffolded Next.js routes for each: `/dashboard/campaigns`, `/dashboard/audience-lists`, `/dashboard/templates`, `/dashboard/reports`.
- Each feature includes page.tsx (server entry/guard), client.tsx (interactive UI, empty/guidance state), and actions.tsx (server action stub).
- Sidebar navigation now covers all MailFlux email marketing flows.
- Ready to wire up DB-backed CRUD after campaign/audience/template schema/migrations.

## 2024-06-11 MailFlux DB Schema

- Added new Drizzle schema tables for MailFlux email marketing core:
  - `audience_lists` (team-scoped, unique name per team)
  - `contacts` (linked to audience list, unique email per list)
  - `templates` (team-scoped, unique name per team, stores content)
  - `campaigns` (team-scoped, name, subject, links to template, schedule/status)
  - `campaign_deliveries` (tracks per-contact send state: delivered, opened, bounced, unsubscribed)
  - `campaign_stats` (summary stats per campaign: delivered, opened, clicked, bounced, unsubscribed)
- All relationships and constraints for multi-tenant, segmentable campaign management included.
- Next: Generate and run Drizzle migration for new schema, then wire up CRUD for features.

## 2024-06-11 MailFlux Campaign CRUD

- Implemented backend server actions for Campaigns:
  - createCampaignAction: validates unique name/schedule, checks permissions, inserts new campaign
  - updateCampaignAction: prevents edits after sent/failed, enforces duplicate protection, updates fields
  - deleteCampaignAction: prevents deleting sent/failed campaigns, cascades via DB
  - listCampaignsAction: fetches/serializes all campaigns for user's team
  - getCampaignByIdAction: returns single campaign details for view/edit
- Wired up campaign CRUD flow to `/dashboard/campaigns/page.tsx` and client interface:
  - Fetches campaign list, passes to client for UI list, add, edit, and delete dialogs
  - Full error/success/empty states surfaced in UI
- Ready for campaign extension: add audience selection, template association, schedule/send workflows next.