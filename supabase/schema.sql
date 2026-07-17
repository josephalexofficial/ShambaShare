-- ShambaShare schema for Supabase (Postgres)
-- Run in the Supabase SQL editor after creating your Free project.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text not null unique,
  county text,
  role text not null default 'both' check (role in ('renter', 'owner', 'both', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  category text not null check (
    category in ('irrigation', 'soil_testing', 'tillage', 'water', 'other')
  ),
  description text,
  rate_per_day numeric(10, 2) not null check (rate_per_day >= 0),
  currency text not null default 'KES',
  is_available boolean not null default true,
  location_lat double precision not null,
  location_lng double precision not null,
  location_label text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.rentals (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment (id) on delete cascade,
  renter_id uuid not null references public.profiles (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'completed', 'cancelled')
  ),
  created_at timestamptz not null default now()
);

create table if not exists public.sms_logs (
  id uuid primary key default gen_random_uuid(),
  rental_id uuid references public.rentals (id) on delete set null,
  to_phone text not null,
  message text not null,
  status text not null default 'queued' check (
    status in ('queued', 'sent', 'failed')
  ),
  provider_response jsonb,
  created_at timestamptz not null default now()
);

create index if not exists equipment_available_idx
  on public.equipment (is_available);

create index if not exists equipment_owner_idx
  on public.equipment (owner_id);

create index if not exists rentals_renter_idx
  on public.rentals (renter_id);

create index if not exists rentals_equipment_idx
  on public.rentals (equipment_id);

alter table public.profiles enable row level security;
alter table public.equipment enable row level security;
alter table public.rentals enable row level security;
alter table public.sms_logs enable row level security;

create policy "Public profiles are readable"
  on public.profiles for select
  using (true);

create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Anyone can read equipment"
  on public.equipment for select
  using (true);

create policy "Owners manage own equipment"
  on public.equipment for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Users read related rentals"
  on public.rentals for select
  using (
    auth.uid() = renter_id
    or auth.uid() in (
      select owner_id from public.equipment e where e.id = equipment_id
    )
  );

create policy "Authenticated users create rentals"
  on public.rentals for insert
  with check (auth.uid() = renter_id);

create policy "Participants update rentals"
  on public.rentals for update
  using (
    auth.uid() = renter_id
    or auth.uid() in (
      select owner_id from public.equipment e where e.id = equipment_id
    )
  );

-- Storage bucket (also create in Dashboard → Storage):
-- name: equipment-images
-- public: true
