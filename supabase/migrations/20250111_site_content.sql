-- Create site_content table
create table if not exists site_content (
  id uuid default gen_random_uuid() primary key,
  key text not null unique,
  title text,
  subtitle text,
  text text,
  image_url text,
  -- Additional fields for stats, testimonials, etc.
  number text,
  label text,
  author text,
  role text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table site_content enable row level security;

-- Create policies
create policy "Public can view site content"
  on site_content for select
  using (true);

create policy "Authenticated users can manage site content"
  on site_content for all
  using (auth.role() = 'authenticated');

