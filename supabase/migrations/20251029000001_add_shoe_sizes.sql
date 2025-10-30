-- Ayakkabı numaraları için çoklu seçim kolonu ekle
-- shoe_sizes (text[]) array kolonu ekleniyor

-- Yeni shoe_sizes kolonu ekle (array)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS shoe_sizes text[];

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_products_shoe_sizes ON public.products USING GIN(shoe_sizes);

-- Açıklama ekle
COMMENT ON COLUMN public.products.shoe_sizes IS 'Ayakkabı/bot numaraları (çoklu seçim): ["39", "40", "41"]';

-- Başarı mesajı
SELECT '✅ Ayakkabı numaraları çoklu seçim sistemi eklendi!' as status;
SELECT 'Artık bir ürüne birden fazla numara atayabilirsiniz.' as info;
