-- ============================================================================
-- Swiftora Solutions — admin profiles + newsletter subscribers
-- Target project: dzsuvzzutvgrmytzetfe (Swiftora only)
--
-- Idempotent: safe to run on the existing project or a fresh one. It creates
-- the profiles table (linked to Supabase auth users), keeps one profile per
-- user, backfills existing users, and adds the newsletter subscriber table
-- used by the footer signup + Inngest welcome flow.
-- ============================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin',
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.profiles add column if not exists user_id uuid;
alter table public.profiles add column if not exists role text default 'admin';
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists created_at timestamp with time zone default now();
alter table public.profiles add column if not exists updated_at timestamp with time zone default now();

create unique index if not exists profiles_user_id_key
  on public.profiles (user_id);

create index if not exists profiles_role_idx
  on public.profiles (role);

-- Keep updated_at accurate on edits.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create a profile automatically for every new auth user. These accounts are
-- created manually in the Supabase dashboard, so they are trusted admins.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (user_id, full_name, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    'admin'
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users that existed before this migration.
insert into public.profiles (user_id, full_name, role)
select
  u.id,
  coalesce(
    u.raw_user_meta_data ->> 'full_name',
    u.raw_user_meta_data ->> 'name'
  ),
  'admin'
from auth.users u
on conflict (user_id) do nothing;

-- Admin check used by RLS. SECURITY DEFINER avoids recursive RLS evaluation
-- when a policy on profiles needs to know the caller's role.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  subscribed_at timestamp with time zone not null default now(),
  is_active boolean not null default true,
  source text default 'footer',
  ip_address text,
  user_agent text,
  unsubscribed_at timestamp with time zone
);

alter table public.newsletter_subscribers add column if not exists email text;
alter table public.newsletter_subscribers add column if not exists name text;
alter table public.newsletter_subscribers add column if not exists subscribed_at timestamp with time zone default now();
alter table public.newsletter_subscribers add column if not exists is_active boolean default true;
alter table public.newsletter_subscribers add column if not exists source text default 'footer';
alter table public.newsletter_subscribers add column if not exists ip_address text;
alter table public.newsletter_subscribers add column if not exists user_agent text;
alter table public.newsletter_subscribers add column if not exists unsubscribed_at timestamp with time zone;

-- Emails are normalised to lowercase by the API, so a plain unique index gives
-- us reliable, case-insensitive upserts.
create unique index if not exists newsletter_subscribers_email_key
  on public.newsletter_subscribers (email);

create index if not exists newsletter_subscribers_active_idx
  on public.newsletter_subscribers (is_active, subscribed_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
do $$
declare
  pol record;
begin
  for pol in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles', 'newsletter_subscribers')
  loop
    execute format(
      'drop policy if exists %I on public.%I',
      pol.policyname,
      pol.tablename
    );
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Signed-in admins can see every profile so the dashboard can list the team.
create policy "Authenticated read profiles"
  on public.profiles
  for select
  to authenticated
  using (true);

-- Users can keep their own profile details current.
create policy "Users update own profile"
  on public.profiles
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Admins can manage every profile.
create policy "Admins manage profiles"
  on public.profiles
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Newsletter data is only visible to admins. Public signup happens through
-- the API using the service-role key.
create policy "Admins manage newsletter subscribers"
  on public.newsletter_subscribers
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select, update on public.profiles to authenticated;
grant execute on function public.is_admin() to authenticated;

grant select on public.newsletter_subscribers to authenticated;

revoke all on public.profiles from anon;
revoke all on public.newsletter_subscribers from anon;

grant select, insert, update, delete on public.profiles to service_role;
grant select, insert, update, delete on public.newsletter_subscribers to service_role;
