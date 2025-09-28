import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center space-x-2 mb-6 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="gradient-primary p-2 rounded-lg">
                <div className="text-primary-foreground font-bold text-xl">🎣</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">BalıkPro</h3>
                <p className="text-xs text-muted-foreground">Kişiye Özel Balık Malzemeleri</p>
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              15 yıllık deneyimimizle, profesyonel balıkçılık için en kaliteli 
              ve kişiye özel malzemeleri sunuyoruz.
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com/balikpro" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Facebook className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://instagram.com/balikpro" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://twitter.com/balikpro" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Twitter className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://youtube.com/@balikpro" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Youtube className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Hızlı Erişim</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/balik-av-malzemeleri" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors">
                  Balık Av Malzemeleri
                </Link>
              </li>
              <li>
                <Link to="/outdoor-giyim" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors">
                  Outdoor Giyim
                </Link>
              </li>
              <li>
                <Link to="/kamp-malzemeleri" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors">
                  Kamp Malzemeleri
                </Link>
              </li>
              <li>
                <Link to="/kisiye-ozel" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors">
                  Kişiye Özel Ürünler
                </Link>
              </li>
              <li>
                <Link to="/blog" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Müşteri Hizmetleri</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/hesabim" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors">
                  Hesabım
                </Link>
              </li>
              <li>
                <Link to="/siparis-takip" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors">
                  Sipariş Takip
                </Link>
              </li>
              <li>
                <Link to="/iade-degisim" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors">
                  İade & Değişim
                </Link>
              </li>
              <li>
                <Link to="/kargo-bilgileri" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors">
                  Kargo Bilgileri
                </Link>
              </li>
              <li>
                <Link to="/sss" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">İletişim</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">0262 321 6 314</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">info@balikpro.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <span className="text-muted-foreground">
                  Örnek Mahallesi, Balık Sokağı No:15<br />
                  Kocaeli / Türkiye
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 gradient-card rounded-lg">
              <h5 className="font-medium text-foreground mb-2">Çalışma Saatleri</h5>
              <p className="text-sm text-muted-foreground">
                Pazartesi - Cumartesi: 09:00 - 18:00<br />
                Pazar: 10:00 - 16:00
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 BalıkPro. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/gizlilik-politikasi" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Gizlilik Politikası
              </Link>
              <Link to="/kullanim-kosullari" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Kullanım Koşulları
              </Link>
              <Link to="/cerez-politikasi" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Çerez Politikası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;