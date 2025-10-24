import React from 'react';
import { Truck, Shield, RotateCcw, Zap } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    {
      icon: Truck,
      title: 'Ücretsiz Kargo',
      description: '500₺ üzeri siparişlerde',
    },
    {
      icon: Shield,
      title: 'Güvenli Ödeme',
      description: '256-bit SSL sertifikası',
    },
    {
      icon: RotateCcw,
      title: '14 Gün İade',
      description: 'Koşulsuz iade garantisi',
    },
    {
      icon: Zap,
      title: 'Hızlı Teslimat',
      description: '24 saat içinde kargoda',
    },
  ];

  return (
    <section className="py-6 md:py-8 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left"
            >
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <badge.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm md:text-base mb-0.5">
                  {badge.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
