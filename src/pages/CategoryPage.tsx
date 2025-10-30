import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart, Star, Filter, Search, Fish, Shirt, Tent, Waves, Dumbbell, CupSoda } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { categoryFilters } from '@/data/categories';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/format';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const location = useLocation();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  // viewMode kaldırıldı - sadece grid görünümü
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'best_seller' | 'most_reviewed' | 'highest_rated' | 'discount'>('newest');
  const [brandSearch, setBrandSearch] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [dynamicFilters, setDynamicFilters] = useState<{ name: string; options: string[] }[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const PAGE_SIZE = 30;

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
  // If browsing a subcategory like /balik-av-malzemeleri/olta-kamislari/spin,
  // capture the subpath after the root to precisely filter.
  const subPath = rootPath && currentPath.length > rootPath.length + 1
    ? currentPath.slice(rootPath.length + 2) // remove leading '/{root}/'
    : '';

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

  // Dinamik filtreleri yükle (Marka, Badge, vb.)
  useEffect(() => {
    let ignore = false;
    const loadDynamicFilters = async () => {
      try {
        let query = supabase
          .from('products')
          .select('brand, badge, category, sizes')
          .eq('is_active', true);
        
        // Kategori filtresi
        if (rootPath) {
          if (subPath) {
            query = query.like('category', `${rootPath}/${subPath}%`);
          } else {
            query = query.or(`category.eq.${rootPath},category.like.${rootPath}/%,category.eq./${rootPath},category.like./${rootPath}/%`);
          }
        }
        
        const { data, error } = await query;
        
        if (!error && data && !ignore) {
          // Marka filtresini oluştur
          const brands = [...new Set(data.map((p: any) => p.brand).filter(Boolean))].sort();
          
          // Badge filtresini oluştur (KALDIRILDI - artık kullanılmıyor)
          // const badges = [...new Set(data.map(p => p.badge).filter(Boolean))].sort();
          
          // Kategori filtresini oluştur - Hiyerarşik yapı
          const categoryMap = new Map<string, Set<string>>();
          
          data.forEach(p => {
            const cat = (p as any).category;
            if (cat && typeof cat === 'string') {
              // category formatı: "outdoor-giyim/erkek/mont-ve-ceket"
              const parts = cat.split('/').filter(Boolean);
              
              if (parts.length >= 2) {
                // Ana kategori (Erkek, Kadın, Aksesuar)
                const mainCat = parts[1];
                const mainTitle = mainCat
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                
                if (!categoryMap.has(mainTitle)) {
                  categoryMap.set(mainTitle, new Set());
                }
                
                // Alt kategori varsa (Mont ve Ceket, Pantolon, vb.)
                if (parts.length >= 3) {
                  const subCat = parts[2];
                  const subTitle = subCat
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  
                  categoryMap.get(mainTitle)!.add(subTitle);
                }
              }
            }
          });
          
          // Hiyerarşik kategori listesi oluştur
          const categories: string[] = [];
          const sortedMainCats = Array.from(categoryMap.keys()).sort();
          
          sortedMainCats.forEach(mainCat => {
            // Ana kategoriyi ekle
            categories.push(mainCat);
            
            // Alt kategorileri ekle (girintili)
            const subCats = Array.from(categoryMap.get(mainCat)!).sort();
            subCats.forEach(subCat => {
              categories.push(`  ${subCat}`); // 2 boşluk ile girintili
            });
          });
          
          // Beden filtresini oluştur (sadece outdoor-giyim için)
          const sizes: string[] = [];
          if (rootPath === 'outdoor-giyim') {
            data.forEach(p => {
              if (Array.isArray((p as any).sizes)) {
                (p as any).sizes.forEach((size: string) => {
                  if (!sizes.includes(size)) {
                    sizes.push(size);
                  }
                });
              }
            });
            // Beden sıralaması: XS, S, M, L, XL, XXL
            const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
            sizes.sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
          }
          
          // Numara filtresini oluştur (ayakkabı/bot için)
          const shoeSizes: string[] = [];
          if (rootPath === 'outdoor-giyim') {
            data.forEach(p => {
              const shoeSize = (p as any).shoe_size;
              if (shoeSize && !shoeSizes.includes(shoeSize)) {
                shoeSizes.push(shoeSize);
              }
            });
            // Numara sıralaması: 39, 39.5, 40, 40.5, ...
            shoeSizes.sort((a, b) => parseFloat(a) - parseFloat(b));
          }
          
          // Renk filtresini oluştur
          const colors: string[] = [];
          if (rootPath === 'outdoor-giyim') {
            data.forEach(p => {
              const color = (p as any).color;
              if (color && !colors.includes(color)) {
                colors.push(color);
              }
            });
            colors.sort();
          }
          
          const filters: { name: string; options: string[] }[] = [];
          
          if (brands.length > 0) {
            filters.push({ name: 'Marka', options: brands });
          }
          
          // Rozet filtresi kaldırıldı
          
          if (categories.length > 0) {
            filters.push({ name: 'Kategori', options: categories });
          }
          
          if (sizes.length > 0) {
            filters.push({ name: 'Beden', options: sizes });
          }
          
          if (shoeSizes.length > 0) {
            filters.push({ name: 'Numara', options: shoeSizes });
          }
          
          if (colors.length > 0) {
            filters.push({ name: 'Renk', options: colors });
          }
          
          setDynamicFilters(filters);
          
          console.log('[CategoryPage] Dynamic filters loaded:', {
            brands: brands.length,
            categories: categories.length,
            sizes: sizes.length,
          });
        }
      } catch (e) {
        console.warn('Dynamic filters error:', e);
      }
    };
    
    loadDynamicFilters();
    return () => { ignore = true; };
  }, [rootPath, subPath]);

  // Supabase: sayfalı ürün yükleme ve toplam sayım
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        let base = (supabase as any)
          .from('products')
          .select('id, name, description, brand, price, image_url, is_active, stock_quantity, original_price, category, features, badge, badges, featured, sizes, created_at', { count: 'exact' })
          .eq('is_active', true);

        // Category scoping by prefix if category field exists
        if (rootPath) {
          if (subPath) {
            base = base.like('category', `${rootPath}/${subPath}%`);
          } else {
            // Include exact root category and any child subcategories
            // Support legacy values saved with a leading '/'
            base = base.or(`category.eq.${rootPath},category.like.${rootPath}/%,category.eq./${rootPath},category.like./${rootPath}/%`);
          }
        }

        // Brand filter (Marka)
        const markaVals = activeFilters['Marka'] || [];
        if (markaVals.length > 0) {
          base = base.in('brand', markaVals);
        }
        
        // Rozet filtresi kaldırıldı
        
        // Kategori filter (Hiyerarşik)
        const kategoriVals = activeFilters['Kategori'] || [];
        if (kategoriVals.length > 0) {
          const ors = kategoriVals.map(title => {
            const trimmed = title.trim();
            
            // Girintili ise alt kategori (  Mont ve Ceket)
            if (title.startsWith('  ')) {
              // "  Mont ve Ceket" → "%/mont-ve-ceket"
              const slug = trimmed.toLowerCase().replace(/\s+/g, '-');
              return `category.like.%/${slug}`;
            } else {
              // Ana kategori: "Erkek" → "%/erkek/%"
              const slug = trimmed.toLowerCase().replace(/\s+/g, '-');
              return `category.like.%/${slug}/%`;
            }
          }).join(',');
          
          if (ors) {
            base = base.or(ors);
          }
        }

        // Beden filter (sizes JSONB array)
        const bedenVals = activeFilters['Beden'] || [];
        if (bedenVals.length > 0) {
          // sizes @> '["XL"]' (JSONB contains)
          // Her beden için ayrı kontrol: sizes @> '["S"]' OR sizes @> '["M"]'
          const ors = bedenVals.map((size) => `sizes.cs.["${size}"]`).join(',');
          if (ors) {
            base = base.or(ors);
          }
        }
        
        // Numara filter (shoe_size)
        const numaraVals = activeFilters['Numara'] || [];
        if (numaraVals.length > 0) {
          base = base.in('shoe_size', numaraVals);
        }
        
        // Renk filter (color)
        const renkVals = activeFilters['Renk'] || [];
        if (renkVals.length > 0) {
          base = base.in('color', renkVals);
        }

        // Ağırlık filter via JSONB features->>agirlik (POC)
        const agirlikVals = activeFilters['Ağırlık'] || activeFilters['Agirlik'] || activeFilters['A��rlık'] || [];
        if (agirlikVals.length > 0) {
          // Build OR expression: features->>agirlik.eq.X,features->>agirlik.eq.Y
          const ors = agirlikVals.map((v) => `features->>agirlik.eq.${v}`).join(',');
          if (ors) {
            base = base.or(ors);
          }
        }

        // Count (toplam ürün) - filtreleri yeniden uygula
        let countQ = supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true);
        if (rootPath) {
          if (subPath) {
            countQ = countQ.like('category', `${rootPath}/${subPath}%`);
          } else {
            countQ = countQ.or(`category.eq.${rootPath},category.like.${rootPath}/%,category.eq./${rootPath},category.like./${rootPath}/%`);
          }
        }
        if (markaVals.length > 0) {
          countQ = countQ.in('brand', markaVals);
        }
        // Rozet filtresi kaldırıldı
        if (agirlikVals.length > 0) {
          const ors = agirlikVals.map((v) => `features->>agirlik.eq.${v}`).join(',');
          if (ors) countQ = countQ.or(ors);
        }
        const countResp = await countQ;
        if (!ignore && !countResp.error) {
          setTotalCount(countResp.count || 0);
        }

        // Pagination
        const from = (currentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data, error } = await base.range(from, to);
        if (!error && data && !ignore) {
          console.log('[CategoryPage] Raw products from DB:', data.map((p: any) => ({
            id: p.id,
            name: p.name,
            stock_quantity: p.stock_quantity,
            is_active: p.is_active,
          })));
          
          const mapped = data.map((p: any) => {
            const inStock = (p.stock_quantity ?? 0) > 0 && (p.is_active !== false);
            console.log(`[CategoryPage] Product ${p.name}: stock=${p.stock_quantity}, is_active=${p.is_active}, inStock=${inStock}`);
            
            // İndirim oranı hesapla
            const discountPercent = p.original_price && p.original_price > p.price
              ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
              : 0;
            
            return {
              id: p.id,
              name: p.name,
              brand: p.brand ?? '',
              description: (p as any).description ?? '',
              price: p.price,
              image: p.image_url ?? '',
              badge: p.badge || (p.featured ? 'Öne Çıkan' : null),
              specs: [],
              inStock: inStock,
              stock_quantity: p.stock_quantity ?? 0,
              originalPrice: p.original_price ?? null,
              sizes: Array.isArray(p.sizes) ? p.sizes : [],
              features: p.features || {},
              createdAt: p.created_at,
              discountPercent: discountPercent,
            };
          });
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
  }, [normalizedPath, rootPath, subPath, JSON.stringify(activeFilters), currentPage]);

  const categoryData = getCategoryData();

  // Filter products based on active filters (applied on fetched products)
  const filteredProducts = products
    .filter(product => {
      // Stock filter
      if (inStockOnly && !product.inStock) return false;
      
      // Price filter (frontend only for now)
      const minOk = priceMin ? product.price >= Number(priceMin) : true;
      const maxOk = priceMax ? product.price <= Number(priceMax) : true;
      if (!minOk || !maxOk) return false;
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'best_seller':
          // Çok satanlar - features.best_seller önce
          const aBS = a.features?.best_seller ? 1 : 0;
          const bBS = b.features?.best_seller ? 1 : 0;
          return bBS - aBS;
        case 'discount':
          // İndirim oranı - yüksekten düşüğe
          return (b.discountPercent || 0) - (a.discountPercent || 0);
        case 'newest':
          // Yeni eklenenler - created_at'e göre
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'most_reviewed':
        case 'highest_rated':
          // TODO: Review sistemi eklendiğinde implement edilecek
          return 0;
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

        {/* Category Header - Hepsiburada Tarzı */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {categoryData.title} 
            <span className="text-muted-foreground font-normal ml-2">
              ({loading ? '...' : `${filteredProducts.length}+ ürün`})
            </span>
          </h1>
        </div>

        {/* Sıralama - Sağda */}
        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Önerilen sıralama</label>
            <select 
              className="border border-border rounded-md px-4 py-2 bg-background text-sm min-w-[200px] cursor-pointer hover:border-primary transition-colors" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
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
              {/* Dinamik Filtreler (Marka, Rozet) */}
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
                      .filter(o => filterGroup.name !== 'Marka' || o.toLowerCase().includes(brandSearch.toLowerCase()))
                      .map((option, optionIndex) => {
                        const isIndented = option.startsWith('  ');
                        const displayText = option.trim();
                        
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
                <Button type="button" variant="outline" size="sm" onClick={() => { setActiveFilters({}); setPriceMin(''); setPriceMax(''); setBrandSearch(''); setSortBy('newest'); setInStockOnly(false); }}>Sıfırla</Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {filteredProducts.map((product, index) => (
                <Card key={product.id} className="group hover:shadow-lg hover-scale transition-all duration-300 cursor-pointer overflow-hidden animate-fade-in relative" style={{ animationDelay: `${index * 150}ms` }}>
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
                    const displayBadges = (product as any).badges && (product as any).badges.length > 0 ? (product as any).badges : (product.badge ? [product.badge] : []);
                    
                    return displayBadges.length > 0 ? (
                      <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 items-end">
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
                  
                  <Link to={`/urun/${product.id}`} className="block" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="relative">

                      {/* Heart icon - Sol Üst */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
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

                      <CardContent className="p-4 flex flex-col h-full">
                        {/* Product image */}
                        <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
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

                        {/* Description */}
                        {product.description && (
                          <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2 mb-2">
                            {product.description}
                          </p>
                        )}

                        {/* Specs */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.specs.map((spec, index) => (
                            <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                              {spec}
                            </span>
                          ))}
                        </div>


                        {/* Price */}
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
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

                        {/* Size selector (for clothing) */}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-2">Beden:</p>
                            <div className="flex flex-wrap gap-1">
                              {product.sizes.map((size: string) => (
                                <button
                                  key={size}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedSizes(prev => ({
                                      ...prev,
                                      [product.id]: size
                                    }));
                                  }}
                                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                                    selectedSizes[product.id] === size
                                      ? 'bg-primary text-primary-foreground border-primary'
                                      : 'bg-background hover:bg-muted border-border'
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Stock badge */}
                        {product.inStock && (
                          <div className="mb-3">
                            <Badge variant="default" className="bg-green-500 text-xs">
                              Stokta ({product.stock_quantity} adet)
                            </Badge>
                          </div>
                        )}
                        
                        {/* Buttons */}
                        <div className="flex gap-1.5 mt-auto">
                          <Button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                            size="sm" 
                            className="flex-1 text-[10px] md:text-xs h-7 md:h-8" 
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="h-3 w-3 mr-0.5" />
                            {product.inStock ? 'Sepete' : 'Stokta Yok'}
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-[10px] md:text-xs h-7 md:h-8 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            asChild
                          >
                            <Link to={`/urun/${product.id}`}>İncele</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {(() => {
              const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
              const pages: number[] = [];
              const pageWindow = 5;
              let start = 1;
              if (totalPages <= pageWindow) {
                start = 1;
              } else if (currentPage <= 3) {
                start = 1;
              } else if (currentPage >= totalPages - 2) {
                start = totalPages - (pageWindow - 1);
              } else {
                start = currentPage - Math.floor(pageWindow / 2);
              }
              for (let i = 0; i < Math.min(pageWindow, totalPages); i++) pages.push(start + i);
              const go = (p: number) => {
                if (p < 1 || p > totalPages || p === currentPage) return;
                setCurrentPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              };
              return (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full px-4"
                    onClick={() => go(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Önceki"
                  >
                    Önceki
                  </Button>
                  {pages.map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      className="rounded-full px-4"
                      variant={p === currentPage ? 'default' : 'outline'}
                      onClick={() => go(p)}
                      aria-current={p === currentPage ? 'page' : undefined}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full px-4"
                    onClick={() => go(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Sonraki"
                  >
                    Sonraki
                  </Button>
                </div>
              );
            })()}
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