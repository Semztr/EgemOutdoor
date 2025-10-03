-- Admin rol sistemi için user_roles tablosu ve fonksiyonları

-- Rol enum'u oluştur
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- user_roles tablosu
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- RLS'yi etkinleştir
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi rollerini görebilir
CREATE POLICY "Kullanıcılar kendi rollerini görebilir"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Rol kontrol fonksiyonu (security definer ile recursive RLS problemini önler)
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

-- Products tablosuna admin için RLS politikaları ekle
CREATE POLICY "Adminler ürün ekleyebilir"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Adminler ürün güncelleyebilir"
ON public.products
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Adminler ürün silebilir"
ON public.products
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger: Yeni kullanıcılara otomatik user rolü ata
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();