import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const FeaturedProducts = () => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const products = [
    {
      id: 1,
      name: "Profesyonel Olta Makinesi Pro-X 4000",
      brand: "BalıkPro",
      price: 2850,
      originalPrice: 3200,
      rating: 4.8,
      reviews: 124,
      image: "🎣",
      badge: "10% İndirim",
      isNew: true
    },
    {
      id: 2,
      name: "Karbon Fiber Olta Kamışı Elite 3.5m",
      brand: "BalıkPro",
      price: 1240,
      originalPrice: null,
      rating: 4.9,
      reviews: 87,
      image: "🎯",
      badge: "Yeni Ürün",
      isNew: true
    },
    {
      id: 3,
      name: "Kişiye Özel Makara Seti Premium",
      brand: "BalıkPro Custom",
      price: 4200,
      originalPrice: null,
      rating: 5.0,
      reviews: 45,
      image: "⚙️",
      badge: "Özel Yapım",
      isNew: false
    },
    {
      id: 4,
      name: "Profesyonel Balık Çantası Deluxe",
      brand: "BalıkPro",
      price: 890,
      originalPrice: 1050,
      rating: 4.7,
      reviews: 156,
      image: "🎒",
      badge: "15% İndirim",
      isNew: false
    },
    {
      id: 5,
      name: "Titanium Balık Oltası Set",
      brand: "BalıkPro Elite",
      price: 1580,
      originalPrice: null,
      rating: 4.9,
      reviews: 89,
      image: "🪝",
      badge: "Premium",
      isNew: true
    },
    {
      id: 6,
      name: "Su Geçirmez Balık Kutusu",
      brand: "BalıkPro",
      price: 450,
      originalPrice: 520,
      rating: 4.6,
      reviews: 203,
      image: "📦",
      badge: "13% İndirim",
      isNew: false
    }
  ];

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Öne Çıkan Ürünler
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En popüler ve yüksek kaliteli ürünlerimizi keşfedin. 
            Her ürün özenle seçilmiş ve test edilmiştir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {products.map((product) => (
            <Link key={product.id} to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Card className="gradient-card border-border hover-lift group relative overflow-hidden shadow-card h-full">
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80"
                  onClick={(e) => e.preventDefault()}
                >
                  <Heart className="h-4 w-4" />
                </Button>

                <CardContent className="p-4">
                  {/* Product image placeholder */}
                  <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center text-5xl">
                    {product.image}
                  </div>

                  {/* Brand */}
                  <div className="text-xs text-primary font-medium mb-1">{product.brand}</div>

                  {/* Product name */}
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      <span className="ml-1 text-xs font-medium">{product.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-foreground">₺{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">₺{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Sepete Ekle
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      İncele
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
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

export default FeaturedProducts;