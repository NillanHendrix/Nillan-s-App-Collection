create table if not exists public.wow_characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  region text not null check (region in ('eu', 'us')),
  realm text not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, region, realm, name)
);

create table if not exists public.wow_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  character_id uuid not null references public.wow_characters (id) on delete cascade,
  item_level int,
  mplus_rating numeric,
  taken_at timestamptz not null default now()
);

create table if not exists public.wow_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  character_id uuid not null references public.wow_characters (id) on delete cascade,
  title text not null,
  weekly boolean not null default true,
  done_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.wow_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  character_id uuid not null references public.wow_characters (id) on delete cascade,
  achievement_id int not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (character_id, achievement_id)
);

alter table public.wow_characters enable row level security;
alter table public.wow_snapshots enable row level security;
alter table public.wow_goals enable row level security;
alter table public.wow_achievements enable row level security;

create policy "wow_characters: own rows" on public.wow_characters
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wow_snapshots: own rows" on public.wow_snapshots
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wow_goals: own rows" on public.wow_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wow_achievements: own rows" on public.wow_achievements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
