create extension if not exists "pgcrypto";
create extension if not exists "vector";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  model text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  content text not null,
  image_url text,
  likes_count integer not null default 0 check (likes_count >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  title text not null,
  description text not null,
  content text generated always as (description) stored,
  happened_at date not null,
  type text not null default 'memory' check (type in ('memory', 'anniversary', 'event')),
  valence numeric not null default 0 check (valence >= -1 and valence <= 1),
  arousal numeric not null default 0.35 check (arousal >= 0 and arousal <= 1),
  importance integer not null default 5 check (importance >= 1 and importance <= 10),
  is_pinned boolean not null default false,
  is_resolved boolean not null default false,
  is_active boolean not null default true,
  source text not null default 'manual',
  author text,
  activation_count integer not null default 0 check (activation_count >= 0),
  last_activated_at timestamptz,
  room text not null default 'default',
  embedding vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.anniversaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  title text not null,
  date date not null,
  repeats_yearly boolean not null default true,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  source_name text not null,
  original_content text not null,
  file_type text not null default 'txt',
  room text not null default 'default',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (source_name, room)
);

create table if not exists public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.knowledge_documents(id) on delete cascade,
  source_name text not null,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null,
  room text not null default 'default',
  embedding vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create table if not exists public.memory_settings (
  id uuid primary key default gen_random_uuid(),
  room text not null unique default 'default',
  decay_lambda numeric not null default 0.015,
  recall_limit integer not null default 6,
  pinned_limit integer not null default 4,
  knowledge_limit integer not null default 5,
  knowledge_similarity_threshold numeric not null default 0.3,
  default_digest_model text not null default 'anthropic/claude-3.5-sonnet',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists messages_user_created_idx on public.messages (user_id, created_at);
create index if not exists moments_created_idx on public.moments (created_at desc);
create index if not exists memories_happened_idx on public.memories (happened_at desc);
create index if not exists memories_room_active_idx on public.memories (room, is_active, is_pinned, importance desc);
create index if not exists memories_source_idx on public.memories (source);
create index if not exists memories_embedding_idx on public.memories using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index if not exists anniversaries_date_idx on public.anniversaries (date);
create index if not exists knowledge_documents_room_idx on public.knowledge_documents (room, created_at desc);
create index if not exists knowledge_chunks_room_idx on public.knowledge_chunks (room, chunk_index);
create index if not exists knowledge_chunks_embedding_idx on public.knowledge_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

alter table public.users enable row level security;
alter table public.messages enable row level security;
alter table public.moments enable row level security;
alter table public.memories enable row level security;
alter table public.anniversaries enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.knowledge_chunks enable row level security;
alter table public.memory_settings enable row level security;

create policy "Public read users" on public.users for select using (true);
create policy "Public read messages" on public.messages for select using (true);
create policy "Public insert messages" on public.messages for insert with check (true);
create policy "Public read moments" on public.moments for select using (true);
create policy "Public read memories" on public.memories for select using (true);
create policy "Public insert memories" on public.memories for insert with check (true);
create policy "Public update memories" on public.memories for update using (true);
create policy "Public delete memories" on public.memories for delete using (true);
create policy "Public read anniversaries" on public.anniversaries for select using (true);
create policy "Public read knowledge documents" on public.knowledge_documents for select using (true);
create policy "Public insert knowledge documents" on public.knowledge_documents for insert with check (true);
create policy "Public update knowledge documents" on public.knowledge_documents for update using (true);
create policy "Public delete knowledge documents" on public.knowledge_documents for delete using (true);
create policy "Public read knowledge chunks" on public.knowledge_chunks for select using (true);
create policy "Public insert knowledge chunks" on public.knowledge_chunks for insert with check (true);
create policy "Public update knowledge chunks" on public.knowledge_chunks for update using (true);
create policy "Public delete knowledge chunks" on public.knowledge_chunks for delete using (true);
create policy "Public read memory settings" on public.memory_settings for select using (true);
create policy "Public update memory settings" on public.memory_settings for update using (true);

create or replace function public.match_knowledge_chunks(
  query_embedding vector(1536),
  match_room text default 'default',
  match_count int default 5,
  similarity_threshold float default 0.3
)
returns table (
  id uuid,
  document_id uuid,
  source_name text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    knowledge_chunks.id,
    knowledge_chunks.document_id,
    knowledge_chunks.source_name,
    knowledge_chunks.content,
    1 - (knowledge_chunks.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks
  where knowledge_chunks.room = match_room
    and knowledge_chunks.embedding is not null
    and 1 - (knowledge_chunks.embedding <=> query_embedding) > similarity_threshold
  order by knowledge_chunks.embedding <=> query_embedding
  limit match_count;
$$;

create or replace function public.match_memories(
  query_embedding vector(1536),
  match_room text default 'default',
  match_count int default 12
)
returns table (
  id uuid,
  title text,
  description text,
  source text,
  similarity float
)
language sql stable
as $$
  select
    memories.id,
    memories.title,
    memories.description,
    memories.source,
    1 - (memories.embedding <=> query_embedding) as similarity
  from public.memories
  where memories.room = match_room
    and memories.is_active = true
    and memories.embedding is not null
  order by memories.embedding <=> query_embedding
  limit match_count;
$$;
