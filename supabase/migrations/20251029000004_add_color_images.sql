-- Renk bazlı görseller için kolon ekle
-- Her renk için ayrı görsel URL'i saklanacak

-- 1. color_images kolonu ekle (JSONB)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS color_images jsonb DEFAULT '{}'::jsonb;

-- 2. Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_products_color_images 
ON public.products USING GIN(color_images);

-- 3. Açıklama ekle
COMMENT ON COLUMN public.products.color_images IS 'Renk bazlı görseller: {"Siyah": "url1.jpg", "Beyaz": "url2.jpg"}';

-- Başarı mesajı
SELECT '✅ Renk bazlı görseller kolonu eklendi!' as status;
SELECT 'Artık her renk için ayrı görsel ekleyebilirsiniz.' as info;
