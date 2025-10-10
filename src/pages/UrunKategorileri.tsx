import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Fish, Shirt, Tent, Waves, CupSoda, Dumbbell } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

type Subcat = { name: string; slug: string };
type SiteCategory = {
  title: string;
  slug: string;
  icon: React.ReactNode;
  count: number;
  subcategories: Subcat[];
};

const siteCategories: SiteCategory[] = [
  {
    title: 'Balık Av Malzemeleri',
    slug: 'balik-av-malzemeleri',
    icon: <Fish className="h-5 w-5 text-primary" />,
    count: 456,
    subcategories: [
      { name: 'Olta Makineleri', slug: 'olta-makineleri' },
      { name: 'Olta Kamışları', slug: 'olta-kamislari' },
      { name: 'Suni Yemler', slug: 'suni-yemler' },
      { name: 'Misineler', slug: 'misineler' },
      { name: 'İğne ve Jighead', slug: 'igne-jighead' },
      { name: 'Aksesuarlar', slug: 'aksesuarlar' },
      { name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    title: 'Outdoor Giyim',
    slug: 'outdoor-giyim',
    icon: <Shirt className="h-5 w-5 text-primary" />,
    count: 312,
    subcategories: [
      { name: 'Erkek: Pantolon', slug: 'erkek/pantolon' },
      { name: 'Erkek: Mont & Ceket', slug: 'erkek/mont-ve-ceket' },
      { name: 'Erkek: Ayakkabı & Bot', slug: 'erkek/ayakkabi' },
      { name: 'Kadın: Tişört', slug: 'kadin/tisort' },
      { name: 'Kadın: Ayakkabı & Bot', slug: 'kadin/ayakkabi' },
      { name: 'Aksesuar: Çanta, Şapka, Bere', slug: 'aksesuar' },
    ],
  },
  {
    title: 'Kamp Malzemeleri',
    slug: 'kamp-malzemeleri',
    icon: <Tent className="h-5 w-5 text-primary" />,
    count: 289,
    subcategories: [
      { name: 'Pişirme: Kamp Ocağı, Kartuş, Pürmüz', slug: 'pisirme' },
      { name: 'Barınma & Uyku: Çadır, Uyku Tulumu', slug: 'barinma-uyku' },
      { name: 'Aksesuar: Çanta, Aydınlatma, Kafa Lambası', slug: 'aksesuar' },
    ],
  },
  {
    title: 'Dalış Ürünleri',
    slug: 'dalis-urunleri',
    icon: <Waves className="h-5 w-5 text-primary" />,
    count: 167,
    subcategories: [
      { name: 'Denge Yeleği (BCD), Regülatör', slug: 'ekipman' },
      { name: 'Elbise, Patik & Eldiven & Başlık', slug: 'giyim-parca' },
      { name: 'Zıpkın, Palet, Maske & Şnorkel', slug: 'av-aksesuar' },
    ],
  },
  {
    title: 'Termoslar ve Mataralar',
    slug: 'termoslar-ve-mataralar',
    icon: <CupSoda className="h-5 w-5 text-primary" />,
    count: 98,
    subcategories: [
      { name: 'Termoslar', slug: 'termoslar' },
      { name: 'Mataralar', slug: 'mataralar' },
      { name: 'Yedek Parça & Aksesuar', slug: 'aksesuar' },
    ],
  },
  {
    title: 'Spor Malzemeleri',
    slug: 'spor-malzemeleri',
    icon: <Dumbbell className="h-5 w-5 text-primary" />,
    count: 120,
    subcategories: [
      { name: 'Toplar', slug: 'toplar' },
      { name: 'Fitness Bantları', slug: 'fitness-bantlari' },
      { name: 'Saha Ekipmanları', slug: 'saha-ekipmanlari' },
    ],
  },
];

const specialCategories = [
  { title: 'Yeni Gelenler', slug: 'yeni-gelenler', icon: '🆕', count: 64 },
  { title: 'Çok Satanlar', slug: 'cok-satanlar', icon: '🔥', count: 120 },
  { title: 'İndirimdekiler', slug: 'indirim', icon: '🏷️', count: 210 },
];

const UrunKategorileri = () => {
  return (
    <>
      <Helmet>
        <title>Ürün Kategorileri | EgemOutdoor</title>
        <meta name="description" content="EgemOutdoor'da balık av malzemeleri, outdoor giyim, kamp ve dalış ekipmanları, termos-mataralar ve spor malzemeleri. Tüm kategorileri keşfedin." />
        <meta name="keywords" content="egem outdoor, ürün kategorileri, balık av malzemeleri, outdoor giyim, kamp malzemeleri, dalış ürünleri, termos, matara, spor malzemeleri" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-4">Ürün Kategorileri</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sitemizde yer alan güncel kategorileri keşfedin ve ihtiyacınız olan ürüne hızlıca ulaşın.
            </p>
          </div>

          {/* Ana Kategoriler */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Ana Kategoriler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteCategories.map((category, index) => (
                <Link key={category.slug} to={`/${category.slug}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <Card className="transition-smooth border-border bg-card hover:shadow-lg hover:ring-1 hover:ring-primary/30 animate-fade-in rounded-2xl" style={{ animationDelay: `${index * 80}ms` }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>{category.icon}</div>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                        </div>
                        <Badge variant="secondary">{category.count}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {category.subcategories.slice(0, 3).map((sub, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{sub.name}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          </div>
                        ))}
                        {category.subcategories.length > 3 && (
                          <div className="text-xs text-primary font-medium">+{category.subcategories.length - 3} daha fazla</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Özel Kategoriler */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-8">Özel Kategoriler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialCategories.map((category, index) => (
                <Link key={category.slug} to={`/kategori/${category.slug}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <Card className="transition-smooth border-border bg-card hover:shadow-lg hover:ring-1 hover:ring-primary/30 animate-fade-in rounded-2xl" style={{ animationDelay: `${(index + siteCategories.length) * 80}ms` }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{category.icon}</div>
                          <div>
                            <h3 className="font-semibold text-foreground">{category.title}</h3>
                            <p className="text-sm text-muted-foreground">{category.count} ürün</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default UrunKategorileri;