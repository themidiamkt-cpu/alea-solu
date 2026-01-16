-- 1. Create the missing column if it doesn't exist
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS market_value NUMERIC;

-- 2. Insert the auction data
INSERT INTO public.opportunities (
    type, 
    title, 
    slug, 
    city, 
    state, 
    neighborhood,
    market_value, 
    price, 
    auction_date,
    area, 
    bedrooms, 
    bathrooms, 
    garage,
    description, 
    highlight
) VALUES (
    'LEILAO',
    'Apto 43,50 m² - Ribeirão Residencial Parque da Mata VI',
    'apto-43-50-m2-ribeirao-parque-da-mata-vi',
    'Ribeirão Preto', 
    'SP', 
    'Residencial Parque da Mata VI',
    171388.94,
    102833.36,
    '2025-12-17 14:00:00-03',
    43.50,
    2,
    1,
    1,
    'Leilão Judicial. Oportunidade de Apartamento com 43,50m² no Residencial Parque da Mata VI. 2ª Praça com 50% de desconto sobre a avaliação.',
    true
) ON CONFLICT (slug) DO UPDATE SET
    market_value = EXCLUDED.market_value,
    neighborhood = EXCLUDED.neighborhood,
    area = EXCLUDED.area,
    bedrooms = EXCLUDED.bedrooms,
    bathrooms = EXCLUDED.bathrooms,
    garage = EXCLUDED.garage;
