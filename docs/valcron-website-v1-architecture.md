# Valcron website V1 architecture

Website catalog and CMS only. Not CRM, ERP, DMS, accounting, or DO Dealer.

## What exists

- Tables: `vehicles`, `vehicle_photos`, `auction_opportunities`, `inquiries`
- Admin: Dashboard, Inventario, Oportunidades de subasta, Solicitudes, Website
- Public catalog with `published = true` and status available, reserved, or sold
- Private Storage bucket `vehicle-images`
- Public image proxy `/api/public/vehicle-images/...`
- Admin image preview `/api/admin/vehicle-images/...`

## What does not exist

- Automatic Copart / IAA / Manheim data extraction
- Payments, costs, DGII, accounting
- CRM pipeline
- Blog/guide CMS (those pages stay static)

## Publishing

A vehicle is public only when it is published **and** available, reserved, or sold. Status alone never publishes. Featured is independent of published. Sold units leave the catalog list but keep a published detail permalink.

## Images

The bucket is private. Draft photos are not publicly retrievable. Published photos are served through the website proxy. Unpublish keeps files for the editor and the public route returns 404. Deleting a vehicle removes photo rows and Storage objects.

## Inquiries

Public visitors can insert a contact request. They cannot read inquiries. Admins update status only.

## Auction opportunities

Internal watchlist. They never appear in the public catalog until an admin prepares a vehicle draft, completes photos and price, then publishes.

## Admin access

Requires `app_metadata.role = admin`. Any logged-in session is not enough. Do not put the service role in `NEXT_PUBLIC_*` variables.

See also `docs/valcron-website-performance.md` and `docs/valcron-vercel-production-readiness.md`.
