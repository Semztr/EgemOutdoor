import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/**
 * Sipariş Takip Sayfası
 * 
 * Bu sayfa kaldırıldı çünkü:
 * - Kullanıcılar zaten "Hesabım" sayfasında tüm siparişlerini görebiliyor
 * - Gereksiz karmaşıklık yaratıyordu
 * - Accordion yapısı ile daha iyi bir UX sağlandı
 * 
 * Artık tüm sipariş takip işlemleri /hesabim sayfasından yapılıyor
 */
const OrderTracking = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Otomatik olarak Hesabım sayfasına yönlendir
    navigate('/hesabim');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Hesabım sayfasına yönlendiriliyorsunuz...</p>
      </div>
    </div>
  );
};

export default OrderTracking;