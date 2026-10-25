-- Invoices carry three dates: billing date, last day to pay, and the actual payment date.
-- A pending bill has a due date but no paid_at yet.
alter table public.personal_payments
  add column if not exists billed_at date,
  add column if not exists due_at date,
  add column if not exists status text not null default 'paid';
alter table public.personal_payments alter column paid_at drop not null;
alter table public.personal_payments drop constraint if exists personal_payments_status_check;
alter table public.personal_payments add constraint personal_payments_status_check
  check (status in ('pending', 'paid'));
alter table public.personal_payments drop constraint if exists personal_payments_paid_has_date;
alter table public.personal_payments add constraint personal_payments_paid_has_date
  check (status <> 'paid' or paid_at is not null);
create index if not exists personal_payments_due_idx on public.personal_payments (due_at) where status = 'pending';
