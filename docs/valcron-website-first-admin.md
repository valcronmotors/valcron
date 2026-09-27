# First website admin — Valcron

This project’s website admin is **not** “any logged-in user”. Access requires a Supabase Auth user whose JWT includes:

`app_metadata.role = "admin"`

Do not put the service role key in `NEXT_PUBLIC_*` variables. The service role stays on the server as `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_SECRET_KEY`).

Do not create placeholder passwords in git, chat, or tickets.

## 1. Create the Auth user

In the Supabase Dashboard of the **new empty project**:

1. Open **Authentication → Users**.
2. Choose **Add user → Create new user**.
3. Enter the real administrator email.
4. Set a strong password using a password manager. Do not reuse it and do not store it in the repo.
5. Confirm the user (auto-confirm is fine for this first account).

If you prefer the SQL editor later, still create the user through Auth so the password is hashed correctly. Do not insert rows into `auth.users` by hand.

## 2. Grant the admin role

The login check and RLS both read `app_metadata.role`. After the user exists, set it in **Authentication → Users → the user → App metadata**, or run this in the SQL editor (replace the email):

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
where email = 'ADMIN_EMAIL_HERE';
```

Do not set `user_metadata.role`. That field is user-editable and is ignored by `requireAdmin()`.

## 3. Refresh the session

Custom `app_metadata` is embedded in the JWT. After changing the role:

1. Sign out of `/login` if a session already exists.
2. Sign in again with the same email.
3. Open `/admin`. You should land on the website CMS (Dashboard, Inventario, Oportunidades de subasta, Solicitudes, Website).

If login says the account has no admin access, the JWT does not yet contain `app_metadata.role = admin`. Repeat step 2 and sign in again.

## 4. Later admins

Once this first admin can enter `/admin/configuracion/usuarios` **and** the server has `SUPABASE_SERVICE_ROLE_KEY`, additional admins can be created from that screen. New users are created with `app_metadata.role = admin` only.

Until the service role is configured on the server, use the Dashboard steps above for every admin.

## 5. What this role can do

- Write vehicles, photos, auction opportunities, and inquiry status.
- Upload, replace, and delete objects in the `vehicle-images` bucket.
- Read unpublished inventory that the public API cannot see.

Public visitors never receive inquiry rows. Auction opportunities never appear in the public catalog until an admin uses **Preparar para website** and then publishes the linked vehicle.

## Images

The `vehicle-images` bucket is **private**. Draft and unpublished files are not reachable by a public Storage URL.

- Public pages, Next/Image, Open Graph, and WhatsApp use `/api/public/vehicle-images/{vehicleId}/{file}`. That route uses the publishable key only (no cookies, no service role) and returns 404 unless the vehicle is `published = true` and `available`, `reserved`, or `sold`.
- Admin preview uses `/api/admin/vehicle-images/...` with an admin session. Admins can upload, reorder, set cover, and delete before publication.
- Unpublish: files stay in Storage for the admin editor; the public route starts returning 404.
- Sold: if still published, photos stay on the detail permalink and OG image; they drop off the catalog list.
- Delete vehicle: `vehicle_photos` rows cascade, then the admin action removes Storage objects in that vehicle folder so files are not left behind.

See also `docs/valcron-website-v1-architecture.md`, `docs/valcron-website-local-qa.md`, and `docs/valcron-auction-provider-roadmap.md`.
