import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const FeaturedProducts = () => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
    });
    toast({
      title: "Ürün sepete eklendi!",
      description: `${product.name} sepetinize eklendi.`,
    });
  };

  const products = [
    {
      id: 1,
      name: "Daiwa Saltiga Dogfight Olta Makinesi",
      brand: "Daiwa",
      price: 12850,
      originalPrice: 14500,
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=500&fit=crop",
      badge: "11% İndirim",
      isNew: true,
      description: "Profesyonel balıkçılar için üstün performans ve dayanıklılık"
    },
    {
      id: 2,
      name: "Savage Gear 3D Suicide Duck Yem",
      brand: "Savage Gear",
      price: 485,
      originalPrice: null,
      rating: 4.8,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=500&fit=crop",
      badge: "Çok Satan",
      isNew: false,
      description: "Gerçekçi hareket ve ses ile yırtıcı balıkları cezbeder"
    },
    {
      id: 3,
      name: "Jack Wolfskin Texapore Outdoor Mont",
      brand: "Jack Wolfskin",
      price: 3240,
      originalPrice: 3850,
      rating: 4.9,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
      badge: "16% İndirim",
      isNew: true,
      description: "Su geçirmez, nefes alır, tüm hava koşullarına uygun"
    },
    {
      id: 4,
      name: "Stanley Adventure Soğuk Tutucu Termos 1L",
      brand: "Stanley",
      price: 890,
      originalPrice: 1050,
      rating: 4.7,
      reviews: 421,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
      badge: "15% İndirim",
      isNew: false,
      description: "24 saat sıcak, 32 saat soğuk tutar, çelik gövde"
    },
    {
      id: 5,
      name: "Asolo Falcon GV Trekking Botu",
      brand: "Asolo",
      price: 4580,
      originalPrice: null,
      rating: 5.0,
      reviews: 178,
      image: "https://images.unsplash.com/photo-1542840410-3092f99611a3?w=500&h=500&fit=crop",
      badge: "Premium",
      isNew: true,
      description: "Gore-Tex membran, Vibram taban, maksimum destek ve konfor"
    },
    {
      id: 6,
      name: "Helly Hansen Workwear Outdoor Pantolon",
      brand: "Helly Hansen",
      price: 1850,
      originalPrice: 2100,
      rating: 4.6,
      reviews: 267,
      image: "https://images.unsplash.com/photo-1473692623410-12fac8ef75c6?w=500&h=500&fit=crop",
      badge: "12% İndirim",
      isNew: false,
      description: "Dayanıklı kumaş, su itici kaplama, çok amaçlı cep sistemi"
    }
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Öne Çıkan Ürünler
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              En popüler ve yüksek kaliteli balık malzemelerimizi keşfedin. 
              Her ürün özenle seçilmiş ve test edilmiştir.
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

        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex gap-6">
            {products.map((product) => (
              <div key={product.id} className="embla__slide flex-[0_0_300px] min-w-0">
                <Card className="gradient-card border-border hover-lift group relative overflow-hidden shadow-card">
                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.badge.includes('İndirim') 
                        ? 'bg-destructive text-destructive-foreground'
                        : product.badge === 'Yeni Ürün'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground'
                    }`}>
                      {product.badge}
                    </span>
                  </div>

                  {/* Heart icon */}
                  <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80">
                    <Heart className="h-4 w-4" />
                  </Button>

                  <CardContent className="p-6">
                    {/* Product image */}
                    <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Brand */}
                    <div className="text-xs text-primary font-medium mb-2">{product.brand}</div>

                    {/* Product name */}
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2 min-h-[48px] group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    {/* Product description */}
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 min-h-[32px]">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="ml-1 text-sm font-medium">{product.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({product.reviews} değerlendirme)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-foreground">₺{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">₺{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="flex-1" onClick={() => handleAddToCart(product)}>
                        <ShoppingCart className="h-4 w-4" />
                        Sepete Ekle
                      </Button>
                      <Link to={`/urun/${product.id}`}>
                        <Button variant="outline" size="sm">
                          İncele
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/urunler">
            <Button variant="outline" size="lg" className="hover:bg-primary hover:text-primary-foreground">
              Tüm Ürünleri Görüntüle
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;