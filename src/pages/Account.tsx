import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, User, Heart, MapPin, LogOut, Loader2, ShoppingCart, Trash2, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: any[];
  payment_method: string;
  customer_name: string;
  address_line: string;
  city: string;
  district: string;
}

interface Profile {
  full_name: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  district?: string;
  postal_code?: string;
}

interface Address {
  id: string;
  title: string;
  address_line: string;
  city: string;
  district?: string;
  postal_code?: string;
  is_default: boolean;
}

const Account = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { favorites, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile>({ full_name: '', phone: '', email: '' });
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    title: '',
    address_line: '',
    city: '',
    district: '',
    postal_code: '',
    is_default: false
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/giris');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      loadAddresses();
    }
  }, [user]);

  useEffect(() => {
    if (favorites.length > 0) {
      loadFavoriteProducts();
    } else {
      setFavoriteProducts([]);
    }
  }, [favorites]);

  const fetchUserData = async () => {
    try {
      // Profil bilgilerini çek
      const { data: profileData, error: profileError } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profil verisi alınamadı:', profileError);
      }

      setProfile({
        full_name: (profileData && profileData.full_name) || '',
        phone: (profileData && profileData.phone) || '',
        email: (profileData && profileData.email) || user?.email || '',
        address: (profileData && profileData.address) || '',
        city: (profileData && profileData.city) || '',
        district: (profileData && profileData.district) || '',
        postal_code: (profileData && profileData.postal_code) || ''
      });

      // Siparişleri çek
      const { data: ordersData, error: ordersError} = await (supabase as any)
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Siparişler alınamadı:', ordersError);
      }
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Veri yüklenirken beklenmeyen hata:', error);
      // Kullanıcı deneyimini bölmemek için toast göstermeden devam et
    } finally {
      setLoading(false);
    }
  };

  const loadFavoriteProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, brand, image_url')
        .in('id', favorites);

      if (error) {
        console.error('Favori ürünler yüklenemedi:', error);
        return;
      }

      setFavoriteProducts(data || []);
    } catch (error) {
      console.error('Favori ürünler yüklenirken hata:', error);
    }
  };

  const loadAddresses = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Adresler yüklenemedi:', error);
        return;
      }

      setAddresses(data || []);
    } catch (error) {
      console.error('Adresler yüklenirken hata:', error);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      if (editingAddressId) {
        // Güncelle
        const { error } = await (supabase as any)
          .from('addresses')
          .update({
            title: addressForm.title,
            address_line: addressForm.address_line,
            city: addressForm.city,
            district: addressForm.district,
            postal_code: addressForm.postal_code,
            is_default: addressForm.is_default
          })
          .eq('id', editingAddressId);

        if (error) throw error;

        toast({
          title: 'Başarılı',
          description: 'Adres güncellendi.'
        });
      } else {
        // Yeni ekle
        const { error } = await (supabase as any)
          .from('addresses')
          .insert({
            user_id: user?.id,
            title: addressForm.title,
            address_line: addressForm.address_line,
            city: addressForm.city,
            district: addressForm.district,
            postal_code: addressForm.postal_code,
            is_default: addressForm.is_default
          });

        if (error) throw error;

        toast({
          title: 'Başarılı',
          description: 'Yeni adres eklendi.'
        });
      }

      // Formu sıfırla ve listeyi yenile
      setAddressForm({
        title: '',
        address_line: '',
        city: '',
        district: '',
        postal_code: '',
        is_default: false
      });
      setShowAddressForm(false);
      setEditingAddressId(null);
      await loadAddresses();
    } catch (error) {
      console.error('Adres kaydedilirken hata:', error);
      toast({
        title: 'Hata',
        description: 'Adres kaydedilemedi.',
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setAddressForm({
      title: address.title,
      address_line: address.address_line,
      city: address.city,
      district: address.district || '',
      postal_code: address.postal_code || '',
      is_default: address.is_default
    });
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Bu adresi silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await (supabase as any)
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Başarılı',
        description: 'Adres silindi.'
      });

      await loadAddresses();
    } catch (error) {
      console.error('Adres silinirken hata:', error);
      toast({
        title: 'Hata',
        description: 'Adres silinemedi.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    try {
      // Upsert kullan (insert or update)
      const { error } = await (supabase as any)
        .from('profiles')
        .upsert({
          id: user?.id,
          email: user?.email,
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          district: profile.district,
          postal_code: profile.postal_code,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Profil güncelleme hatası:', error);
        throw error;
      }

      toast({
        title: "Başarılı",
        description: "Profil bilgileriniz güncellendi."
      });
      
      // Profili yeniden yükle
      await fetchUserData();
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast({
      title: "Çıkış Yapıldı",
      description: "Başarıyla çıkış yaptınız."
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'Beklemede',
      processing: 'Hazırlanıyor',
      shipped: 'Kargoda',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    };
    return statusMap[status] || status;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Hesabım - EgemOutdoor</title>
        <meta name="description" content="Hesap bilgilerinizi yönetin, siparişlerinizi takip edin." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 animate-fade-in">Hesabım</h1>
            
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto">
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Siparişlerim</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profil</span>
                </TabsTrigger>
                <TabsTrigger value="addresses" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Adreslerim</span>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Favoriler</span>
                </TabsTrigger>
              </TabsList>

              {/* Siparişlerim */}
              <TabsContent value="orders" className="space-y-4 animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Siparişlerim</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => {
                          const items = Array.isArray(order.items) ? order.items : [];
                          const itemCount = items.reduce((sum: number, item: any) => sum + (item?.quantity || 0), 0);
                          return (
                            <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <p className="font-semibold">Sipariş #{order.order_number}</p>
                                  <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                                  <p className="text-sm">{itemCount} ürün</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {order.payment_method === 'credit-card' ? '💳 Kredi Kartı' :
                                     order.payment_method === 'bank-transfer' ? '🏦 Havale/EFT' :
                                     order.payment_method === 'cash-on-delivery' ? '📱 Kapıda Ödeme' : order.payment_method}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">₺{Number(order.total_amount).toFixed(2)}</p>
                                  <p className="text-sm text-primary">{getStatusText(order.status)}</p>
                                </div>
                              </div>
                              
                              {/* Sipariş Detayları */}
                              <div className="mt-4 pt-4 border-t space-y-2">
                                <p className="text-sm font-medium">Sipariş Detayları:</p>
                                {items.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>₺{(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Teslimat Adresi */}
                              <div className="mt-4 pt-4 border-t">
                                <p className="text-sm font-medium mb-1">Teslimat Adresi:</p>
                                <p className="text-sm text-muted-foreground">{order.address_line}</p>
                                <p className="text-sm text-muted-foreground">{order.district} / {order.city}</p>
                              </div>

                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-4 w-full sm:w-auto"
                                onClick={() => navigate(`/siparis-takip?order=${order.order_number}`)}
                              >
                                Detayları Görüntüle
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Henüz siparişiniz bulunmuyor.</p>
                        <Button onClick={() => navigate('/urunler')}>
                          Alışverişe Başla
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profil */}
              <TabsContent value="profile" className="animate-fade-in">
                <div className="grid gap-6">
                  {/* Mevcut Bilgiler */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Kayıtlı Bilgilerim
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b">
                          <div>
                            <p className="text-sm text-muted-foreground">Ad Soyad</p>
                            <p className="font-medium">{profile.full_name || 'Belirtilmemiş'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b">
                          <div>
                            <p className="text-sm text-muted-foreground">E-posta</p>
                            <p className="font-medium">{profile.email || 'Belirtilmemiş'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Telefon</p>
                            <p className="font-medium">{profile.phone || 'Belirtilmemiş'}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Düzenleme Formu */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Bilgilerimi Düzenle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                          <Label htmlFor="fullName">Ad Soyad</Label>
                          <Input 
                            id="fullName" 
                            value={profile.full_name}
                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            placeholder="Adınız Soyadınız"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">E-posta</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={profile.email}
                            disabled
                            className="bg-muted"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            E-posta adresi değiştirilemez
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefon *</Label>
                          <Input 
                            id="phone" 
                            type="tel" 
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            placeholder="05XX XXX XX XX"
                            required
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Sipariş bildirimleri için gereklidir
                          </p>
                        </div>
                        <Button type="submit" disabled={updating} className="w-full">
                          {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Bilgileri Güncelle
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Adreslerim - Çoklu Adres Sistemi */}
              <TabsContent value="addresses" className="animate-fade-in">
                <div className="space-y-4">
                  {/* Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Adreslerim ({addresses.length})
                        </CardTitle>
                        <Button 
                          onClick={() => {
                            setAddressForm({
                              title: '',
                              address_line: '',
                              city: '',
                              district: '',
                              postal_code: '',
                              is_default: addresses.length === 0
                            });
                            setEditingAddressId(null);
                            setShowAddressForm(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Yeni Adres Ekle
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Adres Listesi */}
                  {addresses.length > 0 ? (
                    <div className="grid gap-4">
                      {addresses.map((address) => (
                        <Card key={address.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold">{address.title}</h3>
                                    {address.is_default && (
                                      <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                                        Varsayılan
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm mb-1">{address.address_line}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {address.district && `${address.district}, `}
                                    {address.city}
                                    {address.postal_code && ` - ${address.postal_code}`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditAddress(address)}
                                >
                                  Düzenle
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteAddress(address.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : !showAddressForm && (
                    <Card className="border-dashed">
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="font-semibold mb-2">Henüz adres eklenmemiş</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Hızlı teslimat için adres bilgilerinizi ekleyin
                          </p>
                          <Button onClick={() => setShowAddressForm(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            İlk Adresi Ekle
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Adres Ekleme/Düzenleme Formu */}
                  {showAddressForm && (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {editingAddressId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSaveAddress} className="space-y-4">
                          <div>
                            <Label htmlFor="title">Adres Başlığı *</Label>
                            <Input
                              id="title"
                              value={addressForm.title}
                              onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                              placeholder="Ev, İş, Diğer..."
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="address_line">Adres *</Label>
                            <Input
                              id="address_line"
                              value={addressForm.address_line}
                              onChange={(e) => setAddressForm({ ...addressForm, address_line: e.target.value })}
                              placeholder="Sokak, Mahalle, Bina No, Daire No"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city">İl *</Label>
                              <Input
                                id="city"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                placeholder="İstanbul"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="district">İlçe</Label>
                              <Input
                                id="district"
                                value={addressForm.district}
                                onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                                placeholder="Kadıköy"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="postal_code">Posta Kodu</Label>
                            <Input
                              id="postal_code"
                              value={addressForm.postal_code}
                              onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                              placeholder="34000"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="is_default"
                              checked={addressForm.is_default}
                              onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                              className="w-4 h-4"
                            />
                            <Label htmlFor="is_default">Varsayılan adres olarak ayarla</Label>
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" disabled={updating} className="flex-1">
                              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              {editingAddressId ? 'Güncelle' : 'Kaydet'}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setShowAddressForm(false);
                                setEditingAddressId(null);
                                setAddressForm({
                                  title: '',
                                  address_line: '',
                                  city: '',
                                  district: '',
                                  postal_code: '',
                                  is_default: false
                                });
                              }}
                              disabled={updating}
                            >
                              İptal
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Favoriler */}
              <TabsContent value="favorites" className="animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Favori Ürünlerim ({favoriteProducts.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {favoriteProducts.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {favoriteProducts.map((product) => (
                          <Card key={product.id} className="gradient-card border-border group relative overflow-hidden shadow-card hover:shadow-xl transition-shadow h-full flex flex-col">
                            {/* Heart icon - Sol Üst */}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 left-2 z-10 bg-background/80 hover:bg-background"
                              onClick={(e) => {
                                e.preventDefault();
                                toggleFavorite(product.id);
                              }}
                            >
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </Button>

                            <CardContent className="p-2 md:p-3 flex flex-col h-full">
                              {/* Product image */}
                              <Link to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                                <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
                                  <img
                                    src={product.image_url || '/placeholder.svg'}
                                    alt={product.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      const target = e.currentTarget as HTMLImageElement;
                                      if (target.dataset.fallback !== '1') {
                                        target.dataset.fallback = '1';
                                        target.src = `https://via.placeholder.com/500x500.png?text=${encodeURIComponent('EgemOutdoor')}`;
                                      }
                                    }}
                                  />
                                </div>
                              </Link>

                              {/* Brand */}
                              {product.brand && (
                                <div className="text-[11px] text-primary font-medium mb-1">{product.brand}</div>
                              )}

                              {/* Product name */}
                              <Link to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                                <h3 className="font-semibold text-foreground mb-1 line-clamp-2 min-h-[32px] group-hover:text-primary transition-colors text-xs md:text-sm">
                                  {product.name}
                                </h3>
                              </Link>

                              {/* Price */}
                              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                                <span className="text-lg font-bold text-primary">₺{product.price.toLocaleString()}</span>
                              </div>

                              {/* Buttons */}
                              <div className="flex gap-1.5 mt-auto">
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  className="flex-1 text-[10px] md:text-xs h-7 md:h-8"
                                  onClick={() => {
                                    addItem({
                                      id: product.id,
                                      name: product.name,
                                      price: product.price,
                                      image: product.image_url,
                                      brand: product.brand || '',
                                    });
                                    toast({
                                      title: 'Sepete Eklendi',
                                      description: `${product.name} sepetinize eklendi.`,
                                    });
                                  }}
                                >
                                  <ShoppingCart className="h-3 w-3 mr-0.5" />
                                  Sepete
                                </Button>
                                <Link to={`/urun/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                                  <Button variant="outline" size="sm" className="text-[10px] md:text-xs h-7 md:h-8 px-2">İncele</Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">Henüz favori ürününüz bulunmuyor.</p>
                        <Link to="/urunler">
                          <Button>
                            Ürünleri Keşfet
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-8 text-center">
              <Button variant="outline" className="gap-2" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Çıkış Yap
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Account;