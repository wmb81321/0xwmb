-- Require a strong session at the database level: role checks only pass for
--   • passkey sign-ins (amr method 'passkey'; Supabase issues these as aal1), or
--   • aal2 sessions (password / email link / OAuth + TOTP — the break-glass recovery path).
-- Mirrors isStrongSession() in src/lib/auth.ts.

create or replace function private.has_role(roles text[])
returns boolean
language sql stable security definer set search_path = ''
as $$
  select (
      coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
      or exists (
        select 1
        from jsonb_array_elements(coalesce((select auth.jwt() -> 'amr'), '[]'::jsonb)) as m
        where m ->> 'method' = 'passkey'
      )
    )
    and exists (
      select 1 from public.user_roles
      where user_id = (select auth.uid()) and role = any(roles)
    );
$$;
