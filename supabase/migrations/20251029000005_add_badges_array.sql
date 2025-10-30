-- Çoklu rozet desteği için badges kolonu ekle
-- Bir ürüne birden fazla rozet eklenebilir (örn: hem indirimli hem çok satan)

-- 1. badges kolonu ekle (text array)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS badges text[] DEFAULT ARRAY[]::text[];

-- 2. Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_products_badges 
ON public.products USING GIN(badges);

-- 3. Mevcut badge değerlerini badges array'ine kopyala
UPDATE public.products 
SET badges = ARRAY[badge]::text[]
WHERE badge IS NOT NULL AND badge != '' AND (badges IS NULL OR array_length(badges, 1) IS NULL);

-- 4. Açıklama ekle
COMMENT ON COLUMN public.products.badges IS 'Ürün rozetleri: ["discount", "bestseller", "new"]';

-- Başarı mesajı
SELECT '✅ Çoklu rozet desteği eklendi!' as status;
SELECT 'Artık bir ürüne birden fazla rozet ekleyebilirsiniz.' as info;
