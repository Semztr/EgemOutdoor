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
        <title>EgemOutdoor - Kişiye Özel Outdoor Ürünleri | Balıkçılık & Kamp Malzemeleri</title>
        <meta name="description" content="Profesyonel balık av malzemeleri, outdoor giyim ve kamp ekipmanları. Daiwa, Shimano, Penn markaları ile kişiye özel outdoor çözümleri. Ücretsiz kargo!" />
        <meta name="keywords" content="balık av malzemeleri, olta kamışı, makara, outdoor giyim, kamp malzemeleri, çakı bıçak, daiwa, shimano" />
        <meta property="og:title" content="EgemOutdoor - Kişiye Özel Outdoor Ürünleri" />
        <meta property="og:description" content="Profesyonel outdoor ürünleri ve balık av malzemeleri. Ücretsiz kargo ile hızlı teslimat!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://egemoutdoor.com" />
        <link rel="canonical" href="https://egemoutdoor.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      
      <div className="min-h-screen pt-[140px]">
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
