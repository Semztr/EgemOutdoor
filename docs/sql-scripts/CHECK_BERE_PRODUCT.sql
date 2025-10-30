-- Bere kategorisindeki ürünleri kontrol et
SELECT 
  id,
  name,
  category,
  is_active,
  created_at
FROM products
WHERE category LIKE '%bere%'
  OR category LIKE '%aksesuar%'
ORDER BY created_at DESC
LIMIT 10;

-- Outdoor Giyim kategorisindeki tüm ürünleri kontrol et
SELECT 
  id,
  name,
  category,
  is_active
FROM products
WHERE category LIKE 'outdoor-giyim%'
ORDER BY category;
