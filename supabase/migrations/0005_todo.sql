create table if not exists public.todo_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  points integer not null default 10,
  done boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.todo_items enable row level security;

create policy "todo_items: own rows" on public.todo_items
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.todo_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  cost integer not null,
  created_at timestamptz not null default now()
);

alter table public.todo_rewards enable row level security;

create policy "todo_rewards: own rows" on public.todo_rewards
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Einlösungen werden separat protokolliert (statt die Belohnung zu löschen),
-- damit der Verlauf auch nach dem Löschen einer Belohnung erhalten bleibt.
create table if not exists public.todo_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  reward_id uuid references public.todo_rewards (id) on delete set null,
  title text not null,
  cost integer not null,
  redeemed_at timestamptz not null default now()
);

alter table public.todo_redemptions enable row level security;

create policy "todo_redemptions: own rows" on public.todo_redemptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
