import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Kullanım Koşulları | EgemOutdoor</title>
        <meta name="description" content="EgemOutdoor kullanım koşulları ve şartları. Web sitemizi kullanarak kabul ettiğiniz şartlar ve koşullar." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Kullanım Koşulları</h1>
            
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Genel Hükümler</h2>
                <p className="leading-relaxed">
                  Bu kullanım koşulları, EgemOutdoor web sitesini (bundan sonra "Site" olarak anılacaktır) 
                  kullanımınızı düzenleyen şartları içermektedir. Sitemizi kullanarak bu koşulları kabul 
                  etmiş sayılırsınız. Bu koşulları kabul etmiyorsanız, lütfen sitemizi kullanmayınız.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Hizmet Kapsamı</h2>
                <p className="leading-relaxed mb-4">
                  EgemOutdoor, outdoor ekipmanları ve balıkçılık malzemeleri konusunda e-ticaret hizmeti sunmaktadır:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Ürün satışı ve teslimatı</li>
                  <li>Müşteri hizmetleri ve destek</li>
                  <li>Ürün bilgileri ve danışmanlık</li>
                  <li>Kişiye özel ürün hizmetleri</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Üyelik ve Hesap Güvenliği</h2>
                <p className="leading-relaxed mb-4">
                  Sitemizden alışveriş yapabilmek için üye olmanız gerekmektedir:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Kayıt sırasında verdiğiniz bilgilerin doğru ve güncel olması zorunludur</li>
                  <li>Hesap şifrenizin güvenliğinden siz sorumlusunuz</li>
                  <li>Hesabınızın yetkisiz kullanımını derhal bize bildirmelisiniz</li>
                  <li>18 yaş altı kullanıcılar veli/vasi onayı ile üye olabilir</li>
                  <li>Bir kişi sadece bir üyelik hesabı oluşturabilir</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Sipariş ve Ödeme</h2>
                <p className="leading-relaxed mb-4">
                  Sipariş ve ödeme süreciyle ilgili koşullar:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Tüm fiyatlar Türk Lirası (TL) cinsinden ve KDV dahildir</li>
                  <li>Sipariş onayı e-posta ile tarafınıza iletilir</li>
                  <li>Ödeme işlemi güvenli ödeme sistemleri üzerinden gerçekleştirilir</li>
                  <li>Stokta olmayan ürünler için teslimat süresi bildirilir</li>
                  <li>Sınırlı sayıdaki ürünlerde "İlk gelen, ilk alır" prensibi geçerlidir</li>
                  <li>Fiyat hataları durumunda sipariş iptal edilme hakkımız saklıdır</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Teslimat</h2>
                <p className="leading-relaxed mb-4">
                  Ürün teslimatı aşağıdaki şartlara tabidir:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Standart teslimat süresi 1-3 iş günüdür</li>
                  <li>Kargo ücreti, sipariş tutarına ve teslimat adresine göre değişir</li>
                  <li>Belirli tutarın üzerindeki siparişlerde kargo ücretsizdir</li>
                  <li>Teslimat adresi Türkiye sınırları içinde olmalıdır</li>
                  <li>Yanlış adres bilgisi nedeniyle oluşacak sorunlar müşteriye aittir</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. İade ve İptal</h2>
                <p className="leading-relaxed mb-4">
                  İade ve iptal koşulları:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Cayma hakkı: Ürün tesliminden itibaren 14 gün içinde</li>
                  <li>Ürün kullanılmamış ve orijinal ambalajında olmalıdır</li>
                  <li>Kişiye özel üretilen ürünlerde cayma hakkı yoktur</li>
                  <li>Hijyen ve sağlık açısından uygun olmayan ürünler iade edilemez</li>
                  <li>İade kargo ücreti, ürün kusurlu değilse müşteriye aittir</li>
                  <li>İade bedeli 14 iş günü içinde ödeme yönteminize iade edilir</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  Detaylı bilgi için <a href="/iade-degisim" className="text-primary hover:underline">İade ve Değişim</a> sayfamızı inceleyebilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Fikri Mülkiyet Hakları</h2>
                <p className="leading-relaxed mb-4">
                  Sitemizde yer alan tüm içerik (metin, görsel, logo, tasarım) EgemOutdoor'a aittir:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>İçerik ve tasarımlar izinsiz kopyalanamaz, çoğaltılamaz</li>
                  <li>Ticari amaçla kullanılamaz</li>
                  <li>Marka ve logolarımız tescilli olup koruma altındadır</li>
                  <li>İhlal durumunda yasal işlem başlatma hakkımız saklıdır</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Sorumluluk Sınırlamaları</h2>
                <p className="leading-relaxed mb-4">
                  EgemOutdoor aşağıdaki durumlardan sorumlu değildir:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Ürünlerin yanlış veya amacı dışında kullanımından doğan zararlar</li>
                  <li>Üçüncü taraf web sitelerinin içeriği</li>
                  <li>Mücbir sebepler nedeniyle teslimat gecikmesi</li>
                  <li>Teknik arızalar veya sistem kesintileri</li>
                  <li>Kullanıcı hatası kaynaklı sorunlar</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Gizlilik</h2>
                <p className="leading-relaxed">
                  Kişisel verilerinizin korunması ve kullanımı hakkında detaylı bilgi için 
                  <a href="/gizlilik-politikasi" className="text-primary hover:underline ml-1">Gizlilik Politikası</a> sayfamızı inceleyebilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Yasağa Aykırı Kullanım</h2>
                <p className="leading-relaxed mb-4">
                  Aşağıdaki eylemler kesinlikle yasaktır:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Siteye zarar verecek yazılım veya virüs yüklemek</li>
                  <li>Diğer kullanıcıların hesaplarına yetkisiz erişim</li>
                  <li>Sahte bilgi veya belge kullanımı</li>
                  <li>Toplu otomatik sorgu ve veri çekme (scraping)</li>
                  <li>Yasalara aykırı her türlü faaliyet</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Değişiklikler</h2>
                <p className="leading-relaxed">
                  EgemOutdoor, bu kullanım koşullarını önceden haber vermeksizin değiştirme hakkını saklı tutar. 
                  Değişiklikler bu sayfada yayınlandığı anda yürürlüğe girer. Sitemizi kullanmaya devam ederek 
                  güncellenmiş koşulları kabul etmiş sayılırsınız.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">12. Uygulanacak Hukuk ve Yargı Yetkisi</h2>
                <p className="leading-relaxed">
                  Bu kullanım koşulları Türkiye Cumhuriyeti yasalarına tabidir. Bu koşullardan doğabilecek 
                  her türlü uyuşmazlıkta Ordu Mahkemeleri ve İcra Daireleri yetkilidir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">13. İletişim</h2>
                <p className="leading-relaxed">
                  Kullanım koşulları hakkında sorularınız için bizimle iletişime geçebilirsiniz:
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

export default TermsOfService;
