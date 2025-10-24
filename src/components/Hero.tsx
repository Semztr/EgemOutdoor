import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const sliderImages = [
  '/banner.png',
  // Deniz/fishing sahnesi
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&h=800&fit=crop&q=85&auto=format&cs=tinysrgb',
  // Daha canlı outdoor/kamp görseli
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&h=800&fit=crop&q=85&auto=format&cs=tinysrgb',
];

const Hero = () => {
  const [active, setActive] = React.useState(0);
  const goPrev = () => setActive((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  const goNext = () => setActive((prev) => (prev + 1) % sliderImages.length);

  React.useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Slider background with fade */}
      <div className="absolute inset-0">
        {sliderImages.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt="Hero banner"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 filter contrast-115 saturate-125 md:contrast-130 md:saturate-130 ${idx === active ? 'opacity-100' : 'opacity-0'}`}
            loading="eager"
            decoding="async"
          />
        ))}
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>

      {/* Controls - Smaller and more subtle */}
      <div className="absolute inset-y-0 left-2 sm:left-4 z-20 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={goPrev}
          className="h-8 w-8 md:h-10 md:w-10 bg-background/60 backdrop-blur hover:bg-primary hover:text-primary-foreground transition-all"
          aria-label="Önceki görsel"
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-2 sm:right-4 z-20 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={goNext}
          className="h-8 w-8 md:h-10 md:w-10 bg-background/60 backdrop-blur hover:bg-primary hover:text-primary-foreground transition-all"
          aria-label="Sonraki görsel"
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Top-left brand badge - moved and styled */}
        <div className="absolute top-2 left-4 sm:top-4 sm:left-6 z-20">
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground shadow-lg">
            EGEMOUTDOOR
          </div>
        </div>
        <div className="max-w-2xl">

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-4 leading-tight">
            <span className="text-white drop-shadow-lg">Kişiye Özel</span>
            <span className="text-primary drop-shadow-lg block">Outdoor Ürünleri</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 leading-relaxed max-w-xl drop-shadow">
            Profesyonel outdoor ve balıkçılık ekipmanları. Kaliteli ve kişiye özel 
            ürünlerle doğada kendinizi güvende hissedin.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/urunler">
              <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                Ürünleri Keşfet
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default Hero;