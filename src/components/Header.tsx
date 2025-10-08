import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, Phone, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { state } = useCart();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/urunler?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm">
        <div className="container mx-auto flex items-center justify-between">
          <span>Tüm Siparişlerinizde 24 Saat İçinde Kargoda!</span>
          <div className="flex items-center gap-4">
            <Phone className="h-4 w-4" />
            <span>0452 214 17 43</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center space-x-2">
            <img src="/favicon.png" alt="EgemOutdoor Logo" className="h-10 w-10 rounded" />
            <div>
              <h1 className="text-xl font-bold text-foreground">EgemOutdoor</h1>
              <p className="text-xs text-muted-foreground">Kişiye Özel Outdoor Ürünleri</p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchAutocomplete className="w-full" />
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <User className="h-4 w-4" />
                    <span>Hesabım</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/hesabim')}>
                    <User className="h-4 w-4 mr-2" />
                    Hesabım
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/siparis-takip')}>
                    Siparişlerim
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/giris">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <User className="h-4 w-4" />
                  <span>Üye Girişi</span>
                </Button>
              </Link>
            )}
            
            <Link to="/sepet">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden md:inline ml-2">Sepetim</span>
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {state.itemCount}
                </span>
              </Button>
            </Link>

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 border-t border-border pt-4">
          <div className="flex items-center justify-center gap-6">
            {/* Balık Av Malzemeleri */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium">
                  Balık Av Malzemeleri
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-card z-50">
                <DropdownMenuItem asChild>
                  <Link to="/balik-av-malzemeleri" className="font-semibold w-full">Tümünü Gör</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Olta Makineleri</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card z-[100] pointer-events-auto">
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/olta-makineleri/spin" className="w-full">Spin Olta Makineleri</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/olta-makineleri/lrf" className="w-full">LRF Olta Makineleri</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/olta-makineleri/surf" className="w-full">Surf Olta Makineleri</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/olta-makineleri/genel-kullanim" className="w-full">Genel Kullanım Olta Makineleri</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Olta Kamışları</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card z-[100] pointer-events-auto">
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/olta-kamislari/telespin" className="w-full">Telespin Olta Kamışları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/olta-kamislari/teleskopik" className="w-full">Teleskopik Olta Kamışları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/olta-kamislari/spin" className="w-full">Spin Olta Kamışları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/olta-kamislari/lrf" className="w-full">LRF Olta Kamışları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/olta-kamislari/bot-tekne" className="w-full">Bot - Tekne Kamışları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/olta-kamislari/tatli-su" className="w-full">Tatlı Su Kamışları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/olta-kamislari/light-spin" className="w-full">Light Spin Kamışlar</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Suni Yemler</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card z-[100] pointer-events-auto">
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/hazir-olta-takimlari" className="w-full">Hazır Olta Takımları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/hazir-takim-ve-aksesuarlar" className="w-full">Hazır Takım ve Aksesuarları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/olta-makinaleri" className="w-full">Olta Makineleri</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/olta-kamislari" className="w-full">Olta Kamışları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/yapay-yemler" className="w-full">Yapay Yemler</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/olta-misina-ve-ipler" className="w-full">Olta Misina ve İpler</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/olta-igne-jighead-zoka" className="w-full">Olta İğne & Jighead & Zoka</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/firdondu-klips-halka" className="w-full">Fırdöndü & Klips & Halka</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/canta-kutu-kova" className="w-full">Çanta & Kutu & Kova</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/balikci-giyim" className="w-full">Balıkçı Giyim</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/kepce-livar-pinter" className="w-full">Kepçe & Livar & Pinter</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/kamis-sehpa-tripod" className="w-full">Kamış Sehpa ve Tripod</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/yardimci-aksesuarlar" className="w-full">Yardımcı Aksesuarlar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/tamir-bakim-yedek-parca" className="w-full">Tamir & Bakım & Yedek Parça</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/suni-yemler/balikci-cadir-mat-sandalye" className="w-full">Balıkçı Çadır & Mat & Sandalye</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/su-ustu-maketler" className="w-full">Su Üstü Maketler</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/kasik-yemler" className="w-full">Kaşık Yemler</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/balikci-kiyafetleri-ve-eldivenler" className="w-full">Balıkçı Kıyafetleri ve Eldivenler</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/canta-ve-kutular" className="w-full">Çanta ve Kutular</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Outdoor Giyim */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium">
                  Outdoor Giyim
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-card z-50">
                <DropdownMenuItem asChild>
                  <Link to="/outdoor-giyim" className="font-semibold w-full">Tümünü Gör</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Erkek sütunu */}
                <DropdownMenuLabel>Erkek</DropdownMenuLabel>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/erkek/pantolon" className="w-full">Pantolon</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/erkek/tisort" className="w-full">Tişört</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/erkek/gomlek" className="w-full">Gömlek</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/erkek/mont-ve-ceket" className="w-full">Mont ve Ceket</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/erkek/ayakkabi" className="w-full">Ayakkabı</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/erkek/bot" className="w-full">Bot</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/erkek/sweatshirts" className="w-full">Sweatshirts</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/erkek/polar" className="w-full">Polar</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/erkek/yelek" className="w-full">Yelek</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/erkek/sort" className="w-full">Şort</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Kadın sütunu */}
                <DropdownMenuLabel>Kadın</DropdownMenuLabel>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/kadin/tisort" className="w-full">Tişört</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/kadin/ayakkabi" className="w-full">Ayakkabı</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/kadin/bot" className="w-full">Bot</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/kadin/mont-ve-ceket" className="w-full">Mont ve Ceket</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/kadin/pantolon" className="w-full">Pantolon</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/kadin/polar" className="w-full">Polar</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/kadin/canta" className="w-full">Çanta</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/kadin/sapka" className="w-full">Şapka</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Diğer */}
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/bere" className="w-full">Bere</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim/termal-iclik" className="w-full">Termal İçlik</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Kamp Malzemeleri */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium">
                  Kamp Malzemeleri
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-card z-50">
                <DropdownMenuItem asChild>
                  <Link to="/kamp-malzemeleri" className="font-semibold w-full">Tümünü Gör</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/kamp-ocagi" className="w-full">Kamp Ocağı</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/kartuslar" className="w-full">Kartuşlar</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/cizmeler" className="w-full">Çizmeler</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/sisme-urunler-ve-matlar" className="w-full">Şişme Ürünler ve Matlar</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/purmuz" className="w-full">Pürmüz</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/kamp-cantasi" className="w-full">Kamp Çantası</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/aydinlatma" className="w-full">Aydınlatma</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/cadirlar" className="w-full">Çadırlar</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/uyku-tulumlari" className="w-full">Uyku Tulumları</Link></DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Fenerler</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card z-[100] pointer-events-auto">
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/fenerler/kafa-lambasi" className="w-full">Kafa Lambası</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/fenerler/el-feneri" className="w-full">El Feneri</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/masalar-ve-sandalyeler" className="w-full">Masalar ve Sandalyeler</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/kopek-kovucu" className="w-full">Köpek Kovucu</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/balta-kurek" className="w-full">Balta , Kürek</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/kamp-mutfagi" className="w-full">Kamp Mutfağı</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri/kamp-ekipmanlari" className="w-full">Kamp Ekipmanları</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Termoslar ve Mataralar - direct link button */}
            <Link to="/termoslar-ve-mataralar" className="text-primary hover:text-primary-glow transition-smooth font-medium px-4 py-2">
              Termoslar ve Mataralar
            </Link>

            {/* Dalış Ürünleri */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium">
                  Dalış Ürünleri
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-card z-50">
                <DropdownMenuItem asChild>
                  <Link to="/dalis-urunleri" className="font-semibold w-full">Tümünü Gör</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/denge-yelegi-bcd" className="w-full">Denge Yeleği (BCD)</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/dalis-bilgisayari" className="w-full">Dalış Bilgisayarı</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/dalis-bicak-ve-makaslar" className="w-full">Dalış Bıçak ve Makaslar</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/dalis-tup-ve-vanalar" className="w-full">Dalış Tüp ve Vanalar</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/regulatorler" className="w-full">Regülatörler</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/dalis-kemeri-ve-agirliklari" className="w-full">Dalış Kemeri ve Ağırlıkları</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/dalis-elbise-yelek-shorty" className="w-full">Dalış Elbise & Yelek & Shorty</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/konsol-pusula-manometre" className="w-full">Konsol & Pusula & Manometre</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/zepkin-modelleri" className="w-full">Zıpkın Modelleri</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/patik-eldiven-baslik" className="w-full">Patik & Eldiven & Başlık</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/dalis-samandiralari" className="w-full">Dalış Şamandıraları</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/zipkin-yedek-parcalari" className="w-full">Zıpkın Yedek Parçaları</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/dalis-yuzucu-paletleri" className="w-full">Dalış & Yüzücü Paletleri</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/dalis-cantalari" className="w-full">Dalış Çantaları</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/yedek-parca-ve-aksesuar" className="w-full">Yedek Parça ve Aksesuar</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/dalis-urunleri/maske-snorkel-gozluk" className="w-full">Maske & Şnorkel & Gözlük</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/urun-kategorileri" className="text-foreground hover:text-primary transition-smooth font-medium px-4 py-2">
              Ürün Kategorileri
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;