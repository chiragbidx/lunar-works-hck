# CHANGELOG.md

## 2024-06-11 Bugfix: Await searchParams for Campaigns Page

- Fixed Next.js contract for `/dashboard/campaigns/page.tsx` to properly `await searchParams` before reading status/message query params.
- This resolves runtime error where `searchParams` was a Promise (App Router convention) and must be unwrapped before destructure.
- All campaign CRUD actions and error/success flows now correctly surface query params to the dashboard UI.

## 2024-06-11 Bugfix: Campaign scheduledAt Invalid Date Error

- Fixed server-side Zod and runtime validation for campaign creation and editing to support browser `datetime-local` (YYYY-MM-DDTHH:mm) values.
- Accepts empty, unset, and valid browser datetime-local input as optional; server parses and validates as Date instance before scheduling.
- If user enters an invalid or past date, user sees targeted feedback.
- "Invalid date" error should no longer appear for browser-native datetime values, campaign creation is now robust.