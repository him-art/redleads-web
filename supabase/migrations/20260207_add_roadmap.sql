-- Create Guide_nodes table
create table public.Guide_nodes (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  phase integer not null, -- 1, 2, 3
  order_index integer not null, -- 1, 2, 3... global order
  title text not null,
  description text not null,
  content text null, -- Markdown content
  action_link text null, -- Internal deep link
  action_label text null, -- Button text
  
  constraint Guide_nodes_pkey primary key (id),
  constraint Guide_nodes_order_unique unique (order_index)
);

-- Create user_Guide_progress table
create table public.user_Guide_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  node_id uuid not null references public.Guide_nodes(id) on delete cascade,
  completed_at timestamp with time zone not null default now(),
  status text not null check (status in ('completed', 'skipped')), 
  
  constraint user_Guide_progress_pkey primary key (user_id, node_id)
);

-- Enable RLS
alter table public.Guide_nodes enable row level security;
alter table public.user_Guide_progress enable row level security;

-- Policies for Guide_nodes (Public read, Admin write)
create policy "Allow public read access" on public.Guide_nodes
  for select using (true);

-- Policies for user_Guide_progress (Users can read/write their own)
create policy "Users can view own progress" on public.user_Guide_progress
  for select using (auth.uid() = user_id);

create policy "Users can update own progress" on public.user_Guide_progress
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own progress" on public.user_Guide_progress
  for delete using (auth.uid() = user_id);
