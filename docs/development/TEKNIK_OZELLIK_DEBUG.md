# 🔍 TEKNİK ÖZELLİK DEBUG RAPORU

## ❌ SORUN: technical_specs NULL

### Console Log:
```javascript
[ProductDetail] Raw technical_specs from DB: null Type: object
[ProductDetail] technical_specs is not a valid object: null
```

**Anlam:** Veritabanına hiç kaydedilmiyor!

---

## 🎯 OLASI NEDENLER

### 1. Frontend Parse Hatası
Admin panelinde teknik özellikler parse edilmiyor olabilir.

### 2. Supabase UPDATE Hatası
RLS politikası veya kolon izinleri UPDATE'i engelliyor olabilir.

### 3. Kolon Tipi Yanlış
`technical_specs` kolonu JSONB değil, başka bir tip olabilir.

---

## 📋 TEST ADIMLARI

### Adım 1: Admin Panelinde Test (5 dakika)

1. **Admin paneline git:** `http://localhost:5173/admin`
2. **Ürünü düzenle:** 111 veya 555
3. **Teknik Özellikler** kısmına yaz:
   ```
   Test: Deneme
   Malzeme: Polyester
   Ağırlık: 250g
   ```
4. **Güncelle** butonuna bas
5. **Browser Console'u kontrol et (F12):**

**Beklenen Loglar:**
```javascript
[Admin] Technical specs parsed: {
  "Test": "Deneme",
  "Malzeme": "Polyester",
  "Ağırlık": "250g"
}

[Admin] Product data to save: {
  name: "111",
  technical_specs: { Test: "Deneme", ... }
}

[Admin] Updating product: abc-123-def
[Admin] Update data: { ... technical_specs: {...} ... }
[Admin] Updated product data from DB: [{ ... }]
```

**Eğer Hata Varsa:**
```javascript
[Admin] Supabase UPDATE error: {
  message: "...",
  code: "...",
  details: "..."
}
```

---

### Adım 2: Supabase Manuel Test (3 dakika)

`MANUEL_TEST.sql` dosyasını Supabase Dashboard'da çalıştır:

**Sorgu 1:** Ürünü bul
```sql
SELECT id, name, technical_specs FROM products WHERE name LIKE '%111%';
```

**Sorgu 2:** Manuel olarak ekle
```sql
UPDATE products
SET technical_specs = '{"Test": "Deneme"}'::jsonb
WHERE name LIKE '%111%';
```

**Sorgu 3:** Kontrol et
```sql
SELECT id, name, technical_specs FROM products WHERE name LIKE '%111%';
```

**Beklenen Sonuç:**
- ✅ `technical_specs` artık `{"Test": "Deneme"}` olmalı
- ❌ Eğer hala NULL ise, RLS politikası engelliyor

---

### Adım 3: RLS Politikası Kontrol (2 dakika)

**Sorgu 5'i çalıştır:**
```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'products' AND cmd = 'UPDATE';
```

**Kontrol Et:**
- `products_update_admin` politikası var mı?
- `has_role(auth.uid(), 'admin')` kontrolü var mı?
- Admin rolün var mı?

---

## 🔧 OLASI ÇÖZÜMLER

### Çözüm 1: RLS Politikası Eksik

Eğer UPDATE politikası yoksa veya yanlışsa:

```sql
-- Eski politikayı sil
DROP POLICY IF EXISTS "products_update_admin" ON public.products;

-- Yeni politika oluştur
CREATE POLICY "products_update_admin"
ON public.products
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (public.has_role((select auth.uid()), 'admin'))
WITH CHECK (public.has_role((select auth.uid()), 'admin'));
```

### Çözüm 2: Admin Rolü Yok

Eğer admin rolün yoksa:

```sql
-- Kendi user_id'ni bul
SELECT auth.uid();

-- Admin rolü ekle
INSERT INTO public.user_roles (user_id, role)
VALUES ('BURAYA_USER_ID', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### Çözüm 3: Kolon İzni Yok

Eğer kolon izni yoksa:

```sql
-- Kolonun var olduğunu kontrol et
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products'
AND column_name = 'technical_specs';

-- Eğer yoksa ekle
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS technical_specs JSONB;
```

---

## 🎯 SONUÇ

Bu testleri yaptıktan sonra:

1. **Console loglarını** buraya yapıştır
2. **Supabase sorgu sonuçlarını** buraya yapıştır
3. **Hangi hata mesajını gördüğünü** söyle

Sonra kesin çözümü bulacağız! 🚀

---

## 💡 HIZLI TEST

Eğer acele ediyorsan, sadece şunu yap:

1. **Supabase Dashboard** → **SQL Editor**
2. Bu sorguyu çalıştır:
   ```sql
   UPDATE products
   SET technical_specs = '{"Test": "Deneme", "Malzeme": "Polyester"}'::jsonb
   WHERE name LIKE '%111%';
   
   SELECT id, name, technical_specs FROM products WHERE name LIKE '%111%';
   ```
3. Sonucu buraya yapıştır
4. Ürün detay sayfasına git, console'u kontrol et

Eğer bu çalışıyorsa → Frontend sorunu
Eğer bu çalışmıyorsa → RLS politikası sorunu
