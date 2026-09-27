# Copart feed ingestion

## Snapshot strategy

Search never reads a half-imported file.

1. Insert a `copart_feed_snapshots` row with `status = staging`
2. Stream the CSV and batch-insert `copart_inventory_cache` rows for that snapshot
3. If validation fails or zero valid rows: `fail_copart_feed_snapshot` deletes staging cache rows only while status is still `staging`, marks the snapshot `failed`, and leaves the previous **active** snapshot searchable
4. If ingest completes: `activate_copart_feed_snapshot` archives the previous active snapshot, then marks the new one `active` in one transaction (service_role only). If promotion does not update exactly one row, the function raises and the previous active snapshot is restored.

Retention after a successful activation:

- 1 active snapshot
- 1 previous archived snapshot (rollback window)
- failed snapshots are deleted
- abandoned staging snapshots older than 6 hours are deleted (not the snapshot being activated)

On failed import, cache rows for that staging snapshot are deleted immediately so a bad run does not occupy a full extra generation. A timed-out activate that actually committed cannot be undone by `fail_copart_feed_snapshot`.

## Local import

```bash
npm run copart:import -- <path-to-salesdata.csv>
npm run copart:import -- <path-to-salesdata.csv> --write
```

`--write` uses `SUPABASE_SERVICE_ROLE_KEY` from `.env.local`. Do not run `--write` against production until the local migration has been applied in that project **on purpose**.

Reports: rows read, valid, rejected, duplicates, inserted, duration, feed timestamp (`Last Updated Time` max).

## Production refresh (recommended)

Do **not** download ~100 MB inside a Vercel request or cron on the website.

Recommended:

1. A scheduled **GitHub Action** or a small worker VM downloads/receives the official Copart Sales Data CSV through Copart’s authorized channel
2. The worker runs the same `copart:import --write` against production using the service role
3. Cadence: several times per day (the feed changes frequently). Admin copy never claims real-time
4. If Copart later offers a contracted API, replace only `src/lib/auction-providers/copart/*`; keep `auction_opportunities` and the website publish workflow

Supabase scheduled SQL cannot ingest a 100 MB CSV. Vercel serverless timeouts/memory are a poor fit for this file.

## Stale data

Admin Copart search shows **Última actualización del inventario Copart**. After 24 hours the UI warns that the snapshot may be outdated.

## Manual fallback

If the feed is missing, admins still paste a Copart/IAA/Manheim URL on **Agregar oportunidad**.
