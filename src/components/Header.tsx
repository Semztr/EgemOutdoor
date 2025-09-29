import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import SearchAutocomplete from '@/components/SearchAutocomplete';

const Header = () => {
  const { state } = useCart();
  const navigate = useNavigate();
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
            <span>0262 321 6 314</span>
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
            <Link to="/giris">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <User className="h-4 w-4" />
                <span>Üye Girişi</span>
              </Button>
            </Link>
            
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
          <div className="flex items-center justify-center space-x-8 text-sm">
            <Link to="/balik-av-malzemeleri" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-foreground hover:text-primary transition-smooth font-medium">
              Balık Av Malzemeleri
            </Link>
            <Link to="/outdoor-giyim" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-foreground hover:text-primary transition-smooth font-medium">
              Outdoor Giyim
            </Link>
            <Link to="/kamp-malzemeleri" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-foreground hover:text-primary transition-smooth font-medium">
              Kamp Malzemeleri
            </Link>
            <Link to="/caki-bicak" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-foreground hover:text-primary transition-smooth font-medium">
              Çakı & Bıçak
            </Link>
            <Link to="/kisiye-ozel" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-primary hover:text-primary-glow transition-smooth font-medium">
              Kişiye Özel
            </Link>
            <Link to="/urun-kategorileri" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-foreground hover:text-primary transition-smooth font-medium">
              Ürün Kategorileri
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;