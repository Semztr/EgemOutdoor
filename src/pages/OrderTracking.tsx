import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Package, Truck, CheckCircle, MapPin } from 'lucide-react';

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [tracking, setTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setTracking(true);
  };

  return (
    <>
      <Helmet>
        <title>Sipariş Takip - EgemOutdoor</title>
        <meta name="description" content="EgemOutdoor sipariş takip sayfası. Siparişinizin durumunu öğrenin." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 animate-fade-in">Sipariş Takip</h1>
            
            <Card className="mb-8 animate-fade-in">
              <CardHeader>
                <CardTitle>Siparişinizi Takip Edin</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTrack} className="space-y-4">
                  <div>
                    <Label htmlFor="orderNumber">Sipariş Numarası</Label>
                    <Input
                      id="orderNumber"
                      placeholder="Örn: 12345"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Sipariş numaranızı e-posta veya SMS ile aldınız.
                    </p>
                  </div>
                  <Button type="submit" className="w-full">
                    Takip Et
                  </Button>
                </form>
              </CardContent>
            </Card>

            {tracking && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Sipariş Durumu - #{orderNumber || '12345'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Durum Çizgisi */}
                    <div className="relative">
                      <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-primary"></div>
                      
                      <div className="space-y-6">
                        {/* Sipariş Alındı */}
                        <div className="flex gap-4">
                          <div className="relative">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                              <CheckCircle className="h-5 w-5 text-primary-foreground" />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="font-semibold">Sipariş Alındı</p>
                            <p className="text-sm text-muted-foreground">15 Mart 2024, 14:30</p>
                            <p className="text-sm text-muted-foreground">Siparişiniz başarıyla oluşturuldu.</p>
                          </div>
                        </div>

                        {/* Hazırlanıyor */}
                        <div className="flex gap-4">
                          <div className="relative">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                              <Package className="h-5 w-5 text-primary-foreground" />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="font-semibold">Hazırlanıyor</p>
                            <p className="text-sm text-muted-foreground">15 Mart 2024, 16:00</p>
                            <p className="text-sm text-muted-foreground">Siparişiniz paketleniyor.</p>
                          </div>
                        </div>

                        {/* Kargoya Verildi */}
                        <div className="flex gap-4">
                          <div className="relative">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                              <Truck className="h-5 w-5 text-primary-foreground" />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="font-semibold">Kargoya Verildi</p>
                            <p className="text-sm text-muted-foreground">16 Mart 2024, 09:15</p>
                            <p className="text-sm text-muted-foreground">
                              Kargo Firması: Aras Kargo<br />
                              Takip No: 1234567890
                            </p>
                            <Button variant="link" className="px-0 mt-2" size="sm">
                              Kargo Takip →
                            </Button>
                          </div>
                        </div>

                        {/* Teslimatta */}
                        <div className="flex gap-4">
                          <div className="relative">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                              <MapPin className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="font-semibold text-muted-foreground">Teslimatta</p>
                            <p className="text-sm text-muted-foreground">Henüz bu aşamaya ulaşılmadı.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sipariş Detayları */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Sipariş Detayları</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sipariş Tarihi:</span>
                          <span>15 Mart 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ürün Adedi:</span>
                          <span>2 ürün</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Toplam Tutar:</span>
                          <span className="font-semibold">1,250.00 ₺</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Teslimat Adresi:</span>
                          <span className="text-right">Atatürk Mah. Örnek Sok. No:123<br />Kadıköy, İstanbul</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mt-8 p-6 bg-muted rounded-lg animate-fade-in">
              <h3 className="font-semibold mb-2">Sipariş numaranızı bulamıyor musunuz?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sipariş numaranızı e-posta veya SMS ile almış olmalısınız. Bulamıyorsanız hesabınızdan kontrol edebilir 
                veya müşteri hizmetlerimizle iletişime geçebilirsiniz.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => window.location.href = '/hesabim'}>
                  Hesabıma Git
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/iletisim'}>
                  İletişime Geç
                </Button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default OrderTracking;