import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      category: 'Sipariş ve Teslimat',
      questions: [
        {
          q: 'Sipariş vermek için ne yapmam gerekiyor?',
          a: 'Sitemizden istediğiniz ürünleri sepete ekleyip, ödeme adımlarını tamamlamanız yeterlidir. Üyelik oluşturmanız gerekmektedir.'
        },
        {
          q: 'Kargo ücreti ne kadar?',
          a: '500 TL ve üzeri alışverişlerinizde kargo ücretsizdir. 500 TL altı alışverişlerde kargo ücreti 29.90 TL\'dir.'
        },
        {
          q: 'Siparişim ne zaman kargoya verilir?',
          a: 'Siparişleriniz aynı gün veya en geç 1 iş günü içinde kargoya verilir. Teslimat süresi kargo firmasına ve bölgenize göre değişiklik gösterir.'
        },
        {
          q: 'Hangi kargo firması ile çalışıyorsunuz?',
          a: 'Aras Kargo, Yurtiçi Kargo ve MNG Kargo ile çalışmaktayız. Sipariş sırasında tercih edebilirsiniz.'
        }
      ]
    },
    {
      category: 'Ödeme',
      questions: [
        {
          q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
          a: 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini sunuyoruz.'
        },
        {
          q: 'Taksit yapabilir miyim?',
          a: 'Evet, kredi kartınıza göre 2, 3, 6, 9 ve 12 taksit imkanı sunuyoruz.'
        },
        {
          q: 'Kapıda ödeme yapabilir miyim?',
          a: 'Evet, 1000 TL\'ye kadar olan siparişlerde kapıda ödeme imkanı sunuyoruz.'
        }
      ]
    },
    {
      category: 'İade ve Değişim',
      questions: [
        {
          q: 'İade süresi ne kadar?',
          a: 'Ürünleri teslim aldıktan sonra 14 gün içinde iade edebilirsiniz.'
        },
        {
          q: 'İade şartları nelerdir?',
          a: 'Ürünün kullanılmamış, etiketli ve orijinal ambalajında olması gerekmektedir. Kişiye özel üretilen ürünler iade edilemez.'
        },
        {
          q: 'İade işlemi nasıl yapılır?',
          a: 'Hesabım sayfasından iade talebi oluşturabilir veya müşteri hizmetlerimizle iletişime geçebilirsiniz.'
        },
        {
          q: 'İade ücretini kim karşılar?',
          a: 'Cayma hakkı kullanımında iade kargo ücreti müşteriye aittir. Ürün kusurlu veya yanlış gönderilmişse kargo ücreti tarafımızca karşılanır.'
        }
      ]
    },
    {
      category: 'Ürünler',
      questions: [
        {
          q: 'Ürünler orijinal mi?',
          a: 'Tüm ürünlerimiz orijinal ve resmi distribütörlerden temin edilmektedir. Garanti belgeli ürünler sunuyoruz.'
        },
        {
          q: 'Ürünlerin garantisi var mı?',
          a: 'Evet, tüm ürünlerimiz marka garantisi altındadır. Garanti süresi ürüne göre değişiklik gösterir.'
        },
        {
          q: 'Stokta olmayan ürünü sipariş edebilir miyim?',
          a: 'Stokta olmayan ürünler için "Stok Gelince Haber Ver" özelliğini kullanabilirsiniz. Ürün stoklara girdiğinde size bildirim göndereceğiz.'
        }
      ]
    },
    {
      category: 'Hesap ve Üyelik',
      questions: [
        {
          q: 'Üyelik zorunlu mu?',
          a: 'Sipariş verebilmek için üyelik oluşturmanız gerekmektedir.'
        },
        {
          q: 'Şifremi unuttum, ne yapmalıyım?',
          a: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısını kullanarak şifrenizi sıfırlayabilirsiniz.'
        },
        {
          q: 'Hesabımı nasıl silerim?',
          a: 'Hesabınızı silmek için müşteri hizmetlerimizle iletişime geçmeniz gerekmektedir.'
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Sıkça Sorulan Sorular - EgemOutdoor</title>
        <meta name="description" content="EgemOutdoor hakkında merak ettiğiniz soruların cevapları. Sipariş, kargo, ödeme, iade ve daha fazlası." />
        <meta name="keywords" content="sss, sık sorulan sorular, yardım, destek, egem outdoor" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 animate-fade-in">Sıkça Sorulan Sorular</h1>
            
            <div className="space-y-8">
              {faqs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="animate-fade-in">
                  <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg text-center animate-fade-in">
              <h3 className="font-semibold mb-2">Sorunuz cevapsız mı kaldı?</h3>
              <p className="text-muted-foreground mb-4">
                Müşteri hizmetlerimizle iletişime geçebilirsiniz.
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

export default FAQ;