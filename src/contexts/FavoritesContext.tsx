import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load favorites when user logs in
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) {
        console.warn('Favoriler yüklenemedi:', error);
        return;
      }

      setFavorites(data?.map((f: any) => f.product_id) || []);
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.includes(productId);
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast({
        title: 'Giriş Yapın',
        description: 'Favorilere eklemek için giriş yapmalısınız.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const isCurrentlyFavorite = isFavorite(productId);

      if (isCurrentlyFavorite) {
        // Remove from favorites
        const { error } = await (supabase as any)
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;

        setFavorites(favorites.filter(id => id !== productId));
        toast({
          title: 'Favorilerden Çıkarıldı',
          description: 'Ürün favorilerinizden çıkarıldı.',
        });
      } else {
        // Add to favorites
        const { error } = await (supabase as any)
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: productId,
          });

        if (error) throw error;

        setFavorites([...favorites, productId]);
        toast({
          title: 'Favorilere Eklendi',
          description: 'Ürün favorilerinize eklendi.',
        });
      }
    } catch (error: any) {
      console.error('Favori işlemi hatası:', error);
      toast({
        title: 'Hata',
        description: error.message || 'Favori işlemi başarısız oldu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
