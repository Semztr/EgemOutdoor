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
import type { Json } from '@/integrations/supabase/types';
import { z } from 'zod';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  phone: z.string()
    .min(10, 'Telefon numarası en az 10 karakter olmalı')
    .regex(/^[0-9\s\-\+\(\)]+$/, 'Geçerli bir telefon numarası girin'),
  address: z.string().min(10, 'Adres en az 10 karakter olmalı'),
  city: z.string().min(2, 'Şehir giriniz'),
  district: z.string().min(2, 'İlçe giriniz'),
});

const Checkout = () => {
  const { state, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('bank-transfer');
  const [sameAddress, setSameAddress] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showNewAddress, setShowNewAddress] = useState(false);
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

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        // Load profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Load all addresses
        const { data: addresses } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });

        if (addresses && addresses.length > 0) {
          setSavedAddresses(addresses);
          const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
          setSelectedAddressId(defaultAddr.id);
          
          if (profile) {
            setFormData(prev => ({
              ...prev,
              firstName: profile.full_name?.split(' ')[0] || '',
              lastName: profile.full_name?.split(' ').slice(1).join(' ') || '',
              email: user.email || '',
              phone: profile.phone || '',
              address: defaultAddr.address_line || '',
              city: defaultAddr.city || '',
              district: defaultAddr.district || '',
              zipCode: defaultAddr.postal_code || '',
            }));
          }
        } else {
          // Kayıtlı adres yok, yeni adres formu göster
          setShowNewAddress(true);
          if (profile) {
            setFormData(prev => ({
              ...prev,
              firstName: profile.full_name?.split(' ')[0] || '',
              lastName: profile.full_name?.split(' ').slice(1).join(' ') || '',
              email: user.email || '',
              phone: profile.phone || '',
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              email: user.email || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setFormData(prev => ({
          ...prev,
          email: user.email || ''
        }));
      } finally {
        setLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === 'new') {
      setShowNewAddress(true);
      setFormData(prev => ({
        ...prev,
        address: '',
        city: '',
        district: '',
        zipCode: '',
      }));
    } else {
      setShowNewAddress(false);
      const selected = savedAddresses.find(a => a.id === addressId);
      if (selected) {
        setFormData(prev => ({
          ...prev,
          address: selected.address_line || '',
          city: selected.city || '',
          district: selected.district || '',
          zipCode: selected.postal_code || '',
        }));
      }
    }
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

    // Kredi kartı validasyonu
    if (paymentMethod === 'credit-card') {
      toast({
        title: "Kredi Kartı Ödemesi Aktif Değil",
        description: "Lütfen Havale/EFT veya Kapıda Ödeme seçeneğini kullanın.",
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
      const { error: orderError } = await supabase
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
          items: state.items as unknown as Json,
          total_amount: state.total,
          payment_method: paymentMethod,
          status: 'pending',
          user_id: user.id
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Stok düşür
      for (const item of state.items) {
        // Önce mevcut stok bilgisini al
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', String(item.id))
          .single();

        if (product && product.stock_quantity >= item.quantity) {
          // Stok yeterli, düşür
          const { error: stockError } = await supabase
            .from('products')
            .update({ 
              stock_quantity: product.stock_quantity - item.quantity
            })
            .eq('id', String(item.id));

          if (stockError && import.meta.env.DEV) {
            console.error('Stok güncellenirken hata:', stockError);
          }
        } else if (import.meta.env.DEV) {
          console.warn(`Ürün ${item.id} için yetersiz stok!`);
        }
      }

      toast({
        title: "Siparişiniz Alındı! 🎉",
        description: `Sipariş numaranız: ${orderNumber}. ${paymentMethod === 'bank-transfer' ? 'Havale/EFT bilgilerinizi e-posta ile gönderdik.' : 'En kısa sürede kargoya verilecektir.'}`,
      });
      
      clearCart();
      navigate(`/siparis-takip?order=${orderNumber}`);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Sipariş oluşturulurken hata:', error);
      }
      
      if (error instanceof z.ZodError) {
        const firstError = error.issues?.[0];
        toast({
          title: "Form Hatası",
          description: firstError?.message || "Form doğrulama hatası",
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
        
        <main className="flex-1 container mx-auto px-4 py-4 md:py-6 max-w-6xl">
          <h1 className="text-xl md:text-2xl font-bold mb-4 animate-fade-in">Ödeme</h1>
          
          {loadingProfile ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
                {/* Sol Kolon - Form */}
                <div className="lg:col-span-2">
                  {/* Tüm Bilgiler Tek Card'da */}
                  <Card className="animate-fade-in">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Sipariş Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* İletişim */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-primary">İletişim Bilgileri</h3>
                        <div className="grid md:grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="firstName" className="text-xs">Ad *</Label>
                            <Input 
                              id="firstName" 
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName" className="text-xs">Soyad *</Label>
                            <Input 
                              id="lastName" 
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className="h-9"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-xs">E-posta *</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled
                            className="bg-muted h-9"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-xs">Telefon *</Label>
                          <Input 
                            id="phone" 
                            type="tel" 
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="05XX XXX XX XX"
                            required
                            className="h-9"
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Teslimat Adresi */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-primary">Teslimat Adresi</h3>
                        
                        {/* Kayıtlı Adresler */}
                        {savedAddresses.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-xs">Kayıtlı Adreslerim</Label>
                            <RadioGroup value={selectedAddressId} onValueChange={handleAddressChange} className="space-y-2">
                              {savedAddresses.map((addr) => (
                                <div key={addr.id} className="flex items-start space-x-2 p-3 border rounded hover:bg-muted/50 transition-colors">
                                  <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                                  <Label htmlFor={addr.id} className="flex-1 cursor-pointer text-sm">
                                    <div className="font-semibold">{addr.title}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {addr.address_line}, {addr.district}/{addr.city}
                                      {addr.is_default && <span className="ml-2 text-primary">(Varsayılan)</span>}
                                    </div>
                                  </Label>
                                </div>
                              ))}
                              <div className="flex items-center space-x-2 p-3 border rounded hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value="new" id="new" />
                                <Label htmlFor="new" className="flex-1 cursor-pointer text-sm font-semibold">
                                  + Yeni Adres Ekle
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        )}

                        {/* Yeni Adres Formu */}
                        {(showNewAddress || savedAddresses.length === 0) && (
                          <div className="space-y-2 pt-2">
                            <div>
                              <Label htmlFor="address" className="text-xs">Adres *</Label>
                              <Input 
                                id="address" 
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                className="h-9"
                                placeholder="Mahalle, sokak, bina no, daire no"
                              />
                            </div>
                            <div className="grid md:grid-cols-3 gap-2">
                              <div>
                                <Label htmlFor="city" className="text-xs">İl *</Label>
                                <Input 
                                  id="city" 
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  required
                                  className="h-9"
                                />
                              </div>
                              <div>
                                <Label htmlFor="district" className="text-xs">İlçe *</Label>
                                <Input 
                                  id="district" 
                                  value={formData.district}
                                  onChange={handleInputChange}
                                  required
                                  className="h-9"
                                />
                              </div>
                              <div>
                                <Label htmlFor="zipCode" className="text-xs">Posta Kodu</Label>
                                <Input 
                                  id="zipCode" 
                                  value={formData.zipCode}
                                  onChange={handleInputChange}
                                  className="h-9"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Fatura Adresi */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="sameAddress" 
                            checked={sameAddress}
                            onCheckedChange={(checked) => setSameAddress(checked as boolean)}
                          />
                          <Label htmlFor="sameAddress" className="text-sm">Fatura adresi teslimat adresiyle aynı</Label>
                        </div>
                        
                        {!sameAddress && (
                          <div className="space-y-2 pt-2">
                            <div>
                              <Label htmlFor="billingAddress" className="text-xs">Fatura Adresi *</Label>
                              <Input 
                                id="billingAddress" 
                                value={formData.billingAddress}
                                onChange={handleInputChange}
                                required
                                className="h-9"
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="billingCity" className="text-xs">İl *</Label>
                                <Input 
                                  id="billingCity" 
                                  value={formData.billingCity}
                                  onChange={handleInputChange}
                                  required
                                  className="h-9"
                                />
                              </div>
                              <div>
                                <Label htmlFor="billingDistrict" className="text-xs">İlçe *</Label>
                                <Input 
                                  id="billingDistrict" 
                                  value={formData.billingDistrict}
                                  onChange={handleInputChange}
                                  required
                                  className="h-9"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Ödeme Yöntemi */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-primary">Ödeme Yöntemi</h3>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                          <div className="flex items-center space-x-2 p-2 border rounded hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="credit-card" id="credit-card" />
                            <Label htmlFor="credit-card" className="flex-1 cursor-pointer text-sm">💳 Kredi Kartı</Label>
                          </div>
                          <div className="flex items-center space-x-2 p-2 border rounded hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                            <Label htmlFor="bank-transfer" className="flex-1 cursor-pointer text-sm">🏦 Havale/EFT</Label>
                          </div>
                          <div className="flex items-center space-x-2 p-2 border rounded hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                            <Label htmlFor="cash-on-delivery" className="flex-1 cursor-pointer text-sm">💵 Kapıda Ödeme</Label>
                          </div>
                        </RadioGroup>

                        {paymentMethod === 'credit-card' && (
                          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-2">
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                              ⚠️ Kredi kartı ödemesi şu an aktif değil. Lütfen Havale/EFT veya Kapıda Ödeme seçin.
                            </p>
                          </div>
                        )}

                        {paymentMethod === 'bank-transfer' && (
                          <div className="bg-muted/50 p-3 rounded-lg mt-2 space-y-3">
                            <p className="text-xs font-semibold">Banka Hesap Bilgileri:</p>
                            <div className="text-xs space-y-2">
                              <div>
                                <p className="text-muted-foreground mb-1">Hesap Sahibi:</p>
                                <p className="font-medium">Egem Spor Malzemeleri</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1">Banka:</p>
                                <p className="font-medium">Ziraat Bankası</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1">IBAN:</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-mono text-sm bg-background px-3 py-2 rounded border break-all">
                                    TR39 0001 0002 1797 5950 3250 01
                                  </p>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      navigator.clipboard.writeText('TR390001000217975950 325001');
                                      toast({
                                        title: "IBAN Kopyalandı!",
                                        description: "IBAN numarası panoya kopyalandı.",
                                      });
                                    }}
                                    className="h-8"
                                  >
                                    📋 Kopyala
                                  </Button>
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-2 mt-2">
                                <p className="text-xs text-blue-900 dark:text-blue-100">
                                  ℹ️ Havale/EFT açıklamasına sipariş numaranızı yazınız.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
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
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Checkout;