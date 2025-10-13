import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { supabase } from '@/integrations/supabase/client';

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

  // Load products for quick shopping from Supabase
  const [quickProducts, setQuickProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, brand, image_url, is_active, created_at, category')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error && data) {
        const mapped = data.map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand ?? '',
          price: p.price,
          originalPrice: null,
          image: p.image_url ?? '',
          badge: 'Popüler',
        }));
        setQuickProducts(mapped);
      }
    };
    load();
  }, []);

  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
    });
    toast({ title: 'Ürün sepete eklendi!', description: `${product.name} sepetinize eklendi.` });
  };

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
        {/* Quick start shopping strip */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-4">Alışverişe Başla</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">En popüler ve yüksek kaliteli ürünlerimizi keşfedin. Her ürün özenle seçilmiştir.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {quickProducts.map((product) => (
              <Card key={product.id} className="gradient-card border-border group relative overflow-hidden shadow-card max-w-[240px] w-full mx-auto">
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.badge?.includes('İndirim')
                      ? 'bg-destructive text-destructive-foreground'
                      : product.badge === 'Yeni Ürün'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    {product.badge}
                  </span>
                </div>

                {/* Content */}
                <CardContent className="p-4">
                  {/* Product image */}
                  <Link to={`/urun/${product.id}`}>
                    <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.dataset.fallback !== '1') {
                            target.dataset.fallback = '1';
                            target.src = `https://via.placeholder.com/500x500.png?text=${encodeURIComponent('EgemOutdoor')}`;
                          }
                        }}
                      />
                    </div>
                  </Link>

                  {/* Brand */}
                  <div className="text-[11px] text-primary font-medium mb-1">{product.brand}</div>

                  {/* Product name */}
                  <Link to={`/urun/${product.id}`}>
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors text-sm">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3 mt-1">
                    <span className="text-lg font-bold text-foreground">₺{product.price.toLocaleString()}</span>
                    {product.originalPrice ? (
                      <span className="text-xs text-muted-foreground line-through">₺{product.originalPrice.toLocaleString()}</span>
                    ) : null}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="flex-1" onClick={() => handleAddToCart(product)}>
                      Sepete Ekle
                    </Button>
                    <Link to={`/urun/${product.id}`}>
                      <Button variant="outline" size="sm">İncele</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/urunler">
              <Button variant="outline" size="lg" className="hover:bg-primary hover:text-primary-foreground">
                Tüm Ürünleri Görüntüle
              </Button>
            </Link>
          </div>
        </div>
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
          <div className="embla__container flex gap-0">
            {brands.map((brand, index) => (
              <div key={index} className="embla__slide flex-[0_0_220px] min-w-0 px-3">
                <Card className="gradient-card border-border shadow-card h-full w-full">
                  <CardContent className="p-5 text-center">
                    <div className="h-16 md:h-20 mb-3 flex items-center justify-center">
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="max-h-full w-auto max-w-[140px] object-contain mx-auto"
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

        {/* Brand banners removed as requested */}
      </div>
    </section>
  );
};

export default BrandShowcase;