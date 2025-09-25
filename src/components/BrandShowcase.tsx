import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

const BrandShowcase = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    loop: true,
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const brands = [
    { name: 'Daiwa', logo: '🎯', description: 'Japonya\'nın en prestijli balık malzemeleri markası' },
    { name: 'Shimano', logo: '⚙️', description: 'Dünya çapında tanınan kalite ve inovasyon' },
    { name: 'Okuma', logo: '🎣', description: 'Profesyonel balıkçıların tercihi' },
    { name: 'Penn', logo: '🌊', description: 'Deniz balıkçılığında güvenilir partner' },
    { name: 'Abu Garcia', logo: '🏆', description: 'İsveç kalitesi ve dayanıklılık' },
    { name: 'Savage Gear', logo: '🦈', description: 'Yırtıcı balık avında uzman' },
    { name: 'Berkley', logo: '🐟', description: 'Yapay yem teknolojisinde öncü' },
    { name: 'Rapala', logo: '🎪', description: 'Finlandiya\'dan dünyaca ünlü yemler' }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Dünya Markalarıyla Çalışıyoruz
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              En güvenilir ve kaliteli markaların ürünlerini sizlere sunuyoruz. 
              Her marka kendine özel uzmanlık alanında liderdir.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="embla overflow-hidden mb-12" ref={emblaRef}>
          <div className="embla__container flex gap-6">
            {brands.map((brand, index) => (
              <div key={index} className="embla__slide flex-[0_0_200px] min-w-0">
                <Card className="gradient-card border-border hover-glow transition-smooth cursor-pointer group shadow-card">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {brand.logo}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{brand.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {brand.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Brand banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="gradient-primary text-primary-foreground hover-lift cursor-pointer overflow-hidden shadow-primary">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Daiwa Collection</h3>
              <p className="text-primary-foreground/80">Profesyonel olta makineleri ve kamışları</p>
            </CardContent>
          </Card>

          <Card className="gradient-accent text-accent-foreground hover-lift cursor-pointer overflow-hidden shadow-accent">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold mb-2">Shimano Series</h3>
              <p className="text-accent-foreground/80">Yüksek performanslı balık malzemeleri</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border hover-lift cursor-pointer overflow-hidden shadow-card">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">Premium Brands</h3>
              <p className="text-muted-foreground">Tüm premium markaları keşfedin</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;