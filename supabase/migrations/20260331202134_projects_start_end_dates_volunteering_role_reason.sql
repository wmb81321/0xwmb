
-- Projects: add start/end dates, make years nullable
alter table projects add column if not exists start_date text;
alter table projects add column if not exists end_date text;
alter table projects alter column years drop not null;

-- Volunteering: rename name→reason, add role
alter table volunteering rename column name to reason;
alter table volunteering add column if not exists role text;
