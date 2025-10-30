-- ============================================
-- SUPABASE DASHBOARD'DAN MANUEL ÇALIŞTIRIN
-- ============================================
-- Bu SQL dosyasını Supabase Dashboard → SQL Editor'de çalıştırın
-- Tüm migration'ları tek seferde uygular

-- ============================================
-- 1. NEWSLETTER TABLOSU
-- ============================================

-- Newsletter aboneleri tablosu
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS'yi etkinleştir
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Herkes abone olabilir (INSERT)
DROP POLICY IF EXISTS "Herkes newsletter'a abone olabilir" ON public.newsletter_subscribers;
CREATE POLICY "Herkes newsletter'a abone olabilir"
ON public.newsletter_subscribers
FOR INSERT
TO public
WITH CHECK (true);

-- Sadece adminler listeyi görebilir
DROP POLICY IF EXISTS "Adminler newsletter listesini görebilir" ON public.newsletter_subscribers;
CREATE POLICY "Adminler newsletter listesini görebilir"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Sadece adminler güncelleyebilir
DROP POLICY IF EXISTS "Adminler newsletter'ı güncelleyebilir" ON public.newsletter_subscribers;
CREATE POLICY "Adminler newsletter'ı güncelleyebilir"
ON public.newsletter_subscribers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON public.newsletter_subscribers(subscribed_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_is_active ON public.newsletter_subscribers(is_active);

-- ============================================
-- 2. ORDERS TABLOSU GÜNCELLEMESİ
-- ============================================

-- Orders tablosuna eksik alanları ekle
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

-- order_number için unique constraint ekle (hata verirse zaten var demektir)
DO $$ 
BEGIN
  ALTER TABLE public.orders ADD CONSTRAINT unique_order_number UNIQUE (order_number);
EXCEPTION
  WHEN duplicate_table THEN NULL;
  WHEN duplicate_object THEN NULL;
END $$;

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON public.orders(tracking_number);

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

-- ============================================
-- 3. E-POSTA ŞABLONLARI (OPSIYONEL)
-- ============================================

-- E-posta şablonları için tablo
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Adminler email şablonlarını yönetebilir" ON public.email_templates;
CREATE POLICY "Adminler email şablonlarını yönetebilir"
ON public.email_templates
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Örnek şablonlar ekle
INSERT INTO public.email_templates (name, subject, body_html, body_text, variables) VALUES
(
  'order_confirmation',
  'Siparişiniz Alındı - #{order_number}',
  '<h1>Siparişiniz Alındı!</h1>
   <p>Merhaba {customer_name},</p>
   <p>Sipariş numaranız: <strong>{order_number}</strong></p>
   <p>Toplam tutar: <strong>{total_amount} TL</strong></p>
   <p>Ödeme yöntemi: {payment_method}</p>
   <p>Siparişiniz en kısa sürede hazırlanacaktır.</p>
   <p>Teşekkür ederiz,<br>EgemOutdoor Ekibi</p>',
  'Siparişiniz Alındı!
   
   Merhaba {customer_name},
   
   Sipariş numaranız: {order_number}
   Toplam tutar: {total_amount} TL
   Ödeme yöntemi: {payment_method}
   
   Siparişiniz en kısa sürede hazırlanacaktır.
   
   Teşekkür ederiz,
   EgemOutdoor Ekibi',
  '{"customer_name": "string", "order_number": "string", "total_amount": "number", "payment_method": "string"}'::jsonb
),
(
  'order_shipped',
  'Siparişiniz Kargoya Verildi - #{order_number}',
  '<h1>Siparişiniz Kargoda!</h1>
   <p>Merhaba {customer_name},</p>
   <p>Sipariş numaranız <strong>{order_number}</strong> kargoya verildi.</p>
   <p>Kargo takip numarası: <strong>{tracking_number}</strong></p>
   <p>Tahmini teslimat: 2-3 iş günü</p>
   <p>İyi günler,<br>EgemOutdoor Ekibi</p>',
  'Siparişiniz Kargoda!
   
   Merhaba {customer_name},
   
   Sipariş numaranız {order_number} kargoya verildi.
   Kargo takip numarası: {tracking_number}
   
   Tahmini teslimat: 2-3 iş günü
   
   İyi günler,
   EgemOutdoor Ekibi',
  '{"customer_name": "string", "order_number": "string", "tracking_number": "string"}'::jsonb
)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 4. KONTROL SORULARI
-- ============================================

-- Newsletter tablosunu kontrol et
SELECT 'Newsletter Tablosu:' as tablo, COUNT(*) as kayit_sayisi FROM public.newsletter_subscribers;

-- Orders tablosu kolonlarını kontrol et
SELECT 'Orders Tablosu Kolonları:' as bilgi;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
AND column_name IN ('tracking_number', 'tracking_url', 'admin_notes', 'order_number', 'customer_email');

-- Email templates tablosunu kontrol et
SELECT 'Email Templates:' as tablo, COUNT(*) as sablon_sayisi FROM public.email_templates;

-- Başarı mesajı
SELECT '✅ TÜM MIGRATION''LAR BAŞARIYLA TAMAMLANDI!' as durum;
