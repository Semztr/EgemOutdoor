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
import { Package, User, Heart, MapPin, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  order_items: { quantity: number }[];
}

interface Profile {
  full_name: string;
  phone: string;
  email: string;
}

const Account = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile>({ full_name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Profil bilgilerini çek
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;

      setProfile({
        full_name: profileData.full_name || '',
        phone: profileData.phone || '',
        email: profileData.email || user?.email || ''
      });

      // Siparişleri çek
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, order_items(quantity)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      toast({
        title: "Hata",
        description: "Veriler yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Profil bilgileriniz güncellendi."
      });
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
                          const itemCount = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
                          return (
                            <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <p className="font-semibold">Sipariş #{order.id.slice(0, 8)}</p>
                                  <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                                  <p className="text-sm">{itemCount} ürün</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">{Number(order.total_amount).toFixed(2)} ₺</p>
                                  <p className="text-sm text-primary">{getStatusText(order.status)}</p>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-4 w-full sm:w-auto"
                                onClick={() => navigate(`/siparis-takip?order=${order.id}`)}
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
                <Card>
                  <CardHeader>
                    <CardTitle>Profil Bilgilerim</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Ad Soyad</Label>
                        <Input 
                          id="fullName" 
                          value={profile.full_name}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
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
                        <Label htmlFor="phone">Telefon</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                      <Button type="submit" disabled={updating}>
                        {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Bilgileri Güncelle
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Adreslerim */}
              <TabsContent value="addresses" className="animate-fade-in">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Adreslerim</CardTitle>
                      <Button>Yeni Adres Ekle</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">Ev</h3>
                          <Button variant="ghost" size="sm">Düzenle</Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Atatürk Cad. No:123<br />
                          Kadıköy, İstanbul<br />
                          34000<br />
                          Türkiye
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">İş</h3>
                          <Button variant="ghost" size="sm">Düzenle</Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          İstiklal Cad. No:456<br />
                          Beyoğlu, İstanbul<br />
                          34000<br />
                          Türkiye
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Favoriler */}
              <TabsContent value="favorites" className="animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Favori Ürünlerim</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">Henüz favori ürününüz bulunmuyor.</p>
                      <Button onClick={() => window.location.href = '/urunler'}>
                        Ürünleri Keşfet
                      </Button>
                    </div>
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