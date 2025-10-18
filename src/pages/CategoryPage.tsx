import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart, Star, Filter, Grid, List, Search, Fish, Shirt, Tent, Waves, Dumbbell, CupSoda } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { categoryFilters } from '@/data/categories';
import { supabase } from '@/integrations/supabase/client';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const location = useLocation();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'rating_desc'>('newest');
  const [brandSearch, setBrandSearch] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Determine category from URL (normalize to root category for subpaths)
  const currentPath = location.pathname;
  const roots = [
    'balik-av-malzemeleri',
    'outdoor-giyim',
    'kamp-malzemeleri',
    'dalis-urunleri',
    'spor-malzemeleri',
    'caki-bicak',
    'kisiye-ozel',
    'termoslar-ve-mataralar',
  ];
  const rootPath = roots.find(slug => currentPath === `/${slug}` || currentPath.startsWith(`/${slug}/`));
  const normalizedPath = rootPath ? `/${rootPath}` : currentPath;
  
  const getCategoryData = () => {
    switch (normalizedPath) {
      case '/balik-av-malzemeleri':
        return {
          title: "Balık Av Malzemeleri",
          description: "Profesyonel balıkçılık için özel tasarlanmış, kaliteli balık av malzemeleri.",
          totalProducts: 0,
          filters: categoryFilters['balik-av-malzemeleri'] || [],
          products: []
        };

  // Supabase POC: load products by category and filters (brand + features.agirlik)
  React.useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        let query = (supabase as any)
          .from('products')
          .select('id, name, brand, price, image_url, is_active, category, features')
          .eq('is_active', true);

        // Category scoping by prefix if category field exists
        if (rootPath) {
          query = query.like('category', `${rootPath}%`);
        }

        // Brand filter (Marka)
        const markaVals = activeFilters['Marka'] || [];
        if (markaVals.length > 0) {
          query = query.in('brand', markaVals);
        }

        // Ağırlık filter via JSONB features->>agirlik (POC)
        const agirlikVals = activeFilters['Ağırlık'] || activeFilters['Agirlik'] || activeFilters['A��rlık'] || [];
        if (agirlikVals.length > 0) {
          // Build OR expression: features->>agirlik.eq.X,features->>agirlik.eq.Y
          const ors = agirlikVals.map((v) => `features->>agirlik.eq.${v}`).join(',');
          if (ors) {
            query = query.or(ors);
          }
        }

        const { data, error } = await query.limit(60);
        if (!error && data && !ignore) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            brand: p.brand ?? '',
            price: p.price,
            image: p.image_url ?? '',
            badge: null,
            specs: [],
            rating: 4.8,
            reviews: 0,
            inStock: true,
            originalPrice: null,
          }));
          setProducts(mapped);
        }
      } catch (e: any) {
        // Graceful fallback if column missing or JSONB not set; keep empty list
        console.warn('Supabase filter POC error:', e?.message || e);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [normalizedPath, rootPath, JSON.stringify(activeFilters)]);
      
      case '/outdoor-giyim':
        return {
          title: "Outdoor Giyim",
          description: "Doğa sporları ve outdoor aktiviteler için profesyonel kıyafetler.",
          totalProducts: 0,
          filters: categoryFilters['outdoor-giyim'] || [],
          products: []
        };
      
      case '/kamp-malzemeleri':
        return {
          title: "Kamp Malzemeleri",
          description: "Doğada konforlu kamp deneyimi için gerekli tüm malzemeler.",
          totalProducts: 0,
          filters: categoryFilters['kamp-malzemeleri'] || [],
          products: []
        };
      
      case '/termoslar-ve-mataralar':
        return {
          title: "Termoslar ve Mataralar",
          description: "Doğada, sporda ve günlük kullanımda içeceklerinizi ideal ısıda tutan termos ve mataralar.",
          totalProducts: 0,
          filters: categoryFilters['termoslar-ve-mataralar'] || [],
          products: []
        };
      
      case '/caki-bicak':
        return {
          title: "Çakı & Bıçak",
          description: "Outdoor aktiviteler ve günlük kullanım için kaliteli çakı ve bıçaklar.",
          totalProducts: 0,
          filters: categoryFilters['caki-bicak'] || [],
          products: []
        };
      
      case '/dalis-urunleri':
        return {
          title: "Dalış Ürünleri",
          description: "Dalış ve sualtı sporları için profesyonel ekipmanlar.",
          totalProducts: 0,
          filters: categoryFilters['dalis-urunleri'] || [],
          products: []
        };

      case '/spor-malzemeleri':
        return {
          title: "Spor Malzemeleri",
          description: "Antrenman ve outdoor sporları için seçili ürünler.",
          totalProducts: 0,
          filters: categoryFilters['spor-malzemeleri'] || [],
          products: []
        };

      case '/kisiye-ozel':
        return {
          title: "Kişiye Özel",
          description: "İsme özel tasarlanabilen ürünler.",
          totalProducts: 0,
          filters: categoryFilters['kisiye-ozel'] || [],
          products: []
        };
      
      default:
        // Fallback: Show a generic filter set so filters are always visible
        return {
          title: "Ürünler",
          description: "Tüm ürünlerimizi inceleyin.",
          totalProducts: 0,
          filters: categoryFilters[normalizedPath.replace('/', '')] || [
            { name: "Marka", options: ["Daiwa", "Shimano", "Columbia", "Stanley"] },
            { name: "Fiyat", options: ["0-500₺", "500-1000₺", "1000-2000₺", "2000₺+"] }
          ],
          products: []
        };
    }
  };

  const categoryData = getCategoryData();

  // Filter products based on active filters (applied on fetched products)
  const filteredProducts = products
    .filter(product => {
      const ok = Object.entries(activeFilters).every(([filterName, values]) => {
        if (values.length === 0) return true;
        if (filterName === 'Marka') return values.includes(product.brand);
        return true;
      });
      if (!ok) return false;
      if (inStockOnly && !product.inStock) return false;
      if (minRating && (product.rating ?? 0) < minRating) return false;
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
        case 'rating_desc':
          return (b.rating ?? 0) - (a.rating ?? 0);
        default:
          return 0;
      }
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
        <meta property="og:title" content={`${categoryData.title} - BalıkPro`} />
        <meta property="og:description" content={categoryData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://balikpro.com${currentPath}`} />
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
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-3">Sırala</h4>
                <select className="w-full border border-border rounded-md px-3 py-2 bg-background text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                  <option value="newest">En yeni</option>
                  <option value="price_asc">Fiyat: Artan</option>
                  <option value="price_desc">Fiyat: Azalan</option>
                  <option value="rating_desc">Puan: Yüksek</option>
                </select>
              </div>
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-3">Fiyat</h4>
                <div className="flex gap-2 mb-2">
                  <Input placeholder="Min" inputMode="numeric" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
                  <Input placeholder="Max" inputMode="numeric" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
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
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-3">Puan (min)</h4>
                <div className="px-1">
                  <Slider value={[minRating]} min={0} max={5} step={0.5} onValueChange={(v) => setMinRating(v[0] as number)} />
                  <div className="text-xs text-muted-foreground mt-1">{minRating}+ yıldız</div>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-medium text-foreground mb-3">Marka</h4>
                <Input placeholder="Marka ara" value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} className="mb-2" />
              </div>
              {categoryData.filters.map((filterGroup, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <h4 className="font-medium text-foreground mb-3">{filterGroup.name}</h4>
                  <div className="space-y-2">
                     {filterGroup.options.filter(o => filterGroup.name !== 'Marka' || o.toLowerCase().includes(brandSearch.toLowerCase())).map((option, optionIndex) => (
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
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-border" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} />
                  <span className="text-muted-foreground">Stoktakiler</span>
                </label>
                <Button type="button" variant="outline" size="sm" onClick={() => { setActiveFilters({}); setPriceMin(''); setPriceMax(''); setMinRating(0); setBrandSearch(''); setSortBy('newest'); setInStockOnly(false); }}>Sıfırla</Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sorting and View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">{loading ? 'Yükleniyor...' : `${filteredProducts.length} ürün`}</div>
              
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
                            loading="lazy"
                            decoding="async"
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
            <section className="py-20">
              <div className="container mx-auto px-0">
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
              <div className="container mx-auto px-0">
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  </>
  );
};

export default CategoryPage;