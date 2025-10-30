-- ============================================
-- ÖNCE BU SQL'İ ÇALIŞTIRIN!
-- ============================================
-- Admin rol sistemi ve has_role fonksiyonu
-- Diğer migration'lar bu fonksiyona bağımlı

-- ============================================
-- 1. ROL SİSTEMİ KURULUMU
-- ============================================

-- Rol enum'u oluştur (zaten varsa hata vermez)
DO $$ 
BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- user_roles tablosu (zaten varsa hata vermez)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- RLS'yi etkinleştir
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi rollerini görebilir
DROP POLICY IF EXISTS "Kullanıcılar kendi rollerini görebilir" ON public.user_roles;
CREATE POLICY "Kullanıcılar kendi rollerini görebilir"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- ============================================
-- 2. HAS_ROLE FONKSİYONU (ÖNEMLİ!)
-- ============================================

-- Rol kontrol fonksiyonu
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- ============================================
-- 3. ADMİN KULLANICISI OLUŞTUR
-- ============================================

-- Kendi user_id'nizi buraya yazın!
-- Supabase Dashboard → Authentication → Users → ID'yi kopyalayın

-- ÖRNEK (kendi ID'nizi yazın):
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('YOUR_USER_ID_HERE', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- Varsayılan admin (Admin.tsx'teki ID)
INSERT INTO public.user_roles (user_id, role)
VALUES ('f29e5169-7369-4148-a383-f23a0a4c0014', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- 4. YENİ KULLANICILARA OTOMATIK ROL ATAMA
-- ============================================

-- Trigger fonksiyonu
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger oluştur (zaten varsa önce sil)
DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- ============================================
-- 5. KONTROL
-- ============================================

-- Fonksiyonu test et
SELECT 'has_role fonksiyonu çalışıyor mu?' as test,
       public.has_role('f29e5169-7369-4148-a383-f23a0a4c0014', 'admin'::app_role) as sonuc;

-- Mevcut adminleri göster
SELECT 'Mevcut Admin Kullanıcılar:' as bilgi;
SELECT user_id, role, created_at 
FROM public.user_roles 
WHERE role = 'admin';

-- Başarı mesajı
SELECT '✅ ROL SİSTEMİ BAŞARIYLA KURULDU!' as durum;
SELECT '👉 Şimdi SUPABASE_MANUEL_SQL.sql dosyasını çalıştırabilirsiniz' as sonraki_adim;
