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
        <title>EgemOutdoor - Kişiye Özel Balık Malzemeleri | Balıkçılık & Outdoor Ürünleri</title>
        <meta name="description" content="EgemOutdoor: profesyonel balık av malzemeleri, outdoor giyim ve kamp ekipmanları. Hızlı teslimat, güvenilir alışveriş." />
        <meta name="keywords" content="EgemOutdoor, balık av malzemeleri, olta kamışı, olta makinesi, outdoor giyim, kamp malzemeleri, balıkçılık" />
        <meta property="og:title" content="EgemOutdoor - Kişiye Özel Balık Malzemeleri" />
        <meta property="og:description" content="Profesyonel balık av malzemeleri ve outdoor ürünleri. Ücretsiz kargo ile hızlı teslimat!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://egemoutdoor.com" />
        <link rel="canonical" href="https://egemoutdoor.com" />
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
