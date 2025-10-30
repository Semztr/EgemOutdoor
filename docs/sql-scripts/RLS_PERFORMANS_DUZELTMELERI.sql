-- ============================================
-- RLS PERFORMANS DÜZELTMELERİ
-- ============================================
-- Supabase Linter uyarılarını düzeltir
-- 1. auth.uid() performans optimizasyonu
-- 2. Duplicate (çift) RLS politikalarını temizler
-- 3. Duplicate (çift) indexleri temizler

-- ============================================
-- 1. PERFORMANS: auth.uid() Optimizasyonu
-- ============================================
-- auth.uid() yerine (select auth.uid()) kullanarak
-- her satır için tekrar hesaplanmasını önleriz

-- PRODUCTS tablosu
DROP POLICY IF EXISTS "products_write_admin_only" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Users can read products" ON public.products;
DROP POLICY IF EXISTS "products_select_all" ON public.products;
DROP POLICY IF EXISTS "products_select_anon" ON public.products;
DROP POLICY IF EXISTS "products_select_auth" ON public.products;
DROP POLICY IF EXISTS "products_insert_auth" ON public.products;
DROP POLICY IF EXISTS "products_update_auth" ON public.products;
DROP POLICY IF EXISTS "products_delete_auth" ON public.products;

-- Yeni optimize edilmiş politikalar
CREATE POLICY "Herkes ürünleri görebilir"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Adminler ürünleri yönetebilir"
ON public.products FOR ALL
TO authenticated
USING (public.has_role((select auth.uid()), 'admin'));

-- CATEGORIES tablosu
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Users can read categories" ON public.categories;

CREATE POLICY "Herkes kategorileri görebilir"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Adminler kategorileri yönetebilir"
ON public.categories FOR ALL
TO authenticated
USING (public.has_role((select auth.uid()), 'admin'));

-- ORDERS tablosu
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Adminler siparişleri görebilir" ON public.orders;
DROP POLICY IF EXISTS "Adminler sipariş durumunu güncelleyebilir" ON public.orders;
DROP POLICY IF EXISTS "Kullanıcılar kendi siparişlerini görebilir" ON public.orders;

CREATE POLICY "Kullanıcılar kendi siparişlerini görebilir"
ON public.orders FOR SELECT
TO authenticated
USING ((select auth.uid()) = user_id);

CREATE POLICY "Adminler tüm siparişleri görebilir"
ON public.orders FOR SELECT
TO authenticated
USING (public.has_role((select auth.uid()), 'admin'));

CREATE POLICY "Adminler siparişleri güncelleyebilir"
ON public.orders FOR UPDATE
TO authenticated
USING (public.has_role((select auth.uid()), 'admin'));

CREATE POLICY "Herkes sipariş oluşturabilir"
ON public.orders FOR INSERT
WITH CHECK (true);

-- NEWSLETTER_SUBSCRIBERS tablosu
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Adminler newsletter listesini görebilir" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Adminler newsletter'ı güncelleyebilir" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Herkes newsletter'a abone olabilir" ON public.newsletter_subscribers;

CREATE POLICY "Herkes abone olabilir"
ON public.newsletter_subscribers FOR INSERT
WITH CHECK (true);

CREATE POLICY "Adminler aboneleri görebilir"
ON public.newsletter_subscribers FOR SELECT
TO authenticated
USING (public.has_role((select auth.uid()), 'admin'));

CREATE POLICY "Adminler aboneleri güncelleyebilir"
ON public.newsletter_subscribers FOR UPDATE
TO authenticated
USING (public.has_role((select auth.uid()), 'admin'));

-- PROFILES tablosu
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Kullanıcılar kendi profillerini görebilir"
ON public.profiles FOR SELECT
TO authenticated
USING ((select auth.uid()) = id);

CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir"
ON public.profiles FOR UPDATE
TO authenticated
USING ((select auth.uid()) = id);

CREATE POLICY "Kullanıcılar kendi profillerini oluşturabilir"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = id);

-- FAVORITES tablosu
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;

CREATE POLICY "Kullanıcılar kendi favorilerini yönetebilir"
ON public.favorites FOR ALL
TO authenticated
USING ((select auth.uid()) = user_id);

-- REVIEWS tablosu
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;

CREATE POLICY "Herkes yorumları görebilir"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Kullanıcılar yorum oluşturabilir"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Kullanıcılar kendi yorumlarını güncelleyebilir"
ON public.reviews FOR UPDATE
TO authenticated
USING ((select auth.uid()) = user_id);

-- COUPONS tablosu
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;

CREATE POLICY "Herkes aktif kuponları görebilir"
ON public.coupons FOR SELECT
USING (is_active = true);

CREATE POLICY "Adminler kuponları yönetebilir"
ON public.coupons FOR ALL
TO authenticated
USING (public.has_role((select auth.uid()), 'admin'));

-- ADDRESSES tablosu
DROP POLICY IF EXISTS "Users can view own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON public.addresses;

CREATE POLICY "Kullanıcılar kendi adreslerini yönetebilir"
ON public.addresses FOR ALL
TO authenticated
USING ((select auth.uid()) = user_id);

-- PRODUCT_REVIEWS tablosu
DROP POLICY IF EXISTS "Users can create own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.product_reviews;

CREATE POLICY "Herkes ürün yorumlarını görebilir"
ON public.product_reviews FOR SELECT
USING (true);

CREATE POLICY "Kullanıcılar ürün yorumu oluşturabilir"
ON public.product_reviews FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Kullanıcılar kendi ürün yorumlarını güncelleyebilir"
ON public.product_reviews FOR UPDATE
TO authenticated
USING ((select auth.uid()) = user_id);

CREATE POLICY "Kullanıcılar kendi ürün yorumlarını silebilir"
ON public.product_reviews FOR DELETE
TO authenticated
USING ((select auth.uid()) = user_id);

-- REVIEW_HELPFUL_VOTES tablosu
DROP POLICY IF EXISTS "Users can vote" ON public.review_helpful_votes;
DROP POLICY IF EXISTS "Users can remove vote" ON public.review_helpful_votes;

CREATE POLICY "Herkes oyları görebilir"
ON public.review_helpful_votes FOR SELECT
USING (true);

CREATE POLICY "Kullanıcılar oy verebilir"
ON public.review_helpful_votes FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Kullanıcılar kendi oylarını silebilir"
ON public.review_helpful_votes FOR DELETE
TO authenticated
USING ((select auth.uid()) = user_id);

-- EMAIL_TEMPLATES tablosu
DROP POLICY IF EXISTS "Adminler email şablonlarını yönetebilir" ON public.email_templates;

CREATE POLICY "Adminler email şablonlarını yönetebilir"
ON public.email_templates FOR ALL
TO authenticated
USING (public.has_role((select auth.uid()), 'admin'));

-- USER_ROLES tablosu (zaten var ama optimize edelim)
DROP POLICY IF EXISTS "Kullanıcılar kendi rollerini görebilir" ON public.user_roles;

CREATE POLICY "Kullanıcılar kendi rollerini görebilir"
ON public.user_roles FOR SELECT
TO authenticated
USING ((select auth.uid()) = user_id);

-- ============================================
-- 2. DUPLICATE INDEX TEMİZLİĞİ
-- ============================================

-- Orders tablosunda çift constraint/index
-- orders_order_number_key bir constraint olduğu için önce constraint'i silelim
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_order_number_key;
-- unique_order_number constraint'ini tutuyoruz

-- Products tablosunda çift index
DROP INDEX IF EXISTS public.idx_products_technical_specs;
-- idx_products_technical_specs_gin'i tutuyoruz (GIN daha performanslı)

-- ============================================
-- 3. KONTROL SORULARI
-- ============================================

-- RLS politikalarını kontrol et
SELECT 'RLS Politikaları:' as bilgi;
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Indexleri kontrol et
SELECT 'Index Durumu:' as bilgi;
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('orders', 'products')
ORDER BY tablename, indexname;

-- Başarı mesajı
SELECT '✅ TÜM PERFORMANS DÜZELTMELERİ TAMAMLANDI!' as durum;
SELECT '🚀 RLS politikaları optimize edildi, çift politikalar ve indexler temizlendi' as detay;
SELECT '📊 Supabase Linter uyarıları düzelecek' as sonuc;
