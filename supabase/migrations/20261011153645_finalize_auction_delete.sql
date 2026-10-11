create or replace function public.delete_auction_opportunity(opportunity_id uuid)
returns text[]
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_vehicle_id uuid;
  paths text[] := '{}';
begin
  if not public.is_website_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  select linked_vehicle_id into v_vehicle_id from public.auction_opportunities
    where id = opportunity_id for update;
  if not found then
    raise exception 'Opportunity not found' using errcode = 'P0002';
  end if;
  perform id from public.vehicles where id = v_vehicle_id for update;
  delete from public.auction_opportunities where id = opportunity_id;
  if v_vehicle_id is not null
    and exists (select 1 from public.vehicles where id = v_vehicle_id and source_type = 'other')
    and not exists (select 1 from public.auction_opportunities where linked_vehicle_id = v_vehicle_id)
  then
    select coalesce(array_agg(storage_path), '{}') into paths
      from public.vehicle_photos where vehicle_photos.vehicle_id = v_vehicle_id;
    delete from public.vehicles where id = v_vehicle_id;
    if not found then raise exception 'Vehicle deletion failed'; end if;
  end if;
  return paths;
end;
$$;
revoke all on function public.delete_auction_opportunity(uuid) from public, anon;
grant execute on function public.delete_auction_opportunity(uuid) to authenticated;
