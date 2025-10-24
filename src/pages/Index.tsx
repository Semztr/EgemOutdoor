import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustBadges from '@/components/TrustBadges';
import CategoryCards from '@/components/CategoryCards';
import ProductShowcase from '@/components/ProductShowcase';
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
          <TrustBadges />
          <CategoryCards />
          <ProductShowcase />
          <BrandShowcase />
        </main>
        {/* Floating WhatsApp button */}
        <a
          href="https://wa.me/905336407758"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp ile iletişim kur"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#1ebe59] transition-colors w-14 h-14 flex items-center justify-center ring-2 ring-white"
        >
          {/* WhatsApp SVG icon (clean) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7 text-white"
            aria-hidden="true"
          >
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 1 1 4.205 4.207L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.591 5.47 0 9.94-4.47 9.94-9.94S17.516 1.904 12.046 1.904 2.106 6.373 2.106 11.844c0 2.137.61 3.767 1.636 5.438l-.997 3.648 3.909-1.737zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.253-.462-2.386-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.52-.074-.149-.669-1.612-.916-2.206-.242-.58-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.793.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
          </svg>
        </a>
        <Footer />
      </div>
    </>
  );
};

export default Index;
