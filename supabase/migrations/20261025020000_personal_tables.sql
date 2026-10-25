-- Phase 1: private life-admin tables. Owner-only (RLS via private.is_owner()), no anon access at all.
-- Never store secrets here: last-4 digits + password-manager links (vault_ref) only.

create table if not exists public.personal_affiliations (
  id serial primary key,
  kind text not null check (kind in ('eps', 'pension', 'cesantias', 'arl', 'caja', 'other')),
  entity text,
  regime text,
  status text not null default 'active' check (status in ('active', 'inactive', 'unknown')),
  affiliate_last4 text,
  since date,
  last_verified_at date,
  next_action text,
  url text,
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.personal_accounts (
  id serial primary key,
  institution text not null,
  country text not null default 'CO' check (country in ('CO', 'US', 'GLOBAL')),
  kind text not null default 'bank' check (kind in ('bank', 'exchange', 'fintech', 'card', 'wallet', 'broker', 'other')),
  currency text,
  last4 text,
  alias text,
  status text not null default 'active' check (status in ('active', 'pending', 'closed')),
  login_email text,
  vault_ref text,
  url text,
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.personal_subscriptions (
  id serial primary key,
  provider text not null,
  category text not null default 'other' check (category in ('telecom', 'internet', 'entertainment', 'software', 'utility', 'insurance', 'finance', 'other')),
  amount numeric(14, 2),
  currency text not null default 'COP',
  cadence text not null default 'monthly' check (cadence in ('weekly', 'monthly', 'quarterly', 'yearly')),
  billing_day int check (billing_day between 1 and 31),
  next_renewal date,
  paid_with text,
  status text not null default 'active' check (status in ('active', 'trial', 'paused', 'cancelled')),
  email_alias text,
  cancel_url text,
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.personal_debts (
  id serial primary key,
  creditor text not null,
  kind text not null default 'other' check (kind in ('student_loan', 'credit_card', 'personal', 'mortgage', 'other')),
  currency text not null default 'COP',
  principal numeric(16, 2),
  balance numeric(16, 2),
  rate text,
  min_payment numeric(14, 2),
  due_day int check (due_day between 1 and 31),
  phase text,
  status text not null default 'active' check (status in ('active', 'paid', 'defaulted', 'negotiating')),
  portal_url text,
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.personal_phone_lines (
  id serial primary key,
  label text not null,
  country text not null default 'CO' check (country in ('CO', 'US', 'OTHER')),
  number_e164 text,
  carrier text,
  plan_kind text not null default 'prepaid' check (plan_kind in ('prepaid', 'postpaid', 'esim', 'voip')),
  billing_day int check (billing_day between 1 and 31),
  expires_at date,
  used_for_2fa text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'suspended', 'cancelled')),
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.personal_emails (
  id serial primary key,
  address text not null unique,
  provider text,
  role text not null default 'public' check (role in ('vault', 'private', 'public', 'legacy', 'domain')),
  mfa_method text,
  recovery text,
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.personal_account_links (
  id serial primary key,
  service text not null,
  category text,
  email text,
  phone text,
  vault_ref text,
  status text not null default 'review' check (status in ('ok', 'review', 'move_to_vault', 'close')),
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.personal_entities (
  id serial primary key,
  name text not null,
  legal_form text,
  country text not null default 'CO' check (country in ('CO', 'US', 'OTHER')),
  my_role text,
  ownership_pct numeric(5, 2),
  tax_id_last4 text,
  status text not null default 'active' check (status in ('active', 'dormant', 'dissolving', 'closed')),
  next_obligation text,
  next_obligation_due date,
  url text,
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.personal_tasks (
  id serial primary key,
  title text not null,
  domain text not null default 'personal' check (domain in ('personal', 'health', 'pension', 'money', 'debt', 'entity', 'us', 'identity', 'other')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  status text not null default 'open' check (status in ('open', 'snoozed', 'done')),
  due_at date,
  steps text[] not null default '{}',
  notes text,
  done_at timestamptz,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

-- Phase 2 inbox (Resend inbound). Created now so the schema is complete.
create table if not exists public.personal_inbox (
  id serial primary key,
  resend_email_id text unique,
  received_at timestamptz not null default now(),
  to_address text,
  from_address text,
  subject text,
  category text not null default 'unknown' check (category in ('bill', 'receipt', 'alert', 'person', 'noise', 'unknown')),
  status text not null default 'needs_you' check (status in ('needs_you', 'auto_logged', 'forwarded', 'archived')),
  structured jsonb not null default '{}',
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array[
    'personal_affiliations', 'personal_accounts', 'personal_subscriptions', 'personal_debts',
    'personal_phone_lines', 'personal_emails', 'personal_account_links', 'personal_entities',
    'personal_tasks', 'personal_inbox'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('drop policy if exists "Owner only" on public.%I', t);
    execute format(
      'create policy "Owner only" on public.%I for all to authenticated
         using ((select private.is_owner())) with check ((select private.is_owner()))', t);
  end loop;
end $$;
