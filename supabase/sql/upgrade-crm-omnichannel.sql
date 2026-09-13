-- CRM omnicanal: nuevos estados, orígenes, historial, cotizaciones y audio.

alter table public.prospectos drop constraint if exists prospectos_estado_crm_check;
alter table public.prospectos drop constraint if exists prospectos_origen_lead_check;
alter table public.prospectos drop constraint if exists prospectos_interes_xor;

update public.prospectos
set estado_crm = case estado_crm
  when 'Nuevos Leads' then 'Nuevo Lead'
  when 'Prueba de Manejo / Cotizado' then 'Cotizado / Test Drive'
  when 'Reservado' then 'Cotizado / Test Drive'
  when 'Vendido' then 'Cerrado Ganado'
  when 'Perdido' then 'Cerrado Perdido'
  else estado_crm
end;

update public.prospectos
set origen_lead = case origen_lead
  when 'WhatsApp' then 'WhatsApp'
  when 'Web' then 'Web'
  when 'Referido' then 'Referido'
  when 'Instagram' then 'Meta Ads'
  when 'Facebook' then 'Meta Ads'
  else 'Web'
end;

alter table public.prospectos alter column estado_crm set default 'Nuevo Lead';
alter table public.prospectos alter column origen_lead set default 'WhatsApp';

alter table public.prospectos
  add constraint prospectos_estado_crm_check check (
    estado_crm = any (array[
      'Nuevo Lead'::text,
      'Contactado'::text,
      'En Negociación'::text,
      'Cotizado / Test Drive'::text,
      'Cerrado Ganado'::text,
      'Cerrado Perdido'::text
    ])
  );

alter table public.prospectos
  add constraint prospectos_origen_lead_check check (
    origen_lead = any (array[
      'Meta Ads'::text,
      'WhatsApp'::text,
      'Web'::text,
      'Referido'::text
    ])
  );

alter table public.prospectos
  add constraint prospectos_interes_xor check (
    vehiculo_interes_id is null or repuesto_interes_id is null
  );

create table if not exists public.crm_actividades (
  id uuid primary key default gen_random_uuid(),
  prospecto_id uuid not null references public.prospectos (id) on delete cascade,
  tipo text not null,
  descripcion text,
  programada_para timestamptz,
  audio_url text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  constraint crm_actividades_tipo_check check (
    tipo = any (array[
      'Llamada'::text,
      'Nota de voz'::text,
      'Visita al dealer'::text,
      'Recordatorio'::text
    ])
  )
);

create index if not exists crm_actividades_prospecto_id_idx
  on public.crm_actividades (prospecto_id, created_at desc);

create table if not exists public.cotizaciones (
  id uuid primary key default gen_random_uuid(),
  prospecto_id uuid not null references public.prospectos (id) on delete cascade,
  empresa_id uuid not null references public.empresas (id) on delete restrict,
  numero_cotizacion text not null unique,
  tasa_cambio numeric not null default 62,
  items jsonb not null default '[]'::jsonb,
  subtotal_usd numeric not null default 0,
  monto_total_usd numeric not null default 0,
  monto_total_dop numeric not null default 0,
  notas text,
  valida_hasta date,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.cotizaciones
  add column if not exists items jsonb not null default '[]'::jsonb,
  add column if not exists notas text,
  add column if not exists subtotal_usd numeric not null default 0;

create index if not exists cotizaciones_prospecto_id_idx
  on public.cotizaciones (prospecto_id, created_at desc);

alter table public.crm_actividades enable row level security;
alter table public.cotizaciones enable row level security;

grant select, insert, update on public.crm_actividades to anon, authenticated;
grant select, insert, update on public.cotizaciones to anon, authenticated;

create policy crm_actividades_select_operativo
  on public.crm_actividades for select to anon, authenticated using (true);
create policy crm_actividades_insert_operativo
  on public.crm_actividades for insert to anon, authenticated with check (true);

create policy cotizaciones_select_operativo
  on public.cotizaciones for select to anon, authenticated using (true);
create policy cotizaciones_insert_operativo
  on public.cotizaciones for insert to anon, authenticated with check (true);

alter publication supabase_realtime add table public.crm_actividades;
alter publication supabase_realtime add table public.cotizaciones;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'crm-audio',
  'crm-audio',
  true,
  10485760,
  array['audio/webm', 'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/x-m4a']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists crm_audio_select on storage.objects;
create policy crm_audio_select on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'crm-audio');

drop policy if exists crm_audio_insert on storage.objects;
create policy crm_audio_insert on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'crm-audio');
