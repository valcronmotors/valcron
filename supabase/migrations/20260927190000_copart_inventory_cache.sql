-- Copart official Sales Data cache.
-- Does not alter vehicles, vehicle_photos, auction_opportunities, or inquiries.
-- Apply exactly once via Supabase migration history.
-- Admin-only. Public website has no access.

create extension if not exists pg_trgm with schema extensions;

create table public.copart_feed_snapshots (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'staging'
    check (status in ('staging', 'active', 'failed', 'archived')),
  source_filename text,
  rows_read integer not null default 0 check (rows_read >= 0),
  row_count integer not null default 0 check (row_count >= 0),
  rows_rejected integer not null default 0 check (rows_rejected >= 0),
  rows_duplicates integer not null default 0 check (rows_duplicates >= 0),
  feed_last_updated timestamptz,
  facets jsonb not null default '{}'::jsonb,
  error_message text,
  imported_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.copart_feed_snapshots is
  'Copart Sales Data import generations. Search uses the single active snapshot. Staging never replaces active until activation succeeds.';

create unique index copart_feed_snapshots_one_active_uidx
  on public.copart_feed_snapshots (status)
  where status = 'active';

create index copart_feed_snapshots_status_idx
  on public.copart_feed_snapshots (status, imported_at desc);

create trigger copart_feed_snapshots_set_updated_at
  before update on public.copart_feed_snapshots
  for each row
  execute function public.set_updated_at();

create table public.copart_inventory_cache (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references public.copart_feed_snapshots (id) on delete cascade,
  lot_number text not null check (char_length(trim(lot_number)) > 0),
  vin text,
  year integer check (year is null or (year >= 1980 and year <= 2100)),
  make text,
  model text,
  model_detail text,
  trim text,
  mileage integer check (mileage is null or mileage >= 0),
  mileage_unit text check (mileage_unit is null or mileage_unit in ('mi', 'km')),
  body_style text,
  color text,
  primary_damage text,
  secondary_damage text,
  title_state text,
  title_type text,
  has_keys boolean,
  engine text,
  drive text,
  transmission text,
  fuel text,
  cylinders text,
  run_condition text,
  sale_status text,
  location_city text,
  location_state text,
  location text,
  sale_date date,
  sale_time text,
  estimated_retail_value numeric(12, 2) check (estimated_retail_value is null or estimated_retail_value >= 0),
  repair_cost numeric(12, 2) check (repair_cost is null or repair_cost >= 0),
  buy_it_now_price numeric(12, 2) check (buy_it_now_price is null or buy_it_now_price >= 0),
  currency text,
  thumbnail_url text,
  image_url text,
  seller_name text,
  feed_last_updated timestamptz,
  source_url text,
  search_text text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  constraint copart_inventory_cache_vin_format check (
    vin is null or vin ~ '^[A-HJ-NPR-Z0-9]{17}$'
  ),
  constraint copart_inventory_cache_source_url_https check (
    source_url is null or source_url ~ '^https://'
  ),
  constraint copart_inventory_cache_thumbnail_https check (
    thumbnail_url is null or thumbnail_url ~ '^https://'
  ),
  constraint copart_inventory_cache_image_url_https check (
    image_url is null or image_url ~ '^https://'
  )
);

comment on table public.copart_inventory_cache is
  'Normalized Copart Sales Data snapshot rows. Not website inventory. Admin search only. No raw CSV. No credentials.';

create unique index copart_inventory_cache_snapshot_lot_uidx
  on public.copart_inventory_cache (snapshot_id, lot_number);

create index copart_inventory_cache_snapshot_vin_idx
  on public.copart_inventory_cache (snapshot_id, vin);

create index copart_inventory_cache_snapshot_make_idx
  on public.copart_inventory_cache (snapshot_id, make);

create index copart_inventory_cache_snapshot_year_lot_idx
  on public.copart_inventory_cache (snapshot_id, year desc, lot_number desc);

create index copart_inventory_cache_snapshot_state_idx
  on public.copart_inventory_cache (snapshot_id, location_state);

create index copart_inventory_cache_snapshot_title_idx
  on public.copart_inventory_cache (snapshot_id, title_type);

create index copart_inventory_cache_snapshot_damage_idx
  on public.copart_inventory_cache (snapshot_id, primary_damage);

create index copart_inventory_cache_snapshot_run_idx
  on public.copart_inventory_cache (snapshot_id, run_condition);

create index copart_inventory_cache_snapshot_bin_idx
  on public.copart_inventory_cache (snapshot_id, buy_it_now_price);

create index copart_inventory_cache_snapshot_bin_partial_idx
  on public.copart_inventory_cache (snapshot_id)
  where buy_it_now_price > 0;

create index copart_inventory_cache_snapshot_mileage_idx
  on public.copart_inventory_cache (snapshot_id, mileage);

create index copart_inventory_cache_search_trgm_idx
  on public.copart_inventory_cache
  using gin (search_text gin_trgm_ops);

create index copart_inventory_cache_model_trgm_idx
  on public.copart_inventory_cache
  using gin (model gin_trgm_ops);

alter table public.copart_feed_snapshots enable row level security;
alter table public.copart_inventory_cache enable row level security;

revoke all on table public.copart_feed_snapshots from public;
revoke all on table public.copart_inventory_cache from public;
revoke all on table public.copart_feed_snapshots from anon;
revoke all on table public.copart_inventory_cache from anon;
revoke all on table public.copart_feed_snapshots from authenticated;
revoke all on table public.copart_inventory_cache from authenticated;

grant select on table public.copart_feed_snapshots to authenticated;
grant select on table public.copart_inventory_cache to authenticated;
grant all on table public.copart_feed_snapshots to service_role;
grant all on table public.copart_inventory_cache to service_role;

create policy copart_feed_snapshots_admin_select
  on public.copart_feed_snapshots
  for select
  to authenticated
  using ((select public.is_website_admin()));

create policy copart_inventory_cache_admin_select
  on public.copart_inventory_cache
  for select
  to authenticated
  using ((select public.is_website_admin()));

create or replace function public.activate_copart_feed_snapshot(
  p_snapshot_id uuid,
  p_row_count integer,
  p_rows_read integer,
  p_rows_rejected integer,
  p_rows_duplicates integer,
  p_feed_last_updated timestamptz,
  p_facets jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  activated integer;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'Only service_role can activate a Copart snapshot.';
  end if;

  perform pg_advisory_xact_lock(hashtext('activate_copart_feed_snapshot'));

  if not exists (
    select 1
    from public.copart_feed_snapshots
    where id = p_snapshot_id
      and status = 'staging'
  ) then
    raise exception 'Copart snapshot is not in staging.';
  end if;

  update public.copart_feed_snapshots
  set status = 'archived',
      completed_at = timezone('utc', now())
  where status = 'active';

  update public.copart_feed_snapshots
  set status = 'active',
      row_count = p_row_count,
      rows_read = p_rows_read,
      rows_rejected = p_rows_rejected,
      rows_duplicates = p_rows_duplicates,
      feed_last_updated = p_feed_last_updated,
      facets = coalesce(p_facets, '{}'::jsonb),
      error_message = null,
      imported_at = timezone('utc', now()),
      completed_at = timezone('utc', now())
  where id = p_snapshot_id
    and status = 'staging';

  get diagnostics activated = row_count;
  if activated <> 1 then
    raise exception 'Failed to activate Copart snapshot. Previous active snapshot was not replaced.';
  end if;

  delete from public.copart_feed_snapshots s
  where s.status = 'archived'
    and not exists (
      select 1
      from (
        select id
        from public.copart_feed_snapshots
        where status = 'archived'
        order by completed_at desc nulls last, imported_at desc
        limit 1
      ) keep
      where keep.id = s.id
    );

  delete from public.copart_feed_snapshots
  where status = 'failed';

  delete from public.copart_feed_snapshots
  where status = 'staging'
    and id is distinct from p_snapshot_id
    and imported_at < timezone('utc', now()) - interval '6 hours';
end;
$$;

comment on function public.activate_copart_feed_snapshot(uuid, integer, integer, integer, integer, timestamptz, jsonb) is
  'Promotes a staging Copart snapshot to active in one transaction. Raises if promotion fails so the previous active row is restored. Keeps one archived generation.';

revoke all on function public.activate_copart_feed_snapshot(uuid, integer, integer, integer, integer, timestamptz, jsonb) from public;
revoke all on function public.activate_copart_feed_snapshot(uuid, integer, integer, integer, integer, timestamptz, jsonb) from anon;
revoke all on function public.activate_copart_feed_snapshot(uuid, integer, integer, integer, integer, timestamptz, jsonb) from authenticated;
grant execute on function public.activate_copart_feed_snapshot(uuid, integer, integer, integer, integer, timestamptz, jsonb) to service_role;

create or replace function public.fail_copart_feed_snapshot(
  p_snapshot_id uuid,
  p_message text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.role() is distinct from 'service_role' then
    raise exception 'Only service_role can fail a Copart snapshot.';
  end if;

  perform pg_advisory_xact_lock(hashtext('activate_copart_feed_snapshot'));

  delete from public.copart_inventory_cache
  where snapshot_id = p_snapshot_id
    and exists (
      select 1
      from public.copart_feed_snapshots
      where id = p_snapshot_id
        and status = 'staging'
    );

  update public.copart_feed_snapshots
  set status = 'failed',
      error_message = left(coalesce(p_message, ''), 500),
      row_count = 0,
      completed_at = timezone('utc', now())
  where id = p_snapshot_id
    and status = 'staging';
end;
$$;

comment on function public.fail_copart_feed_snapshot(uuid, text) is
  'Marks a staging Copart snapshot failed and deletes only that snapshot cache. No-op if the snapshot is already active.';

revoke all on function public.fail_copart_feed_snapshot(uuid, text) from public;
revoke all on function public.fail_copart_feed_snapshot(uuid, text) from anon;
revoke all on function public.fail_copart_feed_snapshot(uuid, text) from authenticated;
grant execute on function public.fail_copart_feed_snapshot(uuid, text) to service_role;
