-- ════════════════════════════════════════════
-- XBRAINET — SUPABASE SCHEMA
-- Run in Supabase SQL editor. Safe to re-run.
-- ════════════════════════════════════════════

-- USERS
create table if not exists users (
  id                     uuid primary key default gen_random_uuid(),
  phone_hash             text unique not null,
  username               text unique not null,
  tier                   text not null default 'free',
  entity                 text not null default 'LYRA',
  preferred_language     text default 'en',
  messages_today         integer default 0,
  messages_reset_at      date default current_date,
  stripe_customer_id     text,
  stripe_subscription_id text,
  gdpr_consent_at        timestamptz,
  brain_consent_at       timestamptz,
  created_at             timestamptz default now(),
  last_login             timestamptz default now()
);

-- DIGITAL BRAIN
create table if not exists digital_brains (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references users(id) on delete cascade unique,

  alias                 text,
  age                   integer,
  area_primaria         text,
  stato_energetico      text,
  protocollo_decisionale text,
  focus_universale      text,

  keywords_amore        jsonb default '[]',
  keywords_lavoro       jsonb default '[]',
  keywords_amicizia     jsonb default '[]',
  keywords_interessi    jsonb default '[]',
  keywords_paure        jsonb default '[]',
  keywords_energia      jsonb default '[]',
  keywords_altro        jsonb default '[]',

  sintesi_amore         text,
  sintesi_lavoro        text,
  sintesi_amicizia      text,
  sintesi_interessi     text,
  sintesi_paure         text,
  sintesi_energia       text,

  onboarding_complete   boolean default false,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- RELATIONS (Neural Link)
create table if not exists relations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references users(id) on delete cascade,
  related_user_id  uuid references users(id) on delete set null,
  session_key      text unique,
  key_expires_at   timestamptz,
  key_used         boolean default false,
  relation_label   text,
  behavioral_delta jsonb default '{}',
  created_at       timestamptz default now()
);

-- CONVERSATIONS
create table if not exists conversations (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references users(id) on delete cascade,
  relation_id    uuid references relations(id) on delete set null,
  role           text not null check (role in ('user','assistant')),
  content        text not null,
  entity         text not null,
  topic_detected text,
  created_at     timestamptz default now()
);

-- BLIND SPOT
create table if not exists blind_spot_links (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references users(id) on delete cascade,
  link_token          text unique not null,
  questions           jsonb not null,
  responses           jsonb default '[]',
  respondent_count    integer default 0,
  min_responses       integer default 3,
  expires_at          timestamptz,
  is_active           boolean default true,
  ai_report           text,
  report_generated_at timestamptz,
  created_at          timestamptz default now()
);

-- GROUPS (stub — UI coming soon)
create table if not exists groups (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  created_by  uuid references users(id) on delete cascade,
  invite_key  text unique,
  max_members integer default 10,
  created_at  timestamptz default now()
);

create table if not exists group_members (
  id        uuid primary key default gen_random_uuid(),
  group_id  uuid references groups(id) on delete cascade,
  user_id   uuid references users(id) on delete cascade,
  joined_at timestamptz default now(),
  unique(group_id, user_id)
);

-- ════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════
alter table users            enable row level security;
alter table digital_brains   enable row level security;
alter table relations        enable row level security;
alter table conversations    enable row level security;
alter table blind_spot_links enable row level security;
alter table groups           enable row level security;
alter table group_members    enable row level security;

drop policy if exists "users_own"         on users;
drop policy if exists "brain_own"         on digital_brains;
drop policy if exists "relations_own"     on relations;
drop policy if exists "conversations_own" on conversations;
drop policy if exists "blindspot_own"     on blind_spot_links;

create policy "users_own"         on users            for all using (auth.uid() = id);
create policy "brain_own"         on digital_brains   for all using (auth.uid() = user_id);
create policy "relations_own"     on relations        for all using (auth.uid() = user_id);
create policy "conversations_own" on conversations    for all using (auth.uid() = user_id);
create policy "blindspot_own"     on blind_spot_links for all using (auth.uid() = user_id);

-- ════════════════════════════════════════════
-- HELPERS
-- ════════════════════════════════════════════
create or replace function increment(row_id uuid, column_name text)
returns void language plpgsql as $$
begin
  execute format('update users set %I = %I + 1 where id = $1', column_name, column_name)
  using row_id;
end;
$$;
