-- Auction purchase estimate (Gabriel, 2026-11-27): the public auction price is
-- purchase estimate + auction fees + US$1,500 profit. The landed estimate stays
-- as an internal reference; it is no longer the published price.
alter table public.vehicles
  add column if not exists auction_purchase_estimate_usd numeric(14,2)
    check (auction_purchase_estimate_usd > 0);

comment on column public.vehicles.auction_purchase_estimate_usd is
  'Admin-entered estimated auction purchase price (hammer) in USD for source_type = other. Public price = this amount + auction fees (import calculator schedule) + 1500. Null = fall back to the previous public price behavior.';
