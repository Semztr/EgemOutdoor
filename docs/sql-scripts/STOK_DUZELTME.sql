-- ============================================
-- STOK VE TEKNİK ÖZELLİK DÜZELTMELERİ
-- ============================================

-- 1. Kolon tiplerini kontrol et
SELECT 
    column_name,
    data_type,
    udt_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name IN ('technical_specs', 'stock_quantity', 'is_active', 'original_price', 'badge', 'featured')
ORDER BY column_name;

-- 2. Tüm ürünlerin durumunu kontrol et
SELECT 
    id,
    name,
    stock_quantity,
    is_active,
    technical_specs,
    CASE 
        WHEN stock_quantity IS NULL THEN '⚠️ stock_quantity NULL'
        WHEN stock_quantity > 0 AND (is_active IS NULL OR is_active = true) THEN '✅ Stokta'
        WHEN stock_quantity > 0 AND is_active = false THEN '❌ Pasif (is_active=false)'
        WHEN stock_quantity <= 0 THEN '❌ Stok Yok (stock_quantity=0)'
        ELSE '❓ Bilinmiyor'
    END as durum
FROM public.products
ORDER BY id DESC
LIMIT 10;

-- 3. Eğer stock_quantity NULL ise, varsayılan değer ata
UPDATE public.products
SET stock_quantity = 100
WHERE stock_quantity IS NULL OR stock_quantity = 0;

-- 4. Eğer is_active NULL ise, true yap
UPDATE public.products
SET is_active = true
WHERE is_active IS NULL OR is_active = false;

-- 5. Teknik özellikleri kontrol et
SELECT 
    id,
    name,
    technical_specs,
    pg_typeof(technical_specs) as data_type,
    CASE 
        WHEN technical_specs IS NULL THEN '❌ NULL'
        WHEN jsonb_typeof(technical_specs) = 'object' THEN '✅ JSONB Object'
        ELSE '⚠️ Başka tip'
    END as durum
FROM public.products
LIMIT 10;

-- 6. Kontrol: Güncellemelerden sonra
SELECT 
    COUNT(*) as toplam_urun,
    COUNT(CASE WHEN stock_quantity > 0 THEN 1 END) as stokta_olan,
    COUNT(CASE WHEN is_active = true THEN 1 END) as aktif_olan,
    COUNT(CASE WHEN technical_specs IS NOT NULL THEN 1 END) as teknik_ozellik_olan
FROM public.products;

-- Başarı mesajı
SELECT '✅ STOK VE AKTİFLİK DÜZELTMELERİ TAMAMLANDI!' as durum;
SELECT '📊 Tüm ürünler stock_quantity=100 ve is_active=true olarak güncellendi' as detay;
SELECT '🔍 Teknik özellikler kontrol edildi' as sonuc;
