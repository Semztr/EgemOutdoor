-- TEMİZDEN BAŞLIYORUZ: Basit kategori sistemi
-- Admin paneli ile tam uyumlu, Türkçe karakter yok

-- 1. Önce tüm ürünlerin kategorilerini normalize et (Türkçe karakter temizle)
UPDATE products
SET category = 
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    category,
    'ı', 'i'), 'İ', 'I'), 'ş', 's'), 'Ş', 'S'), 'ğ', 'g'), 'Ğ', 'G'),
    'ü', 'u'), 'Ü', 'U'), 'ö', 'o'), 'Ö', 'O'), 'ç', 'c'), 'Ç', 'C')
WHERE category IS NOT NULL;

-- 2. Kontrol: Kaç ürün güncellendi?
DO $$
DECLARE
  total_products INTEGER;
  products_with_category INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_products FROM products;
  SELECT COUNT(*) INTO products_with_category FROM products WHERE category IS NOT NULL;
  
  RAISE NOTICE '✅ Toplam % ürün', total_products;
  RAISE NOTICE '✅ % ürünün kategorisi normalize edildi', products_with_category;
  RAISE NOTICE '✅ Türkçe karakterler temizlendi!';
END $$;

-- 3. Index ekle - performans için
CREATE INDEX IF NOT EXISTS idx_products_category_normalized ON products(category);

-- 4. Kategori örnekleri ve kontrol
DO $$
BEGIN
  RAISE NOTICE '📋 Örnek kategoriler:';
  RAISE NOTICE '   balik-av-malzemeleri/olta-makineleri/spin';
  RAISE NOTICE '   outdoor-giyim/erkek/pantolon';
  RAISE NOTICE '   kamp-malzemeleri/cadirlar';
  RAISE NOTICE '   termoslar-ve-mataralar';
END $$;
