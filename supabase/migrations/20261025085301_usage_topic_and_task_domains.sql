alter table public.personal_ai_usage add column if not exists topic text;
alter table public.personal_tasks drop constraint if exists personal_tasks_domain_check;
alter table public.personal_tasks add constraint personal_tasks_domain_check
  check (domain in ('personal', 'health', 'pension', 'money', 'debt', 'entity', 'tax', 'job', 'us', 'identity', 'other'));