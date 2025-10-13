import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

const Cart = () => {
  const { state, removeItem, updateQuantity } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRemoveItem = (id: number) => {
    removeItem(id);
    toast({
      title: "Ürün sepetten kaldırıldı",
      description: "Ürün başarıyla sepetinizden kaldırıldı.",
    });
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const subtotal = state.total;
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <>
      <Helmet>
        <title>Sepetim | EgemOutdoor - Balık Av Malzemeleri & Outdoor Ürünleri</title>
        <meta name="description" content="Sepetinizdeki ürünleri görüntüleyin ve güvenli ödeme ile satın alın. EgemOutdoor'da balık av malzemeleri ve outdoor ürünleri." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">Sepetim</h1>
            <p className="text-muted-foreground">{state.items.length} ürün sepetinizde</p>
          </div>

          {state.items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {state.items.map((item) => (
                  <Card key={item.id} className="group hover:shadow-lg transition-all duration-200 animate-fade-in">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{item.name}</h3>
                              <p className="text-sm text-primary">{item.brand}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive hover-scale transition-smooth"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground">₺{item.price.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border border-border rounded-lg">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 hover-scale transition-smooth"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-12 text-center text-sm">{item.quantity}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 hover-scale transition-smooth"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-green-600">Stokta var</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Coupon Code */}
                <Card className="border-border animate-fade-in">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">İndirim Kuponu</h3>
                    <div className="flex gap-2">
                      <Input placeholder="Kupon kodunuzu girin" />
                      <Button variant="outline" className="hover-scale transition-smooth">Uygula</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="border-border sticky top-8 animate-fade-in">
                  <CardHeader>
                    <CardTitle>Sipariş Özeti</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ara Toplam</span>
                      <span className="font-medium">₺{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kargo</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">Ücretsiz</span>
                        ) : (
                          `₺${shipping}`
                        )}
                      </span>
                    </div>
                    
                    {shipping === 0 && (
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                        ✓ 500₺ üzeri ücretsiz kargo kazandınız!
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Toplam</span>
                      <span>₺{total.toLocaleString()}</span>
                    </div>
                    
                    <Button 
                      className="w-full hover-scale transition-smooth" 
                      size="lg"
                      onClick={() => navigate('/odeme')}
                    >
                      Ödemeye Geç
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    
                    <div className="text-xs text-muted-foreground text-center">
                      Güvenli ödeme sistemi ile korunuyorsunuz
                    </div>
                  </CardContent>
                </Card>
                
                {/* Free Shipping Progress */}
                {shipping > 0 && (
                  <Card className="border-border mt-4 animate-fade-in">
                    <CardContent className="p-4">
                      <div className="text-sm text-center">
                        <span className="text-muted-foreground">
                          ₺{(500 - subtotal).toLocaleString()} daha ekleyin,
                        </span>
                        <br />
                        <span className="text-primary font-medium">ücretsiz kargo kazanın!</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Sepetiniz boş</h2>
              <p className="text-muted-foreground mb-6">Alışverişe başlamak için ürünlerimizi keşfedin</p>
              <Link to="/urunler">
                <Button size="lg" className="hover-scale transition-smooth">
                  Ürünleri Keşfet
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Cart;