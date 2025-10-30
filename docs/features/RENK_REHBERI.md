# 🎨 RENK KULLANIM REHBERİ

## 📋 DESTEKLENEN RENKLER

Admin panelinde aşağıdaki renk isimlerini kullanabilirsiniz:

### **Temel Renkler:**
| Türkçe | İngilizce | Görünüm |
|--------|-----------|---------|
| Siyah | Black | ⬛ |
| Beyaz | White | ⬜ |
| Kırmızı | Red | 🟥 |
| Mavi | Blue | 🟦 |
| Yeşil | Green | 🟩 |
| Sarı | Yellow | 🟨 |
| Turuncu | Orange | 🟧 |
| Mor | Purple | 🟪 |
| Pembe | Pink | 🩷 |
| Gri | Gray | ◼️ |

### **Özel Renkler:**
| Türkçe | İngilizce | Görünüm |
|--------|-----------|---------|
| Kahverengi | Brown | 🟫 |
| Lacivert | Navy | 🔷 |
| Kamuflaj | Camo | 🌿 |
| Haki | Khaki | 🏜️ |

---

## 💡 KULLANIM ÖRNEKLERİ

### **Admin Panelinde:**

#### Renk Varyantları Alanı:
```
Siyah, Yeşil, Kamuflaj, Turuncu
```

#### Mevcut Renkler Alanı:
```
Kırmızı, Mavi, Beyaz
```

---

## 🎯 NASIL ÇALIŞIR?

1. **Admin panelinde renk ismi yazarsınız:**
   - Örnek: "Yeşil, Siyah, Kamuflaj"

2. **Sistem otomatik renk koduna çevirir:**
   - Yeşil → #16A34A (yeşil)
   - Siyah → #000000 (siyah)
   - Kamuflaj → #4B5320 (koyu yeşil)

3. **Ürün sayfasında renkli butonlar görünür:**
   ```
   [🟢 Yeşil] [⬛ Siyah] [🌿 Kamuflaj]
   ```

---

## ⚠️ ÖNEMLİ NOTLAR

### **Büyük/Küçük Harf:**
- Hem "Yeşil" hem "yeşil" çalışır
- Hem "Siyah" hem "BLACK" çalışır

### **Virgülle Ayırma:**
```
✅ Doğru: Siyah, Yeşil, Mavi
❌ Yanlış: Siyah Yeşil Mavi
```

### **Bilinmeyen Renkler:**
- Listede olmayan bir renk yazarsanız → Gri olarak gösterilir
- Örnek: "Altın" → Gri (#6B7280)

---

## 🔧 YENİ RENK EKLEMEK

Eğer listede olmayan bir renk eklemek isterseniz:

1. `ProductDetail.tsx` dosyasını açın
2. `colorMap` objesine yeni renk ekleyin:

```typescript
const colorMap: Record<string, string> = {
  // ... mevcut renkler
  'Altın': '#FFD700',
  'Gümüş': '#C0C0C0',
  'Bronz': '#CD7F32',
};
```

---

## 📸 ÖRNEK GÖRÜNÜM

### **Ürün Detay Sayfasında:**

```
┌─────────────────────────────────┐
│ Renk Seçenekleri:               │
│                                 │
│ [🟢 Yeşil] [⬛ Siyah] [🟧 Turuncu] │
│                                 │
│ Seçili: Yeşil                   │
└─────────────────────────────────┘
```

### **Admin Panelinde:**

```
┌─────────────────────────────────┐
│ 🎨 Renk Seçenekleri             │
├─────────────────────────────────┤
│ Renk Varyantları:               │
│ [Siyah, Yeşil, Kamuflaj]       │
│                                 │
│ Müşterinin seçebileceği renkler│
└─────────────────────────────────┘
```

---

## ✅ TEST

**Kontrol Listesi:**
1. ✅ Admin panelinde "Yeşil, Siyah, Mavi" yazın
2. ✅ Ürünü kaydedin
3. ✅ Ürün detay sayfasını açın
4. ✅ Renk butonlarının doğru renkte göründüğünü kontrol edin

---

## 🆘 SORUN GİDERME

### **Tüm renkler siyah görünüyor:**
- ✅ Düzeltildi! Artık renk mapping çalışıyor

### **Renk seçenekleri görünmüyor:**
- Admin panelinde "Renk Varyantları" alanını doldurduğunuzdan emin olun
- Virgülle ayırdığınızdan emin olun

### **Yeni renk eklediğim halde görünmüyor:**
- Tarayıcı cache'ini temizleyin (Ctrl+F5)
- Renk ismini tam olarak yazdığınızdan emin olun

---

**Son Güncelleme:** 28 Ekim 2025
**Versiyon:** 2.0.0
