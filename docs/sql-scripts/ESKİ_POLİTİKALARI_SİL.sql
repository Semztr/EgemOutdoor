-- ============================================
-- ESKİ POLİTİKALARI TEMİZLE
-- ============================================
-- Çift politikaları silmek için - sadece eski olanları sil
-- Yeni oluşturduğumuz politikalar kalacak

-- ============================================
-- ÇIFT POLİTİKALARI SİL
-- ============================================

-- ORDERS - Eski politikaları sil
DROP POLICY IF EXISTS "Anyone can place orders" ON public.orders;
-- "Herkes sipariş oluşturabilir" kalacak

-- CATEGORIES - Eski politikayı sil (yeni zaten var)
-- "Herkes kategorileri görebilir" ve "Adminler kategorileri yönetebilir" kalacak

-- COUPONS - Eski politikayı sil (yeni zaten var)
-- "Herkes aktif kuponları görebilir" ve "Adminler kuponları yönetebilir" kalacak

-- PRODUCT_REVIEWS - Eski politikaları sil
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.product_reviews;
-- "Herkes ürün yorumlarını görebilir" kalacak

-- REVIEWS - Eski politikaları sil
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
-- "Herkes yorumları görebilir" kalacak

-- REVIEW_HELPFUL_VOTES - Eski politikaları sil
DROP POLICY IF EXISTS "Anyone can view helpful votes" ON public.review_helpful_votes;
-- "Herkes oyları görebilir" kalacak

-- ============================================
-- GÜVENLİK: has_role fonksiyonunu düzelt
-- ============================================

-- has_role fonksiyonunu güvenli search_path ile yeniden oluştur
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp  -- Güvenli search_path
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- ============================================
-- KONTROL
-- ============================================

-- Çift politikaları kontrol et
SELECT 
    schemaname,
    tablename,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ') as policies
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('orders', 'categories', 'coupons', 'product_reviews', 'products', 'review_helpful_votes', 'reviews')
GROUP BY schemaname, tablename, cmd, roles
HAVING COUNT(*) > 1
ORDER BY tablename;

-- Başarı mesajı
SELECT '✅ ESKİ POLİTİKALAR TEMİZLENDİ!' as durum;
SELECT '🔒 has_role fonksiyonu güvenli hale getirildi' as guvenlik;
SELECT '📊 Supabase Linter tekrar kontrol edilebilir' as sonuc;
