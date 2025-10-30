-- ============================================
-- BEDEN SİSTEMİ KONTROL VE KURULUM
-- ============================================

-- 1. products tablosunda sizes kolonu var mı kontrol et
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products' 
  AND column_name IN ('sizes', 'size_options', 'available_sizes');

-- 2. Eğer sizes kolonu yoksa, ekle (JSONB array)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sizes jsonb DEFAULT '[]'::jsonb;

-- 3. Örnek veri - Outdoor Giyim ürünlerine beden ekle
-- UPDATE public.products
-- SET sizes = '["S", "M", "L", "XL"]'::jsonb
-- WHERE category LIKE 'outdoor-giyim%'
--   AND sizes IS NULL;

-- 4. Mevcut ürünlerin sizes durumunu kontrol et
SELECT 
    id,
    name,
    category,
    sizes,
    jsonb_typeof(sizes) as sizes_type,
    jsonb_array_length(sizes) as sizes_count
FROM public.products
WHERE category LIKE 'outdoor-giyim%'
ORDER BY id DESC
LIMIT 10;

-- 5. Tüm kategorilerde sizes kullanımı
SELECT 
    CASE 
        WHEN category LIKE 'outdoor-giyim%' THEN 'Outdoor Giyim'
        WHEN category LIKE 'balik-av-malzemeleri%' THEN 'Balık Av Malzemeleri'
        ELSE 'Diğer'
    END as kategori_grubu,
    COUNT(*) as toplam_urun,
    COUNT(CASE WHEN sizes IS NOT NULL AND jsonb_array_length(sizes) > 0 THEN 1 END) as beden_olan,
    COUNT(CASE WHEN sizes IS NULL OR jsonb_array_length(sizes) = 0 THEN 1 END) as beden_olmayan
FROM public.products
WHERE is_active = true
GROUP BY kategori_grubu;

-- 6. Hangi bedenler kullanılıyor?
SELECT DISTINCT 
    jsonb_array_elements_text(sizes) as beden,
    COUNT(*) as kullanim_sayisi
FROM public.products
WHERE sizes IS NOT NULL 
  AND jsonb_array_length(sizes) > 0
GROUP BY beden
ORDER BY beden;
