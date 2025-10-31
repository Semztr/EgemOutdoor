import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { Product, ProductCardProps } from '@/types/product';

const NewArrivals = () => {
  const [products, setProducts] = React.useState<ProductCardProps[]>([]);

  React.useEffect(() => {
    const load = async () => {
      // Fetch products marked as new arrivals
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, original_price, brand, image_url, badge, badges, features, is_active, stock_quantity, created_at, color_images')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        // Filter products with new_arrival flag in features
        const newArrivals = data.filter((p: any) => 
          p.features && typeof p.features === 'object' && p.features.new_arrival === true
        );
        
        const mapped: ProductCardProps[] = newArrivals.map((p: any) => {
          // Ana görsel yoksa, ilk rengin ana görselini kullan
          let finalImageUrl = p.image_url;
          if (!finalImageUrl && p.color_images && typeof p.color_images === 'object') {
            const firstColor = Object.keys(p.color_images)[0];
            if (firstColor && p.color_images[firstColor]?.main) {
              finalImageUrl = p.color_images[firstColor].main;
            }
          }
          
          return {
            id: p.id,
            name: p.name,
            brand: p.brand ?? '',
            description: p.description ?? '',
            price: p.price,
            originalPrice: p.original_price || null,
            image: finalImageUrl ?? '',
            badge: p.badge || null,
            badges: p.badges || [],
            inStock: p.stock_quantity > 0,
          };
        });
        setProducts(mapped);
      }
    };
    load();
  }, []);

  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Yeni Gelenler</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En yeni ürünlerimizi keşfedin ve trendleri yakalayın.
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

export default NewArrivals;
