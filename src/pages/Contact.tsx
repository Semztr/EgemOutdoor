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
                        Düz Mah. Sırrıpaşa Cad. No:18<br />
                        Altınordu / ORDU
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Telefon</p>
                      <p className="text-sm text-muted-foreground">0452 214 17 43</p>
                      <p className="text-sm text-muted-foreground">0533 640 77 58</p>
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
                  <div className="rounded-lg overflow-hidden border">
                    <iframe
                      title="EgemOutdoor Konum"
                      src="https://www.google.com/maps?q=D%C3%BCz%20Mah.%20S%C4%B1rr%C4%B1pa%C5%9Fa%20Cad.%20No%3A18%2C%20Alt%C4%B1nordu%20%2F%20ORDU&output=embed"
                      width="100%"
                      height="360"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
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