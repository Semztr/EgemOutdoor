# 🚀 Admin Paneli ve Veritabanı Kurulum Rehberi

## 📋 YAPILMASI GEREKENLER

### 1️⃣ Veritabanı Migration'larını Çalıştırın

Yeni eklenen migration dosyalarını Supabase'e uygulayın:

```bash
# Supabase CLI ile
supabase db push

# Veya Supabase Dashboard'dan SQL Editor'de manuel olarak çalıştırın:
```

**Çalıştırılması gereken dosyalar (sırayla):**

1. `20251027000000_add_newsletter_table.sql` - Newsletter tablosu
2. `20251027000001_update_orders_table.sql` - Orders tablosu güncellemeleri
3. `20251027000002_add_email_notifications.sql` - E-posta bildirimleri (opsiyonel)

### 2️⃣ Supabase Dashboard'dan Manuel Kontrol

**SQL Editor'de çalıştırın:**

```sql
-- 1. Newsletter tablosunu kontrol edin
SELECT * FROM public.newsletter_subscribers LIMIT 5;

-- 2. Orders tablosunu kontrol edin
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public';

-- 3. Email templates tablosunu kontrol edin
SELECT * FROM public.email_templates;
```

### 3️⃣ Admin Kullanıcısı Oluşturma

**Yöntem 1: Kod ile (Admin.tsx'te zaten var)**
```typescript
// Admin.tsx - Line 79-81
const DEFAULT_ADMINS = ['f29e5169-7369-4148-a383-f23a0a4c0014'];
```

**Yöntem 2: Supabase SQL Editor'de**
```sql
-- Kendi user_id'nizi buraya yazın
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

**User ID'nizi bulmak için:**
1. Supabase Dashboard → Authentication → Users
2. Kullanıcınızı bulun ve ID'yi kopyalayın
3. Yukarıdaki SQL'de `YOUR_USER_ID_HERE` yerine yapıştırın

---

## ✅ YENİ ÖZELLİKLER

### 🎯 Admin Paneli İyileştirmeleri

#### **1. Sipariş Yönetimi (100% Tamamlandı)**
- ✅ Sipariş listesi ve detayları
- ✅ Sipariş durumu güncelleme (5 durum)
- ✅ **YENİ:** Kargo takip numarası ekleme
- ✅ **YENİ:** Admin notları ekleme
- ✅ Müşteri bilgileri ve adres gösterimi
- ✅ Ödeme yöntemi gösterimi

**Kullanım:**
1. Admin paneline gidin: `/admin`
2. "📦 Siparişler" sekmesine tıklayın
3. Sipariş durumunu dropdown'dan değiştirin
4. Kargo takip numarasını girin (otomatik kaydedilir)
5. Admin notları ekleyin (otomatik kaydedilir)

#### **2. Newsletter Yönetimi (100% Tamamlandı)**
- ✅ Abone listesi görüntüleme
- ✅ E-posta kopyalama
- ✅ Gmail/Outlook ile toplu gönderim
- ✅ Tarih ve durum gösterimi

**Kullanım:**
1. Admin paneline gidin: `/admin`
2. "📧 Newsletter" sekmesine tıklayın
3. "📋 Tüm E-postaları Kopyala" ile tüm e-postaları kopyalayın
4. Veya "📧 Gmail ile Toplu Gönder" ile doğrudan e-posta gönderin

#### **3. Ödeme Sistemi**
- ✅ Havale/EFT (100% çalışıyor)
- ✅ Kapıda Ödeme (100% çalışıyor)
- ⚠️ Kredi Kartı (Bilgilendirme mesajı gösteriliyor)

**Checkout Sayfası:**
- Kredi kartı seçildiğinde kullanıcıya bilgilendirme mesajı gösterilir
- Havale/EFT veya Kapıda Ödeme'ye geçmesi için butonlar sunulur

---

## 📧 E-POSTA BİLDİRİMLERİ (Opsiyonel)

### Şu Anki Durum:
- ✅ Veritabanı yapısı hazır
- ✅ E-posta şablonları oluşturuldu
- ⚠️ Trigger'lar devre dışı (Edge Function gerekli)

### Aktif Etmek İçin:

**Seçenek 1: Supabase Edge Functions (Önerilen)**
```bash
# Edge function oluşturun
supabase functions new send-email

# Function'ı deploy edin
supabase functions deploy send-email
```

**Seçenek 2: Harici Servis (Resend, SendGrid, vb.)**
1. Servis API key'i alın
2. Supabase Secrets'a ekleyin
3. Trigger'ları aktif edin

**Seçenek 3: Manuel Gönderim (Geçici Çözüm)**
- Admin panelinden sipariş durumunu değiştirdiğinizde
- Manuel olarak müşteriye e-posta gönderin
- Gmail/Outlook entegrasyonu zaten hazır

---

## 🔧 TEKNİK DETAYLAR

### Yeni Veritabanı Alanları

**orders tablosu:**
```sql
- order_number (TEXT, UNIQUE) - Sipariş numarası
- customer_name (TEXT) - Müşteri adı
- customer_email (TEXT) - Müşteri e-postası
- customer_phone (TEXT) - Müşteri telefonu
- address_line (TEXT) - Adres
- city (TEXT) - Şehir
- district (TEXT) - İlçe
- postal_code (TEXT) - Posta kodu
- items (JSONB) - Sipariş kalemleri
- tracking_number (TEXT) - Kargo takip numarası ⭐ YENİ
- tracking_url (TEXT) - Kargo takip URL'i ⭐ YENİ
- admin_notes (TEXT) - Admin notları ⭐ YENİ
```

**newsletter_subscribers tablosu:**
```sql
- id (UUID, PRIMARY KEY)
- email (TEXT, UNIQUE)
- subscribed_at (TIMESTAMPTZ)
- is_active (BOOLEAN)
- unsubscribed_at (TIMESTAMPTZ)
- source (TEXT)
```

**email_templates tablosu:**
```sql
- id (UUID, PRIMARY KEY)
- name (TEXT, UNIQUE)
- subject (TEXT)
- body_html (TEXT)
- body_text (TEXT)
- variables (JSONB)
- is_active (BOOLEAN)
```

---

## 🎯 SONRAKI ADIMLAR

### Kısa Vadede (1-2 Hafta)
1. ✅ Newsletter tablosunu oluştur → **TAMAMLANDI**
2. ✅ Orders tablosunu güncelle → **TAMAMLANDI**
3. ✅ Admin paneline kargo takip ekle → **TAMAMLANDI**
4. ⏳ E-posta bildirimleri aktif et (Edge Functions)
5. ⏳ Kredi kartı entegrasyonu (İyzico/PayTR)

### Orta Vadede (2-4 Hafta)
1. ⏳ Kupon sistemi
2. ⏳ Ürün yorumları
3. ⏳ Stok uyarıları
4. ⏳ Analytics dashboard

---

## 🆘 SORUN GİDERME

### "Newsletter tablosu bulunamadı" hatası
```bash
# Migration'ı çalıştırın
supabase db push
```

### "Admin yetkisi yok" hatası
```sql
-- User ID'nizi admin yapın
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin');
```

### "Kargo takip numarası kaydedilmiyor" hatası
```sql
-- Orders tablosunu kontrol edin
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT;
```

---

## 📞 İLETİŞİM

Sorularınız için:
- GitHub Issues
- E-posta: egemoutdoor@gmail.com

---

**Son Güncelleme:** 27 Ekim 2025
**Versiyon:** 1.0.0
