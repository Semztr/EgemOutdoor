-- ============================================
-- ACIL FIX: TECHNICAL_SPECS KOLONU EKLE
-- ============================================
-- Bu SQL'i Supabase Dashboard → SQL Editor'de çalıştırın

-- Products tablosuna technical_specs kolonu ekle
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS technical_specs JSONB;

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_products_technical_specs 
ON public.products USING GIN (technical_specs);

-- Kontrol et
SELECT 'technical_specs kolonu eklendi!' as durum;

-- Mevcut ürünleri kontrol et
SELECT id, name, 
       CASE 
         WHEN technical_specs IS NOT NULL THEN 'Var'
         ELSE 'Yok'
       END as technical_specs_durumu
FROM public.products
LIMIT 5;
