alter table public.personal_payments add column if not exists country text;
alter table public.personal_payments drop constraint if exists personal_payments_country_check;
alter table public.personal_payments add constraint personal_payments_country_check check (country in ('CO','US','OTHER'));
comment on column public.personal_payments.country is 'Tax jurisdiction of the bill/issuer: CO, US or OTHER (nullable).';
create index if not exists personal_payments_country_idx on public.personal_payments (country);