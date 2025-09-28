import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Sayfa Bulunamadı - 404 | BalıkPro</title>
        <meta name="description" content="Aradığınız sayfa bulunamadı. BalıkPro ana sayfasına dönün ve ürünlerimizi keşfetmeye devam edin." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://balikpro.com/404" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto text-center animate-fade-in">
              <div className="text-8xl mb-6">🎣</div>
              <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Sayfa Bulunamadı</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Üzgünüz, aradığınız sayfa mevcut değil. Belki de balık kaçtı! 🐟
              </p>
              
              <div className="space-y-4">
                <Button asChild size="lg" className="w-full hover-scale">
                  <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <Home className="h-5 w-5 mr-2" />
                    Ana Sayfaya Dön
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="w-full hover-scale">
                  <Link to="/urunler" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Ürünleri İncele
                  </Link>
                </Button>
              </div>
              
              <div className="mt-8 text-sm text-muted-foreground">
                <p>Yardıma mı ihtiyacınız var?</p>
                <p className="mt-1">
                  <Link to="/iletisim" className="text-primary hover:underline">
                    Bizimle iletişime geçin
                  </Link> veya 
                  <Link to="/blog" className="text-primary hover:underline ml-1">
                    blog'umuzu ziyaret edin
                  </Link>
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

export default NotFound;
