-- =========================================
-- TERMOSLAR VE MATARALAR KATEGORİSİ GÜNCELLEME
-- Alt kategoriler kaldırıldı, tek kategori yapıldı
-- =========================================

-- 1. ÖNCE KONTROL ET - Hangi ürünler etkilenecek?
SELECT 
  id, 
  name, 
  category,
  is_active
FROM products 
WHERE category LIKE '%termoslar%' 
   OR category LIKE '%matara%'
   OR category LIKE '%termo%'
ORDER BY category;

-- 2. TOPLU GÜNCELLEME - Tüm termoslar ve mataralar tek kategoride
UPDATE products 
SET category = 'termoslar-ve-mataralar'
WHERE category LIKE '%termoslar%' 
   OR category LIKE '%matara%'
   OR category LIKE '%termo%'
   OR category IN (
     'Termoslar', 
     'Mataralar', 
     'termoslar-ve-mataralar/termoslar',
     'termoslar-ve-mataralar/mataralar',
     'termoslar-ve-mataralar/aksesuar',
     '/termoslar-ve-mataralar',
     '/termoslar-ve-mataralar/termoslar',
     '/termoslar-ve-mataralar/mataralar',
     '/termoslar-ve-mataralar/aksesuar'
   );

-- 3. DOĞRULAMA - Güncelleme başarılı mı?
SELECT 
  COUNT(*) as toplam_urun,
  category
FROM products 
WHERE category = 'termoslar-ve-mataralar'
GROUP BY category;

-- 4. DETAYLI KONTROL
SELECT 
  id, 
  name, 
  category,
  brand,
  price,
  stock_quantity,
  is_active
FROM products 
WHERE category = 'termoslar-ve-mataralar'
ORDER BY name;

-- 5. YANLIŞLIKLA BAŞKA KATEGORİDE KALAN VAR MI?
SELECT 
  id,
  name,
  category
FROM products
WHERE (
  LOWER(name) LIKE '%termos%' 
  OR LOWER(name) LIKE '%matara%'
  OR LOWER(description) LIKE '%termos%'
  OR LOWER(description) LIKE '%matara%'
)
AND category != 'termoslar-ve-mataralar';

-- =========================================
-- SONUÇ
-- =========================================
-- Artık tüm termoslar ve mataralar tek kategoride:
-- ✅ termoslar-ve-mataralar
-- ❌ termoslar-ve-mataralar/termoslar (KALDIRILDI)
-- ❌ termoslar-ve-mataralar/mataralar (KALDIRILDI)
-- ❌ termoslar-ve-mataralar/aksesuar (KALDIRILDI)
