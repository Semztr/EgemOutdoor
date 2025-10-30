-- Belirli ürünlerin kategori bilgilerini kontrol et
SELECT 
    id,
    name,
    category,
    badge,
    featured,
    LENGTH(category) as category_length,
    POSITION('/' IN category) as first_slash_pos
FROM public.products
WHERE name IN ('7777', '222', 'KKK', '111', '555')
ORDER BY name;

-- Tüm kategorileri listele
SELECT 
    DISTINCT category,
    COUNT(*) as urun_sayisi
FROM public.products
WHERE category IS NOT NULL
GROUP BY category
ORDER BY category;
