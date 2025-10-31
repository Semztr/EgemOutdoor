# 🔧 Termoslar ve Mataralar Kategorisi Çözümü

## 🔴 Sorun
Termoslar ve Mataralar kategorisine eklediğin ürünler frontend'de görünmüyor.

## 🔍 Sebep
Ürünlerin veritabanındaki `category` alanı doğru formatla kaydedilmemiş.

### Doğru Format
```
termoslar-ve-mataralar
```

**NOT:** Alt kategoriler kaldırıldı. Sadece ana kategori kullanılıyor.

## ✅ Çözüm

### 1. Admin Panelinde Ürün Kontrolü

1. **Admin Panel'e git**: `/admin`
2. **Ürünler sekmesine** tıkla
3. Termoslar kategorisindeki ürünleri bul
4. Her ürünün **Kategori** alanını kontrol et

### 2. Doğru Kategori Formatı

**Tek Kategori (Alt Kategori Yok):**
```
termoslar-ve-mataralar
```

### 3. Hatalı Kayıtları Düzelt

Eğer ürünler farklı kategori ile kaydedilmişse (örneğin: "Termoslar", "termos", "matara" gibi):

**Admin Panel'den:**
1. Ürüne tıkla
2. "Düzenle" butonuna bas
3. Kategori alanını düzelt:
   - `termoslar-ve-mataralar` (tüm ürünler için)
4. Kaydet

### 4. SQL ile Toplu Düzeltme (Opsiyonel)

Eğer çok sayıda ürün varsa, Supabase SQL Editor'de çalıştır:

```sql
-- 1. Önce hangi ürünlerin yanlış kategori ile kaydedildiğini görelim
SELECT id, name, category 
FROM products 
WHERE category LIKE '%termos%' 
   OR category LIKE '%matara%'
ORDER BY category;

-- 2. Düzelt - TÜM ÜRÜNLER TEK KATEGORİDE
UPDATE products 
SET category = 'termoslar-ve-mataralar'
WHERE category LIKE '%termos%' 
   OR category LIKE '%matara%'
   OR category IN ('Termoslar', 'Mataralar', 'aksesuar', 'Aksesuar');

-- 3. Kontrol et
SELECT id, name, category 
FROM products 
WHERE category LIKE 'termoslar-ve-mataralar%';
```

## 📋 Kategori Sistemi Nasıl Çalışıyor?

### Kod (CategoryPage.tsx)
```typescript
// Line 321-328
if (rootPath) {
  if (subPath) {
    base = base.like('category', `${rootPath}/${subPath}%`);
  } else {
    // Ana kategori veya alt kategoriler
    base = base.or(
      `category.eq.${rootPath},` +
      `category.like.${rootPath}/%,` +
      `category.eq./${rootPath},` +
      `category.like./${rootPath}/%`
    );
  }
}
```

### Ne Anlama Geliyor?

**URL: `/termoslar-ve-mataralar`**
- `rootPath` = "termoslar-ve-mataralar"
- Şu kategorilerdeki ürünleri getirir:
  - `category = "termoslar-ve-mataralar"` (tam eşleşme)
  - `category LIKE "termoslar-ve-mataralar/%"` (alt kategoriler)
  - `category = "/termoslar-ve-mataralar"` (eski format)
  - `category LIKE "/termoslar-ve-mataralar/%"` (eski format alt kategoriler)

### Örnek Ürünler

✅ **Doğru Kategori (Görünür):**
```
Stanley Termos → termoslar-ve-mataralar
Thermos Matara → termoslar-ve-mataralar
Yedek Kapak → termoslar-ve-mataralar
Matara Seti → termoslar-ve-mataralar
```

❌ **Yanlış Kategoriler (Görünmez):**
```
Stanley Termos → Termoslar
Thermos Matara → matara
Yedek Kapak → aksesuar
Stanley Termos → termoslar-ve-mataralar/termoslar (eski format)
```

## 🎯 Hızlı Test

### 1. Tek Ürün Ekle (Test)

Admin Panel'de:
1. "Yeni Ürün Ekle" butonuna tıkla
2. Bilgileri doldur:
   - **Ürün Adı**: Test Termos
   - **Kategori**: `termoslar-ve-mataralar`
   - **Fiyat**: 100
   - **Stok**: 10
   - **Aktif**: ✅
3. Kaydet
4. Frontend'e git: `/termoslar-ve-mataralar`
5. Test Termos'u gör! ✅

### 2. Kontrol Et

Supabase SQL Editor:
```sql
-- Termoslar kategorisindeki tüm ürünleri göster
SELECT id, name, category, is_active, stock_quantity
FROM products
WHERE category LIKE '%termoslar-ve-mataralar%'
  AND is_active = true
ORDER BY created_at DESC;
```

## 🚨 Yaygın Hatalar

### 1. Kategori Adı Yanlış
❌ `Termoslar ve Mataralar` (boşluk var)
✅ `termoslar-ve-mataralar` (tire ile)

### 2. Türkçe Karakter
❌ `termoslar-ve-mataralar` → `termoslar-ve-mataralar` (doğru)
❌ `TermoslarVeMataralar` → `termoslar-ve-mataralar` (küçük harf)

### 3. Alt Kategori Kullanımı
❌ `termoslar-ve-mataralar/termoslar` (alt kategori - ARTIK KULLANILMIYOR)
❌ `termoslar-ve-mataralar/mataralar` (alt kategori - ARTIK KULLANILMIYOR)
✅ `termoslar-ve-mataralar` (sadece ana kategori)

### 4. is_active = false
Ürün aktif değilse görünmez!
```sql
-- Kontrol
SELECT name, is_active FROM products WHERE category LIKE '%termoslar%';

-- Düzelt
UPDATE products SET is_active = true WHERE category LIKE '%termoslar%';
```

## ✅ Checklist

- [ ] Ürünlerin `category` alanı doğru format: `termoslar-ve-mataralar/...`
- [ ] Ürünler `is_active = true`
- [ ] Ürünlerin `stock_quantity > 0` (opsiyonel ama tavsiye edilir)
- [ ] Frontend'de `/termoslar-ve-mataralar` sayfasına gidildiğinde ürünler görünüyor

## 🎉 Sonuç

Bu adımları takip edersen, Termoslar ve Mataralar kategorisindeki ürünler frontend'de görünmeye başlayacak!

Sorun devam ederse:
1. Tarayıcı console'unu aç (F12)
2. `/termoslar-ve-mataralar` sayfasına git
3. Console'da "[CategoryPage] Raw products from DB:" log'unu ara
4. Gelen ürünleri kontrol et

---

**Not:** Migration hatası (`badges` kolonu) farklı bir sorun. O migration'ı çalıştırdıktan sonra düzelecek.
