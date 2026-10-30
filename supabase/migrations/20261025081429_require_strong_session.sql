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