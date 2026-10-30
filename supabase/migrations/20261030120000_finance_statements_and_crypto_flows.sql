-- 2025 personal finance: account statements + crypto-flow ledger (order -> exchange -> DolarApp sale -> bank inflow -> payee outflow).
-- Schema only. Single-owner app: no user_id column; access is "Owner only" via private.is_owner(), same as every personal_* table.
-- Idempotent: safe to run more than once.

-- 1. Statements (bank / fintech / exchange period statements) -----------------------------------------------------------
create table if not exists public.personal_statements (
  id serial primary key,
  account_id int references public.personal_accounts(id) on delete set null,
  institution text not null,
  kind text not null default 'bank',
  account_last4 text,
  currency text not null default 'COP',
  country text,
  period_start date not null,
  period_end date not null,
  opening_balance numeric(18, 2),
  total_in numeric(18, 2),
  total_out numeric(18, 2),
  closing_balance numeric(18, 2),
  drive_file_id text,
  drive_url text,
  file_path text,
  sha256 text,
  status text not null default 'imported',
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.personal_statements drop constraint if exists personal_statements_kind_check;
alter table public.personal_statements add constraint personal_statements_kind_check
  check (kind in ('bank', 'card', 'fintech', 'exchange', 'broker', 'other'));
alter table public.personal_statements drop constraint if exists personal_statements_country_check;
alter table public.personal_statements add constraint personal_statements_country_check check (country in ('CO', 'US', 'OTHER'));
alter table public.personal_statements drop constraint if exists personal_statements_period_check;
alter table public.personal_statements add constraint personal_statements_period_check check (period_end >= period_start);
alter table public.personal_statements drop constraint if exists personal_statements_last4_check;
alter table public.personal_statements add constraint personal_statements_last4_check check (account_last4 ~ '^[0-9A-Za-z]{1,4}$');
alter table public.personal_statements drop constraint if exists personal_statements_sha256_check;
alter table public.personal_statements add constraint personal_statements_sha256_check check (sha256 ~ '^[0-9a-f]{64}$');
alter table public.personal_statements drop constraint if exists personal_statements_status_check;
alter table public.personal_statements add constraint personal_statements_status_check
  check (status in ('imported', 'reconciled', 'partial', 'archived'));
create unique index if not exists personal_statements_sha256_key on public.personal_statements (sha256) where sha256 is not null;
create unique index if not exists personal_statements_drive_file_key on public.personal_statements (drive_file_id) where drive_file_id is not null;
create index if not exists personal_statements_period_idx on public.personal_statements (institution, period_start);
create index if not exists personal_statements_account_idx on public.personal_statements (account_id);
comment on table public.personal_statements is 'Periodic account statements (extractos). One row per statement file; movements live in personal_bank_movements / personal_exchange_movements.';
comment on column public.personal_statements.account_last4 is 'Last 4 characters of the account only; never the full number.';
comment on column public.personal_statements.sha256 is 'Hex SHA-256 of the source file, used to avoid importing the same statement twice.';

-- 2. Crypto orders ("Orden de Activos Digitales" form responses) -------------------------------------------------------
create table if not exists public.personal_crypto_orders (
  id serial primary key,
  source_ref text,
  submitted_at timestamptz,
  order_date date not null,
  type text not null,
  asset text not null,
  chain text,
  qty numeric(38, 18) not null,
  price numeric(18, 6),
  pay_currency text not null default 'COP',
  cop_paid numeric(18, 2),
  gmf numeric(18, 2),
  sale_date date,
  sale_venue text,
  sale_price numeric(18, 6),
  cop_received numeric(18, 2),
  margin_cop numeric(18, 2),
  counterparty_name text,
  counterparty_id_type text,
  counterparty_id text,
  wallet text,
  payment_method text,
  bank text,
  receipt_drive_id text,
  country text not null default 'CO',
  notes text,
  created_at timestamptz not null default now()
);
alter table public.personal_crypto_orders drop constraint if exists personal_crypto_orders_type_check;
alter table public.personal_crypto_orders add constraint personal_crypto_orders_type_check check (type in ('VENTA', 'COMPRA'));
alter table public.personal_crypto_orders drop constraint if exists personal_crypto_orders_qty_check;
alter table public.personal_crypto_orders add constraint personal_crypto_orders_qty_check check (qty > 0);
alter table public.personal_crypto_orders drop constraint if exists personal_crypto_orders_sale_venue_check;
alter table public.personal_crypto_orders add constraint personal_crypto_orders_sale_venue_check
  check (sale_venue in ('dolarapp', 'binance_p2p', 'okx', 'other'));
alter table public.personal_crypto_orders drop constraint if exists personal_crypto_orders_country_check;
alter table public.personal_crypto_orders add constraint personal_crypto_orders_country_check check (country in ('CO', 'US', 'OTHER'));
create unique index if not exists personal_crypto_orders_source_ref_key on public.personal_crypto_orders (source_ref) where source_ref is not null;
create index if not exists personal_crypto_orders_date_idx on public.personal_crypto_orders (order_date);
create index if not exists personal_crypto_orders_sale_date_idx on public.personal_crypto_orders (sale_date);
comment on table public.personal_crypto_orders is 'Orden de Activos Digitales. VENTA = counterparty sells crypto to me; COMPRA = counterparty buys. Primary record of the crypto flow.';
comment on column public.personal_crypto_orders.source_ref is 'Stable id of the source row (e.g. form response timestamp); unique, makes reloads idempotent.';
comment on column public.personal_crypto_orders.submitted_at is 'Form timestamp; often logged days after payment. Use order_date / bank date for matching.';

-- 3. Exchange / fintech movements (Binance, OKX, DolarApp) ------------------------------------------------------------
create table if not exists public.personal_exchange_movements (
  id bigserial primary key,
  source text not null,
  source_row_key text not null,
  statement_id int references public.personal_statements(id) on delete set null,
  ts timestamptz,
  occurred_on date,
  account text,
  operation text not null,
  asset text,
  amount numeric(38, 18) not null,
  local_currency text,
  local_amount numeric(38, 18),
  cop_amount numeric(18, 2),
  rate numeric(18, 6),
  network text,
  address text,
  txid text,
  p2p_order text,
  description text,
  country text,
  raw jsonb not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.personal_exchange_movements drop constraint if exists personal_exchange_movements_source_check;
alter table public.personal_exchange_movements add constraint personal_exchange_movements_source_check
  check (source in ('binance', 'okx', 'dolarapp'));
alter table public.personal_exchange_movements drop constraint if exists personal_exchange_movements_country_check;
alter table public.personal_exchange_movements add constraint personal_exchange_movements_country_check check (country in ('CO', 'US', 'OTHER'));
create unique index if not exists personal_exchange_movements_row_key on public.personal_exchange_movements (source, source_row_key);
create unique index if not exists personal_exchange_movements_txid_key
  on public.personal_exchange_movements (source, txid, operation, asset) where txid is not null;
create index if not exists personal_exchange_movements_ts_idx on public.personal_exchange_movements (source, ts);
create index if not exists personal_exchange_movements_date_idx on public.personal_exchange_movements (occurred_on);
create index if not exists personal_exchange_movements_address_idx on public.personal_exchange_movements (lower(address)) where address is not null;
create index if not exists personal_exchange_movements_p2p_idx on public.personal_exchange_movements (p2p_order) where p2p_order is not null;
create index if not exists personal_exchange_movements_statement_idx on public.personal_exchange_movements (statement_id);
comment on column public.personal_exchange_movements.source_row_key is 'Loader-built dedupe key, unique per source (e.g. statement file + row, or a hash of time/account/operation/coin/change/remark plus an occurrence index for identical rows).';
comment on column public.personal_exchange_movements.occurred_on is 'Local (America/Bogota) date. DolarApp statements only carry a date, so ts may be null there.';
comment on column public.personal_exchange_movements.amount is 'Signed amount in asset units (Binance Change / DolarApp Monto USD).';

-- 4. Bank movements (Bancolombia, Nequi, Davivienda, Nu) --------------------------------------------------------------
create table if not exists public.personal_bank_movements (
  id bigserial primary key,
  account text not null,
  account_last4 text,
  account_id int references public.personal_accounts(id) on delete set null,
  statement_id int references public.personal_statements(id) on delete set null,
  source_row_key text not null,
  date date not null,
  description text not null,
  branch text,
  doc_ref text,
  amount numeric(18, 2) not null,
  direction text generated always as (case when amount < 0 then 'outflow' else 'inflow' end) stored,
  balance numeric(18, 2),
  currency text not null default 'COP',
  counterparty text,
  category text,
  own_transfer boolean not null default false,
  country text not null default 'CO',
  notes text,
  created_at timestamptz not null default now()
);
alter table public.personal_bank_movements drop constraint if exists personal_bank_movements_account_check;
alter table public.personal_bank_movements add constraint personal_bank_movements_account_check
  check (account in ('bancolombia', 'nequi', 'davivienda', 'nu', 'other'));
alter table public.personal_bank_movements drop constraint if exists personal_bank_movements_last4_check;
alter table public.personal_bank_movements add constraint personal_bank_movements_last4_check check (account_last4 ~ '^[0-9A-Za-z]{1,4}$');
alter table public.personal_bank_movements drop constraint if exists personal_bank_movements_country_check;
alter table public.personal_bank_movements add constraint personal_bank_movements_country_check check (country in ('CO', 'US', 'OTHER'));
create unique index if not exists personal_bank_movements_row_key on public.personal_bank_movements (account, source_row_key);
create index if not exists personal_bank_movements_date_idx on public.personal_bank_movements (account, date);
create index if not exists personal_bank_movements_amount_idx on public.personal_bank_movements (amount, date);
create index if not exists personal_bank_movements_account_id_idx on public.personal_bank_movements (account_id);
create index if not exists personal_bank_movements_statement_idx on public.personal_bank_movements (statement_id);
comment on column public.personal_bank_movements.amount is 'Signed COP value (VALOR): negative = outflow.';
comment on column public.personal_bank_movements.source_row_key is 'Loader-built dedupe key, unique per account (e.g. statement sha + row number).';

-- 5. Flow links: one edge per hop of order -> exchange -> DolarApp sale -> bank inflow -> payee outflow ------------------
create table if not exists public.personal_flow_links (
  id bigserial primary key,
  flow_ref text,
  link_kind text not null,
  from_order_id int references public.personal_crypto_orders(id) on delete cascade,
  from_exchange_id bigint references public.personal_exchange_movements(id) on delete cascade,
  from_bank_id bigint references public.personal_bank_movements(id) on delete cascade,
  to_order_id int references public.personal_crypto_orders(id) on delete cascade,
  to_exchange_id bigint references public.personal_exchange_movements(id) on delete cascade,
  to_bank_id bigint references public.personal_bank_movements(id) on delete cascade,
  match_method text not null,
  confidence numeric(4, 3) not null default 1,
  amount_delta numeric(38, 18),
  day_delta int,
  notes text,
  created_at timestamptz not null default now()
);
alter table public.personal_flow_links drop constraint if exists personal_flow_links_kind_check;
alter table public.personal_flow_links add constraint personal_flow_links_kind_check check (link_kind in (
  'order_deposit',     -- order (VENTA) -> exchange deposit of the crypto
  'order_payee',       -- order -> bank outflow paying the counterparty
  'withdraw_dolarapp', -- exchange withdraw -> DolarApp "Compra USDc"
  'dolarapp_sale',     -- DolarApp "Compra USDc" or order -> DolarApp "Venta USDc"
  'payout',            -- DolarApp "Venta USDc" -> bank inflow (Pexto)
  'p2p_buy',           -- bank outflow -> Binance P2P buy
  'p2p_sell',          -- Binance P2P sell -> bank inflow
  'other'));
alter table public.personal_flow_links drop constraint if exists personal_flow_links_method_check;
alter table public.personal_flow_links add constraint personal_flow_links_method_check
  check (match_method in ('exact', 'sum', 'approx', 'txid', 'address', 'p2p_order', 'manual'));
alter table public.personal_flow_links drop constraint if exists personal_flow_links_confidence_check;
alter table public.personal_flow_links add constraint personal_flow_links_confidence_check check (confidence between 0 and 1);
alter table public.personal_flow_links drop constraint if exists personal_flow_links_ends_check;
alter table public.personal_flow_links add constraint personal_flow_links_ends_check check (
  num_nonnulls(from_order_id, from_exchange_id, from_bank_id) = 1
  and num_nonnulls(to_order_id, to_exchange_id, to_bank_id) = 1);
create unique index if not exists personal_flow_links_edge_key on public.personal_flow_links (
  link_kind,
  coalesce(from_order_id, 0), coalesce(from_exchange_id, 0), coalesce(from_bank_id, 0),
  coalesce(to_order_id, 0), coalesce(to_exchange_id, 0), coalesce(to_bank_id, 0));
create index if not exists personal_flow_links_from_order_idx on public.personal_flow_links (from_order_id);
create index if not exists personal_flow_links_from_exchange_idx on public.personal_flow_links (from_exchange_id);
create index if not exists personal_flow_links_from_bank_idx on public.personal_flow_links (from_bank_id);
create index if not exists personal_flow_links_to_order_idx on public.personal_flow_links (to_order_id);
create index if not exists personal_flow_links_to_exchange_idx on public.personal_flow_links (to_exchange_id);
create index if not exists personal_flow_links_to_bank_idx on public.personal_flow_links (to_bank_id);
create index if not exists personal_flow_links_flow_ref_idx on public.personal_flow_links (flow_ref) where flow_ref is not null;
comment on table public.personal_flow_links is 'Directed edges between orders, exchange movements and bank movements. Exactly one from_* and one to_* is set. Many-to-many (several orders in one DolarApp sale, sum matches) = several edges; flow_ref groups the edges of one chain.';

-- RLS: same "Owner only" policy as every personal_* table -------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'personal_statements', 'personal_crypto_orders', 'personal_exchange_movements',
    'personal_bank_movements', 'personal_flow_links'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('drop policy if exists "Owner only" on public.%I', t);
    execute format(
      'create policy "Owner only" on public.%I for all to authenticated
         using ((select private.is_owner())) with check ((select private.is_owner()))', t);
  end loop;
end $$;
