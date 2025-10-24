import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const IgneJighead: React.FC = () => {
  const subcategories = [
    {
      name: 'Kurşunlar',
      path: '/balik-av-malzemeleri/igne-jighead/kursunlar',
      description: 'Ağırlık kurşunları, batma ağırlıkları',
      icon: '⚖️'
    },
    {
      name: 'Jighead - Zoka',
      path: '/balik-av-malzemeleri/igne-jighead/jighead-zoka',
      description: 'Ağırlıklı iğne başlıkları',
      icon: '🎣'
    },
    {
      name: 'Assist Jig İğneleri',
      path: '/balik-av-malzemeleri/igne-jighead/assist-jig-igneleri',
      description: 'Yardımcı jig iğneleri',
      icon: '🪝'
    },
    {
      name: 'Üçlü İğneler',
      path: '/balik-av-malzemeleri/igne-jighead/uclu-igneler',
      description: 'Treble hook, üçlü kancalar',
      icon: '⚓'
    },
    {
      name: 'Fırdöndü - Klips - Halkalar',
      path: '/balik-av-malzemeleri/igne-jighead/firdondu-klips-halkalar',
      description: 'Bağlantı elemanları',
      icon: '🔗'
    },
    {
      name: 'Tekli İğneler',
      path: '/balik-av-malzemeleri/igne-jighead/tekli-igneler',
      description: 'Single hook, tek kancalar',
      icon: '📌'
    },
    {
      name: 'Ofset İğneler',
      path: '/balik-av-malzemeleri/igne-jighead/ofset-igneler',
      description: 'Silikon yem için özel iğneler',
      icon: '🎯'
    }
  ];

  return (
    <>
      <Helmet>
        <title>İğne ve Jighead | EgemOutdoor - Balık Av Malzemeleri</title>
        <meta name="description" content="Kurşunlar, Jighead, Assist Jig İğneleri, Üçlü İğneler, Fırdöndü, Klips, Halkalar ve daha fazlası. Profesyonel iğne çeşitleri." />
        <meta name="keywords" content="iğne, jighead, kurşun, treble hook, ofset iğne, assist jig" />
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
            <span className="text-foreground">İğne ve Jighead</span>
          </div>

          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              İğne ve Jighead
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Profesyonel balıkçılık için geniş iğne ve jighead koleksiyonu. Kurşunlar, treble hook'lar, 
              ofset iğneler ve tüm bağlantı elemanları ile donanımınızı tamamlayın.
            </p>
          </div>

          {/* Subcategories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
            <h2 className="text-2xl font-bold text-foreground mb-4">İğne Seçimi Rehberi</h2>
            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">🪝 İğne Tipleri</h3>
                <p className="text-sm">
                  Tekli, ikili ve üçlü iğneler farklı avlanma teknikleri için tasarlanmıştır. 
                  Ofset iğneler silikon yemler için idealdir.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">⚖️ Ağırlık Seçimi</h3>
                <p className="text-sm">
                  Jighead ve kurşun ağırlığı su derinliği ve akıntı hızına göre seçilmelidir. 
                  Derin sular için daha ağır modeller tercih edin.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">🔗 Bağlantı Elemanları</h3>
                <p className="text-sm">
                  Fırdöndü, klips ve halkalar misina dolanmasını önler ve yem değişimini kolaylaştırır.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">🎯 Keskinlik</h3>
                <p className="text-sm">
                  İğne keskinliği başarılı yakalama için kritiktir. Düzenli olarak kontrol edin ve 
                  gerekirse değiştirin.
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

export default IgneJighead;
