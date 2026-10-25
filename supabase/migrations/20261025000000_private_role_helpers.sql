-- Move role helpers out of the API-exposed `public` schema so they have no /rest/v1/rpc endpoint.
-- Policies call private.is_owner(); authenticated keeps EXECUTE so RLS can evaluate it.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.has_role(roles text[])
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = any(roles)
  );
$$;

create or replace function private.is_owner()
returns boolean
language sql stable security definer set search_path = ''
as $$ select private.has_role(array['owner']); $$;

revoke execute on function private.has_role(text[]) from public, anon;
revoke execute on function private.is_owner() from public, anon;
grant execute on function private.has_role(text[]) to authenticated;
grant execute on function private.is_owner() to authenticated;

do $$
declare t text;
begin
  foreach t in array array[
    'profile', 'experiences', 'projects', 'education', 'certificates',
    'volunteering', 'skills', 'languages', 'contact', 'achievements'
  ] loop
    execute format('drop policy if exists "Owner write" on public.%I', t);
    execute format(
      'create policy "Owner write" on public.%I for all to authenticated
         using ((select private.is_owner())) with check ((select private.is_owner()))', t);
  end loop;
end $$;

drop policy if exists "Owner only" on public.job_applications;
create policy "Owner only" on public.job_applications for all to authenticated
  using ((select private.is_owner())) with check ((select private.is_owner()));

drop function if exists public.is_owner();
drop function if exists public.has_role(text[]);
