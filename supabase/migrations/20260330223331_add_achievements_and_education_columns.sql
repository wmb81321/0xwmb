
-- Education: new columns
alter table education add column if not exists field_of_study text;
alter table education add column if not exists start_date text;
alter table education add column if not exists end_date text;
alter table education add column if not exists linkedin text;
alter table education add column if not exists twitter text;

-- Achievements table
create table if not exists achievements (
  id serial primary key,
  title text not null,
  description text,
  year text,
  logo_url text,
  link text,
  type text not null default 'achievement' check (type in ('achievement', 'goal')),
  "order" int not null default 0
);
alter table achievements enable row level security;
create policy "Public read" on achievements for select using (true);
create policy "Admin write" on achievements for all to authenticated using (true) with check (true);
