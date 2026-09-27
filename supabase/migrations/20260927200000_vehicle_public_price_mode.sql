-- Incremental local migration. Do not apply remotely until explicitly requested.
-- Adds customer-facing public price presentation without changing V1 inventory tables
-- beyond a new, defaulted column on vehicles.

alter table public.vehicles
  add column if not exists public_price_mode text not null default 'fixed';

alter table public.vehicles
  drop constraint if exists vehicles_public_price_mode_check;

alter table public.vehicles
  add constraint vehicles_public_price_mode_check
  check (public_price_mode in ('contact', 'from', 'estimated', 'fixed'));

comment on column public.vehicles.public_price_mode is
  'Customer-facing price presentation: contact, from, estimated, or fixed. Provider auction amounts are never this value.';

-- Auction-origin drafts currently live in source_type = other (Copart, IAA, Manheim).
-- Default those unpublished / unpriced rows to contact so they are not treated as US$0 stock.
update public.vehicles
set public_price_mode = 'contact'
where source_type = 'other'
  and public_price_mode = 'fixed'
  and (price is null or price = 0);
