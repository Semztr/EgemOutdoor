import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedProducts from '@/components/FeaturedProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

const Products = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Search Header */}
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Tüm Ürünler</h1>
              <p className="text-lg text-muted-foreground">
                Balıkçılık ve outdoor yaşam için ihtiyacınız olan tüm ürünleri keşfedin
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Ürün ara..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <FeaturedProducts />
        
        {/* Categories Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Popüler Kategoriler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: "Olta Kamışı", icon: "🎣", count: 156 },
                { name: "Makara", icon: "⚙️", count: 89 },
                { name: "Yem & Oltalar", icon: "🪝", count: 234 },
                { name: "Balık Çantası", icon: "🎒", count: 67 },
                { name: "Outdoor Kıyafet", icon: "👕", count: 145 },
                { name: "Kamp Malzemeleri", icon: "🏕️", count: 123 }
              ].map((category, index) => (
                <div key={index} className="text-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-foreground mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} ürün</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;