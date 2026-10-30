create table if not exists public.personal_ai_usage (
  id bigserial primary key,
  at timestamptz not null default now(),
  chat_id bigint,
  route text not null,
  route_confidence numeric(4, 3),
  model text,
  iterations int not null default 0,
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  cache_read_tokens int not null default 0,
  cache_write_tokens int not null default 0,
  jev_tokens int not null default 0,
  cost_usd numeric(10, 6) not null default 0
);
create index if not exists personal_ai_usage_at_idx on public.personal_ai_usage (at desc);
alter table public.personal_ai_usage enable row level security;
revoke all on public.personal_ai_usage from anon;
drop policy if exists "Owner only" on public.personal_ai_usage;
create policy "Owner only" on public.personal_ai_usage for all to authenticated
  using ((select private.is_owner())) with check ((select private.is_owner()));