-- Require the second factor at the database level too: role checks only pass for aal2 sessions.
-- APPLY ONLY AFTER the owner has enrolled TOTP (/admin/login/mfa), otherwise RLS reads like
-- job_applications return nothing until the next aal2 login.

create or replace function private.has_role(roles text[])
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
     and exists (
       select 1 from public.user_roles
       where user_id = (select auth.uid()) and role = any(roles)
     );
$$;
