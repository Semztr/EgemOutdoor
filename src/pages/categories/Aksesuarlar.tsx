import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const Aksesuarlar: React.FC = () => {
  const subcategories = [
    {
      name: 'Çizmeler - Tulum',
      path: '/balik-av-malzemeleri/aksesuarlar/cizmeler-ve-tulum-cizmeler',
      description: 'Su geçirmez çizmeler ve tulumlar',
      icon: '🥾'
    },
    {
      name: 'Şamandıra ve Stopler',
      path: '/balik-av-malzemeleri/aksesuarlar/samandira-ve-stopler',
      description: 'Yüzer şamandıralar ve misina stopleri',
      icon: '🎈'
    },
    {
      name: 'Fenerler',
      path: '/balik-av-malzemeleri/aksesuarlar/fenerler',
      description: 'Kafa lambaları ve el fenerleri',
      icon: '🔦'
    },
    {
      name: 'Pense - Gripper - Makas',
      path: '/balik-av-malzemeleri/aksesuarlar/pense-gripper-makas',
      description: 'İğne çıkarıcı ve kesici aletler',
      icon: '✂️'
    },
    {
      name: 'Kepçe - Livar - Kakıç - Tripod',
      path: '/balik-av-malzemeleri/aksesuarlar/kepce-livar-kakic-tripod',
      description: 'Balık yakalama ve taşıma ekipmanları',
      icon: '🪣'
    },
    {
      name: 'Şişme Yataklar',
      path: '/balik-av-malzemeleri/aksesuarlar/sisme-yataklar',
      description: 'Balık koruma ve taşıma yatakları',
      icon: '🛏️'
    },
    {
      name: 'Alarm - Zil - Fosfor - Boncuk',
      path: '/balik-av-malzemeleri/aksesuarlar/alarm-zil-fosfor-boncuk',
      description: 'Olta alarmları ve fosforlu aksesuarlar',
      icon: '🔔'
    },
    {
      name: 'Gözlükler',
      path: '/balik-av-malzemeleri/aksesuarlar/gozlukler',
      description: 'Polarize balıkçı gözlükleri',
      icon: '🕶️'
    },
    {
      name: 'Diğerleri',
      path: '/balik-av-malzemeleri/aksesuarlar/digerleri',
      description: 'Çeşitli balıkçılık aksesuarları',
      icon: '🎒'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Aksesuarlar | EgemOutdoor - Balık Av Malzemeleri</title>
        <meta name="description" content="Balık avı aksesuarları: Çizmeler, Şamandıra, Fenerler, Pense, Gripper, Makas, Kepçe, Livar, Şişme Yataklar, Alarm, Gözlükler ve daha fazlası." />
        <meta name="keywords" content="balıkçılık aksesuarları, çizme, fener, pense, gripper, kepçe, livar, alarm" />
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
            <span className="text-foreground">Aksesuarlar</span>
          </div>

          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Balıkçılık Aksesuarları
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Profesyonel balıkçılık için gerekli tüm aksesuarlar. Çizmeler, fenerler, pense, gripper, 
              kepçe, livar ve daha fazlası ile donanımınızı tamamlayın.
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
            <h2 className="text-2xl font-bold text-foreground mb-4">Aksesuar Seçimi Rehberi</h2>
            <div className="grid md:grid-cols-3 gap-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">🥾 Koruyucu Ekipman</h3>
                <p className="text-sm">
                  Su geçirmez çizmeler ve tulumlar ile her hava koşulunda konforlu avlanın. 
                  Güvenlik ve konfor için vazgeçilmez.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">🔦 Aydınlatma</h3>
                <p className="text-sm">
                  Gece avlanması için kafa lambaları ve el fenerleri. Eller serbest kalır, 
                  güvenli çalışma sağlar.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">✂️ Aletler</h3>
                <p className="text-sm">
                  Pense, gripper ve makas ile iğne çıkarma ve misina kesme işlemlerini 
                  kolayca yapın.
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

export default Aksesuarlar;
