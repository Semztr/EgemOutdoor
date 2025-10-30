-- Ürün görselleri için storage bucket oluştur
-- Bu bucket public olacak (herkes görebilir ama sadece admin yükleyebilir)

-- 1. Bucket oluştur
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true, -- Public bucket (herkes görebilir)
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

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

-- 4. Authenticated users can delete their own files
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- 5. Authenticated users can update their own files
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Başarı mesajı
SELECT '✅ Product images storage bucket oluşturuldu!' as status;
SELECT 'Artık admin panelden dosya yükleyebilirsiniz.' as info;
SELECT 'Bucket: product-images (public, 5MB limit)' as details;
