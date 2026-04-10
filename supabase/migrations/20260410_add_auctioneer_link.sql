-- Add auctioneer_link column to opportunities table
alter table opportunities add column if not exists auctioneer_link text;
