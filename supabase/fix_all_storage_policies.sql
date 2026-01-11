-- NUCLEAR OPTION: Reset and Fix All Storage Policies for 'websites' bucket

-- 1. Drop existing policies to avoid conflicts (ignore errors if they don't exist)
drop policy if exists "Users can upload their own websites" on storage.objects;
drop policy if exists "Users can view their own websites" on storage.objects;
drop policy if exists "Users can update their own websites" on storage.objects;
drop policy if exists "Users can delete their own websites" on storage.objects;

-- 2. Create comprehensive policies
-- VIEW
create policy "Users can view their own websites"
on storage.objects for select
using ( bucket_id = 'websites' and auth.uid()::text = (storage.foldername(name))[1] );

-- UPLOAD (INSERT)
create policy "Users can upload their own websites"
on storage.objects for insert
with check ( bucket_id = 'websites' and auth.uid()::text = (storage.foldername(name))[1] );

-- UPDATE (Overwrite)
create policy "Users can update their own websites"
on storage.objects for update
using ( bucket_id = 'websites' and auth.uid()::text = (storage.foldername(name))[1] );

-- DELETE (Optional but good to have)
create policy "Users can delete their own websites"
on storage.objects for delete
using ( bucket_id = 'websites' and auth.uid()::text = (storage.foldername(name))[1] );
