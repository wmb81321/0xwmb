create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'accountant', 'family')),
  created_at timestamptz not null default now()
);
alter table public.user_roles enable row level security;

drop policy if exists "Read own role" on public.user_roles;
create policy "Read own role" on public.user_roles
  for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.has_role(roles text[])
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = any(roles)
  );
$$;

create or replace function public.is_owner()
returns boolean
language sql stable security definer set search_path = ''
as $$ select public.has_role(array['owner']); $$;

revoke execute on function public.has_role(text[]) from anon;
revoke execute on function public.is_owner() from anon;

do $$
declare t text;
begin
  foreach t in array array[
    'profile', 'experiences', 'projects', 'education', 'certificates',
    'volunteering', 'skills', 'languages', 'contact', 'achievements'
  ] loop
    execute format('drop policy if exists "Admin write" on public.%I', t);
    execute format('drop policy if exists "Owner write" on public.%I', t);
    execute format(
      'create policy "Owner write" on public.%I for all to authenticated
         using ((select public.is_owner())) with check ((select public.is_owner()))', t);
  end loop;
end $$;

create table if not exists public.job_applications (
  id serial primary key,
  company text not null,
  position text not null,
  website text,
  application_url text,
  description text,
  status text not null default 'saved' check (status in ('saved', 'applied', 'interviewing', 'offered', 'rejected', 'withdrawn')),
  applied_at text,
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.job_applications enable row level security;
drop policy if exists "Admin only" on public.job_applications;
drop policy if exists "Owner only" on public.job_applications;
create policy "Owner only" on public.job_applications for all to authenticated
  using ((select public.is_owner())) with check ((select public.is_owner()));