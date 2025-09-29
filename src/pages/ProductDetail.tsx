import React, { useState } from 'react';
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

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');

  // Mock product data - replace with real data
  const product = {
    id: parseInt(productId || '1'),
    name: "Daiwa Ninja X Spinning Rod 2.40m 10-40g",
    brand: "EgemOutdoor",
    price: 850,
    originalPrice: 950,
    rating: 4.8,
    reviews: 124,
    images: ["🎣", "🎯", "⚙️", "🪝"],
    badge: "İndirimde",
    inStock: true,
    colors: [
      { name: "Siyah", value: "#000000", available: true },
      { name: "Gri", value: "#6B7280", available: true },
      { name: "Mavi", value: "#3B82F6", available: true },
      { name: "Kırmızı", value: "#EF4444", available: false }
    ],
    specs: ["2.40m", "10-40g", "2 Parça", "Carbon Fiber"],
    description: "Profesyonel balıkçılık için tasarlanmış yüksek kaliteli spinning rod. Ultra hafif carbon fiber yapısı sayesinde mükemmel hassasiyet sunar.",
    features: [
      "Yüksek kaliteli carbon fiber gövde",
      "Ergonomik EVA saplama",
      "Paslanmaz çelik halkalar",
      "2 parça taşıma kolaylığı",
      "10 yıl garanti"
    ],
    technicalSpecs: {
      "Uzunluk": "2.40m",
      "Test Ağırlığı": "10-40g",
      "Parça Sayısı": "2",
      "Malzeme": "Carbon Fiber",
      "Ağırlık": "145g",
      "Kılavuz Sayısı": "8+1"
    }
  };

  // Set default color
  React.useEffect(() => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0].name);
    }
  }, [product.colors, selectedColor]);

  const handleAddToCart = () => {
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

  return (
    <>
      <Helmet>
        <title>{product.name} | EgemOutdoor - Balık Av Malzemeleri & Outdoor Ürünleri</title>
        <meta name="description" content={`${product.name} - ${product.description} EgemOutdoor'da en uygun fiyatlarla.`} />
        <meta name="keywords" content={`${product.name.toLowerCase()}, ${product.brand.toLowerCase()}, olta makinesi, balık av malzemeleri`} />
        <link rel="canonical" href={`https://egemoutdoor.com/urun/${product.id}`} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 animate-fade-in">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-smooth">Anasayfa</Link>
            <span>/</span>
            <Link to="/balik-av-malzemeleri" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-smooth">Balık Av Malzemeleri</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-6 hover-scale transition-smooth"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-6xl">
                {product.images[selectedImage]}
              </div>
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-2xl border-2 transition-all hover-scale ${
                      selectedImage === index ? 'border-primary' : 'border-transparent hover:border-border'
                    }`}
                  >
                    {image}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.brand}</Badge>
                  {product.badge && <Badge variant="default">{product.badge}</Badge>}
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                    <span className="text-foreground font-medium ml-2">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({product.reviews} değerlendirme)</span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-primary">{product.price}₺</span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      {product.originalPrice}₺
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground mb-6">{product.description}</p>

                {/* Color Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Renk Seçin</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => color.available && setSelectedColor(color.name)}
                        disabled={!color.available}
                        className={`relative w-12 h-12 rounded-full border-2 transition-all hover-scale ${
                          selectedColor === color.name 
                            ? 'border-primary ring-2 ring-primary ring-offset-2' 
                            : 'border-border hover:border-primary'
                        } ${!color.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {!color.available && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-xs">×</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Seçilen renk: <span className="font-medium">{selectedColor}</span>
                  </p>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-muted transition-colors hover-scale"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-muted transition-colors hover-scale"
                    >
                      +
                    </button>
                  </div>
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 hover-scale transition-smooth"
                    disabled={!product.inStock || !selectedColor}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                  </Button>
                  <Button variant="outline" size="icon" className="hover-scale transition-smooth">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Ücretsiz Kargo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>10 Yıl Garanti</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RotateCcw className="h-4 w-4 text-primary" />
                    <span>30 Gün İade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specs">Teknik Özellikler</TabsTrigger>
              <TabsTrigger value="features">Özellikler</TabsTrigger>
              <TabsTrigger value="reviews">Değerlendirmeler</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specs" className="mt-6">
              <Card className="animate-fade-in">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Teknik Özellikler</h3>
                  <div className="grid gap-4">
                    {Object.entries(product.technicalSpecs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border last:border-b-0">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <Card className="animate-fade-in">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Öne Çıkan Özellikler</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card className="animate-fade-in">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Müşteri Değerlendirmeleri</h3>
                  <div className="space-y-6">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border-b border-border pb-6 last:border-b-0">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                            U{review}
                          </div>
                          <div>
                            <div className="font-medium">Kullanıcı {review}</div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          Çok kaliteli bir ürün. Beklentilerimi fazlasıyla karşıladı. Özellikle hassasiyeti ve dayanıklılığı mükemmel.
                        </p>
                      </div>
                    ))}
                  </div>
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