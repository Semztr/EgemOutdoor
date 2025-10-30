import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/format';

const FeaturedProducts = () => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    loop: true,
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  // Autoplay
  React.useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);
    return () => clearInterval(id);
  }, [emblaApi]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
    });
    toast({
      title: 'Ürün sepete eklendi!',
      description: `${product.name} sepetinize eklendi.`,
    });
  };

  const [products, setProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const load = async () => {
      // Loose typing to avoid build-time type errors if DB types differ locally
      const { data, error } = await (supabase as any)
        .from('products')
        .select('id, name, description, price, original_price, brand, image_url, featured, is_active, created_at, badge, badges')
        .eq('is_active', true)
        .eq('featured', true)
        .order('created_at', { ascending: false });
      if (!error && data) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand ?? '',
          description: p.description ?? '',
          price: p.price,
          originalPrice: p.original_price || null,
          image: p.image_url ?? '',
          badge: p.badge || 'Öne Çıkan',
          badges: p.badges || [],
        }));
        setProducts(mapped);
      }
    };
    load();
  }, []);

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Öne Çıkan Ürünler</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              En popüler ve yüksek kaliteli balık malzemelerimizi keşfedin. Her ürün özenle seçilmiş ve test edilmiştir.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={scrollPrev} className="hover:bg-primary hover:text-primary-foreground">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext} className="hover:bg-primary hover:text-primary-foreground">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex gap-5 items-stretch">
            {products.map((product) => (
              <div key={product.id} className="embla__slide min-w-0 flex-[0_0_200px] lg:flex-[0_0_calc((100%-5rem)/6)] h-full">
                <Card className="gradient-card border-border group relative overflow-hidden shadow-card hover:shadow-xl transition-shadow h-full flex flex-col">
                  {/* Badges - Sağ Üst */}
                  {(() => {
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
                    const displayBadges = product.badges && product.badges.length > 0 ? product.badges : (product.badge ? [product.badge] : []);
                    
                    return displayBadges.length > 0 ? (
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
                    ) : null;
                  })()}

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
                    <Link to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
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
                    <Link to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2 min-h-[32px] group-hover:text-primary transition-colors text-xs md:text-sm">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Description */}
                    {product.description && (
                      <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2 mb-2">
                        {product.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      {product.originalPrice && product.originalPrice > product.price ? (
                        <>
                          <span className="text-xs text-muted-foreground line-through">₺{formatPrice(product.originalPrice)}</span>
                          <span className="text-lg font-bold text-red-600 dark:text-red-500">₺{formatPrice(product.price)}</span>
                          <span className="text-xs font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-2 py-0.5 rounded">
                            %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-primary">₺{formatPrice(product.price)}</span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-1.5 mt-auto">
                      <Button variant="default" size="sm" className="flex-1 text-[10px] md:text-xs h-7 md:h-8" onClick={() => handleAddToCart(product)}>
                        <ShoppingCart className="h-3 w-3 mr-0.5" />
                        Sepete
                      </Button>
                      <Link to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                        <Button variant="outline" size="sm" className="text-[10px] md:text-xs h-7 md:h-8 px-2">İncele</Button>
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