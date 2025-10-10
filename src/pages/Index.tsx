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
        {/* Floating WhatsApp button */}
        <a
          href="https://wa.me/905336407758"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp ile iletişim kur"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#1ebe59] transition-colors w-14 h-14 flex items-center justify-center ring-2 ring-white"
        >
          {/* WhatsApp SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="currentColor"
            className="w-7 h-7 text-white"
            aria-hidden="true"
          >
            <path d="M19.11 17.36c-.29-.14-1.69-.83-1.95-.92-.26-.1-.45-.14-.64.14-.19.29-.73.92-.9 1.11-.17.19-.33.21-.62.07-.29-.14-1.22-.45-2.32-1.44-.86-.77-1.44-1.72-1.6-2.01-.17-.29-.02-.45.12-.59.12-.12.29-.31.43-.48.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.1-.23-.55-.47-.48-.64-.48-.17 0-.36-.02-.55-.02-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.03 2.81 1.17 3 .14.19 2.02 3.08 4.89 4.32.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.69-.69 1.93-1.35.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33z"/>
            <path d="M16.01 3C9.93 3 5 7.94 5 14.02c0 2.68.97 5.14 2.58 7.06L6 27l6.09-1.58c1.86 1.02 3.99 1.6 6.24 1.6 6.08 0 11.01-4.93 11.01-11.01C29.34 7.94 25.1 3 19.02 3h-3.01zm6.99 19.53c-1.85 1.82-4.3 2.82-6.91 2.82-1.91 0-3.77-.55-5.36-1.58l-.38-.24-3.61.94.96-3.52-.25-.37C6.44 18.99 5.9 17.56 5.9 16c0-2.62 1.01-5.08 2.85-6.92C10.6 7.23 13.06 6.22 15.68 6.22c2.62 0 5.08 1.01 6.92 2.85 1.84 1.84 2.85 4.3 2.85 6.92 0 2.62-1.01 5.08-2.85 6.92z"/>
          </svg>
        </a>
        <Footer />
      </div>
    </>
  );
};

export default Index;
