# 📧 E-POSTA BİLDİRİMLERİ KURULUM REHBERİ

## 🎯 MEVCUT DURUM

✅ **Newsletter Sistemi:** Çalışıyor (Admin panelinden toplu mail atabiliyorsunuz)
⏳ **Otomatik Bildirimler:** Kurulum gerekli

---

## 🚀 HIZLI ÇÖZÜM (Manuel E-posta Gönderimi)

### Şu An Yapabilecekleriniz:

#### 1. Sipariş Onayı E-postası (Manuel)
Admin panelinde sipariş geldiğinde:
1. Müşterinin e-postasını kopyalayın
2. Gmail/Outlook'tan manuel e-posta gönderin

**Şablon:**
```
Konu: Siparişiniz Alındı - #{order_number}

Merhaba {customer_name},

Siparişiniz başarıyla alınmıştır.

Sipariş Numarası: {order_number}
Toplam Tutar: {total_amount} TL
Ödeme Yöntemi: {payment_method}

Siparişiniz en kısa sürede hazırlanacak ve kargoya verilecektir.

Teşekkür ederiz,
EgemOutdoor Ekibi
```

#### 2. Kargo Takip E-postası (Manuel)
Kargo takip numarası girdiğinizde:
1. Müşterinin e-postasını kopyalayın
2. Takip numarasını içeren e-posta gönderin

**Şablon:**
```
Konu: Siparişiniz Kargoya Verildi - #{order_number}

Merhaba {customer_name},

Siparişiniz kargoya verilmiştir.

Sipariş Numarası: {order_number}
Kargo Takip Numarası: {tracking_number}

Kargonuz 2-3 iş günü içinde adresinize teslim edilecektir.

İyi günler,
EgemOutdoor Ekibi
```

---

## 🔧 OTOMATİK E-POSTA SİSTEMİ (3 Seçenek)

### Seçenek 1: Resend (ÖNERİLEN - EN KOLAY)

**Avantajlar:**
- ✅ Çok kolay kurulum (5 dakika)
- ✅ Aylık 3,000 ücretsiz e-posta
- ✅ React Email ile güzel şablonlar
- ✅ Türkçe karakter desteği

**Kurulum:**

1. **Resend Hesabı Oluşturun:**
   - https://resend.com/signup
   - E-posta doğrulayın

2. **API Key Alın:**
   - Dashboard → API Keys → Create API Key
   - Key'i kopyalayın (örn: `re_123abc...`)

3. **Domain Doğrulama (Opsiyonel):**
   - Kendi domain'inizden mail göndermek için
   - DNS kayıtları ekleyin

4. **Supabase Edge Function Oluşturun:**

```bash
# Edge function oluştur
supabase functions new send-order-email
```

5. **Function Kodunu Yazın:**

`supabase/functions/send-order-email/index.ts`:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { type, order } = await req.json()
    
    let subject = ''
    let html = ''
    
    if (type === 'order_confirmation') {
      subject = `Siparişiniz Alındı - #${order.order_number}`
      html = `
        <h1>Siparişiniz Alındı!</h1>
        <p>Merhaba ${order.customer_name},</p>
        <p>Sipariş numaranız: <strong>${order.order_number}</strong></p>
        <p>Toplam tutar: <strong>${order.total_amount} TL</strong></p>
        <p>Ödeme yöntemi: ${order.payment_method}</p>
        <p>Teşekkür ederiz,<br>EgemOutdoor Ekibi</p>
      `
    } else if (type === 'order_shipped') {
      subject = `Siparişiniz Kargoda - #${order.order_number}`
      html = `
        <h1>Siparişiniz Kargoda!</h1>
        <p>Merhaba ${order.customer_name},</p>
        <p>Sipariş numaranız: <strong>${order.order_number}</strong></p>
        <p>Kargo takip numarası: <strong>${order.tracking_number}</strong></p>
        <p>İyi günler,<br>EgemOutdoor Ekibi</p>
      `
    }
    
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'EgemOutdoor <siparis@egemoutdoor.com>',
        to: [order.customer_email],
        subject: subject,
        html: html
      })
    })
    
    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

6. **Secrets Ekleyin:**
```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

7. **Deploy Edin:**
```bash
supabase functions deploy send-order-email
```

8. **Admin Panelinden Test Edin:**
Admin.tsx'te sipariş durumu değiştiğinde function'ı çağırın.

---

### Seçenek 2: Gmail SMTP (ÜCRETSİZ)

**Avantajlar:**
- ✅ Tamamen ücretsiz
- ✅ Kendi Gmail hesabınızı kullanın
- ✅ Günde 500 e-posta limiti

**Dezavantajlar:**
- ⚠️ Spam klasörüne düşebilir
- ⚠️ Profesyonel görünmez

**Kurulum:**

1. **Gmail App Password Oluşturun:**
   - Google Hesabı → Güvenlik → 2 Adımlı Doğrulama
   - Uygulama Şifreleri → "Mail" seçin
   - 16 haneli şifreyi kopyalayın

2. **Supabase Edge Function:**

```typescript
// SMTP ile e-posta gönderimi
const transporter = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'egemoutdoor@gmail.com',
    pass: 'your_app_password_here' // 16 haneli şifre
  }
}
```

---

### Seçenek 3: SendGrid (Profesyonel)

**Avantajlar:**
- ✅ Aylık 100 ücretsiz e-posta
- ✅ Çok güvenilir
- ✅ Analytics

**Kurulum:**
- https://sendgrid.com/
- API Key alın
- Resend ile aynı mantık

---

## 🎯 ÖNERİM

### Kısa Vadede (Şimdi):
✅ **Manuel e-posta gönderin** (Admin panelinden)
- Sipariş geldiğinde müşteriye manuel mail atın
- Kargo takip numarası girdiğinizde manuel mail atın

### Orta Vadede (1-2 Gün):
⏳ **Resend entegrasyonu yapın**
- 5 dakikada kurulur
- Otomatik e-posta gönderimi
- Ücretsiz plan yeterli

### Uzun Vadede (1 Hafta):
⏳ **React Email ile güzel şablonlar**
- Profesyonel görünümlü e-postalar
- Logo, renkler, butonlar

---

## 📋 SUPABASE DASHBOARD'DAN MANUEL SQL

Migration'ları manuel çalıştırmak için:

1. Supabase Dashboard'a gidin
2. SQL Editor'ü açın
3. Aşağıdaki SQL'leri sırayla çalıştırın:

### 1. Newsletter Tablosu:
```sql
-- Newsletter tablosu
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes newsletter'a abone olabilir"
ON public.newsletter_subscribers FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Adminler newsletter listesini görebilir"
ON public.newsletter_subscribers FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers(email);
```

### 2. Orders Tablosu Güncellemesi:
```sql
-- Orders tablosuna yeni alanlar
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_tracking ON public.orders(tracking_number);
```

### 3. Kontrol:
```sql
-- Tabloları kontrol et
SELECT * FROM public.newsletter_subscribers LIMIT 5;
SELECT tracking_number, admin_notes FROM public.orders LIMIT 5;
```

---

## ✅ SONUÇ

**Şu An:**
- ✅ Newsletter çalışıyor
- ✅ Admin paneli çalışıyor
- ✅ Siparişler çalışıyor
- ⏳ Otomatik e-posta yok (manuel gönderim)

**Yapılacaklar:**
1. Migration'ları Supabase Dashboard'dan manuel çalıştır
2. Kısa vadede manuel e-posta gönder
3. Resend entegrasyonu yap (1-2 gün içinde)

**Sorularınız için:** egemoutdoor@gmail.com

---

**Son Güncelleme:** 27 Ekim 2025
