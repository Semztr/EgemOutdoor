import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, Phone, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import { useAuth } from '@/hooks/useAuth';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
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
          <span className="text-xs md:text-sm">Tüm Siparişlerinizde 24 Saat İçinde Kargoda!</span>
          <div className="hidden sm:flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="text-xs md:text-sm">0452 214 17 43</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center space-x-2 flex-shrink-0">
            <img src="/favicon.png" alt="EgemOutdoor Logo" className="h-8 w-8 md:h-10 md:w-10 rounded" />
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-foreground">EgemOutdoor</h1>
              <p className="text-xs text-muted-foreground">Kişiye Özel Outdoor Ürünleri</p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchAutocomplete className="w-full" />
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">
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
              <Button variant="ghost" size="sm" className="relative min-h-10 min-w-10">
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden md:inline ml-2">Sepetim</span>
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {state.itemCount}
                </span>
              </Button>
            </Link>

            {/* Mobile Sheet for categories/brands */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden min-h-10 min-w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pb-6 w-[85vw] sm:max-w-sm">
                <SheetHeader className="pb-4">
                  <SheetTitle className="text-center">Menü</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-2 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Search on mobile inside drawer */}
                  <div className="md:hidden">
                    <SearchAutocomplete className="w-full" />
                  </div>

                  {/* Categories */}
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-2">Kategoriler</div>
                    <div className="grid grid-cols-1 gap-2">
                      <Link to="/balik-av-malzemeleri" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Balık Av Malzemeleri</Link>
                      <Link to="/outdoor-giyim" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Outdoor Giyim</Link>
                      <Link to="/kamp-malzemeleri" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Kamp Malzemeleri</Link>
                      <Link to="/dalis-urunleri" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Dalış Ürünleri</Link>
                      <Link to="/urun-kategorileri" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Tüm Kategoriler</Link>
                    </div>
                  </div>

                  {/* Quick Links / Brands placeholder */}
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-2">Hızlı Linkler</div>
                    <div className="grid grid-cols-1 gap-2">
                      <Link to="/urunler" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Tüm Ürünler</Link>
                      <Link to="/blog" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Blog</Link>
                      <Link to="/iletisim" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">İletişim</Link>
                      <Link to="/hakkimizda" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Hakkımızda</Link>
                    </div>
                  </div>

                  {/* Auth / Account */}
                  <div className="grid grid-cols-2 gap-3">
                    {user ? (
                      <>
                        <Link to="/hesabim" className="px-3 py-3 rounded-lg bg-primary text-primary-foreground text-center">Hesabım</Link>
                        <button onClick={signOut} className="px-3 py-3 rounded-lg bg-destructive text-destructive-foreground">Çıkış Yap</button>
                      </>
                    ) : (
                      <Link to="/giris" className="col-span-2 px-3 py-3 rounded-lg bg-primary text-primary-foreground text-center">Giriş Yap</Link>
                    )}
                  </div>

                  <SheetClose asChild>
                    <Button variant="outline" className="w-full mt-2">Kapat</Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden lg:block mt-4 border-t border-border pt-4">
          <div className="flex items-center justify-center gap-6 flex-wrap">
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
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/su-ustu-maketler" className="w-full">Su Üstü Maketler</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/kasik-yemler" className="w-full">Kaşık Yemler</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Misineler */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Misineler</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card z-[100] pointer-events-auto">
                    <DropdownMenuItem asChild>
                      <Link to="/balik-av-malzemeleri/misineler/monofilament" className="w-full">Monofilament Misineler</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/balik-av-malzemeleri/misineler/fluorocarbon" className="w-full">Fluorocarbon Misineler</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/balik-av-malzemeleri/misineler/ip-orgu" className="w-full">İp - Örgü Misineler</Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                {/* İğne ve Jighead */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>İğne ve Jighead</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card z-[100] pointer-events-auto">
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/igne-jighead/kursunlar" className="w-full">Kurşunlar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/igne-jighead/jighead-zoka" className="w-full">Jighead - Zoka</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/igne-jighead/assist-jig-igneleri" className="w-full">Assist Jig İğneleri</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/igne-jighead/uclu-igneler" className="w-full">Üçlü İğneler</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/igne-jighead/firdondu-klips-halkalar" className="w-full">Fırdöndü - Klips - Halkalar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/igne-jighead/tekli-igneler" className="w-full">Tekli İğneler</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/igne-jighead/ofset-igneler" className="w-full">Ofset İğneler</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Aksesuarlar */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Aksesuarlar</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card z-[100] pointer-events-auto">
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/aksesuarlar/cizmeler-ve-tulum-cizmeler" className="w-full">Çizmeler - Tulum Çizmeler</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/aksesuarlar/samandira-ve-stopler" className="w-full">Şamandıra ve Stopler</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/aksesuarlar/fenerler" className="w-full">Fenerler</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/aksesuarlar/pense-gripper-makas" className="w-full">Pense - Gripper - Makas</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/aksesuarlar/kepce-livar-kakic-tripod" className="w-full">Kepçe - Livar - Kakıç - Tripod</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/aksesuarlar/sisme-yataklar" className="w-full">Şişme Yataklar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/aksesuarlar/alarm-zil-fosfor-boncuk" className="w-full">Alarm - Zil - Fosfor - Boncuk</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/aksesuarlar/gozlukler" className="w-full">Gözlükler</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri/aksesuarlar/digerleri" className="w-full">Diğerleri</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
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