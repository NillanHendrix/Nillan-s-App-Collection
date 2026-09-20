create table if not exists public.monitor_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind text not null check (kind in ('website', 'minecraft')),
  name text not null,
  target text not null,
  created_at timestamptz not null default now()
);

alter table public.monitor_targets enable row level security;

create policy "monitor_targets: own rows" on public.monitor_targets
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
