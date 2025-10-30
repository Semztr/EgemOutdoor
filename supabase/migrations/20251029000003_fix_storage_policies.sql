-- Mevcut politikaları temizle ve yeniden oluştur
-- RLS hatası düzeltmesi

-- 1. Eski politikaları sil (varsa)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;

-- 2. Public erişim politikası (herkes görebilir)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 3. Authenticated users can upload (giriş yapmış herkes yükleyebilir)
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- 4. Authenticated users can delete
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- 5. Authenticated users can update
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Başarı mesajı
SELECT '✅ Storage politikaları düzeltildi!' as status;
SELECT 'Artık dosya yükleyebilirsiniz.' as info;
