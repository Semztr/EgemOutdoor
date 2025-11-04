import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, ShoppingCart, Search, Filter, Fish, Shirt, Tent, Waves, Dumbbell, CupSoda } from 'lucide-react';
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
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'best_seller' | 'most_reviewed' | 'highest_rated' | 'discount'>('newest');
  const [dynamicFilters, setDynamicFilters] = useState<{ name: string; options: string[] }[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Use Supabase products as the source
  const allProducts = supaProducts;

  // Filter products based on search query + dynamic filters
  const filteredProducts = React.useMemo(() => {
    console.log('[Products] Filtering:', { 
      totalProducts: allProducts.length, 
      activeFilters, 
      searchQuery,
      sortBy 
    });
    
    return (searchQuery ? allProducts : allProducts)
    .filter(product => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!(
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q)
        )) return false;
      }
      
      // Dinamik filtreler
      for (const [filterName, filterValues] of Object.entries(activeFilters)) {
        if (filterValues.length === 0) continue;
        
        if (filterName === 'Marka') {
          if (!filterValues.includes(product.brand)) return false;
        } else if (filterName === 'Kategori') {
          let categoryMatch = false;
          for (const filterValue of filterValues) {
            const filterStr = String(filterValue || '');
            const isIndented = filterStr.startsWith('  ');
            if (isIndented) {
              // Alt kategori kontrolü
              const subCat = filterStr.trim().toLowerCase().replace(/\s+/g, '-');
              if (product.category && product.category.toLowerCase().includes(subCat)) {
                categoryMatch = true;
                break;
              }
            } else {
              // Ana kategori kontrolü
              const mainCat = filterStr.toLowerCase().replace(/\s+/g, '-');
              if (product.category && product.category.toLowerCase().includes(mainCat)) {
                categoryMatch = true;
                break;
              }
            }
          }
          if (!categoryMatch) return false;
        } else if (filterName === 'Beden') {
          if (!product.sizes || !product.sizes.some((size: string) => filterValues.includes(size))) return false;
        } else if (filterName === 'Numara') {
          if (!product.shoe_sizes || !product.shoe_sizes.some((size: string) => filterValues.includes(size))) return false;
        } else if (filterName === 'Ağırlık') {
          if (!product.weights || !product.weights.some((weight: string) => filterValues.includes(weight))) return false;
        } else if (filterName === 'Renk') {
          if (!filterValues.includes(product.color)) return false;
        }
      }
      
      // Eski filtreler (geriye dönük uyumluluk)
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
        case 'best_seller':
          // Çok satan ürünler için badge kontrolü
          const aIsBestseller = (a.badges && a.badges.includes('bestseller')) || a.badge === 'Çok Satan';
          const bIsBestseller = (b.badges && b.badges.includes('bestseller')) || b.badge === 'Çok Satan';
          if (aIsBestseller && !bIsBestseller) return -1;
          if (!aIsBestseller && bIsBestseller) return 1;
          return 0;
        case 'discount':
          // İndirimli ürünler için orijinal fiyat kontrolü
          const aDiscount = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
          const bDiscount = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
          return bDiscount - aDiscount;
        case 'newest':
        default:
          return 0; // Varsayılan sıralama (created_at desc zaten Supabase'de yapılıyor)
      }
    });
  }, [allProducts, activeFilters, searchQuery, sortBy, selectedBrands, selectedCategories, inStockOnly, priceMin, priceMax]);

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
          .select('id, name, description, brand, price, original_price, image_url, category, stock_quantity, is_active, created_at, featured, badge, badges, color_images, sizes, shoe_sizes, weights, colors')
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
              sizes: p.sizes || [],
              shoe_sizes: p.shoe_sizes || [],
              weights: p.weights || [],
              color: p.colors || null,
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

  // Dinamik filtreleri yükle
  useEffect(() => {
    let ignore = false;
    const loadDynamicFilters = async () => {
      try {
        if (supaProducts.length === 0) return;
        
        const data = supaProducts;
        
        // Marka filtresini oluştur
        const brands: string[] = [];
        data.forEach(p => {
          if (p.brand && typeof p.brand === 'string' && p.brand.trim() && !brands.includes(p.brand)) {
            brands.push(p.brand);
          }
        });
        brands.sort();
        
        // Kategori filtresini oluştur (hiyerarşik)
        const categoryMap = new Map<string, Set<string>>();
        data.forEach(p => {
          if (p.category && typeof p.category === 'string' && p.category.trim()) {
            const parts = p.category.split('/');
            if (parts.length >= 1) {
              // Ana kategori
              const mainCat = parts[0];
              const mainTitle = mainCat
                .split('-')
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              
              if (!categoryMap.has(mainTitle)) {
                categoryMap.set(mainTitle, new Set());
              }
              
              // Alt kategori varsa
              if (parts.length >= 2) {
                const subCat = parts[parts.length - 1];
                const subTitle = subCat
                  .split('-')
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                
                if (subTitle !== mainTitle) {
                  categoryMap.get(mainTitle)!.add(subTitle);
                }
              }
            }
          }
        });
        
        // Hiyerarşik kategori listesi oluştur
        const categories: string[] = [];
        const sortedMainCats = Array.from(categoryMap.keys()).sort();
        
        sortedMainCats.forEach(mainCat => {
          categories.push(mainCat);
          const subCats = Array.from(categoryMap.get(mainCat)!).sort();
          subCats.forEach(subCat => {
            categories.push(`  ${subCat}`);
          });
        });
        
        // Beden filtresini oluştur
        const sizes: string[] = [];
        data.forEach(p => {
          if (Array.isArray(p.sizes)) {
            p.sizes.forEach((size: string) => {
              if (size && typeof size === 'string' && size.trim() && !sizes.includes(size)) {
                sizes.push(size);
              }
            });
          }
        });
        const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        sizes.sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
        
        // Numara filtresini oluştur
        const shoeSizes: string[] = [];
        data.forEach(p => {
          if (Array.isArray(p.shoe_sizes)) {
            p.shoe_sizes.forEach((shoeSize: string) => {
              if (shoeSize && typeof shoeSize === 'string' && shoeSize.trim() && !shoeSizes.includes(shoeSize)) {
                shoeSizes.push(shoeSize);
              }
            });
          }
        });
        shoeSizes.sort((a, b) => parseFloat(a) - parseFloat(b));
        
        // Ağırlık filtresini oluştur
        const weights: string[] = [];
        data.forEach(p => {
          if (Array.isArray(p.weights)) {
            p.weights.forEach((weight: string) => {
              if (weight && typeof weight === 'string' && weight.trim() && !weights.includes(weight)) {
                weights.push(weight);
              }
            });
          }
        });
        weights.sort((a, b) => {
          const numA = parseInt(a.replace('gr', ''));
          const numB = parseInt(b.replace('gr', ''));
          return numA - numB;
        });
        
        // Renk filtresini oluştur
        const colors: string[] = [];
        data.forEach(p => {
          if (p.color && typeof p.color === 'string' && p.color.trim() && !colors.includes(p.color)) {
            colors.push(p.color);
          }
        });
        colors.sort();
        
        const filters: { name: string; options: string[] }[] = [];
        
        if (brands.length > 0) {
          filters.push({ name: 'Marka', options: brands });
        }
        
        if (categories.length > 0) {
          filters.push({ name: 'Kategori', options: categories });
        }
        
        if (sizes.length > 0) {
          filters.push({ name: 'Beden', options: sizes });
        }
        
        if (shoeSizes.length > 0) {
          filters.push({ name: 'Numara', options: shoeSizes });
        }
        
        if (weights.length > 0) {
          filters.push({ name: 'Ağırlık', options: weights });
        }
        
        if (colors.length > 0) {
          filters.push({ name: 'Renk', options: colors });
        }
        
        if (!ignore) {
          setDynamicFilters(filters);
          console.log('[Products] Dynamic filters loaded:', {
            brands: brands.length,
            categories: categories.length,
            sizes: sizes.length,
            shoeSizes: shoeSizes.length,
            weights: weights.length,
            colors: colors.length
          });
        }
      } catch (e) {
        console.warn('Dynamic filters error:', e);
      }
    };
    
    loadDynamicFilters();
    return () => { ignore = true; };
  }, [supaProducts]);

  const handleFilterChange = (filterName: string, value: string, checked: boolean) => {
    setActiveFilters(prev => {
      const currentValues = prev[filterName] || [];
      const newFilters = checked 
        ? { ...prev, [filterName]: [...currentValues, value] }
        : { ...prev, [filterName]: currentValues.filter(v => v !== value) };
      
      console.log('[Products] Filter changed:', { filterName, value, checked, newFilters });
      return newFilters;
    });
  };

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
          <section className="py-8">
            <div className="container mx-auto px-4">
              {/* Search Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  "{searchQuery}" için arama sonuçları
                  <span className="text-muted-foreground font-normal ml-2">
                    ({filteredProducts.length} ürün bulundu)
                  </span>
                </h1>
              </div>

              {/* Sorting */}
              <div className="flex items-center justify-end mb-6">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-muted-foreground">Önerilen sıralama</label>
                  <select 
                    className="border border-border rounded-md px-4 py-2 bg-background text-sm min-w-[200px] cursor-pointer hover:border-primary transition-colors" 
                    value={sortBy} 
                    onChange={(e) => {
                      console.log('[Products] Sort changed (search):', e.target.value);
                      setSortBy(e.target.value as any);
                    }}
                  >
                    <option value="newest">Yeni Eklenenler</option>
                    <option value="price_asc">En Düşük Fiyat</option>
                    <option value="price_desc">En Yüksek Fiyat</option>
                    <option value="best_seller">Çok Satanlar</option>
                    <option value="discount">İndirim Oranı</option>
                    <option value="most_reviewed">Çok Değerlendirilenler</option>
                    <option value="highest_rated">Yüksek Puanlılar</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            <section className="py-8">
              <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                  <Link to="/" className="hover:text-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Ana Sayfa</Link>
                  <span>/</span>
                  <span className="text-foreground">Tüm Ürünler</span>
                </nav>

                {/* Page Header */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Tüm Ürünler
                    <span className="text-muted-foreground font-normal ml-2">
                      ({loading ? '...' : `${filteredProducts.length}+ ürün`})
                    </span>
                  </h1>
                </div>

                {/* Sorting */}
                <div className="flex items-center justify-end mb-6">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-muted-foreground">Önerilen sıralama</label>
                    <select 
                      className="border border-border rounded-md px-4 py-2 bg-background text-sm min-w-[200px] cursor-pointer hover:border-primary transition-colors" 
                      value={sortBy} 
                      onChange={(e) => {
                        console.log('[Products] Sort changed:', e.target.value);
                        setSortBy(e.target.value as any);
                      }}
                    >
                      <option value="newest">Yeni Eklenenler</option>
                      <option value="price_asc">En Düşük Fiyat</option>
                      <option value="price_desc">En Yüksek Fiyat</option>
                      <option value="best_seller">Çok Satanlar</option>
                      <option value="discount">İndirim Oranı</option>
                      <option value="most_reviewed">Çok Değerlendirilenler</option>
                      <option value="highest_rated">Yüksek Puanlılar</option>
                    </select>
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
                      <div className="mb-6">
                        <h4 className="font-medium text-foreground mb-3">Fiyat Aralığı</h4>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Min ₺" 
                              inputMode="numeric" 
                              value={priceMin} 
                              onChange={(e) => setPriceMin(e.target.value)}
                              className="text-sm"
                            />
                            <span className="flex items-center text-muted-foreground">-</span>
                            <Input 
                              placeholder="Max ₺" 
                              inputMode="numeric" 
                              value={priceMax} 
                              onChange={(e) => setPriceMax(e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          
                          {/* Hızlı Seçim Butonları */}
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: '0-500₺', min: 0, max: 500 },
                              { label: '500-1000₺', min: 500, max: 1000 },
                              { label: '1000-2000₺', min: 1000, max: 2000 },
                              { label: '2000₺+', min: 2000, max: '' },
                            ].map(p => (
                              <Button 
                                key={p.label} 
                                type="button" 
                                size="sm" 
                                variant={priceMin === String(p.min) && priceMax === String(p.max) ? "default" : "outline"}
                                onClick={() => { 
                                  setPriceMin(String(p.min)); 
                                  setPriceMax(String(p.max)); 
                                }}
                                className="text-xs"
                              >
                                {p.label}
                              </Button>
                            ))}
                          </div>
                          
                          {/* Temizle Butonu */}
                          {(priceMin || priceMax) && (
                            <Button 
                              type="button" 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => { setPriceMin(''); setPriceMax(''); }}
                              className="w-full text-xs"
                            >
                              Fiyat Filtresini Temizle
                            </Button>
                          )}
                        </div>
                      </div>
                      {/* Dinamik Filtreler */}
                      {dynamicFilters.map((filterGroup, index) => (
                        <div key={`dynamic-${index}`} className="mb-6">
                          <h4 className="font-medium text-foreground mb-3">{filterGroup.name}</h4>
                          {filterGroup.name === 'Marka' && (
                            <Input 
                              placeholder="Marka ara" 
                              value={brandSearch} 
                              onChange={(e) => setBrandSearch(e.target.value)} 
                              className="mb-2" 
                            />
                          )}
                          <div className="space-y-1 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                            {filterGroup.options
                              .filter(o => filterGroup.name !== 'Marka' || (o && typeof o === 'string' && o.toLowerCase().includes(brandSearch.toLowerCase())))
                              .map((option, optionIndex) => {
                                const optionStr = String(option || '');
                                const isIndented = optionStr.startsWith('  ');
                                const displayText = optionStr.trim();
                                
                                // Boş değerleri atla
                                if (!displayText) return null;
                                
                                return (
                                  <label 
                                    key={optionIndex} 
                                    className={`flex items-center space-x-2 cursor-pointer ${
                                      isIndented ? 'ml-4' : ''
                                    } ${
                                      !isIndented && filterGroup.name === 'Kategori' ? 'font-medium' : ''
                                    }`}
                                  >
                                    <input 
                                      type="checkbox" 
                                      className="rounded border-border"
                                      checked={(activeFilters[filterGroup.name] || []).includes(option)}
                                      onChange={(e) => handleFilterChange(filterGroup.name, option, e.target.checked)}
                                    />
                                    <span className={`text-sm ${
                                      !isIndented && filterGroup.name === 'Kategori' 
                                        ? 'text-foreground' 
                                        : 'text-muted-foreground'
                                    } hover:text-foreground`}>
                                      {displayText}
                                    </span>
                                  </label>
                                );
                              })
                            }
                          </div>
                        </div>
                      ))}
                      
                      {/* Stok Filtresi ve Sıfırla Butonu */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded border-border" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} />
                          <span className="text-muted-foreground">Stoktakiler</span>
                        </label>
                        <Button type="button" variant="outline" size="sm" onClick={() => { setActiveFilters({}); setSelectedBrands([]); setSelectedCategories([]); setInStockOnly(false); setPriceMin(''); setPriceMax(''); setBrandSearch(''); setSortBy('newest'); }}>Sıfırla</Button>
                      </div>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="flex-1">
                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                        {filteredProducts.map((product, index) => (
                          <Card key={product.id} className="group hover:shadow-lg hover-scale transition-all duration-300 cursor-pointer overflow-hidden animate-fade-in relative" style={{ animationDelay: `${index * 150}ms` }}>
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
                    { name: "Termoslar ve Mataralar", icon: CupSoda, path: "/termoslar-ve-mataralar" }
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