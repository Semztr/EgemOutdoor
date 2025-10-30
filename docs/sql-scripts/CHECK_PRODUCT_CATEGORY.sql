-- Dalış Bilgisayarı ürününü kontrol et
SELECT 
  id,
  name,
  category,
  is_active
FROM products
WHERE name LIKE '%bilgisayar%'
  OR category LIKE '%dalis-bilgisayari%';

-- Tüm dalış ürünlerini kontrol et
SELECT 
  id,
  name,
  category,
  is_active
FROM products
WHERE category LIKE '%dalis%'
ORDER BY category;
