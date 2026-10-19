## Learned User Preferences

- Do not reintroduce `@silk-hq/components`, `SheetProvider`, or the keyboard sheet; use the shared `Popup` for logged-in dialogs and delete confirms.
- Keep logged-in navigation URL-backed (e.g. `/app/profile`); avoid tab state that does not sync to the URL or router.

## Learned Workspace Facts

- The logged-in app lives under `/app` with real routes for dashboard (`/app`), profile (`/app/profile`), and admin feedback (`/app/feedback`); pill nav is in `AppNav`.
- `@silk-hq/components` is removed; treatment and feedback use `Popup`, and the treatments table opens edit through `openTreatmentDialog` in `src/lib/treatmentDialog.ts`.
- Treatment form shared logic lives in `src/lib/treatmentForm.ts` (validation, payload builder, initial values).
