-- Create websites table
create table public.websites (
  id text primary key,
  user_id uuid references auth.users not null,
  html_path text not null,
  paid boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.websites enable row level security;

-- Policies
create policy "Users can view their own websites"
  on public.websites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own websites"
  on public.websites for insert
  with check (auth.uid() = user_id);
  
create policy "Users can update their own websites"
  on public.websites for update
  using (auth.uid() = user_id);

-- Create Storage Bucket
insert into storage.buckets (id, name, public)
values ('websites', 'websites', true);

-- Storage Policies
create policy "Users can upload their own websites"
on storage.objects for insert
with check ( bucket_id = 'websites' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can view their own websites"
on storage.objects for select
using ( bucket_id = 'websites' and auth.uid()::text = (storage.foldername(name))[1] );
