-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access" ON public.team_members
    FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON public.team_members
    FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions (just in case)
GRANT ALL ON public.team_members TO authenticated;
GRANT SELECT ON public.team_members TO anon;
