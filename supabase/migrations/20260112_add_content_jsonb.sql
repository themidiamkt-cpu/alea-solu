alter table site_content add column if not exists content jsonb default '{}'::jsonb;
