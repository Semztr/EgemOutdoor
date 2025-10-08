import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-fishing.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Professional fishing equipment" 
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">4.9/5 Müşteri Memnuniyeti</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Kişiye Özel
            <span className="gradient-primary bg-clip-text text-transparent block">
              Outdoor Ürünleri
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Profesyonel outdoor ve balıkçılık ekipmanları. Kaliteli ve kişiye özel 
            ürünlerle doğada kendinizi güvende hissedin.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link to="/urunler">
              <Button variant="hero" size="xl" className="group">
                Ürünleri Keşfet
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/kisiye-ozel-teklif">
              <Button variant="outline" size="xl">
                Kişiye Özel Teklif Al
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">1000+</div>
              <div className="text-sm text-muted-foreground">Mutlu Müşteri</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Özel Ürün</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">15+</div>
              <div className="text-sm text-muted-foreground">Yıl Deneyim</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 right-10 opacity-20">
        <div className="text-6xl">🎣</div>
      </div>
    </section>
  );
};

export default Hero;