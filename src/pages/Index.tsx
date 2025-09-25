import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero'; 
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandShowcase from '@/components/BrandShowcase';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <BrandShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
