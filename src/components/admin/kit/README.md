# Dashboard building blocks

The dashboard is **Arabic, right-to-left** (`dir="rtl"` on the frame in `src/app/admin/AdminClientLayout.tsx`).
The menu lives in `src/config/admin-nav.ts` (sections → items). Import everything from `@/components/admin/kit`.

## Screen types

1. **Hub** — the page a menu item opens (e.g. `/admin/settings`). `AdminPage` + `AdminHub`: a list of cards,
   each opening one focused editor. Hubs read **nothing** from the database.
2. **Editor** — one focused part (e.g. `/admin/settings/contact`). Loads only its document with
   `useAdminDoc`, edits a `useDraft` copy, saves only the fields it owns, shows `SaveBar`,
   and calls `useUnsavedChangesGuard(dirty)`.
3. **List** — a collection (leads, articles, users…). `useAdminList` loads one page at a time with
   "Load more"; item details/edits on their own page or in a `Modal`.

```tsx
const settings = useAdminDoc("site_content/settings", normalizeSettings); // read once per visit, shared
const { draft, update, dirty, reset } = useDraft(pickContact(settings.data));
useUnsavedChangesGuard(dirty);
const save = () => settings.save({ emailAddress: draft.emailAddress, whatsappNumber: draft.whatsappNumber });
<AdminPage title="التواصل" breadcrumbs={[{ label: "إعدادات الموقع", href: "/admin/settings" }]}>…<SaveBar …/></AdminPage>
```

## Also in the kit

- `useAdminDocPeek(path)` — the cached copy of a document only if an editor already loaded it this visit (never reads). For hubs that want to show counts/status for free.
- `ReadError` — the one "couldn't read … / جرّب تاني" block for screens and lists.
- `kit/list` + `kit/listData` — list screens: tabs with counts (`useCollectionCounts`), skeleton, body/footer with "تحميل المزيد", row menu, thumbnails, date formatting.
- `save()` shows a warning toast by itself when the live site couldn't be refreshed.

## Rules

- **Database**: no `onSnapshot` live listeners; no reading whole collections to show a page (paginate,
  or use `getCountFromServer` for numbers). One `useAdminDoc` per document — every editor of the same
  document shares the cached copy. `save()` merges by default and refreshes the live site
  (`refresh: "all"`); documents visitors never see (`settings/*`) pass `refresh: false` (or `["ai"]` for the assistant).
- After approving/deleting moderated items call `refreshAdminCounts()` (menu badges).
- **Direction**: logical utilities only — `ms-/me-/ps-/pe-/start-/end-/text-start/text-end/border-s/border-e`.
  Arrows/chevrons that mean "back/forward" flip with `rtl:rotate-180` (or `ltr:rotate-180` for a left-pointing icon).
- **Language**: Arabic labels (Egyptian, short); technical names (SEO, WhatsApp, API, Resend) stay English.
- **Look**: tokens + `@/components/ui` only (see the design guide); no raw colors, gradients, blur or shadows beyond `shadow-popover`.
- Long forms are split into sub-pages; a single editor should fit in about one to two screens.
