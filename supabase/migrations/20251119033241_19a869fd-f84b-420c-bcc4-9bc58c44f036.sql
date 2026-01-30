-- Create enum for opportunity types
CREATE TYPE opportunity_type AS ENUM ('LEILAO', 'IMOVEL');

-- Create opportunities table
CREATE TABLE public.opportunities (
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

-- Create opportunity_images table
CREATE TABLE public.opportunity_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_url TEXT,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for opportunities
CREATE POLICY "Anyone can view opportunities"
  ON public.opportunities
  FOR SELECT
  USING (true);

-- Public read access for opportunity images
CREATE POLICY "Anyone can view opportunity images"
  ON public.opportunity_images
  FOR SELECT
  USING (true);

-- Public read access for blog posts
CREATE POLICY "Anyone can view blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('opportunities', 'opportunities', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog', 'blog', true);

-- Storage policies for opportunities bucket
CREATE POLICY "Anyone can view opportunity images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'opportunities');

-- Storage policies for documents bucket
CREATE POLICY "Anyone can view documents"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'documents');

-- Storage policies for blog bucket
CREATE POLICY "Anyone can view blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();