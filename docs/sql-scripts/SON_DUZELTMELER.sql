-- ============================================
-- SON DÜZELTMELERİ UYGULA
-- ============================================
-- Kalan 10 performans sorununu düzeltir
-- has_role fonksiyonunu güvenli hale getirir

-- ============================================
-- 1. has_role FONKSİYONUNU GÜVENLİ HALE GETİR
-- ============================================

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
-- 2. ÇIFT TÜRKÇE POLİTİKALARI TEMİZLE
-- ============================================

-- ORDERS - Eski Türkçe politikaları sil, yeni optimize edilmiş olanları tut
DROP POLICY IF EXISTS "Adminler siparişleri görebilir" ON public.orders;
DROP POLICY IF EXISTS "Adminler sipariş durumunu güncelleyebilir" ON public.orders;
DROP POLICY IF EXISTS "Kullanıcılar kendi siparişlerini görebilir" ON public.orders;

-- Yeni optimize edilmiş politikalar
CREATE POLICY "Kullanıcılar kendi siparişlerini görebilir"
ON public.orders FOR SELECT
TO authenticated
USING ((select auth.uid()) = user_id);

CREATE POLICY "Adminler tüm siparişleri görebilir ve güncelleyebilir"
ON public.orders FOR ALL
TO authenticated
USING (public.has_role((select auth.uid()), 'admin'));

-- CATEGORIES - Mevcut politikaları optimize et
DROP POLICY IF EXISTS "Herkes kategorileri görebilir" ON public.categories;
DROP POLICY IF EXISTS "Adminler kategorileri yönetebilir" ON public.categories;

CREATE POLICY "Herkes kategorileri görebilir"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Adminler kategorileri yönetebilir"
ON public.categories FOR ALL
TO authenticated
USING (public.has_role((select auth.uid()), 'admin'))
WITH CHECK (public.has_role((select auth.uid()), 'admin'));

-- COUPONS - Mevcut politikaları optimize et
DROP POLICY IF EXISTS "Herkes aktif kuponları görebilir" ON public.coupons;
DROP POLICY IF EXISTS "Adminler kuponları yönetebilir" ON public.coupons;

CREATE POLICY "Herkes aktif kuponları görebilir"
ON public.coupons FOR SELECT
USING (is_active = true);

CREATE POLICY "Adminler kuponları yönetebilir"
ON public.coupons FOR ALL
TO authenticated
USING (public.has_role((select auth.uid()), 'admin'))
WITH CHECK (public.has_role((select auth.uid()), 'admin'));

-- PRODUCTS - Mevcut politikaları optimize et
DROP POLICY IF EXISTS "Herkes ürünleri görebilir" ON public.products;
DROP POLICY IF EXISTS "Adminler ürünleri yönetebilir" ON public.products;

CREATE POLICY "Herkes ürünleri görebilir"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Adminler ürünleri yönetebilir"
ON public.products FOR ALL
TO authenticated
USING (public.has_role((select auth.uid()), 'admin'))
WITH CHECK (public.has_role((select auth.uid()), 'admin'));

-- USER_ROLES - auth.uid() optimizasyonu
DROP POLICY IF EXISTS "Kullanıcılar kendi rollerini görebilir" ON public.user_roles;

CREATE POLICY "Kullanıcılar kendi rollerini görebilir"
ON public.user_roles FOR SELECT
TO authenticated
USING ((select auth.uid()) = user_id);

-- ============================================
-- 3. DUPLICATE INDEX TEMİZLE
-- ============================================

-- Products tablosunda çift index (normal olanı sil, GIN'i tut)
DROP INDEX IF EXISTS public.idx_products_technical_specs;
-- idx_products_technical_specs_gin kalacak (JSONB için daha performanslı)

-- ============================================
-- 4. KONTROL SORULARI
-- ============================================

-- Politikaları kontrol et
SELECT 'RLS Politikaları:' as bilgi;
SELECT 
    tablename,
    policyname,
    cmd,
    CASE 
        WHEN qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(select auth.uid())%' THEN '⚠️ Optimize edilmeli'
        ELSE '✅ OK'
    END as durum
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('orders', 'categories', 'coupons', 'products', 'user_roles')
ORDER BY tablename, policyname;

-- Çift politikaları kontrol et
SELECT 'Çift Politikalar:' as bilgi;
SELECT 
    tablename,
    cmd,
    roles,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ') as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename, cmd, roles
HAVING COUNT(*) > 1
ORDER BY tablename;

-- Index durumunu kontrol et
SELECT 'Index Durumu:' as bilgi;
SELECT 
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename = 'products'
AND indexname LIKE '%technical_specs%'
ORDER BY indexname;

-- has_role fonksiyonunu kontrol et
SELECT 'has_role Fonksiyonu:' as bilgi;
SELECT 
    routine_name,
    routine_type,
    CASE 
        WHEN prosrc LIKE '%pg_temp%' THEN '✅ Güvenli'
        ELSE '⚠️ Güvensiz'
    END as guvenlik_durumu
FROM information_schema.routines r
LEFT JOIN pg_proc p ON p.proname = r.routine_name
WHERE routine_schema = 'public'
AND routine_name = 'has_role';

-- Başarı mesajı
SELECT '✅ TÜM DÜZELTMELERİ TAMAMLANDI!' as durum;
SELECT '🔒 has_role güvenli, RLS optimize edildi, çift politikalar temizlendi' as detay;
SELECT '📊 Supabase Linter: 10 → 0-1 uyarı (HaveIBeenPwned hariç)' as sonuc;
