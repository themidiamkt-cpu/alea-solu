-- Add new columns for auction details
alter table opportunities add column if not exists valuation_value numeric;
alter table opportunities add column if not exists second_floor_value numeric;
alter table opportunities add column if not exists discount_percentage numeric;
alter table opportunities add column if not exists clickbait text;

-- Update existing market_value to valuation_value if it was used
update opportunities set valuation_value = market_value where valuation_value is null and market_value is not null;

-- Update existing price to second_floor_value if it was used as such
update opportunities set second_floor_value = price where second_floor_value is null and price is not null;
