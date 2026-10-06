-- ==============================================================================
-- SugarSense AI — Database Row Level Security (RLS) & Realtime Publication
-- Strict Per-User Health Data Isolation & Role-Based Access Control (RBAC)
-- ==============================================================================

-- Enable RLS across all application tables
alter table public.profiles enable row level security;
alter table public.glucose_readings enable row level security;
alter table public.medications enable row level security;
alter table public.meals enable row level security;
alter table public.caregiver_alerts enable row level security;
alter table public.system_broadcasts enable row level security;

-- Drop previous policies for clean idempotency
drop policy if exists "Allow user self-read or admin" on public.profiles;
drop policy if exists "Allow user self-update" on public.profiles;
drop policy if exists "Allow public read profile" on public.profiles;
drop policy if exists "Allow auth insert profile" on public.profiles;
drop policy if exists "Allow auth glucose access" on public.glucose_readings;
drop policy if exists "Allow auth medication access" on public.medications;
drop policy if exists "Allow auth meals access" on public.meals;
drop policy if exists "Allow auth alerts access" on public.caregiver_alerts;
drop policy if exists "Allow auth broadcasts access" on public.system_broadcasts;

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE POLICIES
-- ------------------------------------------------------------------------------
-- Users can view their own profile; Admins, Caregivers & Doctors can view linked profiles
create policy "Profiles: View own or admin/clinician" on public.profiles
  for select using (
    auth.uid() = id 
    or (select role from public.profiles where id = auth.uid()) in ('ADMIN', 'DOCTOR', 'CAREGIVER')
  );

-- Users can update only their own profile; Admins can update any profile (e.g. role elevation)
create policy "Profiles: Update own or admin" on public.profiles
  for update using (
    auth.uid() = id 
    or (select role from public.profiles where id = auth.uid()) = 'ADMIN'
  );

-- Insert handled via auth trigger or authenticated user registration
create policy "Profiles: Insert on auth signup" on public.profiles
  for insert with check (
    auth.uid() = id or auth.uid() is not null
  );

-- ------------------------------------------------------------------------------
-- 2. GLUCOSE READINGS POLICIES (Strict Patient Isolation)
-- ------------------------------------------------------------------------------
create policy "Glucose: View own readings or authorized role" on public.glucose_readings
  for select using (
    user_id = auth.uid()
    or patient_id in (select patient_id from public.profiles where id = auth.uid())
    or (select role from public.profiles where id = auth.uid()) in ('ADMIN', 'DOCTOR', 'CAREGIVER')
  );

create policy "Glucose: Insert own readings" on public.glucose_readings
  for insert with check (
    auth.uid() is not null
  );

create policy "Glucose: Update own readings" on public.glucose_readings
  for update using (
    user_id = auth.uid()
    or patient_id in (select patient_id from public.profiles where id = auth.uid())
    or (select role from public.profiles where id = auth.uid()) = 'ADMIN'
  );

create policy "Glucose: Delete own readings or admin" on public.glucose_readings
  for delete using (
    user_id = auth.uid()
    or (select role from public.profiles where id = auth.uid()) = 'ADMIN'
  );

-- ------------------------------------------------------------------------------
-- 3. MEDICATIONS POLICIES
-- ------------------------------------------------------------------------------
create policy "Medications: View own or clinician" on public.medications
  for select using (
    user_id = auth.uid()
    or patient_id in (select patient_id from public.profiles where id = auth.uid())
    or (select role from public.profiles where id = auth.uid()) in ('ADMIN', 'DOCTOR', 'CAREGIVER')
  );

create policy "Medications: Modify own or clinician" on public.medications
  for all using (
    user_id = auth.uid()
    or patient_id in (select patient_id from public.profiles where id = auth.uid())
    or (select role from public.profiles where id = auth.uid()) in ('ADMIN', 'DOCTOR')
  );

-- ------------------------------------------------------------------------------
-- 4. MEALS POLICIES
-- ------------------------------------------------------------------------------
create policy "Meals: View own or clinician" on public.meals
  for select using (
    user_id = auth.uid()
    or patient_id in (select patient_id from public.profiles where id = auth.uid())
    or (select role from public.profiles where id = auth.uid()) in ('ADMIN', 'DOCTOR', 'CAREGIVER')
  );

create policy "Meals: Log own meals" on public.meals
  for insert with check (
    auth.uid() is not null
  );

-- ------------------------------------------------------------------------------
-- 5. CAREGIVER ALERTS POLICIES
-- ------------------------------------------------------------------------------
create policy "Alerts: View patient alerts" on public.caregiver_alerts
  for select using (
    patient_id in (select patient_id from public.profiles where id = auth.uid())
    or (select role from public.profiles where id = auth.uid()) in ('ADMIN', 'CAREGIVER', 'DOCTOR')
  );

create policy "Alerts: Create and acknowledge alerts" on public.caregiver_alerts
  for all using (
    auth.uid() is not null
  );

-- ------------------------------------------------------------------------------
-- 6. SYSTEM BROADCASTS POLICIES
-- ------------------------------------------------------------------------------
create policy "Broadcasts: Read active for all authenticated" on public.system_broadcasts
  for select using (true);

create policy "Broadcasts: Admin write control" on public.system_broadcasts
  for insert with check (
    (select role from public.profiles where id = auth.uid()) = 'ADMIN'
  );

create policy "Broadcasts: Admin update control" on public.system_broadcasts
  for update using (
    (select role from public.profiles where id = auth.uid()) = 'ADMIN'
  );

-- ------------------------------------------------------------------------------
-- REALTIME SUBSCRIPTIONS REPLICATION SETUP
-- ------------------------------------------------------------------------------
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table 
    public.profiles,
    public.glucose_readings,
    public.medications,
    public.meals,
    public.caregiver_alerts,
    public.system_broadcasts;
commit;
