-- ============================================
-- SON TEST - KATEGORİ VE TEKNİK ÖZELLİK
-- ============================================

-- 1. Belirli bir ürünü kontrol et (ID ile)
SELECT 
    id,
    name,
    category,
    stock_quantity,
    is_active,
    technical_specs,
    pg_typeof(technical_specs) as tech_specs_type
FROM public.products
WHERE name LIKE '%111%' OR name LIKE '%555%'
ORDER BY id DESC;

-- 2. Son güncellenen ürünleri kontrol et
SELECT 
    id,
    name,
    category,
    technical_specs,
    updated_at,
    created_at
FROM public.products
ORDER BY updated_at DESC NULLS LAST
LIMIT 5;

-- 3. Teknik özellikleri olan ürünler
SELECT 
    id,
    name,
    technical_specs,
    jsonb_pretty(technical_specs) as formatted_specs
FROM public.products
WHERE technical_specs IS NOT NULL
AND jsonb_typeof(technical_specs) = 'object'
LIMIT 5;

-- 4. Kategorileri kontrol et
SELECT 
    DISTINCT category,
    COUNT(*) as urun_sayisi
FROM public.products
WHERE category IS NOT NULL
GROUP BY category
ORDER BY category;

-- 5. Test: Manuel teknik özellik ekle
-- (Bir ürün ID'si ile test et)
-- UPDATE public.products
-- SET technical_specs = '{"Malzeme": "Polyester", "Ağırlık": "250g", "Boyut": "30cm x 20cm x 10cm"}'::jsonb
-- WHERE id = 'BURAYA_URUN_ID_YAZ';

-- 6. Test: Kategori güncelle
-- UPDATE public.products
-- SET category = 'outdoor-giyim/e-kek/gomlek'
-- WHERE id = 'BURAYA_URUN_ID_YAZ';
