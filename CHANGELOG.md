# CHANGELOG.md

## 2024-06-11 Bugfix: Campaign scheduledAt Invalid Date Error

- Fixed server-side Zod and runtime validation for campaign creation and editing to support browser `datetime-local` (YYYY-MM-DDTHH:mm) values.
- Accepts empty, unset, and valid browser datetime-local input as optional; server parses and validates as Date instance before scheduling.
- If user enters an invalid or past date, user sees targeted feedback.
- "Invalid date" error should no longer appear for browser-native datetime values, campaign creation is now robust.

## 2024-06-11 Audience Lists & Contacts CRUD

- Implemented server actions for robust CRUD/backoffice flows for audience lists:
  - createAudienceListAction, updateAudienceListAction, deleteAudienceListAction: all permission/validation guarded, tenant-scoped, duplicate protected
- Added contact management actions:
  - createContactAction, updateContactAction, deleteContactAction
  - listContactsAction returns contacts for a given audience list
  - importContactsAction: batch import for CSV flows; handles per-row validation & duplicates
- Updated page.tsx to load audiences and contacts, pass to new client UI scaffold
- Client UI scaffold for listing and managing audience lists (table view, add, edit, delete, import CSV)
- Ready for UI extension: contact CRUD dialog, import parsing, validation error surfacing, real-time updates