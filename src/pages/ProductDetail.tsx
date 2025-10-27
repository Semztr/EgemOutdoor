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
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft, Share2, ZoomIn, Check, Clock, Package, Award, MessageCircle, ChevronRight, Trash2, Edit } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { siteCategories } from '@/data/categories';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
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
        console.log('[ProductDetail] Loading product:', productId);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId as string)
          .single();

        console.log('[ProductDetail] Supabase response:', { data, error });

        if (!ignore) {
          if (error || !data) {
            console.error('[ProductDetail] Product not found:', error);
            setError('Ürün bulunamadı');
            setProduct(null);
          } else {
            console.log('[ProductDetail] Product loaded successfully:', data.name);
            
            // Safely parse colors
            let normalizedColors = [{ name: 'Varsayılan', value: '#000000', available: true }];
            try {
              const colorsRaw = (data as any).colors;
              if (Array.isArray(colorsRaw) && colorsRaw.length > 0) {
                normalizedColors = colorsRaw.map((c: any) =>
                  typeof c === 'string'
                    ? { name: c, value: '#000000', available: true }
                    : c
                );
              }
            } catch (err) {
              console.warn('[ProductDetail] Error parsing colors:', err);
            }

            // Safely parse features
            let features = [];
            try {
              const featuresRaw = (data as any).features;
              if (featuresRaw && typeof featuresRaw === 'object') {
                features = Object.entries(featuresRaw).map(([key, value]) => ({
                  label: key,
                  value: String(value)
                }));
              } else if (Array.isArray(featuresRaw)) {
                features = featuresRaw;
              }
            } catch (err) {
              console.warn('[ProductDetail] Error parsing features:', err);
            }

            // Safely parse images
            let images = ['/placeholder.svg'];
            try {
              if (data.image_url) {
                images = [data.image_url];
              }
              const extraImages = (data as any).extra_images;
              if (Array.isArray(extraImages) && extraImages.length > 0) {
                images = [...images, ...extraImages];
              }
            } catch (err) {
              console.warn('[ProductDetail] Error parsing images:', err);
            }

          setProduct({
            id: data.id,
            name: data.name || 'Ürün',
            brand: data.brand ?? '',
            category: (data as any).category ?? '',
            price: data.price || 0,
            originalPrice: (data as any).original_price ?? null,
            images: images,
            badge: (data as any).badge ?? null,
            inStock: (data.stock_quantity ?? 0) > 0 && (data.is_active ?? true),
            colors: normalizedColors,
            specs: (data as any).specs ?? [],
            description: data.description ?? 'Ürün açıklaması bulunmamaktadır.',
            features: features,
            technicalSpecs: (data as any).technical_specs ?? {},
          });
          setError(null);
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (!ignore) {
          console.error('Product load error:', err);
          setError(err.message || 'Ürün yüklenirken bir hata oluştu');
          setLoading(false);
        }
      }
    };

    loadProduct();
    return () => { ignore = true; };
  }, [productId]);

  // Set default color
  useEffect(() => {
    if (product?.colors?.length && !selectedColor) {
      setSelectedColor(product.colors[0].name);
    }
  }, [product, selectedColor]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        brand: product.brand,
      });
    }

    toast({
      title: "Ürün sepete eklendi!",
      description: `${product.name} (${quantity} adet) sepetinize eklendi.`,
    });
  };

  const handleShare = () => {
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
    setShowShareMenu(false);
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
      console.error('Yorumlar yüklenirken hata:', error);
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
      console.error('Yorum eklenirken hata:', error);
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
      console.error('Yorum silinirken hata:', error);
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
    const normalized = cat.replace(/^\//, '');
    const [root, ...rest] = normalized.split('/');
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

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2">
                {product.images.map((img, index) => (
                  <button key={index} onClick={() => setSelectedImage(index)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}>
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.brand}</Badge>
                {product.badge && <Badge variant="default">{product.badge}</Badge>}
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

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">{product.price}₺</span>
                {product.originalPrice && <span className="text-xl text-muted-foreground line-through">{product.originalPrice}₺</span>}
              </div>

              <p className="text-muted-foreground mb-6">{product.description}</p>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Renk Seçin</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button key={color.name} onClick={() => color.available && setSelectedColor(color.name)} disabled={!color.available}
                      className={`w-12 h-12 rounded-full border-2 ${selectedColor === color.name ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'} ${!color.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Seçilen renk: <span className="font-medium">{selectedColor}</span></p>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-muted">-</button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-muted">+</button>
                </div>
                <Button onClick={handleAddToCart} className="flex-1" disabled={!product.inStock || !selectedColor}>
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                  <Clock className="h-4 w-4" />
                  <span>Son 24 saatte 12 kişi satın aldı</span>
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
                <CardContent>
                  {Object.entries(product.technicalSpecs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border last:border-b-0">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent>
                  <ul className="space-y-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
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
    </>
  );
};

export default ProductDetail;
