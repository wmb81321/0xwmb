create table if not exists public.personal_health (
  id serial primary key,
  kind text not null default 'appointment' check (kind in ('appointment', 'exam', 'medication', 'vaccine', 'procedure', 'other')),
  title text not null,
  provider text,
  location text,
  scheduled_at timestamptz,
  ends_on date,
  dose text,
  status text not null default 'scheduled' check (status in ('scheduled', 'done', 'cancelled', 'ongoing')),
  file_path text,
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists personal_health_scheduled_idx on public.personal_health (scheduled_at) where status = 'scheduled';
alter table public.personal_health enable row level security;
revoke all on public.personal_health from anon;
drop policy if exists "Owner only" on public.personal_health;
create policy "Owner only" on public.personal_health for all to authenticated
  using ((select private.is_owner())) with check ((select private.is_owner()));