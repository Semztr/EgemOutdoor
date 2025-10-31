import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Pencil, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { siteCategories } from '@/data/categories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import ImageUpload from '@/components/ImageUpload';
import MultiImageUpload from '@/components/MultiImageUpload';
import ColorImageUpload, { ColorImages } from '@/components/ColorImageUpload';

type Product = Tables<'products'>;
type ProductInsert = TablesInsert<'products'>;

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [mainCategory, setMainCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
  const [detailCategory, setDetailCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'products' | 'newsletter' | 'orders' | 'coupons'>('products');
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Dinamik kategoriler
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [detailCategories, setDetailCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    brand: '',
    category: '',
    image_url: '',
    stock_quantity: '',
    colors: '',
    featured: false as boolean,
    best_seller: false as boolean,
    new_arrival: false as boolean,
    badge: '' as string,
    badges: [] as string[],
    color_options: '',
    extra_images: '',
    agirlik: '',
    features: '',
    technical_specs: '',
    sizes: [] as string[],
    shoe_sizes: [] as string[],
    color: '',
    color_images: {} as Record<string, ColorImages>,
  });

  useEffect(() => {
    checkAdminStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
      loadSubscribers();
      loadOrders();
      loadCategories();
    }
  }, [isAdmin]);
  
  const loadCategories = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      
      setDbCategories(data || []);
      
      // Ana kategorileri filtrele (level = 1)
      const mains = (data || []).filter((c: any) => c.level === 1);
      setMainCategories(mains);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const checkAdminStatus = async () => {
    // Auth state hazır değilse bekle
    if (authLoading) return;
    if (!user) {
      navigate('/giris');
      return;
    }

    // Super admin allowlist (env-driven)
    const envAdmins = (import.meta.env.VITE_SUPER_ADMIN_IDS || '').split(',').map((s: string) => s.trim()).filter(Boolean);
    const DEFAULT_ADMINS = ['f29e5169-7369-4148-a383-f23a0a4c0014'];
    const SUPER_ADMIN_IDS = envAdmins.length ? envAdmins : DEFAULT_ADMINS;

    if (SUPER_ADMIN_IDS.includes(user.id)) {
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        // If table missing, allow SUPER_ADMIN users to proceed
        const code = (error as any).code;
        if (code === '42P01') {
          if (SUPER_ADMIN_IDS.includes(user.id)) {
            setIsAdmin(true);
            setLoading(false);
            return;
          }
        }
        throw error;
      }

      if (!data) {
        toast({
          title: 'Yetkisiz Erişim',
          description: 'Bu sayfaya erişim yetkiniz yok.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Admin kontrolü hatası:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts((data || []) as unknown as Product[]);
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
      toast({
        title: 'Hata',
        description: `Ürünler yüklenirken bir hata oluştu${(error as any)?.message ? `: ${(error as any).message}` : ''}`,
        variant: 'destructive',
      });
    }
  };

  const loadSubscribers = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) {
        setSubscribers([]);
        return;
      }
      setSubscribers(data || []);
    } catch (error) {
      console.error('Aboneler yüklenemedi:', error);
      setSubscribers([]);
    }
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setOrders([]);
        return;
      }
      setOrders(data || []);
    } catch (error) {
      console.error('Siparişler yüklenemedi:', error);
      setOrders([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation and normalization
    // Türkçe ve İngilizce formatları destekle
    const normalizedPrice = formData.price
      .replace(/\./g, '') // Binlik ayracı noktaları kaldır (1.549 → 1549)
      .replace(',', '.'); // Virgülü noktaya çevir (1549,00 → 1549.00)
    
    const parsedPrice = parseFloat(normalizedPrice);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      toast({ 
        title: 'Geçersiz Fiyat', 
        description: 'Lütfen geçerli bir fiyat girin (örn: 1549.00 veya 1.549,00).', 
        variant: 'destructive' 
      });
      return;
    }
    const parsedStock = parseInt(formData.stock_quantity) || 0;

    // Türkçe karakterleri İngilizce karakterlere çevir (normalize)
    const normalizeTurkish = (str: string): string => {
      return str
        .replace(/ı/g, 'i')
        .replace(/İ/g, 'I')
        .replace(/ş/g, 's')
        .replace(/Ş/g, 'S')
        .replace(/ğ/g, 'g')
        .replace(/Ğ/g, 'G')
        .replace(/ü/g, 'u')
        .replace(/Ü/g, 'U')
        .replace(/ö/g, 'o')
        .replace(/Ö/g, 'O')
        .replace(/ç/g, 'c')
        .replace(/Ç/g, 'C');
    };

    // Kategori oluştur: mainCategory / subCategory / detailCategory (varsa)
    let effectiveCategory = '';
    if (mainCategory) {
      if (subCategory) {
        if (detailCategory) {
          effectiveCategory = `${mainCategory}/${subCategory}/${detailCategory}`;
        } else {
          effectiveCategory = `${mainCategory}/${subCategory}`;
        }
      } else {
        effectiveCategory = mainCategory;
      }
    }

    // Kategoriyi normalize et (Türkçe karakterleri İngilizce yap)
    effectiveCategory = normalizeTurkish(effectiveCategory);

    console.log('[Admin] Saving category:', {
      mainCategory,
      subCategory,
      detailCategory,
      effectiveCategory,
      normalized: true,
    });

    // Eski fiyat için de aynı normalizasyon
    const parsedOriginalPrice = formData.original_price 
      ? parseFloat(formData.original_price.replace(/\./g, '').replace(',', '.'))
      : null;

    // Checkbox'lardan badges array'ine otomatik ekle
    const autoBadges = new Set(formData.badges || []);
    if (formData.best_seller && !autoBadges.has('bestseller')) {
      autoBadges.add('bestseller');
    }
    if (formData.new_arrival && !autoBadges.has('new')) {
      autoBadges.add('new');
    }
    const finalBadges = Array.from(autoBadges);

    const productData: Partial<ProductInsert> = {
      name: formData.name,
      description: formData.description || null,
      price: parsedPrice,
      original_price: parsedOriginalPrice,
      brand: formData.brand || null,
      category: effectiveCategory || null,
      image_url: formData.image_url || null,
      stock_quantity: parsedStock,
      colors: formData.colors ? formData.colors.split(',').map(c => c.trim()) : [],
      is_active: true,
      featured: !!formData.featured,
      badge: formData.badge || null,
      badges: finalBadges.length > 0 ? finalBadges : null,
      color_options: formData.color_options ? formData.color_options.split(',').map(s => s.trim()).filter(Boolean) : [],
      extra_images: formData.extra_images ? formData.extra_images.split(',').map(s => s.trim()).filter(Boolean) : [],
      sizes: formData.sizes && formData.sizes.length > 0 ? formData.sizes : null,
      shoe_sizes: formData.shoe_sizes && formData.shoe_sizes.length > 0 ? formData.shoe_sizes : null,
      color_images: formData.color_images || {},
    } as any;

    // 🎨 Ana görsel yoksa, ilk rengin ana görselini kullan
    if (!productData.image_url && formData.color_images && Object.keys(formData.color_images).length > 0) {
      const firstColor = Object.keys(formData.color_images)[0];
      const firstColorImage = formData.color_images[firstColor];
      if (firstColorImage && firstColorImage.main) {
        productData.image_url = firstColorImage.main;
        console.log('[Admin] Ana görsel bulunamadı, ilk rengin ana görseli kullanılıyor:', {
          color: firstColor,
          image_url: firstColorImage.main
        });
      }
    }

    // JSONB features - Always use object format for consistency
    let featuresData: any = {};
    
    // Add flags first
    if (formData.best_seller) featuresData.best_seller = true;
    if (formData.new_arrival) featuresData.new_arrival = true;
    
    // Add text features as array property
    if (formData.features.trim()) {
      const featuresArray = formData.features.split('\n').map(f => f.trim()).filter(Boolean);
      if (featuresArray.length > 0) {
        featuresData.items = featuresArray;
      }
    }
    
    // Only save if we have any features
    if (Object.keys(featuresData).length > 0) {
      (productData as any).features = featuresData;
    } else {
      (productData as any).features = null;
    }
    
    console.log('[Admin] Features data to save:', featuresData);

    // JSONB technical_specs - Object format
    let techSpecs: Record<string, string> = {};
    
    console.log('[Admin] Raw technical_specs from form:', formData.technical_specs);
    console.log('[Admin] technical_specs length:', formData.technical_specs.length);
    
    if (formData.technical_specs.trim()) {
      const lines = formData.technical_specs.split('\n').filter(line => line.trim());
      console.log('[Admin] Lines after split:', lines);
      
      lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        console.log(`[Admin] Processing line: "${line}", colon at: ${colonIndex}`);
        
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          console.log(`[Admin] Parsed: key="${key}", value="${value}"`);
          
          if (key && value) {
            techSpecs[key] = value;
          }
        }
      });
    } else {
      console.log('[Admin] technical_specs is empty or whitespace only');
    }
    
    console.log('[Admin] Technical specs parsed:', techSpecs);
    
    if (Object.keys(techSpecs).length > 0) {
      (productData as any).technical_specs = techSpecs;
    } else {
      // Boş object yerine null kaydet
      (productData as any).technical_specs = null;
    }
    
    console.log('[Admin] Product data to save:', {
      name: productData.name,
      technical_specs: (productData as any).technical_specs
    });

    // Legacy features for backward compatibility (best_seller, new_arrival flags)
    // These are kept separate from the features array for filtering purposes

    try {
      if (editingProduct) {
        console.log('[Admin] Updating product:', editingProduct.id);
        console.log('[Admin] Update data:', productData);
        
        const { data: updatedData, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          .select();

        if (error) {
          console.error('[Admin] Supabase UPDATE error:', error);
          throw error;
        }
        
        console.log('[Admin] Updated product data from DB:', updatedData);
        
        toast({
          title: 'Başarılı',
          description: 'Ürün güncellendi.',
        });
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productData as ProductInsert])
          .select('id')
          .single();

        if (error) throw error;
        
        toast({
          title: 'Başarılı',
          description: 'Ürün eklendi.',
        });
      }

      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Ürün kaydedilemedi:', error);
      toast({
        title: 'Hata',
        description: `Ürün kaydedilirken bir hata oluştu${(error as any)?.message ? `: ${(error as any).message}` : ''}`,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (product: Product) => {
    console.log('[Admin] handleEdit called with product:', {
      id: product.id,
      name: product.name,
      category: product.category,
      badge: (product as any).badge,
      featured: product.featured,
    });
    
    setEditingProduct(product);
    
    // Parse features - handle both array and object formats
    let featuresText = '';
    const featuresRaw = (product as any).features;
    
    if (featuresRaw && typeof featuresRaw === 'object') {
      // New format: object with items array
      if (Array.isArray(featuresRaw.items)) {
        featuresText = featuresRaw.items.join('\n');
      }
      // Legacy format: array at root level
      else if (Array.isArray(featuresRaw)) {
        featuresText = featuresRaw
          .map(f => typeof f === 'string' ? f : JSON.stringify(f))
          .join('\n');
      }
      // Very old format: object with key-value pairs
      else {
        featuresText = Object.entries(featuresRaw)
          .filter(([key]) => !['best_seller', 'new_arrival', 'agirlik', 'items'].includes(key))
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
      }
    }
    
    // Parse technical_specs object
    let techSpecsText = '';
    if ((product as any).technical_specs && typeof (product as any).technical_specs === 'object') {
      techSpecsText = Object.entries((product as any).technical_specs)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    }
    
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      original_price: (product as any).original_price?.toString() || '',
      brand: product.brand || '',
      category: product.category || '',
      image_url: product.image_url || '',
      stock_quantity: product.stock_quantity.toString(),
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      featured: !!product.featured,
      best_seller: !!(product as any).features?.best_seller,
      new_arrival: !!(product as any).features?.new_arrival,
      badge: (product as any).badge || '',
      badges: Array.isArray((product as any).badges) ? (product as any).badges : [],
      color_options: Array.isArray(product.color_options) ? product.color_options.join(', ') : '',
      extra_images: Array.isArray(product.extra_images) ? product.extra_images.join(', ') : '',
      agirlik: (product as any).features?.agirlik || '',
      features: featuresText,
      technical_specs: techSpecsText,
      sizes: Array.isArray((product as any).sizes) ? (product as any).sizes : [],
      shoe_sizes: Array.isArray((product as any).shoe_sizes) ? (product as any).shoe_sizes : [],
      color: (product as any).color || '',
      color_images: (product as any).color_images || {},
    });

    // Kategori seçimlerini doldur
    const catValue = product.category || '';
    console.log('[Admin] Parsing category:', catValue, 'Type:', typeof catValue);
    
    if (catValue && catValue.includes('/')) {
      const parts = catValue.split('/');
      const main = parts[0];
      const sub = parts[1] || '';
      const detail = parts[2] || '';
      
      console.log('[Admin] Parsed - main:', main, 'sub:', sub, 'detail:', detail);
      
      setMainCategory(main);
      setSubCategory(sub);
      setDetailCategory(detail);
    } else if (catValue) {
      console.log('[Admin] Category has no slash, searching in siteCategories...');
      // Sadece alt slug kaydedilmişse, hangi ana kategoriye ait olduğunu bul
      const match = siteCategories.find(c => c.subcategories.some(s => s.slug === catValue));
      if (match) {
        console.log('[Admin] Found match:', match.slug);
        setMainCategory(match.slug);
        setSubCategory(catValue);
        setDetailCategory('');
      } else {
        console.log('[Admin] No match found, clearing categories');
        setMainCategory('');
        setSubCategory('');
        setDetailCategory('');
      }
    } else {
      console.log('[Admin] Category is empty, clearing categories');
      setMainCategory('');
      setSubCategory('');
      setDetailCategory('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Başarılı',
        description: 'Ürün silindi.',
      });
      
      loadProducts();
    } catch (error) {
      console.error('Ürün silinemedi:', error);
      toast({
        title: 'Hata',
        description: 'Ürün silinirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const seedDummyProducts = async () => {
    try {
      const dummyProducts = [
        // Balık Av Malzemeleri
        {
          name: 'Daiwa Ninja X Spin 2.40m 10-40g',
          description: 'Hafif ve dengeli spin kamışı.',
          price: 1799.9,
          brand: 'Daiwa',
          category: 'balik-av-malzemeleri/olta-kamislari/spin',
          image_url: 'https://via.placeholder.com/800x800.png?text=Daiwa+Ninja+X',
          stock_quantity: 20,
          colors: null,
          is_active: true,
          featured: true,
          color_options: null,
          extra_images: null,
        },
        {
          name: 'Shimano Catana 2500 Spin Makine',
          description: 'Sorunsuz sarım ve pürüzsüz drag performansı.',
          price: 2499.0,
          brand: 'Shimano',
          category: 'balik-av-malzemeleri/olta-makineleri/spin',
          image_url: 'https://via.placeholder.com/800x800.png?text=Shimano+Catana+2500',
          stock_quantity: 15,
          colors: null,
          is_active: true,
          featured: false,
          color_options: null,
          extra_images: null,
        },
        {
          name: 'Savage Gear Su Üstü Maket',
          description: 'Yırtıcı balıklar için su üstü aksiyon.',
          price: 349.9,
          brand: 'Savage Gear',
          category: 'balik-av-malzemeleri/su-ustu-maketler',
          image_url: 'https://via.placeholder.com/800x800.png?text=Su+Ustu+Maket',
          stock_quantity: 100,
          colors: null,
          is_active: true,
          featured: false,
          color_options: null,
          extra_images: null,
        },
        {
          name: 'Sufix Monofilament Misina 0.30mm',
          description: 'Yüksek düğüm dayanımı ve düşük hafıza.',
          price: 199.9,
          brand: 'Sufix',
          category: 'balik-av-malzemeleri/misineler/monofilament',
          image_url: 'https://via.placeholder.com/800x800.png?text=Monofilament+0.30',
          stock_quantity: 60,
          colors: null,
          is_active: true,
          featured: false,
          color_options: null,
          extra_images: null,
        },
        {
          name: 'Owner Üçlü İğne #4',
          description: 'Keskin ve dayanıklı üçlü iğneler.',
          price: 129.9,
          brand: 'Owner',
          category: 'balik-av-malzemeleri/igne-jighead/uclu-igneler',
          image_url: 'https://via.placeholder.com/800x800.png?text=Uclu+Igne+%234',
          stock_quantity: 80,
          colors: null,
          is_active: true,
          featured: false,
          color_options: null,
          extra_images: null,
        },
        {
          name: 'Behr Kepçe - Livar - Tripod Set',
          description: 'Sahada pratik yardımcı ekipman seti.',
          price: 799.9,
          brand: 'Behr',
          category: 'balik-av-malzemeleri/aksesuarlar/kepce-livar-kakic-tripod',
          image_url: 'https://via.placeholder.com/800x800.png?text=Kepce+Livar+Tripod',
          stock_quantity: 25,
          colors: null,
          is_active: true,
          featured: false,
          color_options: null,
          extra_images: null,
        },
      ];

      const { error } = await supabase
        .from('products')
        .insert(dummyProducts);

      if (error) throw error;

      toast({
        title: 'Başarılı',
        description: 'Örnek ürünler eklendi.',
      });
      loadProducts();
    } catch (error) {
      console.error('Dummy ürünler eklenemedi:', error);
      toast({
        title: 'Hata',
        description: 'Örnek ürünler eklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      brand: '',
      category: '',
      image_url: '',
      stock_quantity: '',
      colors: '',
      featured: false,
      best_seller: false,
      new_arrival: false,
      badge: '',
      badges: [],
      color_options: '',
      extra_images: '',
      agirlik: '',
      features: '',
      technical_specs: '',
      sizes: [],
      shoe_sizes: [],
      color: '',
      color_images: {},
    });
    setMainCategory('');
    setSubCategory('');
    setDetailCategory('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Helmet>
          <title>Yetkisiz Erişim - EgemOutdoor</title>
        </Helmet>
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">Yetkisiz Erişim</h1>
              <p className="text-muted-foreground mb-6">Bu sayfaya erişim yetkiniz yok. Ana sayfaya dönebilirsiniz.</p>
              <Button onClick={() => navigate('/')}>Ana Sayfaya Dön</Button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Paneli - EgemOutdoor</title>
      </Helmet>

      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-6 md:py-8">
          {/* Tab Navigation */}
          <div className="mb-6 border-b border-border">
            <div className="flex gap-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Ürünler ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                📦 Siparişler ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('newsletter')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'newsletter'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                📧 Newsletter ({subscribers.length})
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === 'coupons'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                🎟️ Kuponlar
              </button>
            </div>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <>
              {/* Modern Dashboard Header */}
              <div className="mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Ürün Yönetimi</h1>
                    <p className="text-sm text-muted-foreground">{products.length} ürün kayıtlı</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={seedDummyProducts}>
                      <Plus className="h-4 w-4 mr-2" />
                      Dummy Yükle
                    </Button>
                  </div>
                </div>
              </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Ürün Adı *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">İndirimli Fiyat (Satış Fiyatı) *</Label>
                      <Input
                        id="price"
                        type="text"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="Örn: 8.000,00 (satış fiyatı)"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        💰 Müşterinin ödeyeceği fiyat (nokta veya virgül kullanabilirsiniz)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="stock_quantity">Stok Miktarı *</Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  {/* İndirim Alanı */}
                  <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">🏷️</span>
                      <h3 className="font-semibold text-sm">İndirim Ayarları</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="original_price">Eski Fiyat (İndirim Varsa)</Label>
                        <Input
                          id="original_price"
                          type="text"
                          value={formData.original_price || ''}
                          onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                          placeholder="Örn: 10.000,00 (eski fiyat)"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          🏷️ Üstü çizili gösterilecek eski fiyat (örn: 10.000₺ → 8.000₺)
                        </p>
                      </div>
                      <div className="flex items-end">
                        {(() => {
                          if (!formData.original_price || !formData.price) return null;
                          
                          // Fiyatları normalize et
                          const normalizedOriginal = formData.original_price.replace(/\./g, '').replace(',', '.');
                          const normalizedPrice = formData.price.replace(/\./g, '').replace(',', '.');
                          const originalPrice = parseFloat(normalizedOriginal);
                          const currentPrice = parseFloat(normalizedPrice);
                          
                          if (isNaN(originalPrice) || isNaN(currentPrice) || originalPrice <= currentPrice) return null;
                          
                          const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
                          
                          return (
                            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg w-full">
                              <p className="text-xs text-green-800 dark:text-green-200 font-medium">
                                İndirim Oranı: %{discountPercent}
                              </p>
                              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                ₺{originalPrice.toFixed(2)} → ₺{currentPrice.toFixed(2)}
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="brand">Marka</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Ana Kategori</Label>
                      <Select
                        value={mainCategory}
                        onValueChange={(val) => {
                          setMainCategory(val);
                          setSubCategory('');
                          setDetailCategory('');
                          setFormData({ ...formData, category: val });
                          
                          // Alt kategorileri filtrele
                          const mainCat = dbCategories.find((c: any) => c.slug === val);
                          if (mainCat) {
                            const subs = dbCategories.filter((c: any) => c.parent_id === mainCat.id);
                            setSubCategories(subs);
                            setDetailCategories([]);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          {mainCategories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Alt Kategori {subCategories.length === 0 && mainCategory && '(Yok)'}</Label>
                      <Select
                        value={subCategory}
                        onValueChange={(val) => {
                          setSubCategory(val);
                          setDetailCategory('');
                          
                          // Detay kategorileri filtrele
                          const subCat = dbCategories.find((c: any) => c.slug === val);
                          if (subCat) {
                            const details = dbCategories.filter((c: any) => c.parent_id === subCat.id);
                            setDetailCategories(details);
                            
                            // Eğer detay kategori yoksa, kategoriyi şimdi kaydet
                            if (details.length === 0) {
                              const composed = mainCategory ? `${mainCategory}/${val}` : val;
                              setFormData({ ...formData, category: composed });
                            }
                          } else {
                            // Detay bulunamazsa kategoriyi kaydet
                            const composed = mainCategory ? `${mainCategory}/${val}` : val;
                            setFormData({ ...formData, category: composed });
                          }
                        }}
                        disabled={!mainCategory || subCategories.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !mainCategory ? 'Önce ana kategori' : 
                            subCategories.length === 0 ? 'Bu kategoride alt kategori yok' : 
                            'Seçiniz'
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {subCategories.map((sub: any) => (
                            <SelectItem key={sub.id} value={sub.slug}>{sub.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {subCategories.length === 0 && mainCategory && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Bu kategoride alt kategori yok. Ürün doğrudan ana kategoriye eklenecek.
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label>Detay Kategori {detailCategories.length === 0 && subCategory && '(Yok)'}</Label>
                      <Select
                        value={detailCategory}
                        onValueChange={(val) => {
                          setDetailCategory(val);
                          // 3 seviyeli kategori oluştur
                          if (val && mainCategory && subCategory) {
                            const composed = `${mainCategory}/${subCategory}/${val}`;
                            setFormData({ ...formData, category: composed });
                          } else if (mainCategory && subCategory) {
                            // Detay seçilmediyse 2 seviyeli
                            const composed = `${mainCategory}/${subCategory}`;
                            setFormData({ ...formData, category: composed });
                          }
                        }}
                        disabled={!subCategory || detailCategories.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !subCategory ? 'Önce alt kategori' : 
                            detailCategories.length === 0 ? 'Bu kategoride detay yok' : 
                            'Seçiniz (opsiyonel)'
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {detailCategories.map((detail: any) => (
                            <SelectItem key={detail.id} value={detail.slug}>{detail.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {detailCategories.length === 0 && subCategory && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Bu alt kategoride detay kategori yok. Ürün doğrudan bu kategoriye eklenecek.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 p-4 border rounded-lg">
                    <h3 className="font-semibold text-sm">Ürün Etiketleri</h3>
                    
                    <div className="flex items-center gap-2">
                      <input
                        id="featured"
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="featured">Popüler Ürünler (Ana Sayfa)</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="best_seller"
                        type="checkbox"
                        checked={formData.best_seller}
                        onChange={(e) => setFormData({ ...formData, best_seller: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="best_seller">Çok Satan Ürün</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="new_arrival"
                        type="checkbox"
                        checked={formData.new_arrival}
                        onChange={(e) => setFormData({ ...formData, new_arrival: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="new_arrival">Yeni Gelen Ürün</Label>
                    </div>

                    <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">🏷️</span>
                        <h3 className="font-semibold text-sm">Ürün Rozetleri (Çoklu Seçim)</h3>
                      </div>
                      <Label>Rozet Seçimi (Birden fazla seçebilirsiniz)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                          { value: 'popular', label: '⭐ Popüler', color: 'bg-purple-100 dark:bg-purple-900' },
                          { value: 'bestseller', label: '🔥 Çok Satan', color: 'bg-orange-100 dark:bg-orange-900' },
                          { value: 'new', label: '✨ Yeni', color: 'bg-green-100 dark:bg-green-900' },
                          { value: 'discount', label: '💰 İndirimli', color: 'bg-red-100 dark:bg-red-900' },
                          { value: 'featured', label: '🎯 Öne Çıkan', color: 'bg-blue-100 dark:bg-blue-900' },
                        ].map((badge) => (
                          <label key={badge.value} className={`flex items-center gap-2 cursor-pointer p-3 border-2 rounded-lg transition-all ${formData.badges.includes(badge.value) ? `${badge.color} border-primary` : 'border-border hover:border-primary/50'}`}>
                            <input
                              type="checkbox"
                              checked={formData.badges.includes(badge.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({ ...formData, badges: [...formData.badges, badge.value] });
                                } else {
                                  setFormData({ ...formData, badges: formData.badges.filter(b => b !== badge.value) });
                                }
                              }}
                              className="rounded border-border"
                            />
                            <span className="text-sm font-medium">{badge.label}</span>
                          </label>
                        ))}
                      </div>
                      
                      {formData.badges.length > 0 && (
                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                          <p className="text-xs font-medium mb-2">✅ Seçili Rozetler:</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.badges.map((badge) => (
                              <span key={badge} className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                        <p className="text-xs font-medium mb-2">📌 Rozet Kullanımı:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• <strong>Popüler:</strong> Ana sayfada "Popüler Ürünler" sekmesinde gösterilir</li>
                          <li>• <strong>Çok Satan:</strong> Ana sayfada "Çok Satanlar" sekmesinde gösterilir</li>
                          <li>• <strong>Yeni:</strong> Ana sayfada "Yeni Gelenler" sekmesinde gösterilir</li>
                          <li>• <strong>İndirimli:</strong> İndirimli ürünler için kırmızı rozet</li>
                          <li>• <strong>Öne Çıkan:</strong> Özel kampanyalı ürünler için mavi rozet</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Görseller bölümü kaldırıldı - Renk seçenekleri ile birleştirildi */}

                  {/* Renk Seçenekleri ve Görseller Bölümü */}
                  <div className="space-y-4 p-4 border rounded-lg bg-purple-50 dark:bg-purple-950">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🎨🖼️</span>
                      <h3 className="font-semibold text-sm">Renk Seçenekleri ve Ürün Görselleri</h3>
                    </div>
                    
                    {/* Renk Olmadan Görseller */}
                    <div className="space-y-4 p-4 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📸</span>
                        <h4 className="font-semibold text-sm">Genel Ürün Görselleri (Renk Seçimi Yapılmadıysa)</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">💡 Eğer ürününüzde renk seçeneği yoksa, buradan görselleri ekleyin.</p>
                      
                      {/* Ana Görsel */}
                      <ImageUpload
                        value={formData.image_url}
                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                        label="Ana Görsel (Zorunlu)"
                        required={!formData.colors || formData.colors.length === 0}
                      />

                      {/* Ek Görseller */}
                      <MultiImageUpload
                        value={formData.extra_images}
                        onChange={(urls) => setFormData({ ...formData, extra_images: urls })}
                        label="Ek Görseller (Opsiyonel)"
                        maxImages={5}
                      />
                    </div>
                    
                    <div>
                      <Label>Mevcut Renkler (Çoklu Seçim)</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {[
                          'Siyah', 
                          'Beyaz', 
                          'Mavi', 
                          'Açık Mavi',
                          'Lacivert', 
                          'Kırmızı', 
                          'Yeşil',
                          'Açık Yeşil',
                          'Koyu Yeşil',
                          'Sarı', 
                          'Turuncu',
                          'Koyu Turuncu',
                          'Mor', 
                          'Pembe',
                          'Açık Pembe',
                          'Gri',
                          'Açık Gri',
                          'Koyu Gri',
                          'Antrasit',
                          'Füme',
                          'Bej', 
                          'Kahverengi',
                          'Açık Kahverengi',
                          'Koyu Kahverengi',
                          'Bordo',
                          'Kamuflaj', 
                          'Haki',
                          'Yeşil Kamuflaj',
                          'Hardal',
                          'Mint',
                          'Turkuaz',
                          'Lacivert Mavi',
                          'Neon Yeşil',
                          'Neon Sarı',
                          'Neon Turuncu',
                          'Metalik Gri',
                          'Metalik Siyah',
                          'Şeffaf',
                          'Beyaz/Siyah',
                          'Siyah/Beyaz',
                          'Çok Renkli'
                        ].map((color) => {
                          const colorArray = formData.colors ? formData.colors.split(',').map(c => c.trim()) : [];
                          return (
                            <label key={color} className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors">
                              <input
                                type="checkbox"
                                checked={colorArray.includes(color)}
                                onChange={(e) => {
                                  const currentColors = formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [];
                                  if (e.target.checked) {
                                    setFormData({ ...formData, colors: [...currentColors, color].join(', ') });
                                  } else {
                                    setFormData({ ...formData, colors: currentColors.filter(c => c !== color).join(', ') });
                                  }
                                }}
                                className="rounded border-border"
                              />
                              <span className="text-sm font-medium">{color}</span>
                            </label>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        💡 Ürünün mevcut olduğu renkleri seçin. Müşteriler bu renkler arasından seçim yapabilecek. Renk seçmezseniz bu özellik gösterilmez.
                      </p>
                    </div>

                    {formData.colors && formData.colors.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                        <p className="text-xs font-medium mb-2">✅ Seçili Renkler:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.colors.split(',').map((color) => (
                            <span key={color.trim()} className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                              {color.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Renk Bazlı Görseller */}
                    {formData.colors && formData.colors.length > 0 && (
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-2 p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                          <span className="text-lg">🎨</span>
                          <div>
                            <h4 className="font-semibold text-sm">Renge Özel Görseller</h4>
                            <p className="text-xs text-muted-foreground">Her renk için ayrı ana görsel ve ek görseller ekleyebilirsiniz.</p>
                          </div>
                        </div>
                        <ColorImageUpload
                          colors={formData.colors.split(',').map(c => c.trim()).filter(Boolean)}
                          value={formData.color_images}
                          onChange={(colorImages) => setFormData({ ...formData, color_images: colorImages })}
                        />
                      </div>
                    )}
                  </div>

                  {/* Beden Seçenekleri Bölümü */}
                  <div className="space-y-4 p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">👕</span>
                      <h3 className="font-semibold text-sm">Beden Seçenekleri (Opsiyonel - Giyim Ürünleri İçin)</h3>
                    </div>
                    
                    <div>
                      <Label>Mevcut Bedenler</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                          <label key={size} className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-green-100 dark:hover:bg-green-900 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.sizes?.includes(size) || false}
                              onChange={(e) => {
                                const currentSizes = formData.sizes || [];
                                if (e.target.checked) {
                                  setFormData({ ...formData, sizes: [...currentSizes, size] });
                                } else {
                                  setFormData({ ...formData, sizes: currentSizes.filter(s => s !== size) });
                                }
                              }}
                              className="rounded border-border"
                            />
                            <span className="text-sm font-medium">{size}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        💡 Ürünün mevcut olduğu bedenleri seçin. Müşteriler bu bedenler arasından seçim yapabilecek. Beden seçmezseniz bu özellik gösterilmez.
                      </p>
                    </div>

                    {formData.sizes && formData.sizes.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                        <p className="text-xs font-medium mb-2">✅ Seçili Bedenler:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.sizes.map((size) => (
                            <span key={size} className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Numara Seçeneği (Ayakkabı/Bot için) */}
                  <div className="space-y-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">👟</span>
                      <h3 className="font-semibold text-sm">Numara (Opsiyonel - Ayakkabı/Bot İçin)</h3>
                    </div>
                    
                    <div>
                      <Label>Mevcut Numaralar (Çoklu Seçim)</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {['39', '39.5', '40', '40.5', '41', '41.5', '42', '42.5', '43', '43.5', '44', '44.5', '45', '46'].map((size) => (
                          <label key={size} className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.shoe_sizes?.includes(size) || false}
                              onChange={(e) => {
                                const currentSizes = formData.shoe_sizes || [];
                                if (e.target.checked) {
                                  setFormData({ ...formData, shoe_sizes: [...currentSizes, size] });
                                } else {
                                  setFormData({ ...formData, shoe_sizes: currentSizes.filter(s => s !== size) });
                                }
                              }}
                              className="rounded border-border"
                            />
                            <span className="text-sm font-medium">{size}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        💡 Ürünün mevcut olduğu numaraları seçin. Müşteriler bu numaralar arasından seçim yapabilecek. Numara seçmezseniz bu özellik gösterilmez.
                      </p>
                    </div>

                    {formData.shoe_sizes && formData.shoe_sizes.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                        <p className="text-xs font-medium mb-2">✅ Seçili Numaralar:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.shoe_sizes.map((size) => (
                            <span key={size} className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>


                  {/* Özellikler */}
                  <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      ✨ Ürün Özellikleri
                      <span className="text-xs font-normal text-muted-foreground">(Her satıra bir özellik)</span>
                    </h3>
                    <Textarea
                      id="features"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="Su geçirmez yapı&#10;Hafif ve dayanıklı&#10;Kolay temizlenebilir&#10;UV koruma&#10;Ergonomik tasarım"
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 Her satıra bir özellik yazın. Ürün detay sayfasında liste olarak gösterilecek.
                    </p>
                  </div>

                  {/* Teknik Özellikler */}
                  <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      🔧 Teknik Özellikler
                      <span className="text-xs font-normal text-muted-foreground">(Anahtar: Değer formatında)</span>
                    </h3>
                    <Textarea
                      id="technical_specs"
                      value={formData.technical_specs}
                      onChange={(e) => setFormData({ ...formData, technical_specs: e.target.value })}
                      placeholder="Malzeme: Polyester&#10;Ağırlık: 250g&#10;Boyut: 30cm x 20cm x 10cm&#10;Renk Seçenekleri: Mavi, Yeşil, Kırmızı&#10;Garanti Süresi: 2 Yıl&#10;Üretim Yeri: Türkiye"
                      rows={8}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 Her satıra "Anahtar: Değer" formatında yazın. Örnek: Malzeme: Polyester
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingProduct ? 'Güncelle' : 'Ekle'}
                    </Button>
                    {editingProduct && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        İptal
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Ürün Listesi */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Ürünler ({products.length})</h2>
              <div className="space-y-4 max-h-[800px] overflow-y-auto">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            {(product as any).badge && (
                              <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded">
                                {(product as any).badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                          <p className="text-xs text-muted-foreground mt-1">Kategori: {product.category || '—'}</p>
                          <p className="text-lg font-bold text-primary mt-2">
                            ₺{product.price.toLocaleString()}
                          </p>
                          <p className="text-sm mt-1">Stok: {product.stock_quantity}</p>
                          <div className="flex gap-2 mt-2">
                            {product.featured && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Öne Çıkan</span>
                            )}
                            {(product as any).features?.best_seller && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Çok Satan</span>
                            )}
                            {(product as any).features?.new_arrival && (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Yeni</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          </>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Siparişler</h1>
                <p className="text-sm text-muted-foreground">{orders.length} sipariş kayıtlı</p>
              </div>

              {orders.length === 0 ? (
                <Card>
                  <CardContent className="py-12">
                    <p className="text-center text-muted-foreground">Henüz sipariş yok.</p>
                  </CardContent>
                </Card>
              ) : (
                <Accordion type="single" collapsible className="space-y-2">
                  {orders.map((order) => (
                    <AccordionItem key={order.id} value={order.id} className="border rounded-lg bg-card">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-4">
                            <div className="text-left">
                              <p className="font-semibold text-sm">Sipariş #{order.order_number}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString('tr-TR', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="hidden md:flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{order.customer_name}</span>
                              <span className="text-xs">•</span>
                              <span className="text-xs font-medium text-primary">₺{parseFloat(order.total_amount).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              order.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                              order.status === 'preparing' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                              order.status === 'shipped' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                              order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                              order.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                              'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                            }`}>
                              {order.status === 'pending' ? '⏳' : 
                               order.status === 'preparing' ? '📦' :
                               order.status === 'shipped' ? '🚚' :
                               order.status === 'delivered' ? '✅' :
                               order.status === 'cancelled' ? '❌' : '•'}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!confirm(`Sipariş #${order.order_number} silinecek. Emin misiniz?`)) return;
                                
                                const { error } = await (supabase as any)
                                  .from('orders')
                                  .delete()
                                  .eq('id', order.id);

                                if (error) {
                                  toast({
                                    title: 'Hata',
                                    description: 'Sipariş silinemedi.',
                                    variant: 'destructive',
                                  });
                                } else {
                                  toast({
                                    title: 'Başarılı',
                                    description: 'Sipariş silindi.',
                                  });
                                  loadOrders();
                                }
                              }}
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-muted/20 p-3 rounded-lg">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              👤 Müşteri Bilgileri
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <span className="text-muted-foreground min-w-[80px]">Ad Soyad:</span>
                                <span className="font-medium">{order.customer_name}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-muted-foreground min-w-[80px]">E-posta:</span>
                                <span className="font-medium break-all">{order.customer_email}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-muted-foreground min-w-[80px]">Telefon:</span>
                                <span className="font-medium">{order.customer_phone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-muted/20 p-3 rounded-lg">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              📍 Teslimat Adresi
                            </h4>
                            <div className="space-y-1 text-sm">
                              <p className="font-medium">{order.address_line}</p>
                              <p className="text-muted-foreground">{order.district} / {order.city}</p>
                              {order.postal_code && <p className="text-muted-foreground">Posta Kodu: {order.postal_code}</p>}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Sipariş Detayları</h4>
                          <div className="space-y-2">
                            {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                              <div key={idx} className="bg-muted/30 p-3 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {item.color && (
                                        <span className="inline-flex items-center gap-1 text-xs bg-background px-2 py-0.5 rounded">
                                          🎨 {item.color}
                                        </span>
                                      )}
                                      {item.size && (
                                        <span className="inline-flex items-center gap-1 text-xs bg-background px-2 py-0.5 rounded">
                                          📏 Beden: {item.size}
                                        </span>
                                      )}
                                      {item.shoeSize && (
                                        <span className="inline-flex items-center gap-1 text-xs bg-background px-2 py-0.5 rounded">
                                          👟 Numara: {item.shoeSize}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <p className="text-xs text-muted-foreground">Adet: {item.quantity}</p>
                                    <p className="font-medium text-sm">₺{(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                                  <span>Birim Fiyat: ₺{item.price.toFixed(2)}</span>
                                  {item.brand && <span>Marka: {item.brand}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Ödeme Yöntemi</p>
                              <p className="font-semibold text-sm">
                                {order.payment_method === 'credit-card' ? '💳 Kredi Kartı' :
                                 order.payment_method === 'bank-transfer' ? '🏦 Havale/EFT' :
                                 order.payment_method === 'cash-on-delivery' ? '💵 Kapıda Ödeme' : order.payment_method}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground mb-1">Toplam Tutar</p>
                              <p className="text-2xl font-bold text-primary">₺{parseFloat(order.total_amount).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Sipariş Durumu Güncelleme */}
                        <div className="pt-4 border-t space-y-4">
                          <div className="bg-muted/20 p-3 rounded-lg">
                            <Label htmlFor={`status-${order.id}`} className="text-sm font-medium mb-2 block flex items-center gap-2">
                              🔄 Sipariş Durumu
                            </Label>
                            <select
                              id={`status-${order.id}`}
                              value={order.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                const { error } = await (supabase as any)
                                  .from('orders')
                                  .update({ status: newStatus })
                                  .eq('id', order.id);

                                if (error) {
                                  toast({
                                    title: 'Hata',
                                    description: 'Durum güncellenemedi.',
                                    variant: 'destructive',
                                  });
                                } else {
                                  toast({
                                    title: 'Başarılı',
                                    description: 'Sipariş durumu güncellendi.',
                                  });
                                  loadOrders(); // Listeyi yenile
                                }
                              }}
                              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm font-medium"
                            >
                              <option value="pending">⏳ Beklemede</option>
                              <option value="preparing">📦 Hazırlanıyor</option>
                              <option value="shipped">🚚 Kargoda</option>
                              <option value="delivered">✅ Teslim Edildi</option>
                              <option value="cancelled">❌ İptal Edildi</option>
                            </select>
                          </div>

                          {/* Kargo Takip Numarası */}
                          <div>
                            <Label htmlFor={`tracking-${order.id}`} className="text-sm font-medium mb-2 block">
                              📦 Kargo Takip Numarası
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id={`tracking-${order.id}`}
                                placeholder="Takip numarası girin..."
                                defaultValue={order.tracking_number || ''}
                                onBlur={async (e) => {
                                  const trackingNumber = e.target.value.trim();
                                  if (trackingNumber === order.tracking_number) return;

                                  const { error } = await (supabase as any)
                                    .from('orders')
                                    .update({ tracking_number: trackingNumber || null })
                                    .eq('id', order.id);

                                  if (error) {
                                    toast({
                                      title: 'Hata',
                                      description: 'Takip numarası güncellenemedi.',
                                      variant: 'destructive',
                                    });
                                  } else {
                                    toast({
                                      title: 'Başarılı',
                                      description: 'Kargo takip numarası kaydedildi.',
                                    });
                                    loadOrders();
                                  }
                                }}
                                className="flex-1"
                              />
                              {order.tracking_number && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    navigator.clipboard.writeText(order.tracking_number);
                                    toast({
                                      title: 'Kopyalandı!',
                                      description: 'Takip numarası panoya kopyalandı.',
                                    });
                                  }}
                                >
                                  📋
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Kargo firmasının verdiği takip numarasını girin
                            </p>
                          </div>

                          {/* Admin Notları */}
                          <div>
                            <Label htmlFor={`notes-${order.id}`} className="text-sm font-medium mb-2 block">
                              📝 Admin Notları
                            </Label>
                            <Textarea
                              id={`notes-${order.id}`}
                              placeholder="Sipariş hakkında notlar..."
                              defaultValue={order.admin_notes || ''}
                              onBlur={async (e) => {
                                const notes = e.target.value.trim();
                                if (notes === order.admin_notes) return;

                                const { error } = await (supabase as any)
                                  .from('orders')
                                  .update({ admin_notes: notes || null })
                                  .eq('id', order.id);

                                if (error) {
                                  toast({
                                    title: 'Hata',
                                    description: 'Notlar güncellenemedi.',
                                    variant: 'destructive',
                                  });
                                } else {
                                  toast({
                                    title: 'Başarılı',
                                    description: 'Admin notları kaydedildi.',
                                  });
                                  loadOrders();
                                }
                              }}
                              rows={3}
                              className="resize-none"
                            />
                          </div>
                        </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          )}

          {/* Newsletter Tab */}
          {activeTab === 'newsletter' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Newsletter Aboneleri</h1>
                <p className="text-sm text-muted-foreground">{subscribers.length} abone kayıtlı</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Abone Listesi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {subscribers.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Henüz abone yok.</p>
                    ) : (
                      <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full">
                          <thead className="border-b">
                            <tr>
                              <th className="text-left py-2 px-4">E-posta</th>
                              <th className="text-left py-2 px-4">Kayıt Tarihi</th>
                              <th className="text-left py-2 px-4">Durum</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subscribers.map((sub) => (
                              <tr key={sub.id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-4 font-medium">{sub.email}</td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                  {new Date(sub.subscribed_at).toLocaleDateString('tr-TR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    sub.is_active 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {sub.is_active ? 'Aktif' : 'Pasif'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  
                  {subscribers.length > 0 && (
                    <div className="mt-4 pt-4 border-t flex gap-2 flex-wrap">
                      <Button
                        onClick={() => {
                          const emails = subscribers.map(s => s.email).join(', ');
                          navigator.clipboard.writeText(emails);
                          toast({
                            title: 'Kopyalandı!',
                            description: `${subscribers.length} e-posta adresi panoya kopyalandı.`,
                          });
                        }}
                        variant="outline"
                      >
                        📋 Tüm E-postaları Kopyala
                      </Button>
                      <Button
                        onClick={() => {
                          const emails = subscribers.map(s => s.email).join(',');
                          const subject = 'EgemOutdoor - Kampanya';
                          const body = 'Merhaba,%0D%0A%0D%0AYeni kampanyalarımız hakkında bilgi vermek istiyoruz...%0D%0A%0D%0AEgemOutdoor Ekibi';
                          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=egemoutdoor@gmail.com&bcc=${encodeURIComponent(emails)}&su=${encodeURIComponent(subject)}&body=${body}`;
                          window.open(gmailUrl, '_blank');
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        📧 Gmail ile Toplu Gönder
                      </Button>
                      <Button
                        onClick={() => {
                          const emails = subscribers.map(s => s.email).join(';');
                          const subject = 'EgemOutdoor - Kampanya';
                          const body = 'Merhaba,%0D%0A%0D%0AYeni kampanyalarımız hakkında bilgi vermek istiyoruz...%0D%0A%0D%0AEgemOutdoor Ekibi';
                          const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=egemoutdoor@gmail.com&bcc=${encodeURIComponent(emails)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                          window.open(outlookUrl, '_blank');
                        }}
                        variant="outline"
                      >
                        📨 Outlook ile Gönder
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Coupons Tab */}
          {activeTab === 'coupons' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Kupon Yönetimi</h1>
                <p className="text-sm text-muted-foreground">İndirim kuponları oluşturun ve yönetin</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>🎟️ Kupon Sistemi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🚧</div>
                    <h3 className="text-xl font-semibold mb-2">Kupon Sistemi Yakında!</h3>
                    <p className="text-muted-foreground mb-6">
                      Kupon oluşturma ve yönetim özellikleri çok yakında eklenecek.
                    </p>
                    <div className="max-w-md mx-auto text-left bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Planlanan Özellikler:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>✅ Yüzde veya sabit tutar indirimi</li>
                        <li>✅ Minimum sepet tutarı</li>
                        <li>✅ Kullanım limiti</li>
                        <li>✅ Geçerlilik tarihi</li>
                        <li>✅ Tek kullanımlık veya çoklu</li>
                        <li>✅ Belirli kategorilere özel</li>
                      </ul>
                    </div>
                    <p className="text-xs text-muted-foreground mt-6">
                      Şu an için kupon kodu manuel olarak uygulanabilir.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Admin;
