-- Centro de Mensajería Omnicanal & IA Comercial (Valcron Motors Group SRL).

create table if not exists public.mensajeria_conversaciones (
  id uuid primary key default gen_random_uuid(),
  prospecto_id uuid references public.prospectos (id) on delete set null,
  canal text not null check (canal = any (array['whatsapp'::text, 'instagram'::text, 'facebook'::text])),
  status text not null default 'ia' check (status = any (array['ia'::text, 'humano'::text])),
  ia_pilot boolean not null default true,
  asignado_a uuid,
  asignado_nombre text,
  last_message text,
  last_message_at timestamptz not null default timezone('utc'::text, now()),
  unread_count integer not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.mensajeria_mensajes (
  id uuid primary key default gen_random_uuid(),
  conversacion_id uuid not null references public.mensajeria_conversaciones (id) on delete cascade,
  autor text not null check (autor = any (array['cliente'::text, 'ia'::text, 'agente'::text, 'interno'::text])),
  canal text not null check (canal = any (array['whatsapp'::text, 'instagram'::text, 'facebook'::text, 'interno'::text])),
  contenido text not null check (char_length(trim(contenido)) > 0),
  vehiculo_id uuid references public.vehiculos (id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.ia_config (
  id text primary key,
  whatsapp_token text,
  instagram_token text,
  facebook_token text,
  phone_number_id text,
  waba_id text,
  webhook_verify_token text,
  prompt_base text not null,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists mensajeria_conversaciones_last_message_at_idx
  on public.mensajeria_conversaciones (last_message_at desc);
create unique index if not exists mensajeria_conversaciones_prospecto_uidx
  on public.mensajeria_conversaciones (prospecto_id)
  where prospecto_id is not null;
create index if not exists mensajeria_conversaciones_status_idx
  on public.mensajeria_conversaciones (status);
create index if not exists mensajeria_mensajes_conversacion_id_idx
  on public.mensajeria_mensajes (conversacion_id, created_at);

alter table public.mensajeria_conversaciones enable row level security;
alter table public.mensajeria_mensajes enable row level security;
alter table public.ia_config enable row level security;

grant select, insert, update on public.mensajeria_conversaciones to authenticated;
grant select, insert, update on public.mensajeria_mensajes to authenticated;
grant select, insert, update on public.ia_config to authenticated;

drop policy if exists mensajeria_conversaciones_all_operativo on public.mensajeria_conversaciones;
create policy mensajeria_conversaciones_all_operativo
  on public.mensajeria_conversaciones
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists mensajeria_mensajes_all_operativo on public.mensajeria_mensajes;
create policy mensajeria_mensajes_all_operativo
  on public.mensajeria_mensajes
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists ia_config_all_operativo on public.ia_config;
create policy ia_config_all_operativo
  on public.ia_config
  for all
  to authenticated
  using (true)
  with check (true);

do $$
begin
  if not exists (
    select 1 from pg_publication_rel prel
    join pg_publication pub on pub.oid = prel.prpubid
    join pg_class cls on cls.oid = prel.prrelid
    where pub.pubname = 'supabase_realtime'
      and cls.relname = 'mensajeria_mensajes'
  ) then
    alter publication supabase_realtime add table public.mensajeria_mensajes;
  end if;
  if not exists (
    select 1 from pg_publication_rel prel
    join pg_publication pub on pub.oid = prel.prpubid
    join pg_class cls on cls.oid = prel.prrelid
    where pub.pubname = 'supabase_realtime'
      and cls.relname = 'mensajeria_conversaciones'
  ) then
    alter publication supabase_realtime add table public.mensajeria_conversaciones;
  end if;
end $$;
