create table if not exists public.notes_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.notes_items enable row level security;

create policy "notes_items: own rows" on public.notes_items
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
