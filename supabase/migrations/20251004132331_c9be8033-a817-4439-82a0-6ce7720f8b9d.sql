-- Phase 1: Critical Security Fixes

-- 1. Secure user_roles table with proper RLS policies
-- Only admins can INSERT new roles (except the initial 'user' role from trigger)
CREATE POLICY "Sadece adminler rol atayabilir"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can UPDATE roles
CREATE POLICY "Sadece adminler rolleri güncelleyebilir"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can DELETE roles
CREATE POLICY "Sadece adminler rolleri silebilir"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Restrict orders UPDATE policy to only status and notes fields
-- First drop the existing admin update policy
DROP POLICY IF EXISTS "Adminler siparişleri güncelleyebilir" ON public.orders;

-- Create a more restrictive policy that only allows updating specific fields
CREATE POLICY "Adminler sadece sipariş durumu ve notlarını güncelleyebilir"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) AND
  -- Ensure critical fields cannot be changed
  total_amount = (SELECT total_amount FROM public.orders WHERE id = orders.id) AND
  user_id = (SELECT user_id FROM public.orders WHERE id = orders.id) AND
  shipping_address = (SELECT shipping_address FROM public.orders WHERE id = orders.id) AND
  billing_address = (SELECT billing_address FROM public.orders WHERE id = orders.id) AND
  payment_method = (SELECT payment_method FROM public.orders WHERE id = orders.id)
);

-- 3. Add product price validation for order_items
-- Create a function to validate order item price matches product price
CREATE OR REPLACE FUNCTION public.validate_order_item_price()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  product_price NUMERIC;
BEGIN
  -- Get the current product price
  SELECT price INTO product_price
  FROM public.products
  WHERE id = NEW.product_id;

  -- Check if product exists
  IF product_price IS NULL THEN
    RAISE EXCEPTION 'Product does not exist';
  END IF;

  -- Validate that the order item price matches the product price
  IF NEW.price != product_price THEN
    RAISE EXCEPTION 'Order item price (%) does not match product price (%)', NEW.price, product_price;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to validate price on insert
DROP TRIGGER IF EXISTS validate_order_item_price_on_insert ON public.order_items;
CREATE TRIGGER validate_order_item_price_on_insert
  BEFORE INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_order_item_price();

-- Create trigger to validate price on update
DROP TRIGGER IF EXISTS validate_order_item_price_on_update ON public.order_items;
CREATE TRIGGER validate_order_item_price_on_update
  BEFORE UPDATE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_order_item_price();