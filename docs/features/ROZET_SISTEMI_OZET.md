# 🏷️ ÜRÜN ROZET SİSTEMİ - HIZLI BAŞLANGIÇ

## ✅ YAPILAN DEĞİŞİKLİKLER

### 1. Veritabanı
- ✅ `products` tablosuna `badge` kolonu eklendi
- ✅ 5 rozet tipi: `popular`, `bestseller`, `new`, `discount`, `featured`
- ✅ Index oluşturuldu (performans için)

### 2. Frontend
- ✅ `ProductBadge` component oluşturuldu
- ✅ Ana sayfa 3 sekmeye ayrıldı:
  - **Popüler Ürünler** (badge = 'popular')
  - **Çok Satanlar** (badge = 'bestseller')
  - **Yeni Gelenler** (badge = 'new')
- ✅ Otomatik filtreleme sistemi

### 3. Admin Panel
- ✅ Rozet seçim dropdown'ı eklendi
- ✅ 5 rozet seçeneği + Yok seçeneği
- ✅ Açıklayıcı bilgiler eklendi

---

## 🚀 NASIL KULLANILIR?

### Adım 1: Migration'ı Çalıştır
```sql
-- Supabase SQL Editor'de çalıştır:
-- supabase/migrations/20251029000000_add_product_badges.sql
```

### Adım 2: Admin Panelden Rozet Ekle
1. `/admin` sayfasına git
2. Ürün ekle veya düzenle
3. "Ürün Rozeti (Badge)" bölümünden seç:
   - ⭐ Popüler
   - 🔥 Çok Satan
   - ✨ Yeni
   - 💰 İndirimli
   - 🎯 Öne Çıkan
4. Kaydet

### Adım 3: Ana Sayfada Gör
- Rozet seçtiğin ürünler otomatik olarak ilgili sekmede görünür
- Ürün kartında renkli rozet badge'i görünür

---

## 📊 ROZET TİPLERİ

| Rozet | Nerede Görünür | Renk |
|-------|----------------|------|
| ⭐ Popüler | Ana sayfa "Popüler Ürünler" | Mor |
| 🔥 Çok Satan | Ana sayfa "Çok Satanlar" | Turuncu |
| ✨ Yeni | Ana sayfa "Yeni Gelenler" | Yeşil |
| 💰 İndirimli | Ürün kartında | Kırmızı |
| 🎯 Öne Çıkan | Ürün kartında | Mavi |

---

## 📁 OLUŞTURULAN DOSYALAR

```
✅ supabase/migrations/20251029000000_add_product_badges.sql
✅ src/components/ProductBadge.tsx
✅ src/lib/constants.ts (güncellendi)
✅ src/components/ProductShowcase.tsx (güncellendi)
✅ src/pages/Admin.tsx (güncellendi)
✅ ROZET_SISTEMI_DOKUMANTASYON.md
✅ ROZET_SISTEMI_OZET.md
```

---

## 💡 ÖRNEK KULLANIM

### Yeni Ürün Eklerken:
```
1. Admin panel → Ürün Ekle
2. Ürün bilgilerini doldur
3. Rozet: "✨ Yeni" seç
4. Kaydet
5. Ana sayfada "Yeni Gelenler" sekmesinde görünür!
```

### Mevcut Ürünü Düzenlerken:
```
1. Admin panel → Ürünü bul → Düzenle
2. Rozet: "🔥 Çok Satan" seç
3. Kaydet
4. Ana sayfada "Çok Satanlar" sekmesine taşınır!
```

---

## 🎯 ÖNEMLİ NOTLAR

1. **Her ürüne sadece 1 rozet** atanabilir
2. **Rozet seçmek opsiyonel** - Yok seçeneği var
3. **Otomatik filtreleme** - Manuel işlem gerekmez
4. **Performans optimize** - Index ile hızlı sorgular

---

## 📞 YARDIM

Detaylı bilgi için: `ROZET_SISTEMI_DOKUMANTASYON.md`

---

**Hazır! Artık ürünlerinize rozet ekleyip ana sayfada kategorize edebilirsiniz! 🎉**
