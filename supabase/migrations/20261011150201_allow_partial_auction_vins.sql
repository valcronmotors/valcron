-- Allow partial/masked VINs on auction drafts; vehicles keep strict VIN validation.
alter table public.auction_opportunities
  drop constraint if exists auction_opportunities_vin_format;
alter table public.auction_opportunities
  add constraint auction_opportunities_vin_format
  check (vin is null or char_length(vin) between 1 and 64);
comment on constraint auction_opportunities_vin_format on public.auction_opportunities is
  'Auction drafts preserve partial or masked VINs. Publication eligibility validates the allowed prefixes. Vehicles retain the strict 17-character constraint.';
