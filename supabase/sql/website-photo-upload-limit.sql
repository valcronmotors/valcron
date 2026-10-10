-- Website photos only. Preserve private delivery, MIME restrictions and RLS.
update storage.buckets
set file_size_limit = 52428800
where id = 'vehicle-images';
