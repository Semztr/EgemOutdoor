import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Heart, ShoppingCart, Star, Search, Filter, Fish, Shirt, Tent, Waves, Dumbbell, CupSoda } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';

import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/format';

const Products = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [supaProducts, setSupaProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  // Use Supabase products as the source
  const allProducts = supaProducts;

  const uniqueBrands = Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean)));
  const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)));

  // Filter products based on search query + filters
  const filteredProducts = (searchQuery ? allProducts : allProducts)
    .filter(product => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!(
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q)
        )) return false;
      }
      if (selectedBrands.length && !selectedBrands.includes(product.brand)) return false;
      if (selectedCategories.length && !selectedCategories.includes(product.category)) return false;
      if (inStockOnly && !product.inStock) return false;
      const minOk = priceMin ? product.price >= Number(priceMin) : true;
      const maxOk = priceMax ? product.price <= Number(priceMax) : true;
      return minOk && maxOk;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

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

  // Load products from Supabase
  useEffect(() => {
    let ignore = false;
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('products')
          .select('id, name, description, brand, price, original_price, image_url, category, stock_quantity, is_active, created_at, featured, badge, badges, color_images')
          .eq('is_active', true);

        // Apply search filter if query exists
        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        if (!ignore && data) {
          const mapped = data.map((p: any) => {
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
              originalPrice: (p as any).original_price || null,
              image: finalImageUrl ?? '/placeholder.svg',
              badge: p.badge || (p.featured ? 'Öne Çıkan' : null),
              badges: p.badges || [],
              category: p.category ?? '',
              inStock: (p.stock_quantity ?? 0) > 0,
              stock_quantity: p.stock_quantity ?? 0,
              color_images: p.color_images || null,
            };
          });
          setSupaProducts(mapped);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to load products:', err);
          setError('Ürünler yüklenirken bir hata oluştu.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadProducts();
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
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Ürünler yükleniyor...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Bir Hata Oluştu</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>Tekrar Dene</Button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!loading && !error && searchQuery ? (
          <section className="py-12">
            <div className="container mx-auto px-4">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                      <div className="relative">
                        {product.badge && (
                          <div className="absolute top-3 left-3 z-10">
                            <Badge 
                              variant={
                                product.badge === 'İndirim' ? 'destructive' : 
                                product.badge === 'Yeni' ? 'default' :
                                product.badge === 'Çok Satan' ? 'secondary' :
                                'default'
                              }
                              className={
                                product.badge === 'Yeni' ? 'bg-blue-500 hover:bg-blue-600' :
                                product.badge === 'Çok Satan' ? 'bg-green-500 hover:bg-green-600' :
                                product.badge === 'Özel' ? 'bg-purple-500 hover:bg-purple-600' :
                                ''
                              }
                            >
                              {product.badge}
                            </Badge>
                          </div>
                        )}

                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(product.id);
                          }}
                        >
                          <Heart 
                            className={`h-4 w-4 transition-colors ${
                              isFavorite(product.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-muted-foreground'
                            }`} 
                          />
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
                            {product.inStock ? (
                              <Badge variant="default" className="bg-green-500 text-xs">
                                Stokta ({product.stock_quantity} adet)
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                Stokta Yok
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {product.originalPrice && product.originalPrice > product.price ? (
                              <>
                                <span className="text-xs sm:text-sm text-muted-foreground line-through">{product.originalPrice}₺</span>
                                <span className="text-base sm:text-lg font-bold text-red-600 dark:text-red-500">{product.price}₺</span>
                                <span className="text-xs font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-2 py-0.5 rounded">
                                  %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}
                                </span>
                              </>
                            ) : (
                              <span className="text-base sm:text-lg font-semibold text-primary">{product.price}₺</span>
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
        ) : !loading && !error ? (
          <>
            <section className="py-8 md:py-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <aside className="md:col-span-3 lg:col-span-3 xl:col-span-2 border border-border rounded-lg p-4 h-fit sticky top-4 bg-background">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">Filtreler</h3>
                      <Button type="button" variant="ghost" size="icon" onClick={() => setFiltersOpen(v => !v)}>
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                    {filtersOpen && (
                      <div className="space-y-5">
                        <div>
                          <div className="text-sm font-medium mb-2">Sırala</div>
                          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sırala" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newest">En yeni</SelectItem>
                              <SelectItem value="price_asc">Fiyat: Artan</SelectItem>
                              <SelectItem value="price_desc">Fiyat: Azalan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-2">Fiyat</div>
                          <div className="flex gap-2 mb-2">
                            <Input placeholder="Min" inputMode="numeric" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
                            <Input placeholder="Max" inputMode="numeric" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: '0-250', min: 0, max: 250 },
                              { label: '250-500', min: 250, max: 500 },
                              { label: '500-1000', min: 500, max: 1000 },
                              { label: '1000-2000', min: 1000, max: 2000 },
                            ].map(p => (
                              <Button key={p.label} type="button" size="sm" variant="outline" onClick={() => { setPriceMin(String(p.min)); setPriceMax(String(p.max)); }}>
                                {p.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-2">Kategori</div>
                          {uniqueCategories.map((cat) => (
                            <label key={cat} className="flex items-center gap-2 text-sm mb-2">
                              <input
                                type="checkbox"
                                className="accent-primary"
                                checked={selectedCategories.includes(cat)}
                                onChange={(e) => setSelectedCategories(prev => e.target.checked ? [...prev, cat] : prev.filter(c => c !== cat))}
                              />
                              <span>{cat}</span>
                            </label>
                          ))}
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-2">Marka</div>
                          <Input placeholder="Marka ara" value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} className="mb-2" />
                          {uniqueBrands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase())).map((brand) => (
                            <label key={brand} className="flex items-center gap-2 text-sm mb-2">
                              <input
                                type="checkbox"
                                className="accent-primary"
                                checked={selectedBrands.includes(brand)}
                                onChange={(e) => setSelectedBrands(prev => e.target.checked ? [...prev, brand] : prev.filter(b => b !== brand))}
                              />
                              <span>{brand}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="accent-primary" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} />
                            <span>Stoktakiler</span>
                          </label>
                          <Button type="button" variant="outline" size="sm" onClick={() => { setSelectedBrands([]); setSelectedCategories([]); setInStockOnly(false); setPriceMin(''); setPriceMax(''); setBrandSearch(''); setSortBy('newest'); }}>Sıfırla</Button>
                        </div>
                      </div>
                    )}
                  </aside>

                  <div className="md:col-span-9 lg:col-span-9 xl:col-span-10">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Tüm Ürünler</h2>
                      <div className="text-sm text-muted-foreground">{loading ? 'Yükleniyor...' : `${supaProducts.length || filteredProducts.length} ürün`}</div>
                    </div>
                    {(supaProducts.length > 0 ? supaProducts : filteredProducts).length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 items-stretch">
                        {(supaProducts.length > 0 ? supaProducts : filteredProducts).map((product) => (
                          <Card key={product.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden relative flex flex-col h-full">
                            <div className="relative flex flex-col h-full">
                              {/* Badges - Sağ Üst */}
                              {(() => {
                                const badgeLabels: Record<string, string> = {
                                  'popular': 'Popüler',
                                  'bestseller': 'Çok Satan',
                                  'new': 'Yeni',
                                  'discount': 'İndirimli',
                                  'featured': 'Öne Çıkan',
                                };
                                const badgeColors: Record<string, string> = {
                                  'popular': 'bg-purple-500 text-white',
                                  'bestseller': 'bg-orange-500 text-white',
                                  'new': 'bg-green-500 text-white',
                                  'discount': 'bg-red-500 text-white',
                                  'featured': 'bg-blue-500 text-white',
                                };
                                const displayBadges = (product as any).badges && (product as any).badges.length > 0
                                  ? (product as any).badges
                                  : (product.badge ? [product.badge] : []);
                                return displayBadges.length > 0 ? (
                                  <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                                    {displayBadges.map((badge: string, index: number) => {
                                      const label = badgeLabels[badge] || badge;
                                      const color = badgeColors[badge] || 'bg-orange-500 text-white';
                                      return (
                                        <span key={index} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${color}`}>
                                          {label}
                                        </span>
                                      );
                                    })}
                                  </div>
                                ) : null;
                              })()}

                              {/* Heart - Sol Üst */}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleFavorite(product.id);
                                }}
                              >
                                <Heart 
                                  className={`h-4 w-4 transition-colors ${
                                    isFavorite(product.id) 
                                      ? 'fill-red-500 text-red-500' 
                                      : 'text-muted-foreground'
                                  }`} 
                                />
                              </Button>
                              <CardContent className="p-2 md:p-3 flex flex-col h-full">
                                <Link to={`/urun/${product.id}`}>
                                  <div className="aspect-square bg-muted rounded-md mb-2 overflow-hidden flex items-center justify-center">
                                    {'image' in product && product.image ? (
                                      <img
                                        src={(product as any).image}
                                        alt={product.name}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                          const t = e.currentTarget as HTMLImageElement;
                                          if (t.dataset.fallback !== '1') { t.dataset.fallback = '1'; t.src = `https://via.placeholder.com/600x750.png?text=${encodeURIComponent('EgemOutdoor')}`; }
                                        }}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-6xl">🛒</div>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-primary font-medium mb-1">{product.brand}</div>
                                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2 min-h-[32px] group-hover:text-primary transition-colors cursor-pointer text-xs md:text-sm">
                                    {product.name}
                                  </h3>
                                </Link>
                                <div className="min-h-[32px]">
                                  {product.description && (
                                    <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2">
                                      {product.description}
                                    </p>
                                  )}
                                </div>
                                
                                {/* Fiyat ve Butonlar - Birlikte en alta yapış */}
                                <div className="mt-auto flex flex-col gap-2">
                                  <div className="flex items-center gap-1.5 flex-wrap min-h-[28px]">
                                    {product.originalPrice && product.originalPrice > product.price ? (
                                      <>
                                        <span className="text-xs text-muted-foreground line-through">₺{formatPrice(product.originalPrice)}</span>
                                        <span className="text-lg font-bold text-red-600 dark:text-red-500">₺{formatPrice(product.price)}</span>
                                        <span className="text-xs font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-2 py-0.5 rounded">
                                          %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-lg font-bold text-primary">₺{formatPrice(product.price)}</span>
                                    )}
                                  </div>
                                  <div className="flex gap-1.5">
                                  <Button 
                                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                                    size="sm" 
                                    className="flex-1 text-[10px] md:text-xs h-7 md:h-8"
                                  >
                                    <ShoppingCart className="h-3 w-3 mr-0.5" />
                                    Sepete
                                  </Button>
                                  <Link to={`/urun/${product.id}`}>
                                    <Button variant="outline" size="sm" className="text-[10px] md:text-xs h-7 md:h-8 px-2">İncele</Button>
                                  </Link>
                                </div>
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
                </div>
              </div>
            </section>

            <section className="py-12 md:py-16">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Popüler Kategoriler</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { name: "Balık Av Malzemeleri", icon: Fish, path: "/balik-av-malzemeleri" },
                    { name: "Outdoor Giyim", icon: Shirt, path: "/outdoor-giyim" },
                    { name: "Kamp Malzemeleri", icon: Tent, path: "/kamp-malzemeleri" },
                    { name: "Dalış Ürünleri", icon: Waves, path: "/dalis-urunleri" },
                    { name: "Spor Malzemeleri", icon: Dumbbell, path: "/spor-malzemeleri" },
                    { name: "Termoslar ve Mataralar", icon: CupSoda, path: "/termoslar-mataralar" }
                  ].map((category, index) => (
                    <Link
                      key={index}
                      to={category.path}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="group animate-fade-in rounded-2xl border border-border bg-card p-6 text-center transition-smooth hover:shadow-lg hover:ring-1 hover:ring-primary/30"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 transition-colors group-hover:scale-110 transition-transform">
                        {React.createElement(category.icon, { className: 'h-6 w-6 text-muted-foreground group-hover:text-primary' })}
                      </div>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                        {category.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-muted/50 py-14 mt-2">
              <div className="container mx-auto px-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Ürün Ara</h2>
                  <p className="text-muted-foreground">Aradığını bulamadın mı? Aşağıdaki arama ile devam et.</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); if (localSearchQuery.trim()) { window.location.href = `/urunler?search=${encodeURIComponent(localSearchQuery.trim())}`; } }} className="max-w-2xl mx-auto flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input type="text" placeholder="Ürün ara..." className="pl-10" value={localSearchQuery} onChange={(e) => setLocalSearchQuery(e.target.value)} />
                  </div>
                  <Button type="submit" variant="default" className="hover-scale transition-smooth">
                    <Search className="h-4 w-4 mr-2" />
                    Ara
                  </Button>
                </form>
              </div>
            </section>
          </>
        ) : null}
      </main>
      <Footer />
    </div>
  </>
  );
};

export default Products;