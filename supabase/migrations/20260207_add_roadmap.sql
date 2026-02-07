-- Create roadmap_nodes table
create table public.roadmap_nodes (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  phase integer not null, -- 1, 2, 3
  order_index integer not null, -- 1, 2, 3... global order
  title text not null,
  description text not null,
  content text null, -- Markdown content
  action_link text null, -- Internal deep link
  action_label text null, -- Button text
  
  constraint roadmap_nodes_pkey primary key (id),
  constraint roadmap_nodes_order_unique unique (order_index)
);

-- Create user_roadmap_progress table
create table public.user_roadmap_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  node_id uuid not null references public.roadmap_nodes(id) on delete cascade,
  completed_at timestamp with time zone not null default now(),
  status text not null check (status in ('completed', 'skipped')), 
  
  constraint user_roadmap_progress_pkey primary key (user_id, node_id)
);

-- Enable RLS
alter table public.roadmap_nodes enable row level security;
alter table public.user_roadmap_progress enable row level security;

-- Policies for roadmap_nodes (Public read, Admin write)
create policy "Allow public read access" on public.roadmap_nodes
  for select using (true);

-- Policies for user_roadmap_progress (Users can read/write their own)
create policy "Users can view own progress" on public.user_roadmap_progress
  for select using (auth.uid() = user_id);

create policy "Users can update own progress" on public.user_roadmap_progress
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own progress" on public.user_roadmap_progress
  for delete using (auth.uid() = user_id);
