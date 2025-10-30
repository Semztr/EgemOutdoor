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

-- order_number için unique constraint ekle
ALTER TABLE public.orders 
ADD CONSTRAINT unique_order_number UNIQUE (order_number);

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

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
