# 🎯 DİNAMİK FİLTRE SİSTEMİ V2

## 📊 SORUN

### Önce (Tekrarlı ve Statik):
```
Filtreler:
  Marka: ✅ Dinamik
  Rozet: ✅ Dinamik
  Beden: ✅ Dinamik
  
  --- Statik (categories.ts) ---
  Beden: ❌ TEKRAR (statik)
  Kategori: ❌ Statik
  Fiyat: ❌ TEKRAR
```

### Sonra (Tamamen Dinamik):
```
Filtreler:
  Sırala: ✅ Dinamik
  Fiyat Aralığı: ✅ Dinamik
  Marka: ✅ Dinamik (veritabanından)
  Rozet: ✅ Dinamik (veritabanından)
  Kategori: ✅ Dinamik (veritabanından) ← YENİ
  Beden: ✅ Dinamik (veritabanından)
  Stoktakiler: ✅ Dinamik
```

---

## 🔧 YAPILAN DEĞİŞİKLİKLER

### 1. ✅ Statik Filtreler Kaldırıldı
```typescript
// ÖNCE: categories.ts'den gelen statik filtreler
{categoryData.filters.map((filterGroup) => (
  <div>
    <h4>{filterGroup.name}</h4>
    {filterGroup.options.map(...)}
  </div>
))}

// SONRA: Tamamen kaldırıldı ❌
// Sadece dinamik filtreler kalıyor ✅
```

### 2. ✅ Kategori Filtresi Dinamik Hale Getirildi

#### Parse Mantığı:
```typescript
// Kategori filtresini oluştur (alt kategoriler)
const categories: string[] = [];
data.forEach(p => {
  const cat = p.category;
  if (cat && typeof cat === 'string') {
    // category formatı: "outdoor-giyim/erkek/mont-ve-ceket"
    // Alt kategoriyi al (son kısım)
    const parts = cat.split('/');
    if (parts.length > 1) {
      const subCat = parts[parts.length - 1];
      // Slug'ı başlığa çevir: "mont-ve-ceket" → "Mont ve Ceket"
      const title = subCat
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      if (!categories.includes(title)) {
        categories.push(title);
      }
    }
  }
});
categories.sort();
```

#### Örnek:
```typescript
// Veritabanı:
products = [
  { category: "outdoor-giyim/erkek/mont-ve-ceket" },
  { category: "outdoor-giyim/erkek/pantolon" },
  { category: "outdoor-giyim/kadin/ayakkabi" },
]

// Parse sonucu:
categories = [
  "Ayakkabi",
  "Mont ve Ceket",
  "Pantolon"
]
```

### 3. ✅ Backend Filtreleme Eklendi

```typescript
// Kategori filter (Alt kategoriler)
const kategoriVals = activeFilters['Kategori'] || [];
if (kategoriVals.length > 0) {
  // Başlıkları slug'a çevir: "Mont ve Ceket" → "mont-ve-ceket"
  const slugs = kategoriVals.map(title => 
    title.toLowerCase().replace(/\s+/g, '-')
  );
  // category LIKE '%/mont-ve-ceket' OR category LIKE '%/pantolon'
  const ors = slugs.map(slug => `category.like.%/${slug}`).join(',');
  if (ors) {
    base = base.or(ors);
  }
}
```

---

## 🎨 KULLANICI DENEYİMİ

### Senaryo 1: Outdoor Giyim Kategorisi

#### Kullanıcı `/outdoor-giyim` sayfasına gider:

```
Filtreler:
  Sırala:
    ☐ Yeni Eklenenler
    ☐ En Düşük Fiyat
    ...
  
  Fiyat Aralığı:
    [Min ₺] - [Max ₺]
    [0-500₺] [500-1000₺]
  
  Marka:
    ☐ Columbia
    ☐ The North Face
    ☐ Patagonia
  
  Rozet:
    ☐ Yeni
    ☐ İndirim
    ☐ Çok Satan
  
  Kategori:  ← YENİ! Dinamik
    ☐ Mont ve Ceket
    ☐ Pantolon
    ☐ Ayakkabı
    ☐ Aksesuar
  
  Beden:
    ☐ XS
    ☐ S
    ☐ M
    ☐ L
    ☐ XL
    ☐ XXL
  
  Stoktakiler:
    ☐ Sadece stokta olanlar
```

### Senaryo 2: Kategori Filtresi Kullanımı

```
1. Kullanıcı "Mont ve Ceket" seçer
2. Backend query:
   category LIKE '%/mont-ve-ceket'
3. Sonuç: Sadece mont ve ceket ürünleri
```

### Senaryo 3: Çoklu Kategori Seçimi

```
1. Kullanıcı "Mont ve Ceket" + "Pantolon" seçer
2. Backend query:
   category LIKE '%/mont-ve-ceket' OR category LIKE '%/pantolon'
3. Sonuç: Mont, ceket VE pantolon ürünleri
```

---

## 🔄 SLUG ↔ BAŞLIK ÇEVİRME

### Parse (Veritabanı → UI):
```typescript
// "mont-ve-ceket" → "Mont ve Ceket"
const title = slug
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
```

### Reverse (UI → Veritabanı):
```typescript
// "Mont ve Ceket" → "mont-ve-ceket"
const slug = title.toLowerCase().replace(/\s+/g, '-');
```

### Örnekler:
```typescript
"mont-ve-ceket"     → "Mont ve Ceket"
"pantolon"          → "Pantolon"
"ayakkabi"          → "Ayakkabi"
"outdoor-aksesuar"  → "Outdoor Aksesuar"
```

---

## 📋 FİLTRE SIRASI

### Dinamik Filtreler (Sırayla):
1. **Marka** - Alfabetik
2. **Rozet** - Alfabetik
3. **Kategori** - Alfabetik ← YENİ
4. **Beden** - XS → XXL (sadece outdoor-giyim)

### Sabit Filtreler:
- **Sırala** - En üstte
- **Fiyat Aralığı** - Sıralamadan sonra
- **Stoktakiler** - En altta

---

## 🎯 AVANTAJLAR

### 1. ✅ Tekrar Yok
- Beden filtresi 1 kez
- Fiyat filtresi 1 kez
- Her filtre benzersiz

### 2. ✅ Tamamen Dinamik
- Yeni ürün eklenince filtreler otomatik güncellenir
- Elle güncelleme gerekmez
- `categories.ts` artık filtreler için kullanılmıyor

### 3. ✅ Backend Filtreleme
- Kategori filtresi backend'de çalışıyor
- Hızlı sonuç
- Sayfalama çalışıyor

### 4. ✅ Kullanıcı Dostu
- Alt kategorilere göre filtreleme
- Çoklu seçim
- Temiz UI

---

## 🔧 TEKNİK DETAYLAR

### Dinamik Filtre State:
```typescript
const [dynamicFilters, setDynamicFilters] = useState<{
  name: string;
  options: string[];
}[]>([]);

// Örnek:
dynamicFilters = [
  { name: 'Marka', options: ['Columbia', 'The North Face'] },
  { name: 'Rozet', options: ['Yeni', 'İndirim'] },
  { name: 'Kategori', options: ['Mont ve Ceket', 'Pantolon'] },
  { name: 'Beden', options: ['S', 'M', 'L', 'XL'] },
]
```

### Backend Query:
```typescript
// Kategori filtresi
if (kategoriVals.length > 0) {
  const slugs = kategoriVals.map(title => 
    title.toLowerCase().replace(/\s+/g, '-')
  );
  const ors = slugs.map(slug => `category.like.%/${slug}`).join(',');
  base = base.or(ors);
}
```

### SQL Örneği:
```sql
SELECT * FROM products
WHERE is_active = true
  AND (
    category LIKE '%/mont-ve-ceket'
    OR category LIKE '%/pantolon'
  )
ORDER BY created_at DESC
LIMIT 30;
```

---

## 📊 PERFORMANS

### Filtre Yükleme:
- ✅ Tek query ile tüm filtreler
- ✅ Kategori değişince otomatik yenileniyor
- ✅ Gereksiz query yok

### Filtreleme:
- ✅ Backend'de yapılıyor (Supabase)
- ✅ Sayfalama çalışıyor
- ✅ Hızlı sonuç

---

## 🎨 GÖRSEL KARŞILAŞTIRMA

### Önce (Tekrarlı):
```
┌─────────────────────┐
│ Marka: ✅           │
│ Rozet: ✅           │
│ Beden: ✅           │
├─────────────────────┤
│ --- Statik ---      │
│ Beden: ❌ TEKRAR    │
│ Kategori: ❌ Statik │
│ Fiyat: ❌ TEKRAR    │
└─────────────────────┘
```

### Sonra (Temiz):
```
┌─────────────────────┐
│ Sırala: ✅          │
│ Fiyat Aralığı: ✅   │
│ Marka: ✅           │
│ Rozet: ✅           │
│ Kategori: ✅ YENİ   │
│ Beden: ✅           │
│ Stoktakiler: ✅     │
└─────────────────────┘
```

---

## ⚠️ NOTLAR

### categories.ts Kullanımı:
```typescript
// ÖNCE: Filtreler için kullanılıyordu
export const categoryFilters = {
  'outdoor-giyim': [
    { name: 'Beden', options: ['XS', 'S', 'M', 'L'] }
  ]
}

// SONRA: Sadece breadcrumb ve sayfa bilgisi için
export const siteCategories = [
  {
    name: 'Outdoor Giyim',
    slug: 'outdoor-giyim',
    // Filtreler artık burada değil ❌
  }
]
```

### TypeScript Hatası (Geçici):
```
Property 'sizes' does not exist on 'products'.
```

**Sebep:** `sizes` kolonu henüz veritabanında yok

**Çözüm:** SQL'i çalıştır:
```sql
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sizes jsonb DEFAULT '[]'::jsonb;
```

---

## 🎉 ÖZET

### Kaldırılan:
- ❌ Statik filtreler (`categories.ts`)
- ❌ Tekrarlı beden filtresi
- ❌ Tekrarlı fiyat filtresi

### Eklenen:
- ✅ Dinamik kategori filtresi
- ✅ Backend kategori filtreleme
- ✅ Slug ↔ Başlık çevirme

### Sonuç:
- ✅ Tüm filtreler dinamik
- ✅ Tekrar yok
- ✅ Temiz kod
- ✅ Hızlı performans
- ✅ Kullanıcı dostu

**Artık tamamen dinamik bir filtre sistemi!** 🚀
