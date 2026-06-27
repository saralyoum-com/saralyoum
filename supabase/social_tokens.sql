-- Run this once in Supabase SQL Editor
-- Dashboard: supabase.com → your project → SQL Editor

create table if not exists public.social_tokens (
  platform    text primary key,          -- 'facebook' | 'instagram' | 'linkedin' | 'twitter'
  token       text        not null,
  meta        jsonb       default '{}'::jsonb,
  connected   boolean     default true,
  updated_at  timestamptz default now()
);

-- Only the server (service key) can read/write tokens — never expose to browser
alter table public.social_tokens enable row level security;

create policy "service only" on public.social_tokens
  as restrictive
  for all
  using (false);      -- anon / authed users see nothing; service role bypasses RLS
