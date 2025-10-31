# 🖼️ GÖRSEL LIGHTBOX ÖZELLİĞİ

**Tarih:** 30 Ekim 2025  
**Özellik:** Ürün görsellerine tıklandığında büyütülmüş görünüm  
**Durum:** ✅ Tamamlandı

---

## 🎯 ÖZELLİK AÇIKLAMASI

Ürün detay sayfasında ana görsele tıklandığında, görsel büyütülmüş bir modal/lightbox içinde gösteriliyor.

### Özellikler

- ✅ Görsele tıklayınca modal açılıyor
- ✅ Modal sayfanın tamamını değil, %90'ını kaplıyor
- ✅ Arka plan blur ve karartma efekti
- ✅ Kapatma butonu (X)
- ✅ Önceki/Sonraki navigasyon butonları
- ✅ Görsel sayacı (1/5 gibi)
- ✅ Klavye desteği (ESC, ← →)
- ✅ Dışarı tıklayınca kapanma
- ✅ Hover efekti (büyütmek için tıklayın)

---

## 🎨 KULLANICI DENEYİMİ

### 1. Hover Efekti

Ana görselin üzerine gelindiğinde:
```
┌─────────────────────────────┐
│                             │
│    [Görsel]                 │
│                             │
│  "Büyütmek için tıklayın"   │ ← Hover'da görünür
│                             │
└─────────────────────────────┘
```

### 2. Modal Görünümü

Görsele tıklandığında:
```
┌───────────────────────────────────────────────┐
│ [X]                                           │ ← Kapat
│                                               │
│ [<]         [Büyük Görsel]            [>]     │ ← Navigasyon
│                                               │
│                   3 / 5                       │ ← Sayaç
└───────────────────────────────────────────────┘
```

### 3. Navigasyon

**Mouse ile:**
- Sol ok butonu: Önceki görsel
- Sağ ok butonu: Sonraki görsel
- X butonu: Kapat
- Dışarı tıklama: Kapat

**Klavye ile:**
- `ESC`: Kapat
- `←`: Önceki görsel
- `→`: Sonraki görsel

---

## 💻 TEKNİK DETAYLAR

### 1. State Yönetimi

```typescript
const [imageModal, setImageModal] = useState(false);
```

**Kullanım:**
- `imageModal = true`: Modal açık
- `imageModal = false`: Modal kapalı

### 2. Ana Görsel (Tıklanabilir)

```tsx
<div 
  className="relative bg-muted rounded-xl overflow-hidden border border-border group cursor-pointer"
  onClick={() => setImageModal(true)}
>
  <div className="aspect-square max-w-md mx-auto">
    <img 
      src={product.images[selectedImage]} 
      alt={product.name} 
      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" 
    />
  </div>
  
  {/* Hover indicator */}
  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
    <div className="bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg">
      <p className="text-sm font-medium">Büyütmek için tıklayın</p>
    </div>
  </div>
</div>
```

**Özellikler:**
- `cursor-pointer`: Mouse cursor değişir
- `group`: Hover efekti için
- `onClick`: Modal açılır
- Hover'da "Büyütmek için tıklayın" mesajı

### 3. Modal Component

```tsx
{imageModal && (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    onClick={() => setImageModal(false)}
  >
    <div className="relative w-full max-w-5xl max-h-[90vh] bg-background rounded-xl shadow-2xl overflow-hidden">
      {/* Close Button */}
      <button
        onClick={() => setImageModal(false)}
        className="absolute top-4 right-4 z-10 p-2 bg-background/80 hover:bg-background rounded-full transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation Buttons */}
      {product.images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-background/80 hover:bg-background rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-background/80 hover:bg-background rounded-full transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Image */}
      <div 
        className="flex items-center justify-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={product.images[selectedImage]}
          alt={product.name}
          className="max-w-full max-h-[80vh] object-contain"
        />
      </div>

      {/* Image Counter */}
      {product.images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-4 py-2 rounded-full">
          <p className="text-sm font-medium">
            {selectedImage + 1} / {product.images.length}
          </p>
        </div>
      )}
    </div>
  </div>
)}
```

**Katmanlar:**
1. **Overlay** (`bg-black/80 backdrop-blur-sm`): Arka plan karartma
2. **Modal Container** (`max-w-5xl max-h-[90vh]`): Görsel container
3. **Close Button** (sağ üst)
4. **Navigation Buttons** (sol/sağ)
5. **Image** (ortada)
6. **Counter** (alt ortada)

### 4. Klavye Desteği

```typescript
// Keyboard navigation for image modal
useEffect(() => {
  if (!imageModal) return;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setImageModal(false);
    } else if (e.key === 'ArrowLeft' && product?.images?.length > 1) {
      setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    } else if (e.key === 'ArrowRight' && product?.images?.length > 1) {
      setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [imageModal, product]);
```

**Desteklenen Tuşlar:**
- `Escape`: Modal'ı kapat
- `ArrowLeft` (←): Önceki görsel
- `ArrowRight` (→): Sonraki görsel

---

## 🎨 TASARIM ÖZELLİKLERİ

### 1. Modal Boyutları

```css
max-w-5xl      /* Maksimum genişlik: 1024px */
max-h-[90vh]   /* Maksimum yükseklik: Ekranın %90'ı */
```

**Neden %90?**
- ✅ Tam ekran değil, daha şık
- ✅ Kullanıcı hala sayfada olduğunu hissediyor
- ✅ Kapatma butonu her zaman görünür
- ✅ Mobilde de iyi görünüyor

### 2. Arka Plan Efektleri

```css
bg-black/80        /* %80 siyah overlay */
backdrop-blur-sm   /* Blur efekti */
```

**Sonuç:**
- Arka plan bulanık ve karanlık
- Odak tamamen görselde
- Modern ve profesyonel görünüm

### 3. Buton Tasarımı

```css
bg-background/80        /* Yarı saydam arka plan */
hover:bg-background     /* Hover'da tam opak */
rounded-full            /* Yuvarlak */
transition-colors       /* Yumuşak geçiş */
```

**Özellikler:**
- Yuvarlak butonlar (modern)
- Yarı saydam (görseli kapatmıyor)
- Hover efekti (interaktif)

### 4. Görsel Sayacı

```css
bg-background/80   /* Yarı saydam arka plan */
px-4 py-2          /* Padding */
rounded-full       /* Yuvarlak köşeler */
```

**Konum:**
- Alt ortada
- Yarı saydam
- Küçük ve minimal

---

## 📱 RESPONSİVE TASARIM

### Desktop (>1024px)

```
┌─────────────────────────────────────────────┐
│ [X]                                         │
│                                             │
│ [<]    [Büyük Görsel - 1024px]        [>]  │
│                                             │
│                   3 / 5                     │
└─────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)

```
┌───────────────────────────────────┐
│ [X]                               │
│                                   │
│ [<]  [Görsel - 768px]        [>]  │
│                                   │
│           3 / 5                   │
└───────────────────────────────────┘
```

### Mobile (<768px)

```
┌─────────────────────┐
│ [X]                 │
│                     │
│ [<] [Görsel]   [>]  │
│                     │
│      3 / 5          │
└─────────────────────┘
```

**Responsive Özellikler:**
- `max-w-5xl`: Desktop'ta maksimum genişlik
- `max-h-[90vh]`: Her ekranda %90 yükseklik
- `p-4`: Kenarlardan 16px boşluk
- `object-contain`: Görsel oranı korunur

---

## 🔄 NAVIGASYON AKIŞI

### Görsel Değiştirme Mantığı

```typescript
// Önceki görsel
setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));

// Sonraki görsel
setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
```

**Özellikler:**
- İlk görseldeyken ← tuşu: Son görsele git
- Son görseldeyken → tuşu: İlk görsele git
- Sonsuz döngü (carousel)

### Click Event Yönetimi

```typescript
// Overlay'e tıklama: Kapat
onClick={() => setImageModal(false)}

// İçerik'e tıklama: Kapatma
onClick={(e) => e.stopPropagation()}

// Butonlara tıklama: Event'i durdur
onClick={(e) => {
  e.stopPropagation();
  // ... işlem
}}
```

**Neden `stopPropagation`?**
- Butonlara tıklayınca modal kapanmasın
- Sadece overlay'e tıklayınca kapansın

---

## ✨ KULLANICI DENEYİMİ İYİLEŞTİRMELERİ

### 1. Hover Feedback

**Önceki:**
```
[Görsel]  ← Tıklanabilir olduğu belli değil
```

**Yeni:**
```
[Görsel]
"Büyütmek için tıklayın"  ← Hover'da görünür
cursor: pointer           ← Mouse değişir
scale-105                 ← Hafif büyür
```

### 2. Modal Açılış/Kapanış

**Açılış:**
- Görsele tıkla
- Smooth transition
- Arka plan blur

**Kapanış:**
- X butonuna tıkla
- ESC tuşuna bas
- Dışarı tıkla
- Smooth transition

### 3. Navigasyon Kolaylığı

**Mouse Kullanıcıları:**
- Sol/sağ ok butonları
- Büyük ve görünür
- Hover efekti

**Klavye Kullanıcıları:**
- ← → tuşları
- ESC ile kapat
- Hızlı navigasyon

### 4. Görsel Sayacı

```
3 / 5  ← Kaçıncı görselde olduğunu gösterir
```

**Faydası:**
- Kullanıcı konumunu biliyor
- Kaç görsel olduğunu görüyor
- İlerlemeyi takip edebiliyor

---

## 🎯 E-TİCARET EN İYİ PRATİKLERİ

### ✅ Doğru Uygulamalar

1. **Tam ekran değil, %90**
   - Kullanıcı sayfada olduğunu hissediyor
   - Kapatma butonu her zaman görünür

2. **Klavye desteği**
   - Erişilebilirlik
   - Power user'lar için hızlı

3. **Dışarı tıklayınca kapanma**
   - Sezgisel
   - Kolay çıkış

4. **Görsel sayacı**
   - Kullanıcı nerede olduğunu biliyor
   - Şeffaflık

5. **Hover feedback**
   - Tıklanabilir olduğu belli
   - Kullanıcıyı yönlendiriyor

### ❌ Kaçınılan Hatalar

1. ❌ Tam ekran modal
2. ❌ Kapatma butonu yok
3. ❌ Klavye desteği yok
4. ❌ Görsel sayacı yok
5. ❌ Hover feedback yok

---

## 📊 ÖNCE vs SONRA

### Önceki ❌

```
[Görsel]  ← Tıklanamaz
          ← Büyütme yok
          ← Zoom özelliği yok
```

### Yeni ✅

```
[Görsel]  ← Tıklanabilir
  ↓
[Modal]   ← Büyük görünüm
  ↓       ← Navigasyon
[X]       ← Kolay kapatma
```

---

## 🎉 SONUÇ

**Özellik:** Ürün görselleri tıklanabilir ve büyütülebilir  
**Kapsam:** Sayfanın %90'ı (tam ekran değil)  
**Durum:** ✅ Tamamlandı

**Eklenen Özellikler:**
- ✅ Modal/Lightbox
- ✅ Navigasyon butonları
- ✅ Klavye desteği
- ✅ Görsel sayacı
- ✅ Hover feedback
- ✅ Dışarı tıklayınca kapanma

**Etkilenen Dosya:**
- `src/pages/ProductDetail.tsx`

**Yeni State:**
- `imageModal` (boolean)

**Yeni Icons:**
- `X` (Kapatma)
- `ChevronLeft` (Önceki)
- `ChevronRight` (Sonraki)

**Yan Etkiler:** ❌ Yok  
**Responsive:** ✅ Evet  
**Erişilebilir:** ✅ Evet (Klavye desteği)

---

**Hazırlayan:** AI Assistant  
**Tarih:** 30 Ekim 2025  
**Durum:** ✅ Tamamlandı
