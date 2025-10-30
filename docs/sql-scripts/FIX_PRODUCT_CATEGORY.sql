-- Mevcut ürünün kategorisini düzelt
UPDATE products
SET category = 'dalis-urunleri/ekipman/dalis-bilgisayari'
WHERE id = 'ebd33333-7d45-4644-abc7-13ba1f7fdd90';

-- Kontrol et
SELECT 
  id,
  name,
  category,
  is_active
FROM products
WHERE id = 'ebd33333-7d45-4644-abc7-13ba1f7fdd90';
