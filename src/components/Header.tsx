import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, Phone, LogOut, ChevronDown, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
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
          <div className="hidden sm:flex items-center gap-3">
            <Phone className="h-4 w-4" />
            <span className="text-xs md:text-sm">0452 214 17 43</span>
            <span className="text-xs md:text-sm">0533 640 77 58</span>
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
                      </Accordion>

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
              <DropdownMenuContent className="sm:max-w-[90vw] max-h-[70vh] overflow-y-auto bg-card z-50 p-4">
                <div className="mb-2">
                  <Link to="/balik-av-malzemeleri" className="font-semibold">Tümünü Gör</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                  <div className="col-span-1 xl:col-span-2 space-y-1">
                    <DropdownMenuLabel className="px-0">Olta Makineleri</DropdownMenuLabel>
                    <Link to="/balik-av-malzemeleri/olta-makineleri/spin" className="text-sm block py-1">Spin Olta Makineleri</Link>
                    <Link to="/balik-av-malzemeleri/olta-makineleri/lrf" className="text-sm block py-1">LRF Olta Makineleri</Link>
                    <Link to="/balik-av-malzemeleri/olta-makineleri/surf" className="text-sm block py-1">Surf Olta Makineleri</Link>
                    <Link to="/balik-av-malzemeleri/olta-makineleri/genel-kullanim" className="text-sm block py-1">Genel Kullanım</Link>
                  </div>
                  <div className="col-span-1 xl:col-span-2 space-y-1">
                    <DropdownMenuLabel className="px-0">Olta Kamışları</DropdownMenuLabel>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/telespin" className="text-sm block py-1">Telespin</Link>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/teleskopik" className="text-sm block py-1">Teleskopik</Link>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/spin" className="text-sm block py-1">Spin</Link>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/lrf" className="text-sm block py-1">LRF</Link>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/bot-tekne" className="text-sm block py-1">Bot - Tekne</Link>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/tatli-su" className="text-sm block py-1">Tatlı Su</Link>
                    <Link to="/balik-av-malzemeleri/olta-kamislari/light-spin" className="text-sm block py-1">Light Spin</Link>
                  </div>
                  <div className="col-span-1 xl:col-span-1 space-y-1">
                    <DropdownMenuLabel className="px-0">Suni Yemler</DropdownMenuLabel>
                    <Link to="/balik-av-malzemeleri/su-ustu-maketler" className="text-sm block py-1">Su Üstü Maketler</Link>
                    <Link to="/balik-av-malzemeleri/kasik-yemler" className="text-sm block py-1">Kaşık Yemler</Link>
                  </div>
                  <div className="col-span-1 xl:col-span-1 space-y-1">
                    <DropdownMenuLabel className="px-0">Misineler</DropdownMenuLabel>
                    <Link to="/balik-av-malzemeleri/misineler/monofilament" className="text-sm block py-1">Monofilament</Link>
                    <Link to="/balik-av-malzemeleri/misineler/fluorocarbon" className="text-sm block py-1">Fluorocarbon</Link>
                    <Link to="/balik-av-malzemeleri/misineler/ip-orgu" className="text-sm block py-1">İp - Örgü</Link>
                  </div>
                  <div className="group col-span-2 xl:col-span-2">
                    <DropdownMenuLabel className="px-0">İğne ve Jighead</DropdownMenuLabel>
                    <div className="mt-1 space-y-1 hidden group-hover:block">
                      <Link to="/balik-av-malzemeleri/igne-jighead/kursunlar" className="text-sm block py-1">Kurşunlar</Link>
                      <Link to="/balik-av-malzemeleri/igne-jighead/jighead-zoka" className="text-sm block py-1">Jighead - Zoka</Link>
                      <Link to="/balik-av-malzemeleri/igne-jighead/assist-jig-igneleri" className="text-sm block py-1">Assist Jig İğneleri</Link>
                      <Link to="/balik-av-malzemeleri/igne-jighead/uclu-igneler" className="text-sm block py-1">Üçlü İğneler</Link>
                      <Link to="/balik-av-malzemeleri/igne-jighead/firdondu-klips-halkalar" className="text-sm block py-1">Fırdöndü - Klips - Halkalar</Link>
                      <Link to="/balik-av-malzemeleri/igne-jighead/tekli-igneler" className="text-sm block py-1">Tekli İğneler</Link>
                      <Link to="/balik-av-malzemeleri/igne-jighead/ofset-igneler" className="text-sm block py-1">Ofset İğneler</Link>
                    </div>
                  </div>
                  <div className="group col-span-2 xl:col-span-2">
                    <DropdownMenuLabel className="px-0">Aksesuarlar</DropdownMenuLabel>
                    <div className="mt-1 space-y-1 hidden group-hover:block">
                      <Link to="/balik-av-malzemeleri/aksesuarlar/cizmeler-ve-tulum-cizmeler" className="text-sm block py-1">Çizmeler - Tulum</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/samandira-ve-stopler" className="text-sm block py-1">Şamandıra ve Stopler</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/fenerler" className="text-sm block py-1">Fenerler</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/pense-gripper-makas" className="text-sm block py-1">Pense - Gripper - Makas</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/kepce-livar-kakic-tripod" className="text-sm block py-1">Kepçe - Livar - Kakıç - Tripod</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/sisme-yataklar" className="text-sm block py-1">Şişme Yataklar</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/alarm-zil-fosfor-boncuk" className="text-sm block py-1">Alarm - Zil - Fosfor - Boncuk</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/gozlukler" className="text-sm block py-1">Gözlükler</Link>
                      <Link to="/balik-av-malzemeleri/aksesuarlar/digerleri" className="text-sm block py-1">Diğerleri</Link>
                    </div>
                  </div>
                  <div className="group col-span-2 xl:col-span-2">
                    <DropdownMenuLabel className="px-0">Diğer</DropdownMenuLabel>
                    <div className="mt-1 space-y-1 hidden group-hover:block">
                      <Link to="/balik-av-malzemeleri/balikci-kiyafetleri-ve-eldivenler" className="text-sm block py-1">Balıkçı Kıyafetleri ve Eldivenler</Link>
                      <Link to="/balik-av-malzemeleri/canta-ve-kutular" className="text-sm block py-1">Çanta ve Kutular</Link>
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
                  <Link to="/outdoor-giyim" className="font-semibold">Tümünü Gör</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                  <div className="col-span-1 xl:col-span-2 space-y-1">
                    <DropdownMenuLabel className="px-0">Erkek</DropdownMenuLabel>
                    <Link to="/outdoor-giyim/erkek/pantolon" className="text-sm block py-1">Pantolon</Link>
                    <Link to="/outdoor-giyim/erkek/tisort" className="text-sm block py-1">Tişört</Link>
                    <Link to="/outdoor-giyim/erkek/gomlek" className="text-sm block py-1">Gömlek</Link>
                    <Link to="/outdoor-giyim/erkek/mont-ve-ceket" className="text-sm block py-1">Mont ve Ceket</Link>
                    <Link to="/outdoor-giyim/erkek/ayakkabi" className="text-sm block py-1">Ayakkabı</Link>
                    <Link to="/outdoor-giyim/erkek/bot" className="text-sm block py-1">Bot</Link>
                  </div>
                  <div className="col-span-1 xl:col-span-2 space-y-1">
                    <DropdownMenuLabel className="px-0">Kadın</DropdownMenuLabel>
                    <Link to="/outdoor-giyim/kadin/tisort" className="text-sm block py-1">Tişört</Link>
                    <Link to="/outdoor-giyim/kadin/ayakkabi" className="text-sm block py-1">Ayakkabı</Link>
                    <Link to="/outdoor-giyim/kadin/bot" className="text-sm block py-1">Bot</Link>
                    <Link to="/outdoor-giyim/kadin/mont-ve-ceket" className="text-sm block py-1">Mont ve Ceket</Link>
                    <Link to="/outdoor-giyim/kadin/pantolon" className="text-sm block py-1">Pantolon</Link>
                  </div>
                  <div className="col-span-2 xl:col-span-2 space-y-1">
                    <DropdownMenuLabel className="px-0">Aksesuar</DropdownMenuLabel>
                    <Link to="/outdoor-giyim/kadin/canta" className="text-sm block py-1">Çanta</Link>
                    <Link to="/outdoor-giyim/kadin/sapka" className="text-sm block py-1">Şapka</Link>
                    <Link to="/outdoor-giyim/bere" className="text-sm block py-1">Bere</Link>
                    <Link to="/outdoor-giyim/termal-iclik" className="text-sm block py-1">Termal İçlik</Link>
                    <Link to="/outdoor-giyim/erkek/sweatshirts" className="text-sm block py-1">Sweatshirts</Link>
                    <Link to="/outdoor-giyim/erkek/polar" className="text-sm block py-1">Polar</Link>
                    <Link to="/outdoor-giyim/erkek/yelek" className="text-sm block py-1">Yelek</Link>
                    <Link to="/outdoor-giyim/erkek/sort" className="text-sm block py-1">Şort</Link>
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
                  <Link to="/kamp-malzemeleri" className="font-semibold">Tümünü Gör</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                  <div className="col-span-1 xl:col-span-2 space-y-1">
                    <DropdownMenuLabel className="px-0">Pişirme</DropdownMenuLabel>
                    <Link to="/kamp-malzemeleri/kamp-ocagi" className="text-sm block py-1">Kamp Ocağı</Link>
                    <Link to="/kamp-malzemeleri/kartuslar" className="text-sm block py-1">Kartuşlar</Link>
                    <Link to="/kamp-malzemeleri/purmuz" className="text-sm block py-1">Pürmüz</Link>
                    <Link to="/kamp-malzemeleri/kamp-mutfagi" className="text-sm block py-1">Kamp Mutfağı</Link>
                  </div>
                  <div className="col-span-1 xl:col-span-2 space-y-1">
                    <DropdownMenuLabel className="px-0">Barınma & Uyku</DropdownMenuLabel>
                    <Link to="/kamp-malzemeleri/cadirlar" className="text-sm block py-1">Çadırlar</Link>
                    <Link to="/kamp-malzemeleri/uyku-tulumlari" className="text-sm block py-1">Uyku Tulumları</Link>
                    <Link to="/kamp-malzemeleri/sisme-urunler-ve-matlar" className="text-sm block py-1">Şişme Ürünler ve Matlar</Link>
                  </div>
                  <div className="col-span-2 xl:col-span-2 space-y-1">
                    <DropdownMenuLabel className="px-0">Aksesuar</DropdownMenuLabel>
                    <Link to="/kamp-malzemeleri/kamp-cantasi" className="text-sm block py-1">Kamp Çantası</Link>
                    <Link to="/kamp-malzemeleri/aydinlatma" className="text-sm block py-1">Aydınlatma</Link>
                    <Link to="/kamp-malzemeleri/fenerler/kafa-lambasi" className="text-sm block py-1">Kafa Lambası</Link>
                    <Link to="/kamp-malzemeleri/fenerler/el-feneri" className="text-sm block py-1">El Feneri</Link>
                    <Link to="/kamp-malzemeleri/masalar-ve-sandalyeler" className="text-sm block py-1">Masalar ve Sandalyeler</Link>
                    <Link to="/kamp-malzemeleri/cizmeler" className="text-sm block py-1">Çizmeler</Link>
                    <Link to="/kamp-malzemeleri/balta-kurek" className="text-sm block py-1">Balta , Kürek</Link>
                    <Link to="/kamp-malzemeleri/kopek-kovucu" className="text-sm block py-1">Köpek Kovucu</Link>
                    <Link to="/kamp-malzemeleri/kamp-ekipmanlari" className="text-sm block py-1">Kamp Ekipmanları</Link>
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
                  <Link to="/dalis-urunleri" className="font-semibold">Tümünü Gör</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                  <div className="col-span-1 xl:col-span-2 space-y-1">
                    <DropdownMenuLabel className="px-0">Ekipman</DropdownMenuLabel>
                    <Link to="/dalis-urunleri/denge-yelegi-bcd" className="text-sm block py-1">Denge Yeleği (BCD)</Link>
                    <Link to="/dalis-urunleri/dalis-bilgisayari" className="text-sm block py-1">Dalış Bilgisayarı</Link>
                    <Link to="/dalis-urunleri/regulatorler" className="text-sm block py-1">Regülatörler</Link>
                    <Link to="/dalis-urunleri/konsol-pusula-manometre" className="text-sm block py-1">Konsol & Pusula & Manometre</Link>
                    <Link to="/dalis-urunleri/dalis-tup-ve-vanalar" className="text-sm block py-1">Dalış Tüp ve Vanalar</Link>
                  </div>
                  <div className="col-span-1 xl:col-span-2 space-y-1">
                    <DropdownMenuLabel className="px-0">Giyim & Parça</DropdownMenuLabel>
                    <Link to="/dalis-urunleri/dalis-elbise-yelek-shorty" className="text-sm block py-1">Elbise & Yelek & Shorty</Link>
                    <Link to="/dalis-urunleri/patik-eldiven-baslik" className="text-sm block py-1">Patik & Eldiven & Başlık</Link>
                    <Link to="/dalis-urunleri/dalis-cantalari" className="text-sm block py-1">Dalış Çantaları</Link>
                    <Link to="/dalis-urunleri/yedek-parca-ve-aksesuar" className="text-sm block py-1">Yedek Parça ve Aksesuar</Link>
                  </div>
                  <div className="col-span-2 xl:col-span-2 space-y-1">
                    <DropdownMenuLabel className="px-0">Av & Aksesuar</DropdownMenuLabel>
                    <Link to="/dalis-urunleri/zepkin-modelleri" className="text-sm block py-1">Zıpkın Modelleri</Link>
                    <Link to="/dalis-urunleri/zipkin-yedek-parcalari" className="text-sm block py-1">Zıpkın Yedek Parçaları</Link>
                    <Link to="/dalis-urunleri/dalis-yuzucu-paletleri" className="text-sm block py-1">Dalış & Yüzücü Paletleri</Link>
                    <Link to="/dalis-urunleri/maske-snorkel-gozluk" className="text-sm block py-1">Maske & Şnorkel & Gözlük</Link>
                    <Link to="/dalis-urunleri/dalis-bicak-ve-makaslar" className="text-sm block py-1">Dalış Bıçak ve Makaslar</Link>
                    <Link to="/dalis-urunleri/dalis-samandiralari" className="text-sm block py-1">Dalış Şamandıraları</Link>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Termoslar ve Mataralar - re-added as neutral link */}
            <Link to="/termoslar-ve-mataralar" className="text-foreground hover:text-primary transition-smooth font-medium px-4 py-2">
              Termoslar ve Mataralar
            </Link>

            {/* Spor Malzemeleri - new menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium">
                  Spor Malzemeleri
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card z-50 p-3">
                <DropdownMenuItem asChild><Link to="/spor-malzemeleri/toplar" className="w-full">Toplar</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/spor-malzemeleri/fitness-bantlari" className="w-full">Fitness Bantları</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/spor-malzemeleri/saha-ekipmanlari" className="w-full">Saha Ekipmanları</Link></DropdownMenuItem>
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