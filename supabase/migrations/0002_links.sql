create table if not exists public.links_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  url text not null,
  title text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.links_items enable row level security;

create policy "links_items: own rows" on public.links_items
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
