import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, ShoppingCart, Star, Search, Filter } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import FeaturedProducts from '@/components/FeaturedProducts';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';

const Products = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { addItem } = useCart();
  const { toast } = useToast();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [supaProducts, setSupaProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock products data with search functionality
  const allProducts = [
    // Balık Av Malzemeleri
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
      category: "Balık Av Malzemeleri",
      inStock: true
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
      category: "Balık Av Malzemeleri",
      inStock: true
    },
    // Outdoor Giyim
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
      category: "Outdoor Giyim",
      inStock: true
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
      category: "Outdoor Giyim",
      inStock: true
    },
    // Kamp Malzemeleri
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
      category: "Kamp Malzemeleri",
      inStock: true
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
      category: "Kamp Malzemeleri",
      inStock: true
    }
  ];

  // Filter products based on search query
  const filteredProducts = searchQuery 
    ? allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allProducts;

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

  // Load recent active products from Supabase when not searching
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (searchQuery) return; // keep search behavior intact
      setLoading(true);
      try {
        const { data, error } = await (supabase as any)
          .from('products')
          .select('id, name, brand, price, image_url, is_active, created_at')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(20);
        if (!ignore && !error && data) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            brand: p.brand ?? '',
            price: p.price,
            image: p.image_url ?? '',
            badge: null,
          }));
          setSupaProducts(mapped);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [searchQuery]);

  return (
    <>
      <Helmet>
        <title>{searchQuery ? `"${searchQuery}" Arama Sonuçları | EgemOutdoor` : 'Tüm Ürünler | EgemOutdoor - Balık Av Malzemeleri & Outdoor Ürünleri'}</title>
        <meta name="description" content={searchQuery ? `"${searchQuery}" için ${filteredProducts.length} ürün bulundu. Balık av malzemeleri ve outdoor ürünlerinde en iyi fiyatlar.` : 'Balık av malzemeleri, outdoor giyim ve kamp ekipmanları. Daiwa, Shimano, Penn gibi markaların tüm ürünlerini keşfedin.'} />
        <meta name="keywords" content="balık av malzemeleri, ürünler, olta kamışı, makara, outdoor giyim" />
        <link rel="canonical" href={`https://egemoutdoor.com/urunler${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
      <main>
        {/* Search Header */}
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {searchQuery ? `"${searchQuery}" için arama sonuçları` : 'Tüm Ürünler'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {searchQuery 
                  ? `${filteredProducts.length} ürün bulundu`
                  : 'Balıkçılık ve outdoor yaşam için ihtiyacınız olan tüm ürünleri keşfedin'
                }
              </p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (localSearchQuery.trim()) {
                window.location.href = `/urunler?search=${encodeURIComponent(localSearchQuery.trim())}`;
              }
            }} className="max-w-2xl mx-auto flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Ürün ara..."
                  className="pl-10"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" variant="default" className="hover-scale transition-smooth">
                <Search className="h-4 w-4 mr-2" />
                Ara
              </Button>
            </form>
          </div>
        </section>
        {/* Search Results */}
        {searchQuery ? (
          <section className="py-12">
            <div className="container mx-auto px-4">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                      <div className="relative">
                        {product.badge && (
                          <div className="absolute top-3 left-3 z-10">
                            <Badge variant={product.badge === 'İndirimde' ? 'destructive' : 'default'}>
                              {product.badge}
                            </Badge>
                          </div>
                        )}

                        <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80">
                          <Heart className="h-4 w-4" />
                        </Button>

                        <CardContent className="p-4 sm:p-5">
                          <Link to={`/urun/${product.id}`}>
                            <div className="aspect-[4/5] bg-muted rounded-md mb-3 overflow-hidden flex items-center justify-center">
                              <div className="w-full h-full flex items-center justify-center text-6xl">
                                {product.image}
                              </div>
                            </div>
                            <div className="text-xs text-primary font-medium mb-1">{product.brand}</div>
                            <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer text-sm sm:text-base">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-accent text-accent" />
                              <span className="ml-1 text-sm font-medium">{product.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">({product.reviews})</span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-base sm:text-lg font-semibold text-primary">{product.price}₺</span>
                            {product.originalPrice && (
                              <span className="text-xs sm:text-sm text-muted-foreground line-through">{product.originalPrice}₺</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              size="sm" 
                              className="flex-1 hover-scale transition-smooth min-h-10" 
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                            </Button>
                            <Link to={`/urun/${product.id}`}>
                              <Button variant="outline" size="sm" className="min-h-10">İncele</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Sonuç bulunamadı</h3>
                  <p className="text-muted-foreground mb-6">"{searchQuery}" için hiçbir ürün bulunamadı. Farklı kelimeler deneyebilirsiniz.</p>
                  <Button asChild className="hover-scale transition-smooth">
                    <Link to="/urunler" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Tüm Ürünleri Görüntüle</Link>
                  </Button>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* Featured Products */}
            <FeaturedProducts />
            
            {/* Supabase Product Grid */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Yeni Ürünler</h2>
                  <div className="text-sm text-muted-foreground">{loading ? 'Yükleniyor...' : `${supaProducts.length} ürün`}</div>
                </div>
                {supaProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {supaProducts.map((product) => (
                      <Card key={product.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                        <div className="relative">
                          <Button variant="ghost" size="icon" className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <CardContent className="p-4 sm:p-5">
                            <Link to={`/urun/${product.id}`}>
                              <div className="aspect-[4/5] bg-muted rounded-md mb-3 overflow-hidden flex items-center justify-center">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const t = e.currentTarget as HTMLImageElement;
                                      if (t.dataset.fallback !== '1') { t.dataset.fallback = '1'; t.src = `https://via.placeholder.com/600x750.png?text=${encodeURIComponent('EgemOutdoor')}`; }
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-6xl">🛒</div>
                                )}
                              </div>
                              <div className="text-xs text-primary font-medium mb-1">{product.brand}</div>
                              <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer text-sm sm:text-base">
                                {product.name}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-base sm:text-lg font-semibold text-primary">{product.price}₺</span>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                                size="sm" 
                                className="flex-1 hover-scale transition-smooth min-h-10"
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Sepete Ekle
                              </Button>
                              <Link to={`/urun/${product.id}`}>
                                <Button variant="outline" size="sm" className="min-h-10">İncele</Button>
                              </Link>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">Gösterilecek ürün bulunamadı.</div>
                )}
              </div>
            </section>
            
            {/* Categories Section */}
            <section className="py-20">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Popüler Kategoriler</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    { name: "Olta Kamışı", icon: "🎣", count: 156, path: "/balik-av-malzemeleri" },
                    { name: "Makara", icon: "⚙️", count: 89, path: "/balik-av-malzemeleri" },
                    { name: "Yem & Oltalar", icon: "🪝", count: 234, path: "/balik-av-malzemeleri" },
                    { name: "Balık Çantası", icon: "🎒", count: 67, path: "/balik-av-malzemeleri" },
                    { name: "Outdoor Kıyafet", icon: "👕", count: 145, path: "/outdoor-giyim" },
                    { name: "Kamp Malzemeleri", icon: "🏕️", count: 123, path: "/kamp-malzemeleri" }
                  ].map((category, index) => (
                    <Link 
                      key={index} 
                      to={category.path}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="text-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group hover-scale animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{category.icon}</div>
                      <h3 className="font-medium text-foreground mb-1 group-hover:text-primary">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">{category.count} ürün</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  </>
  );
};

export default Products;