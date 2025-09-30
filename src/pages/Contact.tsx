import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mesajınız İletildi",
      description: "En kısa sürede size geri dönüş yapacağız.",
    });
  };

  return (
    <>
      <Helmet>
        <title>İletişim - EgemOutdoor</title>
        <meta name="description" content="EgemOutdoor ile iletişime geçin. Sorularınız ve önerileriniz için bize ulaşın." />
        <meta name="keywords" content="iletişim, egem outdoor iletişim, müşteri hizmetleri" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 animate-fade-in">İletişim</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* İletişim Formu */}
            <div className="lg:col-span-2">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Bize Ulaşın</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Ad Soyad *</Label>
                        <Input id="name" required />
                      </div>
                      <div>
                        <Label htmlFor="email">E-posta *</Label>
                        <Input id="email" type="email" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" type="tel" />
                    </div>
                    <div>
                      <Label htmlFor="subject">Konu *</Label>
                      <Input id="subject" required />
                    </div>
                    <div>
                      <Label htmlFor="message">Mesajınız *</Label>
                      <Textarea id="message" rows={6} required />
                    </div>
                    <Button type="submit" size="lg">Gönder</Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* İletişim Bilgileri */}
            <div className="space-y-6">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>İletişim Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Adres</p>
                      <p className="text-sm text-muted-foreground">
                        Atatürk Mah. Örnek Sok. No:123<br />
                        Karşıyaka, İzmir<br />
                        35000 Türkiye
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Telefon</p>
                      <p className="text-sm text-muted-foreground">+90 232 123 45 67</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">E-posta</p>
                      <p className="text-sm text-muted-foreground">info@egemoutdoor.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Çalışma Saatleri</p>
                      <p className="text-sm text-muted-foreground">
                        Pazartesi - Cuma: 09:00 - 18:00<br />
                        Cumartesi: 10:00 - 16:00<br />
                        Pazar: Kapalı
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Harita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Harita yükleniyor...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Contact;