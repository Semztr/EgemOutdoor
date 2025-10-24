import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const SuniYemler: React.FC = () => {
  const subcategories = [
    {
      name: 'Su Üstü Maketler',
      path: '/balik-av-malzemeleri/su-ustu-maketler',
      description: 'Yüzey balıkçılığı için ideal maketler',
      icon: '🎣'
    },
    {
      name: 'Kaşık Yemler',
      path: '/balik-av-malzemeleri/kasik-yemler',
      description: 'Döner kaşık yemler',
      icon: '🥄'
    },
    {
      name: 'Silikon Yemler',
      path: '/balik-av-malzemeleri/suni-yemler/silikon-yemler',
      description: 'Yumuşak silikon yemler',
      icon: '🐟'
    },
    {
      name: 'Jig Yemler',
      path: '/balik-av-malzemeleri/suni-yemler/jig-yemler',
      description: 'Ağırlıklı jig yemler',
      icon: '⚓'
    },
    {
      name: 'Kaşıklar ve Vibrasyonlar',
      path: '/balik-av-malzemeleri/suni-yemler/kasiklar-ve-vibrasyonlar',
      description: 'Titreşimli yemler',
      icon: '💫'
    },
    {
      name: 'Zokalar',
      path: '/balik-av-malzemeleri/suni-yemler/zokalar',
      description: 'Derin su zokaları',
      icon: '🎯'
    },
    {
      name: 'Meppsler',
      path: '/balik-av-malzemeleri/suni-yemler/meppsler',
      description: 'Döner kanat yemler',
      icon: '🌀'
    },
    {
      name: 'Sazan Yemleri',
      path: '/balik-av-malzemeleri/suni-yemler/sazan-yemleri',
      description: 'Sazan balığı için özel yemler',
      icon: '🐠'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Suni Yemler | EgemOutdoor - Balık Av Malzemeleri</title>
        <meta name="description" content="Silikon yemler, jig yemler, kaşık yemler, zokalar ve daha fazlası. Profesyonel suni yem çeşitleri." />
        <meta name="keywords" content="suni yem, silikon yem, jig, kaşık yem, zoka, mepps, balık yemi" />
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
            <span className="text-foreground">Suni Yemler</span>
          </div>

          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Suni Yemler
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Profesyonel balıkçılar için geniş suni yem koleksiyonu. Silikon yemler, jig yemler, 
              kaşık yemler, zokalar ve daha fazlası ile başarılı avlar için her şey burada.
            </p>
          </div>

          {/* Subcategories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
            <h2 className="text-2xl font-bold text-foreground mb-4">Suni Yem Seçimi</h2>
            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">🎣 Su Üstü Yemler</h3>
                <p className="text-sm">
                  Yüzeyde avlanan balıklar için ideal. Maketler ve kaşık yemler ile etkili sonuçlar alın.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">⚓ Derin Su Yemleri</h3>
                <p className="text-sm">
                  Jig yemler ve zokalar ile derin sularda avlanın. Ağırlıklı tasarımlar ile hızlı batış.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">🐟 Silikon Yemler</h3>
                <p className="text-sm">
                  Gerçekçi hareket ve görünüm. Yumuşak doku ile balıkları cezbeder.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">💫 Titreşimli Yemler</h3>
                <p className="text-sm">
                  Kaşıklar ve vibrasyonlar ile suda titreşim yaratın. Uzaktan balık çekin.
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

export default SuniYemler;
