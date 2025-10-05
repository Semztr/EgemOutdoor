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

  // Mock product data - updated with real images
  const productData: Record<number, any> = {
    1: {
      id: 1,
      name: "Daiwa Saltiga Dogfight Olta Makinesi",
      brand: "Daiwa",
      price: 12850,
      originalPrice: 14500,
      rating: 4.9,
      reviews: 156,
      images: [
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop&brightness=0.9",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop&brightness=0.9"
      ],
      badge: "11% İndirim",
      inStock: true,
      colors: [
        { name: "Siyah", value: "#000000", available: true },
        { name: "Gri", value: "#6B7280", available: true },
        { name: "Mavi", value: "#3B82F6", available: true }
      ],
      specs: ["Ultra Dayanıklı", "Profesyonel", "10kg Çekme Gücü"],
      description: "Profesyonel balıkçılar için üstün performans ve dayanıklılık sunan Daiwa Saltiga serisi. Yırtıcı balık avı için ideal.",
      features: [
        "Yüksek kaliteli alüminyum gövde",
        "Karbon fiber fren sistemi",
        "Su geçirmez yapı",
        "10 yıl garanti",
        "Japon üretim kalitesi"
      ],
      technicalSpecs: {
        "Makara Tipi": "Spinning",
        "Çekme Gücü": "10kg",
        "Rulman Sayısı": "8+1",
        "Gear Oranı": "5.7:1",
        "Ağırlık": "285g",
        "Kaplinlik": "240m / 0.30mm"
      }
    },
    2: {
      id: 2,
      name: "Savage Gear 3D Suicide Duck Yem",
      brand: "Savage Gear",
      price: 485,
      originalPrice: null,
      rating: 4.8,
      reviews: 234,
      images: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop"
      ],
      badge: "Çok Satan",
      inStock: true,
      colors: [
        { name: "Natural", value: "#D4A574", available: true },
        { name: "Black", value: "#000000", available: true }
      ],
      specs: ["3D Gerçekçi", "Yüzer", "15cm"],
      description: "Gerçekçi hareket ve ses ile yırtıcı balıkları cezbeden efsanevi Savage Gear yemleri.",
      features: [
        "3D tarayıcı ile modellenmiş gerçekçi tasarım",
        "Özel ses sistemi",
        "Ultra keskin Japonya tığları",
        "Dayanıklı gövde yapısı"
      ],
      technicalSpecs: {
        "Uzunluk": "15cm",
        "Ağırlık": "70g",
        "Tip": "Yüzer",
        "Tığ Sayısı": "2 adet treble hook",
        "Renk": "Natural / Black"
      }
    },
    3: {
      id: 3,
      name: "Jack Wolfskin Texapore Outdoor Mont",
      brand: "Jack Wolfskin",
      price: 3240,
      originalPrice: 3850,
      rating: 4.9,
      reviews: 189,
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1473692623410-12fac8ef75c6?w=800&h=800&fit=crop"
      ],
      badge: "16% İndirim",
      inStock: true,
      colors: [
        { name: "Siyah", value: "#000000", available: true },
        { name: "Lacivert", value: "#1e3a8a", available: true },
        { name: "Yeşil", value: "#15803d", available: true }
      ],
      specs: ["Su Geçirmez", "Nefes Alır", "3 Katmanlı"],
      description: "Su geçirmez, nefes alır, tüm hava koşullarına uygun profesyonel outdoor mont.",
      features: [
        "Texapore membran teknolojisi",
        "Tamamen bantlı dikişler",
        "Ayarlanabilir kapüşon",
        "Çok sayıda kullanışlı cep",
        "Rüzgar geçirmez"
      ],
      technicalSpecs: {
        "Malzeme": "Texapore",
        "Su Geçirmezlik": "20,000mm",
        "Nefes Alabilirlik": "15,000g/m²/24h",
        "Katman": "3 Katman",
        "Beden": "S-XXL"
      }
    },
    4: {
      id: 4,
      name: "Stanley Adventure Soğuk Tutucu Termos 1L",
      brand: "Stanley",
      price: 890,
      originalPrice: 1050,
      rating: 4.7,
      reviews: 421,
      images: [
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop"
      ],
      badge: "15% İndirim",
      inStock: true,
      colors: [
        { name: "Yeşil", value: "#15803d", available: true },
        { name: "Siyah", value: "#000000", available: true }
      ],
      specs: ["1 Litre", "24 Saat Sıcak", "32 Saat Soğuk"],
      description: "24 saat sıcak, 32 saat soğuk tutar. Çelik gövde, paslanmaz ve dayanıklı.",
      features: [
        "Çift cidarlı vakumlu yalıtım",
        "Paslanmaz çelik 18/8",
        "Leak-proof kapak",
        "Bulaşık makinesinde yıkanabilir",
        "Ömür boyu garanti"
      ],
      technicalSpecs: {
        "Kapasite": "1 Litre",
        "Sıcak Tutma": "24 saat",
        "Soğuk Tutma": "32 saat",
        "Malzeme": "Paslanmaz Çelik 18/8",
        "Ağırlık": "544g"
      }
    },
    5: {
      id: 5,
      name: "Asolo Falcon GV Trekking Botu",
      brand: "Asolo",
      price: 4580,
      originalPrice: null,
      rating: 5.0,
      reviews: 178,
      images: [
        "https://images.unsplash.com/photo-1542840410-3092f99611a3?w=800&h=800&fit=crop"
      ],
      badge: "Premium",
      inStock: true,
      colors: [
        { name: "Kahverengi", value: "#92400e", available: true },
        { name: "Gri", value: "#6B7280", available: true }
      ],
      specs: ["Gore-Tex", "Vibram Taban", "Bilek Desteği"],
      description: "Gore-Tex membran, Vibram taban, maksimum destek ve konfor sunan profesyonel trekking botu.",
      features: [
        "Gore-Tex membran - su geçirmez ve nefes alır",
        "Vibram Megagrip taban",
        "Bilek desteği ve koruma",
        "Deri ve sentetik üst yapı",
        "2 yıl garanti"
      ],
      technicalSpecs: {
        "Membran": "Gore-Tex",
        "Taban": "Vibram Megagrip",
        "Malzeme": "Deri + Sentetik",
        "Numara": "40-46",
        "Ağırlık": "680g (çift)"
      }
    },
    6: {
      id: 6,
      name: "Helly Hansen Workwear Outdoor Pantolon",
      brand: "Helly Hansen",
      price: 1850,
      originalPrice: 2100,
      rating: 4.6,
      reviews: 267,
      images: [
        "https://images.unsplash.com/photo-1473692623410-12fac8ef75c6?w=800&h=800&fit=crop"
      ],
      badge: "12% İndirim",
      inStock: true,
      colors: [
        { name: "Siyah", value: "#000000", available: true },
        { name: "Lacivert", value: "#1e3a8a", available: true }
      ],
      specs: ["Stretch", "Su İtici", "Çok Cepli"],
      description: "Dayanıklı kumaş, su itici kaplama, çok amaçlı cep sistemi ile profesyonel outdoor pantolon.",
      features: [
        "4 yönlü stretch kumaş",
        "DWR su itici kaplama",
        "Takviyeli diz bölgesi",
        "Çok sayıda fonksiyonel cep",
        "Yırtılmaya dayanıklı"
      ],
      technicalSpecs: {
        "Malzeme": "65% Polyester, 35% Pamuk",
        "Ağırlık": "350g/m²",
        "Su İticilik": "DWR",
        "Beden": "46-62",
        "Renk": "Siyah / Lacivert"
      }
    }
  };

  const product = productData[parseInt(productId || '1')] || productData[1];

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
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg bg-muted overflow-hidden border-2 transition-all hover-scale ${
                      selectedImage === index ? 'border-primary' : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
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
                        <span className="text-muted-foreground">{String(value)}</span>
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