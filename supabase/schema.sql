-- Profile
create table if not exists profile (
  id serial primary key,
  name text not null,
  title text not null,
  summary text not null,
  photo_url text,
  industries text
);
alter table profile enable row level security;
create policy "Public read" on profile for select using (true);
create policy "Admin write" on profile for all to authenticated using (true) with check (true);

-- Experiences
create table if not exists experiences (
  id serial primary key,
  role text not null,
  company text not null,
  years text not null,
  points text[] not null default '{}',
  website text,
  logo_url text,
  "order" int not null default 0
);
alter table experiences enable row level security;
create policy "Public read" on experiences for select using (true);
create policy "Admin write" on experiences for all to authenticated using (true) with check (true);

-- Projects
create table if not exists projects (
  id serial primary key,
  name text not null,
  role text not null,
  years text not null,
  brief text,
  points text[] not null default '{}',
  website text,
  logo_url text,
  socials jsonb default '{}',
  "order" int not null default 0
);
alter table projects enable row level security;
create policy "Public read" on projects for select using (true);
create policy "Admin write" on projects for all to authenticated using (true) with check (true);

-- Education
create table if not exists education (
  id serial primary key,
  degree text not null,
  institution text not null,
  years text not null,
  abroad_program text,
  logo_url text,
  "order" int not null default 0
);
alter table education enable row level security;
create policy "Public read" on education for select using (true);
create policy "Admin write" on education for all to authenticated using (true) with check (true);

-- Certificates
create table if not exists certificates (
  id serial primary key,
  name text not null,
  issuer text not null,
  year text,
  logo_url text,
  "order" int not null default 0
);
alter table certificates enable row level security;
create policy "Public read" on certificates for select using (true);
create policy "Admin write" on certificates for all to authenticated using (true) with check (true);

-- Volunteering
create table if not exists volunteering (
  id serial primary key,
  name text not null,
  issuer text not null,
  year text,
  logo_url text,
  "order" int not null default 0
);
alter table volunteering enable row level security;
create policy "Public read" on volunteering for select using (true);
create policy "Admin write" on volunteering for all to authenticated using (true) with check (true);

-- Skills
create table if not exists skills (
  id serial primary key,
  category text not null,
  items text[] not null default '{}',
  type text not null check (type in ('technical', 'soft')),
  "order" int not null default 0
);
alter table skills enable row level security;
create policy "Public read" on skills for select using (true);
create policy "Admin write" on skills for all to authenticated using (true) with check (true);

-- Languages
create table if not exists languages (
  id serial primary key,
  name text not null,
  level text not null,
  flag text,
  "order" int not null default 0
);
alter table languages enable row level security;
create policy "Public read" on languages for select using (true);
create policy "Admin write" on languages for all to authenticated using (true) with check (true);

-- Job Applications
create table if not exists job_applications (
  id serial primary key,
  company text not null,
  position text not null,
  website text,
  application_url text,
  description text,
  status text not null default 'saved' check (status in ('saved', 'applied', 'interviewing', 'offered', 'rejected', 'withdrawn')),
  applied_at text,
  notes text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);
alter table job_applications enable row level security;
create policy "Admin only" on job_applications for all to authenticated using (true) with check (true);

-- Contact
create table if not exists contact (
  id serial primary key,
  email text,
  whatsapp text,
  telegram text,
  github text,
  linkedin text,
  twitter text,
  farcaster text
);
alter table contact enable row level security;
create policy "Public read" on contact for select using (true);
create policy "Admin write" on contact for all to authenticated using (true) with check (true);
