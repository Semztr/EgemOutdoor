import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Gizlilik Politikası | EgemOutdoor</title>
        <meta name="description" content="EgemOutdoor gizlilik politikası. Kişisel verilerinizin korunması ve kullanımı hakkında bilgilendirme." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Gizlilik Politikası</h1>
            
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Genel Bilgiler</h2>
                <p className="leading-relaxed">
                  EgemOutdoor olarak, kişisel verilerinizin güvenliği bizim için son derece önemlidir. 
                  Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde veya ürünlerimizi satın aldığınızda 
                  topladığımız bilgilerin nasıl kullanıldığını, saklandığını ve korunduğunu açıklamaktadır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Toplanan Bilgiler</h2>
                <p className="leading-relaxed mb-4">
                  Web sitemizi kullanırken aşağıdaki bilgileri toplayabiliriz:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Ad, soyad ve iletişim bilgileri (e-posta, telefon)</li>
                  <li>Teslimat ve fatura adresi bilgileri</li>
                  <li>Sipariş geçmişi ve tercihleriniz</li>
                  <li>Web sitesi kullanım bilgileri ve çerezler</li>
                  <li>IP adresi ve cihaz bilgileri</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Bilgilerin Kullanımı</h2>
                <p className="leading-relaxed mb-4">
                  Topladığımız kişisel veriler aşağıdaki amaçlar için kullanılır:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Siparişlerinizi işlemek ve teslimatını gerçekleştirmek</li>
                  <li>Müşteri hizmetleri desteği sağlamak</li>
                  <li>Kampanya ve promosyonlar hakkında bilgilendirme yapmak</li>
                  <li>Web sitemizi geliştirmek ve kişiselleştirmek</li>
                  <li>Yasal yükümlülükleri yerine getirmek</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Bilgi Güvenliği</h2>
                <p className="leading-relaxed">
                  Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik önlemleri kullanıyoruz. 
                  Verileriniz SSL/TLS şifreleme ile korunur ve yetkisiz erişime karşı güvence altındadır. 
                  Ödeme bilgileriniz asla sunucularımızda saklanmaz ve güvenli ödeme ağ geçitleri aracılığıyla işlenir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Bilgi Paylaşımı</h2>
                <p className="leading-relaxed mb-4">
                  Kişisel bilgileriniz üçüncü taraflarla paylaşılmaz, ancak aşağıdaki durumlar istisnadır:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Kargo ve lojistik hizmet sağlayıcıları (sadece teslimat için gerekli bilgiler)</li>
                  <li>Ödeme işlemcileri (güvenli ödeme işlemleri için)</li>
                  <li>Yasal zorunluluklar (mahkeme kararı, yasal süreçler)</li>
                  <li>Açık rızanızın bulunduğu durumlar</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Çerezler</h2>
                <p className="leading-relaxed">
                  Web sitemiz, kullanıcı deneyimini iyileştirmek ve site performansını analiz etmek için çerezler kullanır. 
                  Çerez kullanımı hakkında detaylı bilgi için Çerez Politikamızı inceleyebilirsiniz. 
                  Tarayıcı ayarlarınızdan çerezleri yönetebilir veya devre dışı bırakabilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Kullanıcı Hakları</h2>
                <p className="leading-relaxed mb-4">
                  KVKK kapsamında aşağıdaki haklara sahipsiniz:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>İşlenme amacını ve buna uygun kullanılıp kullanılmadığını öğrenme</li>
                  <li>Eksik veya yanlış işlenen verilerin düzeltilmesini talep etme</li>
                  <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                  <li>Yapılan düzeltme ve silme işlemlerinin üçüncü kişilere bildirilmesini isteme</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Çocukların Gizliliği</h2>
                <p className="leading-relaxed">
                  Web sitemiz 18 yaş altındaki kullanıcılara yönelik değildir. Bilerek 18 yaş altındaki 
                  bireylerden kişisel bilgi toplamıyoruz. Ebeveynler veya vasiler, çocuklarının 
                  yetkisiz bilgi sağladığını düşünüyorlarsa bizimle iletişime geçmelidir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Politika Değişiklikleri</h2>
                <p className="leading-relaxed">
                  Bu gizlilik politikası zaman zaman güncellenebilir. Değişiklikler bu sayfada yayınlanacaktır. 
                  Önemli değişiklikler olması durumunda, sizi e-posta yoluyla bilgilendireceğiz. 
                  Web sitemizi kullanmaya devam ederek güncel gizlilik politikasını kabul etmiş sayılırsınız.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. İletişim</h2>
                <p className="leading-relaxed">
                  Gizlilik politikamız hakkında sorularınız veya kişisel verilerinizle ilgili talepleriniz için 
                  bizimle iletişime geçebilirsiniz:
                </p>
                <div className="mt-4 space-y-2">
                  <p><strong>E-posta:</strong> info@egemoutdoor.com</p>
                  <p><strong>Telefon:</strong> 0452 214 17 43</p>
                  <p><strong>Adres:</strong> Düz Mah. Sırrıpaşa Cad. No:18, Altınordu/ORDU</p>
                </div>
              </section>

              <section className="mt-8 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Son güncelleme tarihi: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </section>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
