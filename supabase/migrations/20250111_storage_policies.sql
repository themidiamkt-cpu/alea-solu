-- Force enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------
-- 1. Public Read Access
-------------------------------------------------------------------------------
-- Allow public to view files in valid buckets
DROP POLICY IF EXISTS "Public read storage" ON storage.objects;
CREATE POLICY "Public read storage" ON storage.objects 
FOR SELECT USING ( bucket_id IN ('opportunities', 'documents', 'blog', 'site') );

-------------------------------------------------------------------------------
-- 2. Authenticated Upload/Delete Access
-------------------------------------------------------------------------------
-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Auth insert storage" ON storage.objects;
CREATE POLICY "Auth insert storage" ON storage.objects 
FOR INSERT WITH CHECK ( auth.role() = 'authenticated' );

-- Allow authenticated users to update files
DROP POLICY IF EXISTS "Auth update storage" ON storage.objects;
CREATE POLICY "Auth update storage" ON storage.objects 
FOR UPDATE USING ( auth.role() = 'authenticated' );

-- Allow authenticated users to delete files
DROP POLICY IF EXISTS "Auth delete storage" ON storage.objects;
CREATE POLICY "Auth delete storage" ON storage.objects 
FOR DELETE USING ( auth.role() = 'authenticated' );
