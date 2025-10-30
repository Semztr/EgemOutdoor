-- ============================================
-- SON DENEME - has_role search_path
-- ============================================
-- Supabase'in tam olarak istediği formatta

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
-- Supabase'in önerdiği format
SET search_path = ''
AS $$
DECLARE
  role_exists BOOLEAN;
BEGIN
  -- Tamamen schema-qualified
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
  ) INTO role_exists;
  
  RETURN role_exists;
END;
$$;

-- Fonksiyonu test et
SELECT 'has_role Fonksiyonu Test:' as bilgi;
SELECT public.has_role('00000000-0000-0000-0000-000000000000'::UUID, 'admin'::app_role) as test_result;

-- Fonksiyon detaylarını kontrol et
SELECT 'Fonksiyon Detayları:' as bilgi;
SELECT 
    p.proname,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
WHERE p.proname = 'has_role'
AND p.pronamespace = 'public'::regnamespace;
