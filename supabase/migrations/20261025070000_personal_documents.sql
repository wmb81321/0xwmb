-- Documents with expiry dates (Phase 3): one row per ID, permit, policy or certificate; scan in personal-docs.
-- Only the last 4 digits of any number are stored.
create table if not exists public.personal_documents (
  id serial primary key,
  area text not null default 'identity' check (area in ('identity', 'health', 'career', 'finances', 'taxes', 'social', 'companies', 'home', 'digital', 'people', 'goals')),
  kind text not null default 'other' check (kind in ('cedula', 'passport', 'visa', 'itin', 'rut', 'license', 'insurance', 'contract', 'certificate', 'tax_return', 'other')),
  title text not null,
  issuer text,
  country text check (country in ('CO', 'US', 'OTHER')),
  number_last4 text,
  issued_at date,
  expires_at date,
  renew_lead_days int not null default 90 check (renew_lead_days between 0 and 730),
  status text not null default 'active' check (status in ('active', 'renewing', 'pending', 'archived')),
  file_path text,
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists personal_documents_expiry_idx on public.personal_documents (expires_at) where status <> 'archived';
alter table public.personal_documents enable row level security;
revoke all on public.personal_documents from anon;
drop policy if exists "Owner only" on public.personal_documents;
create policy "Owner only" on public.personal_documents for all to authenticated
  using ((select private.is_owner())) with check ((select private.is_owner()));
