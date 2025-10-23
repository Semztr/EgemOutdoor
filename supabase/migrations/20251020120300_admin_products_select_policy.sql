-- Allow admins to select all products (including inactive)
-- Keeps existing public policy that only allows selecting active products

CREATE POLICY IF NOT EXISTS "Adminler tum urunleri gorebilir"
ON public.products
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
