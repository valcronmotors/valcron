-- One owner-approved public lot fact. Keep all private opportunity fields private.
create table public.auction_public_facts (
  vehicle_id uuid primary key references public.vehicles(id) on delete cascade,
  run_and_drive boolean not null default false
);
alter table public.auction_public_facts enable row level security;
revoke all on public.auction_public_facts from public, anon, authenticated;
grant select on public.auction_public_facts to anon, authenticated;
grant insert, update, delete on public.auction_public_facts to authenticated;

create policy auction_public_facts_published_read on public.auction_public_facts
for select to anon, authenticated using (
  exists (select 1 from public.vehicles v where v.id = vehicle_id
    and v.published = true and v.source_type = 'other'
    and v.status in ('available', 'reserved', 'sold'))
);
create policy auction_public_facts_admin_write on public.auction_public_facts
for all to authenticated using ((select public.is_website_admin()))
with check ((select public.is_website_admin()));

-- Invoker rights: only the existing authorized admin publication flow can write.
create function public.sync_auction_public_fact() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if TG_OP = 'DELETE' then
    delete from public.auction_public_facts where vehicle_id = OLD.linked_vehicle_id;
    return OLD;
  end if;
  if TG_OP = 'UPDATE' and OLD.linked_vehicle_id is distinct from NEW.linked_vehicle_id then
    delete from public.auction_public_facts where vehicle_id = OLD.linked_vehicle_id;
  end if;
  if NEW.linked_vehicle_id is not null then
    insert into public.auction_public_facts(vehicle_id, run_and_drive)
    values (NEW.linked_vehicle_id, NEW.status = 'published' and
      lower(regexp_replace(trim(coalesce(NEW.auction_metadata->>'run_and_drive', '')), '\s+', ' ', 'g'))
        in ('run and drive', 'reported run and drive'))
    on conflict (vehicle_id) do update set run_and_drive = excluded.run_and_drive;
  end if;
  return NEW;
end;
$$;
revoke all on function public.sync_auction_public_fact() from public;
grant execute on function public.sync_auction_public_fact() to authenticated;
create trigger sync_auction_public_fact
  after insert or update of auction_metadata, linked_vehicle_id, status or delete
  on public.auction_opportunities
  for each row execute function public.sync_auction_public_fact();

insert into public.auction_public_facts(vehicle_id, run_and_drive)
select a.linked_vehicle_id,
  lower(regexp_replace(trim(coalesce(a.auction_metadata->>'run_and_drive', '')), '\s+', ' ', 'g'))
    in ('run and drive', 'reported run and drive')
from public.auction_opportunities a
join public.vehicles v on v.id = a.linked_vehicle_id
where a.status = 'published' and v.published = true and v.source_type = 'other'
  and v.status in ('available', 'reserved', 'sold');
