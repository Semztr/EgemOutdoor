-- Add UPDATE policy for orders table - only admins can update orders
CREATE POLICY "Adminler siparişleri güncelleyebilir"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for orders table - prevent deletion entirely for audit purposes
-- No one can delete orders, not even admins, to maintain order history
CREATE POLICY "Siparişler silinemez"
ON public.orders
FOR DELETE
TO authenticated
USING (false);