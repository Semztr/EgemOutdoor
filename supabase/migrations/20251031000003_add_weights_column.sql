-- Ürünlere ağırlık (weights) kolonu ekle
-- Balıkçılık ürünleri için (jig, silikon yem, kurşun vb.)

-- weights kolonunu ekle (text array)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS weights text[];

-- Index ekle - performans için
CREATE INDEX IF NOT EXISTS idx_products_weights ON products USING GIN(weights);

-- Yorum ekle
COMMENT ON COLUMN products.weights IS 'Ürünün mevcut ağırlık seçenekleri (ör: 2gr, 5gr, 10gr)';

-- Örnek kullanım:
-- UPDATE products SET weights = ARRAY['10gr', '15gr', '20gr'] WHERE id = 'xxx';
