-- Career profile intake: one row per submission.
-- Run in Supabase SQL Editor or via `supabase db push` if you use the CLI.

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  full_name text not null,
  email text not null,
  phone_number text not null,
  target_role text not null,
  years_of_experience integer not null check (years_of_experience >= 0 and years_of_experience <= 40),
  current_company text not null,
  last_position text not null,
  skills text[] not null check (cardinality(skills) >= 1),
  short_bio text,
  area text not null,
  address text,
  highest_education text not null
    check (highest_education in ('SMA', 'Diploma', 'Bachelor', 'Master')),
  preferred_work_type text not null
    check (preferred_work_type in ('onsite', 'remote', 'hybrid')),
  expected_salary bigint not null check (expected_salary >= 0 and expected_salary <= 1000000000),
  notice_period text not null
);

create index if not exists profiles_created_at_idx on public.profiles (created_at desc);
create index if not exists profiles_email_idx on public.profiles (email);

comment on table public.profiles is 'Career profile intake submissions from the public form.';

alter table public.profiles enable row level security;

grant insert on table public.profiles to anon;

-- Inserts from your Next.js route using the anon key (recommended for this app).
create policy "anon_insert_profiles"
  on public.profiles
  for insert
  to anon
  with check (true);

-- Optional: allow authenticated users to read only their own rows later (add user_id column first).
-- No SELECT policy for anon: submissions are not publicly readable.
