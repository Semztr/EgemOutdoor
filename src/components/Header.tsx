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
            <div className="gradient-primary p-2 rounded-lg">
              <div className="text-primary-foreground font-bold text-xl">🎣</div>
            </div>
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
              <DropdownMenuContent className="w-56 bg-card z-50">
                <DropdownMenuItem asChild>
                  <Link to="/balik-av-malzemeleri" className="font-semibold">
                    Tümünü Gör
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Oltalar</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card">
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Spinning Oltaları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Casting Oltaları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Teleskopik Oltalar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Jigging Oltaları</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Makaralar</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card">
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Spinning Makaralar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Casting Makaralar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Surf Casting Makaralar</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Yemler & İğneler</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card">
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Suni Yemler</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Silikon Yemler</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Jig Başları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">İğne Setleri</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Kurşunlar</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Misina & Örgü İp</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Balık Çantaları</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Kepçe & Sap</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/balik-av-malzemeleri">Aksesuarlar</Link></DropdownMenuItem>
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
              <DropdownMenuContent className="w-56 bg-card z-50">
                <DropdownMenuItem asChild>
                  <Link to="/outdoor-giyim" className="font-semibold">
                    Tümünü Gör
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Mont & Ceket</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card">
                    <DropdownMenuItem asChild><Link to="/outdoor-giyim">Yağmurluk</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/outdoor-giyim">Softshell Ceketler</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/outdoor-giyim">Hardshell Ceketler</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/outdoor-giyim">Polar Ceketler</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/outdoor-giyim">Şişme Montlar</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Pantolon</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card">
                    <DropdownMenuItem asChild><Link to="/outdoor-giyim">Trekking Pantolonları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/outdoor-giyim">Yağmurluk Pantolonlar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/outdoor-giyim">Kargo Pantolonlar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/outdoor-giyim">Termal Taytlar</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Ayakkabı & Bot</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card">
                    <DropdownMenuItem asChild><Link to="/outdoor-giyim">Trekking Ayakkabıları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/outdoor-giyim">Dağcılık Botları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/outdoor-giyim">Su Geçirmez Botlar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/outdoor-giyim">Yaklaşım Ayakkabıları</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem asChild><Link to="/outdoor-giyim">Yelek</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim">Şapka & Bone</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim">Eldiven</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim">Çorap</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/outdoor-giyim">Termal İçlik</Link></DropdownMenuItem>
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
              <DropdownMenuContent className="w-56 bg-card z-50">
                <DropdownMenuItem asChild>
                  <Link to="/kamp-malzemeleri" className="font-semibold">
                    Tümünü Gör
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Çadırlar</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card">
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Kamp Çadırları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Dağcılık Çadırları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Plaj Çadırları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Pavyonlar</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Uyku Ekipmanları</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card">
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Uyku Tulumları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Kamp Yatakları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">İzolasyon Matları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Yastıklar</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Kamp Mutfağı</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card">
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Kamp Ocakları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Kamp Tüpleri</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Yemek Setleri</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Taşınabilir Griller</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Matara & Termos</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Aydınlatma</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Sandalye & Masa</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Sırt Çantası</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/kamp-malzemeleri">Soğutucu & Buzluk</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Çakı & Bıçak */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium">
                  Çakı & Bıçak
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card z-50">
                <DropdownMenuItem asChild>
                  <Link to="/caki-bicak" className="font-semibold">
                    Tümünü Gör
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Çakılar</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card">
                    <DropdownMenuItem asChild><Link to="/caki-bicak">İsviçre Çakıları</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/caki-bicak">Klasik Çakılar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/caki-bicak">Tactical Çakılar</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Sabit Bıçak</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card">
                    <DropdownMenuItem asChild><Link to="/caki-bicak">Survival Bıçaklar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/caki-bicak">Bushcraft Bıçaklar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/caki-bicak">Tactical Bıçaklar</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Katlanır Bıçak</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-card">
                    <DropdownMenuItem asChild><Link to="/caki-bicak">EDC Bıçaklar</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/caki-bicak">Tactical Katlanır</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/caki-bicak">Gentleman Bıçaklar</Link></DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem asChild><Link to="/caki-bicak">Multitool</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/caki-bicak">Av Bıçakları</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/caki-bicak">Bıçak Bileme</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/caki-bicak">Kılıf & Aksesuarlar</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/kisiye-ozel" className="text-primary hover:text-primary-glow transition-smooth font-medium px-4 py-2">
              Kişiye Özel
            </Link>

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