import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { siteCategories } from '@/data/categories';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            rating: 4.8,
            reviews: 0,
            images: images,
            badge: (data as any).badge ?? null,
            inStock: data.is_active ?? true,
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
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className={`h-5 w-5 ${star <= Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                  ))}
                  <span className="ml-2 font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">({product.reviews} değerlendirme)</span>
              </div>

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
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
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
              <Card>
                <CardContent>
                  <p>Henüz değerlendirme yok.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
