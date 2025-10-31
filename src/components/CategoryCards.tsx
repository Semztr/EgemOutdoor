import React from 'react';
import { Link } from 'react-router-dom';
import { Fish, Tent, Shirt, Waves, CupSoda, Dumbbell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const CategoryCards = () => {
  const categories = [
    {
      name: 'Balık Av Malzemeleri',
      slug: 'balik-av-malzemeleri',
      icon: Fish,
      color: 'from-blue-500 to-cyan-500',
      count: '450+',
    },
    {
      name: 'Outdoor Giyim',
      slug: 'outdoor-giyim',
      icon: Shirt,
      color: 'from-green-500 to-emerald-500',
      count: '300+',
    },
    {
      name: 'Kamp Malzemeleri',
      slug: 'kamp-malzemeleri',
      icon: Tent,
      color: 'from-orange-500 to-amber-500',
      count: '250+',
    },
    {
      name: 'Dalış Ürünleri',
      slug: 'dalis-urunleri',
      icon: Waves,
      color: 'from-indigo-500 to-blue-500',
      count: '150+',
    },
    {
      name: 'Termoslar',
      slug: 'termoslar-mataralar',
      icon: CupSoda,
      color: 'from-red-500 to-pink-500',
      count: '100+',
    },
    {
      name: 'Spor Malzemeleri',
      slug: 'spor-malzemeleri',
      icon: Dumbbell,
      color: 'from-purple-500 to-violet-500',
      count: '120+',
    },
  ];

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Kategorilere Göz Atın
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            İhtiyacınız olan her şey bir tık uzağınızda
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/${category.slug}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border overflow-hidden h-full">
                <CardContent className="p-4 md:p-5 text-center">
                  {/* Icon with gradient background */}
                  <div className="relative mb-3 md:mb-4">
                    <div className={`w-14 h-14 md:w-16 md:h-16 mx-auto rounded-2xl bg-gradient-to-br ${category.color} p-3 md:p-3.5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <category.icon className="w-full h-full text-white" />
                    </div>
                  </div>

                  {/* Category name */}
                  <h3 className="font-semibold text-foreground text-xs md:text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2 min-h-[32px] md:min-h-[36px]">
                    {category.name}
                  </h3>

                  {/* Product count */}
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    {category.count} Ürün
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
