import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate('/');
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      if (error) throw error;
      toast({ title: 'Giriş başarılı!', description: 'Hoş geldiniz.' });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Giriş başarısız',
        description: error.message || 'E-posta veya şifre hatalı.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({ title: 'Hata', description: 'Şifreler eşleşmiyor.', variant: 'destructive' });
      return;
    }
    if (registerForm.password.length < 6) {
      toast({ title: 'Hata', description: 'Şifre en az 6 karakter olmalıdır.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: { full_name: `${registerForm.firstName} ${registerForm.lastName}`, phone: registerForm.phone },
        },
      });
      if (error) throw error;
      toast({ title: 'Kayıt başarılı!', description: 'Hesabınız oluşturuldu. Giriş yapabilirsiniz.' });
      navigate('/');
    } catch (error: any) {
      toast({ title: 'Kayıt başarısız', description: error.message || 'Bir hata oluştu.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/giris` },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: `${provider === 'google' ? 'Google' : 'Facebook'} ile giriş başarısız`,
        description: error.message || 'Bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Üye Girişi & Kayıt | EgemOutdoor</title>
        <meta name="description" content="Hesabınıza giriş yapın veya yeni hesap oluşturun." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto animate-fade-in">
            <Card className="border-border hover-scale transition-smooth">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">Hoş Geldiniz</CardTitle>
                <p className="text-muted-foreground">Hesabınıza giriş yapın veya yeni hesap oluşturun</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                    <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="email" type="email" placeholder="ornek@email.com" className="pl-10"
                            value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="password" type="password" placeholder="••••••••" className="pl-10"
                            value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 text-sm">
                          <input type="checkbox" className="rounded border-border" />
                          <span className="text-muted-foreground">Beni hatırla</span>
                        </label>
                        <Link to="/sifremi-unuttum" className="text-sm text-primary hover:underline">Şifremi unuttum</Link>
                      </div>

                      <Button type="submit" className="w-full hover-scale transition-smooth" disabled={loading}>
                        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Ad</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input id="firstName" placeholder="Adınız" className="pl-10"
                              value={registerForm.firstName} onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })} required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Soyad</Label>
                          <Input id="lastName" placeholder="Soyadınız"
                            value={registerForm.lastName} onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })} required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="registerEmail">E-posta</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="registerEmail" type="email" placeholder="ornek@email.com" className="pl-10"
                            value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="phone" type="tel" placeholder="0555 123 45 67" className="pl-10"
                            value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="registerPassword">Şifre</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="registerPassword" type="password" placeholder="••••••••" className="pl-10"
                            value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-10"
                            value={registerForm.confirmPassword} onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })} required />
                        </div>
                      </div>

                      <label className="flex items-start space-x-2 text-sm">
                        <input type="checkbox" className="rounded border-border mt-1" required />
                        <span className="text-muted-foreground">
                          <Link to="/kullanim-kosullari" className="text-primary hover:underline">Kullanım koşullarını</Link> ve{' '}
                          <Link to="/gizlilik-politikasi" className="text-primary hover:underline">gizlilik politikasını</Link> kabul ediyorum.
                        </span>
                      </label>

                      <Button type="submit" className="w-full hover-scale transition-smooth" disabled={loading}>
                        {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">veya</p>
                  <div className="space-y-2">
                    <Button type="button" variant="outline" className="w-full hover-scale transition-smooth" onClick={() => handleOAuth('google')} disabled={loading}>
                      Google ile Giriş Yap
                    </Button>
                    <Button type="button" variant="outline" className="w-full hover-scale transition-smooth" onClick={() => handleOAuth('facebook')} disabled={loading}>
                      Facebook ile Giriş Yap
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Auth;