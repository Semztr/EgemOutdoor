import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ShoppingCart, TrendingUp, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProductBadge } from '@/components/ProductBadge';
import { BADGE_LABELS } from '@/lib/constants';
import { formatPrice } from '@/lib/format';

const ProductShowcase = () => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllProducts = async () => {
      setLoading(true);
      
      // Popüler Ürünler (badges array içinde 'popular' var)
      const { data: popular } = await supabase
        .from('products')
        .select('id, name, description, price, original_price, brand, image_url, badge, badges, is_active')
        .eq('is_active', true)
        .contains('badges', ['popular'])
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (popular) {
        setPopularProducts(popular.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand ?? '',
          description: p.description ?? '',
          price: p.price,
          originalPrice: p.original_price,
          image: p.image_url ?? '',
          badge: p.badge,
          badges: p.badges || [],
        })));
      }

      // Çok Satanlar (badges array içinde 'bestseller' var)
      const { data: bestsellers } = await supabase
        .from('products')
        .select('id, name, description, price, original_price, brand, image_url, badge, badges, is_active')
        .eq('is_active', true)
        .contains('badges', ['bestseller'])
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (bestsellers) {
        setBestSellers(bestsellers.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand ?? '',
          description: p.description ?? '',
          price: p.price,
          originalPrice: p.original_price,
          image: p.image_url ?? '',
          badge: p.badge,
          badges: p.badges || [],
        })));
      }

      // Yeni Gelenler (badges array içinde 'new' var)
      const { data: newItems } = await supabase
        .from('products')
        .select('id, name, description, price, original_price, brand, image_url, badge, badges, is_active')
        .eq('is_active', true)
        .contains('badges', ['new'])
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (newItems) {
        setNewProducts(newItems.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand ?? '',
          description: p.description ?? '',
          price: p.price,
          originalPrice: p.original_price,
          image: p.image_url ?? '',
          badge: p.badge,
          badges: p.badges || [],
        })));
      }

      setLoading(false);
    };

    loadAllProducts();
  }, []);

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

  const ProductGrid = ({ products }: { products: any[] }) => {
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
    
    return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 items-stretch">
      {products.map((product) => {
        const displayBadges = product.badges && product.badges.length > 0 ? product.badges : (product.badge ? [product.badge] : []);
        
        return (
        <Card key={product.id} className="gradient-card border-border group relative overflow-hidden shadow-card hover:shadow-xl transition-shadow h-full flex flex-col">
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
            <Link to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
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
            <Link to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
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
                  <span className="text-lg font-bold text-primary">
                    ₺{formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-1.5">
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 text-[10px] md:text-xs h-7 md:h-8" 
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="h-3 w-3 mr-0.5" />
                Sepete
              </Button>
              <Link to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                <Button variant="outline" size="sm" className="text-[10px] md:text-xs h-7 md:h-8 px-2">
                  İncele
                </Button>
              </Link>
            </div>
            </div>
          </CardContent>
        </Card>
        );
      })}
    </div>
    );
  };

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Ürünler yükleniyor...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Ürünlerimizi Keşfedin
          </h2>
        </div>

        <Tabs defaultValue="popular" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6 md:mb-8 h-auto">
            <TabsTrigger value="popular" className="flex items-center gap-2 py-3 text-xs md:text-sm">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Popüler Ürünler</span>
              <span className="sm:hidden">Popüler</span>
            </TabsTrigger>
            <TabsTrigger value="bestsellers" className="flex items-center gap-2 py-3 text-xs md:text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Çok Satanlar</span>
              <span className="sm:hidden">Çok Satan</span>
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2 py-3 text-xs md:text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Yeni Gelenler</span>
              <span className="sm:hidden">Yeni</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="popular" className="mt-0">
            {popularProducts.length > 0 ? (
              <ProductGrid products={popularProducts} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Popüler ürün bulunamadı.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bestsellers" className="mt-0">
            {bestSellers.length > 0 ? (
              <ProductGrid products={bestSellers} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Çok satan ürün bulunamadı.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="new" className="mt-0">
            {newProducts.length > 0 ? (
              <ProductGrid products={newProducts} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Yeni ürün bulunamadı.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6 md:mt-8">
          <Link to="/urunler">
            <Button variant="outline" size="default" className="hover:bg-primary hover:text-primary-foreground">
              Tüm Ürünleri Görüntüle
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
