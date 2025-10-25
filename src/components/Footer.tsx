import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Geçersiz E-posta",
        description: "Lütfen geçerli bir e-posta adresi girin.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await (supabase as any)
        .from('newsletter_subscribers')
        .insert([{ email: email.toLowerCase().trim() }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Zaten Abonessiniz",
            description: "Bu e-posta adresi zaten kayıtlı.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Başarılı! 🎉",
          description: "Kampanyalarımızdan haberdar olacaksınız.",
        });
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Bir Hata Oluştu",
        description: "Lütfen daha sonra tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company info */}
          <div>
            <Link to="/" onClick={() => window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })} className="flex items-center space-x-2 mb-6 hover:opacity-80 transition-opacity cursor-pointer">
              <img src="/favicon.png" alt="EgemOutdoor Logo" className="h-8 w-8 md:h-10 md:w-10 rounded" />
              <div>
                <h3 className="text-xl font-bold text-foreground">EgemOutdoor</h3>
                <p className="text-xs text-muted-foreground">Kişiye Özel Outdoor Ürünleri</p>
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Profesyonel outdoor ve balıkçılık ekipmanları için en kaliteli 
              ve kişiye özel ürünleri sunuyoruz.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/egemordu" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Facebook className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://www.instagram.com/egemoutdoor/" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Hızlı Erişim</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/balik-av-malzemeleri" onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} className="text-muted-foreground hover:text-primary transition-colors">
                  Balık Av Malzemeleri
                </Link>
              </li>
              <li>
                <Link to="/outdoor-giyim" onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} className="text-muted-foreground hover:text-primary transition-colors">
                  Outdoor Giyim
                </Link>
              </li>
              <li>
                <Link to="/kamp-malzemeleri" onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} className="text-muted-foreground hover:text-primary transition-colors">
                  Kamp Malzemeleri
                </Link>
              </li>
              <li>
                <Link to="/dalis-urunleri" onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} className="text-muted-foreground hover:text-primary transition-colors">
                  Dalış Ürünleri
                </Link>
              </li>
              <li>
                <Link to="/termoslar-ve-mataralar" onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} className="text-muted-foreground hover:text-primary transition-colors">
                  Termoslar ve Mataralar
                </Link>
              </li>
              <li>
                <Link to="/spor-malzemeleri" onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} className="text-muted-foreground hover:text-primary transition-colors">
                  Spor Malzemeleri
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Müşteri Hizmetleri</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/hesabim" onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} className="text-muted-foreground hover:text-primary transition-colors">
                  Hesabım
                </Link>
              </li>
              <li>
                <Link to="/siparis-takip" onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} className="text-muted-foreground hover:text-primary transition-colors">
                  Sipariş Takip
                </Link>
              </li>
              <li>
                <Link to="/iade-degisim" onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} className="text-muted-foreground hover:text-primary transition-colors">
                  İade & Değişim
                </Link>
              </li>
              <li>
                <Link to="/kargo-bilgileri" onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} className="text-muted-foreground hover:text-primary transition-colors">
                  Kargo Bilgileri
                </Link>
              </li>
              <li>
                <Link to="/iletisim" onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} className="text-muted-foreground hover:text-primary transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">İletişim</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div className="flex flex-col">
                  <span className="text-muted-foreground">0452 214 17 43</span>
                  <span className="text-muted-foreground">0533 640 77 58</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:egemoutdoor@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                  egemoutdoor@gmail.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <span className="text-muted-foreground">
                  Düz Mah. Sırrıpaşa Cad. No:18<br />
                  Altınordu / ORDU
                </span>
              </div>
            </div>

            
          </div>
        </div>

        {/* Payment methods & Newsletter */}
        <div className="border-t border-border mt-10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Payment methods */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm">Güvenli Ödeme</h4>
              <div className="flex flex-wrap gap-3">
                <div className="px-3 py-2 bg-background border border-border rounded text-xs font-medium">💳 Kredi Kartı</div>
                <div className="px-3 py-2 bg-background border border-border rounded text-xs font-medium">🏦 Banka Havalesi</div>
                <div className="px-3 py-2 bg-background border border-border rounded text-xs font-medium">📱 Kapıda Ödeme</div>
              </div>
            </div>
            
            {/* Newsletter */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm">Kampanyalardan Haberdar Olun</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="E-posta adresiniz" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
                <Button type="submit" size="sm" className="whitespace-nowrap" disabled={loading}>
                  {loading ? 'Kaydediliyor...' : 'Abone Ol'}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Site Haritası */}
        <div className="border-t border-border mt-10 pt-8">
          <h4 className="font-semibold text-foreground mb-4 text-center">Site Haritası</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            <div>
              <Link to="/balik-av-malzemeleri" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors font-medium block mb-2">
                Balık Av Malzemeleri
              </Link>
            </div>
            <div>
              <Link to="/outdoor-giyim" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors font-medium block mb-2">
                Outdoor Giyim
              </Link>
            </div>
            <div>
              <Link to="/kamp-malzemeleri" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors font-medium block mb-2">
                Kamp Malzemeleri
              </Link>
            </div>
            <div>
              <Link to="/dalis-urunleri" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors font-medium block mb-2">
                Dalış Ürünleri
              </Link>
            </div>
            <div>
              <Link to="/spor-malzemeleri" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors font-medium block mb-2">
                Spor Malzemeleri
              </Link>
            </div>
            <div>
              <Link to="/termoslar-ve-mataralar" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors font-medium block mb-2">
                Termoslar ve Mataralar
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-xs md:text-sm">
              © 2024 EgemOutdoor. Tüm hakları saklıdır.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link to="/gizlilik-politikasi" onClick={() => window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Gizlilik Politikası
              </Link>
              <Link to="/kullanim-kosullari" onClick={() => window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Kullanım Koşulları
              </Link>
              <Link to="/cerez-politikasi" onClick={() => window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Çerez Politikası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;