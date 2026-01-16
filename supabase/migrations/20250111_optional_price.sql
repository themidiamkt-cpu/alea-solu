-- Make price optional in opportunities table
ALTER TABLE opportunities ALTER COLUMN price DROP NOT NULL;
