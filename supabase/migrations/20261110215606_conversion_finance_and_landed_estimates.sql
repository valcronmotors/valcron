-- Additive conversion fields; existing prices, publication and photo data stay intact.
alter table public.vehicles
  add column down_payment_dop numeric(14,2) check (down_payment_dop >= 0),
  add column landed_estimate_usd numeric(14,2) check (landed_estimate_usd > 0),
  add column landed_estimate_validated boolean not null default false,
  add constraint vehicles_validated_landed_estimate_check
    check (not landed_estimate_validated or (landed_estimate_usd is not null));

comment on column public.vehicles.down_payment_dop is 'Approved listing down payment in DOP; optional, independent of sale price.';
comment on column public.vehicles.landed_estimate_usd is 'Admin-entered estimated total landed in RD; never an auction purchase price.';
comment on column public.vehicles.landed_estimate_validated is 'Only validated landed estimates may be displayed publicly. Admin confirms the lot-specific estimate.';

-- Gabriel's approved initial for the existing CR-V SE. Match business attributes,
-- not generated identifiers. Never alter the price or apply to future lookalikes.
do $$
begin
  if (select count(*) from public.vehicles where year = 2022 and make = 'Honda'
      and model = 'CR-V' and trim = 'Special Edition' and source_type = 'valcron_stock'
      and price = 26900 and currency = 'USD') <> 1 then
    raise exception 'Expected exactly one approved CR-V SE 2022 listing';
  end if;
  update public.vehicles set down_payment_dop = 300000
  where year = 2022 and make = 'Honda' and model = 'CR-V' and trim = 'Special Edition'
    and source_type = 'valcron_stock' and price = 26900 and currency = 'USD';
end $$;

-- Exact lot-specific estimates supplied and validated by Gabriel on 2026-11-10.
do $$
declare affected integer;
begin
  with approved(lot, amount) as (values
('67896976', 35900),
('68786116', 29900),
('69502526', 13500),
('68917126', 19500),
('72553466', 26500),
('75293786', 27900),
('73551196', 24900),
('72482616', 21900),
('72142896', 23900),
('74977016', 27900),
('56951666', 33900),
('71912196', 16900),
('75962046', 26900),
('58094906', 29900),
('69734676', 23900),
('73658466', 19900),
('74680566', 39900),
('73856846', 25900),
('73321896', 19900),
('72242456', 12900),
('71425006', 23900),
('70648506', 34900),
('73905966', 14800),
('73253866', 38900),
('74117426', 21900),
('74464476', 23900),
('50308736', 25400),
('66796526', 43900),
('57151936', 9300),
('74686286', 15500),
('70815666', 12400),
('68057656', 24900),
('72852496', 42900),
('69988406', 19900),
('67157696', 29900),
('71863336', 10100),
('66574926', 13600),
('66842706', 11800),
('75297096', 12800),
('72144126', 20900),
('66520836', 22900),
('72965186', 26900),
('67415306', 23900),
('63746496', 49900),
('65507216', 26900),
('75268296', 39900),
('74138596', 27900),
('71871306', 37900),
('69526336', 29900),
('50682056', 21900),
('72127726', 28900),
('66263266', 24900),
('69695835', 24900),
('67128976', 36900),
('61109206', 28900),
('62781626', 20900),
('59885426', 29900),
('71696636', 19900),
('66704486', 44900),
('73837676', 27900),
('74737156', 29900),
('64594576', 36900),
('72605206', 23900),
('74062196', 25900),
('74454666', 23900),
('59384866', 31900),
('64452956', 27900),
('47230966', 23900),
('74183076', 38900),
('65509186', 15900))
  select count(*) into affected from approved a join public.vehicles v
    on v.stock_number = a.lot and v.source_type = 'other'
    and v.published and v.status in ('available','reserved');
  if affected <> 70 then raise exception 'Expected all 70 approved active auction lots, matched %', affected; end if;
  with approved(lot, amount) as (values
('67896976', 35900),
('68786116', 29900),
('69502526', 13500),
('68917126', 19500),
('72553466', 26500),
('75293786', 27900),
('73551196', 24900),
('72482616', 21900),
('72142896', 23900),
('74977016', 27900),
('56951666', 33900),
('71912196', 16900),
('75962046', 26900),
('58094906', 29900),
('69734676', 23900),
('73658466', 19900),
('74680566', 39900),
('73856846', 25900),
('73321896', 19900),
('72242456', 12900),
('71425006', 23900),
('70648506', 34900),
('73905966', 14800),
('73253866', 38900),
('74117426', 21900),
('74464476', 23900),
('50308736', 25400),
('66796526', 43900),
('57151936', 9300),
('74686286', 15500),
('70815666', 12400),
('68057656', 24900),
('72852496', 42900),
('69988406', 19900),
('67157696', 29900),
('71863336', 10100),
('66574926', 13600),
('66842706', 11800),
('75297096', 12800),
('72144126', 20900),
('66520836', 22900),
('72965186', 26900),
('67415306', 23900),
('63746496', 49900),
('65507216', 26900),
('75268296', 39900),
('74138596', 27900),
('71871306', 37900),
('69526336', 29900),
('50682056', 21900),
('72127726', 28900),
('66263266', 24900),
('69695835', 24900),
('67128976', 36900),
('61109206', 28900),
('62781626', 20900),
('59885426', 29900),
('71696636', 19900),
('66704486', 44900),
('73837676', 27900),
('74737156', 29900),
('64594576', 36900),
('72605206', 23900),
('74062196', 25900),
('74454666', 23900),
('59384866', 31900),
('64452956', 27900),
('47230966', 23900),
('74183076', 38900),
('65509186', 15900))
  update public.vehicles v set landed_estimate_usd = a.amount, landed_estimate_validated = true
  from approved a where v.stock_number = a.lot and v.source_type = 'other'
    and v.published and v.status in ('available','reserved');
  get diagnostics affected = row_count;
  if affected <> 70 then raise exception 'Unexpected updated lot count %', affected; end if;
end $$;
