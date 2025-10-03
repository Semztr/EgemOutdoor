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

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  brand: string | null;
  category: string | null;
  image_url: string | null;
  stock_quantity: number;
  colors: string[] | null;
  is_active: boolean;
}

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    category: '',
    image_url: '',
    stock_quantity: '',
    colors: '',
  });

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) {
      navigate('/giris');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) throw error;
      
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
      setProducts(data || []);
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
      toast({
        title: 'Hata',
        description: 'Ürünler yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      brand: formData.brand || null,
      category: formData.category || null,
      image_url: formData.image_url || null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      colors: formData.colors ? formData.colors.split(',').map(c => c.trim()) : null,
      is_active: true,
    };

    try {
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
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

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
        description: 'Ürün kaydedilirken bir hata oluştu.',
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
    });
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
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Paneli - EgemOutdoor</title>
      </Helmet>

      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Ürün Yönetimi</h1>

          <div className="grid lg:grid-cols-2 gap-8">
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
                      <Label htmlFor="stock">Stok</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
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

                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="image_url">Görsel URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
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
