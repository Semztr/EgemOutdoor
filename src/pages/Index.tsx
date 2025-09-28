import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero'; 
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandShowcase from '@/components/BrandShowcase';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>BalıkPro - Kişiye Özel Balık Malzemeleri | Balıkçılık & Outdoor Ürünleri</title>
        <meta name="description" content="Profesyonel balık av malzemeleri, outdoor giyim ve kamp ekipmanları. Daiwa, Shimano, Penn markaları ile kişiye özel balıkçılık çözümleri. Ücretsiz kargo!" />
        <meta name="keywords" content="balık av malzemeleri, olta kamışı, makara, outdoor giyim, kamp malzemeleri, balıkçılık, daiwa, shimano" />
        <meta property="og:title" content="BalıkPro - Kişiye Özel Balık Malzemeleri" />
        <meta property="og:description" content="Profesyonel balık av malzemeleri ve outdoor ürünleri. Ücretsiz kargo ile hızlı teslimat!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://balikpro.com" />
        <link rel="canonical" href="https://balikpro.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <FeaturedProducts />
          <BrandShowcase />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
