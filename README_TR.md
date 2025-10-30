# 🏕️ EgemOutdoor - E-Ticaret Platformu

Modern, performanslı ve güvenli bir outdoor ürünleri e-ticaret platformu.

## 🚀 Özellikler

### ✅ Kullanıcı Özellikleri
- 🔐 Güvenli kullanıcı girişi ve kaydı (Supabase Auth)
- 🛒 Gelişmiş sepet sistemi (LocalStorage persist)
- ❤️ Favori ürünler
- 🔍 Gelişmiş arama ve filtreleme
- 📱 Responsive tasarım (mobil uyumlu)
- 🎨 Modern ve kullanıcı dostu arayüz
- 💳 Çoklu ödeme seçenekleri (Kredi Kartı, Havale/EFT, Kapıda Ödeme)
- 📦 Sipariş takibi
- 👤 Kullanıcı profil yönetimi

### 🛠️ Admin Özellikleri
- 📊 Kapsamlı admin paneli
- 📦 Ürün yönetimi (CRUD)
- 🏷️ Kategori yönetimi
- 📋 Sipariş yönetimi
- 👥 Kullanıcı yönetimi
- 🖼️ Çoklu görsel yükleme
- 🎨 Renk bazlı görsel sistemi
- 🏷️ Rozet sistemi (Yeni, Popüler, İndirimli, vb.)

### 🔧 Teknik Özellikler
- ⚡ Vite ile hızlı build
- 🎯 TypeScript (Strict mode)
- 🎨 TailwindCSS + shadcn/ui
- 🔄 React Query (data fetching)
- 🗄️ Supabase (Backend-as-a-Service)
- 🚦 Error Boundary
- 📈 Performance optimizasyonları
- 🔒 Input validation
- 🌐 SEO optimizasyonu
- 📊 Analytics hazır (Google Analytics 4)

## 📋 Teknoloji Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI:** TailwindCSS, shadcn/ui, Radix UI
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **State Management:** Context API, React Query
- **Routing:** React Router v6
- **Form Validation:** Zod
- **Notifications:** Sonner
- **SEO:** React Helmet Async

## 🏗️ Proje Yapısı

```
tackle-treasures/
├── public/              # Static dosyalar
│   ├── robots.txt      # SEO robots
│   └── sitemap.xml     # SEO sitemap
├── src/
│   ├── components/     # React bileşenleri
│   │   ├── ui/        # shadcn/ui bileşenleri
│   │   └── ...        # Özel bileşenler
│   ├── contexts/      # React Context'ler
│   ├── hooks/         # Custom hooks
│   ├── integrations/  # Supabase entegrasyonu
│   ├── lib/          # Utility fonksiyonlar
│   │   ├── analytics.ts      # Google Analytics
│   │   ├── constants.ts      # Sabitler
│   │   ├── env.ts           # Environment variables
│   │   ├── error-handler.ts # Error handling
│   │   ├── performance.ts   # Performance utilities
│   │   ├── sitemap.ts       # Sitemap generator
│   │   └── validation.ts    # Input validation
│   ├── pages/        # Sayfa bileşenleri
│   └── App.tsx       # Ana uygulama
├── supabase/         # Supabase migrations
└── package.json
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 22.x
- npm veya yarn
- Supabase hesabı

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd tackle-treasures
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment variables ayarlayın**
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPER_ADMIN_IDS=comma_separated_user_ids
```

4. **Supabase migrations'ı çalıştırın**
- Supabase Dashboard > SQL Editor'de migrations klasöründeki SQL dosyalarını sırayla çalıştırın

5. **Development server'ı başlatın**
```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## 📦 Build

Production build oluşturmak için:
```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşacaktır.

Preview:
```bash
npm run preview
```

## 🔐 Admin Paneli

Admin paneline erişim için:
1. Kullanıcı kaydı yapın
2. Kullanıcı ID'nizi `.env` dosyasındaki `VITE_SUPER_ADMIN_IDS` değişkenine ekleyin
3. `/admin` sayfasına gidin

## 📊 Proje Durumu

- ✅ Frontend & UI: %100
- ✅ Backend & Database: %100
- ✅ Ürün Yönetimi: %100
- ✅ Kullanıcı Sistemi: %100
- ✅ Admin Panel: %100
- ✅ Sepet & Checkout: %90 (Kredi kartı entegrasyonu eksik)
- ✅ Error Handling: %100
- ✅ Performance: %100
- ✅ SEO: %100
- ✅ Security: %100

**Genel Tamamlanma: %95**

## 🔜 Yakında Gelecek Özellikler

- 💳 İyzico kredi kartı entegrasyonu
- 📧 E-posta bildirimleri (Resend)
- ⭐ Ürün yorumları ve değerlendirme
- 🎟️ Kupon/indirim sistemi
- 🔍 Gelişmiş arama (PostgreSQL Full-Text Search)
- 📱 Mobil uygulama (React Native)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje özel bir projedir.

## 📞 İletişim

- Website: https://egemoutdoor.com
- Email: info@egemoutdoor.com

## 🙏 Teşekkürler

- [Lovable](https://lovable.dev) - Development platform
- [Supabase](https://supabase.com) - Backend
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [TailwindCSS](https://tailwindcss.com) - CSS framework
