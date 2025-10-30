-- E-posta bildirimleri için trigger fonksiyonu
-- Not: Bu fonksiyon Supabase Edge Functions ile entegre edilmelidir
-- Şimdilik sadece yapı hazırlanıyor

-- Sipariş oluşturulduğunda e-posta gönderme fonksiyonu (placeholder)
CREATE OR REPLACE FUNCTION public.send_order_confirmation_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Bu fonksiyon Supabase Edge Function veya harici e-posta servisi ile entegre edilmelidir
  -- Şimdilik sadece log tutuluyor
  
  RAISE NOTICE 'Sipariş onay e-postası gönderilecek: Order #%, Email: %', 
    NEW.order_number, NEW.customer_email;
  
  -- TODO: Supabase Edge Function çağrısı veya harici API entegrasyonu
  -- Örnek: pg_net.http_post() ile webhook çağrısı
  
  RETURN NEW;
END;
$$;

-- Sipariş durumu değiştiğinde e-posta gönderme fonksiyonu (placeholder)
CREATE OR REPLACE FUNCTION public.send_order_status_update_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Sadece durum değişikliklerinde tetikle
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    RAISE NOTICE 'Sipariş durum güncellemesi e-postası gönderilecek: Order #%, Status: % -> %, Email: %', 
      NEW.order_number, OLD.status, NEW.status, NEW.customer_email;
    
    -- Kargo takip numarası eklendiyse özel bildirim
    IF OLD.tracking_number IS NULL AND NEW.tracking_number IS NOT NULL THEN
      RAISE NOTICE 'Kargo takip numarası e-postası gönderilecek: Order #%, Tracking: %', 
        NEW.order_number, NEW.tracking_number;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger'ları oluştur (şimdilik devre dışı - COMMENT ile)
-- Aktif etmek için COMMENT satırlarını kaldırın

-- COMMENT ON TRIGGER send_order_confirmation ON public.orders IS 'Disabled until email service is configured';
-- CREATE TRIGGER send_order_confirmation
--   AFTER INSERT ON public.orders
--   FOR EACH ROW
--   EXECUTE FUNCTION public.send_order_confirmation_email();

-- COMMENT ON TRIGGER send_order_status_update ON public.orders IS 'Disabled until email service is configured';
-- CREATE TRIGGER send_order_status_update
--   AFTER UPDATE ON public.orders
--   FOR EACH ROW
--   EXECUTE FUNCTION public.send_order_status_update_email();

-- E-posta şablonları için tablo (opsiyonel - gelecekte kullanılabilir)
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables JSONB, -- Şablonda kullanılacak değişkenler
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

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
   <p>Kargo firması: {carrier}</p>
   <p>Tahmini teslimat: 2-3 iş günü</p>
   <p>İyi günler,<br>EgemOutdoor Ekibi</p>',
  'Siparişiniz Kargoda!
   
   Merhaba {customer_name},
   
   Sipariş numaranız {order_number} kargoya verildi.
   Kargo takip numarası: {tracking_number}
   Kargo firması: {carrier}
   
   Tahmini teslimat: 2-3 iş günü
   
   İyi günler,
   EgemOutdoor Ekibi',
  '{"customer_name": "string", "order_number": "string", "tracking_number": "string", "carrier": "string"}'::jsonb
)
ON CONFLICT (name) DO NOTHING;

COMMENT ON TABLE public.email_templates IS 'E-posta şablonları - Supabase Edge Functions veya harici servis ile kullanılacak';
COMMENT ON FUNCTION public.send_order_confirmation_email() IS 'Sipariş onay e-postası gönderir (Edge Function entegrasyonu gerekli)';
COMMENT ON FUNCTION public.send_order_status_update_email() IS 'Sipariş durum güncellemesi e-postası gönderir (Edge Function entegrasyonu gerekli)';
