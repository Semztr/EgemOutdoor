# 🎨 NUMARA, RENK VE HİYERARŞİK KATEGORİ FİLTRELERİ

## 📊 YAPILAN DEĞİŞİKLİKLER

### 1. ✅ Numara Filtresi Eklendi
**Amaç:** Ayakkabı/bot ürünleri için numara filtresi
**Değerler:** 39, 39.5, 40, 40.5, 41, 41.5, 42, 42.5, 43, 43.5, 44, 44.5, 45, 46

### 2. ✅ Renk Filtresi Eklendi
**Amaç:** Tüm ürünler için renk filtresi
**Değerler:** Mavi, Antrasit, Bej, Yeşil, Siyah, Gri, vb.

### 3. ✅ Kategori Hiyerarşisi Düzeltildi
**Amaç:** Görseldeki gibi ana kategori > alt kategori yapısı
**Yapı:**
```
Erkek
  Pantolon
  Tişört
  Gömlek
  Mont ve Ceket
  Ayakkabı
  Bot
Kadın
  Tişört
  Ayakkabı
  Bot
  Mont ve Ceket
  Pantolon
Aksesuar
  Çanta
  Şapka
  Bere
  Termal İçlik
  Sweatshirts
  Polar
  Yelek
  Şort
```

---

## 🗂️ 1. VERİTABANI DEĞİŞİKLİKLERİ

### Yeni Kolonlar:
```sql
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS shoe_size text,
ADD COLUMN IF NOT EXISTS color text;
```

### Index'ler:
```sql
CREATE INDEX IF NOT EXISTS idx_products_shoe_size 
ON public.products(shoe_size);

CREATE INDEX IF NOT EXISTS idx_products_color 
ON public.products(color);
```

### Örnek Veri:
```sql
-- Ayakkabı ürünleri
UPDATE products 
SET shoe_size = '42', color = 'Siyah'
WHERE category LIKE '%ayakkabi%';

-- Mont ürünleri
UPDATE products 
SET color = 'Mavi'
WHERE category LIKE '%mont%';
```

---

## 🎯 2. NUMARA FİLTRESİ

### Parse Mantığı:
```typescript
// Numara filtresini oluştur (ayakkabı/bot için)
const shoeSizes: string[] = [];
if (rootPath === 'outdoor-giyim') {
  data.forEach(p => {
    const shoeSize = p.shoe_size;
    if (shoeSize && !shoeSizes.includes(shoeSize)) {
      shoeSizes.push(shoeSize);
    }
  });
  // Numara sıralaması: 39, 39.5, 40, 40.5, ...
  shoeSizes.sort((a, b) => parseFloat(a) - parseFloat(b));
}
```

### Backend Filtreleme:
```typescript
// Numara filter (shoe_size)
const numaraVals = activeFilters['Numara'] || [];
if (numaraVals.length > 0) {
  base = base.in('shoe_size', numaraVals);
}
```

### SQL Örneği:
```sql
SELECT * FROM products
WHERE shoe_size IN ('42', '43', '44')
  AND is_active = true;
```

### UI Görünümü:
```
Numara:
  ☐ 39
  ☐ 39.5
  ☐ 40
  ☐ 40.5
  ☐ 41
  ☐ 41.5
  ☐ 42
  ☐ 42.5
  ☐ 43
  ☐ 43.5
  ☐ 44
  ☐ 44.5
  ☐ 45
  ☐ 46
```

---

## 🎨 3. RENK FİLTRESİ

### Parse Mantığı:
```typescript
// Renk filtresini oluştur
const colors: string[] = [];
if (rootPath === 'outdoor-giyim') {
  data.forEach(p => {
    const color = p.color;
    if (color && !colors.includes(color)) {
      colors.push(color);
    }
  });
  colors.sort(); // Alfabetik
}
```

### Backend Filtreleme:
```typescript
// Renk filter (color)
const renkVals = activeFilters['Renk'] || [];
if (renkVals.length > 0) {
  base = base.in('color', renkVals);
}
```

### SQL Örneği:
```sql
SELECT * FROM products
WHERE color IN ('Mavi', 'Siyah', 'Yeşil')
  AND is_active = true;
```

### UI Görünümü:
```
Renk:
  ☐ Antrasit
  ☐ Bej
  ☐ Gri
  ☐ Mavi
  ☐ Siyah
  ☐ Yeşil
```

### Renk Paleti (Genişletildi):
```
Mevcut Renkler:
- Mavi
- Antrasit
- Bej
- Yeşil
- Siyah
- Gri

Eklenebilecek Renkler:
- Kırmızı
- Sarı
- Turuncu
- Mor
- Pembe
- Beyaz
- Kahverengi
- Lacivert
- Bordo
```

---

## 🗂️ 4. HİYERARŞİK KATEGORİ

### Önce (Karışık):
```
Kategori:
  ☐ Erkek > Pantolon
  ☐ Erkek > Tişört
  ☐ Kadın > Pantolon
  ☐ Kadın > Tişört
  ☐ Aksesuar > Çanta
```

### Sonra (Hiyerarşik - Görseldeki Gibi):
```
Kategori:
  ☐ Erkek
    ☐ Pantolon
    ☐ Tişört
    ☐ Gömlek
    ☐ Mont ve Ceket
    ☐ Ayakkabı
    ☐ Bot
  ☐ Kadın
    ☐ Tişört
    ☐ Ayakkabı
    ☐ Bot
    ☐ Mont ve Ceket
    ☐ Pantolon
  ☐ Aksesuar
    ☐ Çanta
    ☐ Şapka
    ☐ Bere
    ☐ Termal İçlik
    ☐ Sweatshirts
    ☐ Polar
    ☐ Yelek
    ☐ Şort
```

### Parse Mantığı:
```typescript
// Kategori filtresini oluştur - Hiyerarşik yapı
const categoryMap = new Map<string, Set<string>>();

data.forEach(p => {
  const cat = p.category;
  if (cat && typeof cat === 'string') {
    // "outdoor-giyim/erkek/mont-ve-ceket"
    const parts = cat.split('/').filter(Boolean);
    
    if (parts.length >= 2) {
      // Ana kategori (Erkek, Kadın, Aksesuar)
      const mainCat = parts[1];
      const mainTitle = capitalize(mainCat);
      
      if (!categoryMap.has(mainTitle)) {
        categoryMap.set(mainTitle, new Set());
      }
      
      // Alt kategori varsa (Mont ve Ceket, Pantolon, vb.)
      if (parts.length >= 3) {
        const subCat = parts[2];
        const subTitle = capitalize(subCat);
        categoryMap.get(mainTitle)!.add(subTitle);
      }
    }
  }
});

// Hiyerarşik kategori listesi oluştur
const categories: string[] = [];
const sortedMainCats = Array.from(categoryMap.keys()).sort();

sortedMainCats.forEach(mainCat => {
  // Ana kategoriyi ekle
  categories.push(mainCat);
  
  // Alt kategorileri ekle (girintili)
  const subCats = Array.from(categoryMap.get(mainCat)!).sort();
  subCats.forEach(subCat => {
    categories.push(`  ${subCat}`); // 2 boşluk ile girintili
  });
});
```

### UI Render:
```typescript
<label 
  className={`flex items-center space-x-2 cursor-pointer ${
    isIndented ? 'ml-4' : ''
  } ${
    !isIndented && filterGroup.name === 'Kategori' ? 'font-medium' : ''
  }`}
>
  <input type="checkbox" />
  <span className={`text-sm ${
    !isIndented && filterGroup.name === 'Kategori' 
      ? 'text-foreground'  // Ana kategori - koyu
      : 'text-muted-foreground' // Alt kategori - açık
  }`}>
    {displayText}
  </span>
</label>
```

### Backend Filtreleme:
```typescript
// Kategori filter (Hiyerarşik)
const kategoriVals = activeFilters['Kategori'] || [];
if (kategoriVals.length > 0) {
  const ors = kategoriVals.map(title => {
    const trimmed = title.trim();
    
    // Girintili ise alt kategori (  Mont ve Ceket)
    if (title.startsWith('  ')) {
      // "  Mont ve Ceket" → "%/mont-ve-ceket"
      const slug = trimmed.toLowerCase().replace(/\s+/g, '-');
      return `category.like.%/${slug}`;
    } else {
      // Ana kategori: "Erkek" → "%/erkek/%"
      const slug = trimmed.toLowerCase().replace(/\s+/g, '-');
      return `category.like.%/${slug}/%`;
    }
  }).join(',');
  
  if (ors) {
    base = base.or(ors);
  }
}
```

---

## 📋 KULLANIM SENARYOLARI

### Senaryo 1: Numara Filtresi
```
1. Kullanıcı /outdoor-giyim/erkek/ayakkabi sayfasına gider
2. Filtreler: "Numara" > "42" seçer
3. ✅ Sadece 42 numara ayakkabılar görünür
4. Backend: shoe_size = '42'
```

### Senaryo 2: Renk Filtresi
```
1. Kullanıcı /outdoor-giyim sayfasına gider
2. Filtreler: "Renk" > "Mavi" + "Siyah" seçer
3. ✅ Sadece mavi ve siyah ürünler görünür
4. Backend: color IN ('Mavi', 'Siyah')
```

### Senaryo 3: Hiyerarşik Kategori - Ana Kategori
```
1. Kullanıcı "Erkek" seçer
2. ✅ Tüm erkek kategorisi ürünleri (pantolon, tişört, mont, vb.)
3. Backend: category LIKE '%/erkek/%'
```

### Senaryo 4: Hiyerarşik Kategori - Alt Kategori
```
1. Kullanıcı "  Mont ve Ceket" seçer (girintili)
2. ✅ Sadece mont ve ceket ürünleri
3. Backend: category LIKE '%/mont-ve-ceket'
```

### Senaryo 5: Kombine Filtre
```
1. Kullanıcı:
   - Kategori: "Erkek" > "  Ayakkabı"
   - Numara: "42"
   - Renk: "Siyah"
2. ✅ Sadece erkek, 42 numara, siyah ayakkabılar
3. Backend:
   category LIKE '%/ayakkabi'
   AND shoe_size = '42'
   AND color = 'Siyah'
```

---

## 🎨 GÖRSEL KARŞILAŞTIRMA

### Önce (Düz Liste):
```
Kategori:
  ☐ Erkek > Pantolon
  ☐ Erkek > Tişört
  ☐ Erkek > Mont ve Ceket
  ☐ Kadın > Pantolon
  ☐ Kadın > Tişört
  ☐ Aksesuar > Çanta
```

### Sonra (Hiyerarşik - Görseldeki Gibi):
```
Kategori:
  ☐ Erkek (koyu, kalın)
    ☐ Pantolon (girintili, açık)
    ☐ Tişört (girintili, açık)
    ☐ Mont ve Ceket (girintili, açık)
  ☐ Kadın (koyu, kalın)
    ☐ Pantolon (girintili, açık)
    ☐ Tişört (girintili, açık)
  ☐ Aksesuar (koyu, kalın)
    ☐ Çanta (girintili, açık)
```

---

## 📊 FİLTRE SIRASI

### Yeni Filtre Sırası:
1. **Marka** - Alfabetik, arama özelliği
2. **Kategori** - Hiyerarşik, girintili
3. **Beden** - XS, S, M, L, XL, XXL
4. **Numara** - 39, 39.5, 40, ..., 46
5. **Renk** - Alfabetik
6. **Fiyat Aralığı** - Min/Max + hızlı seçim
7. **Stoktakiler** - Checkbox

---

## 🎉 SONUÇ

### Eklenenler:
- ✅ Numara filtresi (dinamik)
- ✅ Renk filtresi (dinamik)
- ✅ Hiyerarşik kategori yapısı
- ✅ Girintili UI (görseldeki gibi)
- ✅ Ana kategori kalın, alt kategori açık

### Veritabanı:
- ✅ `shoe_size` kolonu
- ✅ `color` kolonu
- ✅ Index'ler

### Backend:
- ✅ Numara filtreleme
- ✅ Renk filtreleme
- ✅ Hiyerarşik kategori filtreleme

### UI:
- ✅ Girintili görünüm
- ✅ Ana kategori vurgusu
- ✅ Temiz hiyerarşi

**Artık görseldeki gibi profesyonel bir filtre sistemi!** 🚀
