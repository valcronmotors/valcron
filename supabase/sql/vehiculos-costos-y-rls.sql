-- Columnas de costeo automático y políticas operativas para el dashboard.

alter table public.vehiculos
  add column if not exists tasa_usd_dop numeric not null default 62,
  add column if not exists costo_total_dop numeric not null default 0,
  add column if not exists precio_estimado_dop numeric not null default 0;

grant select on public.empresas to anon, authenticated;
grant select, insert, update on public.vehiculos to anon, authenticated;
grant select, insert, update on public.repuestos to anon, authenticated;

drop policy if exists empresas_select_operativo on public.empresas;
create policy empresas_select_operativo
  on public.empresas
  for select
  to anon, authenticated
  using (true);

drop policy if exists vehiculos_select_operativo on public.vehiculos;
create policy vehiculos_select_operativo
  on public.vehiculos
  for select
  to anon, authenticated
  using (true);

drop policy if exists vehiculos_insert_operativo on public.vehiculos;
create policy vehiculos_insert_operativo
  on public.vehiculos
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists vehiculos_update_operativo on public.vehiculos;
create policy vehiculos_update_operativo
  on public.vehiculos
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists repuestos_select_operativo on public.repuestos;
create policy repuestos_select_operativo
  on public.repuestos
  for select
  to anon, authenticated
  using (true);

drop policy if exists repuestos_insert_operativo on public.repuestos;
create policy repuestos_insert_operativo
  on public.repuestos
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists repuestos_update_operativo on public.repuestos;
create policy repuestos_update_operativo
  on public.repuestos
  for update
  to anon, authenticated
  using (true)
  with check (true);
