-- ============================================================================
-- Swiftora Solutions — core schema
-- Target project: dzsuvzzutvgrmytzetfe (Swiftora only)
--
-- This file is idempotent: it can be run on the existing project or on a
-- brand-new Supabase project. It creates the three tables used by the app,
-- adds any missing columns, indexes, the fk_shipment relationship required by
-- the tracking page, and locks the tables down with RLS.
--
-- Run this in the Supabase SQL Editor for the Swiftora project.
-- ============================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- shipments
-- ---------------------------------------------------------------------------
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_number text,
  sender text,
  receiver text,
  status text default 'Shipment Created',
  created_at timestamp without time zone default now(),
  current_location text
);

alter table public.shipments add column if not exists tracking_number text;
alter table public.shipments add column if not exists sender text;
alter table public.shipments add column if not exists receiver text;
alter table public.shipments add column if not exists status text default 'Shipment Created';
alter table public.shipments add column if not exists created_at timestamp without time zone default now();
alter table public.shipments add column if not exists current_location text;

-- ---------------------------------------------------------------------------
-- tracking_updates
-- The track page queries: tracking_updates!fk_shipment(...)
-- so the foreign key must keep this exact name.
-- ---------------------------------------------------------------------------
create table if not exists public.tracking_updates (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null,
  location text not null,
  message text not null,
  created_at timestamp with time zone default now(),
  lat double precision,
  lng double precision
);

alter table public.tracking_updates add column if not exists shipment_id uuid;
alter table public.tracking_updates add column if not exists location text;
alter table public.tracking_updates add column if not exists message text;
alter table public.tracking_updates add column if not exists created_at timestamp with time zone default now();
alter table public.tracking_updates add column if not exists lat double precision;
alter table public.tracking_updates add column if not exists lng double precision;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'fk_shipment'
      and conrelid = 'public.tracking_updates'::regclass
  ) then
    alter table public.tracking_updates
      add constraint fk_shipment
      foreign key (shipment_id)
      references public.shipments(id)
      on delete cascade;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- shipments_info (contact / quote requests)
-- This table contains personal data and must never be readable by anon.
-- ---------------------------------------------------------------------------
create table if not exists public.shipments_info (
  id uuid primary key default gen_random_uuid(),
  tracking_id text,
  first_name text,
  last_name text,
  email text,
  phone text,
  shipment_type text,
  delivery_speed text,
  pickup text,
  delivery text,
  weight numeric,
  price numeric,
  status text default 'Pending',
  created_at timestamp without time zone default now(),
  company_name text,
  info text,
  terms_accepted boolean,
  privacy_accepted boolean,
  marketing_consent boolean default false,
  consent_timestamp timestamp without time zone,
  ip_address text
);

do $$
declare
  col record;
begin
  for col in
    select *
    from (values
      ('tracking_id', 'text'),
      ('first_name', 'text'),
      ('last_name', 'text'),
      ('email', 'text'),
      ('phone', 'text'),
      ('shipment_type', 'text'),
      ('delivery_speed', 'text'),
      ('pickup', 'text'),
      ('delivery', 'text'),
      ('weight', 'numeric'),
      ('price', 'numeric'),
      ('status', 'text default ''Pending'''),
      ('created_at', 'timestamp without time zone default now()'),
      ('company_name', 'text'),
      ('info', 'text'),
      ('terms_accepted', 'boolean'),
      ('privacy_accepted', 'boolean'),
      ('marketing_consent', 'boolean default false'),
      ('consent_timestamp', 'timestamp without time zone'),
      ('ip_address', 'text')
    ) as t(name, type)
  loop
    execute format(
      'alter table public.shipments_info add column if not exists %I %s',
      col.name,
      col.type
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create unique index if not exists shipments_tracking_number_key
  on public.shipments (tracking_number);

create index if not exists shipments_created_at_idx
  on public.shipments (created_at desc);

create index if not exists tracking_updates_shipment_id_idx
  on public.tracking_updates (shipment_id);

create index if not exists tracking_updates_created_at_idx
  on public.tracking_updates (created_at);

create index if not exists shipments_info_tracking_id_idx
  on public.shipments_info (tracking_id);

create index if not exists shipments_info_created_at_idx
  on public.shipments_info (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Replace any existing policies so the rules below are the single source of
-- truth. This does not delete any rows.
-- ---------------------------------------------------------------------------
do $$
declare
  pol record;
begin
  for pol in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('shipments', 'tracking_updates', 'shipments_info')
  loop
    execute format(
      'drop policy if exists %I on public.%I',
      pol.policyname,
      pol.tablename
    );
  end loop;
end $$;

alter table public.shipments enable row level security;
alter table public.tracking_updates enable row level security;
alter table public.shipments_info enable row level security;

-- Public tracking page: read-only access to shipments and their updates.
create policy "Public tracking read"
  on public.shipments
  for select
  to anon, authenticated
  using (true);

create policy "Public tracking updates read"
  on public.tracking_updates
  for select
  to anon, authenticated
  using (true);

-- Admin dashboard: signed-in users can manage shipments and updates.
create policy "Authenticated manage shipments"
  on public.shipments
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated manage tracking updates"
  on public.tracking_updates
  for all
  to authenticated
  using (true)
  with check (true);

-- Quote requests contain personal data: authenticated admins only.
create policy "Authenticated manage shipment requests"
  on public.shipments_info
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on public.shipments, public.tracking_updates to anon;
grant select, insert, update, delete
  on public.shipments, public.tracking_updates
  to authenticated;
grant select, insert, update, delete
  on public.shipments_info
  to authenticated;

-- No anon access to personal data.
revoke all on public.shipments_info from anon;

grant all
  on public.shipments, public.tracking_updates, public.shipments_info
  to service_role;
