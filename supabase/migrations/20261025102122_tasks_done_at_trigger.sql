create or replace function private.stamp_task_done_at()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  if new.status = 'done' and (tg_op = 'INSERT' or old.status is distinct from 'done') and new.done_at is null then
    new.done_at := now();
  elsif new.status <> 'done' then
    new.done_at := null;
  end if;
  return new;
end;
$$;
drop trigger if exists personal_tasks_done_at on public.personal_tasks;
create trigger personal_tasks_done_at before insert or update of status on public.personal_tasks
  for each row execute function private.stamp_task_done_at();