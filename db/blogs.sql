
-- BEFORE USING THE ADMIN PANEL
--
-- 1. Go to:
--    Authentication → Users
--
-- 2. Click "Add User"
--
-- 3. Enter:
--    • Email
--    • Password
--
-- 4. Enable:
--    ✅ Auto Confirm User
--    OR
--    ✅ Confirm the user's email manually after creation
--
-- 5. Login using that account.
--
-- NOTE:
-- The storage policies below allow any authenticated user to
-- upload/update/delete blog content.
--
-- ==========================================================


CREATE TABLE public.users (
  id uuid NOT NULL,
  username text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'viewer'::text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT users_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);


CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  cover_url text,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  published boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  type text NOT NULL DEFAULT 'blog'::text,
  CONSTRAINT posts_pkey PRIMARY KEY (id)
);


-- ==========================================
-- CREATE STORAGE BUCKETS
-- ==========================================

insert into storage.buckets (id, name, public)
values
  ('blog-covers', 'blog-covers', true),
  ('blog-files', 'blog-files', true)
on conflict (id) do nothing;


create policy "Public read blog covers"
on storage.objects
for select
using (bucket_id = 'blog-covers');

create policy "Public read blog files"
on storage.objects
for select
using (bucket_id = 'blog-files');



-- Authenticated upload
create policy "Authenticated upload blog covers"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'blog-covers');

create policy "Authenticated upload blog files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'blog-files');

-- Authenticated Delete
create policy "Authenticated delete blog covers"
on storage.objects
for delete
to authenticated
using (bucket_id = 'blog-covers');

create policy "Authenticated delete blog files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'blog-files');