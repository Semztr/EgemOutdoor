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
import { Helmet } from 'react-helmet-async';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const location = useLocation();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

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
              name: "Daiwa Saltiga Dogfight Olta Makinesi",
              brand: "Daiwa",
              price: 12850,
              originalPrice: 14500,
              rating: 4.9,
              reviews: 156,
              image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=500&fit=crop",
              badge: "İndirimde",
              inStock: true,
              specs: ["Ultra Dayanıklı", "Profesyonel", "10kg"]
            },
            {
              id: 2,
              name: "Savage Gear 3D Suicide Duck Yem",
              brand: "Savage Gear",
              price: 485,
              originalPrice: null,
              rating: 4.8,
              reviews: 234,
              image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=500&fit=crop",
              badge: "Çok Satan",
              inStock: true,
              specs: ["3D Gerçekçi", "Yüzer", "15cm"]
            },
            {
              id: 7,
              name: "Okuma Safina Pro Spinning Makara",
              brand: "Okuma",
              price: 2240,
              originalPrice: null,
              rating: 4.7,
              reviews: 98,
              image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=500&fit=crop&brightness=0.8",
              badge: "Yeni",
              inStock: true,
              specs: ["8 Rulman", "Hafif", "Güçlü"]
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
              id: 3,
              name: "Jack Wolfskin Texapore Outdoor Mont",
              brand: "Jack Wolfskin",
              price: 3240,
              originalPrice: 3850,
              rating: 4.9,
              reviews: 189,
              image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
              badge: "İndirimde",
              inStock: true,
              specs: ["Su Geçirmez", "Nefes Alır", "S-XXL"]
            },
            {
              id: 6,
              name: "Helly Hansen Workwear Outdoor Pantolon",
              brand: "Helly Hansen",
              price: 1850,
              originalPrice: 2100,
              rating: 4.6,
              reviews: 267,
              image: "https://images.unsplash.com/photo-1473692623410-12fac8ef75c6?w=500&h=500&fit=crop",
              badge: "İndirimde",
              inStock: true,
              specs: ["Stretch", "Su İtici", "46-62"]
            },
            {
              id: 5,
              name: "Asolo Falcon GV Trekking Botu",
              brand: "Asolo",
              price: 4580,
              originalPrice: null,
              rating: 5.0,
              reviews: 178,
              image: "https://images.unsplash.com/photo-1542840410-3092f99611a3?w=500&h=500&fit=crop",
              badge: "Premium",
              inStock: true,
              specs: ["Gore-Tex", "Vibram", "40-46"]
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
              id: 4,
              name: "Stanley Adventure Soğuk Tutucu Termos 1L",
              brand: "Stanley",
              price: 890,
              originalPrice: 1050,
              rating: 4.7,
              reviews: 421,
              image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
              badge: "İndirimde",
              inStock: true,
              specs: ["1 Litre", "24h Sıcak", "32h Soğuk"]
            },
            {
              id: 8,
              name: "Coleman Sundome 4 Kişilik Çadır",
              brand: "Coleman",
              price: 1850,
              originalPrice: 2100,
              rating: 4.6,
              reviews: 278,
              image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&h=500&fit=crop",
              badge: "İndirimde",
              inStock: true,
              specs: ["4 Kişilik", "Su Geçirmez", "Kolay Kurulum"]
            },
            {
              id: 9,
              name: "MSR PocketRocket 2 Mini Ocak",
              brand: "MSR",
              price: 750,
              originalPrice: null,
              rating: 4.8,
              reviews: 345,
              image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&h=500&fit=crop",
              badge: "Çok Satan",
              inStock: true,
              specs: ["Gazlı", "Hafif", "Taşınabilir"]
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
              image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&h=500&fit=crop",
              badge: "Klasik",
              inStock: true,
              specs: ["15 Fonksiyon", "Paslanmaz", "İsviçre"]
            },
            {
              id: 11,
              name: "Mora Companion Heavy Duty Bıçak",
              brand: "Mora",
              price: 450,
              originalPrice: null,
              rating: 4.8,
              reviews: 456,
              image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&h=500&fit=crop",
              badge: "Popüler",
              inStock: true,
              specs: ["Carbon Çelik", "Ergonomik", "Kılıflı"]
            },
            {
              id: 12,
              name: "Opinel No.8 Katlanır Bıçak",
              brand: "Opinel",
              price: 180,
              originalPrice: 220,
              rating: 4.7,
              reviews: 890,
              image: "https://images.unsplash.com/photo-1593207728683-3c2d3fc39ef1?w=500&h=500&fit=crop",
              badge: "İndirimde",
              inStock: true,
              specs: ["Ahşap Saplı", "Fransız", "Güvenlik Kilidi"]
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

  // Filter products based on active filters
  const filteredProducts = categoryData.products.filter(product => {
    return Object.entries(activeFilters).every(([filterName, values]) => {
      if (values.length === 0) return true;
      
      // Simple filtering logic - you can enhance this based on your needs
      if (filterName === 'Marka') {
        return values.includes(product.brand);
      }
      // Add more filter logic here for other filter types
      return true;
    });
  });

  const handleFilterChange = (filterName: string, value: string, checked: boolean) => {
    setActiveFilters(prev => {
      const currentValues = prev[filterName] || [];
      if (checked) {
        return { ...prev, [filterName]: [...currentValues, value] };
      } else {
        return { ...prev, [filterName]: currentValues.filter(v => v !== value) };
      }
    });
  };

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
    <>
      <Helmet>
        <title>{categoryData.title} | BalıkPro - {categoryData.description}</title>
        <meta name="description" content={`${categoryData.description} ${categoryData.totalProducts} ürün ile geniş seçenek. Ücretsiz kargo fırsatı.`} />
        <meta name="keywords" content={`${categoryData.title.toLowerCase()}, ${categoryData.title}, balık av malzemeleri, outdoor`} />
        <link rel="canonical" href={`https://balikpro.com${currentPath}`} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 animate-fade-in">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Ana Sayfa</Link>
            <span>/</span>
            <Link to="/urun-kategorileri" className="hover:text-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Ürün Kategorileri</Link>
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
                         <input 
                           type="checkbox" 
                           className="rounded border-border"
                           checked={(activeFilters[filterGroup.name] || []).includes(option)}
                           onChange={(e) => handleFilterChange(filterGroup.name, option, e.target.checked)}
                         />
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
              {filteredProducts.map((product, index) => (
                <Card key={product.id} className="group hover:shadow-lg hover-scale transition-all duration-300 cursor-pointer overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <Link to={`/urun/${product.id}`} className="block" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
                      <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover-scale">
                        <Heart className="h-4 w-4" />
                      </Button>

                      <CardContent className="p-6">
                        {/* Product image */}
                        <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
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
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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
                          className="w-full hover-scale transition-smooth" 
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
  </>
  );
};

export default CategoryPage;