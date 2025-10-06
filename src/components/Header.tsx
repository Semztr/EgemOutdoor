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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

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
          <NavigationMenu className="mx-auto" delayDuration={150}>
            <NavigationMenuList className="space-x-6">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-primary font-medium">
                  Balık Av Malzemeleri
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-48 p-2 bg-card">
                    <Link 
                      to="/balik-av-malzemeleri" 
                      className="block px-4 py-2 text-sm hover:bg-muted rounded font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Tümünü Gör
                    </Link>
                    <Link to="/balik-av-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Oltalar
                    </Link>
                    <Link to="/balik-av-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Makaralar
                    </Link>
                    <Link to="/balik-av-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Misina & İp
                    </Link>
                    <Link to="/balik-av-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Yemler
                    </Link>
                    <Link to="/balik-av-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      İğneler & Kurşunlar
                    </Link>
                    <Link to="/balik-av-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Balık Çantaları
                    </Link>
                    <Link to="/balik-av-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Kepçe & Sap
                    </Link>
                    <Link to="/balik-av-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Aksesuarlar
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-primary font-medium">
                  Outdoor Giyim
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-48 p-2 bg-card">
                    <Link to="/outdoor-giyim" className="block px-4 py-2 text-sm hover:bg-muted rounded font-semibold" onClick={(e) => e.stopPropagation()}>
                      Tümünü Gör
                    </Link>
                    <Link to="/outdoor-giyim" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Mont & Ceket
                    </Link>
                    <Link to="/outdoor-giyim" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Pantolon
                    </Link>
                    <Link to="/outdoor-giyim" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Yelek
                    </Link>
                    <Link to="/outdoor-giyim" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Ayakkabı & Bot
                    </Link>
                    <Link to="/outdoor-giyim" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Şapka & Bone
                    </Link>
                    <Link to="/outdoor-giyim" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Eldiven
                    </Link>
                    <Link to="/outdoor-giyim" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Çorap
                    </Link>
                    <Link to="/outdoor-giyim" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Termal İçlik
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-primary font-medium">
                  Kamp Malzemeleri
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-48 p-2 bg-card">
                    <Link to="/kamp-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded font-semibold" onClick={(e) => e.stopPropagation()}>
                      Tümünü Gör
                    </Link>
                    <Link to="/kamp-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Çadırlar
                    </Link>
                    <Link to="/kamp-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Uyku Tulumu
                    </Link>
                    <Link to="/kamp-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Matara & Termos
                    </Link>
                    <Link to="/kamp-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Aydınlatma
                    </Link>
                    <Link to="/kamp-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Kamp Mutfağı
                    </Link>
                    <Link to="/kamp-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Sandalye & Masa
                    </Link>
                    <Link to="/kamp-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Sırt Çantası
                    </Link>
                    <Link to="/kamp-malzemeleri" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Soğutucu & Buzluk
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-primary font-medium">
                  Çakı & Bıçak
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-48 p-2 bg-card">
                    <Link to="/caki-bicak" className="block px-4 py-2 text-sm hover:bg-muted rounded font-semibold" onClick={(e) => e.stopPropagation()}>
                      Tümünü Gör
                    </Link>
                    <Link to="/caki-bicak" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Çakılar
                    </Link>
                    <Link to="/caki-bicak" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Sabit Bıçak
                    </Link>
                    <Link to="/caki-bicak" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Katlanır Bıçak
                    </Link>
                    <Link to="/caki-bicak" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Multitool
                    </Link>
                    <Link to="/caki-bicak" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Av Bıçakları
                    </Link>
                    <Link to="/caki-bicak" className="block px-4 py-2 text-sm hover:bg-muted rounded" onClick={(e) => e.stopPropagation()}>
                      Bıçak Aksesuarları
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/kisiye-ozel" className="text-primary hover:text-primary-glow transition-smooth font-medium inline-flex items-center justify-center h-10 px-4 py-2">
                  Kişiye Özel
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/urun-kategorileri" className="text-foreground hover:text-primary transition-smooth font-medium inline-flex items-center justify-center h-10 px-4 py-2">
                  Ürün Kategorileri
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>
    </header>
  );
};

export default Header;