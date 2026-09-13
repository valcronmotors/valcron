alter table public.vehiculos
  add column if not exists fotos_urls text[] not null default '{}'::text[],
  add column if not exists ubicacion_lote text,
  add column if not exists lote_numero text,
  add column if not exists fuente_subasta text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'vehiculos_fuente_subasta_check'
  ) then
    alter table public.vehiculos
      add constraint vehiculos_fuente_subasta_check
      check (
        fuente_subasta is null
        or fuente_subasta in ('Copart', 'IAAI', 'Manheim')
      );
  end if;
end $$;
