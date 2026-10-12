# One Place — NSUT

A campus community application built with Next.js App Router, React, strict TypeScript, Tailwind CSS, Auth.js Google sign-in, database sessions, Prisma, Neon PostgreSQL, Zod, TanStack Query, Vitest, and Playwright. The sample content is marked **Demo** and makes no claim to be official NSUT information.

## Run locally

1. Use Node.js 20.9+ and pnpm 11. Copy `.env.example` to `.env.local` and fill in a **development** Neon PostgreSQL database, Google OAuth credentials, and a random `AUTH_SECRET`.
2. In Google Cloud, authorize `http://localhost:3000/api/auth/callback/google` as a redirect URI. The OAuth client must be able to authenticate accounts in the configured Workspace domain.
3. Run `pnpm install`, `pnpm db:generate`, `pnpm db:deploy`, `pnpm db:seed`, then `pnpm dev`.
4. Open `http://localhost:3000/login` and sign in with a verified eligible university Google account. Complete onboarding. To create an admin, run `pnpm admin:promote user@nsut.ac.in` after that account has registered.

The seeded author has no OAuth account and cannot sign in. The seed is idempotent and never deletes user content.

## Production deployment

Deploy this repository to Vercel with Node.js runtime. Use a **separate production** Neon database. Set `DATABASE_URL` to the pooled Neon URL and `DIRECT_URL` to the direct connection URL. Set `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `APP_ORIGIN=https://YOUR_DOMAIN`, and `GOOGLE_WORKSPACE_DOMAIN=nsut.ac.in`. Add `https://YOUR_DOMAIN/api/auth/callback/google` to the Google OAuth redirect URIs. Run `pnpm db:deploy` against the production database before the first deployment. The Vercel build command is `pnpm build`.

Do not disable the Google domain check to make integration work. The `hd` authorization parameter is only an account picker hint; the signed `email_verified`, `email`, `hd`, and `sub` claims are checked by the server. Confirm the actual signed Workspace `hd` claim using a real university account. If its primary Workspace domain differs, set `GOOGLE_WORKSPACE_DOMAIN` to that verified value while retaining the `@nsut.ac.in` email requirement.

## Architecture and access

Protected Server Components call feature services directly. Browser forms use `/api/v1` REST handlers. Handlers parse HTTP, validate JSON origins, and return `{data,meta}` or `{error}`. Services apply ownership, admin role, publication, overlap, and version checks before Prisma writes. Ordinary user content is plain text. Sensitive response fields are selected explicitly. Campus responses use private no-store caching.

Auth.js uses its Prisma adapter and PostgreSQL database sessions. Every ordinary signup is STUDENT. The session callback checks the current user loaded by the database-session adapter and provides current profile fields to protected routes; suspended users are denied. Admin promotion is a local script, never a public endpoint. Google OAuth tokens stay in the Account table and are not serialized by campus APIs. The app requires an exact `APP_ORIGIN` for JSON mutations and uses a PostgreSQL-backed write limiter.

Student journey: sign in → confirm name and optional cohort → browse feed and pinned notices → search discussions → post/reply → view timetable → view attendance feature status → choose an appearance theme → edit profile. Admin journey: use `/admin` for counts → create, publish, pin, archive, or delete notices → edit cohort schedules with version conflicts → hide or restore posts and replies with a logged reason, or lock discussions.

Attendance is marked Coming soon until a working official integration is available. The app does not collect UMS passwords. The five appearance themes are also stored on the current device.

## Public project reference

The feature review used [Ahmedazim7804/imsnsit_app](https://github.com/Ahmedazim7804/imsnsit_app), a public NSUT IMS companion that documents attendance, profile, timetable, and cached viewing features. It is GPL-3.0 licensed; this project uses it as a feature reference only and does not copy or depend on its source code.

## REST API

All campus endpoints require authentication. `/api/v1/me` supports GET/PATCH; `/profiles/:id` GET; `/feed` GET; `/discussions` GET/POST; `/discussions/:id` GET/PATCH/DELETE; `/discussions/:id/replies` GET/POST; `/replies/:id` PATCH/DELETE; `/announcements` GET/POST; `/announcements/:id` GET/PATCH/DELETE; `/admin/announcements` GET; `/admin/discussions/:id` and `/admin/replies/:id` PATCH; `/admin/moderation` GET; `/terms` GET; `/cohorts?termId=` GET; `/timetables?cohortId=` GET/POST; `/timetables/:id` GET; `/timetables/:id/entries` PUT. Admin mutations are limited to ADMIN. List queries use `cursor` and `limit` where applicable. The timetable replacement payload is `{expectedVersion,entries}` and returns 409 on stale edits.

Example discussion creation from an authenticated same-origin browser:

```js
await fetch('/api/v1/discussions', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Study group', body: 'Who wants to join?', category: 'ACADEMICS' })
});
```

## Verification

Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build`. Run Playwright against a staging deployment with a test database: set `E2E_BASE_URL`, `E2E_STUDENT_STATE`, and `E2E_ADMIN_STATE` to locally generated Playwright storage-state files for two real eligible accounts, then run `pnpm test:e2e`. These fixture files must never be committed. No production authentication bypass is provided.

Live Google sign-in, database migrations, browser journeys, and a Vercel deployment require external credentials and were not exercised in the source-only environment used to prepare this project. The recruitment page was inaccessible during implementation; this project follows the supplied specification.

## Performance

Vercel functions are configured for Singapore (sin1), near the Neon database. Authentication and discussion detail reads are deduplicated within each server render. Loading boundaries give immediate navigation feedback. The selected timetable loads with the page and is reused by the client for 60 seconds.

## Timetable

Choose a term, branch, semester, and section. Day view shows class counts, times in IST, rooms, and faculty; Week view shows the full schedule. Download exports the selected section as CSV. The supplied July–December 2026 PDF is available for B.Tech first-year CSE, CSAI, CSDS, and MAC sections. Select the branch, semester, and section to view its schedule. The source PDF is linked from the timetable.
