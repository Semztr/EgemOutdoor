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
    <section className="relative min-h-[40vh] md:min-h-[60vh] xl:min-h-[70vh] flex items-center justify-center overflow-hidden">
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
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/45 md:bg-black/60"></div>
      </div>

      {/* Controls */}
      <div className="absolute inset-y-0 left-2 sm:left-4 z-20 flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={goPrev}
          className="bg-background/70 backdrop-blur hover:bg-primary hover:text-primary-foreground"
          aria-label="Önceki görsel"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-2 sm:right-4 z-20 flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={goNext}
          className="bg-background/70 backdrop-blur hover:bg-primary hover:text-primary-foreground"
          aria-label="Sonraki görsel"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
        {/* Top-right brand pill */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <div className="text-[10px] sm:text-xs uppercase tracking-wider inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground shadow ring-1 ring-primary/70">
            EgemOutdoor
          </div>
        </div>
        <div className="max-w-2xl">

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            <span className="gradient-primary bg-clip-text text-transparent">Kişiye Özel</span>
            <span className="gradient-primary bg-clip-text text-transparent block">Outdoor Ürünleri</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Profesyonel outdoor ve balıkçılık ekipmanları. Kaliteli ve kişiye özel 
            ürünlerle doğada kendinizi güvende hissedin.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-2">
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