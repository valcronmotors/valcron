-- Costos detallados, trim y canales de venta.

alter table public.vehiculos
  add column if not exists trim text,
  add column if not exists gastos_taller_usa_usd numeric(12, 2) not null default 0,
  add column if not exists gastos_grua_usd numeric(12, 2) not null default 0,
  add column if not exists gastos_titulacion_usd numeric(12, 2) not null default 0,
  add column if not exists fees_adicionales_usd numeric(12, 2) not null default 0,
  add column if not exists costo_total_usd numeric(12, 2) not null default 0;

update public.vehiculos
set costo_total_usd = round(
  coalesce(costo_subasta_usd, 0)
  + coalesce(flete_usd, 0)
  + coalesce(gastos_taller_usa_usd, 0)
  + coalesce(gastos_grua_usd, 0)
  + coalesce(gastos_titulacion_usd, 0)
  + coalesce(fees_adicionales_usd, 0),
  2
);

alter table public.repuestos
  add column if not exists envio_usd numeric(12, 2) not null default 0,
  add column if not exists comisiones_usd numeric(12, 2) not null default 0,
  add column if not exists canales_venta text[] not null default '{}'::text[];
