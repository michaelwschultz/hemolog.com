# Hemolog - Agent Instructions

## Cursor Cloud specific instructions

### Overview
Hemolog is a hemophilia medication tracking web app. See `.cursorrules` for full tech stack and code conventions.

### Running the App
Two processes are needed (in separate terminals):
1. **Firebase Emulators** (Auth:9099, Firestore:8082, UI:8081): `pnpm firebase`
2. **Next.js Dev Server** (port 3000): `pnpm dev`

A `.env.local` file must exist with `NEXT_PUBLIC_USE_EMULATORS=true`. Other Firebase config vars default to safe values for local dev.

### Authentication in Emulator Mode
- Google sign-in is disabled when `NEXT_PUBLIC_USE_EMULATORS=true`.
- Use the **"Continue with Test User"** button on `/signin` (email: `michael+test@hemolog.com`, password: `test123`). The account is auto-created in the Auth emulator if it doesn't exist.

### Key Commands
See `package.json` scripts. Quick reference:
- `pnpm lint` / `pnpm lint:fix` — Biome linter
- `pnpm build` — production build (runs lint:fix first)
- `pnpm seed` — seeds test data into emulators
- `pnpm cy:run` — Cypress E2E tests (requires dev server + emulators running)

### Gotchas
- Firebase emulators require **Java** (OpenJDK 21+).
- The `TreatmentModalContent` component has a render-loop detector that may fire `console.error` during normal use. This is a known issue in the current branch — the form still works despite the warning.
- Emulator data is ephemeral; it resets when emulators restart. Run `pnpm seed` to repopulate test data after restart.
- The project requires **Node.js 22.21.x** and **pnpm 10.28.0** (enforced via `engines` and `packageManager` fields).
