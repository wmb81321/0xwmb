-- rls_auto_enable() is an event-trigger function (turns RLS on for every new public table).
-- It must never be callable through the REST API (security advisor lints 0028 / 0029).
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
