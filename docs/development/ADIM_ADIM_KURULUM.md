# 🚀 ADIM ADIM SUPABASE KURULUM

## ❗ NEDEN BU HATAYI ALDINIZ?

**Hata:** `function public.has_role(uuid, unknown) does not exist`

**Sebep:** Admin kontrol fonksiyonu (`has_role`) henüz oluşturulmamış. Bu fonksiyon olmadan admin paneli çalışmaz.

**Çözüm:** Önce rol sistemini kuracağız, sonra diğer tabloları.

---

## 📋 KURULUM ADIMLARI

### ADIM 1: Rol Sistemini Kurun (ÖNCELİKLİ!)

1. **Supabase Dashboard'a gidin:**
   - https://supabase.com/dashboard/project/ylveoqltfbsewpihblvh

2. **SQL Editor'ü açın** (sol menüden)

3. **`SUPABASE_ONCELIKLI_SQL.sql` dosyasını açın**

4. **İçeriği kopyalayın ve SQL Editor'e yapıştırın**

5. **"RUN" butonuna basın**

6. **Sonuçları kontrol edin:**
   - ✅ "ROL SİSTEMİ BAŞARIYLA KURULDU!" görmelisiniz
   - ✅ `has_role` fonksiyonu test edilecek
   - ✅ Admin kullanıcılar listelenecek

---

### ADIM 2: Kendi Admin Kullanıcınızı Ekleyin

**Kendi User ID'nizi bulun:**

1. Supabase Dashboard → **Authentication** → **Users**
2. Kendi kullanıcınızı bulun
3. **ID** kolonundaki UUID'yi kopyalayın (örn: `abc123-def456-...`)

**SQL Editor'de çalıştırın:**

```sql
-- Kendi ID'nizi buraya yazın
INSERT INTO public.user_roles (user_id, role)
VALUES ('BURAYA_KENDI_ID_NİZİ_YAPIŞTIRIN', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

**Kontrol edin:**
```sql
SELECT * FROM public.user_roles WHERE role = 'admin';
```

---

### ADIM 3: Diğer Tabloları Oluşturun

**Şimdi `SUPABASE_MANUEL_SQL.sql` dosyasını çalıştırabilirsiniz:**

1. SQL Editor'ü açın
2. `SUPABASE_MANUEL_SQL.sql` içeriğini kopyalayın
3. Yapıştırın ve "RUN" butonuna basın
4. ✅ "TÜM MIGRATION'LAR BAŞARIYLA TAMAMLANDI!" görmelisiniz

---

## 🎯 BU TABLOLAR NE İŞE YARIYOR?

### 1. **user_roles Tablosu**
```
┌─────────────────────────────────────┐
│ user_id              | role         │
├─────────────────────────────────────┤
│ abc123-def456...     | admin        │
│ xyz789-uvw012...     | user         │
└─────────────────────────────────────┘
```
**Amacı:** Kim admin, kim normal kullanıcı?

**Kullanım:**
- Admin paneline sadece admin'ler girebilir
- Ürün ekleme/silme sadece admin'ler yapabilir
- Siparişleri sadece admin'ler görebilir

---

### 2. **newsletter_subscribers Tablosu**
```
┌─────────────────────────────────────────────┐
│ email              | subscribed_at | active │
├─────────────────────────────────────────────┤
│ ahmet@example.com  | 27 Eki 2025   | ✓      │
│ mehmet@example.com | 26 Eki 2025   | ✓      │
└─────────────────────────────────────────────┘
```
**Amacı:** Newsletter aboneleri

**Kullanım:**
- Footer'daki "Newsletter'a Abone Ol" formu buraya kaydeder
- Admin panelinden toplu e-posta gönderebilirsiniz
- Gmail/Outlook entegrasyonu var

---

### 3. **orders Tablosu (Güncellemeler)**
```
┌──────────────────────────────────────────────────────┐
│ order_number | tracking_number | admin_notes         │
├──────────────────────────────────────────────────────┤
│ EGM12345678  | 1234567890      | Acil kargo          │
│ EGM87654321  | null            | Ödeme bekliyor      │
└──────────────────────────────────────────────────────┘
```
**Amacı:** Sipariş yönetimi için ek alanlar

**Yeni Alanlar:**
- `tracking_number` → Kargo takip numarası
- `tracking_url` → Kargo takip linki
- `admin_notes` → Admin notları
- `order_number` → Sipariş numarası (EGM12345678)
- `customer_email` → Müşteri e-postası
- `customer_name` → Müşteri adı
- `items` → Sipariş kalemleri (JSON)

**Kullanım:**
- Admin panelinde kargo takip numarası ekleyebilirsiniz
- Sipariş hakkında not alabilirsiniz
- Müşteriye e-posta gönderebilirsiniz

---

### 4. **email_templates Tablosu**
```
┌────────────────────────────────────────────┐
│ name               | subject              │
├────────────────────────────────────────────┤
│ order_confirmation | Siparişiniz Alındı   │
│ order_shipped      | Siparişiniz Kargoda  │
└────────────────────────────────────────────┘
```
**Amacı:** E-posta şablonları

**Kullanım:**
- Sipariş onayı e-postası şablonu
- Kargo bildirim e-postası şablonu
- Gelecekte otomatik e-posta gönderimi için

---

## 🔍 KONTROL SORULARI

**Tüm tabloları kontrol edin:**

```sql
-- 1. Rol sistemi çalışıyor mu?
SELECT public.has_role(auth.uid(), 'admin'::app_role) as ben_admin_miyim;

-- 2. Newsletter tablosu var mı?
SELECT COUNT(*) as abone_sayisi FROM public.newsletter_subscribers;

-- 3. Orders tablosu güncel mi?
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('tracking_number', 'admin_notes');

-- 4. Email templates var mı?
SELECT name, subject FROM public.email_templates;
```

---

## ❓ SIKÇA SORULAN SORULAR

### S: Neden önce rol sistemini kuruyoruz?
**C:** Çünkü diğer tablolar `has_role()` fonksiyonuna bağımlı. Önce bu fonksiyon olmalı.

### S: Admin kullanıcısı nasıl oluşturulur?
**C:** 
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('KENDI_USER_ID_NİZ', 'admin');
```

### S: Newsletter nasıl çalışıyor?
**C:** 
- Kullanıcı footer'dan abone olur
- Admin panelinden listeyi görürsünüz
- Gmail/Outlook ile toplu mail atabilirsiniz

### S: Kargo takip numarası nerede görünür?
**C:** Admin paneli → Siparişler sekmesi → Her sipariş kartında

### S: E-posta otomatik gönderilir mi?
**C:** Şu an hayır. Manuel gönderim yapabilirsiniz. Otomatik için Resend entegrasyonu gerekli (EMAIL_SETUP.md'ye bakın).

---

## ✅ BAŞARILI KURULUM KONTROLÜ

**Tüm adımlar tamamlandıysa:**

1. ✅ `has_role` fonksiyonu çalışıyor
2. ✅ Admin kullanıcısı oluşturuldu
3. ✅ Newsletter tablosu var
4. ✅ Orders tablosu güncel
5. ✅ Email templates oluşturuldu

**Admin paneline gidin:**
- http://localhost:5173/admin (local)
- veya canlı sitenizin /admin sayfası

**Test edin:**
- Siparişler sekmesi açılıyor mu?
- Newsletter sekmesi açılıyor mu?
- Kargo takip numarası ekleyebiliyor musunuz?

---

## 🆘 SORUN GİDERME

### Hata: "has_role fonksiyonu yok"
**Çözüm:** `SUPABASE_ONCELIKLI_SQL.sql` dosyasını çalıştırın

### Hata: "Admin yetkisi yok"
**Çözüm:** Kendi user_id'nizi admin yapın:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('KENDI_ID', 'admin');
```

### Hata: "Newsletter tablosu yok"
**Çözüm:** `SUPABASE_MANUEL_SQL.sql` dosyasını çalıştırın

---

## 📞 YARDIM

Sorun yaşarsanız:
1. Hata mesajını kopyalayın
2. Hangi SQL'i çalıştırdığınızı belirtin
3. Ekran görüntüsü alın

**Hazırlayan:** AI Assistant
**Tarih:** 27 Ekim 2025
