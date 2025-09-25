import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const FeaturedProducts = () => {
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
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Öne Çıkan Ürünler
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En popüler ve yüksek kaliteli balık malzemelerimizi keşfedin. 
            Her ürün özenle seçilmiş ve test edilmiştir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="gradient-card border-border hover-lift group relative overflow-hidden">
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
              <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="h-4 w-4" />
              </Button>

              <CardContent className="p-6">
                {/* Product image placeholder */}
                <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center text-6xl">
                  {product.image}
                </div>

                {/* Brand */}
                <div className="text-xs text-primary font-medium mb-2">{product.brand}</div>

                {/* Product name */}
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

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
                  <Button variant="default" size="sm" className="flex-1">
                    <ShoppingCart className="h-4 w-4" />
                    Sepete Ekle
                  </Button>
                  <Button variant="outline" size="sm">
                    İncele
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Tüm Ürünleri Görüntüle
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;