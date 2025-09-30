import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, User, Heart, MapPin, LogOut } from 'lucide-react';

const Account = () => {
  // Mock data - gerçek uygulamada API'den gelecek
  const orders = [
    {
      id: '12345',
      date: '15 Mart 2024',
      status: 'Kargoda',
      total: 1250.00,
      items: 2
    },
    {
      id: '12344',
      date: '10 Mart 2024',
      status: 'Teslim Edildi',
      total: 850.00,
      items: 1
    }
  ];

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
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <p className="font-semibold">Sipariş #{order.id}</p>
                                <p className="text-sm text-muted-foreground">{order.date}</p>
                                <p className="text-sm">{order.items} ürün</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{order.total.toFixed(2)} ₺</p>
                                <p className="text-sm text-primary">{order.status}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="mt-4 w-full sm:w-auto">
                              Detayları Görüntüle
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Henüz siparişiniz bulunmuyor.</p>
                        <Button onClick={() => window.location.href = '/urunler'}>
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
                    <form className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Ad</Label>
                          <Input id="firstName" defaultValue="Ahmet" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Soyad</Label>
                          <Input id="lastName" defaultValue="Yılmaz" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">E-posta</Label>
                        <Input id="email" type="email" defaultValue="ahmet@example.com" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input id="phone" type="tel" defaultValue="+90 555 123 45 67" />
                      </div>
                      <Button type="submit">Bilgileri Güncelle</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Şifre Değiştir</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">Yeni Şifre</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                      <Button type="submit">Şifreyi Güncelle</Button>
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
              <Button variant="outline" className="gap-2">
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