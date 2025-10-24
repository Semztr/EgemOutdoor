import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const Misineler: React.FC = () => {
  const subcategories = [
    {
      name: 'Monofilament Misineler',
      path: '/balik-av-malzemeleri/misineler/monofilament',
      description: 'Tek tel misina, genel kullanım için ideal',
      icon: '🧵'
    },
    {
      name: 'Fluorocarbon Misineler',
      path: '/balik-av-malzemeleri/misineler/fluorocarbon',
      description: 'Suda görünmez, hassas balıkçılık için',
      icon: '💎'
    },
    {
      name: 'İp - Örgü Misineler',
      path: '/balik-av-malzemeleri/misineler/ip-orgu',
      description: 'Yüksek dayanıklılık, sıfır esneme',
      icon: '🪢'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Misineler | EgemOutdoor - Balık Av Malzemeleri</title>
        <meta name="description" content="Monofilament, Fluorocarbon ve İp-Örgü misinaları. Profesyonel balıkçılık için kaliteli misina çeşitleri." />
        <meta name="keywords" content="misina, monofilament, fluorocarbon, ip örgü, balık misinası" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link to="/balik-av-malzemeleri" className="hover:text-primary">Balık Av Malzemeleri</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Misineler</span>
          </div>

          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Misineler
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Profesyonel balıkçılar için geniş misina koleksiyonu. Monofilament, fluorocarbon ve 
              ip-örgü misinalar ile her avlanma koşuluna uygun seçenekler.
            </p>
          </div>

          {/* Subcategories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {subcategories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-4">{category.icon}</div>
                    <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-12 p-6 bg-muted/30 rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">Misina Seçimi Rehberi</h2>
            <div className="grid md:grid-cols-3 gap-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">🧵 Monofilament</h3>
                <p className="text-sm">
                  Genel kullanım için ideal. Esnek yapısı ve uygun fiyatı ile başlangıç seviyesi için mükemmel.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">💎 Fluorocarbon</h3>
                <p className="text-sm">
                  Suda neredeyse görünmez. Hassas balıklar için en iyi seçim. Yüksek aşınma direnci.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">🪢 İp - Örgü</h3>
                <p className="text-sm">
                  Sıfır esneme, maksimum hassasiyet. Uzun mesafe atışlar ve derin su avlanması için ideal.
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Misineler;
