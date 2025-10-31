import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { Product, ProductCardProps } from '@/types/product';

const ProductShowcase = () => {
  const [popularProducts, setPopularProducts] = useState<ProductCardProps[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductCardProps[]>([]);
  const [newProducts, setNewProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllProducts = async () => {
      setLoading(true);
      
      // Popüler Ürünler (badges array içinde 'popular' var)
      const { data: popular } = await supabase
        .from('products')
        .select('id, name, description, price, original_price, brand, image_url, badge, badges, is_active, stock_quantity')
        .eq('is_active', true)
        .contains('badges', ['popular'])
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (popular) {
        setPopularProducts(popular.map((p: Product) => ({
          id: p.id,
          name: p.name,
          brand: p.brand ?? '',
          description: p.description ?? '',
          price: p.price,
          originalPrice: p.original_price,
          image: p.image_url ?? '',
          badge: p.badge,
          badges: p.badges || [],
          inStock: p.stock_quantity > 0,
        })));
      }

      // Çok Satanlar (badges array içinde 'bestseller' var)
      const { data: bestsellers } = await supabase
        .from('products')
        .select('id, name, description, price, original_price, brand, image_url, badge, badges, is_active, stock_quantity')
        .eq('is_active', true)
        .contains('badges', ['bestseller'])
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (bestsellers) {
        setBestSellers(bestsellers.map((p: Product) => ({
          id: p.id,
          name: p.name,
          brand: p.brand ?? '',
          description: p.description ?? '',
          price: p.price,
          originalPrice: p.original_price,
          image: p.image_url ?? '',
          badge: p.badge,
          badges: p.badges || [],
          inStock: p.stock_quantity > 0,
        })));
      }

      // Yeni Gelenler (badges array içinde 'new' var)
      const { data: newItems } = await supabase
        .from('products')
        .select('id, name, description, price, original_price, brand, image_url, badge, badges, is_active, stock_quantity')
        .eq('is_active', true)
        .contains('badges', ['new'])
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (newItems) {
        setNewProducts(newItems.map((p: Product) => ({
          id: p.id,
          name: p.name,
          brand: p.brand ?? '',
          description: p.description ?? '',
          price: p.price,
          originalPrice: p.original_price,
          image: p.image_url ?? '',
          badge: p.badge,
          badges: p.badges || [],
          inStock: p.stock_quantity > 0,
        })));
      }

      setLoading(false);
    };

    loadAllProducts();
  }, []);

  const ProductGrid = ({ products }: { products: ProductCardProps[] }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 items-stretch">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} loading="lazy" />
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
