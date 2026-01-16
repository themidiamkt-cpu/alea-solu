-- Insert the auction from the image
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
    '2025-12-17 14:00:00-03', -- Assuming 14:00 or general date
    43.50,
    2, -- Estimated
    1, -- Estimated
    1, -- Confirmed in image
    'Leilão Judicial. Oportunidade de Apartamento com 43,50m² no Residencial Parque da Mata VI. 2ª Praça com 50% de desconto sobre a avaliação. Excelente oportunidade de investimento ou moradia.',
    true
) ON CONFLICT (slug) DO NOTHING;
