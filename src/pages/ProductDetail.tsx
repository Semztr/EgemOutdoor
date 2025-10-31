import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft, Share2, Check, MessageCircle, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/format';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { siteCategories } from '@/data/categories';

// Renk isimlerini hex kodlarına çeviren fonksiyon
const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    // Temel Renkler
    'Siyah': '#000000',
    'Beyaz': '#FFFFFF',
    'Kırmızı': '#FF0000',
    'Sarı': '#FFD700',
    
    // Mavi Tonları
    'Mavi': '#0066CC',
    'Açık Mavi': '#87CEEB',
    'Lacivert': '#000080',
    'Lacivert Mavi': '#191970',
    'Turkuaz': '#40E0D0',
    
    // Yeşil Tonları
    'Yeşil': '#00AA00',
    'Açık Yeşil': '#90EE90',
    'Koyu Yeşil': '#006400',
    'Neon Yeşil': '#39FF14',
    'Mint': '#98FF98',
    
    // Turuncu Tonları
    'Turuncu': '#FF8C00',
    'Koyu Turuncu': '#FF6600',
    'Neon Turuncu': '#FF6600',
    'Hardal': '#FFDB58',
    
    // Gri Tonları
    'Gri': '#808080',
    'Açık Gri': '#D3D3D3',
    'Koyu Gri': '#404040',
    'Antrasit': '#2F4F4F',
    'Füme': '#696969',
    
    // Kahverengi Tonları
    'Kahverengi': '#8B4513',
    'Açık Kahverengi': '#CD853F',
    'Koyu Kahverengi': '#654321',
    'Bej': '#F5F5DC',
    
    // Diğer Renkler
    'Mor': '#800080',
    'Pembe': '#FFC0CB',
    'Açık Pembe': '#FFB6C1',
    'Bordo': '#800020',
    
    // Kamuflaj & Özel
    'Kamuflaj': '#78866B',
    'Haki': '#C3B091',
    'Yeşil Kamuflaj': '#4B5320',
    
    // Neon Renkler
    'Neon Sarı': '#FFFF00',
    
    // Metalik Renkler
    'Metalik Gri': '#BCC6CC',
    'Metalik Siyah': '#2C3539',
    
    // Özel
    'Şeffaf': '#FFFFFF00',
    'Beyaz/Siyah': 'linear-gradient(90deg, #FFFFFF 50%, #000000 50%)',
    'Siyah/Beyaz': 'linear-gradient(90deg, #000000 50%, #FFFFFF 50%)',
    'Çok Renkli': 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)',
  };
  
  return colorMap[colorName] || '#CCCCCC'; // Varsayılan gri
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedShoeSize, setSelectedShoeSize] = useState('');
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageModal, setImageModal] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePan, setImagePan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  // Scroll to top on product change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [productId]);

  // Fetch product from Supabase
  useEffect(() => {
    let ignore = false;
    const loadProduct = async () => {
      if (!productId) { 
        setError('Ürün ID bulunamadı');
        setLoading(false); 
        return; 
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId as string)
          .single();

        if (!ignore) {
          if (error || !data) {
            if (import.meta.env.DEV) {
              console.error('[ProductDetail] Product not found:', error);
            }
            setError('Ürün bulunamadı');
            setProduct(null);
          } else {
            // Safely parse colors with proper color mapping
            let normalizedColors: Array<{ name: string; value: string; available: boolean }> = [];
            try {
              const colorsRaw = (data as any).colors;
              if (Array.isArray(colorsRaw) && colorsRaw.length > 0) {
                normalizedColors = colorsRaw.map((c: any) => {
                  if (typeof c === 'string') {
                    // Renk isimlerini hex kodlarına çevir
                    const colorMap: Record<string, string> = {
                      'Siyah': '#000000', 'Black': '#000000',
                      'Beyaz': '#FFFFFF', 'White': '#FFFFFF',
                      'Kırmızı': '#DC2626', 'Red': '#DC2626',
                      'Mavi': '#2563EB', 'Blue': '#2563EB',
                      'Yeşil': '#16A34A', 'Green': '#16A34A',
                      'Sarı': '#EAB308', 'Yellow': '#EAB308',
                      'Turuncu': '#EA580C', 'Orange': '#EA580C',
                      'Mor': '#9333EA', 'Purple': '#9333EA',
                      'Pembe': '#EC4899', 'Pink': '#EC4899',
                      'Gri': '#6B7280', 'Gray': '#6B7280',
                      'Kahverengi': '#92400E', 'Brown': '#92400E',
                      'Lacivert': '#1E3A8A', 'Navy': '#1E3A8A',
                      'Kamuflaj': '#4B5320', 'Camo': '#4B5320',
                      'Haki': '#8B7355', 'Khaki': '#8B7355',
                      'Antrasit': '#374151', 'Anthracite': '#374151',
                      'Bej': '#D4A574', 'Beige': '#D4A574',
                      'Bordo': '#800020', 'Burgundy': '#800020',
                      'Yeşil Kamuflaj': '#556B2F', 'Green Camo': '#556B2F',
                    };
                    const colorValue = colorMap[c] || colorMap[c.toLowerCase()] || '#6B7280';
                    return { name: c, value: colorValue, available: true };
                  }
                  return c;
                });
              }
            } catch (err) {
              if (import.meta.env.DEV) {
                console.warn('[ProductDetail] Error parsing colors:', err);
              }
            }

            // Safely parse features - always convert to string array
            let features: string[] = [];
            try {
              const featuresRaw = (data as any).features;
              if (Array.isArray(featuresRaw)) {
                // Legacy format: direct array
                features = featuresRaw
                  .filter(f => f && typeof f === 'string' && f.trim().length > 0)
                  .map(f => f.trim());
              } else if (featuresRaw && typeof featuresRaw === 'object') {
                // New format: object with 'items' array (from admin panel)
                if (Array.isArray(featuresRaw.items)) {
                  features = featuresRaw.items
                    .filter((f: any) => f && typeof f === 'string' && f.trim().length > 0)
                    .map((f: string) => f.trim());
                } else {
                  // Very old format: object with key-value pairs
                  // Filter out technical fields that shouldn't be in features
                  const excludeKeys = ['items', 'best_seller', 'new_arrival', 'is_active', 'created_at', 'updated_at', 'id', 'user_id', 'agirlik'];
                  features = Object.entries(featuresRaw)
                    .filter(([key]) => !excludeKeys.includes(key))
                    .map(([key, value]) => `${key}: ${value}`);
                }
              }
            } catch (err) {
              if (import.meta.env.DEV) {
                console.warn('[ProductDetail] Error parsing features:', err);
              }
            }

            // Safely parse images
            let images: string[] = [];
            let colorImages: Record<string, { main: string; extra: string[] }> = {};
            let mainImageUrl = data.image_url;
            
            try {
              // Renk bazlı görselleri parse et
              const colorImagesRaw = (data as any).color_images;
              if (colorImagesRaw && typeof colorImagesRaw === 'object') {
                colorImages = colorImagesRaw;
                
                // Ana görsel yoksa, ilk rengin ana görselini kullan
                if (!mainImageUrl && Object.keys(colorImages).length > 0) {
                  const firstColor = Object.keys(colorImages)[0];
                  if (colorImages[firstColor]?.main) {
                    mainImageUrl = colorImages[firstColor].main;
                  }
                }
              }
              
              // Ana görseli ekle
              if (mainImageUrl) {
                images = [mainImageUrl];
              }
              
              // Ek görselleri ekle
              const extraImages = (data as any).extra_images;
              if (Array.isArray(extraImages) && extraImages.length > 0) {
                images = [...images, ...extraImages];
              }
              
              // Placeholder yoksa ekle
              if (images.length === 0) {
                images = ['/placeholder.svg'];
              }
            } catch (err) {
              if (import.meta.env.DEV) {
                console.warn('[ProductDetail] Error parsing images:', err);
              }
              images = ['/placeholder.svg'];
            }

            // Parse technical specs
            let technicalSpecs: Record<string, string> = {};
            try {
              const specsRaw = (data as any).technical_specs;
              if (import.meta.env.DEV) {
                console.log('[ProductDetail] Raw technical_specs from DB:', specsRaw, 'Type:', typeof specsRaw);
              }
              
              if (specsRaw && typeof specsRaw === 'object' && !Array.isArray(specsRaw)) {
                technicalSpecs = specsRaw;
                if (import.meta.env.DEV) {
                  console.log('[ProductDetail] Parsed technical_specs:', technicalSpecs);
                }
              } else if (import.meta.env.DEV) {
                console.warn('[ProductDetail] technical_specs is not a valid object:', specsRaw);
              }
            } catch (err) {
              if (import.meta.env.DEV) {
                console.error('[ProductDetail] Error parsing technical_specs:', err);
              }
            }

            // Parse sizes
            let sizes: string[] = [];
            try {
              const sizesRaw = (data as any).sizes;
              if (Array.isArray(sizesRaw)) {
                sizes = sizesRaw;
              }
            } catch (err) {
              if (import.meta.env.DEV) {
                console.warn('[ProductDetail] Error parsing sizes:', err);
              }
            }

            // Parse shoe_sizes
            let shoeSizes: string[] = [];
            try {
              const shoeSizesRaw = (data as any).shoe_sizes;
              if (Array.isArray(shoeSizesRaw)) {
                shoeSizes = shoeSizesRaw;
              }
            } catch (err) {
              if (import.meta.env.DEV) {
                console.warn('[ProductDetail] Error parsing shoe_sizes:', err);
              }
            }

            // Parse badges array
            let badges: string[] = [];
            try {
              const badgesRaw = (data as any).badges;
              if (Array.isArray(badgesRaw)) {
                badges = badgesRaw;
              } else if ((data as any).badge) {
                // Backward compatibility: badge string -> badges array
                badges = [(data as any).badge];
              }
            } catch (err) {
              if (import.meta.env.DEV) {
                console.warn('[ProductDetail] Error parsing badges:', err);
              }
            }

            setProduct({
              id: data.id,
              name: data.name || 'Ürün',
              brand: data.brand ?? '',
              category: (data as any).category ?? '',
              price: data.price || 0,
              originalPrice: (data as any).original_price ?? null,
              images: images,
              badges: badges,
              inStock: (data.stock_quantity ?? 0) > 0 && (data.is_active ?? true),
              colors: normalizedColors,
              sizes: sizes,
              shoeSizes: shoeSizes,
              specs: (data as any).specs ?? [],
              description: data.description && data.description.trim() ? data.description : 'Ürün açıklaması bulunmamaktadır.',
              features: features,
              technicalSpecs: technicalSpecs,
              colorImages: colorImages, // Yukarıda parse ettiğimiz colorImages'ı kullan
            });
            
            if (import.meta.env.DEV) {
              console.log('[ProductDetail] Product loaded with colorImages:', colorImages);
            }
            
            // İlk görseli belirle - image_url'yi (ana görseli) göster
            // Renk görselleri varsa ve ilk renk için görsel varsa, o gösterilecek (renk effect'inde)
            // Ama başlangıçta her zaman image_url (index 0) gösterilmeli
            setSelectedImage(0);
            setError(null);
            setLoading(false);
          }
        }
      } catch (err: any) {
        if (!ignore) {
          if (import.meta.env.DEV) {
            console.error('Product load error:', err);
          }
          setError(err.message || 'Ürün yüklenirken bir hata oluştu');
          setLoading(false);
        }
      }
    };

    loadProduct();
    return () => { ignore = true; };
  }, [productId]);

  // Set default color and update images when color changes
  useEffect(() => {
    if (product?.colors?.length) {
      if (!selectedColor) {
        const firstColor = product.colors[0].name;
        setSelectedColor(firstColor);
      }
      
      // Renk seçildiğinde ilgili rengin görsellerini göster
      if (selectedColor && product.colorImages && product.colorImages[selectedColor]) {
        const colorImageData = product.colorImages[selectedColor];
        
        // Renk için ana görsel varsa, onu göster
        if (colorImageData.main) {
          // Görseller listesini güncelle: renk ana görseli + renk ek görselleri + diğer görseller
          const newImages: string[] = [colorImageData.main];
          
          // Renk ek görselleri ekle
          if (Array.isArray(colorImageData.extra) && colorImageData.extra.length > 0) {
            newImages.push(...colorImageData.extra);
          }
          
          // Diğer görselleri de ekle (tekrar eklemeden)
          product.images.forEach((img: string) => {
            if (!newImages.includes(img)) {
              newImages.push(img);
            }
          });
          
          // Product state'ini güncelle
          setProduct((prev: any) => ({
            ...prev,
            images: newImages
          }));
          
          // İlk görseli göster
          setSelectedImage(0);
          
          if (import.meta.env.DEV) {
            console.log('[ProductDetail] Color changed to:', selectedColor, 'Images updated:', newImages);
          }
        }
      }
    }
  }, [selectedColor, product?.colors]);

  // Set default size
  useEffect(() => {
    if (product?.sizes?.length && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedSize]);

  // Reset zoom when modal closes or image changes
  useEffect(() => {
    if (!imageModal) {
      setImageZoom(1);
      setImagePan({ x: 0, y: 0 });
    }
  }, [imageModal]);

  useEffect(() => {
    setImageZoom(1);
    setImagePan({ x: 0, y: 0 });
  }, [selectedImage]);

  // Keyboard navigation for image modal
  useEffect(() => {
    if (!imageModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setImageModal(false);
      } else if (e.key === 'ArrowLeft' && product?.images?.length > 1) {
        setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight' && product?.images?.length > 1) {
        setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageModal, product]);

  // Renk değiştiğinde görseli değiştir
  useEffect(() => {
    if (selectedColor && product?.colorImages) {
      if (import.meta.env.DEV) {
        console.log('[ProductDetail] Color changed:', selectedColor);
        console.log('[ProductDetail] Available colorImages:', product.colorImages);
        console.log('[ProductDetail] All images:', product.images);
      }
      
      // colorImages: { "Siyah": "url1.jpg", "Beyaz": "url2.jpg", "Mavi": "url3.jpg" }
      const colorImage = product.colorImages[selectedColor];
      if (import.meta.env.DEV) {
        console.log('[ProductDetail] Color image for', selectedColor, ':', colorImage);
      }
      
      if (colorImage) {
        // Renk görseli varsa, onu ana görsel yap
        const colorImageIndex = product.images.findIndex((img: string) => img === colorImage);
        if (import.meta.env.DEV) {
          console.log('[ProductDetail] Color image index:', colorImageIndex);
        }
        
        if (colorImageIndex !== -1) {
          setSelectedImage(colorImageIndex);
          if (import.meta.env.DEV) {
            console.log('[ProductDetail] Changed to image index:', colorImageIndex);
          }
        } else if (import.meta.env.DEV) {
          console.warn('[ProductDetail] Color image not found in images array');
        }
      } else if (import.meta.env.DEV) {
        console.warn('[ProductDetail] No image found for color:', selectedColor);
      }
    }
  }, [selectedColor, product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Renk, beden ve numara bilgilerini ekle
    const cartItem: any = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      brand: product.brand,
    };
    
    // Seçilen renk varsa ekle
    if (selectedColor) {
      cartItem.color = selectedColor;
    }
    
    // Seçilen beden varsa ekle
    if (selectedSize) {
      cartItem.size = selectedSize;
    }
    
    // Seçilen ayakkabı numarası varsa ekle
    if (selectedShoeSize) {
      cartItem.shoeSize = selectedShoeSize;
    }
    
    // Belirtilen miktarda sepete ekle
    for (let i = 0; i < quantity; i++) {
      addItem(cartItem);
    }

    // Bilgilendirme mesajı oluştur
    let description = `${product.name} (${quantity} adet)`;
    const details: string[] = [];
    if (selectedColor) details.push(`Renk: ${selectedColor}`);
    if (selectedSize) details.push(`Beden: ${selectedSize}`);
    if (selectedShoeSize) details.push(`Numara: ${selectedShoeSize}`);
    if (details.length > 0) {
      description += ` - ${details.join(', ')}`;
    }
    description += ' sepetinize eklendi.';

    toast({
      title: "Ürün sepete eklendi!",
      description,
    });
  };

  const handleImageWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.min(Math.max(1, imageZoom + delta), 3);
    setImageZoom(newZoom);
    
    // Reset pan when zoom is 1
    if (newZoom === 1) {
      setImagePan({ x: 0, y: 0 });
    }
  };

  const handleImageMouseDown = (e: React.MouseEvent) => {
    if (imageZoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePan.x, y: e.clientY - imagePan.y });
    }
  };

  const handleImageMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageZoom > 1) {
      setImagePan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleImageMouseUp = () => {
    setIsDragging(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link kopyalandı!",
        description: "Ürün linki panoya kopyalandı.",
      });
    }
    // Share completed
  };

  // Load reviews
  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Yorumlar yüklenirken hata:', error);
      }
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Giriş Yapmalısınız',
        description: 'Yorum yapmak için giriş yapmanız gerekiyor.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          user_name: user.email?.split('@')[0] || 'Kullanıcı',
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment
        });

      if (error) throw error;

      toast({
        title: 'Yorum Eklendi!',
        description: 'Yorumunuz başarıyla eklendi.'
      });

      setReviewForm({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      loadReviews();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Yorum eklenirken hata:', error);
      }
      toast({
        title: 'Hata',
        description: 'Yorum eklenirken bir hata oluştu.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await (supabase as any)
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: 'Yorum Silindi',
        description: 'Yorumunuz başarıyla silindi.'
      });

      loadReviews();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Yorum silinirken hata:', error);
      }
      toast({
        title: 'Hata',
        description: 'Yorum silinirken bir hata oluştu.',
        variant: 'destructive'
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Ürün yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Ürün Bulunamadı</h2>
            <p className="text-muted-foreground mb-6">
              {error || 'Aradığınız ürün bulunamadı veya kaldırılmış olabilir.'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.history.back()} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Geri Dön
              </Button>
              <Link to="/urunler">
                <Button>Tüm Ürünleri Gör</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const renderCategoryBreadcrumb = () => {
    const cat = (product as any)?.category as string | undefined;
    if (!cat) {
      return (
        <Link to="/urun-kategorileri" className="hover:text-primary">Ürün Kategorileri</Link>
      );
    }
    
    // Normalize and split category path
    const normalized = cat.replace(/^\//, '').replace(/\/$/, '');
    const parts = normalized.split('/').filter(Boolean);
    
    // Remove duplicate consecutive parts (e.g., "kadin/mont-ve-ceket/kadin" -> "kadin/mont-ve-ceket")
    const uniqueParts: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      if (i === 0 || parts[i] !== parts[i - 1]) {
        uniqueParts.push(parts[i]);
      }
    }
    
    const [root, ...rest] = uniqueParts;
    const sub = rest.join('/');
    const rootInfo = siteCategories.find(c => c.slug === root);
    const rootText = rootInfo?.title ?? root.replace(/-/g, ' ');
    const subInfo = sub ? rootInfo?.subcategories.find(s => s.slug === sub) : null;
    const subText = subInfo?.name ?? (sub ? sub.replace(/-/g, ' ') : '');
    
    return (
      <>
        <Link to={`/${root}`} className="hover:text-primary">{rootText}</Link>
        {sub ? (
          <>
            <span>/</span>
            <Link to={`/${root}/${sub}`} className="hover:text-primary">{subText}</Link>
          </>
        ) : null}
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | BalıkPro</title>
        <meta name="description" content={`${product.name} - ${product.description}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8 animate-fade-in">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Anasayfa</Link>
            <span>/</span>
            {renderCategoryBreadcrumb()}
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <Button variant="ghost" size="sm" className="mb-6" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Product Images - Modern & Compact */}
            <div className="space-y-4">
              {/* Main Image - Smaller & Contained */}
              <div 
                className="relative bg-muted rounded-xl overflow-hidden border border-border group cursor-pointer"
                onClick={() => setImageModal(true)}
              >
                <div className="aspect-square max-w-md mx-auto">
                  <img 
                    src={product.images[selectedImage]} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                {/* Click to zoom indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 dark:bg-gray-800/90 px-3 py-1.5 rounded-lg shadow-sm">
                    <p className="text-xs font-medium">Büyütmek için tıklayın</p>
                  </div>
                </div>
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((img: string, index: number) => (
                    <button 
                      key={index} 
                      onClick={() => setSelectedImage(index)} 
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-primary ring-2 ring-primary ring-offset-2' 
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} ${index + 1}`} 
                        className="w-full h-full object-contain p-1" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary">{product.brand}</Badge>
                {product.badges && product.badges.length > 0 && product.badges.map((badge: string) => {
                  const badgeConfig: Record<string, { label: string; className: string }> = {
                    'popular': { label: 'Popüler', className: 'bg-purple-500 text-white hover:bg-purple-600' },
                    'bestseller': { label: 'Çok Satan', className: 'bg-orange-500 text-white hover:bg-orange-600' },
                    'new': { label: 'Yeni', className: 'bg-green-500 text-white hover:bg-green-600' },
                    'discount': { label: 'İndirimli', className: 'bg-red-500 text-white hover:bg-red-600' },
                    'featured': { label: 'Öne Çıkan', className: 'bg-blue-500 text-white hover:bg-blue-600' },
                  };
                  
                  const config = badgeConfig[badge];
                  if (!config) return null;
                  
                  return (
                    <Badge key={badge} className={config.className}>
                      {config.label}
                    </Badge>
                  );
                })}
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
              {reviews.length > 0 && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => {
                      const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
                      return (
                        <Star key={star} className={`h-5 w-5 ${star <= Math.floor(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                      );
                    })}
                    <span className="ml-2 font-medium">
                      {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-muted-foreground">({reviews.length} değerlendirme)</span>
                </div>
              )}

              {/* Price Section */}
              <div className="mb-6">
                {product.originalPrice && product.originalPrice > product.price ? (
                  <div className="space-y-3">
                    {/* Prices */}
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-2xl text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}₺
                      </span>
                      <span className="text-4xl font-bold text-red-600 dark:text-red-500">
                        {formatPrice(product.price)}₺
                      </span>
                    </div>
                    
                    {/* Discount Badge and Savings */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="destructive" className="text-sm font-bold px-3 py-1">
                        %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} İndirim
                      </Badge>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {formatPrice(product.originalPrice - product.price)}₺ tasarruf ediyorsunuz!
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-primary">
                    {formatPrice(product.price)}₺
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-6">{product.description}</p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Renk Seçin</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color: { name: string; value: string; available: boolean }) => {
                      const colorHex = getColorHex(color.name);
                      const isGradient = colorHex.includes('gradient');
                      
                      return (
                        <button 
                          key={color.name} 
                          onClick={() => color.available && setSelectedColor(color.name)} 
                          disabled={!color.available}
                          className={`w-12 h-12 rounded-full border-2 ${
                            selectedColor === color.name 
                              ? 'border-primary ring-2 ring-primary ring-offset-2' 
                              : 'border-border'
                          } ${
                            !color.available 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'cursor-pointer hover:scale-110 transition-transform'
                          } ${
                            color.name === 'Beyaz' || color.name === 'Şeffaf' 
                              ? 'border-gray-300' 
                              : ''
                          }`}
                          style={
                            isGradient 
                              ? { background: colorHex }
                              : { backgroundColor: colorHex }
                          }
                          title={color.name}
                        />
                      );
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Seçilen renk: <span className="font-medium">{selectedColor || 'Seçiniz'}</span></p>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Beden Seçin</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                          selectedSize === size
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Seçilen beden: <span className="font-medium">{selectedSize}</span></p>
                </div>
              )}

              {/* Shoe Size Selection */}
              {product.shoeSizes && product.shoeSizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Numara Seçin</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.shoeSizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedShoeSize(size)}
                        className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                          selectedShoeSize === size
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Seçilen numara: <span className="font-medium">{selectedShoeSize}</span></p>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-muted">-</button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-muted">+</button>
                </div>
                <Button 
                  onClick={handleAddToCart} 
                  className="flex-1" 
                  disabled={
                    !product.inStock || 
                    (product.colors && product.colors.length > 0 && !selectedColor) ||
                    (product.sizes && product.sizes.length > 0 && !selectedSize) ||
                    (product.shoeSizes && product.shoeSizes.length > 0 && !selectedShoeSize)
                  }
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Güven Badge'leri */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg mb-6">
                <div className="flex flex-col items-center text-center gap-1">
                  <Truck className="h-5 w-5 text-primary" />
                  <p className="text-xs font-medium">Ücretsiz Kargo</p>
                  <p className="text-xs text-muted-foreground">500₺ üzeri</p>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <Shield className="h-5 w-5 text-primary" />
                  <p className="text-xs font-medium">Güvenli Ödeme</p>
                  <p className="text-xs text-muted-foreground">SSL Korumalı</p>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <p className="text-xs font-medium">Kolay İade</p>
                  <p className="text-xs text-muted-foreground">14 gün içinde</p>
                </div>
              </div>

              {/* Stok ve Teslimat Bilgisi */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stok Durumu:</span>
                  {product.inStock ? (
                    <Badge variant="default" className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      Stokta
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Stokta Yok</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tahmini Teslimat:</span>
                  <span className="text-sm font-medium">2-3 iş günü</span>
                </div>
              </div>

            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specs">Teknik Özellikler</TabsTrigger>
              <TabsTrigger value="features">Özellikler</TabsTrigger>
              <TabsTrigger value="reviews">Değerlendirmeler</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  {Object.keys(product.technicalSpecs || {}).length > 0 ? (
                    <div className="grid gap-3">
                      {Object.entries(product.technicalSpecs).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-3 py-3 px-4 bg-muted/30 rounded-lg">
                          <span className="font-semibold text-foreground min-w-[160px] capitalize">{key}:</span>
                          <span className="text-foreground flex-1">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg">Henüz teknik özellik eklenmemiş.</p>
                      <p className="text-sm mt-2">Ürün özellikleri için "Özellikler" sekmesine bakabilirsiniz.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  {product.features && product.features.length > 0 ? (
                    <ul className="grid gap-3">
                      {product.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 py-3 px-4 bg-muted/30 rounded-lg">
                          <span className="text-primary text-xl leading-none">✓</span>
                          <span className="flex-1 text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg">Henüz özellik eklenmemiş.</p>
                      <p className="text-sm mt-2">Teknik özellikler için "Teknik Özellikler" sekmesine bakabilirsiniz.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Yorum İstatistikleri */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold">Müşteri Yorumları</h3>
                        <p className="text-muted-foreground">{reviews.length} değerlendirme</p>
                      </div>
                      <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Yorum Yaz
                      </Button>
                    </div>

                    {/* Ortalama Puan */}
                    {reviews.length > 0 && (
                      <div className="flex items-center gap-8 p-4 bg-muted/30 rounded-lg mb-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold">{(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}</div>
                          <div className="flex items-center gap-1 mt-2">
                            {[1,2,3,4,5].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{reviews.length} değerlendirme</p>
                        </div>
                        <div className="flex-1 space-y-2">
                          {[5,4,3,2,1].map((rating) => {
                            const count = reviews.filter(r => r.rating === rating).length;
                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                            return (
                              <div key={rating} className="flex items-center gap-2">
                                <span className="text-sm w-8">{rating} ⭐</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="text-sm text-muted-foreground w-12">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Yorum Formu */}
                {showReviewForm && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-4">Yorumunuzu Paylaşın</h3>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <Label>Puanınız *</Label>
                          <div className="flex gap-2 mt-2">
                            {[1,2,3,4,5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                className="focus:outline-none"
                              >
                                <Star className={`h-8 w-8 ${star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="review-title">Başlık</Label>
                          <Input
                            id="review-title"
                            value={reviewForm.title}
                            onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                            placeholder="Yorumunuza bir başlık verin"
                          />
                        </div>
                        <div>
                          <Label htmlFor="review-comment">Yorumunuz *</Label>
                          <textarea
                            id="review-comment"
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                            className="w-full min-h-[120px] p-3 border rounded-md"
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit">Yorumu Gönder</Button>
                          <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                            İptal
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Yorumlar Listesi */}
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{review.user_name}</span>
                                {review.is_verified_purchase && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Check className="h-3 w-3 mr-1" />
                                    Onaylı Alıcı
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1,2,3,4,5].map((star) => (
                                    <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString('tr-TR')}
                                </span>
                              </div>
                            </div>
                            {user && user.id === review.user_id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          {review.title && (
                            <h4 className="font-semibold mb-2">{review.title}</h4>
                          )}
                          <p className="text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : !showReviewForm && (
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">Henüz değerlendirme yok</h3>
                      <p className="text-muted-foreground mb-4">Bu ürün için ilk yorumu siz yapın!</p>
                      <Button onClick={() => setShowReviewForm(true)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        İlk Yorumu Yaz
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>

      {/* Image Modal */}
      {imageModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setImageModal(false)}
        >
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-background rounded-xl shadow-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setImageModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-background/80 hover:bg-background rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-background/80 hover:bg-background rounded-full transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-background/80 hover:bg-background rounded-full transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div 
              className="flex items-center justify-center p-8 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onWheel={handleImageWheel}
              onMouseDown={handleImageMouseDown}
              onMouseMove={handleImageMouseMove}
              onMouseUp={handleImageMouseUp}
              onMouseLeave={handleImageMouseUp}
              style={{ cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-[80vh] object-contain transition-transform select-none"
                style={{
                  transform: `scale(${imageZoom}) translate(${imagePan.x / imageZoom}px, ${imagePan.y / imageZoom}px)`,
                }}
                draggable={false}
              />
            </div>

            {/* Image Counter and Zoom Level */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
              {product.images.length > 1 && (
                <div className="bg-background/80 px-4 py-2 rounded-full">
                  <p className="text-sm font-medium">
                    {selectedImage + 1} / {product.images.length}
                  </p>
                </div>
              )}
              {imageZoom > 1 && (
                <div className="bg-background/80 px-4 py-2 rounded-full">
                  <p className="text-sm font-medium">
                    {Math.round(imageZoom * 100)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
