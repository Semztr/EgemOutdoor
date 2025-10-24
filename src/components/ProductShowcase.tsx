import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ShoppingCart, TrendingUp, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ProductShowcase = () => {
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllProducts = async () => {
      setLoading(true);
      
      // Featured Products
      const { data: featured } = await supabase
        .from('products')
        .select('id, name, price, brand, image_url, featured, is_active')
        .eq('is_active', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (featured) {
        setFeaturedProducts(featured.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand ?? '',
          price: p.price,
          image: p.image_url ?? '',
          badge: 'Öne Çıkan',
          badgeColor: 'bg-accent text-accent-foreground',
        })));
      }

      // Best Sellers (simulated with recent products)
      const { data: sellers } = await supabase
        .from('products')
        .select('id, name, price, brand, image_url, is_active')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (sellers) {
        setBestSellers(sellers.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand ?? '',
          price: p.price,
          image: p.image_url ?? '',
          badge: 'Çok Satan',
          badgeColor: 'bg-orange-500 text-white',
        })));
      }

      // New Arrivals (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: newItems } = await supabase
        .from('products')
        .select('id, name, price, brand, image_url, is_active, created_at')
        .eq('is_active', true)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (newItems && newItems.length > 0) {
        setNewArrivals(newItems.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand ?? '',
          price: p.price,
          image: p.image_url ?? '',
          badge: 'Yeni',
          badgeColor: 'bg-green-500 text-white',
        })));
      } else {
        // Fallback to most recent
        const { data: fallback } = await supabase
          .from('products')
          .select('id, name, price, brand, image_url, is_active')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (fallback) {
          setNewArrivals(fallback.map((p: any) => ({
            id: p.id,
            name: p.name,
            brand: p.brand ?? '',
            price: p.price,
            image: p.image_url ?? '',
            badge: 'Yeni',
            badgeColor: 'bg-green-500 text-white',
          })));
        }
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

  const ProductGrid = ({ products }: { products: any[] }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
      {products.map((product) => (
        <Card key={product.id} className="gradient-card border-border group relative overflow-hidden shadow-card hover:shadow-xl transition-shadow">
          {/* Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.badgeColor}`}>
              {product.badge}
            </span>
          </div>

          {/* Heart icon */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
          >
            <Heart className="h-4 w-4" />
          </Button>

          <CardContent className="p-2 md:p-3">
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
              <div className="text-[9px] md:text-[10px] text-primary font-medium mb-0.5 uppercase tracking-wide">
                {product.brand}
              </div>
            )}

            {/* Product name */}
            <Link to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
              <h3 className="font-semibold text-foreground mb-1.5 line-clamp-2 min-h-[32px] group-hover:text-primary transition-colors text-xs md:text-sm">
                {product.name}
              </h3>
            </Link>

            {/* Price */}
            <div className="flex items-center gap-1 mb-2">
              <span className="text-sm md:text-base font-bold text-foreground">
                ₺{product.price.toLocaleString()}
              </span>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );

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

        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6 md:mb-8 h-auto">
            <TabsTrigger value="featured" className="flex items-center gap-2 py-3 text-xs md:text-sm">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Öne Çıkan</span>
              <span className="sm:hidden">Öne Çıkan</span>
            </TabsTrigger>
            <TabsTrigger value="bestsellers" className="flex items-center gap-2 py-3 text-xs md:text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Çok Satan</span>
              <span className="sm:hidden">Çok Satan</span>
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2 py-3 text-xs md:text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Yeni Gelenler</span>
              <span className="sm:hidden">Yeni</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="mt-0">
            {featuredProducts.length > 0 ? (
              <ProductGrid products={featuredProducts} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Öne çıkan ürün bulunamadı.</p>
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
            {newArrivals.length > 0 ? (
              <ProductGrid products={newArrivals} />
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
