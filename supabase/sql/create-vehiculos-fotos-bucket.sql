-- Bucket público para fotos de subasta y del taller local.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehiculos-fotos',
  'vehiculos-fotos',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists vehiculos_fotos_select on storage.objects;
create policy vehiculos_fotos_select
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'vehiculos-fotos');

drop policy if exists vehiculos_fotos_insert on storage.objects;
create policy vehiculos_fotos_insert
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'vehiculos-fotos');

drop policy if exists vehiculos_fotos_update on storage.objects;
create policy vehiculos_fotos_update
  on storage.objects
  for update
  to anon, authenticated
  using (bucket_id = 'vehiculos-fotos')
  with check (bucket_id = 'vehiculos-fotos');

drop policy if exists vehiculos_fotos_delete on storage.objects;
create policy vehiculos_fotos_delete
  on storage.objects
  for delete
  to anon, authenticated
  using (bucket_id = 'vehiculos-fotos');
