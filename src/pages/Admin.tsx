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
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [mainCategory, setMainCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
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
    color_options: '',
    extra_images: '',
    agirlik: '',
  });

  useEffect(() => {
    checkAdminStatus();
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
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
      color_options: formData.color_options ? formData.color_options.split(',').map(s => s.trim()).filter(Boolean) : [],
      extra_images: formData.extra_images ? formData.extra_images.split(',').map(s => s.trim()).filter(Boolean) : [],
    };

    // JSONB features POC
    const features: Record<string, any> = {};
    if (formData.agirlik.trim()) features.agirlik = formData.agirlik.trim();
    if (Object.keys(features).length > 0) {
      (productData as any).features = features;
    }

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
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      brand: product.brand || '',
      category: product.category || '',
      image_url: product.image_url || '',
      stock_quantity: product.stock_quantity.toString(),
      colors: product.colors?.join(', ') || '',
      featured: !!product.featured,
      color_options: product.color_options?.join(', ') || '',
      extra_images: product.extra_images?.join(', ') || '',
      agirlik: (product as any).features?.agirlik || '',
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
      color_options: '',
      extra_images: '',
      agirlik: '',
    });
    setMainCategory('');
    setSubCategory('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

                  <div className="flex items-center gap-2">
                    <input
                      id="featured"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <Label htmlFor="featured">Öne Çıkan Ürün</Label>
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
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                          <p className="text-xs text-muted-foreground mt-1">Kategori: {product.category || '—'}</p>
                          <p className="text-lg font-bold text-primary mt-2">
                            ₺{product.price.toLocaleString()}
                          </p>
                          <p className="text-sm mt-1">Stok: {product.stock_quantity}</p>
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
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Admin;
