-- Yeni eklenen ürünü kontrol et (son eklenen)
SELECT 
  id,
  name,
  category,
  is_active,
  created_at
FROM products
WHERE category LIKE '%ekipman%'
ORDER BY created_at DESC
LIMIT 5;

-- Dalış Bilgisayarı detay kategorisine ait ürünleri kontrol et
SELECT 
  id,
  name,
  category,
  is_active
FROM products
WHERE category LIKE '%dalis-bilgisayari%'
  OR category = 'dalis-urunleri/ekipman/dalis-bilgisayari';
