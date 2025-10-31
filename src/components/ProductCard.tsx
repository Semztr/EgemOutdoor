import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/format';
import { ProductCardProps, BADGE_CONFIG, calculateDiscount } from '@/types/product';

interface ProductCardComponentProps extends ProductCardProps {
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

/**
 * Reusable Product Card Component
 * Supports badges, favorites, add to cart, and responsive design
 */
export const ProductCard: React.FC<ProductCardComponentProps> = ({
  id,
  name,
  brand,
  description,
  price,
  originalPrice,
  image,
  badge,
  badges = [],
  inStock = true,
  className = '',
  loading = 'lazy',
  priority = false,
}) => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock) {
      toast({
        title: 'Ürün stokta yok',
        description: 'Bu ürün şu anda stokta bulunmuyor.',
        variant: 'destructive',
      });
      return;
    }

    addItem({
      id: Number(id),
      name,
      price,
      image,
      brand,
    });

    toast({
      title: 'Ürün sepete eklendi! ✅',
      description: `${name} sepetinize eklendi.`,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const displayBadges = badges && badges.length > 0 ? badges : (badge ? [badge] : []);
  const discountPercentage = originalPrice ? calculateDiscount(originalPrice, price) : 0;

  return (
    <Card 
      className={`gradient-card border-border group relative overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col ${className}`}
    >
      {/* Badges - Top Right */}
      {displayBadges.length > 0 && (
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
          {displayBadges.map((badgeType, index) => {
            const config = BADGE_CONFIG[badgeType];
            if (!config) return null;
            return (
              <span 
                key={index} 
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm ${config.color}`}
                role="status"
                aria-label={config.label}
              >
                {config.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Favorite Button - Top Left */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur hover:bg-background h-8 w-8"
        onClick={handleToggleFavorite}
        aria-label={isFavorite(id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isFavorite(id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
          }`}
        />
      </Button>

      <CardContent className="p-2 md:p-3 flex flex-col h-full">
        {/* Product Image */}
        <Link 
          to={`/urun/${id}`} 
          onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
          aria-label={`${name} ürün detayına git`}
        >
          <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
            <img
              src={image}
              alt={`${name} - ${brand}`}
              loading={loading}
              decoding={priority ? 'sync' : 'async'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.dataset.fallback !== '1') {
                  target.dataset.fallback = '1';
                  target.src = '/placeholder.svg';
                  target.alt = 'Görsel yüklenemedi';
                }
              }}
            />
          </div>
        </Link>

        {/* Brand */}
        {brand && (
          <div className="text-[11px] text-primary font-medium mb-1 truncate">
            {brand}
          </div>
        )}

        {/* Product Name */}
        <Link 
          to={`/urun/${id}`} 
          onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
        >
          <h3 className="font-semibold text-foreground mb-1 line-clamp-2 min-h-[32px] group-hover:text-primary transition-colors text-xs md:text-sm">
            {name}
          </h3>
        </Link>

        {/* Description */}
        {description && (
          <div className="min-h-[32px] mb-2">
            <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
        )}

        {/* Price and Buttons - Bottom */}
        <div className="mt-auto flex flex-col gap-2">
          {/* Price */}
          <div className="flex items-center gap-1.5 flex-wrap min-h-[28px]">
            {originalPrice && originalPrice > price ? (
              <>
                <span className="text-xs text-muted-foreground line-through">
                  ₺{formatPrice(originalPrice)}
                </span>
                <span className="text-base md:text-lg font-bold text-red-600 dark:text-red-500">
                  ₺{formatPrice(price)}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-xs font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-2 py-0.5 rounded">
                    %{discountPercentage}
                  </span>
                )}
              </>
            ) : (
              <span className="text-base md:text-lg font-bold text-primary">
                ₺{formatPrice(price)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1 text-xs h-9 min-w-[44px] min-h-[44px] md:h-10"
              onClick={handleAddToCart}
              disabled={!inStock}
              aria-label={`${name} ürünü sepete ekle`}
            >
              <ShoppingCart className="h-4 w-4 mr-1" aria-hidden="true" />
              <span className="hidden sm:inline">Sepete</span>
              <span className="sm:hidden">+</span>
            </Button>
            <Link 
              to={`/urun/${id}`} 
              onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-9 min-w-[44px] min-h-[44px] md:h-10 px-3"
                aria-label={`${name} ürün detayını incele`}
              >
                İncele
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
