-- ============================================
-- TEKNİK ÖZELLİK KONTROL VE DÜZELTME
-- ============================================

-- 1. Kolon tipini kontrol et
SELECT 
    column_name,
    data_type,
    udt_name,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name IN ('technical_specs', 'stock_quantity', 'is_active')
ORDER BY column_name;

-- 2. Tüm ürünlerin stok ve aktiflik durumunu kontrol et
SELECT 
    id,
    name,
    stock_quantity,
    is_active,
    CASE 
        WHEN stock_quantity > 0 AND (is_active IS NULL OR is_active = true) THEN 'Stokta'
        WHEN stock_quantity > 0 AND is_active = false THEN 'Pasif (is_active=false)'
        WHEN stock_quantity <= 0 THEN 'Stok Yok'
        ELSE 'Bilinmiyor'
    END as durum
FROM public.products
ORDER BY id DESC
LIMIT 10;

-- 3. Mevcut ürünlerin technical_specs değerlerini kontrol et
SELECT 
    id,
    name,
    technical_specs,
    pg_typeof(technical_specs) as data_type,
    jsonb_typeof(technical_specs) as jsonb_type
FROM public.products
WHERE technical_specs IS NOT NULL
LIMIT 5;

-- 3. Eğer kolon TEXT ise, JSONB'ye çevir
-- (Sadece gerekirse çalıştır)
-- ALTER TABLE public.products 
-- ALTER COLUMN technical_specs TYPE JSONB USING technical_specs::JSONB;

-- 4. Index kontrolü
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'products'
AND indexname LIKE '%technical%';

-- 5. Test verisi ekle
-- UPDATE public.products
-- SET technical_specs = '{"Malzeme": "Polyester", "Ağırlık": "250g"}'::JSONB
-- WHERE id = (SELECT id FROM public.products LIMIT 1);
