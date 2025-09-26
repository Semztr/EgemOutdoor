import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart, Star, Filter, Grid, List } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const location = useLocation();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState('grid');

  // Determine category from URL
  const currentPath = location.pathname;
  
  const getCategoryData = () => {
    switch (currentPath) {
      case '/balik-av-malzemeleri':
        return {
          title: "Balık Av Malzemeleri",
          description: "Profesyonel balıkçılık için özel tasarlanmış, kaliteli balık av malzemeleri.",
          totalProducts: 156,
          filters: [
            { name: "Marka", options: ["Daiwa", "Shimano", "Penn", "Abu Garcia"] },
            { name: "Uzunluk", options: ["2.1m", "2.4m", "2.7m", "3.0m", "3.6m"] },
            { name: "Test", options: ["5-25g", "10-40g", "20-60g", "40-100g"] },
            { name: "Fiyat", options: ["0-500₺", "500-1000₺", "1000-2000₺", "2000₺+"] }
          ],
          products: [
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
            }
          ]
        };
      
      case '/outdoor-giyim':
        return {
          title: "Outdoor Giyim",
          description: "Doğa sporları ve outdoor aktiviteler için profesyonel kıyafetler.",
          totalProducts: 89,
          filters: [
            { name: "Marka", options: ["Columbia", "The North Face", "Merrell", "Patagonia"] },
            { name: "Kategori", options: ["Mont", "Pantolon", "Ayakkabı", "Aksesuar"] },
            { name: "Beden", options: ["XS", "S", "M", "L", "XL", "XXL"] },
            { name: "Fiyat", options: ["0-300₺", "300-600₺", "600-1000₺", "1000₺+"] }
          ],
          products: [
            {
              id: 4,
              name: "Columbia Watertight II Yağmurluk",
              brand: "Columbia",
              price: 420,
              originalPrice: 480,
              rating: 4.7,
              reviews: 203,
              image: "🧥",
              badge: "İndirimde",
              inStock: true,
              specs: ["Su Geçirmez", "Nefes Alır", "XS-XXL Beden"]
            },
            {
              id: 5,
              name: "The North Face Trekking Pantolon",
              brand: "The North Face",
              price: 650,
              originalPrice: null,
              rating: 4.8,
              reviews: 156,
              image: "👖",
              badge: "Popüler",
              inStock: true,
              specs: ["Stretch Kumaş", "UPF 40+", "Hızlı Kurur"]
            },
            {
              id: 6,
              name: "Merrell Hiking Bot",
              brand: "Merrell",
              price: 890,
              originalPrice: null,
              rating: 4.9,
              reviews: 342,
              image: "🥾",
              badge: "Çok Satan",
              inStock: true,
              specs: ["Su Geçirmez", "Vibram Taban", "36-45 Numara"]
            }
          ]
        };
      
      case '/kamp-malzemeleri':
        return {
          title: "Kamp Malzemeleri",
          description: "Doğada konforlu kamp deneyimi için gerekli tüm malzemeler.",
          totalProducts: 124,
          filters: [
            { name: "Marka", options: ["Coleman", "Campingaz", "Thermos", "MSR"] },
            { name: "Kategori", options: ["Çadır", "Ocak", "Uyku", "Mutfak"] },
            { name: "Kapasite", options: ["1-2 Kişi", "3-4 Kişi", "5+ Kişi"] },
            { name: "Fiyat", options: ["0-500₺", "500-1000₺", "1000-2000₺", "2000₺+"] }
          ],
          products: [
            {
              id: 7,
              name: "Coleman Sundome 4 Kişilik Çadır",
              brand: "Coleman",
              price: 1850,
              originalPrice: 2100,
              rating: 4.6,
              reviews: 278,
              image: "⛺",
              badge: "İndirimde",
              inStock: true,
              specs: ["4 Kişilik", "Su Geçirmez", "Kolay Kurulum"]
            },
            {
              id: 8,
              name: "Campingaz Party Grill 600 Ocak",
              brand: "Campingaz",
              price: 750,
              originalPrice: null,
              rating: 4.8,
              reviews: 145,
              image: "🔥",
              badge: "Yeni",
              inStock: true,
              specs: ["Gazlı Ocak", "Izgara Özelliği", "Taşınabilir"]
            },
            {
              id: 9,
              name: "Thermos Paslanmaz Termos 1L",
              brand: "Thermos",
              price: 320,
              originalPrice: null,
              rating: 4.7,
              reviews: 567,
              image: "🍺",
              badge: "Çok Satan",
              inStock: true,
              specs: ["1 Litre", "24 Saat Sıcak", "Paslanmaz Çelik"]
            }
          ]
        };
      
      case '/caki-bicak':
        return {
          title: "Çakı & Bıçak",
          description: "Outdoor aktiviteler ve günlük kullanım için kaliteli çakı ve bıçaklar.",
          totalProducts: 67,
          filters: [
            { name: "Marka", options: ["Victorinox", "Mora", "Opinel", "Benchmade"] },
            { name: "Tip", options: ["Çakı", "Sabit Bıçak", "Katlanır Bıçak"] },
            { name: "Boyut", options: ["Küçük", "Orta", "Büyük"] },
            { name: "Fiyat", options: ["0-200₺", "200-500₺", "500-1000₺", "1000₺+"] }
          ],
          products: [
            {
              id: 10,
              name: "Victorinox Swiss Army Huntsman",
              brand: "Victorinox",
              price: 680,
              originalPrice: null,
              rating: 4.9,
              reviews: 1203,
              image: "🔪",
              badge: "Klasik",
              inStock: true,
              specs: ["15 Fonksiyon", "Paslanmaz Çelik", "İsviçre Yapımı"]
            },
            {
              id: 11,
              name: "Mora Companion Heavy Duty Bıçak",
              brand: "Mora",
              price: 450,
              originalPrice: null,
              rating: 4.8,
              reviews: 456,
              image: "🗡️",
              badge: "Popüler",
              inStock: true,
              specs: ["Carbon Çelik", "Ergonomik Sap", "Kılıf Dahil"]
            },
            {
              id: 12,
              name: "Opinel No.8 Katlanır Bıçak",
              brand: "Opinel",
              price: 180,
              originalPrice: 220,
              rating: 4.7,
              reviews: 890,
              image: "🪓",
              badge: "İndirimde",
              inStock: true,
              specs: ["Ahşap Saplı", "Fransız Yapımı", "Güvenlik Kilidi"]
            }
          ]
        };
      
      default:
        return {
          title: "Ürünler",
          description: "Tüm ürünlerimizi inceleyin.",
          totalProducts: 0,
          filters: [],
          products: []
        };
    }
  };

  const categoryData = getCategoryData();

  const handleAddToCart = (product: any) => {
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
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Ana Sayfa</Link>
          <span>/</span>
          <Link to="/urun-kategorileri" className="hover:text-primary">Ürün Kategorileri</Link>
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
              
              {categoryData.filters.map((filterGroup, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <h4 className="font-medium text-foreground mb-3">{filterGroup.name}</h4>
                  <div className="space-y-2">
                    {filterGroup.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-sm text-muted-foreground hover:text-foreground">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sorting and View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Select defaultValue="relevant">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sıralama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevant">Önerilen</SelectItem>
                    <SelectItem value="price-asc">Fiyat: Düşükten Yükseğe</SelectItem>
                    <SelectItem value="price-desc">Fiyat: Yüksekten Düşüğe</SelectItem>
                    <SelectItem value="rating">En Yüksek Puan</SelectItem>
                    <SelectItem value="newest">En Yeniler</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" : "space-y-4 mb-8"}>
              {categoryData.products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden">
                  <Link to={`/urun/${product.id}`} className="block">
                    <div className="relative">
                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-3 left-3 z-10">
                          <Badge variant={product.badge === 'İndirimde' ? 'destructive' : 'default'}>
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
                          <span className="text-xl font-bold text-primary">{product.price}₺</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {product.originalPrice}₺
                            </span>
                          )}
                        </div>

                        {/* Add to cart button */}
                        <Button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          size="sm" 
                          className="w-full" 
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                        </Button>
                      </CardContent>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2">
              <Button variant="outline" size="sm">Önceki</Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Sonraki</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;