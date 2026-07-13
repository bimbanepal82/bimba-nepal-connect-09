create table public.users (
  id            uuid primary key default gen_random_uuid(),
  username      text not null unique,
  password      text,                     -- see note below
  role          text not null default 'viewer',   -- e.g. admin, editor, viewer
  created_by    uuid references public.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.documents (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  doc_type      text not null,            -- 'report', 'pdf', 'notice', etc.
  file_url      text not null,            -- Supabase Storage path/URL
  uploaded_by   uuid references public.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);