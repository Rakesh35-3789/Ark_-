-- Run only if any investor columns are missing.
alter table public.investors
  add column if not exists owner_id uuid references auth.users(id) on delete cascade,
  add column if not exists name text,
  add column if not exists firm text,
  add column if not exists role_title text,
  add column if not exists city text,
  add column if not exists bio text,
  add column if not exists website text,
  add column if not exists status text default 'pending',
  add column if not exists published_at timestamptz,
  add column if not exists created_at timestamptz default now();
create index if not exists investors_owner_id_idx on public.investors(owner_id);
create index if not exists investors_status_idx on public.investors(status);
