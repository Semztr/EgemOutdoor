import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Target, Users, TrendingUp } from 'lucide-react';

const About = () => {
  return (
    <>
      <Helmet>
        <title>Hakkımızda - EgemOutdoor</title>
        <meta name="description" content="EgemOutdoor hakkında bilgi edinin. Misyonumuz, vizyonumuz ve değerlerimiz." />
        <meta name="keywords" content="hakkımızda, egem outdoor, outdoor mağaza, balıkçılık mağazası" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Hakkımızda</h1>
                <p className="text-xl">
                  Doğa tutkunları için en kaliteli outdoor ve balıkçılık ekipmanlarını sunuyoruz.
                </p>
              </div>
            </div>
          </section>

          {/* Hikayemiz */}
          <section className="py-16 container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center animate-fade-in">Hikayemiz</h2>
              <div className="prose max-w-none text-muted-foreground animate-fade-in">
                <p className="mb-4">
                  EgemOutdoor, 2024 yılında İzmir'de kurulan, outdoor ve balıkçılık tutkunlarına hizmet veren bir e-ticaret platformudur. 
                  Doğa severlerin ihtiyaçlarını karşılamak amacıyla yola çıktık ve bugün Türkiye'nin önde gelen outdoor ekipman 
                  tedarikçilerinden biri olmayı hedefliyoruz.
                </p>
                <p className="mb-4">
                  Kaliteli ürünler, güvenilir hizmet ve rekabetçi fiyatlarla müşterilerimizin her zaman yanındayız. 
                  Daiwa, Shimano, Penn gibi dünya çapında tanınmış markaların resmi distribütörüyüz.
                </p>
                <p>
                  Vizyonumuz, Türkiye'deki tüm outdoor ve balıkçılık tutkunlarının ilk tercihi olmak ve onlara 
                  en iyi alışveriş deneyimini sunmaktır.
                </p>
              </div>
            </div>
          </section>

          {/* Değerlerimiz */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center animate-fade-in">Değerlerimiz</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="animate-fade-in hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Kalite</h3>
                    <p className="text-sm text-muted-foreground">
                      Sadece en kaliteli ve güvenilir ürünleri sunuyoruz.
                    </p>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Müşteri Memnuniyeti</h3>
                    <p className="text-sm text-muted-foreground">
                      Müşterilerimizin memnuniyeti bizim önceliğimizdir.
                    </p>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">Güvenilirlik</h3>
                    <p className="text-sm text-muted-foreground">
                      Sözümüzün arkasında durur, taahhütlerimizi yerine getiririz.
                    </p>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">İnovasyon</h3>
                    <p className="text-sm text-muted-foreground">
                      Sürekli gelişim ve yenilik peşinde koşuyoruz.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* İstatistikler */}
          <section className="py-16 container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="animate-fade-in">
                <p className="text-4xl font-bold text-primary mb-2">10,000+</p>
                <p className="text-muted-foreground">Mutlu Müşteri</p>
              </div>
              <div className="animate-fade-in">
                <p className="text-4xl font-bold text-primary mb-2">5,000+</p>
                <p className="text-muted-foreground">Ürün Çeşidi</p>
              </div>
              <div className="animate-fade-in">
                <p className="text-4xl font-bold text-primary mb-2">50+</p>
                <p className="text-muted-foreground">Marka</p>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default About;