-- Valcron website backend v1
-- Local migration only. Do not replay supabase/sql/.
-- Website catalog + admin CMS. Not CRM, ERP, DMS, or accounting.

create or replace function public.is_website_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

comment on function public.is_website_admin() is
  'True only when JWT app_metadata.role is admin. Any authenticated session is not enough.';

revoke all on function public.is_website_admin() from public;
grant execute on function public.is_website_admin() to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.vehicles_publication_defaults()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.published then
    if new.status not in ('available', 'reserved', 'sold') then
      raise exception 'A published vehicle must be available, reserved, or sold.';
    end if;
    if new.published_at is null then
      new.published_at = timezone('utc', now());
    end if;
  else
    new.published_at = null;
  end if;
  return new;
end;
$$;

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  stock_number text,
  vin text,
  year integer not null check (year >= 1980 and year <= 2100),
  make text not null check (char_length(trim(make)) > 0),
  model text not null check (char_length(trim(model)) > 0),
  trim text,
  mileage integer check (mileage is null or mileage >= 0),
  mileage_unit text not null default 'mi' check (mileage_unit in ('mi', 'km')),
  exterior_color text,
  interior_color text,
  engine text,
  transmission text,
  drivetrain text,
  fuel text,
  condition text,
  title_status text,
  description text,
  price numeric(12, 2) check (price is null or price >= 0),
  currency text not null default 'USD' check (currency in ('USD', 'DOP')),
  location text,
  source_type text not null default 'valcron_stock'
    check (source_type in ('valcron_stock', 'consignment', 'trade_in', 'other')),
  status text not null default 'draft'
    check (status in ('draft', 'available', 'reserved', 'sold', 'hidden')),
  featured boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint vehicles_vin_format check (
    vin is null or vin ~ '^[A-HJ-NPR-Z0-9]{17}$'
  ),
  constraint vehicles_stock_not_blank check (
    stock_number is null or char_length(trim(stock_number)) > 0
  ),
  constraint vehicles_published_status check (
    published = false or status in ('available', 'reserved', 'sold')
  )
);

comment on table public.vehicles is
  'Public website inventory. Publication requires published = true. Status alone never publishes.';

create unique index vehicles_stock_number_uidx
  on public.vehicles (stock_number)
  where stock_number is not null;

create unique index vehicles_vin_uidx
  on public.vehicles (upper(vin))
  where vin is not null;

create index vehicles_public_idx
  on public.vehicles (published, status, featured, year desc);

create index vehicles_make_model_idx
  on public.vehicles (lower(make), lower(model));

create index vehicles_updated_at_idx
  on public.vehicles (updated_at desc);

create trigger vehicles_set_updated_at
  before update on public.vehicles
  for each row
  execute function public.set_updated_at();

create trigger vehicles_publication_defaults
  before insert or update on public.vehicles
  for each row
  execute function public.vehicles_publication_defaults();

create table public.vehicle_photos (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  storage_path text not null check (char_length(trim(storage_path)) > 0),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_cover boolean not null default false,
  alt_text text,
  created_at timestamptz not null default timezone('utc', now())
);

comment on table public.vehicle_photos is
  'Vehicle image metadata. Binaries live in Storage bucket vehicle-images.';

create unique index vehicle_photos_one_cover_uidx
  on public.vehicle_photos (vehicle_id)
  where is_cover;

create unique index vehicle_photos_storage_path_uidx
  on public.vehicle_photos (storage_path);

create index vehicle_photos_vehicle_order_idx
  on public.vehicle_photos (vehicle_id, sort_order);

create or replace function public.vehicle_photos_enforce_cover()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.is_cover then
    update public.vehicle_photos
    set is_cover = false
    where vehicle_id = new.vehicle_id
      and id is distinct from new.id
      and is_cover;
  end if;
  return new;
end;
$$;

create trigger vehicle_photos_enforce_cover
  before insert or update of is_cover on public.vehicle_photos
  for each row
  execute function public.vehicle_photos_enforce_cover();

create table public.auction_opportunities (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('copart', 'iaa', 'manheim', 'other')),
  provider_lot_id text,
  source_url text,
  vin text,
  year integer check (year is null or (year >= 1980 and year <= 2100)),
  make text,
  model text,
  trim text,
  mileage integer check (mileage is null or mileage >= 0),
  title_status text,
  primary_damage text,
  location text,
  auction_metadata jsonb not null default '{}'::jsonb,
  internal_notes text,
  status text not null default 'draft'
    check (status in ('draft', 'review', 'published', 'archived')),
  linked_vehicle_id uuid references public.vehicles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint auction_opportunities_vin_format check (
    vin is null or vin ~ '^[A-HJ-NPR-Z0-9]{17}$'
  ),
  constraint auction_opportunities_lot_not_blank check (
    provider_lot_id is null or char_length(trim(provider_lot_id)) > 0
  )
);

comment on table public.auction_opportunities is
  'Internal auction watchlist. Never a substitute for vehicles. No costs or payments.';

create unique index auction_opportunities_provider_lot_uidx
  on public.auction_opportunities (provider, provider_lot_id)
  where provider_lot_id is not null;

create index auction_opportunities_status_idx
  on public.auction_opportunities (status, updated_at desc);

create index auction_opportunities_linked_vehicle_idx
  on public.auction_opportunities (linked_vehicle_id);

create trigger auction_opportunities_set_updated_at
  before update on public.auction_opportunities
  for each row
  execute function public.set_updated_at();

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles (id) on delete set null,
  auction_opportunity_id uuid references public.auction_opportunities (id) on delete set null,
  name text not null check (char_length(trim(name)) > 0),
  phone text,
  email text,
  message text,
  source text not null default 'web' check (source in ('web', 'whatsapp', 'other')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default timezone('utc', now()),
  constraint inquiries_contact_required check (
    (phone is not null and char_length(trim(phone)) > 0)
    or (email is not null and char_length(trim(email)) > 0)
  )
);

comment on table public.inquiries is
  'Website contact requests. Public insert only. Not a CRM pipeline.';

create index inquiries_status_created_idx
  on public.inquiries (status, created_at desc);

create index inquiries_vehicle_idx
  on public.inquiries (vehicle_id);

create index inquiries_auction_idx
  on public.inquiries (auction_opportunity_id);

alter table public.vehicles enable row level security;
alter table public.vehicle_photos enable row level security;
alter table public.auction_opportunities enable row level security;
alter table public.inquiries enable row level security;

revoke all on table public.vehicles from public;
revoke all on table public.vehicle_photos from public;
revoke all on table public.auction_opportunities from public;
revoke all on table public.inquiries from public;

grant select on table public.vehicles to anon, authenticated;
grant insert, update, delete on table public.vehicles to authenticated;

grant select on table public.vehicle_photos to anon, authenticated;
grant insert, update, delete on table public.vehicle_photos to authenticated;

grant select, insert, update, delete on table public.auction_opportunities to authenticated;

grant insert on table public.inquiries to anon, authenticated;
grant select, update on table public.inquiries to authenticated;

create policy vehicles_select_public
  on public.vehicles
  for select
  to anon, authenticated
  using (
    public.is_website_admin()
    or (
      published = true
      and status in ('available', 'reserved', 'sold')
    )
  );

create policy vehicles_insert_admin
  on public.vehicles
  for insert
  to authenticated
  with check (public.is_website_admin());

create policy vehicles_update_admin
  on public.vehicles
  for update
  to authenticated
  using (public.is_website_admin())
  with check (public.is_website_admin());

create policy vehicles_delete_admin
  on public.vehicles
  for delete
  to authenticated
  using (public.is_website_admin());

create policy vehicle_photos_select_public
  on public.vehicle_photos
  for select
  to anon, authenticated
  using (
    public.is_website_admin()
    or exists (
      select 1
      from public.vehicles v
      where v.id = vehicle_photos.vehicle_id
        and v.published = true
        and v.status in ('available', 'reserved', 'sold')
    )
  );

create policy vehicle_photos_insert_admin
  on public.vehicle_photos
  for insert
  to authenticated
  with check (public.is_website_admin());

create policy vehicle_photos_update_admin
  on public.vehicle_photos
  for update
  to authenticated
  using (public.is_website_admin())
  with check (public.is_website_admin());

create policy vehicle_photos_delete_admin
  on public.vehicle_photos
  for delete
  to authenticated
  using (public.is_website_admin());

create policy auction_opportunities_admin_all
  on public.auction_opportunities
  for all
  to authenticated
  using (public.is_website_admin())
  with check (public.is_website_admin());

create policy inquiries_insert_public
  on public.inquiries
  for insert
  to anon, authenticated
  with check (
    status = 'new'
    and source in ('web', 'whatsapp', 'other')
    and char_length(trim(name)) > 0
    and (
      (phone is not null and char_length(trim(phone)) > 0)
      or (email is not null and char_length(trim(email)) > 0)
    )
    and auction_opportunity_id is null
    and (
      vehicle_id is null
      or exists (
        select 1
        from public.vehicles v
        where v.id = vehicle_id
          and v.published = true
          and v.status in ('available', 'reserved', 'sold')
      )
    )
  );

create policy inquiries_select_admin
  on public.inquiries
  for select
  to authenticated
  using (public.is_website_admin());

create policy inquiries_update_admin
  on public.inquiries
  for update
  to authenticated
  using (public.is_website_admin())
  with check (public.is_website_admin());

-- Private bucket: Storage CDN public URLs must not serve draft objects.
-- Published delivery is the website proxy /api/public/vehicle-images/...
-- which uses the anon key and the SELECT policy below. Admin preview is
-- /api/admin/vehicle-images/... with an admin session. Writes stay admin-only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehicle-images',
  'vehicle-images',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists vehicle_images_select on storage.objects;
drop policy if exists vehicle_images_insert on storage.objects;
drop policy if exists vehicle_images_update on storage.objects;
drop policy if exists vehicle_images_delete on storage.objects;

create policy vehicle_images_select
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'vehicle-images'
    and (
      public.is_website_admin()
      or exists (
        select 1
        from public.vehicle_photos p
        join public.vehicles v on v.id = p.vehicle_id
        where p.storage_path = name
          and v.published = true
          and v.status in ('available', 'reserved', 'sold')
      )
    )
  );

create policy vehicle_images_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'vehicle-images'
    and public.is_website_admin()
  );

create policy vehicle_images_update
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'vehicle-images'
    and public.is_website_admin()
  )
  with check (
    bucket_id = 'vehicle-images'
    and public.is_website_admin()
  );

create policy vehicle_images_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'vehicle-images'
    and public.is_website_admin()
  );

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'vehicles'
  ) then
    alter publication supabase_realtime add table public.vehicles;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'vehicle_photos'
  ) then
    alter publication supabase_realtime add table public.vehicle_photos;
  end if;
end;
$$;
