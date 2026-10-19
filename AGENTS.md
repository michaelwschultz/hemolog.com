## Learned User Preferences

- Replace `@silk-hq/components` sheets with a simple Tailwind-styled modal. The treatment sheet has repeatedly frozen the page on open and on cancel or close.
- Use real routes for the logged-in app: something like `/app` for the dashboard and `/app/profile` for profile.

## Learned Workspace Facts

- The logged-in app is a single `/home` page that swaps Home, Profile, and admin Feedback in local state; those tabs do not change the URL.
