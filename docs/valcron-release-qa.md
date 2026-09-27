# Valcron website — V1 release QA

Use this after a production-mode local run or a staging deploy. Check the box only when you saw the result yourself.

## LOGIN

- [ ] `/login` opens with Website Admin, not the public site header
- [ ] Wrong password shows a Spanish error, not a database message
- [ ] Correct admin user reaches `/admin`
- [ ] A non-admin user cannot open `/admin`

## ADMIN

- [ ] Left sidebar shows Dashboard, Inventario, Oportunidades, Solicitudes, Website
- [ ] Valcron logo and “Website Admin” are visible
- [ ] Ver website and Cerrar sesión work
- [ ] Phone menu opens the same navigation

## CREATE VEHICLE

- [ ] Agregar vehículo saves with year, make, and model only
- [ ] Price and description can stay empty on first save
- [ ] The create screen does not publish the unit
- [ ] After save you land on the vehicle editor

## PHOTOS

- [ ] Several photos can be chosen before the first save
- [ ] Local thumbnails appear
- [ ] After save, photos upload to the vehicle
- [ ] One photo can be marked PORTADA
- [ ] Photos can be reordered
- [ ] A photo can be deleted with confirmation
- [ ] Failed uploads can be retried

## DRAFT PRIVACY

- [ ] An unpublished vehicle does not appear on `/inventario`
- [ ] Its photo URL through `/api/public/vehicle-images` does not show the image
- [ ] Admin preview still shows the photos while logged in

## PREVIEW

- [ ] Vista previa opens the internal preview, even if unpublished
- [ ] Preview does not publish the vehicle
- [ ] Public permalink stays hidden until publish

## PUBLISH

- [ ] Publish is blocked without cover, price, description, and an allowed status
- [ ] The checklist says Obligatorio vs Recomendado
- [ ] Publish asks for confirmation
- [ ] After publish, the unit appears on `/inventario`

## PUBLIC INVENTORY

- [ ] Homepage featured units are published dealer stock when those exist
- [ ] `/inventario` shows cover, price, mileage, and availability
- [ ] Search and filters still work
- [ ] Sold units are not in the normal catalog list

## VEHICLE DETAIL

- [ ] `/inventario/[id]` shows cover, price, specs, description, WhatsApp, and request form
- [ ] Valcron stock says “Disponible en Valcron”
- [ ] Auction-origin units say “Disponible mediante subasta”
- [ ] Page title and share image look complete

## UNPUBLISH

- [ ] Retirar asks for confirmation
- [ ] The unit leaves `/inventario`
- [ ] Draft photos are not publicly readable

## RESERVE

- [ ] Reservar updates the badge
- [ ] A published reserved unit can still appear in inventory
- [ ] Public copy says Reservado

## SOLD

- [ ] Marcar vendido asks for confirmation
- [ ] Sold units leave the catalog list
- [ ] A published sold permalink can still open

## AUCTION OPPORTUNITY

- [ ] Agregar oportunidad accepts a Copart, IAA, or Manheim URL
- [ ] Provider and lot appear when the URL is recognizable
- [ ] Abrir lote original works for http/https links
- [ ] Saving the same provider + lot twice is rejected in Spanish
- [ ] Internal notes stay on the opportunity screen only

## AUCTION → WEBSITE

- [ ] Preparar para website creates one vehicle draft
- [ ] Doing it again opens the same draft, not a second vehicle
- [ ] The draft is unpublished
- [ ] Completing photos, price, and description is required before publish

## INQUIRY

- [ ] Public “Solicitar información” saves the customer and vehicle
- [ ] Success message appears
- [ ] The inquiry shows under Solicitudes → Nuevas
- [ ] En seguimiento and Cerrar work
- [ ] WhatsApp on the public page still works without creating an inquiry
- [ ] A second identical send within a minute is blocked

## MOBILE

- [ ] Check 390 and 430: admin menu, vehicle form, photos, inventory cards, auction form, inquiries, dialogs, public detail
- [ ] Check 768 and 1024: collapsible/full sidebar, no horizontal page scroll
- [ ] Check 1280 and 1440: table inventory and two-column forms

## SEO

- [ ] Inventory and detail have a sensible title
- [ ] Detail has an OG image when a cover exists
- [ ] Sold permalink is not listed in the catalog

## PERFORMANCE

- [ ] Public homepage does not feel like it waits on login
- [ ] Inventory still loads without live updating
- [ ] Maps on public pages stay lazy

## SECURITY

- [ ] `/admin` without a session goes to `/login`
- [ ] `/crm`, `/vehiculos`, `/repuestos` redirect away from legacy ERP
- [ ] `/api/scrape-auction`, `/api/webhooks/meta`, and `/api/public/parts` are gone
- [ ] Inquiry form does not accept an internal auction opportunity id
