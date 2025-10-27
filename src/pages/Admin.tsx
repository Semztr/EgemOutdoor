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
import { useToast } from '@/hooks/use-toast';
import { Loader2, Pencil, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { siteCategories } from '@/data/categories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type Product = Tables<'products'>;
type ProductInsert = TablesInsert<'products'>;

const Admin = () => {
  console.log('[Admin] Component rendering...');
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [mainCategory, setMainCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'products' | 'newsletter' | 'orders' | 'coupons'>('products');
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    category: '',
    image_url: '',
    stock_quantity: '',
    colors: '',
    featured: false as boolean,
    best_seller: false as boolean,
    new_arrival: false as boolean,
    badge: '' as string,
    color_options: '',
    extra_images: '',
    agirlik: '',
    features: '',
    technical_specs: '',
  });

  useEffect(() => {
    console.log('[Admin] useEffect - checkAdminStatus', { user: user?.id, authLoading });
    checkAdminStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
      loadSubscribers();
      loadOrders();
    }
  }, [isAdmin]);

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

    console.log('Checking admin status for user:', user.id);
    if (SUPER_ADMIN_IDS.includes(user.id)) {
      console.log('Admin user (allowlist):', user.id);
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    try {
      console.log('Checking user_roles for user:', user.id);
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
        console.log('User is not an admin:', user.id);
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
        console.warn('Newsletter tablosu bulunamadı:', error);
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
        console.warn('Orders tablosu bulunamadı:', error);
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
    const parsedPrice = parseFloat(formData.price);
    if (Number.isNaN(parsedPrice)) {
      toast({ title: 'Geçersiz Fiyat', description: 'Lütfen geçerli bir fiyat girin.', variant: 'destructive' });
      return;
    }
    const parsedStock = parseInt(formData.stock_quantity) || 0;

    // Ensure category fallback: if no explicit subcategory composed, but a main category is selected,
    // persist the main category slug so root pages can list it.
    const effectiveCategory = (formData.category && formData.category.trim())
      ? formData.category.trim()
      : (mainCategory || '');

    const productData: Partial<ProductInsert> = {
      name: formData.name,
      description: formData.description || null,
      price: parsedPrice,
      brand: formData.brand || null,
      category: effectiveCategory || null,
      image_url: formData.image_url || null,
      stock_quantity: parsedStock,
      colors: formData.colors ? formData.colors.split(',').map(c => c.trim()) : [],
      is_active: true,
      featured: !!formData.featured,
      badge: formData.badge || null,
      color_options: formData.color_options ? formData.color_options.split(',').map(s => s.trim()).filter(Boolean) : [],
      extra_images: formData.extra_images ? formData.extra_images.split(',').map(s => s.trim()).filter(Boolean) : [],
    } as any;

    // JSONB features - Array format
    let featuresArray: string[] = [];
    if (formData.features.trim()) {
      featuresArray = formData.features.split('\n').map(f => f.trim()).filter(Boolean);
    }
    if (featuresArray.length > 0) {
      (productData as any).features = featuresArray;
    }

    // JSONB technical_specs - Object format
    let techSpecs: Record<string, string> = {};
    if (formData.technical_specs.trim()) {
      const lines = formData.technical_specs.split('\n');
      lines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          techSpecs[key.trim()] = valueParts.join(':').trim();
        }
      });
    }
    if (Object.keys(techSpecs).length > 0) {
      (productData as any).technical_specs = techSpecs;
    }

    // Legacy features for backward compatibility
    const legacyFeatures: Record<string, any> = {};
    if (formData.agirlik.trim()) legacyFeatures.agirlik = formData.agirlik.trim();
    if (formData.best_seller) legacyFeatures.best_seller = true;
    if (formData.new_arrival) legacyFeatures.new_arrival = true;

    try {
      console.debug('[Admin] Saving product payload:', productData);
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        
        toast({
          title: 'Başarılı',
          description: 'Ürün güncellendi.',
        });
        // Güncelleme sonrası ürün detayına git
        navigate(`/urun/${editingProduct.id}`);
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
        if (data?.id) {
          navigate(`/urun/${data.id}`);
        }
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
    setEditingProduct(product);
    
    // Parse features array
    let featuresText = '';
    if (Array.isArray((product as any).features)) {
      featuresText = (product as any).features.join('\n');
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
      brand: product.brand || '',
      category: product.category || '',
      image_url: product.image_url || '',
      stock_quantity: product.stock_quantity.toString(),
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      featured: !!product.featured,
      best_seller: !!(product as any).features?.best_seller,
      new_arrival: !!(product as any).features?.new_arrival,
      badge: (product as any).badge || '',
      color_options: Array.isArray(product.color_options) ? product.color_options.join(', ') : '',
      extra_images: Array.isArray(product.extra_images) ? product.extra_images.join(', ') : '',
      agirlik: (product as any).features?.agirlik || '',
      features: featuresText,
      technical_specs: techSpecsText,
    });

    // Kategori seçimlerini doldur
    const catValue = product.category || '';
    if (catValue.includes('/')) {
      const firstSlash = catValue.indexOf('/');
      const main = catValue.slice(0, firstSlash);
      const sub = catValue.slice(firstSlash + 1); // geri kalan kısmı koru (ör: olta-makineleri/spin)
      setMainCategory(main);
      setSubCategory(sub);
    } else if (catValue) {
      // Sadece alt slug kaydedilmişse, hangi ana kategoriye ait olduğunu bul
      const match = siteCategories.find(c => c.subcategories.some(s => s.slug === catValue));
      if (match) {
        setMainCategory(match.slug);
        setSubCategory(catValue);
      } else {
        setMainCategory('');
        setSubCategory('');
      }
    } else {
      setMainCategory('');
      setSubCategory('');
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
      brand: '',
      category: '',
      image_url: '',
      stock_quantity: '',
      colors: '',
      featured: false,
      best_seller: false,
      new_arrival: false,
      badge: '',
      color_options: '',
      extra_images: '',
      agirlik: '',
      features: '',
      technical_specs: '',
    });
    setMainCategory('');
    setSubCategory('');
  };

  if (loading) {
    console.log('[Admin] Rendering loading state...');
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
                      <Label htmlFor="price">Fiyat *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="agirlik">Ağırlık (features JSONB)</Label>
                      <Input
                        id="agirlik"
                        value={formData.agirlik}
                        onChange={(e) => setFormData({ ...formData, agirlik: e.target.value })}
                        placeholder="Örn: 1 gr"
                      />
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Ana Kategori</Label>
                      <Select
                        value={mainCategory}
                        onValueChange={(val) => {
                          setMainCategory(val);
                          // Ana kategori değişince alt kategoriyi sıfırla
                          setSubCategory('');
                          setFormData({ ...formData, category: '' });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          {siteCategories.map((cat) => (
                            <SelectItem key={cat.slug} value={cat.slug}>{cat.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Alt Kategori</Label>
                      <Select
                        value={subCategory}
                        onValueChange={(val) => {
                          setSubCategory(val);
                          const composed = mainCategory ? `${mainCategory}/${val}` : val;
                          setFormData({ ...formData, category: composed });
                        }}
                        disabled={!mainCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={mainCategory ? 'Seçiniz' : 'Önce ana kategori'} />
                        </SelectTrigger>
                        <SelectContent>
                          {siteCategories
                            .find((c) => c.slug === mainCategory)?.subcategories.map((sub) => (
                              <SelectItem key={sub.slug} value={sub.slug}>{sub.name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image_url">Görsel URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
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
                      <Label htmlFor="featured">Öne Çıkan Ürün (Ana Sayfa)</Label>
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

                    <div>
                      <Label htmlFor="badge">Badge (Rozet)</Label>
                      <Select
                        value={formData.badge || "none"}
                        onValueChange={(val) => setFormData({ ...formData, badge: val === "none" ? "" : val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seçiniz (opsiyonel)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Yok</SelectItem>
                          <SelectItem value="Yeni">Yeni</SelectItem>
                          <SelectItem value="İndirim">İndirim</SelectItem>
                          <SelectItem value="Çok Satan">Çok Satan</SelectItem>
                          <SelectItem value="Özel">Özel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="colors">Renkler (virgülle ayırın)</Label>
                    <Input
                      id="colors"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      placeholder="Kırmızı, Mavi, Yeşil"
                    />
                  </div>

                  <div>
                    <Label htmlFor="color_options">Renk Seçenekleri (virgülle ayırın)</Label>
                    <Input
                      id="color_options"
                      value={formData.color_options}
                      onChange={(e) => setFormData({ ...formData, color_options: e.target.value })}
                      placeholder="Siyah, Yeşil, Kamuflaj"
                    />
                  </div>

                  <div>
                    <Label htmlFor="extra_images">Ek Görseller (virgülle ayırın)</Label>
                    <Input
                      id="extra_images"
                      value={formData.extra_images}
                      onChange={(e) => setFormData({ ...formData, extra_images: e.target.value })}
                      placeholder="https://..., https://..."
                    />
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

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="py-12">
                      <p className="text-center text-muted-foreground">Henüz sipariş yok.</p>
                    </CardContent>
                  </Card>
                ) : (
                  orders.map((order) => (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Sipariş #{order.order_number}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(order.created_at).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status === 'pending' ? 'Beklemede' : 
                             order.status === 'completed' ? 'Tamamlandı' : order.status}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Müşteri Bilgileri</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Ad Soyad:</strong> {order.customer_name}</p>
                              <p><strong>E-posta:</strong> {order.customer_email}</p>
                              <p><strong>Telefon:</strong> {order.customer_phone}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Teslimat Adresi</h4>
                            <div className="space-y-1 text-sm">
                              <p>{order.address_line}</p>
                              <p>{order.district} / {order.city}</p>
                              {order.postal_code && <p>Posta Kodu: {order.postal_code}</p>}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Sipariş Detayları</h4>
                          <div className="space-y-2">
                            {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm bg-muted/30 p-2 rounded">
                                <span>{item.name} x {item.quantity}</span>
                                <span className="font-medium">₺{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t">
                          <div>
                            <p className="text-sm text-muted-foreground">Ödeme Yöntemi</p>
                            <p className="font-medium">
                              {order.payment_method === 'credit-card' ? '💳 Kredi Kartı' :
                               order.payment_method === 'bank-transfer' ? '🏦 Havale/EFT' :
                               order.payment_method === 'cash-on-delivery' ? '📱 Kapıda Ödeme' : order.payment_method}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Toplam Tutar</p>
                            <p className="text-2xl font-bold text-primary">₺{parseFloat(order.total_amount).toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Sipariş Durumu Güncelleme */}
                        <div className="pt-4 border-t">
                          <Label htmlFor={`status-${order.id}`} className="text-sm font-medium mb-2 block">Sipariş Durumu</Label>
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
                            className="w-full px-3 py-2 border border-border rounded-md bg-background"
                          >
                            <option value="pending">Beklemede</option>
                            <option value="preparing">Hazırlanıyor</option>
                            <option value="shipped">Kargoda</option>
                            <option value="delivered">Teslim Edildi</option>
                            <option value="cancelled">İptal Edildi</option>
                          </select>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
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
