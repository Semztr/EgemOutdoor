import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>Çerez Politikası | EgemOutdoor</title>
        <meta name="description" content="EgemOutdoor çerez politikası. Web sitemizde kullanılan çerezler ve veri toplama yöntemleri hakkında bilgi." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Çerez Politikası</h1>
            
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Çerez Nedir?</h2>
                <p className="leading-relaxed">
                  Çerezler (cookies), bir web sitesini ziyaret ettiğinizde bilgisayarınıza veya mobil cihazınıza 
                  kaydedilen küçük metin dosyalarıdır. Çerezler, web sitelerinin daha verimli çalışmasını sağlar 
                  ve site sahiplerine bilgi sağlar. Web sitemizi ziyaret ettiğinizde, çerezler kullanıcı deneyiminizi 
                  iyileştirmek, sitemizin performansını analiz etmek ve kişiselleştirilmiş içerik sunmak için kullanılır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Çerez Türleri</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">2.1. Zorunlu Çerezler</h3>
                    <p className="leading-relaxed">
                      Bu çerezler, web sitemizin temel işlevlerinin çalışması için gereklidir. 
                      Güvenli oturum açma, sepet işlemleri ve form gönderimi gibi temel özellikleri sağlar. 
                      Bu çerezler olmadan web sitemiz düzgün çalışmaz ve devre dışı bırakılamazlar.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">2.2. Performans Çerezleri</h3>
                    <p className="leading-relaxed">
                      Bu çerezler, web sitemizin performansını ve kullanımını anlamamıza yardımcı olur. 
                      Hangi sayfaların en çok ziyaret edildiği, kullanıcıların sitede ne kadar süre kaldığı 
                      ve karşılaşılan hata mesajları gibi bilgileri toplar. Bu bilgiler tamamen anonimdir 
                      ve sitemizi iyileştirmek için kullanılır.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">2.3. İşlevsellik Çerezleri</h3>
                    <p className="leading-relaxed">
                      Bu çerezler, tercihlerinizi hatırlamamızı ve kişiselleştirilmiş özellikler sunmamızı sağlar. 
                      Örneğin, dil tercihiniz, bölgeniz veya kullanıcı adınız gibi bilgileri saklayabilir. 
                      Bu çerezler olmadan, her ziyaretinizde tercihlerinizi yeniden girmeniz gerekebilir.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">2.4. Hedefleme/Reklam Çerezleri</h3>
                    <p className="leading-relaxed">
                      Bu çerezler, size ve ilgi alanlarınıza uygun reklamlar göstermek için kullanılır. 
                      Aynı reklamın size tekrar tekrar gösterilmesini önler ve reklam kampanyalarının 
                      etkinliğini ölçmemize yardımcı olur. Genellikle üçüncü taraf reklam ağları tarafından yerleştirilir.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Kullandığımız Çerezler</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left">Çerez Adı</th>
                        <th className="border border-border p-3 text-left">Tür</th>
                        <th className="border border-border p-3 text-left">Süre</th>
                        <th className="border border-border p-3 text-left">Amaç</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3">session_id</td>
                        <td className="border border-border p-3">Zorunlu</td>
                        <td className="border border-border p-3">Oturum</td>
                        <td className="border border-border p-3">Kullanıcı oturumunu yönetir</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">cart_token</td>
                        <td className="border border-border p-3">Zorunlu</td>
                        <td className="border border-border p-3">7 gün</td>
                        <td className="border border-border p-3">Alışveriş sepeti bilgilerini saklar</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">_ga</td>
                        <td className="border border-border p-3">Performans</td>
                        <td className="border border-border p-3">2 yıl</td>
                        <td className="border border-border p-3">Google Analytics - Kullanıcıları ayırt eder</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">_gid</td>
                        <td className="border border-border p-3">Performans</td>
                        <td className="border border-border p-3">24 saat</td>
                        <td className="border border-border p-3">Google Analytics - Kullanıcıları ayırt eder</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">language</td>
                        <td className="border border-border p-3">İşlevsellik</td>
                        <td className="border border-border p-3">1 yıl</td>
                        <td className="border border-border p-3">Dil tercihini hatırlar</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">cookie_consent</td>
                        <td className="border border-border p-3">Zorunlu</td>
                        <td className="border border-border p-3">1 yıl</td>
                        <td className="border border-border p-3">Çerez onayı durumunu saklar</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Üçüncü Taraf Çerezler</h2>
                <p className="leading-relaxed mb-4">
                  Web sitemizde aşağıdaki üçüncü taraf hizmetleri kullanılmaktadır:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Google Analytics:</strong> Site trafiğini ve kullanıcı davranışlarını analiz etmek için</li>
                  <li><strong>Facebook Pixel:</strong> Reklam kampanyalarını optimize etmek için</li>
                  <li><strong>Ödeme Sağlayıcıları:</strong> Güvenli ödeme işlemleri için</li>
                  <li><strong>Sosyal Medya Eklentileri:</strong> İçerik paylaşımı için</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  Bu üçüncü tarafların kendi çerez politikaları vardır ve bu politikalar üzerinde kontrolümüz yoktur.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Çerezleri Nasıl Kontrol Edersiniz?</h2>
                <p className="leading-relaxed mb-4">
                  Çerezleri kontrol etmek için çeşitli seçenekleriniz vardır:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Tarayıcı Ayarları</h3>
                    <p className="leading-relaxed mb-2">
                      Çoğu web tarayıcısı, çerezleri kontrol etmenize olanak tanır:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                      <li><strong>Firefox:</strong> Seçenekler → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</li>
                      <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler ve web sitesi verileri</li>
                      <li><strong>Edge:</strong> Ayarlar → Gizlilik, arama ve hizmetler → Çerezler</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Çerez Tercih Merkezi</h3>
                    <p className="leading-relaxed">
                      Web sitemizde bulunan çerez tercih merkezinden, zorunlu çerezler hariç, 
                      diğer çerezleri kabul edip etmeyeceğinizi seçebilirsiniz.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Çerezleri Reddetmenin Sonuçları</h2>
                <p className="leading-relaxed">
                  Tüm çerezleri reddederseniz veya silerseniz, web sitemizin bazı işlevleri düzgün çalışmayabilir. 
                  Örneğin, alışveriş sepetiniz boşalabilir, dil tercihinizi hatırlayamayabiliriz veya 
                  oturum açma işleminizde sorun yaşayabilirsiniz. Ancak, site içeriğine erişiminiz devam eder.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Web İşaretçileri (Web Beacons)</h2>
                <p className="leading-relaxed">
                  Çerezlere ek olarak, web işaretçileri (piksel etiketleri veya temiz GIF'ler olarak da bilinir) 
                  kullanabiliriz. Bunlar, bir sayfanın görüntülenip görüntülenmediğini ve hangi içeriğin 
                  görüntülendiğini belirlememize yardımcı olan küçük grafik dosyalarıdır. 
                  Web işaretçileri e-posta kampanyalarımızda da kullanılarak e-postaların açılıp açılmadığını takip eder.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Mobil Cihazlar</h2>
                <p className="leading-relaxed">
                  Mobil cihazlarda gezinirken de çerezler kullanılır. Mobil tarayıcınızın ayarlarından 
                  çerezleri yönetebilirsiniz. Ayrıca, mobil cihazınızın ayarlarından reklam tanımlayıcılarını 
                  (iOS'ta "Reklam İzleme Sınırla", Android'de "Reklam Kişiselleştirmeyi Devre Dışı Bırak") 
                  kontrol edebilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Politika Güncellemeleri</h2>
                <p className="leading-relaxed">
                  Bu çerez politikası düzenli olarak gözden geçirilir ve gerektiğinde güncellenir. 
                  Değişiklikler bu sayfada yayınlanacaktır. Önemli değişiklikler olması durumunda, 
                  sizi e-posta veya site bildirimi yoluyla bilgilendireceğiz. Web sitemizi kullanmaya 
                  devam ederek güncellenmiş çerez politikasını kabul etmiş sayılırsınız.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Daha Fazla Bilgi</h2>
                <p className="leading-relaxed mb-4">
                  Çerezler hakkında daha fazla bilgi için şu kaynaklara başvurabilirsiniz:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>www.aboutcookies.org - Çerezler hakkında detaylı bilgi</li>
                  <li>www.allaboutcookies.org - Çerez yönetimi rehberi</li>
                  <li>www.youronlinechoices.eu - Davranışsal reklam için tercihler</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. İletişim</h2>
                <p className="leading-relaxed">
                  Çerez politikamız hakkında sorularınız veya endişeleriniz varsa bizimle iletişime geçebilirsiniz:
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

export default CookiePolicy;
