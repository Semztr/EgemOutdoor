import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <span className="text-muted-foreground">info@egemoutdoor.com</span>
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

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 EgemOutdoor. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
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