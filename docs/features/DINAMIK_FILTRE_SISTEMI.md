# 🎯 DİNAMİK FİLTRE SİSTEMİ

## 📊 GENEL BAKIŞ

Artık filtreler **otomatik** olarak veritabanındaki ürünlerden oluşturuluyor!

### ✅ Dinamik Filtreler (Otomatik)
- **Marka**: Veritabanındaki tüm markalar
- **Rozet**: Veritabanındaki tüm rozetler (Yeni, İndirim, Çok Satan, Özel)

### 📝 Statik Filtreler (Manuel - categories.ts)
- **Uzunluk**: Olta kamışı uzunlukları (2.1m, 2.4m, vb.)
- **Test**: Olta kamışı test değerleri (5-25g, 10-40g, vb.)
- **Beden**: Giyim bedenleri (XS, S, M, L, XL, XXL)
- **Kapasite**: Kamp çadırı kapasiteleri (1-2 Kişi, 3-4 Kişi, vb.)
- **Hacim**: Termos hacimleri (350ml, 500ml, vb.)

---

## 🔄 NASIL ÇALIŞIR?

### 1. Ürün Eklendiğinde
```typescript
// Admin panelinde yeni ürün ekle:
{
  name: "Shimano Nexave Olta Makinesi",
  brand: "Shimano",  // ← Otomatik Marka filtresine eklenir
  badge: "Yeni",     // ← Otomatik Rozet filtresine eklenir
  category: "balik-av-malzemeleri/olta-makineleri"
}
```

### 2. Filtreler Otomatik Güncellenir
```typescript
// CategoryPage.tsx - useEffect
const { data } = await supabase
  .from('products')
  .select('brand, badge, category')
  .eq('is_active', true);

// Marka listesi
const brands = [...new Set(data.map(p => p.brand).filter(Boolean))].sort();
// → ["Daiwa", "Shimano", "Penn", "Abu Garcia"]

// Rozet listesi
const badges = [...new Set(data.map(p => p.badge).filter(Boolean))].sort();
// → ["Çok Satan", "İndirim", "Yeni", "Özel"]
```

### 3. Kullanıcı Filtreler
```typescript
// Kullanıcı "Shimano" seçer
activeFilters = { Marka: ["Shimano"] }

// Backend sorgusu
base = base.in('brand', ["Shimano"])
// → Sadece Shimano ürünleri gösterilir
```

---

## 📁 KOD YAPISI

### Değişiklikler:

#### 1. State Eklendi
```typescript
const [dynamicFilters, setDynamicFilters] = useState<{ 
  name: string; 
  options: string[] 
}[]>([]);
```

#### 2. Dinamik Filtre Yükleme
```typescript
useEffect(() => {
  const loadDynamicFilters = async () => {
    // Veritabanından brand ve badge çek
    const { data } = await supabase
      .from('products')
      .select('brand, badge, category')
      .eq('is_active', true);
    
    // Kategori bazlı filtrele
    if (rootPath) {
      query = query.like('category', `${rootPath}/%`);
    }
    
    // Unique değerleri al
    const brands = [...new Set(data.map(p => p.brand))].sort();
    const badges = [...new Set(data.map(p => p.badge))].sort();
    
    setDynamicFilters([
      { name: 'Marka', options: brands },
      { name: 'Rozet', options: badges }
    ]);
  };
  
  loadDynamicFilters();
}, [rootPath, subPath]);
```

#### 3. Backend Filtreleme
```typescript
// Marka filtresi
const markaVals = activeFilters['Marka'] || [];
if (markaVals.length > 0) {
  base = base.in('brand', markaVals);
}

// Rozet filtresi
const rozetVals = activeFilters['Rozet'] || [];
if (rozetVals.length > 0) {
  base = base.in('badge', rozetVals);
}
```

#### 4. UI Render
```typescript
{/* Dinamik Filtreler */}
{dynamicFilters.map((filterGroup) => (
  <div>
    <h4>{filterGroup.name}</h4>
    {filterGroup.options.map((option) => (
      <label>
        <input 
          type="checkbox"
          checked={activeFilters[filterGroup.name]?.includes(option)}
          onChange={(e) => handleFilterChange(filterGroup.name, option, e.target.checked)}
        />
        {option}
      </label>
    ))}
  </div>
))}

{/* Statik Filtreler (categories.ts) */}
{categoryData.filters.filter(f => f.name !== 'Marka').map(...)}
```

---

## 🎨 KULLANICI DENEYİMİ

### Önce (Statik):
```
Filtreler:
  Marka:
    ☐ Daiwa      ← Elle yazılmış
    ☐ Shimano    ← Elle yazılmış
    ☐ Penn       ← Elle yazılmış
```

### Sonra (Dinamik):
```
Filtreler:
  Marka:
    ☐ Abu Garcia  ← Veritabanından
    ☐ Daiwa       ← Veritabanından
    ☐ Penn        ← Veritabanından
    ☐ Shimano     ← Veritabanından
  
  Rozet:
    ☐ Çok Satan   ← Veritabanından
    ☐ İndirim     ← Veritabanından
    ☐ Yeni        ← Veritabanından
    ☐ Özel        ← Veritabanından
```

---

## 🚀 AVANTAJLAR

### ✅ Otomatik Güncelleme
- Yeni ürün eklendiğinde filtre otomatik güncellenir
- Elle güncelleme gerekmez

### ✅ Kategori Bazlı
- Her kategoride sadece o kategorideki markalar gösterilir
- Örnek: "Balık Av Malzemeleri" → Sadece balıkçılık markaları

### ✅ Performans
- Filtreler backend'de uygulanır (Supabase)
- Sayfalama çalışır
- Hızlı sonuç

### ✅ Esneklik
- Statik filtreler (Uzunluk, Test) hala `categories.ts`'de
- Dinamik filtreler (Marka, Rozet) veritabanından

---

## 🔮 GELECEKTEKİ İYİLEŞTİRMELER

### 1. Tüm Filtreleri Dinamik Yap
```typescript
// Ürün özelliklerini JSONB'den çek
const { data } = await supabase
  .from('products')
  .select('features');

// Uzunluk, Test, Beden gibi özellikleri otomatik çıkar
const lengths = data.map(p => p.features?.uzunluk).filter(Boolean);
```

### 2. Filtre Sayaçları Ekle
```typescript
// Her filtrenin yanında kaç ürün olduğunu göster
Marka:
  ☐ Shimano (45)
  ☐ Daiwa (32)
  ☐ Penn (18)
```

### 3. Filtre Önbelleği
```typescript
// Filtreleri localStorage'da sakla
// Her seferinde veritabanından çekme
const cachedFilters = localStorage.getItem('filters');
```

### 4. Admin Panelinde Filtre Yönetimi
```typescript
// Admin panelinde "Filtreler" sekmesi
// Hangi filtrelerin gösterileceğini seç
// Filtre sırasını değiştir
```

---

## 📝 NOTLAR

### Mevcut Kod Yapısı Korundu
- ✅ `categories.ts` hala kullanılıyor (statik filtreler için)
- ✅ `categoryFilters` yapısı değişmedi
- ✅ Mevcut filtreler çalışmaya devam ediyor

### Geriye Uyumlu
- ✅ Eski ürünler çalışıyor
- ✅ Eski filtreler çalışıyor
- ✅ Hiçbir breaking change yok

### Performans
- ✅ Tek bir query ile tüm filtreler yükleniyor
- ✅ Kategori değişince otomatik yenileniyor
- ✅ Gereksiz query yok

---

## 🎯 ÖZET

### Değişiklikler:
1. ✅ `dynamicFilters` state eklendi
2. ✅ `loadDynamicFilters` useEffect eklendi
3. ✅ Badge filtresi backend'e eklendi
4. ✅ UI'da dinamik + statik filtreler birleştirildi

### Sonuç:
- **Marka** ve **Rozet** filtreleri artık otomatik
- Yeni ürün eklenince filtreler güncellenir
- Mevcut kod yapısı korundu
- Geriye uyumlu

### Kullanım:
1. Admin panelinde ürün ekle
2. Marka ve rozet belirt
3. Kategori sayfasına git
4. Filtreler otomatik güncellenmiş! 🎉
