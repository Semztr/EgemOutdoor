-- Numara ve Renk kolonlarını ekle
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS shoe_size text,
ADD COLUMN IF NOT EXISTS color text;

-- Örnek veri ekle (test için)
UPDATE public.products 
SET shoe_size = '42', color = 'Siyah'
WHERE category LIKE '%ayakkabi%' OR category LIKE '%bot%'
LIMIT 5;

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_products_shoe_size ON public.products(shoe_size);
CREATE INDEX IF NOT EXISTS idx_products_color ON public.products(color);

-- Kontrol
SELECT id, name, shoe_size, color, category 
FROM public.products 
WHERE shoe_size IS NOT NULL OR color IS NOT NULL
LIMIT 10;
