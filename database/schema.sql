-- ==============================================================================
-- SugarSense AI — Complete Supabase PostgreSQL Schema Migration
-- Real 6-Digit Email OTP, Profile Triggers, Health CRUD & Realtime Publication
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked with Supabase auth.users)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  name text not null default 'User',
  role text not null check (role in ('SENIOR', 'CAREGIVER', 'DOCTOR', 'ADMIN')) default 'SENIOR',
  patient_id text default 'patient-senior-101',
  phone text,
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_patient on public.profiles(patient_id);
create index if not exists idx_profiles_email on public.profiles(email);

-- Auto-create profile trigger on signup / 6-digit OTP verification
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, patient_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'SENIOR'),
    coalesce(new.raw_user_meta_data->>'patient_id', 'patient-' || substr(new.id::text, 1, 8))
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, public.profiles.name),
    role = coalesce(excluded.role, public.profiles.role),
    updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. GLUCOSE READINGS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.glucose_readings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null default 'patient-senior-101',
  value numeric not null,
  timestamp timestamptz default timezone('utc'::text, now()) not null,
  meal_tag text default 'RANDOM',
  trend text default 'STABLE',
  notes text,
  is_fasting boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_glucose_patient_time on public.glucose_readings(patient_id, timestamp desc);
create index if not exists idx_glucose_user on public.glucose_readings(user_id);

-- ------------------------------------------------------------------------------
-- 3. MEDICATIONS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.medications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null default 'patient-senior-101',
  name text not null,
  dosage text not null,
  scheduled_time text not null,
  taken boolean default false,
  taken_at timestamptz,
  criticality text default 'STANDARD',
  instructions jsonb default '{"en": "", "hi": "", "mr": ""}'::jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_medications_patient on public.medications(patient_id);
create index if not exists idx_medications_user on public.medications(user_id);

-- ------------------------------------------------------------------------------
-- 4. CAREGIVER ALERTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.caregiver_alerts (
  id uuid default gen_random_uuid() primary key,
  patient_id text not null default 'patient-senior-101',
  title text not null,
  detail text not null,
  severity text default 'MEDIUM',
  acknowledged boolean default false,
  acknowledged_by text,
  acknowledged_at timestamptz,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_caregiver_alerts_patient on public.caregiver_alerts(patient_id, created_at desc);

-- ------------------------------------------------------------------------------
-- 5. MEALS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.meals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  patient_id text not null default 'patient-senior-101',
  name text not null,
  carbs_g numeric not null default 0,
  calories numeric not null default 0,
  glycemic_index text default 'MEDIUM',
  logged_at timestamptz default timezone('utc'::text, now()) not null,
  items jsonb default '[]'::jsonb,
  photo_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_meals_patient_time on public.meals(patient_id, logged_at desc);

-- ------------------------------------------------------------------------------
-- 6. SYSTEM BROADCASTS TABLE (Admin Emergency Alerts)
-- ------------------------------------------------------------------------------
create table if not exists public.system_broadcasts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references auth.users(id),
  title text not null,
  message text not null,
  target_role text default 'ALL',
  urgency text default 'INFO',
  active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_broadcasts_active on public.system_broadcasts(active, created_at desc);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.glucose_readings enable row level security;
alter table public.medications enable row level security;
alter table public.caregiver_alerts enable row level security;
alter table public.meals enable row level security;
alter table public.system_broadcasts enable row level security;

-- Drop existing policies if re-executing
drop policy if exists "Profiles access" on public.profiles;
drop policy if exists "Glucose access" on public.glucose_readings;
drop policy if exists "Medications access" on public.medications;
drop policy if exists "Alerts access" on public.caregiver_alerts;
drop policy if exists "Meals access" on public.meals;
drop policy if exists "Broadcasts access" on public.system_broadcasts;

-- Allow full access for authenticated users (and anon for demo mode)
create policy "Profiles access" on public.profiles for all using (true) with check (true);
create policy "Glucose access" on public.glucose_readings for all using (true) with check (true);
create policy "Medications access" on public.medications for all using (true) with check (true);
create policy "Alerts access" on public.caregiver_alerts for all using (true) with check (true);
create policy "Meals access" on public.meals for all using (true) with check (true);
create policy "Broadcasts access" on public.system_broadcasts for all using (true) with check (true);

-- ------------------------------------------------------------------------------
-- REALTIME PUBLICATION SETUP
-- ------------------------------------------------------------------------------
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table 
    public.profiles,
    public.glucose_readings,
    public.medications,
    public.caregiver_alerts,
    public.meals,
    public.system_broadcasts;
commit;
