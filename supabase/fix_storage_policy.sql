
-- Fix for "Failed to update website file" error
-- The previous schema only allowed INSERT (uploads), but editing requires UPDATE permissions.

create policy "Users can update their own websites"
on storage.objects for update
using ( bucket_id = 'websites' and auth.uid()::text = (storage.foldername(name))[1] );

-- Ensure generic "modify" is covered if needed, though UPDATE is usually sufficient for upsert.
-- This combined with the existing INSERT policy covers valid upserts.
