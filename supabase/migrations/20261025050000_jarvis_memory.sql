-- Jarvis long-term memory: facts William tells it (preferences, people, routines, context, goals).
create table if not exists public.personal_agent_memory (
  id serial primary key,
  fact text not null,
  category text not null default 'context' check (category in ('preference', 'person', 'context', 'routine', 'goal')),
  source text not null default 'jarvis' check (source in ('jarvis', 'admin')),
  "order" int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.personal_agent_memory enable row level security;
revoke all on public.personal_agent_memory from anon;
drop policy if exists "Owner only" on public.personal_agent_memory;
create policy "Owner only" on public.personal_agent_memory for all to authenticated
  using ((select private.is_owner())) with check ((select private.is_owner()));
