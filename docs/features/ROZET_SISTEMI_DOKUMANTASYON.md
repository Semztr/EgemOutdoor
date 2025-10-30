# 🏷️ ÜRÜN ROZET SİSTEMİ DOKÜMANTASYONU

**Tarih:** 29 Ekim 2025  
**Versiyon:** 1.0

---

## 📋 GENEL BAKIŞ

Ürün rozet sistemi, ürünlere özel etiketler (badge) eklemenizi ve bu ürünleri ana sayfada farklı kategorilerde göstermenizi sağlar.

### Rozet Türleri

| Rozet | Değer | Renk | Kullanım Alanı |
|-------|-------|------|----------------|
| ⭐ **Popüler** | `popular` | Mor | Ana sayfa "Popüler Ürünler" sekmesi |
| 🔥 **Çok Satan** | `bestseller` | Turuncu | Ana sayfa "Çok Satanlar" sekmesi |
| ✨ **Yeni** | `new` | Yeşil | Ana sayfa "Yeni Gelenler" sekmesi |
| 💰 **İndirimli** | `discount` | Kırmızı | İndirimli ürünler için |
| 🎯 **Öne Çıkan** | `featured` | Mavi | Özel kampanyalı ürünler |

---

## 🗄️ VERİTABANI YAPISI

### Migration Dosyası
**Dosya:** `supabase/migrations/20251029000000_add_product_badges.sql`

### Yeni Alan
```sql
ALTER TABLE public.products 
ADD COLUMN badge product_badge;

-- Badge enum type
CREATE TYPE product_badge AS ENUM (
  'popular',      -- Popüler
  'bestseller',   -- Çok Satan
  'new',          -- Yeni
  'discount',     -- İndirimli
  'featured'      -- Öne Çıkan
);
```

### Index
```sql
CREATE INDEX idx_products_badge ON public.products(badge) 
WHERE badge IS NOT NULL;
```

---

## 💻 KULLANIM

### 1. Admin Panelinden Rozet Ekleme

1. **Admin Panel**'e gidin (`/admin`)
2. Ürün eklerken veya düzenlerken **"Ürün Rozeti (Badge)"** bölümünü bulun
3. Dropdown'dan istediğiniz rozeti seçin:
   - ❌ Yok
   - ⭐ Popüler
   - 🔥 Çok Satan
   - ✨ Yeni
   - 💰 İndirimli
   - 🎯 Öne Çıkan
4. Ürünü kaydedin

### 2. Otomatik Gösterim

Rozet seçtiğiniz ürünler **otomatik olarak** ilgili sekmelerde görünür:

#### Ana Sayfa Sekmeleri

```
┌─────────────────────────────────────────┐
│  Ürünlerimizi Keşfedin                  │
├─────────────────────────────────────────┤
│  [Popüler Ürünler] [Çok Satanlar] [Yeni]│
└─────────────────────────────────────────┘
```

- **Popüler Ürünler:** `badge = 'popular'` olan ürünler
- **Çok Satanlar:** `badge = 'bestseller'` olan ürünler
- **Yeni Gelenler:** `badge = 'new'` olan ürünler

---

## 🎨 FRONTEND KOMPONENTLERİ

### 1. ProductBadge Component
**Dosya:** `src/components/ProductBadge.tsx`

```tsx
import { ProductBadge } from '@/components/ProductBadge';

<ProductBadge badge="popular" />
<ProductBadge badge="bestseller" />
<ProductBadge badge="new" />
```

### 2. Constants
**Dosya:** `src/lib/constants.ts`

```typescript
import { PRODUCT_BADGES, BADGE_LABELS, BADGE_COLORS } from '@/lib/constants';

// Badge değerleri
PRODUCT_BADGES.POPULAR      // 'popular'
PRODUCT_BADGES.BESTSELLER   // 'bestseller'
PRODUCT_BADGES.NEW          // 'new'

// Badge etiketleri
BADGE_LABELS['popular']     // 'Popüler'
BADGE_LABELS['bestseller']  // 'Çok Satan'

// Badge renkleri
BADGE_COLORS['popular']     // 'bg-purple-500 text-white'
BADGE_COLORS['bestseller']  // 'bg-orange-500 text-white'
```

### 3. ProductShowcase Component
**Dosya:** `src/components/ProductShowcase.tsx`

Ana sayfadaki ürün vitrinini yönetir. Badge'e göre otomatik filtreleme yapar:

```typescript
// Popüler ürünleri getir
const { data: popular } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true)
  .eq('badge', 'popular')
  .limit(12);

// Çok satanları getir
const { data: bestsellers } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true)
  .eq('badge', 'bestseller')
  .limit(12);

// Yeni gelenleri getir
const { data: newItems } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true)
  .eq('badge', 'new')
  .limit(12);
```

---

## 📊 ÖRNEK KULLANIM SENARYOLARI

### Senaryo 1: Yeni Ürün Lansmanı
```
1. Admin panelde yeni ürün ekleyin
2. Rozet olarak "✨ Yeni" seçin
3. Ürün otomatik olarak ana sayfada "Yeni Gelenler" sekmesinde görünür
4. Ürün kartında yeşil "Yeni" rozeti görünür
```

### Senaryo 2: Çok Satan Ürün
```
1. Satış verilerine göre popüler ürünü düzenleyin
2. Rozet olarak "🔥 Çok Satan" seçin
3. Ürün "Çok Satanlar" sekmesine taşınır
4. Turuncu "Çok Satan" rozeti eklenir
```

### Senaryo 3: Popüler Ürün Kampanyası
```
1. Kampanya yapacağınız ürünü seçin
2. Rozet olarak "⭐ Popüler" seçin
3. Ürün "Popüler Ürünler" sekmesinde öne çıkar
4. Mor "Popüler" rozeti görünür
```

### Senaryo 4: İndirim Kampanyası
```
1. İndirimli ürünü düzenleyin
2. Rozet olarak "💰 İndirimli" seçin
3. Ürün kartında kırmızı "İndirimli" rozeti görünür
4. Dikkat çekici görünüm sağlar
```

---

## 🔍 SQL SORGULARI

### Tüm Popüler Ürünleri Getir
```sql
SELECT * FROM products 
WHERE badge = 'popular' 
  AND is_active = true
ORDER BY created_at DESC;
```

### Çok Satan Ürünleri Getir
```sql
SELECT * FROM products 
WHERE badge = 'bestseller' 
  AND is_active = true
ORDER BY created_at DESC;
```

### Yeni Ürünleri Getir
```sql
SELECT * FROM products 
WHERE badge = 'new' 
  AND is_active = true
ORDER BY created_at DESC;
```

### Rozet İstatistikleri
```sql
SELECT 
  badge,
  COUNT(*) as urun_sayisi,
  AVG(price) as ortalama_fiyat
FROM products
WHERE is_active = true
  AND badge IS NOT NULL
GROUP BY badge
ORDER BY urun_sayisi DESC;
```

### Rozetsiz Ürünler
```sql
SELECT id, name, category, price
FROM products
WHERE badge IS NULL
  AND is_active = true
ORDER BY created_at DESC;
```

---

## 🎯 EN İYİ UYGULAMALAR

### 1. Rozet Kullanım Stratejisi
- ✅ Her kategoride **en fazla 12 ürün** rozet almalı
- ✅ Rozetleri **düzenli güncelleyin** (haftalık/aylık)
- ✅ **Gerçek verilere** dayalı rozet atayın
- ❌ Tüm ürünlere rozet vermeyin
- ❌ Aynı ürüne birden fazla rozet vermeyin

### 2. Popüler Ürünler
- Görüntülenme sayısı yüksek ürünler
- Favorilere çok eklenen ürünler
- Sosyal medyada paylaşılan ürünler

### 3. Çok Satan Ürünler
- Satış adedi yüksek ürünler
- Tekrar satın alınan ürünler
- Yüksek dönüşüm oranlı ürünler

### 4. Yeni Gelenler
- Son 30 gün içinde eklenen ürünler
- Yeni sezon ürünleri
- Yeni marka ürünleri

### 5. İndirimli Ürünler
- Kampanyalı ürünler
- Sezon sonu indirimleri
- Stok tasfiye ürünleri

### 6. Öne Çıkan Ürünler
- Özel koleksiyon ürünleri
- Marka işbirlikleri
- Sınırlı sayıda ürünler

---

## 🔄 ROZET DEĞİŞTİRME

### Manuel Değiştirme (Admin Panel)
1. Admin panelde ürünü bulun
2. "Düzenle" butonuna tıklayın
3. Yeni rozet seçin
4. Kaydedin

### Toplu Değiştirme (SQL)
```sql
-- Eski "Yeni" rozetli ürünleri "Popüler"e çevir
UPDATE products 
SET badge = 'popular'
WHERE badge = 'new' 
  AND created_at < NOW() - INTERVAL '30 days';

-- Rozeti kaldır
UPDATE products 
SET badge = NULL
WHERE id = 'PRODUCT_ID';
```

---

## 📈 PERFORMANS

### Index Kullanımı
Badge alanı için index oluşturuldu:
```sql
CREATE INDEX idx_products_badge ON products(badge) 
WHERE badge IS NOT NULL;
```

Bu index sayesinde:
- ✅ Hızlı filtreleme
- ✅ Optimize edilmiş sorgular
- ✅ Düşük veritabanı yükü

### Önbellekleme
React Query ile otomatik önbellekleme:
```typescript
// 5 dakika cache
staleTime: 5 * 60 * 1000
```

---

## 🐛 SORUN GİDERME

### Problem: Rozet görünmüyor
**Çözüm:**
1. Ürünün `is_active = true` olduğundan emin olun
2. Badge değerinin doğru olduğunu kontrol edin
3. Tarayıcı cache'ini temizleyin
4. Sayfayı yenileyin

### Problem: Ürün yanlış sekmede görünüyor
**Çözüm:**
1. Admin panelde ürünü düzenleyin
2. Badge değerini kontrol edin
3. Doğru rozeti seçip kaydedin

### Problem: Rozet rengi yanlış
**Çözüm:**
1. `src/lib/constants.ts` dosyasını kontrol edin
2. `BADGE_COLORS` değerlerini inceleyin
3. Tailwind CSS class'larını doğrulayın

---

## 📝 CHANGELOG

### v1.0 (29 Ekim 2025)
- ✅ Badge sistemi oluşturuldu
- ✅ 5 farklı rozet tipi eklendi
- ✅ Admin panel entegrasyonu
- ✅ Ana sayfa sekme sistemi
- ✅ ProductBadge component
- ✅ Otomatik filtreleme
- ✅ Dokümantasyon

---

## 🚀 GELECEK GELİŞTİRMELER

### Planlanan Özellikler
- [ ] Rozet analitikleri (hangi rozet daha çok tıklanıyor)
- [ ] Otomatik rozet atama (satış verilerine göre)
- [ ] Rozet geçmişi (hangi ürün hangi tarihlerde hangi rozeti aldı)
- [ ] Özel rozet tasarımları
- [ ] Rozet öncelik sistemi (birden fazla rozet varsa hangisi gösterilsin)
- [ ] A/B testing (hangi rozet daha iyi performans gösteriyor)

---

## 💡 İPUÇLARI

1. **Düzenli Güncelleme:** Rozetleri ayda bir gözden geçirin
2. **Veri Analizi:** Hangi rozetli ürünler daha çok satıyor?
3. **Sezonluk Stratejiler:** Yaz/kış sezonuna göre rozetleri ayarlayın
4. **Kampanya Planlaması:** Özel günlerde (Black Friday, vb.) rozet stratejisi oluşturun
5. **Müşteri Geri Bildirimi:** Hangi rozetler daha çok ilgi çekiyor?

---

## 📞 DESTEK

Sorularınız için:
- **Dokümantasyon:** Bu dosya
- **Kod:** `src/components/ProductBadge.tsx`
- **Admin:** `src/pages/Admin.tsx`
- **Constants:** `src/lib/constants.ts`

---

**Hazırlayan:** AI Assistant  
**Son Güncelleme:** 29 Ekim 2025  
**Versiyon:** 1.0
