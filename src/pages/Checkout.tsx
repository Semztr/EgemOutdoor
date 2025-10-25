import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası girin'),
  address: z.string().min(10, 'Adres en az 10 karakter olmalı'),
  city: z.string().min(2, 'Şehir giriniz'),
  district: z.string().min(2, 'İlçe giriniz'),
});

const Checkout = () => {
  const { state, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [sameAddress, setSameAddress] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    zipCode: '',
    billingAddress: '',
    billingCity: '',
    billingDistrict: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Giriş Yapın",
        description: "Sipariş vermek için giriş yapmalısınız.",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [user, authLoading, navigate, toast]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Hata",
        description: "Giriş yapmalısınız.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Form validasyonu
      checkoutSchema.parse(formData);

      // Sipariş numarası oluştur
      const orderNumber = `EGM${Date.now().toString().slice(-8)}`;

      // Sipariş oluştur
      const { data: order, error: orderError } = await (supabase as any)
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          customer_phone: formData.phone,
          address_line: formData.address,
          city: formData.city,
          district: formData.district,
          postal_code: formData.zipCode,
          items: state.items,
          total_amount: state.total,
          payment_method: paymentMethod,
          status: 'pending',
          user_id: user.id
        })
        .select()
        .single();

      if (orderError) throw orderError;

      toast({
        title: "Siparişiniz Alındı! 🎉",
        description: `Sipariş numaranız: ${orderNumber}. ${paymentMethod === 'bank-transfer' ? 'Havale/EFT bilgilerinizi e-posta ile gönderdik.' : 'En kısa sürede kargoya verilecektir.'}`,
      });
      
      clearCart();
      navigate(`/siparis-takip?order=${orderNumber}`);
    } catch (error: any) {
      console.error('Sipariş oluşturulurken hata:', error);
      
      if (error instanceof z.ZodError) {
        toast({
          title: "Form Hatası",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Hata",
          description: "Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
          variant: "destructive"
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Sepetiniz Boş - EgemOutdoor</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-12 md:py-16 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Sepetiniz Boş</h1>
            <p className="text-muted-foreground mb-8">Ödeme yapabilmek için sepetinize ürün eklemelisiniz.</p>
            <Button onClick={() => navigate('/urunler')}>Alışverişe Başla</Button>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Ödeme - EgemOutdoor</title>
        <meta name="description" content="Güvenli ödeme ile siparişinizi tamamlayın. EgemOutdoor güvencesiyle alışveriş yapın." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 animate-fade-in">Ödeme</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Sol Kolon - Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* İletişim Bilgileri */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>İletişim Bilgileri</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Ad *</Label>
                        <Input 
                          id="firstName" 
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Soyad *</Label>
                        <Input 
                          id="lastName" 
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">E-posta *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Teslimat Adresi */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Teslimat Adresi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Adres *</Label>
                      <Input 
                        id="address" 
                        value={formData.address}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">İl *</Label>
                        <Input 
                          id="city" 
                          value={formData.city}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="district">İlçe *</Label>
                        <Input 
                          id="district" 
                          value={formData.district}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Posta Kodu</Label>
                      <Input 
                        id="zipCode" 
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Fatura Adresi */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Fatura Adresi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sameAddress" 
                        checked={sameAddress}
                        onCheckedChange={(checked) => setSameAddress(checked as boolean)}
                      />
                      <Label htmlFor="sameAddress">Teslimat adresiyle aynı</Label>
                    </div>
                    
                    {!sameAddress && (
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="billingAddress">Adres *</Label>
                          <Input 
                            id="billingAddress" 
                            value={formData.billingAddress}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingCity">İl *</Label>
                            <Input 
                              id="billingCity" 
                              value={formData.billingCity}
                              onChange={handleInputChange}
                              required 
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingDistrict">İlçe *</Label>
                            <Input 
                              id="billingDistrict" 
                              value={formData.billingDistrict}
                              onChange={handleInputChange}
                              required 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Ödeme Yöntemi */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Ödeme Yöntemi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card">Kredi Kartı</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                        <Label htmlFor="bank-transfer">Havale/EFT</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                        <Label htmlFor="cash-on-delivery">Kapıda Ödeme</Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === 'credit-card' && (
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor="cardNumber">Kart Numarası *</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Son Kullanma Tarihi *</Label>
                            <Input id="expiry" placeholder="AA/YY" required />
                          </div>
                          <div>
                            <Label htmlFor="cvc">CVC *</Label>
                            <Input id="cvc" placeholder="123" required />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'bank-transfer' && (
                      <div className="space-y-4 pt-4 bg-muted/30 p-4 rounded-lg">
                        <div className="space-y-3">
                          <h3 className="font-semibold text-foreground">Banka Hesap Bilgileri</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex flex-col gap-1">
                              <span className="text-muted-foreground">Hesap Sahibi:</span>
                              <span className="font-medium">Egem Spor Malzemeleri</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-muted-foreground">Banka:</span>
                              <span className="font-medium">Ziraat Bankası</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-muted-foreground">IBAN:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-medium bg-background px-2 py-1 rounded">TR39 0001 0002 1797 5950 3250 01</span>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    navigator.clipboard.writeText('TR390001000217975950325001');
                                    alert('IBAN kopyalandı!');
                                  }}
                                >
                                  📋 Kopyala
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-sm">
                            <p className="text-blue-900 dark:text-blue-100">
                              ℹ️ <strong>Önemli:</strong> Havale/EFT açıklamasına sipariş numaranızı yazınız. 
                              Ödeme onaylandıktan sonra siparişiniz kargoya verilecektir.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sağ Kolon - Sipariş Özeti */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4 animate-fade-in">
                  <CardHeader>
                    <CardTitle>Sipariş Özeti</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {state.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Ara Toplam</span>
                        <span>{state.total.toFixed(2)} ₺</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Kargo</span>
                        <span className="text-green-600">Ücretsiz</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>Toplam</span>
                      <span>{state.total.toFixed(2)} ₺</span>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Siparişi Tamamla
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Siparişinizi tamamlayarak <a href="/kullanim-kosullari" className="underline">kullanım koşullarını</a> kabul etmiş olursunuz.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Checkout;