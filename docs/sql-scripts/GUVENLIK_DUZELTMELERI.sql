-- ============================================
-- GÜVENLİK DÜZELTMELERİ VE EKSİKLER
-- ============================================
-- Supabase Dashboard'daki uyarıları düzeltir
-- Eksik kolonları ekler

-- ============================================
-- 1. RLS ENABLE (user_roles için)
-- ============================================

-- user_roles tablosu için RLS'yi aktif et
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi rollerini görebilir (zaten var ama tekrar oluştur)
DROP POLICY IF EXISTS "Kullanıcılar kendi rollerini görebilir" ON public.user_roles;
CREATE POLICY "Kullanıcılar kendi rollerini görebilir"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- ============================================
-- 2. SEARCH_PATH GÜVENLİK DÜZELTMELERİ
-- ============================================

-- has_role fonksiyonunu güvenli hale getir
-- pg_temp eklenerek SQL injection riski ortadan kaldırılır
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp  -- Güvenli search_path (Supabase önerisi)
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- set_updated_at fonksiyonunu güvenli hale getir
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp  -- Güvenli search_path
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ensure_single_default_address fonksiyonunu güvenli hale getir
CREATE OR REPLACE FUNCTION public.ensure_single_default_address()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp  -- Güvenli search_path
AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.addresses
    SET is_default = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$;

-- update_updated_at_column fonksiyonunu güvenli hale getir
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp  -- Güvenli search_path
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- handle_new_user fonksiyonunu güvenli hale getir
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp  -- Güvenli search_path
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- ============================================
-- 3. EKSİK KOLONLARI KONTROL ET VE EKLE
-- ============================================

-- Orders tablosunda eksik kolonları ekle
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_number TEXT,
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS address_line TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS district TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS items JSONB,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- order_number için unique constraint (hata verirse zaten var demektir)
DO $$ 
BEGIN
  ALTER TABLE public.orders ADD CONSTRAINT unique_order_number UNIQUE (order_number);
EXCEPTION
  WHEN duplicate_table THEN NULL;
  WHEN duplicate_object THEN NULL;
END $$;

-- Products tablosuna technical_specs ekle
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS technical_specs JSONB;

-- ============================================
-- 4. PERFORMANS İNDEXLERİ
-- ============================================

-- Orders indexleri
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON public.orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Products indexleri
CREATE INDEX IF NOT EXISTS idx_products_technical_specs ON public.products USING GIN (technical_specs);

-- Newsletter indexleri
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON public.newsletter_subscribers(subscribed_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_is_active ON public.newsletter_subscribers(is_active);

-- ============================================
-- 5. RLS POLİTİKALARI (Orders için)
-- ============================================

-- Adminler tüm siparişleri görebilir
DROP POLICY IF EXISTS "Adminler siparişleri görebilir" ON public.orders;
CREATE POLICY "Adminler siparişleri görebilir"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Adminler sipariş durumunu güncelleyebilir
DROP POLICY IF EXISTS "Adminler sipariş durumunu güncelleyebilir" ON public.orders;
CREATE POLICY "Adminler sipariş durumunu güncelleyebilir"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Kullanıcılar kendi siparişlerini görebilir
DROP POLICY IF EXISTS "Kullanıcılar kendi siparişlerini görebilir" ON public.orders;
CREATE POLICY "Kullanıcılar kendi siparişlerini görebilir"
ON public.orders
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ============================================
-- 6. KONTROL SORULARI
-- ============================================

-- Tüm tabloları listele
SELECT 'Mevcut Tablolar:' as bilgi;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Orders tablosu kolonlarını kontrol et
SELECT 'Orders Tablosu Kolonları:' as bilgi;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Products tablosu kolonlarını kontrol et
SELECT 'Products Tablosu Kolonları:' as bilgi;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
AND column_name IN ('technical_specs', 'features', 'badge', 'original_price')
ORDER BY ordinal_position;

-- RLS durumunu kontrol et
SELECT 'RLS Durumu:' as bilgi;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Fonksiyonları kontrol et
SELECT 'Güvenli Fonksiyonlar:' as bilgi;
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('has_role', 'set_updated_at', 'ensure_single_default_address', 'update_updated_at_column', 'handle_new_user');

-- Başarı mesajı
SELECT '✅ TÜM GÜVENLİK DÜZELTMELERİ VE EKSİKLER TAMAMLANDI!' as durum;
SELECT '🔒 RLS aktif, search_path güvenli, eksik kolonlar eklendi' as detay;
