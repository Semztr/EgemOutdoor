import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart, Star, Filter, Grid, List } from 'lucide-react';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  // Bu örnek olta kamışları sayfası için tasarlandı
  const categoryData = {
    title: "Olta Kamışları",
    description: "Profesyonel balıkçılık için özel tasarlanmış, kaliteli olta kamışları. Her seviyeden balıkçı için uygun modeller.",
    totalProducts: 156,
    filters: [
      { name: "Marka", options: ["Daiwa", "Shimano", "Penn", "Abu Garcia"] },
      { name: "Uzunluk", options: ["2.1m", "2.4m", "2.7m", "3.0m", "3.6m"] },
      { name: "Test", options: ["5-25g", "10-40g", "20-60g", "40-100g"] },
      { name: "Fiyat", options: ["0-500₺", "500-1000₺", "1000-2000₺", "2000₺+"] }
    ]
  };

  const products = [
    {
      id: 1,
      name: "Daiwa Ninja X Spinning Rod 2.40m 10-40g",
      brand: "Daiwa",
      price: 850,
      originalPrice: 950,
      rating: 4.8,
      reviews: 124,
      image: "🎣",
      badge: "İndirimde",
      inStock: true,
      specs: ["2.40m", "10-40g", "2 Parça"]
    },
    {
      id: 2,
      name: "Shimano Catana EX Spinning 2.70m 5-25g",
      brand: "Shimano",
      price: 680,
      originalPrice: null,
      rating: 4.6,
      reviews: 87,
      image: "🎯",
      badge: null,
      inStock: true,
      specs: ["2.70m", "5-25g", "2 Parça"]
    },
    {
      id: 3,
      name: "Penn Battle III Surf Rod 3.60m 40-100g",
      brand: "Penn",
      price: 1240,
      originalPrice: null,
      rating: 4.9,
      reviews: 45,
      image: "⚙️",
      badge: "Yeni",
      inStock: true,
      specs: ["3.60m", "40-100g", "3 Parça"]
    },
    {
      id: 4,
      name: "Abu Garcia Vendetta Spinning 2.10m 7-28g",
      brand: "Abu Garcia",
      price: 720,
      originalPrice: 820,
      rating: 4.7,
      reviews: 156,
      image: "🪝",
      badge: "İndirimde",
      inStock: false,
      specs: ["2.10m", "7-28g", "2 Parça"]
    },
    {
      id: 5,
      name: "Daiwa Crossfire Tele Spinning 3.00m 20-60g",
      brand: "Daiwa",
      price: 450,
      originalPrice: null,
      rating: 4.5,
      reviews: 203,
      image: "📦",
      badge: null,
      inStock: true,
      specs: ["3.00m", "20-60g", "Teleskopik"]
    },
    {
      id: 6,
      name: "Shimano FX Spinning Rod 2.40m 14-40g",
      brand: "Shimano",
      price: 380,
      originalPrice: null,
      rating: 4.4,
      reviews: 89,
      image: "🎣",
      badge: "Ekonomik",
      inStock: true,
      specs: ["2.40m", "14-40g", "2 Parça"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <span>Ana Sayfa</span>
          <span>/</span>
          <span>Ürün Kategorileri</span>
          <span>/</span>
          <span className="text-foreground">{categoryData.title}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{categoryData.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{categoryData.description}</p>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">{categoryData.totalProducts} ürün</Badge>
            <span className="text-sm text-muted-foreground">Ücretsiz kargo fırsatı</span>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 space-y-6 hidden lg:block">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtreler
              </h3>
              
              {categoryData.filters.map((filter, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-medium text-foreground mb-2">{filter.name}</h4>
                  <div className="space-y-2">
                    {filter.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-muted-foreground">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Sort and View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Select defaultValue="popular">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sıralama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">En Popüler</SelectItem>
                    <SelectItem value="price-low">Fiyat (Düşük)</SelectItem>
                    <SelectItem value="price-high">Fiyat (Yüksek)</SelectItem>
                    <SelectItem value="newest">En Yeni</SelectItem>
                    <SelectItem value="rating">En Çok Beğenilen</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="h-4 w-4" />
                  Filtreler
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="gradient-card border-border hover-lift group relative overflow-hidden shadow-card">
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className={
                        product.badge === 'İndirimde' 
                          ? 'bg-destructive text-destructive-foreground'
                          : product.badge === 'Yeni'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-accent-foreground'
                      }>
                        {product.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Heart icon */}
                  <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80">
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

                    {/* Specs */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.specs.map((spec, index) => (
                        <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>

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

                    {/* Stock Status */}
                    <div className="mb-4">
                      {product.inStock ? (
                        <span className="text-xs text-green-600 font-medium">✓ Stokta var</span>
                      ) : (
                        <span className="text-xs text-destructive font-medium">Stokta yok</span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        disabled={!product.inStock}
                      >
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

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Önceki</Button>
                <Button variant="default" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">Sonraki</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;