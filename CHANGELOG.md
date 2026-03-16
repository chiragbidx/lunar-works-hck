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