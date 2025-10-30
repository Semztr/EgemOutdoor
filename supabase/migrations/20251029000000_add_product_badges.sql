-- Ürün rozetleri için yeni alanlar
-- Bu migration ürünlere rozet (badge) sistemi ekler

-- Badge enum type oluştur
DO $$ 
BEGIN
  CREATE TYPE product_badge AS ENUM ('popular', 'bestseller', 'new', 'discount', 'featured');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Products tablosuna badge alanı ekle
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS badge product_badge;

-- Badge için index
CREATE INDEX IF NOT EXISTS idx_products_badge ON public.products(badge) WHERE badge IS NOT NULL;

-- Badge açıklamaları
COMMENT ON COLUMN public.products.badge IS 'Ürün rozeti: popular (Popüler), bestseller (Çok Satan), new (Yeni), discount (İndirimli), featured (Öne Çıkan)';

-- Mevcut featured ürünleri featured badge'e çevir
UPDATE public.products 
SET badge = 'featured'
WHERE featured = true AND badge IS NULL;

-- Örnek veri güncellemeleri (isteğe bağlı)
-- UPDATE public.products SET badge = 'popular' WHERE id = 'SOME_UUID';
-- UPDATE public.products SET badge = 'bestseller' WHERE id = 'SOME_UUID';
-- UPDATE public.products SET badge = 'new' WHERE id = 'SOME_UUID';

-- Başarı mesajı
SELECT '✅ Ürün rozet sistemi başarıyla eklendi!' as status;
SELECT 'Badge türleri: popular, bestseller, new, discount, featured' as info;
