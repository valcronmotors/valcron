-- CRM de prospectos y leads para Valcron Motors Group SRL y 108 Parts Direct LLC.

create table public.prospectos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas (id) on delete restrict,
  nombre text not null,
  telefono text,
  email text,
  vehiculo_interes_id uuid references public.vehiculos (id) on delete set null,
  repuesto_interes_id uuid references public.repuestos (id) on delete set null,
  origen_lead text not null default 'Manual',
  estado_crm text not null default 'Nuevos Leads',
  notas text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint prospectos_nombre_check check (char_length(trim(nombre)) > 0),
  constraint prospectos_email_check check (
    email is null or email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  constraint prospectos_interes_xor check (
    (vehiculo_interes_id is not null and repuesto_interes_id is null)
    or (vehiculo_interes_id is null and repuesto_interes_id is not null)
  ),
  constraint prospectos_estado_crm_check check (
    estado_crm = any (
      array[
        'Nuevos Leads'::text,
        'En Negociación'::text,
        'Prueba de Manejo / Cotizado'::text,
        'Reservado'::text,
        'Vendido'::text,
        'Perdido'::text
      ]
    )
  ),
  constraint prospectos_origen_lead_check check (
    origen_lead = any (
      array[
        'Manual'::text,
        'Visita al taller'::text,
        'WhatsApp'::text,
        'Llamada'::text,
        'Instagram'::text,
        'Facebook'::text,
        'Referido'::text,
        'Web'::text,
        'eBay'::text,
        'Amazon'::text,
        'Walmart'::text,
        'Venta Directa'::text,
        'Subasta'::text
      ]
    )
  )
);

create index prospectos_empresa_id_idx on public.prospectos (empresa_id);
create index prospectos_estado_crm_idx on public.prospectos (estado_crm);
create index prospectos_created_at_idx on public.prospectos (created_at desc);
create index prospectos_vehiculo_interes_id_idx on public.prospectos (vehiculo_interes_id);
create index prospectos_repuesto_interes_id_idx on public.prospectos (repuesto_interes_id);

alter table public.prospectos enable row level security;

grant select, insert, update on public.prospectos to anon, authenticated;

create policy prospectos_select_operativo
  on public.prospectos
  for select
  to anon, authenticated
  using (true);

create policy prospectos_insert_operativo
  on public.prospectos
  for insert
  to anon, authenticated
  with check (true);

create policy prospectos_update_operativo
  on public.prospectos
  for update
  to anon, authenticated
  using (true)
  with check (true);

alter publication supabase_realtime add table public.prospectos;
