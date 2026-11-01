-- Anon gets no access to the 2025 ledger tables (RLS already limits them to the owner).
revoke all on public.personal_statements, public.personal_crypto_orders, public.personal_exchange_movements, public.personal_bank_movements, public.personal_flow_links from anon;
