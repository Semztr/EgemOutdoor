import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Package, MapPin, Clock } from 'lucide-react';

const Shipping = () => {
  return (
    <>
      <Helmet>
        <title>Kargo Bilgileri - EgemOutdoor</title>
        <meta name="description" content="EgemOutdoor kargo ve teslimat bilgileri. Teslimat süreleri, kargo ücretleri ve bölgeler." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 animate-fade-in">Kargo Bilgileri</h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Kargo Firmaları
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Aras Kargo</li>
                    <li>• Yurtiçi Kargo</li>
                    <li>• MNG Kargo</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    Kargo firmanızı sipariş sırasında seçebilirsiniz.
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Kargoya Verme Süresi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Siparişleriniz <strong className="text-foreground">aynı gün veya en geç 1 iş günü</strong> içinde kargoya verilir.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Hafta sonu verilen siparişler pazartesi günü kargoya verilir.
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Kargo Ücretleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-green-600">500 TL ve üzeri</p>
                      <p className="text-sm text-muted-foreground">Ücretsiz Kargo</p>
                    </div>
                    <div>
                      <p className="font-semibold">500 TL altı</p>
                      <p className="text-sm text-muted-foreground">29.90 TL</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Teslimat Süreleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Şehir içi:</span>
                      <span className="font-semibold text-foreground">1-2 iş günü</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Şehir dışı:</span>
                      <span className="font-semibold text-foreground">2-4 iş günü</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uzak bölgeler:</span>
                      <span className="font-semibold text-foreground">3-7 iş günü</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    * Teslimat süreleri kargo yoğunluğuna göre değişiklik gösterebilir.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle>Teslimat Bölgeleri</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Türkiye'nin tüm illerine teslimat yapıyoruz. Aşağıdaki bölgeler için özel teslimat koşulları geçerlidir:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Hızlı Teslimat Bölgeleri</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• İstanbul</li>
                      <li>• Ankara</li>
                      <li>• İzmir</li>
                      <li>• Bursa</li>
                      <li>• Antalya</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Standart Teslimat</h4>
                    <p className="text-sm text-muted-foreground">
                      Diğer tüm iller standart teslimat süreleri kapsamındadır.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle>Sipariş Takibi</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-muted-foreground mb-4">
                  Siparişiniz kargoya verildikten sonra:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• E-posta ve SMS ile kargo takip numaranız tarafınıza iletilir</li>
                  <li>• "Hesabım" sayfasından siparişinizi takip edebilirsiniz</li>
                  <li>• Kargo firmasının web sitesinden anlık takip yapabilirsiniz</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Önemli Bilgiler</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Kargo şirketi tarafından 3 kez teslimat denemesi yapılır</li>
                  <li>• Teslim alınmayan paketler depoya iade edilir ve bize geri gönderilir</li>
                  <li>• Adres bilgilerinizin eksiksiz ve doğru olduğundan emin olun</li>
                  <li>• Teslimat sırasında paketin hasarlı olup olmadığını kontrol edin</li>
                  <li>• Hasarlı teslimatları kabul etmeyiniz ve kargo görevlisine tutanak tutturun</li>
                </ul>
              </CardContent>
            </Card>

            <div className="mt-8 p-6 bg-muted rounded-lg text-center animate-fade-in">
              <h3 className="font-semibold mb-2">Kargo ile ilgili sorunuz mu var?</h3>
              <p className="text-muted-foreground mb-4">
                Detaylı bilgi için müşteri hizmetlerimizle iletişime geçin.
              </p>
              <a href="/iletisim" className="text-primary hover:underline">
                İletişime Geç →
              </a>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Shipping;