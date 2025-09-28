import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Package } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const UrunKategorileri = () => {
  const categories = [
    {
      title: "GİYİM",
      slug: "giyim",
      icon: "👕",
      count: 145,
      subcategories: [
        { name: "Balık Av Giyim", slug: "balik-av-giyim" },
        { name: "Outdoor Ceketler", slug: "outdoor-ceketler" },
        { name: "Yağmurluk", slug: "yagmurluk" },
        { name: "Pantolon", slug: "pantolon" }
      ]
    },
    {
      title: "AYAKKABI",
      slug: "ayakkabi",
      icon: "👟",
      count: 89,
      subcategories: [
        { name: "Balık Av Botları", slug: "balik-av-botlari" },
        { name: "Wader", slug: "wader" },
        { name: "Outdoor Ayakkabı", slug: "outdoor-ayakkabi" }
      ]
    },
    {
      title: "SAAT · GÖZLÜK",
      slug: "saat-gozluk",
      icon: "⌚",
      count: 76,
      subcategories: [
        { name: "Outdoor Saatler", slug: "outdoor-saatler" },
        { name: "Güneş Gözlüğü", slug: "gunes-gozlugu" },
        { name: "Polarize Gözlük", slug: "polarize-gozluk" }
      ]
    },
    {
      title: "OUTDOOR YAŞAM",
      slug: "outdoor-yasam",
      icon: "🏔️",
      count: 234,
      subcategories: [
        { name: "Çanta & Sırt Çantası", slug: "canta-sirt-cantasi" },
        { name: "Thermos & Matara", slug: "thermos-matara" },
        { name: "Survival Ekipmanları", slug: "survival-ekipmanlari" }
      ]
    },
    {
      title: "FENER & AYDINLATMA",
      slug: "fener-aydinlatma",
      icon: "🔦",
      count: 112,
      subcategories: [
        { name: "El Fenerleri", slug: "el-fenerleri" },
        { name: "Kafa Lambaları", slug: "kafa-lambalari" },
        { name: "Şarjlı Fenerler", slug: "sarjli-fenerler" }
      ]
    },
    {
      title: "DÜRBÜN & TELESKOP",
      slug: "durbun-teleskop",
      icon: "🔭",
      count: 45,
      subcategories: [
        { name: "Avcılık Dürbünü", slug: "avcilik-durbunu" },
        { name: "Teleskop", slug: "teleskop" },
        { name: "Gece Görüş", slug: "gece-gorus" }
      ]
    },
    {
      title: "DAĞCILIK & TIRMANIŞ",
      slug: "dagcilik-tirmanis",
      icon: "⛰️",
      count: 178,
      subcategories: [
        { name: "Tırmanış Ekipmanları", slug: "tirmanis-ekipmanlari" },
        { name: "Dağcılık Gereçleri", slug: "dagcilik-gerecleri" },
        { name: "İp & Halat", slug: "ip-halat" }
      ]
    },
    {
      title: "KAYAK & SNOWBOARD",
      slug: "kayak-snowboard",
      icon: "🎿",
      count: 95,
      subcategories: [
        { name: "Kayak Takımları", slug: "kayak-takimlari" },
        { name: "Snowboard", slug: "snowboard" },
        { name: "Kış Sporları", slug: "kis-sporlari" }
      ]
    },
    {
      title: "BALIK AV",
      slug: "balik-av",
      icon: "🎣",
      count: 456,
      subcategories: [
        { name: "Olta Kamışı", slug: "olta-kamisi" },
        { name: "Makara", slug: "makara" },
        { name: "Yem & Oltalar", slug: "yem-oltalar" },
        { name: "Balık Çantaları", slug: "balik-cantalari" }
      ]
    },
    {
      title: "SCUBA & DALIŞ ÜRÜNLERİ",
      slug: "scuba-dalis",
      icon: "🤿",
      count: 67,
      subcategories: [
        { name: "Dalış Maskesi", slug: "dalis-maskesi" },
        { name: "Şnorkel", slug: "snorkel" },
        { name: "Dalış Kıyafeti", slug: "dalis-kiyafeti" }
      ]
    },
    {
      title: "DENİZ & HAVUZ ÜRÜNLERİ",
      slug: "deniz-havuz",
      icon: "🏊",
      count: 123,
      subcategories: [
        { name: "Deniz Sporları", slug: "deniz-sporlari" },
        { name: "Havuz Aksesuarları", slug: "havuz-aksesuarlari" },
        { name: "Plaj Gereçleri", slug: "plaj-gerecleri" }
      ]
    },
    {
      title: "TEKNE & YAT",
      slug: "tekne-yat",
      icon: "⛵",
      count: 89,
      subcategories: [
        { name: "Tekne Aksesuarları", slug: "tekne-aksesuarlari" },
        { name: "Yelken Ekipmanları", slug: "yelken-ekipmanlari" },
        { name: "Motor Yedek Parça", slug: "motor-yedek-parca" }
      ]
    },
    {
      title: "ATICILIK & AIRSOFT",
      slug: "aticilik-airsoft",
      icon: "🎯",
      count: 134,
      subcategories: [
        { name: "Airsoft Silahlar", slug: "airsoft-silahlar" },
        { name: "Atış Aksesuarları", slug: "atis-aksesuarlari" },
        { name: "Hedef Sistemleri", slug: "hedef-sistemleri" }
      ]
    },
    {
      title: "KARAVAN",
      slug: "karavan",
      icon: "🚐",
      count: 78,
      subcategories: [
        { name: "Karavan Ekipmanları", slug: "karavan-ekipmanlari" },
        { name: "Mobilya & Aksesuar", slug: "mobilya-aksesuar" },
        { name: "Elektrik & Aydınlatma", slug: "elektrik-aydinlatma" }
      ]
    }
  ];

  const specialCategories = [
    { title: "OUTLET ÜRÜNLER", slug: "outlet", icon: "🏷️", count: 234 },
    { title: "STOCKOUT", slug: "stockout", icon: "📦", count: 156 },
    { title: "BIG&BOLD", slug: "big-bold", icon: "💪", count: 89 },
    { title: "LIFESTYLE", slug: "lifestyle", icon: "✨", count: 123 },
    { title: "KOMBİNLER", slug: "kombinler", icon: "👔", count: 67 },
    { title: "EN YENİ ÜRÜNLER", slug: "en-yeni", icon: "🆕", count: 178 }
  ];

  return (
    <>
      <Helmet>
        <title>Ürün Kategorileri | BalıkPro - Balıkçılık & Outdoor Ürün Kategorileri</title>
        <meta name="description" content="BalıkPro'da balık av malzemeleri, outdoor giyim, kamp ekipmanları ve daha fazlası. Tüm kategorileri keşfedin ve ihtiyacınız olan ürünleri bulun." />
        <meta name="keywords" content="ürün kategorileri, balık av malzemeleri, outdoor giyim, kamp malzemeleri, dağcılık, dalış, tekne" />
        <link rel="canonical" href="https://balikpro.com/urun-kategorileri" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-4">Ürün Kategorileri</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Outdoor yaşam ve balıkçılıkla ilgili ihtiyacınız olan tüm ürünleri kategoriler halinde keşfedin.
            </p>
          </div>

        {/* Ana Kategoriler */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Ana Kategoriler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link key={category.slug} to={`/kategori/${category.slug}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Card className="hover-scale transition-smooth border-border bg-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{category.icon}</div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                      </div>
                      <Badge variant="secondary">{category.count}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.subcategories.slice(0, 3).map((sub, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{sub.name}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        </div>
                      ))}
                      {category.subcategories.length > 3 && (
                        <div className="text-xs text-primary font-medium">
                          +{category.subcategories.length - 3} daha fazla
                        </div>
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
                <Card className="hover-scale transition-smooth border-border bg-card animate-fade-in" style={{ animationDelay: `${(index + categories.length) * 100}ms` }}>
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