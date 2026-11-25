-- Allow Falabella, RappiCuenta and DaviPlata as sources in personal_bank_movements.account.
-- The column is text + CHECK constraint (not an enum), so the constraint is replaced.
-- The account rows themselves (personal_accounts) are personal data: applied directly to the DB, never committed.
alter table public.personal_bank_movements drop constraint if exists personal_bank_movements_account_check;
alter table public.personal_bank_movements add constraint personal_bank_movements_account_check
  check (account in ('bancolombia', 'nequi', 'davivienda', 'nu', 'falabella', 'rappicuenta', 'daviplata', 'other'));
