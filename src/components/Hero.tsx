import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const sliderImages = [
  '/banner.png',
  // Deniz/fishing sahnesi
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=800&fit=crop&q=85&auto=format&cs=tinysrgb',
  // Daha canlı outdoor/kamp görseli
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1600&h=800&fit=crop&q=85&auto=format&cs=tinysrgb',
];

const Hero = () => {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[40vh] md:min-h-[60vh] xl:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Slider background with fade */}
      <div className="absolute inset-0">
        {sliderImages.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt="Hero banner"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out filter brightness-95 contrast-105 saturate-105 md:brightness-95 md:contrast-110 md:saturate-110 ${idx === active ? 'opacity-40 md:opacity-50 lg:opacity-60' : 'opacity-0'}`}
            loading="eager"
            decoding="async"
          />
        ))}
        {/* Base overlay: lighter for more photo presence */}
        <div className="absolute inset-0 bg-black/10 md:bg-black/20"></div>
        {/* Subtle vertical gradient to ease edges and improve readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20 pointer-events-none"></div>
        {/* Left-to-right gradient to help text block area */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-transparent pointer-events-none"></div>
        {/* Radial spotlight to softly highlight left content area */}
        <div
          className="absolute inset-y-0 left-0 w-3/4 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.28), rgba(255,255,255,0) 60%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
        {/* Top-right brand pill */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <div className="text-[10px] sm:text-xs uppercase tracking-wider inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground shadow ring-1 ring-primary/70">
            EgemOutdoor
          </div>
        </div>
        <div className="max-w-3xl">

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            <span className="block">Kişiye Özel</span>
            <span className="gradient-primary bg-clip-text text-transparent block">Outdoor Ürünleri</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-foreground mb-6 leading-relaxed">
            Profesyonel outdoor ve balıkçılık ekipmanları. Kaliteli ve kişiye özel 
            ürünlerle doğada kendinizi güvende hissedin.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link to="/urunler">
              <Button variant="hero" size="xl" className="group">
                Ürünleri Keşfet
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default Hero;