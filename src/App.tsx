import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from "@/contexts/CartContext";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Eagerly loaded components
import Index from "./pages/Index";

// Lazy loaded components
const NotFound = lazy(() => import("./pages/NotFound"));
const UrunKategorileri = lazy(() => import("./pages/UrunKategorileri"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const Products = lazy(() => import("./pages/Products"));
const Auth = lazy(() => import("./pages/Auth"));
const Cart = lazy(() => import("./pages/Cart"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Account = lazy(() => import("./pages/Account"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Returns = lazy(() => import("./pages/Returns"));
const Shipping = lazy(() => import("./pages/Shipping"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const Admin = lazy(() => import("./pages/Admin"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Category landing pages
const Misineler = lazy(() => import("./pages/categories/Misineler"));
const IgneJighead = lazy(() => import("./pages/categories/IgneJighead"));
const Aksesuarlar = lazy(() => import("./pages/categories/Aksesuarlar"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/urun-kategorileri" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <UrunKategorileri />
            </Suspense>
          } />
          <Route path="/kategori/:categorySlug" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <CategoryPage />
            </Suspense>
          } />
          <Route path="/urunler" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <Products />
            </Suspense>
          } />
          <Route path="/urun/:productId" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <ProductDetail />
            </Suspense>
          } />
          <Route path="/giris" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <Auth />
            </Suspense>
          } />
          <Route path="/sepet" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <Cart />
            </Suspense>
          } />
          <Route path="/blog" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <Blog />
            </Suspense>
          } />
          <Route path="/blog/:postId" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <Blog />
            </Suspense>
          } />
          
          {/* Category routes */}
          <Route path="/balik-av-malzemeleri" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <CategoryPage />
            </Suspense>
          } />
          {/* Fishing subcategory landing pages */}
          <Route path="/balik-av-malzemeleri/misineler" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <Misineler />
            </Suspense>
          } />
          <Route path="/balik-av-malzemeleri/igne-jighead" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <IgneJighead />
            </Suspense>
          } />
          <Route path="/balik-av-malzemeleri/aksesuarlar" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <Aksesuarlar />
            </Suspense>
          } />
          <Route path="/balik-av-malzemeleri/*" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <CategoryPage />
            </Suspense>
          } />
          <Route path="/outdoor-giyim" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <CategoryPage />
            </Suspense>
          } />
          <Route path="/outdoor-giyim/*" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <CategoryPage />
            </Suspense>
          } />
          <Route path="/kamp-malzemeleri" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <CategoryPage />
            </Suspense>
          } />
          <Route path="/kamp-malzemeleri/*" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <CategoryPage />
            </Suspense>
          } />
          <Route path="/caki-bicak" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <CategoryPage />
            </Suspense>
          } />
          <Route path="/caki-bicak/*" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <CategoryPage />
            </Suspense>
          } />
          <Route path="/kisiye-ozel" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <CategoryPage />
            </Suspense>
          } />
          {/* Dalış Ürünleri */}
          <Route path="/dalis-urunleri" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <CategoryPage />
            </Suspense>
          } />
          <Route path="/dalis-urunleri/*" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <CategoryPage />
            </Suspense>
          } />
          
          {/* E-commerce pages */}
          <Route path="/odeme" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <Checkout />
            </Suspense>
          } />
          <Route path="/hesabim" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <Account />
            </Suspense>
          } />
          <Route path="/iletisim" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <Contact />
            </Suspense>
          } />
          <Route path="/hakkimizda" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <About />
            </Suspense>
          } />
          <Route path="/siparis-takip" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <OrderTracking />
            </Suspense>
          } />
          <Route path="/iade-degisim" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <Returns />
            </Suspense>
          } />
          <Route path="/kargo-bilgileri" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <Shipping />
            </Suspense>
          } />
          <Route path="/sss" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <FAQ />
            </Suspense>
          } />
          
          {/* Admin */}
          <Route path="/admin" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <Admin />
            </Suspense>
          } />
          
          {/* Legal pages */}
          <Route path="/gizlilik-politikasi" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <PrivacyPolicy />
            </Suspense>
          } />
          <Route path="/kullanim-kosullari" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <TermsOfService />
            </Suspense>
          } />
          <Route path="/cerez-politikasi" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <CookiePolicy />
            </Suspense>
          } />
          <Route path="/sifremi-unuttum" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <ForgotPassword />
            </Suspense>
          } />
          <Route path="/sifre-yenile" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <ResetPassword />
            </Suspense>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </CartProvider>
  </HelmetProvider>
  </QueryClientProvider>
);

export default App;