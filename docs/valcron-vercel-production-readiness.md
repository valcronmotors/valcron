# Valcron website — Vercel production readiness

Audit of the local application only. This file does not deploy, push, or change the Vercel project.

Intended host: Vercel Hobby.
Production hosts: `valcronmotors.com`, `www.valcronmotors.com`.
Optional rewrite host in code: `admin.valcronmotors.com` (not required for the public site).

There is **no** `vercel.json`. Next.js 16.3.5 App Router is enough. Do not add Pro-only products (Blob, KV, Firewall add-ons, Speed Insights Plus, Image Optimization overage) unless usage actually exceeds Hobby included amounts.

## Architecture vs plan policy

The **code** fits Hobby technically: static marketing pages, 60-second ISR for the homepage inventory island, Node functions (no Edge runtime on routes), no cron, no realtime on public pages, on-demand `updateTag` / `revalidatePath` after publish.

Vercel’s **fair use** policy restricts Hobby to non-commercial personal use. ValcronMotors.com advertises vehicles for sale. That is commercial usage. **Pro is required to host this production domain in compliance with Vercel’s terms**, even though no Pro-only *feature* is required.

## Runtime

| Surface | Runtime | Notes |
|---|---|---|
| Pages / Server Actions | Node (default) | No `export const runtime = "edge"` |
| `src/proxy.ts` (Next.js 16 middleware) | Edge / Fluid routing | Matcher skips static assets and the public image proxy |
| API routes | Node | Dynamic where they mutate or stream files |

Hobby function duration default is 300s. Image proxy downloads are well under that. No `maxDuration` override is needed. No multi-region config (Pro). Default single region is correct.

## Middleware / proxy

`src/proxy.ts` matcher excludes:

- `/_next/static`
- `/_next/image`
- `favicon.ico`
- `/api/public/vehicle-images`
- common image file extensions

Anonymous public HTML does **not** call `auth.getClaims()`. Session refresh runs only when a Supabase auth cookie is present. `/admin` still redirects to `/login` when unauthenticated.

Static marketing HTML can still be cached at the CDN after a cheap `next()` from proxy.

## Build output (local `next build`)

Observed:

- Static (`○`): `/`, `/contacto`, `/blog`, `/guias`, `/blog/[slug]`, `/guias/[slug]`, calculators, legal, marketing pages, `/sitemap.xml`, `/robots.txt`
- `/` revalidate **1m** (ISR) because featured inventory uses `unstable_cache` 60s
- Dynamic (`ƒ`): `/inventario`, `/inventario/[id]`, `/login`, all `/admin/*`, all `/api/*`
- Legacy `/crm`, `/vehiculos`, `/repuestos` still exist as redirect stubs

## Route classes

### Static (prerender, no database)

`/blog`, `/blog/[slug]`, `/guias`, `/guias/[slug]`, `/contacto`, `/nosotros`, `/servicios`, `/financiamiento`, `/importacion`, `/subastas`, `/como-funciona`, `/preguntas-frecuentes`, `/solicitar-vehiculo`, `/calculadoras` (+ nested), `/mapa-del-sitio`, `/privacidad`, `/terminos`, `/cookies`, `/politicas`, `/robots.txt`

These are code/content, not CMS.

### ISR / tagged cache

- `/` — static shell + 60s catalog cache, tag `public-inventory`
- Catalog data inside `/inventario` (page is dynamic because of `searchParams`, data is still `unstable_cache` 60s)
- `/sitemap.xml` — generated at build; publish actions call `revalidatePath("/sitemap.xml")`

Publish, unpublish, photos, and status changes call `updateTag("public-inventory")` plus `revalidatePath` for `/`, `/inventario`, vehicle permalinks, and sitemap. Public realtime is not used.

### Dynamic (must stay on-demand)

- `/inventario` — `searchParams`
- `/inventario/[id]` — per-vehicle lookup, sold permalink, UUID → slug redirect
- `/login`
- `/api/public/lead` (POST)
- `/api/public/vehicles` (optional JSON; catalog UI no longer depends on it)
- `/api/public/vehicle-images/[...path]`
- Retired and removed: `/api/scrape-auction`, `/api/public/parts`, `/api/webhooks/meta`

### Admin (always dynamic / private)

All `/admin`, `/admin/*`, `/api/admin/vehicle-images/[...path]`. Cookie session + `app_metadata.role = admin`. Not publicly cacheable. Preview images are `private, no-store`.

Legacy `/vehiculos` and `/repuestos` redirect into admin and stay dynamic.

## Image strategy

**Marketing photography (Unsplash) and local chrome (`/logo-mark.png`, `/hero-luxury.png`):** `next/image` with `formats: avif, webp`, `minimumCacheTTL: 3600`, `sizes` set. Few unique sources. Fits Hobby **5,000 transformations / month** if vehicle photos are *not* pushed through `/_next/image`.

**Published vehicle photos:** private Storage → `/api/public/vehicle-images/...` with

`public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800`

`VehiclePhoto` skips the Vercel Image Optimization pipeline for those proxy URLs (`shouldUseNextImageOptimizer`). That avoids one transformation per width × format × photo, which would blow the 5k Hobby cap once inventory grows.

**Admin drafts:** `/api/admin/vehicle-images/...`, `private, no-store`, session only.

**Risk if optimizer were used on every vehicle photo:** 30 units × several photos × many device widths × avif/webp exceeds 5k transformations. Current code avoids that.

## Function-heavy routes

These invoke Node functions (or Fluid) more than static HTML:

1. `/api/public/vehicle-images/[...path]` — Storage download + authz. CDN `s-maxage` should absorb repeats after the first hit.
2. `/api/admin/vehicle-images/[...path]` — admin only, uncached.
3. `/inventario` and `/inventario/[id]` — server render + cached/anon Supabase reads.
4. `/admin/*` and Server Actions (`vehicles`, `inquiries`, `auctions`, `users`, `auth`).
5. `/api/public/lead` — inquiry POST.

`/api/public/vehicles` is leftover JSON; the public catalog no longer refetches it on mount.

Hobby includes 1M function invocations and 4 CPU-hours. A small dealer site is far below that if image CDN caching works.

## Environment variables

### Required in Vercel (names only)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### Required for team-user admin screens only

- `SUPABASE_SERVICE_ROLE_KEY`
  Alias accepted in code: `SUPABASE_SECRET_KEY` (set one, not both).

### Optional

- `NEXT_PUBLIC_VALCRON_WHATSAPP` — digits only; falls back to the number in `src/lib/site.ts`

Do not set any `NEXT_PUBLIC_*` service-role key.

### Obsolete (old CRM / ERP / Meta / DO Dealer — do not add)

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (replaced by publishable key)
- `META_*`, WhatsApp Cloud, Instagram Graph, webhook verify tokens
- `OPENAI_API_KEY` / IA inbox keys
- Copart / IAA / Manheim API credentials
- `DATABASE_URL` / Prisma URLs
- `CRON_SECRET`
- Parts Direct company keys

`NODE_ENV` is set by Vercel. No cron secrets.

## Redirects and domains

Code:

- `next.config.ts` host rewrite: `admin.valcronmotors.com` `/` → `/admin`
- `/catalogo` → `/inventario`
- `/crm` → `/admin`
- `/vehiculos` → `/admin/inventario`
- `/repuestos` → `/admin`
- UUID vehicle URLs permanently redirect to the slug permalink

**Dashboard (human, not this audit):** attach `valcronmotors.com` and `www.valcronmotors.com`. Prefer a 308 from `www` → apex so it matches `SITE.url` (`https://valcronmotors.com`). That is a Vercel domain setting, not a repo file.

## Cron

**No.** No `vercel.json` crons, no `app/api/cron`, no scheduled scrapers. Auction extraction is not configured. Meta webhook is 410.

## Old DO Dealer / CRM assumptions still in the tree

Dead routes and modules remain (`/crm`, `/vehiculos`, `/repuestos`, `messaging.ts`, scrape stub). They are isolated from public navigation. They still compile into the Next app, so they add a little build weight, not a Hobby plan feature. Do not reconnect Meta or ERP env vars.

## Pro-only features used?

None: no KV, Blob, Postgres-on-Vercel, Firewall custom rules beyond defaults, Secure Compute, or Image Optimization overage by design.

## Remaining Vercel blockers (human)

1. **Commercial fair use** — production dealer site belongs on **Pro**, not Hobby, per Vercel policy.
2. Attach apex + `www` and choose the canonical redirect.
3. Set the env var **names** listed above on the Vercel project (values stay in the dashboard, never in git).
4. Apply the V1 migration and admin JWT **before** the first production deploy (already done remotely per current ops; still a go-live checklist item).
5. Watch Hobby **5k image transformations** only if someone later re-enables Next optimizer on vehicle proxy URLs.
6. Optional: `admin.valcronmotors.com` DNS if the dealer wants a separate admin host; `/admin` on the public domain already works.

---

## VERCEL HOBBY READINESS

**Hobby sufficient:** YES (architecture and included compute/image caps for this dealer site)

**Pro required:** YES (Vercel fair-use: commercial production of valcronmotors.com)

**Reason:**
The app is a mostly-static marketing site plus ISR catalog, a cached image proxy, and a small authenticated admin. That does not need Pro features. Hosting a business that sells vehicles on Vercel *does* require Pro under current Hobby commercial-use rules. Use Pro for production; Hobby is fine for personal previews.

**Static routes:**
`/blog`, `/blog/[slug]`, `/guias`, `/guias/[slug]`, `/contacto`, `/nosotros`, `/servicios`, `/financiamiento`, `/importacion`, `/subastas`, `/como-funciona`, `/preguntas-frecuentes`, `/solicitar-vehiculo`, `/calculadoras`, `/calculadoras/financiamiento`, `/calculadoras/importacion`, `/calculadoras/subasta`, `/mapa-del-sitio`, `/privacidad`, `/terminos`, `/cookies`, `/politicas`, `/robots.txt`

**ISR routes:**
`/` (1m + tag `public-inventory`), catalog payload used by `/inventario`, `/sitemap.xml` (revalidated on publish)

**Dynamic routes:**
`/inventario`, `/inventario/[id]`, `/login`, `/catalogo` (redirect), `/api/public/lead`, `/api/public/vehicles`, `/api/public/vehicle-images/[...path]`, `/crm`, `/vehiculos`, `/repuestos` (legacy redirects)

**Admin routes:**
`/admin`, `/admin/inventario`, `/admin/inventario/nuevo`, `/admin/inventario/[id]`, `/admin/subastas`, `/admin/subastas/nuevo`, `/admin/subastas/[id]`, `/admin/solicitudes`, `/admin/website`, `/admin/usuarios`, `/admin/configuracion/usuarios`, `/admin/[...slug]`, `/api/admin/vehicle-images/[...path]`

**Image strategy:**
Unsplash + local chrome via Next/Image (few unique files). Published vehicle files via private Storage and the public proxy with hour/day CDN cache. Proxy URLs are `unoptimized` for Next/Image so Hobby’s 5k transformations are not spent on every thumbnail width. Admin previews are private `no-store`.

**Expected function-heavy routes:**
`/api/public/vehicle-images/[...path]`, `/api/admin/vehicle-images/[...path]`, `/inventario`, `/inventario/[id]`, `/admin/*` + Server Actions, `/api/public/lead`

**Required production env vars:**
`NEXT_PUBLIC_SUPABASE_URL`
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
`SUPABASE_SERVICE_ROLE_KEY` (needed to invite additional admins; first admin can exist without it)

**Obsolete env vars:**
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `META_*`, WhatsApp Cloud / Graph tokens, `OPENAI_API_KEY`, Copart/IAA/Manheim secrets, `DATABASE_URL`, `CRON_SECRET`, Parts Direct keys

**Cron required:** NO

**Remaining Vercel blockers:**
Commercial fair-use (use Pro for valcronmotors.com); attach `www` + apex and canonical redirect in the Vercel dashboard; set env names in the project (never commit values); do not re-enable Next optimizer on vehicle proxy URLs without watching the 5k transformation cap.
