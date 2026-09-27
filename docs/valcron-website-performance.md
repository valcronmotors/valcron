# Valcron website performance

Local-only notes. No remote schema, deploy, or production changes.

## Bottlenecks found

1. **Middleware auth on every public request**
   `updateSession()` called `auth.getClaims()` for `/`, `/inventario`, and even image proxy traffic. That is a network round-trip before HTML or photos.

2. **Homepage waterfall**
   `Home()` awaited the full inventory before rendering the hero, search, or marketing sections.

3. **Duplicate inventory work**
   SSR loaded vehicles, then client components fetched `/api/public/vehicles` with `cache: "no-store"` and opened Supabase realtime websockets on home and catalog.

4. **Oversized public queries**
   Catalog/detail/similar/sitemap loaded every published row with every photo. Cover thumbs paid for full galleries.

5. **Image and embed cost**
   Unsplash heroes at `w=1920&q=80`, kenburns on LCP, Google Maps iframe in the footer of almost every public page, three font families / many weights, framer-motion on heroes.

6. **Admin dashboard**
   Serial-looking full-row reads: all vehicles with photos, all inquiries, all auction opportunities, plus `getUser()` after `getClaims()`.

## Changes made

- Public pages with no auth cookie skip Supabase session work. Image proxy is outside the middleware matcher.
- Homepage streams: hero and search render immediately; featured inventory is a `Suspense` island.
- Inventory page streams the hero, then the catalog.
- Public realtime and client `no-store` refetches removed. Publication uses `updateTag("public-inventory")` plus `revalidatePath`.
- Catalog query: list columns + one cover-photo query. Detail: one vehicle by id (slug index is id/year/make/model/trim only). Similar: limited list + covers. Sitemap: no photos.
- `unstable_cache` 60s, tag `public-inventory`, cookie-less anon client (so public pages are not forced dynamic by `cookies()`).
- Maps load only when visible, and not in the global footer.
- Fonts: Inter + Plus Jakarta Sans, `display: "swap"`. Geist Mono removed from the public layout.
- Hero/editorial sources reduced; LCP images use `priority` / `fetchPriority="high"`; kenburns removed from primary heroes.
- Admin dashboard: parallel lean selects + count; profile from JWT claims (no extra `getUser()`).
- Route skeletons for `/inventario` and `/admin`.
- Public chrome is a separate client chunk so `/admin` does not download Navbar/Footer/WhatsApp.

## Cache strategy

| Surface | Behavior |
|---|---|
| Marketing copy (hero, blog, guías, contacto copy) | Rendered with the page. No database. |
| Published catalog | Cached 60s (`unstable_cache`). Tag `public-inventory`. |
| Vehicle detail | Targeted query, request-deduped with `cache()`. |
| Public image proxy | `public, max-age=3600, s-maxage=86400` when authorized; `private, no-store` when denied. |
| Admin | Always dynamic/authenticated. Not publicly cached. |
| Publish / unpublish / photo / status actions | `updateTag("public-inventory")` and `revalidatePath` for `/`, `/inventario`, and the vehicle permalink. |

Do not use blanket `no-store` on public inventory.

## Realtime

Removed from public home and catalog. Publication invalidation is enough for a dealer website. Legacy ERP `useInventorySync` remains on unused `/vehiculos` and `/repuestos` code and is not on V1 public/admin routes.

## Before / after (code-path evidence, not fabricated Lighthouse)

Homepage **before:** auth round-trip → full inventory query → full HTML → client supabase JS → websocket → second inventory fetch.
Homepage **after:** no auth on anonymous public HTML → hero HTML immediately → featured inventory streamed from a 60s cache → no public websocket.

Inventory **before:** same auth tax + full rows/photos + client refetch + realtime.
Inventory **after:** hero first; one cached list+covers query; client filters only.

Admin **before:** claims + getUser + all vehicles with photos + all inquiries + all opportunities.
Admin **after:** claims for the shell; dashboard in parallel without photo blobs or `select *`.

## Remaining limitations

- First catalog miss still hits Supabase (empty DB is fast; large photo files are not).
- Next/Image still goes through `/api/public/vehicle-images/...` per variant.
- Unsplash remote images remain on marketing photography.
- Admin inventory list still loads photos for the table cover (needed for the UI).
- `next dev` is slower than `next start`. Judge speed on a production build.
- Live Lighthouse was not run in this pass (browser could not reliably target this machine’s localhost earlier).

## How to measure locally

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
npm run start
```

Then open `/`, `/inventario`, `/contacto`, `/admin` on the production server, not `next dev`.
