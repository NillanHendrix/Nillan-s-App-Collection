create table if not exists public.about_pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  unique (user_id, title)
);

alter table public.about_pages enable row level security;

create policy "about_pages: own rows" on public.about_pages
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
