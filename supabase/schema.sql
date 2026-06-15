-- Rostr schema — run this first, then seed.sql
-- RLS: anon key = SELECT only. All writes go through the service-role key (server actions).

create table if not exists campaigns (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  client_name text not null,
  start_date  date,
  end_date    date,
  created_at  timestamptz default now()
);

create table if not exists locations (
  id         uuid primary key default gen_random_uuid(),
  retailer   text not null,   -- Woolworths | Coles | Chemist Warehouse | New World | PAK'nSAVE
  store_name text not null,
  address    text,
  suburb     text,
  state      text,
  country    text default 'Australia'
);

create table if not exists staff (
  id                  uuid primary key default gen_random_uuid(),
  full_name           text not null,
  email               text,
  phone               text,
  role_title          text,   -- Brand Ambassador | Sampling Lead | Supervisor | Demonstrator | Operations admin
  availability_status text not null default 'available'  -- available | unavailable | maybe
);

create table if not exists shifts (
  id          uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  location_id uuid references locations(id) on delete set null,
  name        text,
  date        date not null,
  start_time  time not null,
  end_time    time not null,
  role_focus  text,     -- primary role focus shown in UI
  notes       text,
  equipment   text,
  status      text not null default 'published',  -- draft | published
  created_at  timestamptz default now()
);

create table if not exists shift_roles (
  id             uuid primary key default gen_random_uuid(),
  shift_id       uuid references shifts(id) on delete cascade,
  role           text not null,   -- Supervisor | Sampling Lead | Brand Ambassador | Demonstrator
  headcount      int  not null default 1,
  break_minutes  int  default 30
);

create table if not exists shift_assignments (
  id            uuid primary key default gen_random_uuid(),
  shift_id      uuid references shifts(id) on delete cascade,
  staff_id      uuid references staff(id) on delete cascade,
  role          text,   -- which shift_role this staff fills
  status        text not null default 'invited',  -- invited | accepted | declined | no_response | assigned
  response_note text,
  updated_at    timestamptz default now(),
  unique (shift_id, staff_id)
);

-- RLS: enabled on all tables. Anon = SELECT only. Writes require service role (bypasses RLS).
alter table campaigns         enable row level security;
alter table locations         enable row level security;
alter table staff             enable row level security;
alter table shifts            enable row level security;
alter table shift_roles       enable row level security;
alter table shift_assignments enable row level security;

do $$ begin
  -- Drop old permissive "demo all" policies if they exist
  drop policy if exists "demo all" on campaigns;
  drop policy if exists "demo all" on locations;
  drop policy if exists "demo all" on staff;
  drop policy if exists "demo all" on shifts;
  drop policy if exists "demo all" on shift_roles;
  drop policy if exists "demo all" on shift_assignments;

  -- Anon may only read; all mutations go through the service-role key in server actions
  if not exists (select 1 from pg_policies where tablename = 'campaigns'         and policyname = 'anon read') then
    create policy "anon read" on campaigns         for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'locations'         and policyname = 'anon read') then
    create policy "anon read" on locations         for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'staff'             and policyname = 'anon read') then
    create policy "anon read" on staff             for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'shifts'            and policyname = 'anon read') then
    create policy "anon read" on shifts            for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'shift_roles'       and policyname = 'anon read') then
    create policy "anon read" on shift_roles       for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'shift_assignments' and policyname = 'anon read') then
    create policy "anon read" on shift_assignments for select using (true);
  end if;
end $$;
