# Valcron website — production deployment

Local-only checklist for the first V1 production deploy. Do not treat this file as permission to push, deploy, or change DNS.

Intended Vercel project: `valcron-motors`
Public hosts: `valcronmotors.com`, `www.valcronmotors.com`

Vercel Hobby is technically capable. Commercial dealer use requires **Vercel Pro** under Vercel’s fair-use terms.

## Required environment variable names

Set these in Vercel Production (and Preview if you use it):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_SECRET_KEY`) — server-only, staff user admin

Optional:

- `NEXT_PUBLIC_SITE_URL` — only if the app later needs an explicit canonical origin
- `NEXT_PUBLIC_VALCRON_WHATSAPP` — digits only; public WhatsApp CTAs already have a code fallback

Never put values in git.

## Obsolete names to remove from Vercel

V1 does not read these. Delete them from the project if they still exist:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `META_*`
- WhatsApp Cloud / Graph tokens
- `OPENAI_API_KEY`
- `DATABASE_URL`
- `CRON_SECRET`
- Parts Direct keys
- Copart / IAA / Manheim API secrets

## Deploy sequence

1. Final git checkpoint on `main` after human end-to-end QA.
2. Push `main` to GitHub.
3. Confirm the Vercel project is `valcron-motors` and linked to that repo.
4. Configure the required environment variable names above.
5. Remove the obsolete names.
6. Verify domains: `valcronmotors.com` and `www.valcronmotors.com` point at the Vercel project. Do not change DNS from this repo.
7. Production deploy from `main`.
8. Smoke tests from [valcron-release-qa.md](./valcron-release-qa.md): login, create unpublished vehicle, confirm draft photo is not public, publish, public inventory, inquiry, logout.
9. Rollback: revert the GitHub commit on `main` and redeploy the previous production deployment in Vercel. Do not roll back by editing remote Supabase schema.

## After deploy

- First admin already exists. Do not recreate it unless login fails.
- Storage bucket `vehicle-images` stays private.
- Public images go through `/api/public/vehicle-images`.
- Homepage inventory cache is 60 seconds; publish actions invalidate it.

## Inquiry abuse protection

Public `/api/public/lead` uses field length limits, a honeypot (`empresa`), a 60-second duplicate fingerprint, a per-IP burst limit, and a 15-minute duplicate check in the database.

Limitation: the in-memory IP and fingerprint guards are per serverless instance. They reset on cold starts. The database duplicate window is the durable check. This is not a paid anti-fraud service.

## V1.1 (not a release blocker)

- Body style is not in the current vehicles schema. Do not add a remote migration for it in V1.
- Auction-origin public identity uses existing `source_type = other`. The public site can say “Disponible mediante subasta” but cannot show Copart/IAA/Manheim as a first-class public field without a schema change.
