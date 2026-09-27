# Copart official Sales Data integration

This is **not scraping**.

Valcron reads Copart’s official **Sales Data CSV** downloaded from the authenticated Copart member portal. There is no HTML crawl, no Playwright, no Jina, no reverse-engineered private API, and no stored Copart password.

## Official source

- File: Copart Sales Data CSV (`salesdata.csv`)
- Inspected header count: **59 columns**
- Notable quoted header: `High Bid =non-vix,Sealed=Vix` (comma inside quotes)
- Image hosts observed in the real feed:
  - thumbnail: `cs.copart.com` (often host-relative, no scheme)
  - image reference: `inventoryv2.copart.io`
- Lot URL pattern already used by Valcron: `https://www.copart.com/lot/{lotNumber}`

The full ~100 MB feed must stay **out of Git**. Import it locally:

```bash
npm run copart:import -- "C:\Users\gamie\Downloads\salesdata.csv"
```

That command is dry-run by default and does not write to Supabase. Persist a snapshot only with `--write` after the local migration exists.

## Mapping

Exact official headers live in `src/lib/auction-providers/copart/schema.ts`.

Normalized internal model: `AuctionSearchVehicle`.

Unavailable values are `null`. Copart `0.0` money fields are treated as empty, not as a $0 offer.

## Search

Admin → Oportunidades → **Copart**

- Server-side filter, sort, pagination (36 per page)
- Search: make / model / VIN / lot / free text
- Filters: make, model, year, location, title type, primary damage, run condition, Buy It Now, mileage
- Cards never show raw CSV column names

IAA and Manheim tabs are placeholders. Manual URL paste remains available.

## Images

Only official feed `Image Thumbnail` and `Image URL` values, validated against Copart hosts and upgraded to `https`. Valcron does **not** crawl extra image pages or copy Copart binaries into Storage.

## Opportunities

**Agregar a oportunidades** creates one `auction_opportunities` row (`provider = copart`). Duplicate `provider + provider_lot_id` shows:

“Este lote ya está en tus oportunidades.” with a link to the existing record.

Selected metadata is stored in `auction_metadata`. Bid columns and credentials are never stored.

## Website workflow

Copart search → opportunity → review → Preparar para website → unpublished vehicle draft → photos / price / description → preview → publish.

Public identity for `source_type = other` remains **Disponible mediante subasta**. Copart Buy It Now / retail / repair values are never used as Valcron’s public price.

## Security

`copart_feed_snapshots` and `copart_inventory_cache` are admin-select only. Anon has no grants. Public pages do not query the cache.

## Limitations

- Not real-time
- Requires a periodic official CSV import
- Title types are Copart codes (not invented labels)
- Future IAA / Manheim adapters are not implemented
