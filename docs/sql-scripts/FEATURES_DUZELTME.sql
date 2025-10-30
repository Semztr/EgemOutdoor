-- ============================================
-- FEATURES KOLONU DÜZELTME
-- ============================================

-- 1. Mevcut features formatlarını kontrol et
SELECT 
    id,
    name,
    features,
    pg_typeof(features) as features_type,
    jsonb_typeof(features) as jsonb_type
FROM public.products
WHERE features IS NOT NULL
LIMIT 10;

-- 2. Array formatındaki features'ları object formatına çevir
-- ÖNCE YEDEK AL!
-- Bu sorguyu çalıştırmadan önce mutlaka yedek al

-- 3. Örnek: Belirli bir ürünün features'ını güncelle
-- UPDATE public.products
-- SET features = '{"best_seller": true, "items": ["feature1", "feature2"]}'::jsonb
-- WHERE id = 'URUN_ID';

-- 4. Tüm ürünlerin features durumunu kontrol et
SELECT 
    COUNT(*) as toplam,
    COUNT(CASE WHEN features IS NULL THEN 1 END) as features_null,
    COUNT(CASE WHEN jsonb_typeof(features) = 'array' THEN 1 END) as features_array,
    COUNT(CASE WHEN jsonb_typeof(features) = 'object' THEN 1 END) as features_object
FROM public.products;

-- 5. best_seller=true olan ürünleri listele
SELECT 
    id,
    name,
    features,
    CASE 
        WHEN features IS NULL THEN 'NULL'
        WHEN jsonb_typeof(features) = 'array' THEN 'Array (eski format)'
        WHEN jsonb_typeof(features) = 'object' AND features->>'best_seller' = 'true' THEN 'Object - Çok Satan ✅'
        WHEN jsonb_typeof(features) = 'object' THEN 'Object - Çok Satan değil'
        ELSE 'Bilinmiyor'
    END as durum
FROM public.products
WHERE features IS NOT NULL
ORDER BY id DESC
LIMIT 20;
