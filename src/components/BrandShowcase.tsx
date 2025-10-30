import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/format';
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const BrandShowcase = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
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
        .select('id, name, description, price, brand, image_url, is_active, created_at, category, badge, original_price')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error && data) {
        const mapped = data.map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand ?? '',
          description: (p as any).description ?? '',
          price: p.price,
          originalPrice: p.original_price || null,
          image: p.image_url ?? '',
          badge: p.badge || null, // Veritabanından gelen badge kullan
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
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Hızlı Alışveriş</h2>
            <p className="text-sm md:text-base text-muted-foreground">Popüler ürünlerimize hızlıca göz atın</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {quickProducts.map((product) => {
              // Badge label ve renk mapping
              const badgeLabels: Record<string, string> = {
                'popular': 'Popüler',
                'bestseller': 'Çok Satan',
                'new': 'Yeni',
                'discount': 'İndirimli',
                'featured': 'Öne Çıkan',
              };
              
              const badgeColors: Record<string, string> = {
                'popular': 'bg-purple-500 text-white',
                'bestseller': 'bg-orange-500 text-white',
                'new': 'bg-green-500 text-white',
                'discount': 'bg-red-500 text-white',
                'featured': 'bg-blue-500 text-white',
              };
              
              // Çoklu rozet desteği
              const productBadges = (product as any).badges || [];
              const displayBadges = productBadges.length > 0 ? productBadges : (product.badge ? [product.badge] : []);
              
              return (
              <Card key={product.id} className="gradient-card border-border group relative overflow-hidden shadow-card hover:shadow-xl transition-shadow">
                {/* Badges - Sağ Üst */}
                {displayBadges.length > 0 && (
                  <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                    {displayBadges.map((badge: string, index: number) => {
                      const label = badgeLabels[badge] || badge;
                      const color = badgeColors[badge] || 'bg-orange-500 text-white';
                      return (
                        <span key={index} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${color}`}>
                          {label}
                        </span>
                      );
                    })}
                  </div>
                )}
                {/* Heart icon - Sol Üst */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(product.id);
                  }}
                >
                  <Heart 
                    className={`h-4 w-4 transition-colors ${
                      isFavorite(product.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                </Button>

                <CardContent className="p-2 md:p-3 flex flex-col h-full">
                  {/* Product image */}
                  <Link to={`/urun/${product.id}`}>
                    <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.dataset.fallback !== '1') {
                            target.dataset.fallback = '1';
                            target.src = '/placeholder.svg';
                          }
                        }}
                      />
                    </div>
                  </Link>

                  {/* Brand */}
                  {product.brand && (
                    <div className="text-[11px] text-primary font-medium mb-1">
                      {product.brand}
                    </div>
                  )}

                  {/* Product name */}
                  <Link to={`/urun/${product.id}`}>
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2 min-h-[32px] group-hover:text-primary transition-colors text-xs md:text-sm">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Description */}
                  <div className="min-h-[32px] mb-2">
                    {product.description && (
                      <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Price and Buttons - Together at bottom */}
                  <div className="mt-auto flex flex-col gap-2">
                    {/* Price */}
                    <div className="flex items-center gap-1.5 flex-wrap min-h-[28px]">
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <>
                          <span className="text-xs text-muted-foreground line-through">
                            ₺{formatPrice(product.originalPrice)}
                          </span>
                          <span className="text-lg font-bold text-red-600 dark:text-red-500">
                            ₺{formatPrice(product.price)}
                          </span>
                          <span className="text-xs font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-2 py-0.5 rounded">
                            %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-primary">₺{formatPrice(product.price)}</span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-1.5">
                    <Button variant="default" size="sm" className="flex-1 text-[10px] md:text-xs h-7 md:h-8" onClick={() => handleAddToCart(product)}>
                      Sepete
                    </Button>
                    <Link to={`/urun/${product.id}`}>
                      <Button variant="outline" size="sm" className="text-[10px] md:text-xs h-7 md:h-8 px-2">İncele</Button>
                    </Link>
                  </div>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link to="/urunler">
              <Button variant="outline" size="lg" className="hover:bg-primary hover:text-primary-foreground">
                Tüm Ürünleri Görüntüle
              </Button>
            </Link>
          </div>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Güvenilir Markalar
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Dünya çapında tanınan markaların ürünlerini sunuyoruz
          </p>
        </div>

        <div className="embla overflow-hidden mb-12 relative" ref={emblaRef}>
          <div className="embla__container flex gap-0">
            {brands.map((brand, index) => (
              <div key={index} className="embla__slide flex-[0_0_180px] min-w-0 px-2">
                <Card className="gradient-card border-border shadow-card h-full w-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="h-12 md:h-14 mb-2 flex items-center justify-center">
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="max-h-full w-auto max-w-[120px] object-contain mx-auto opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{brand.name}</h3>
                    <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                      {brand.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Navigation buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="pointer-events-auto bg-background/80 backdrop-blur hover:bg-primary hover:text-primary-foreground shadow-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="pointer-events-auto bg-background/80 backdrop-blur hover:bg-primary hover:text-primary-foreground shadow-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Brand banners removed as requested */}
      </div>
    </section>
  );
};

export default BrandShowcase;