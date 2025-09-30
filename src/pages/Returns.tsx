import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const Returns = () => {
  return (
    <>
      <Helmet>
        <title>İade ve Değişim - EgemOutdoor</title>
        <meta name="description" content="EgemOutdoor iade ve değişim politikası. Koşullar, süreler ve işlemler hakkında bilgi." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 animate-fade-in">İade ve Değişim Politikası</h1>
            
            <Card className="mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle>Genel Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-muted-foreground">
                  EgemOutdoor olarak, müşteri memnuniyetini ön planda tutuyoruz. 6502 sayılı Tüketicinin Korunması Hakkında Kanun 
                  gereğince, satın aldığınız ürünleri 14 gün içinde iade edebilir veya değiştirebilirsiniz.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  İade Edilebilir Ürünler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Kullanılmamış, hasarsız ve orijinal ambalajında olan ürünler</li>
                  <li>• Etiketleri sökülmemiş ürünler</li>
                  <li>• Fatura veya sipariş belgesi ile birlikte gönderilen ürünler</li>
                  <li>• Teslim tarihinden itibaren 14 gün içinde iade talep edilmiş ürünler</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  İade Edilemeyen Ürünler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Kişiye özel üretilmiş veya değiştirilmiş ürünler</li>
                  <li>• Kullanılmış veya hasarlı ürünler</li>
                  <li>• Hijyen açısından iade edilmesi uygun olmayan ürünler</li>
                  <li>• İndirimli veya kampanyalı satın al��nan outlet ürünler (özel durumlar hariç)</li>
                  <li>• Hediye çekleri ve dijital ürünler</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle>İade Süreci</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">1. İade Talebi Oluşturma</strong>
                    <p>Hesabım sayfasından veya müşteri hizmetlerimizden iade talebinizi oluşturun.</p>
                  </li>
                  <li>
                    <strong className="text-foreground">2. Ürünü Hazırlama</strong>
                    <p>Ürünü orijinal ambalajı ile birlikte, fatura ve iade formu ile hazırlayın.</p>
                  </li>
                  <li>
                    <strong className="text-foreground">3. Kargo ile Gönderim</strong>
                    <p>Ürünü anlaşmalı kargo firması ile adresimize gönderin. (Cayma hakkı kullanımında kargo ücreti alıcıya aittir)</p>
                  </li>
                  <li>
                    <strong className="text-foreground">4. İnceleme ve Onay</strong>
                    <p>Ürün tarafımıza ulaştıktan sonra 3-5 iş günü içinde incelenir.</p>
                  </li>
                  <li>
                    <strong className="text-foreground">5. İade Tutarı</strong>
                    <p>Onaylanan iadeler için ödeme 10 iş günü içinde hesabınıza iade edilir.</p>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle>Değişim Süreci</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-muted-foreground mb-4">
                  Ürün değişimi yapmak istiyorsanız:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• İade sürecini başlatın</li>
                  <li>• İade onaylandıktan sonra yeni ürün siparişi verin</li>
                  <li>• Değişim için ayrı bir kargo ücreti alınmaz (ürün kusuru varsa)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  Önemli Notlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Kusurlu veya hasarlı ürünlerin kargo ücreti tarafımızca karşılanır</li>
                  <li>• İade edilen tutarlar, ödeme yönteminize göre 7-10 iş günü içinde hesabınıza yansır</li>
                  <li>• Kampanyalı ürünlerde kampanya şartları geçerlidir</li>
                  <li>• İade kargo adresi: Atatürk Mah. Örnek Sok. No:123, Karşıyaka, İzmir 35000</li>
                </ul>
              </CardContent>
            </Card>

            <div className="mt-8 p-6 bg-muted rounded-lg text-center animate-fade-in">
              <h3 className="font-semibold mb-2">Sorularınız mı var?</h3>
              <p className="text-muted-foreground mb-4">
                İade ve değişim konusunda detaylı bilgi için bize ulaşın.
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

export default Returns;