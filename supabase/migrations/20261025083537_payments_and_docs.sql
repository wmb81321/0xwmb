alter table public.personal_subscriptions
  add column if not exists started_at date,
  add column if not exists cancelled_at date;

create table if not exists public.personal_payments (
  id serial primary key,
  paid_at date not null,
  provider text not null,
  subscription_id int references public.personal_subscriptions(id) on delete set null,
  debt_id int references public.personal_debts(id) on delete set null,
  amount numeric(14, 2) not null,
  currency text not null default 'COP',
  paid_with text,
  invoice_path text,
  source text not null default 'manual' check (source in ('manual', 'telegram', 'email', 'import')),
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists personal_payments_paid_at_idx on public.personal_payments (paid_at);
create index if not exists personal_payments_subscription_idx on public.personal_payments (subscription_id);
create index if not exists personal_payments_debt_idx on public.personal_payments (debt_id);

create table if not exists public.personal_agent_messages (
  id bigserial primary key,
  chat_id bigint not null,
  role text not null check (role in ('user', 'assistant')),
  content jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists personal_agent_messages_chat_idx on public.personal_agent_messages (chat_id, id desc);

create table if not exists public.personal_pending_actions (
  id bigserial primary key,
  chat_id bigint not null,
  table_name text not null,
  op text not null check (op in ('insert', 'update')),
  record_id int,
  payload jsonb not null,
  summary text not null,
  status text not null default 'pending' check (status in ('pending', 'applied', 'rejected', 'expired')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.personal_audit_log (
  id bigserial primary key,
  actor text not null,
  action text not null,
  table_name text,
  record_id int,
  detail jsonb not null default '{}',
  at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['personal_payments', 'personal_agent_messages', 'personal_pending_actions', 'personal_audit_log'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('drop policy if exists "Owner only" on public.%I', t);
    execute format(
      'create policy "Owner only" on public.%I for all to authenticated
         using ((select private.is_owner())) with check ((select private.is_owner()))', t);
  end loop;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('personal-docs', 'personal-docs', false, 20971520,
        array['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/heic'])
on conflict (id) do update set public = false;

drop policy if exists "Owner personal docs" on storage.objects;
create policy "Owner personal docs" on storage.objects for all to authenticated
  using (bucket_id = 'personal-docs' and (select private.is_owner()))
  with check (bucket_id = 'personal-docs' and (select private.is_owner()));