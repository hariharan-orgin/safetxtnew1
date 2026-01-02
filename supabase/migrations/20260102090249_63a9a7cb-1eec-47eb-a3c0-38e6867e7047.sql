-- Roles enum
create type public.app_role as enum ('admin', 'executive', 'control_room', 'field_team');

-- User roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Role helper function
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

-- RLS policies for user_roles
create policy "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
  on public.user_roles
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Incident enums
create type public.incident_severity as enum ('critical','high','medium','low');
create type public.incident_status as enum ('open','in_progress','resolved','cancelled');

-- Incidents table
create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  description text,
  severity public.incident_severity not null,
  status public.incident_status not null default 'open',
  category text,
  location text,
  zone text,
  reported_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  sla_due_at timestamptz,
  reporter_id uuid references auth.users(id),
  assigned_to uuid references auth.users(id)
);

alter table public.incidents enable row level security;

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_incidents_updated_at
before update on public.incidents
for each row
execute function public.set_updated_at();

-- RLS policies for incidents
create policy "Authenticated users can read incidents"
  on public.incidents
  for select
  to authenticated
  using (true);

create policy "Authenticated users can insert incidents"
  on public.incidents
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update incidents"
  on public.incidents
  for update
  to authenticated
  using (true)
  with check (true);