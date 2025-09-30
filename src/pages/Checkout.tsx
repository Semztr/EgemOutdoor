import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Checkout = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [sameAddress, setSameAddress] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Siparişiniz Alındı!",
      description: "Siparişiniz başarıyla oluşturuldu. En kısa sürede kargoya verilecektir.",
    });
    
    clearCart();
    navigate('/');
  };

  if (state.items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Sepetiniz Boş - EgemOutdoor</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Sepetiniz Boş</h1>
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
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 animate-fade-in">Ödeme</h1>
          
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
                        <Input id="firstName" required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Soyad *</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">E-posta *</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input id="phone" type="tel" required />
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
                      <Input id="address" required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">İl *</Label>
                        <Input id="city" required />
                      </div>
                      <div>
                        <Label htmlFor="district">İlçe *</Label>
                        <Input id="district" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Posta Kodu</Label>
                      <Input id="zipCode" />
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
                          <Input id="billingAddress" required />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingCity">İl *</Label>
                            <Input id="billingCity" required />
                          </div>
                          <div>
                            <Label htmlFor="billingDistrict">İlçe *</Label>
                            <Input id="billingDistrict" required />
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

                    <Button type="submit" className="w-full" size="lg">
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