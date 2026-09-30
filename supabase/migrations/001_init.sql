-- =========================================================
-- EXTENSIONS
-- =========================================================
create extension if not exists "pgcrypto";

-- =========================================================
-- ENUMS
-- =========================================================
create type public.advisory_type as enum (
  'crop_recommendation','disease_diagnosis','fertilizer_plan','irrigation_plan','seasonal_calendar'
);
create type public.app_language as enum ('en','hi','mr');
create type public.area_unit as enum ('acre','hectare');
create type public.soil_type as enum (
  'black_cotton','red','alluvial','laterite','sandy','loamy','clayey','saline_alkaline','unknown'
);
create type public.irrigation_source as enum (
  'rainfed','borewell','open_well','canal','river_lift','farm_pond','drip_installed','sprinkler_installed'
);
create type public.water_availability as enum ('scarce','limited','adequate','abundant');
create type public.advisory_status as enum ('completed','failed');
create type public.chat_role as enum ('user','assistant');

-- =========================================================
-- HELPER: updated_at trigger
-- =========================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- =========================================================
-- PROFILES
-- =========================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 100),
  phone text check (phone is null or char_length(phone) between 7 and 20),
  state text check (state is null or char_length(state) <= 60),
  district text check (district is null or char_length(district) <= 60),
  language public.app_language not null default 'en',
  preferred_unit public.area_unit not null default 'acre',
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- FARMS
-- =========================================================
create table public.farms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  state text not null check (char_length(state) between 2 and 60),
  district text not null check (char_length(district) between 2 and 60),
  land_size numeric(10,2) not null check (land_size > 0 and land_size <= 100000),
  land_unit public.area_unit not null default 'acre',
  soil_type public.soil_type not null default 'unknown',
  soil_ph numeric(3,1) check (soil_ph is null or (soil_ph >= 3.0 and soil_ph <= 10.0)),
  organic_carbon_level text check (organic_carbon_level is null or organic_carbon_level in ('low','medium','high')),
  irrigation_source public.irrigation_source not null default 'rainfed',
  water_availability public.water_availability not null default 'limited',
  current_crop text check (current_crop is null or char_length(current_crop) <= 60),
  previous_crop text check (previous_crop is null or char_length(previous_crop) <= 60),
  notes text check (notes is null or char_length(notes) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_farms_user on public.farms(user_id);
create trigger trg_farms_updated before update on public.farms
  for each row execute function public.set_updated_at();

-- =========================================================
-- ADVISORIES (request + result in one row)
-- =========================================================
create table public.advisories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  type public.advisory_type not null,
  language public.app_language not null default 'en',
  title text not null check (char_length(title) <= 160),
  input jsonb not null,
  farm_snapshot jsonb not null,
  result jsonb,
  status public.advisory_status not null default 'completed',
  error_message text,
  model text not null,
  had_image boolean not null default false,
  prompt_tokens integer,
  output_tokens integer,
  created_at timestamptz not null default now()
);
create index idx_advisories_user_created on public.advisories(user_id, created_at desc);
create index idx_advisories_user_type on public.advisories(user_id, type);
create index idx_advisories_farm on public.advisories(farm_id);
create index idx_advisories_title_search on public.advisories using gin (to_tsvector('simple', title));

-- =========================================================
-- FOLLOW-UP MESSAGES
-- =========================================================
create table public.advisory_messages (
  id uuid primary key default gen_random_uuid(),
  advisory_id uuid not null references public.advisories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.chat_role not null,
  content text not null check (char_length(content) between 1 and 6000),
  created_at timestamptz not null default now()
);
create index idx_messages_advisory on public.advisory_messages(advisory_id, created_at);

-- =========================================================
-- FEEDBACK
-- =========================================================
create table public.advisory_feedback (
  id uuid primary key default gen_random_uuid(),
  advisory_id uuid not null unique references public.advisories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  helpful boolean not null,
  comment text check (comment is null or char_length(comment) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_feedback_updated before update on public.advisory_feedback
  for each row execute function public.set_updated_at();
