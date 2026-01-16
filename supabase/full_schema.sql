-- Consolidated Schema for Alea Leilões Admin Layer
-- Run this in the Supabase SQL Editor of your new project

-- 1. Enable UUID extension (usually on by default, but good to ensure)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums
DO $$ BEGIN
    CREATE TYPE opportunity_type AS ENUM ('LEILAO', 'IMOVEL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create Tables

-- Table: opportunities
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type opportunity_type NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  neighborhood TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  garage INTEGER,
  area FLOAT,
  auction_date TIMESTAMP WITH TIME ZONE,
  highlight BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: opportunity_images
CREATE TABLE IF NOT EXISTS public.opportunity_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_url TEXT,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: site_content
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  text TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- 5. Create Functions and Triggers for updated_at

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_content_updated_at ON public.site_content;
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- 6. Storage Buckets (Note: SQL creation of buckets might be restricted in some Supabase environments, usually fine)
-- If this fails, create buckets manually: 'opportunities', 'documents', 'blog' (public)

INSERT INTO storage.buckets (id, name, public) VALUES ('opportunities', 'opportunities', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('site', 'site', true) ON CONFLICT (id) DO NOTHING; -- Assuming 'site' for content images, or reuse 'blog'/'opportunities'

-- 7. RLS Policies

-- ==> Opportunities
-- Public read
DROP POLICY IF EXISTS "Public select opportunities" ON opportunities;
CREATE POLICY "Public select opportunities" ON opportunities FOR SELECT USING (true);
-- Auth write
DROP POLICY IF EXISTS "Auth insert opportunities" ON opportunities;
CREATE POLICY "Auth insert opportunities" ON opportunities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth update opportunities" ON opportunities;
CREATE POLICY "Auth update opportunities" ON opportunities FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth delete opportunities" ON opportunities;
CREATE POLICY "Auth delete opportunities" ON opportunities FOR DELETE USING (auth.role() = 'authenticated');

-- ==> Opportunity Images
-- Public read
DROP POLICY IF EXISTS "Public select opportunity_images" ON opportunity_images;
CREATE POLICY "Public select opportunity_images" ON opportunity_images FOR SELECT USING (true);
-- Auth write
DROP POLICY IF EXISTS "Auth insert opportunity_images" ON opportunity_images;
CREATE POLICY "Auth insert opportunity_images" ON opportunity_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth delete opportunity_images" ON opportunity_images;
CREATE POLICY "Auth delete opportunity_images" ON opportunity_images FOR DELETE USING (auth.role() = 'authenticated');

-- ==> Blog Posts
-- Public read
DROP POLICY IF EXISTS "Public select blog_posts" ON blog_posts;
CREATE POLICY "Public select blog_posts" ON blog_posts FOR SELECT USING (true);
-- Auth write
DROP POLICY IF EXISTS "Auth insert blog_posts" ON blog_posts;
CREATE POLICY "Auth insert blog_posts" ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth update blog_posts" ON blog_posts;
CREATE POLICY "Auth update blog_posts" ON blog_posts FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth delete blog_posts" ON blog_posts;
CREATE POLICY "Auth delete blog_posts" ON blog_posts FOR DELETE USING (auth.role() = 'authenticated');

-- ==> Site Content
-- Public read
DROP POLICY IF EXISTS "Public select site_content" ON site_content;
CREATE POLICY "Public select site_content" ON site_content FOR SELECT USING (true);
-- Auth write
DROP POLICY IF EXISTS "Auth insert site_content" ON site_content;
CREATE POLICY "Auth insert site_content" ON site_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth update site_content" ON site_content;
CREATE POLICY "Auth update site_content" ON site_content FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth delete site_content" ON site_content;
CREATE POLICY "Auth delete site_content" ON site_content FOR DELETE USING (auth.role() = 'authenticated');

-- ==> Storage Policies
-- Public read (for all relevant buckets)
DROP POLICY IF EXISTS "Public read storage" ON storage.objects;
CREATE POLICY "Public read storage" ON storage.objects FOR SELECT USING (bucket_id IN ('opportunities', 'documents', 'blog', 'site'));

-- Auth upload/delete (simplistic policy for authenticated users)
DROP POLICY IF EXISTS "Auth upload storage" ON storage.objects;
CREATE POLICY "Auth upload storage" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth update storage" ON storage.objects;
CREATE POLICY "Auth update storage" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth delete storage" ON storage.objects;
CREATE POLICY "Auth delete storage" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');
