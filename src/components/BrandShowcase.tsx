import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const BrandShowcase = () => {
  const brands = [
    { name: 'Daiwa', logo: '🎯', description: 'Japonya\'nın en prestijli balık malzemeleri markası' },
    { name: 'Shimano', logo: '⚙️', description: 'Dünya çapında tanınan kalite ve inovasyon' },
    { name: 'Okuma', logo: '🎣', description: 'Profesyonel balıkçıların tercihi' },
    { name: 'Penn', logo: '🌊', description: 'Deniz balıkçılığında güvenilir partner' },
    { name: 'Abu Garcia', logo: '🏆', description: 'İsveç kalitesi ve dayanıklılık' },
    { name: 'Savage Gear', logo: '🦈', description: 'Yırtıcı balık avında uzman' }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Dünya Markalarıyla Çalışıyoruz
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            En güvenilir ve kaliteli markaların ürünlerini sizlere sunuyoruz. 
            Her marka kendine özel uzmanlık alanında liderdir.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {brands.map((brand, index) => (
            <Card key={index} className="gradient-card border-border hover-glow transition-smooth cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {brand.logo}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{brand.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {brand.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Brand banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="gradient-primary text-primary-foreground hover-lift cursor-pointer overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Daiwa Collection</h3>
              <p className="text-primary-foreground/80">Profesyonel olta makineleri ve kamışları</p>
            </CardContent>
          </Card>

          <Card className="gradient-accent text-accent-foreground hover-lift cursor-pointer overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold mb-2">Shimano Series</h3>
              <p className="text-accent-foreground/80">Yüksek performanslı balık malzemeleri</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-border hover-lift cursor-pointer overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">Premium Brands</h3>
              <p className="text-muted-foreground">Tüm premium markaları keşfedin</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;