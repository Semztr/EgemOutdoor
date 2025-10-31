import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { Product, ProductCardProps } from '@/types/product';

const BestSellers = () => {
  const [products, setProducts] = React.useState<ProductCardProps[]>([]);

  React.useEffect(() => {
    const load = async () => {
      // Fetch products marked as best sellers
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, original_price, brand, image_url, badge, badges, is_active, stock_quantity, color_images')
        .eq('is_active', true)
        .contains('badges', ['bestseller'])
        .order('created_at', { ascending: false })
        .limit(12);
      if (!error && data) {
        setProducts(data.map((p: any) => {
          // Ana görsel yoksa, ilk rengin ana görselini kullan
          let finalImageUrl = p.image_url;
          if (!finalImageUrl && (p as any).color_images && typeof (p as any).color_images === 'object') {
            const firstColor = Object.keys((p as any).color_images)[0];
            if (firstColor && (p as any).color_images[firstColor]?.main) {
              finalImageUrl = (p as any).color_images[firstColor].main;
            }
          }
          
          return {
            id: p.id,
            name: p.name,
            brand: p.brand ?? '',
            description: p.description ?? '',
            price: p.price,
            originalPrice: (p as any).original_price || null,
            image: finalImageUrl ?? '',
            badge: p.badge,
            badges: p.badges || [],
            inStock: p.stock_quantity > 0,
          };
        }));
      }
    };
    load();
  }, []);

  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Çok Satanlar</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En çok tercih edilen ve müşterilerimiz tarafından beğenilen ürünler.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 items-stretch">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} loading="lazy" />
          ))}
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
