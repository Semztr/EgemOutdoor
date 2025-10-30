-- ============================================
-- MANUEL TEST - TEKNİK ÖZELLİK EKLEME
-- ============================================

-- 1. Önce ürünü bul
SELECT 
    id,
    name,
    category,
    technical_specs
FROM public.products
WHERE name LIKE '%111%' OR name LIKE '%555%'
ORDER BY id DESC
LIMIT 1;

-- 2. Ürün ID'sini yukarıdan al ve aşağıdaki sorguyu çalıştır
-- (BURAYA_ID_YAZ yerine gerçek ID'yi yaz)

-- Test 1: Basit bir teknik özellik ekle
UPDATE public.products
SET technical_specs = '{"Test": "Deneme", "Malzeme": "Polyester"}'::jsonb
WHERE name LIKE '%111%' OR name LIKE '%555%';

-- 3. Kontrol et - kaydedildi mi?
SELECT 
    id,
    name,
    technical_specs,
    pg_typeof(technical_specs) as data_type,
    jsonb_typeof(technical_specs) as jsonb_type,
    jsonb_pretty(technical_specs) as formatted
FROM public.products
WHERE name LIKE '%111%' OR name LIKE '%555%';

-- 4. Eğer kaydedildiyse, frontend'den okuyabilir miyiz test et
-- Browser'da ürün detay sayfasına git ve console'u kontrol et

-- 5. Eğer kaydedilmediyse, RLS politikasını kontrol et
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'products'
AND cmd = 'UPDATE'
ORDER BY policyname;

-- 6. Kategori de test et
UPDATE public.products
SET category = 'outdoor-giyim/e-kek/gomlek'
WHERE name LIKE '%111%' OR name LIKE '%555%';

-- 7. Son kontrol
SELECT 
    id,
    name,
    category,
    technical_specs,
    stock_quantity,
    is_active
FROM public.products
WHERE name LIKE '%111%' OR name LIKE '%555%';

-- Başarı mesajı
SELECT '✅ MANUEL TEST TAMAMLANDI!' as durum;
SELECT 'Eğer technical_specs NULL ise, RLS politikası UPDATE engelliyor olabilir' as uyari;
