import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, Phone, LogOut, ChevronDown, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import { useAuth } from '@/hooks/useAuth';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
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
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Helper function to check if link is active
  const isLinkActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Scroll detection for compact header
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/urunler?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className={`border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      {/* Top bar - hide on scroll */}
      <div className={`bg-primary text-primary-foreground px-4 text-center text-sm transition-all duration-300 ${isScrolled ? 'py-1' : 'py-2'}`}>
        <div className="container mx-auto flex items-center justify-between">
          <span className="text-xs md:text-sm">Tüm Siparişlerinizde 24 Saat İçinde Kargoda!</span>
          <div className="hidden sm:flex items-center gap-3">
            <Phone className="h-4 w-4" />
            <span className="text-xs md:text-sm">0452 214 17 43</span>
            <span className="text-xs md:text-sm">0533 640 77 58</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className={`container mx-auto px-4 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
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
            {/* Social icons first */}
            <div className="hidden md:flex items-center space-x-1">
              <a href="https://www.facebook.com/egemordu" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Facebook className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://www.instagram.com/egemoutdoor/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
            </div>

            {/* Login / Account after icons */}
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

                  {/* Categories with subcategories (mobile) */}
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-2">Kategoriler</div>
                    <div className="grid grid-cols-1 gap-2">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="balik-av">
                          <AccordionTrigger className="px-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Balık Av Malzemeleri</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <Link to="/balik-av-malzemeleri/misineler" className="px-3 py-3 rounded-lg bg-card border">Misineler</Link>
                              <Link to="/balik-av-malzemeleri/igne-jighead" className="px-3 py-3 rounded-lg bg-card border">İğne ve Jighead</Link>
                              <Link to="/balik-av-malzemeleri/aksesuarlar" className="px-3 py-3 rounded-lg bg-card border">Aksesuarlar</Link>
                              <Link to="/balik-av-malzemeleri/su-ustu-maketler" className="px-3 py-3 rounded-lg bg-card border">Su Üstü Maketler</Link>
                              <Link to="/balik-av-malzemeleri/kasik-yemler" className="px-3 py-3 rounded-lg bg-card border">Kaşık Yemler</Link>
                              
                              <Link to="/balik-av-malzemeleri/suni-yemler/silikon-yemler" className="px-3 py-3 rounded-lg bg-card border">Silikon Yemler</Link>
                              <Link to="/balik-av-malzemeleri/suni-yemler/jig-yemler" className="px-3 py-3 rounded-lg bg-card border">Jig Yemler</Link>
                              <Link to="/balik-av-malzemeleri/suni-yemler/kasiklar-ve-vibrasyonlar" className="px-3 py-3 rounded-lg bg-card border">Kaşıklar ve Vibrasyonlar</Link>
                              <Link to="/balik-av-malzemeleri/suni-yemler/zokalar" className="px-3 py-3 rounded-lg bg-card border">Zokalar</Link>
                              <Link to="/balik-av-malzemeleri/suni-yemler/meppsler" className="px-3 py-3 rounded-lg bg-card border">Meppsler</Link>
                              <Link to="/balik-av-malzemeleri/suni-yemler/sazan-yemleri" className="px-3 py-3 rounded-lg bg-card border">Sazan Yemleri</Link>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="outdoor">
                          <AccordionTrigger className="px-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Outdoor Giyim</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <Link to="/outdoor-giyim/erkek/pantolon" className="px-3 py-3 rounded-lg bg-card border">Pantolon</Link>
                              <Link to="/outdoor-giyim/erkek/tisort" className="px-3 py-3 rounded-lg bg-card border">Tişört</Link>
                              <Link to="/outdoor-giyim/erkek/gomlek" className="px-3 py-3 rounded-lg bg-card border">Gömlek</Link>
                              <Link to="/outdoor-giyim/erkek/mont-ve-ceket" className="px-3 py-3 rounded-lg bg-card border">Mont ve Ceket</Link>
                              <Link to="/outdoor-giyim/erkek/ayakkabi" className="px-3 py-3 rounded-lg bg-card border">Ayakkabı</Link>
                              <Link to="/outdoor-giyim/erkek/bot" className="px-3 py-3 rounded-lg bg-card border">Bot</Link>
                              <Link to="/outdoor-giyim/erkek/sweatshirts" className="px-3 py-3 rounded-lg bg-card border">Sweatshirts</Link>
                              <Link to="/outdoor-giyim/erkek/polar" className="px-3 py-3 rounded-lg bg-card border">Polar</Link>
                              <Link to="/outdoor-giyim/erkek/yelek" className="px-3 py-3 rounded-lg bg-card border">Yelek</Link>
                              <Link to="/outdoor-giyim/erkek/sort" className="px-3 py-3 rounded-lg bg-card border">Şort</Link>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="kamp">
                          <AccordionTrigger className="px-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Kamp Malzemeleri</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <Link to="/kamp-malzemeleri/kamp-ocagi" className="px-3 py-3 rounded-lg bg-card border">Kamp Ocağı</Link>
                              <Link to="/kamp-malzemeleri/kartuslar" className="px-3 py-3 rounded-lg bg-card border">Kartuşlar</Link>
                              <Link to="/kamp-malzemeleri/cizmeler" className="px-3 py-3 rounded-lg bg-card border">Çizmeler</Link>
                              <Link to="/kamp-malzemeleri/sisme-urunler-ve-matlar" className="px-3 py-3 rounded-lg bg-card border">Şişme Ürünler ve Matlar</Link>
                              <Link to="/kamp-malzemeleri/purmuz" className="px-3 py-3 rounded-lg bg-card border">Pürmüz</Link>
                              <Link to="/kamp-malzemeleri/kamp-cantasi" className="px-3 py-3 rounded-lg bg-card border">Kamp Çantası</Link>
                              <Link to="/kamp-malzemeleri/aydinlatma" className="px-3 py-3 rounded-lg bg-card border">Aydınlatma</Link>
                              <Link to="/kamp-malzemeleri/cadirlar" className="px-3 py-3 rounded-lg bg-card border">Çadırlar</Link>
                              <Link to="/kamp-malzemeleri/uyku-tulumlari" className="px-3 py-3 rounded-lg bg-card border">Uyku Tulumları</Link>
                              <Link to="/kamp-malzemeleri/fenerler/kafa-lambasi" className="px-3 py-3 rounded-lg bg-card border">Kafa Lambası</Link>
                              <Link to="/kamp-malzemeleri/fenerler/el-feneri" className="px-3 py-3 rounded-lg bg-card border">El Feneri</Link>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="dalis">
                          <AccordionTrigger className="px-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Dalış Ürünleri</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <Link to="/dalis-urunleri/denge-yelegi-bcd" className="px-3 py-3 rounded-lg bg-card border">Denge Yeleği (BCD)</Link>
                              <Link to="/dalis-urunleri/dalis-bilgisayari" className="px-3 py-3 rounded-lg bg-card border">Dalış Bilgisayarı</Link>
                              <Link to="/dalis-urunleri/dalis-bicak-ve-makaslar" className="px-3 py-3 rounded-lg bg-card border">Dalış Bıçak ve Makaslar</Link>
                              <Link to="/dalis-urunleri/dalis-tup-ve-vanalar" className="px-3 py-3 rounded-lg bg-card border">Dalış Tüp ve Vanalar</Link>
                              <Link to="/dalis-urunleri/regulatorler" className="px-3 py-3 rounded-lg bg-card border">Regülatörler</Link>
                              <Link to="/dalis-urunleri/dalis-kemeri-ve-agirliklari" className="px-3 py-3 rounded-lg bg-card border">Dalış Kemeri ve Ağırlıkları</Link>
                              <Link to="/dalis-urunleri/dalis-elbise-yelek-shorty" className="px-3 py-3 rounded-lg bg-card border">Dalış Elbise & Yelek & Shorty</Link>
                              <Link to="/dalis-urunleri/konsol-pusula-manometre" className="px-3 py-3 rounded-lg bg-card border">Konsol & Pusula & Manometre</Link>
                              <Link to="/dalis-urunleri/zepkin-modelleri" className="px-3 py-3 rounded-lg bg-card border">Zıpkın Modelleri</Link>
                              <Link to="/dalis-urunleri/patik-eldiven-baslik" className="px-3 py-3 rounded-lg bg-card border">Patik & Eldiven & Başlık</Link>
                              <Link to="/dalis-urunleri/dalis-samandiralari" className="px-3 py-3 rounded-lg bg-card border">Dalış Şamandıraları</Link>
                              <Link to="/dalis-urunleri/zipkin-yedek-parcalari" className="px-3 py-3 rounded-lg bg-card border">Zıpkın Yedek Parçaları</Link>
                              <Link to="/dalis-urunleri/dalis-yuzucu-paletleri" className="px-3 py-3 rounded-lg bg-card border">Dalış & Yüzücü Paletleri</Link>
                              <Link to="/dalis-urunleri/dalis-cantalari" className="px-3 py-3 rounded-lg bg-card border">Dalış Çantaları</Link>
                              <Link to="/dalis-urunleri/yedek-parca-ve-aksesuar" className="px-3 py-3 rounded-lg bg-card border">Yedek Parça ve Aksesuar</Link>
                              <Link to="/dalis-urunleri/maske-snorkel-gozluk" className="px-3 py-3 rounded-lg bg-card border">Maske & Şnorkel & Gözlük</Link>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="spor">
                          <AccordionTrigger className="px-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Spor Malzemeleri</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <Link to="/spor-malzemeleri/su-sporlari-ekipmanlari" className="px-3 py-3 rounded-lg bg-card border">Su Sporları Ekipmanları</Link>
                              <Link to="/spor-malzemeleri/tenis-ekipmanlari" className="px-3 py-3 rounded-lg bg-card border">Tenis Ekipmanları</Link>
                              <Link to="/spor-malzemeleri/futbol-ekipmanlari" className="px-3 py-3 rounded-lg bg-card border">Futbol Ekipmanları</Link>
                              <Link to="/spor-malzemeleri/basketbol-ekipmanlari" className="px-3 py-3 rounded-lg bg-card border">Basketbol Ekipmanları</Link>
                              <Link to="/spor-malzemeleri/kaykay-ve-patenler" className="px-3 py-3 rounded-lg bg-card border">Kaykay ve Patenler</Link>
                              <Link to="/spor-malzemeleri/raketler" className="px-3 py-3 rounded-lg bg-card border">Raketler</Link>
                              <Link to="/spor-malzemeleri/jimnastik-ekipmanlari" className="px-3 py-3 rounded-lg bg-card border">Jimnastik Ekipmanları</Link>
                              <Link to="/spor-malzemeleri/toplar" className="px-3 py-3 rounded-lg bg-card border">Toplar</Link>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <Link to="/outdoor-giyim" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Outdoor Giyim</Link>
                      <Link to="/kamp-malzemeleri" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Kamp Malzemeleri</Link>
                      <Link to="/dalis-urunleri" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Dalış Ürünleri</Link>
                      <Link to="/spor-malzemeleri" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Spor Malzemeleri</Link>
                      <Link to="/termoslar-ve-mataralar" className="px-3 py-3 rounded-lg bg-secondary hover:bg-secondary-glow transition-smooth">Termoslar ve Mataralar</Link>
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
              <DropdownMenuContent className="sm:max-w-[90vw] max-h-[70vh] overflow-y-auto bg-card z-50 p-4">
                <div className="mb-2">
                  <Link to="/balik-av-malzemeleri" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="font-semibold hover:text-primary">Tümünü Gör</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                  <div className="col-span-1 xl:col-span-1 space-y-0.5">
                    <Link to="/balik-av-malzemeleri/olta-makineleri" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className={`px-0 cursor-pointer hover:text-primary transition-colors ${isLinkActive('/balik-av-malzemeleri/olta-makineleri') ? 'text-primary font-bold' : ''}`}>Olta Makineleri</DropdownMenuLabel>
                    </Link>
                    <Link to="/balik-av-malzemeleri/olta-makineleri/spin" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Spin Olta Makineleri</Link>
                    <Link to="/balik-av-malzemeleri/olta-makineleri/lrf" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">LRF Olta Makineleri</Link>
                    <Link to="/balik-av-malzemeleri/olta-makineleri/surf" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Surf Olta Makineleri</Link>
                    <Link to="/balik-av-malzemeleri/olta-makineleri/genel-kullanim" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Genel Kullanım</Link>
                  </div>
                  <div className="col-span-1 xl:col-span-1 space-y-0.5">
                    <Link to="/balik-av-malzemeleri/olta-kamislari" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Olta Kamışları</DropdownMenuLabel>
                    </Link>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/telespin" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Telespin</Link>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/teleskopik" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Teleskopik</Link>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/spin" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Spin</Link>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/lrf" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">LRF</Link>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/bot-tekne" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Bot - Tekne</Link>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/tatli-su" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Tatlı Su</Link>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/light-spin" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Light Spin</Link>
                  </div>
                  <div className="col-span-1 xl:col-span-1 space-y-0.5">
                    <Link to="/balik-av-malzemeleri/suni-yemler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Suni Yemler</DropdownMenuLabel>
                    </Link>
                    <Link to="/balik-av-malzemeleri/su-ustu-maketler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Su Üstü Maketler</Link>
                    <Link to="/balik-av-malzemeleri/kasik-yemler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Kaşık Yemler</Link>
                    
                    <Link to="/balik-av-malzemeleri/suni-yemler/silikon-yemler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Silikon Yemler</Link>
                    <Link to="/balik-av-malzemeleri/suni-yemler/jig-yemler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Jig Yemler</Link>
                    <Link to="/balik-av-malzemeleri/suni-yemler/kasiklar-ve-vibrasyonlar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Kaşıklar ve Vibrasyonlar</Link>
                    <Link to="/balik-av-malzemeleri/suni-yemler/zokalar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Zokalar</Link>
                    <Link to="/balik-av-malzemeleri/suni-yemler/meppsler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Meppsler</Link>
                    <Link to="/balik-av-malzemeleri/suni-yemler/sazan-yemleri" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Sazan Yemleri</Link>
                  </div>
                  <div className="col-span-1 xl:col-span-1 space-y-1">
                    <Link to="/balik-av-malzemeleri/misineler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Misineler</DropdownMenuLabel>
                    </Link>
                    <Link to="/balik-av-malzemeleri/misineler/monofilament" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Monofilament</Link>
                    <Link to="/balik-av-malzemeleri/misineler/fluorocarbon" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Fluorocarbon</Link>
                    <Link to="/balik-av-malzemeleri/misineler/ip-orgu" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">İp - Örgü</Link>
                  </div>
                  <div className="group col-span-2 xl:col-span-1">
                    <Link to="/balik-av-malzemeleri/igne-jighead" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">İğne ve Jighead</DropdownMenuLabel>
                    </Link>
                    <div className="mt-1 space-y-0.5 max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-300">
                      <Link to="/balik-av-malzemeleri/igne-jighead/kursunlar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Kurşunlar</Link>
                      <Link to="/balik-av-malzemeleri/igne-jighead/jighead-zoka" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Jighead - Zoka</Link>
                      <Link to="/balik-av-malzemeleri/igne-jighead/assist-jig-igneleri" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Assist Jig İğneleri</Link>
                      <Link to="/balik-av-malzemeleri/igne-jighead/uclu-igneler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Üçlü İğneler</Link>
                      <Link to="/balik-av-malzemeleri/igne-jighead/firdondu-klips-halkalar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Fırdöndü - Klips - Halkalar</Link>
                      <Link to="/balik-av-malzemeleri/igne-jighead/tekli-igneler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Tekli İğneler</Link>
                      <Link to="/balik-av-malzemeleri/igne-jighead/ofset-igneler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Ofset İğneler</Link>
                    </div>
                  </div>
                  <div className="group col-span-2 xl:col-span-1">
                    <Link to="/balik-av-malzemeleri/aksesuarlar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Aksesuarlar</DropdownMenuLabel>
                    </Link>
                    <div className="mt-1 space-y-0.5 max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-300">
                      <Link to="/balik-av-malzemeleri/aksesuarlar/cizmeler-ve-tulum-cizmeler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Çizmeler - Tulum</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/samandira-ve-stopler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Şamandıra ve Stopler</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/fenerler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Fenerler</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/pense-gripper-makas" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Pense - Gripper - Makas</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/kepce-livar-kakic-tripod" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Kepçe - Livar - Kakıç - Tripod</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/sisme-yataklar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Şişme Yataklar</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/alarm-zil-fosfor-boncuk" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Alarm - Zil - Fosfor - Boncuk</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/gozlukler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Gözlükler</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/digerleri" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Diğerleri</Link>
                    </div>
                  </div>
                  <div className="group col-span-2 xl:col-span-1">
                    <Link to="/balik-av-malzemeleri/diger" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Diğer</DropdownMenuLabel>
                    </Link>
                    <div className="mt-1 space-y-0.5 max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-300">
                      <Link to="/balik-av-malzemeleri/balikci-kiyafetleri-ve-eldivenler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Balıkçı Kıyafetleri ve Eldivenler</Link>
                      <Link to="/balik-av-malzemeleri/canta-ve-kutular" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Çanta ve Kutular</Link>
                    </div>
                  </div>
                </div>
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
              <DropdownMenuContent className="sm:max-w-[90vw] max-h-[70vh] overflow-y-auto bg-card z-50 p-4">
                <div className="mb-2">
                  <Link to="/outdoor-giyim" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="font-semibold hover:text-primary">Tümünü Gör</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-2">
                  <div className="col-span-1 xl:col-span-1 space-y-0.5">
                    <Link to="/outdoor-giyim/erkek" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Erkek</DropdownMenuLabel>
                    </Link>
                    <Link to="/outdoor-giyim/erkek/pantolon" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Pantolon</Link>
                    <Link to="/outdoor-giyim/erkek/tisort" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Tişört</Link>
                    <Link to="/outdoor-giyim/erkek/gomlek" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Gömlek</Link>
                    <Link to="/outdoor-giyim/erkek/mont-ve-ceket" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Mont ve Ceket</Link>
                    <Link to="/outdoor-giyim/erkek/ayakkabi" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Ayakkabı</Link>
                    <Link to="/outdoor-giyim/erkek/bot" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Bot</Link>
                  </div>
                  <div className="col-span-1 xl:col-span-1 space-y-0.5">
                    <Link to="/outdoor-giyim/kadin" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Kadın</DropdownMenuLabel>
                    </Link>
                    <Link to="/outdoor-giyim/kadin/tisort" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Tişört</Link>
                    <Link to="/outdoor-giyim/kadin/ayakkabi" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Ayakkabı</Link>
                    <Link to="/outdoor-giyim/kadin/bot" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Bot</Link>
                    <Link to="/outdoor-giyim/kadin/mont-ve-ceket" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Mont ve Ceket</Link>
                    <Link to="/outdoor-giyim/kadin/pantolon" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Pantolon</Link>
                  </div>
                  <div className="col-span-2 xl:col-span-1 space-y-0.5">
                    <Link to="/outdoor-giyim/aksesuar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Aksesuar</DropdownMenuLabel>
                    </Link>
                    <Link to="/outdoor-giyim/kadin/canta" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Çanta</Link>
                    <Link to="/outdoor-giyim/kadin/sapka" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Şapka</Link>
                    <Link to="/outdoor-giyim/bere" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Bere</Link>
                    <Link to="/outdoor-giyim/termal-iclik" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Termal İçlik</Link>
                    <Link to="/outdoor-giyim/erkek/sweatshirts" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Sweatshirts</Link>
                    <Link to="/outdoor-giyim/erkek/polar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Polar</Link>
                    <Link to="/outdoor-giyim/erkek/yelek" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Yelek</Link>
                    <Link to="/outdoor-giyim/erkek/sort" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Şort</Link>
                  </div>
                </div>
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
              <DropdownMenuContent className="sm:max-w-[90vw] max-h-[70vh] overflow-y-auto bg-card z-50 p-4">
                <div className="mb-2">
                  <Link to="/kamp-malzemeleri" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="font-semibold hover:text-primary">Tümünü Gör</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-2">
                  <div className="col-span-1 xl:col-span-1 space-y-0.5">
                    <Link to="/kamp-malzemeleri/pisirme" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Pişirme</DropdownMenuLabel>
                    </Link>
                    <Link to="/kamp-malzemeleri/kamp-ocagi" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Kamp Ocağı</Link>
                    <Link to="/kamp-malzemeleri/kartuslar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Kartuşlar</Link>
                    <Link to="/kamp-malzemeleri/purmuz" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Pürmüz</Link>
                    <Link to="/kamp-malzemeleri/kamp-mutfagi" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Kamp Mutfağı</Link>
                  </div>
                  <div className="space-y-0.5">
                    <Link to="/kamp-malzemeleri/barinma-uyku" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Barınma & Uyku</DropdownMenuLabel>
                    </Link>
                    <Link to="/kamp-malzemeleri/cadirlar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Çadırlar</Link>
                    <Link to="/kamp-malzemeleri/uyku-tulumlari" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Uyku Tulumları</Link>
                    <Link to="/kamp-malzemeleri/sisme-urunler-ve-matlar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Şişme Ürünler ve Matlar</Link>
                  </div>
                  <div className="space-y-0.5">
                    <Link to="/kamp-malzemeleri/aksesuar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Aksesuar</DropdownMenuLabel>
                    </Link>
                    <Link to="/kamp-malzemeleri/kamp-cantasi" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Kamp Çantası</Link>
                    <Link to="/kamp-malzemeleri/aydinlatma" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Aydınlatma</Link>
                    <Link to="/kamp-malzemeleri/fenerler/kafa-lambasi" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Kafa Lambası</Link>
                    <Link to="/kamp-malzemeleri/fenerler/el-feneri" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">El Feneri</Link>
                    <Link to="/kamp-malzemeleri/masalar-ve-sandalyeler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Masalar ve Sandalyeler</Link>
                    <Link to="/kamp-malzemeleri/cizmeler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Çizmeler</Link>
                    <Link to="/kamp-malzemeleri/balta-kurek" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Balta , Kürek</Link>
                    <Link to="/kamp-malzemeleri/kopek-kovucu" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Köpek Kovucu</Link>
                    <Link to="/kamp-malzemeleri/kamp-ekipmanlari" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Kamp Ekipmanları</Link>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dalış Ürünleri (moved here) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium">
                  Dalış Ürünleri
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="sm:max-w-[90vw] max-h-[70vh] overflow-y-auto bg-card z-50 p-4">
                <div className="mb-2">
                  <Link to="/dalis-urunleri" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="font-semibold hover:text-primary">Tümünü Gör</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-2">
                  <div className="col-span-1 xl:col-span-1 space-y-0.5">
                    <Link to="/dalis-urunleri/ekipman" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Ekipman</DropdownMenuLabel>
                    </Link>
                    <Link to="/dalis-urunleri/denge-yelegi-bcd" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Denge Yeleği (BCD)</Link>
                    <Link to="/dalis-urunleri/dalis-bilgisayari" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Dalış Bilgisayarı</Link>
                    <Link to="/dalis-urunleri/regulatorler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Regülatörler</Link>
                    <Link to="/dalis-urunleri/konsol-pusula-manometre" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Konsol & Pusula & Manometre</Link>
                    <Link to="/dalis-urunleri/dalis-tup-ve-vanalar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Dalış Tüp ve Vanalar</Link>
                  </div>
                  <div className="col-span-1 xl:col-span-1 space-y-0.5">
                    <Link to="/dalis-urunleri/giyim-parca" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Giyim & Parça</DropdownMenuLabel>
                    </Link>
                    <Link to="/dalis-urunleri/dalis-elbise-yelek-shorty" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Elbise & Yelek & Shorty</Link>
                    <Link to="/dalis-urunleri/patik-eldiven-baslik" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Patik & Eldiven & Başlık</Link>
                    <Link to="/dalis-urunleri/dalis-cantalari" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Dalış Çantaları</Link>
                    <Link to="/dalis-urunleri/yedek-parca-ve-aksesuar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Yedek Parça ve Aksesuar</Link>
                  </div>
                  <div className="col-span-2 xl:col-span-1 space-y-0.5">
                    <Link to="/dalis-urunleri/av-aksesuar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
                      <DropdownMenuLabel className="px-0 cursor-pointer hover:text-primary">Av & Aksesuar</DropdownMenuLabel>
                    </Link>
                    <Link to="/dalis-urunleri/zepkin-modelleri" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Zıpkın Modelleri</Link>
                    <Link to="/dalis-urunleri/zipkin-yedek-parcalari" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Zıpkın Yedek Parçaları</Link>
                    <Link to="/dalis-urunleri/dalis-yuzucu-paletleri" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Dalış & Yüzücü Paletleri</Link>
                    <Link to="/dalis-urunleri/maske-snorkel-gozluk" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Maske & Şnorkel & Gözlük</Link>
                    <Link to="/dalis-urunleri/dalis-bicak-ve-makaslar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Dalış Bıçak ve Makaslar</Link>
                    <Link to="/dalis-urunleri/dalis-samandiralari" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-0.5 hover:text-primary pl-2">Dalış Şamandıraları</Link>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Spor Malzemeleri - mega menü */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium">
                  Spor Malzemeleri
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 max-h-[70vh] overflow-y-auto bg-card z-50 p-4">
                <div className="mb-2">
                  <Link to="/spor-malzemeleri" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="font-semibold hover:text-primary">Tümünü Gör</Link>
                </div>
                <div className="space-y-1">
                  <Link to="/spor-malzemeleri/su-sporlari-ekipmanlari" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-1.5 hover:text-primary pl-2">Su Sporları Ekipmanları</Link>
                  <Link to="/spor-malzemeleri/tenis-ekipmanlari" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-1.5 hover:text-primary pl-2">Tenis Ekipmanları</Link>
                  <Link to="/spor-malzemeleri/futbol-ekipmanlari" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-1.5 hover:text-primary pl-2">Futbol Ekipmanları</Link>
                  <Link to="/spor-malzemeleri/basketbol-ekipmanlari" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-1.5 hover:text-primary pl-2">Basketbol Ekipmanları</Link>
                  <Link to="/spor-malzemeleri/kaykay-ve-patenler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-1.5 hover:text-primary pl-2">Kaykay ve Patenler</Link>
                  <Link to="/spor-malzemeleri/raketler" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-1.5 hover:text-primary pl-2">Raketler</Link>
                  <Link to="/spor-malzemeleri/jimnastik-ekipmanlari" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-1.5 hover:text-primary pl-2">Jimnastik Ekipmanları</Link>
                  <Link to="/spor-malzemeleri/toplar" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="text-sm block py-1.5 hover:text-primary pl-2">Toplar</Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Termoslar ve Mataralar - moved after Spor */}
            <Link to="/termoslar-ve-mataralar" className="text-foreground hover:text-primary transition-smooth font-medium px-4 py-2">
              Termoslar ve Mataralar
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;