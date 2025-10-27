import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const BestSellers = () => {
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
    }, 4000);
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
      // Fetch active products, ordered by created_at (simulating best sellers)
      // In a real app, you'd order by sales_count or similar
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, brand, image_url, is_active, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (!error && data) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand ?? '',
          price: p.price,
          originalPrice: null,
          image: p.image_url ?? '',
          badge: 'Çok Satan',
        }));
        setProducts(mapped);
      }
    };
    load();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h2 className="text-4xl font-bold text-foreground">Çok Satanlar</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              En çok tercih edilen ve müşterilerimiz tarafından beğenilen ürünler.
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
          <div className="embla__container flex gap-5">
            {products.map((product) => (
              <div key={product.id} className="embla__slide min-w-0 flex-[0_0_240px] lg:flex-[0_0_calc((100%-5rem)/5)]">
                <Card className="gradient-card border-border group relative overflow-hidden shadow-card">
                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
                      {product.badge}
                    </span>
                  </div>

                  {/* Heart icon */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
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

                  <CardContent className="p-4">
                    {/* Product image */}
                    <Link to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
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
                    <Link to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors text-sm">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3 mt-1">
                      <span className="text-lg font-bold text-foreground">₺{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">₺{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="flex-1" onClick={() => handleAddToCart(product)}>
                        <ShoppingCart className="h-4 w-4" />
                        Sepete Ekle
                      </Button>
                      <Link to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                        <Button variant="outline" size="sm">İncele</Button>
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

export default BestSellers;
