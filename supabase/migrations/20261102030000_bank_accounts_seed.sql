-- Bank/fintech accounts for the 2025 ledger.
-- 1. Allow 'falabella', 'rappicuenta', 'daviplata' in personal_bank_movements.account.
--    That column is text + CHECK constraint (not a Postgres enum), so the constraint is replaced; no ALTER TYPE needed.
-- 2. Seed personal_accounts (table already exists since 20261025073854_personal_tables, owner-only RLS) with the
--    accounts the loader attaches movements to. Last 4 digits only, never full numbers.
-- 3. personal_bank_movements.account_id (nullable FK -> personal_accounts.id, on delete set null) + index already exist
--    since 20261101224449; re-asserted here with IF NOT EXISTS so this file is self-contained.
-- Idempotent: safe to run more than once. No movement data is written here.

-- 1. Allowed account slugs --------------------------------------------------------------------------------------------
alter table public.personal_bank_movements drop constraint if exists personal_bank_movements_account_check;
alter table public.personal_bank_movements add constraint personal_bank_movements_account_check
  check (account in ('bancolombia', 'nequi', 'davivienda', 'nu', 'falabella', 'rappicuenta', 'daviplata', 'other'));

-- 2. Seed accounts ----------------------------------------------------------------------------------------------------
-- personal_accounts has no natural unique key, so each row is inserted only if no row exists for the same institution
-- (case-insensitive) with the same last4, or with a null last4 on either side (avoids duplicating a row added by hand).
insert into public.personal_accounts (institution, country, kind, currency, last4, status)
select v.institution, 'CO', v.kind, 'COP', v.last4, 'active'
from (values
  (1, 'Bancolombia', 'bank'   , '6591'),
  (2, 'Nequi'      , 'fintech', '4116'),
  (3, 'Davivienda' , 'bank'   , '9734'),
  (4, 'Nu'         , 'fintech', '1672'),
  (5, 'Falabella'  , 'bank'   , '7724'),
  (6, 'RappiCuenta', 'fintech', null),
  (7, 'Skandia'    , 'broker' , null)
) as v(ord, institution, kind, last4)
where not exists (
  select 1 from public.personal_accounts a
  where lower(a.institution) = lower(v.institution)
    and (a.last4 is null or v.last4 is null or a.last4 = v.last4)
)
order by v.ord;

-- 3. Movement -> account link -----------------------------------------------------------------------------------------
alter table public.personal_bank_movements
  add column if not exists account_id int references public.personal_accounts(id) on delete set null;
create index if not exists personal_bank_movements_account_id_idx on public.personal_bank_movements (account_id);

-- RLS on both tables stays "Owner only" (same pattern as every personal_* table); re-asserted, no new grants.
do $$
declare t text;
begin
  foreach t in array array['personal_accounts', 'personal_bank_movements'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('drop policy if exists "Owner only" on public.%I', t);
    execute format(
      'create policy "Owner only" on public.%I for all to authenticated
         using ((select private.is_owner())) with check ((select private.is_owner()))', t);
  end loop;
end $$;
