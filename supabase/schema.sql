-- ARK production schema. Run once in a fresh Supabase project.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  bio text,
  avatar_url text,
  city text,
  role text not null default 'user' check (role in ('user','editor','admin')),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 8 and 140),
  slug text not null unique,
  excerpt text not null check (char_length(excerpt) between 30 and 300),
  content text not null check (char_length(content) >= 150),
  category text not null,
  city text,
  cover_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.research_papers (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  abstract text not null,
  field text not null,
  institution text,
  paper_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.founders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  company text not null,
  role_title text,
  city text,
  bio text not null,
  website text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  organization text not null,
  opportunity_type text not null,
  location text,
  description text not null,
  apply_url text,
  deadline date,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.bookmarks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  story_id uuid not null references public.stories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, story_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists stories_status_published_idx on public.stories(status, published_at desc);
create index if not exists stories_author_idx on public.stories(author_id, created_at desc);
create index if not exists stories_search_idx on public.stories using gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,'') || ' ' || coalesce(content,'')));
create index if not exists research_status_idx on public.research_papers(status, published_at desc);
create index if not exists founders_status_idx on public.founders(status, published_at desc);
create index if not exists opportunities_status_idx on public.opportunities(status, published_at desc);
create index if not exists comments_story_idx on public.comments(story_id, created_at desc);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id, full_name, username)
  values(new.id, new.raw_user_meta_data->>'full_name', 'user_' || substr(new.id::text,1,8))
  on conflict(id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.research_papers enable row level security;
alter table public.founders enable row level security;
alter table public.opportunities enable row level security;
alter table public.comments enable row level security;
alter table public.bookmarks enable row level security;
alter table public.notifications enable row level security;

create policy "profiles public read" on public.profiles for select using (true);
create policy "users update own profile" on public.profiles for update using (auth.uid()=id) with check (auth.uid()=id);

create policy "stories readable" on public.stories for select using (status='approved' or author_id=auth.uid() or public.is_admin());
create policy "users create own stories" on public.stories for insert with check (auth.uid()=author_id and status='pending');
create policy "users update own pending stories" on public.stories for update using (auth.uid()=author_id and status='pending') with check (auth.uid()=author_id and status='pending');
create policy "users delete own pending stories" on public.stories for delete using (auth.uid()=author_id and status='pending');

create policy "research readable" on public.research_papers for select using (status='approved' or author_id=auth.uid() or public.is_admin());
create policy "research create own" on public.research_papers for insert with check (auth.uid()=author_id and status='pending');
create policy "research update own pending" on public.research_papers for update using (auth.uid()=author_id and status='pending');

create policy "founders readable" on public.founders for select using (status='approved' or owner_id=auth.uid() or public.is_admin());
create policy "founders create own" on public.founders for insert with check (auth.uid()=owner_id and status='pending');
create policy "founders update own pending" on public.founders for update using (auth.uid()=owner_id and status='pending');

create policy "opportunities readable" on public.opportunities for select using (status='approved' or owner_id=auth.uid() or public.is_admin());
create policy "opportunities create own" on public.opportunities for insert with check (auth.uid()=owner_id and status='pending');
create policy "opportunities update own pending" on public.opportunities for update using (auth.uid()=owner_id and status='pending');

create policy "comments public read" on public.comments for select using (true);
create policy "authenticated comment" on public.comments for insert to authenticated with check (auth.uid()=user_id);
create policy "users delete own comments" on public.comments for delete using (auth.uid()=user_id or public.is_admin());

create policy "users read own bookmarks" on public.bookmarks for select using (auth.uid()=user_id);
create policy "users create own bookmarks" on public.bookmarks for insert with check (auth.uid()=user_id);
create policy "users delete own bookmarks" on public.bookmarks for delete using (auth.uid()=user_id);

create policy "users read own notifications" on public.notifications for select using (auth.uid()=user_id);
create policy "users update own notifications" on public.notifications for update using (auth.uid()=user_id);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values
('story-images','story-images',true,5242880,array['image/jpeg','image/png','image/webp']),
('research-files','research-files',true,10485760,array['application/pdf']),
('avatars','avatars',true,2097152,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

create policy "public media read" on storage.objects for select using (bucket_id in ('story-images','research-files','avatars'));
create policy "users upload own media" on storage.objects for insert to authenticated with check (bucket_id in ('story-images','research-files','avatars') and (storage.foldername(name))[1]=auth.uid()::text);
create policy "users delete own media" on storage.objects for delete to authenticated using (bucket_id in ('story-images','research-files','avatars') and (storage.foldername(name))[1]=auth.uid()::text);
