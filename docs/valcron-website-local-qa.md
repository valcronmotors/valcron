# Local QA — Valcron website V1

Do this on the local app. Do not apply the migration or create remote data from this checklist unless a human explicitly asks.

## Admin

- `/admin` shows published, available, reserved, sold, drafts, opportunities, new inquiries
- Shortcuts: agregar vehículo, agregar oportunidad, ver solicitudes, ver website
- `/admin/inventario` filters and actions work on a phone-width screen
- Vehicle form sections are in Spanish and the publication checklist is visible
- Photos: select several, set cover, reorder, confirm delete
- Publish is blocked until required items are ready
- Unpublish and sold behave as designed
- `/admin/subastas` filters by house and status; URL paste detects Copart lot from the path
- Prepare for website creates an unpublished vehicle
- `/admin/solicitudes` can call, WhatsApp, email, and close a request
- `/admin/website` shows publication summary and featured units

## Public

- Empty inventory shows the professional contact message, not a database error
- `/inventario` cards show cover, price, availability
- `/inventario/[id]` gallery, specs, WhatsApp, quote form, related units
- Quote form validates name + phone or email, blocks double submit, shows success
- Image URLs are `/api/public/vehicle-images/...`, never public Storage CDN URLs

## Isolation

- `/vehiculos`, `/repuestos`, and `/crm` redirect away from the old ERP
- No service-role key in client bundles
