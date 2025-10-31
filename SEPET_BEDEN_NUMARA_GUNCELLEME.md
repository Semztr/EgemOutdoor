# 🛒 Sepet Beden ve Numara Güncelleme

## ✅ Yapılan Değişiklikler

### 1. CartItem Interface Güncellendi
**Dosya**: `src/contexts/CartContext.tsx`

```typescript
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
  color?: string;      // ✨ YENİ - Seçilen renk
  size?: string;       // ✨ YENİ - Seçilen beden (XS, S, M, L, XL, XXL)
  shoeSize?: string;   // ✨ YENİ - Seçilen ayakkabı numarası
}
```

### 2. Sepete Ekleme Güncellendi
**Dosya**: `src/pages/ProductDetail.tsx`

**Öncesi:**
```typescript
addItem({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.images[0],
  brand: product.brand,
});
```

**Sonrası:**
```typescript
const cartItem: any = {
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.images[0],
  brand: product.brand,
};

// Seçilen renk varsa ekle
if (selectedColor) {
  cartItem.color = selectedColor;
}

// Seçilen beden varsa ekle
if (selectedSize) {
  cartItem.size = selectedSize;
}

// Seçilen ayakkabı numarası varsa ekle
if (selectedShoeSize) {
  cartItem.shoeSize = selectedShoeSize;
}

addItem(cartItem);
```

### 3. Sepet Mantığı Güncellendi
**Dosya**: `src/contexts/CartContext.tsx`

#### A) ADD_ITEM - Aynı Kombinasyon Kontrolü
Artık aynı ürünün farklı renk/beden/numara kombinasyonları **ayrı satırlar** olarak eklenir:

```typescript
// Aynı ürün, aynı renk, aynı beden/numara kombinasyonunu bul
const existingItem = state.items.find(item => 
  item.id === action.payload.id &&
  item.color === action.payload.color &&
  item.size === action.payload.size &&
  item.shoeSize === action.payload.shoeSize
);
```

**Örnek:**
- Siyah T-Shirt Beden M → Sepette 1. satır
- Beyaz T-Shirt Beden L → Sepette 2. satır (farklı kombinasyon)
- Siyah T-Shirt Beden M → 1. satırın miktarı artırılır (aynı kombinasyon)

#### B) REMOVE_ITEM - Doğru Kombinasyonu Sil
```typescript
const newItems = state.items.filter(item => 
  !(item.id === action.payload.id &&
    item.color === action.payload.color &&
    item.size === action.payload.size &&
    item.shoeSize === action.payload.shoeSize)
);
```

#### C) UPDATE_QUANTITY - Doğru Kombinasyonu Güncelle
```typescript
const newItems = state.items.map(item =>
  item.id === action.payload.id &&
  item.color === action.payload.color &&
  item.size === action.payload.size &&
  item.shoeSize === action.payload.shoeSize
    ? { ...item, quantity: Math.max(0, action.payload.quantity) }
    : item
);
```

### 4. Sepet Sayfası Güncellendi
**Dosya**: `src/pages/Cart.tsx`

#### A) Renk, Beden, Numara Badge'leri
```tsx
{(item.color || item.size || item.shoeSize) && (
  <div className="flex flex-wrap gap-2 mt-2">
    {item.color && (
      <Badge variant="outline" className="text-xs">
        🎨 {item.color}
      </Badge>
    )}
    {item.size && (
      <Badge variant="outline" className="text-xs">
        👕 Beden: {item.size}
      </Badge>
    )}
    {item.shoeSize && (
      <Badge variant="outline" className="text-xs">
        👟 Numara: {item.shoeSize}
      </Badge>
    )}
  </div>
)}
```

#### B) Unique Key
```tsx
{state.items.map((item, index) => (
  <Card key={`${item.id}-${item.color}-${item.size}-${item.shoeSize}-${index}`}>
    {/* ... */}
  </Card>
))}
```

#### C) Silme ve Güncelleme
```tsx
// Silme
onClick={() => handleRemoveItem(item.id, item.color, item.size, item.shoeSize)}

// Miktar azaltma
onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.color, item.size, item.shoeSize)}

// Miktar artırma
onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.color, item.size, item.shoeSize)}
```

---

## 🎯 Nasıl Çalışıyor?

### Senaryo 1: Renk Seçimi Olan Ürün
```
Ürün: Columbia T-Shirt
Renkler: Siyah, Beyaz, Mavi
Bedenler: S, M, L, XL

Kullanıcı Seçimi:
- Renk: Siyah
- Beden: M
- Miktar: 2

Sepete Eklenen:
{
  id: 123,
  name: "Columbia T-Shirt",
  color: "Siyah",
  size: "M",
  quantity: 2
}
```

### Senaryo 2: Ayakkabı Numarası Olan Ürün
```
Ürün: Merrell Bot
Numaralar: 40, 41, 42, 43

Kullanıcı Seçimi:
- Numara: 42
- Miktar: 1

Sepete Eklenen:
{
  id: 456,
  name: "Merrell Bot",
  shoeSize: "42",
  quantity: 1
}
```

### Senaryo 3: Farklı Kombinasyonlar
```
Sepet İçeriği:

1. Columbia T-Shirt - Siyah - M (2 adet)
2. Columbia T-Shirt - Beyaz - L (1 adet)
3. Merrell Bot - 42 (1 adet)
4. Olta Kamışı (renk/beden yok) (1 adet)
```

---

## 📸 Sepet Görünümü

### Ürün Kartı Örneği
```
┌─────────────────────────────────────────────┐
│ [Görsel]  Columbia T-Shirt                  │
│           Columbia                           │
│           🎨 Siyah  👕 Beden: M             │
│                                              │
│           ₺299                               │
│           [-] 2 [+]                          │
│           Stokta var                         │
└─────────────────────────────────────────────┘
```

---

## ✅ Avantajlar

### 1. Doğru Stok Yönetimi
- Aynı ürünün farklı varyantları ayrı takip edilir
- Her renk/beden kombinasyonu için ayrı stok kontrolü

### 2. Kullanıcı Deneyimi
- Seçilen özellikler sepette açıkça görünür
- Hangi varyantı aldığı net anlaşılır
- Karışıklık önlenir

### 3. Sipariş Yönetimi
- Admin panelde hangi varyantın sipariş edildiği net
- Kargo hazırlama kolaylaşır
- Hata riski azalır

### 4. Esnek Yapı
- Renk olmayan ürünler → Sadece ürün bilgisi
- Renk olan ürünler → Renk badge'i görünür
- Beden olan ürünler → Beden badge'i görünür
- Numara olan ürünler → Numara badge'i görünür

---

## 🧪 Test Senaryoları

### Test 1: Aynı Ürün Farklı Renk
1. Ürün detay sayfasına git
2. Siyah renk seç, sepete ekle
3. Beyaz renk seç, sepete ekle
4. **Beklenen**: Sepette 2 ayrı satır

### Test 2: Aynı Ürün Aynı Renk
1. Ürün detay sayfasına git
2. Siyah renk seç, sepete ekle
3. Tekrar Siyah renk seç, sepete ekle
4. **Beklenen**: Sepette 1 satır, miktar 2

### Test 3: Beden Seçimi
1. T-Shirt ürününe git
2. Renk: Siyah, Beden: M seç
3. Sepete ekle
4. **Beklenen**: Sepette "🎨 Siyah" ve "👕 Beden: M" badge'leri görünsün

### Test 4: Numara Seçimi
1. Bot ürününe git
2. Numara: 42 seç
3. Sepete ekle
4. **Beklenen**: Sepette "👟 Numara: 42" badge'i görünsün

### Test 5: Silme İşlemi
1. Sepette 2 farklı varyant olsun (Siyah M, Beyaz L)
2. Siyah M'yi sil
3. **Beklenen**: Sadece Beyaz L kalsın

### Test 6: Miktar Güncelleme
1. Sepette Siyah M (2 adet) olsun
2. Miktarı 3'e çıkar
3. **Beklenen**: Sadece Siyah M'nin miktarı değişsin

---

## 🔄 LocalStorage Yapısı

```json
{
  "items": [
    {
      "id": 123,
      "name": "Columbia T-Shirt",
      "price": 299,
      "quantity": 2,
      "image": "tshirt.jpg",
      "brand": "Columbia",
      "color": "Siyah",
      "size": "M"
    },
    {
      "id": 123,
      "name": "Columbia T-Shirt",
      "price": 299,
      "quantity": 1,
      "image": "tshirt.jpg",
      "brand": "Columbia",
      "color": "Beyaz",
      "size": "L"
    },
    {
      "id": 456,
      "name": "Merrell Bot",
      "price": 1299,
      "quantity": 1,
      "image": "bot.jpg",
      "brand": "Merrell",
      "shoeSize": "42"
    }
  ],
  "total": 1897,
  "itemCount": 4
}
```

---

## 🚀 Sonuç

✅ **Tamamlandı!** Sepet sistemi artık:
- Renk seçimlerini gösteriyor
- Beden seçimlerini gösteriyor
- Ayakkabı numara seçimlerini gösteriyor
- Aynı ürünün farklı varyantlarını ayrı satırlarda tutuyor
- Doğru kombinasyonu siliyor/güncelliyor

**Test et ve kullan!** 🎉
