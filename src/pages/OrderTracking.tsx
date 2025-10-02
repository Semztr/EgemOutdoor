import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Package, Truck, CheckCircle, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_address: any;
  order_items: Array<{
    quantity: number;
    price: number;
    products: {
      name: string;
    };
  }>;
}

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const orderId = searchParams.get('order');
    if (orderId) {
      setOrderNumber(orderId);
      fetchOrder(orderId);
    }
  }, [searchParams]);

  const fetchOrder = async (orderId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            products (
              name
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Sipariş Bulunamadı",
          description: "Girdiğiniz sipariş numarası bulunamadı.",
          variant: "destructive"
        });
        setOrder(null);
        return;
      }

      setOrder(data);
    } catch (error) {
      console.error('Sipariş yüklenirken hata:', error);
      toast({
        title: "Hata",
        description: "Sipariş bilgileri yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast({
        title: "Uyarı",
        description: "Lütfen sipariş numarası girin.",
        variant: "destructive"
      });
      return;
    }
    fetchOrder(orderNumber.trim());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'Sipariş Alındı',
      processing: 'Hazırlanıyor',
      shipped: 'Kargoda',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    };
    return statusMap[status] || status;
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

            {loading && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}

            {!loading && order && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Sipariş Durumu - #{order.id.slice(0, 8)}</CardTitle>
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
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              ['pending', 'processing', 'shipped', 'delivered'].includes(order.status) 
                                ? 'bg-primary' 
                                : 'bg-muted'
                            }`}>
                              <CheckCircle className={`h-5 w-5 ${
                                ['pending', 'processing', 'shipped', 'delivered'].includes(order.status)
                                  ? 'text-primary-foreground'
                                  : 'text-muted-foreground'
                              }`} />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="font-semibold">Sipariş Alındı</p>
                            <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                            <p className="text-sm text-muted-foreground">Siparişiniz başarıyla oluşturuldu.</p>
                          </div>
                        </div>

                        {/* Hazırlanıyor */}
                        <div className="flex gap-4">
                          <div className="relative">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              ['processing', 'shipped', 'delivered'].includes(order.status)
                                ? 'bg-primary'
                                : 'bg-muted'
                            }`}>
                              <Package className={`h-5 w-5 ${
                                ['processing', 'shipped', 'delivered'].includes(order.status)
                                  ? 'text-primary-foreground'
                                  : 'text-muted-foreground'
                              }`} />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className={`font-semibold ${
                              ['processing', 'shipped', 'delivered'].includes(order.status)
                                ? ''
                                : 'text-muted-foreground'
                            }`}>Hazırlanıyor</p>
                            <p className="text-sm text-muted-foreground">
                              {['processing', 'shipped', 'delivered'].includes(order.status)
                                ? 'Siparişiniz paketleniyor.'
                                : 'Henüz bu aşamaya ulaşılmadı.'}
                            </p>
                          </div>
                        </div>

                        {/* Kargoda */}
                        <div className="flex gap-4">
                          <div className="relative">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              ['shipped', 'delivered'].includes(order.status)
                                ? 'bg-primary'
                                : 'bg-muted'
                            }`}>
                              <Truck className={`h-5 w-5 ${
                                ['shipped', 'delivered'].includes(order.status)
                                  ? 'text-primary-foreground'
                                  : 'text-muted-foreground'
                              }`} />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className={`font-semibold ${
                              ['shipped', 'delivered'].includes(order.status)
                                ? ''
                                : 'text-muted-foreground'
                            }`}>Kargoda</p>
                            <p className="text-sm text-muted-foreground">
                              {['shipped', 'delivered'].includes(order.status)
                                ? 'Siparişiniz kargoya verildi.'
                                : 'Henüz bu aşamaya ulaşılmadı.'}
                            </p>
                          </div>
                        </div>

                        {/* Teslim Edildi */}
                        <div className="flex gap-4">
                          <div className="relative">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              order.status === 'delivered'
                                ? 'bg-primary'
                                : 'bg-muted'
                            }`}>
                              <MapPin className={`h-5 w-5 ${
                                order.status === 'delivered'
                                  ? 'text-primary-foreground'
                                  : 'text-muted-foreground'
                              }`} />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className={`font-semibold ${
                              order.status === 'delivered'
                                ? ''
                                : 'text-muted-foreground'
                            }`}>Teslim Edildi</p>
                            <p className="text-sm text-muted-foreground">
                              {order.status === 'delivered'
                                ? 'Siparişiniz teslim edildi.'
                                : 'Henüz bu aşamaya ulaşılmadı.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sipariş Detayları */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Sipariş Detayları</h3>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sipariş Tarihi:</span>
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Durum:</span>
                          <span className="font-semibold">{getStatusText(order.status)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Toplam Tutar:</span>
                          <span className="font-semibold">{Number(order.total_amount).toFixed(2)} ₺</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Teslimat Adresi:</span>
                          <span className="text-right">
                            {order.shipping_address?.address || 'Adres bilgisi yok'}<br />
                            {order.shipping_address?.city}, {order.shipping_address?.district}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Ürünler:</h4>
                        <div className="space-y-2">
                          {order.order_items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.products.name} x {item.quantity}</span>
                              <span>{(Number(item.price) * item.quantity).toFixed(2)} ₺</span>
                            </div>
                          ))}
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