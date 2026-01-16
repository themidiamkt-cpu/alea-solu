-- Enable RLS on tables (if not already enabled)
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_images ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------
-- Opportunities Policies
-------------------------------------------------------------------------------
-- Allow public read access
DROP POLICY IF EXISTS "Public select opportunities" ON opportunities;
CREATE POLICY "Public select opportunities" ON opportunities FOR SELECT USING (true);

-- Allow authenticated users to INSERT
DROP POLICY IF EXISTS "Auth insert opportunities" ON opportunities;
CREATE POLICY "Auth insert opportunities" ON opportunities FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to UPDATE
DROP POLICY IF EXISTS "Auth update opportunities" ON opportunities;
CREATE POLICY "Auth update opportunities" ON opportunities FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to DELETE
DROP POLICY IF EXISTS "Auth delete opportunities" ON opportunities;
CREATE POLICY "Auth delete opportunities" ON opportunities FOR DELETE USING (auth.role() = 'authenticated');

-------------------------------------------------------------------------------
-- Blog Posts Policies
-------------------------------------------------------------------------------
-- Allow public read access
DROP POLICY IF EXISTS "Public select blog_posts" ON blog_posts;
CREATE POLICY "Public select blog_posts" ON blog_posts FOR SELECT USING (true);

-- Allow authenticated users to INSERT
DROP POLICY IF EXISTS "Auth insert blog_posts" ON blog_posts;
CREATE POLICY "Auth insert blog_posts" ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to UPDATE
DROP POLICY IF EXISTS "Auth update blog_posts" ON blog_posts;
CREATE POLICY "Auth update blog_posts" ON blog_posts FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to DELETE
DROP POLICY IF EXISTS "Auth delete blog_posts" ON blog_posts;
CREATE POLICY "Auth delete blog_posts" ON blog_posts FOR DELETE USING (auth.role() = 'authenticated');

-------------------------------------------------------------------------------
-- Opportunity Images Policies
-------------------------------------------------------------------------------
-- Allow public read access
DROP POLICY IF EXISTS "Public select opportunity_images" ON opportunity_images;
CREATE POLICY "Public select opportunity_images" ON opportunity_images FOR SELECT USING (true);

-- Allow authenticated users to INSERT
DROP POLICY IF EXISTS "Auth insert opportunity_images" ON opportunity_images;
CREATE POLICY "Auth insert opportunity_images" ON opportunity_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to DELETE (Images are usually deleted by cascade or manually)
DROP POLICY IF EXISTS "Auth delete opportunity_images" ON opportunity_images;
CREATE POLICY "Auth delete opportunity_images" ON opportunity_images FOR DELETE USING (auth.role() = 'authenticated');
