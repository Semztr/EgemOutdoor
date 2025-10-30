-- ============================================
-- KESİN ÇÖZÜM - SON UYARILAR
-- ============================================
-- 1. has_role search_path sorununu kesin çözer
-- 2. Orders çift politika uyarısını düzeltir

-- ============================================
-- 1. has_role FONKSİYONU - Farklı yaklaşım
-- ============================================
-- Schema-qualified kullanarak search_path'i tamamen bypass edelim
-- DROP yerine CREATE OR REPLACE kullanarak mevcut politikaları koruyoruz

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
-- search_path'i boş bırakarak en güvenli hale getir
SET search_path TO ''
AS $$
BEGIN
  -- Schema-qualified kullanarak search_path'e bağımlılığı kaldır
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = _user_id
      AND user_roles.role = _role
  );
END;
$$;

-- ============================================
-- 2. ORDERS POLİTİKALARINI BİRLEŞTİR
-- ============================================

-- Eski iki politikayı sil
DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
DROP POLICY IF EXISTS "orders_select_admin" ON public.orders;

-- Tek politika ile birleştir
CREATE POLICY "orders_select"
ON public.orders
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  -- Kullanıcı kendi siparişlerini görebilir VEYA admin tüm siparişleri görebilir
  (select auth.uid()) = user_id 
  OR 
  public.has_role((select auth.uid()), 'admin')
);

-- ============================================
-- 3. KONTROL SORULARI
-- ============================================

-- has_role fonksiyonunu detaylı kontrol et
SELECT 'has_role Fonksiyonu Detayları:' as bilgi;
SELECT 
    p.proname as function_name,
    pl.lanname as language,
    p.prosecdef as is_security_definer,
    p.provolatile as volatility,
    pg_get_function_result(p.oid) as return_type,
    pg_get_functiondef(p.oid) as full_definition
FROM pg_proc p
JOIN pg_language pl ON p.prolang = pl.oid
WHERE p.proname = 'has_role'
AND p.pronamespace = 'public'::regnamespace;

-- Orders politikalarını kontrol et
SELECT 'Orders Politikaları:' as bilgi;
SELECT 
    policyname,
    cmd,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'orders'
ORDER BY cmd, policyname;

-- Çift politika kontrolü
SELECT 'Çift Politika Kontrolü:' as bilgi;
SELECT 
    tablename,
    cmd,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ') as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename, cmd
HAVING COUNT(*) > 1
ORDER BY tablename, cmd;

-- Başarı mesajı
SELECT '✅ KESİN ÇÖZÜM UYGULANDΙ!' as durum;
SELECT '🔒 has_role: Schema-qualified + boş search_path' as guvenlik;
SELECT '📊 Orders: 2 politika → 1 politika (birleştirildi)' as performans;
SELECT '🎯 Beklenen: 1 uyarı (sadece HaveIBeenPwned - ücretli)' as sonuc;
