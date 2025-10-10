import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const BrandShowcase = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    loop: true,
  });

  // Autoplay
  

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const brands = [
    { name: "Okuma", logo: "/okuma.png", description: "Profesyonel balıkçılık ekipmanları" },
    { name: "Apnea", logo: "/apnea.png", description: "Sualtı avı ve dalış ekipmanları" },
    { name: "Salomon", logo: "/salomon.png", description: "Outdoor sporlarında Fransız kalitesi" },
    { name: "Helly Hansen", logo: "/Hellyhansen.png", description: "Norveç'ten denizcilik ve outdoor uzmanı" },
    { name: "Jack Wolfskin", logo: "/jackwolfskin.png", description: "Alman mühendisliği ile outdoor giyim" },
    { name: "Asolo", logo: "/asolo.png", description: "İtalyan trekking botu ustası" },
    { name: "Peak Performance", logo: "/peakperformance.png", description: "İsveç outdoor giyim markası" },
    { name: "Stanley", logo: "/stanley.png", description: "Efsanevi termos ve kamp ekipmanları" },
    { name: "Savage Gear", logo: "/sevagegear.png", description: "Yırtıcı balık avında uzman" },
    { name: "Daiwa", logo: "/daiwa.png", description: "Japonya'nın prestijli balık malzemeleri" },
  ];

  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);
    return () => clearInterval(id);
  }, [emblaApi]);

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
              <div key={index} className="embla__slide flex-[0_0_240px] min-w-0">
                <Card className="gradient-card border-border shadow-card h-full">
                  <CardContent className="p-6 text-center">
                    <div className="h-20 md:h-24 mb-3 flex items-center justify-center">
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="max-h-16 md:max-h-20 w-auto object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{brand.name}</h3>
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
              <div className="text-5xl mb-4">🎣</div>
              <h3 className="text-xl font-bold mb-2">Balıkçılık Koleksiyonu</h3>
              <p className="text-primary-foreground/80">Daiwa, Savage Gear ve Okuma ürünleri</p>
            </CardContent>
          </Card>

          <Card className="gradient-accent text-accent-foreground hover-lift cursor-pointer overflow-hidden shadow-accent">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">🏔️</div>
              <h3 className="text-xl font-bold mb-2">Outdoor Giyim & Ekipman</h3>
              <p className="text-accent-foreground/80">Jack Wolfskin, Helly Hansen, Salomon</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border hover-lift cursor-pointer overflow-hidden shadow-card">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">🥾</div>
              <h3 className="text-xl font-bold mb-2">Trekking & Kamp</h3>
              <p className="text-muted-foreground">Asolo, Stanley ve tüm kamp malzemeleri</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;