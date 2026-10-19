## Learned User Preferences

- Do not reintroduce `@silk-hq/components`, `SheetProvider`, or the keyboard sheet; use the shared `Popup` for logged-in dialogs and delete confirms.
- Keep logged-in navigation URL-backed (e.g. `/app/profile`); avoid tab state that does not sync to the URL or router.

## Learned Workspace Facts

- The logged-in app lives under `/app` with real routes for dashboard (`/app`), profile (`/app/profile`), and admin feedback (`/app/feedback`); pill nav is in `AppNav`.
- `@silk-hq/components` is removed; treatment and feedback use `Popup`, and the treatments table opens edit through `openTreatmentDialog` in `src/lib/treatmentDialog.ts`.
- Treatment form shared logic lives in `src/lib/treatmentForm.ts` (validation, payload builder, initial values).

## Signing in for browser testing

- Dev server runs at `http://localhost:3000` (`npm run dev`). Auth-protected pages redirect to `/signin`.
- To sign in for browser testing: on `/signin`, click the **"Continue with test user"** button — it signs in as the test profile (uid `3OHCqKgvsYbMiGfKDavqq7Duveg1`) with seeded treatments, no credentials needed.
- Prod Firestore rules live in `firebase/firestore.prod.rules`; deploy with `npx firebase-tools deploy --only firestore:rules`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
