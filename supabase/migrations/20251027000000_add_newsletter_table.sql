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
CREATE POLICY "Herkes newsletter'a abone olabilir"
ON public.newsletter_subscribers
FOR INSERT
TO public
WITH CHECK (true);

-- Sadece adminler listeyi görebilir
CREATE POLICY "Adminler newsletter listesini görebilir"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Sadece adminler güncelleyebilir
CREATE POLICY "Adminler newsletter'ı güncelleyebilir"
ON public.newsletter_subscribers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Index ekle (performans için)
CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribed_at ON public.newsletter_subscribers(subscribed_at DESC);
CREATE INDEX idx_newsletter_is_active ON public.newsletter_subscribers(is_active);
