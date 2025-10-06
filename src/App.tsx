import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UrunKategorileri from "./pages/UrunKategorileri";
import CategoryPage from "./pages/CategoryPage";
import Products from "./pages/Products";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Blog from "./pages/Blog";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Contact from "./pages/Contact";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";
import OrderTracking from "./pages/OrderTracking";
import Admin from "./pages/Admin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";

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
          <Route path="/urun-kategorileri" element={<UrunKategorileri />} />
          <Route path="/kategori/:categorySlug" element={<CategoryPage />} />
          <Route path="/urunler" element={<Products />} />
          <Route path="/urun/:productId" element={<ProductDetail />} />
          <Route path="/giris" element={<Auth />} />
          <Route path="/sepet" element={<Cart />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:postId" element={<Blog />} />
          
          {/* Category routes */}
          <Route path="/balik-av-malzemeleri" element={<CategoryPage />} />
          <Route path="/outdoor-giyim" element={<CategoryPage />} />
          <Route path="/kamp-malzemeleri" element={<CategoryPage />} />
          <Route path="/caki-bicak" element={<CategoryPage />} />
          <Route path="/kisiye-ozel" element={<CategoryPage />} />
          <Route path="/kisiye-ozel-teklif" element={<CategoryPage />} />
          
          {/* E-commerce pages */}
          <Route path="/odeme" element={<Checkout />} />
          <Route path="/hesabim" element={<Account />} />
          <Route path="/iletisim" element={<Contact />} />
          <Route path="/hakkimizda" element={<About />} />
          <Route path="/siparis-takip" element={<OrderTracking />} />
          <Route path="/iade-degisim" element={<Returns />} />
          <Route path="/kargo-bilgileri" element={<Shipping />} />
          <Route path="/sss" element={<FAQ />} />
          
          {/* Admin */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Legal pages */}
          <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
          <Route path="/kullanim-kosullari" element={<TermsOfService />} />
          <Route path="/cerez-politikasi" element={<CookiePolicy />} />
          <Route path="/sifremi-unuttum" element={<NotFound />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </CartProvider>
  </HelmetProvider>
  </QueryClientProvider>
);

export default App;