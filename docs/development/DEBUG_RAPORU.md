# 🔍 DEBUG RAPORU

## 📊 SORUNLAR

### 1. ❌ Kategoride Ürünler "Stokta Yok" Görünüyor
**Durum:** Admin panelinde stok var ama kategoride "Stokta Yok" yazıyor

**Olası Nedenler:**
- `is_active` kolonu `false` olabilir
- `stock_quantity` 0 veya NULL olabilir
- Frontend cache sorunu olabilir

**Test Adımları:**
1. Supabase Dashboard'da `TEKNIK_OZELLIK_KONTROL.sql` çalıştır
2. Sorgu 2'yi çalıştır: Tüm ürünlerin stok durumunu göreceksin
3. Browser Console'u aç (F12)
4. Kategori sayfasına git
5. Console'da şu logları ara:
   ```
   [CategoryPage] Raw products from DB: [...]
   [CategoryPage] Product 555: stock=..., is_active=..., inStock=...
   ```

**Beklenen Çıktı:**
```javascript
// Eğer ürün stokta ise:
[CategoryPage] Product 555: stock=5555, is_active=true, inStock=true

// Eğer stokta yok görünüyorsa:
[CategoryPage] Product 555: stock=5555, is_active=false, inStock=false
// VEYA
[CategoryPage] Product 555: stock=0, is_active=true, inStock=false
```

---

### 2. ❌ Teknik Özellikler Görünmüyor
**Durum:** Admin panelinde girilen teknik özellikler ürün detayında görünmüyor

**Olası Nedenler:**
- `technical_specs` kolonu JSONB değil, TEXT olabilir
- Veri string olarak kaydediliyor olabilir
- Parse hatası olabilir

**Test Adımları:**
1. Supabase Dashboard'da `TEKNIK_OZELLIK_KONTROL.sql` çalıştır
2. Sorgu 1'i çalıştır: Kolon tipini kontrol et
3. Sorgu 3'ü çalıştır: Mevcut verileri kontrol et
4. Admin panelinde yeni ürün ekle veya düzenle
5. Teknik Özellikler kısmına şunu yaz:
   ```
   Malzeme: Polyester
   Ağırlık: 250g
   Boyut: 30cm x 20cm x 10cm
   ```
6. Kaydet
7. Browser Console'u kontrol et:
   ```
   [Admin] Technical specs parsed: {...}
   [Admin] Product data to save: {...}
   ```
8. Ürün detay sayfasına git
9. Console'u kontrol et:
   ```
   [ProductDetail] Raw technical_specs from DB: ...
   [ProductDetail] Parsed technical_specs: ...
   ```

**Beklenen Çıktı:**

**Admin Panel Console:**
```javascript
[Admin] Technical specs parsed: {
  "Malzeme": "Polyester",
  "Ağırlık": "250g",
  "Boyut": "30cm x 20cm x 10cm"
}
[Admin] Product data to save: {
  name: "555",
  technical_specs: { Malzeme: "Polyester", ... }
}
```

**Ürün Detay Console:**
```javascript
[ProductDetail] Raw technical_specs from DB: {
  "Malzeme": "Polyester",
  "Ağırlık": "250g",
  "Boyut": "30cm x 20cm x 10cm"
} Type: object

[ProductDetail] Parsed technical_specs: {
  "Malzeme": "Polyester",
  "Ağırlık": "250g",
  "Boyut": "30cm x 20cm x 10cm"
}
```

**Eğer Hatalı İse:**
```javascript
// String olarak kaydedilmiş
[ProductDetail] Raw technical_specs from DB: "{\"Malzeme\":\"Polyester\"}" Type: string
[ProductDetail] technical_specs is not a valid object: "{\"Malzeme\":\"Polyester\"}"

// NULL
[ProductDetail] Raw technical_specs from DB: null Type: object
[ProductDetail] technical_specs is not a valid object: null
```

---

## 🔧 ÇÖZÜMLER

### Stok Sorunu İçin:

**Senaryo 1: is_active = false**
```sql
-- Tüm ürünleri aktif yap
UPDATE public.products
SET is_active = true
WHERE is_active = false OR is_active IS NULL;
```

**Senaryo 2: stock_quantity = 0**
```sql
-- Stok miktarını güncelle
UPDATE public.products
SET stock_quantity = 100
WHERE id = 'ÜRÜN_ID';
```

### Teknik Özellik Sorunu İçin:

**Senaryo 1: Kolon TEXT tipinde**
```sql
-- JSONB'ye çevir
ALTER TABLE public.products 
ALTER COLUMN technical_specs TYPE JSONB 
USING technical_specs::JSONB;
```

**Senaryo 2: Veri string olarak kaydedilmiş**
```sql
-- Mevcut verileri temizle ve yeniden ekle
UPDATE public.products
SET technical_specs = NULL
WHERE technical_specs IS NOT NULL;

-- Sonra admin panelinden tekrar ekle
```

---

## 📋 YAPILACAKLAR LİSTESİ

### Hemen Şimdi:
1. ✅ `TEKNIK_OZELLIK_KONTROL.sql` dosyasını Supabase'de çalıştır
2. ✅ Sonuçları buraya yapıştır (ekran görüntüsü veya text)
3. ✅ Browser Console'u aç (F12)
4. ✅ Kategori sayfasına git
5. ✅ Console loglarını buraya yapıştır
6. ✅ Admin panelinde ürün düzenle
7. ✅ Console loglarını buraya yapıştır
8. ✅ Ürün detay sayfasına git
9. ✅ Console loglarını buraya yapıştır

### Sonra:
- Sorunun kaynağını belirle
- Uygun SQL çözümünü uygula
- Test et

---

## 💡 ÖNEMLİ NOTLAR

1. **Cache Sorunu:** Bazen browser cache'i temizlemek gerekebilir (Ctrl+Shift+R)
2. **Supabase Cache:** Supabase Dashboard'u yenile (F5)
3. **Console Temizle:** Console'da sağ tık → Clear console
4. **Network Tab:** Network tab'inde Supabase isteklerini kontrol et

---

## 🎯 SONUÇ

Bu debug adımlarını tamamladıktan sonra:
- Hangi logları gördüğünü paylaş
- Supabase sorgu sonuçlarını paylaş
- Sorunun kaynağını birlikte bulalım
