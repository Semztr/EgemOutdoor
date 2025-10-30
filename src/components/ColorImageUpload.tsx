import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface ColorImageUploadProps {
  colors: string[]; // Seçili renkler listesi
  value: Record<string, string>; // { "Siyah": "url1.jpg", "Beyaz": "url2.jpg" }
  onChange: (colorImages: Record<string, string>) => void;
}

export const ColorImageUpload: React.FC<ColorImageUploadProps> = ({
  colors,
  value,
  onChange,
}) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { toast } = useToast();

  const handleFileSelect = async (color: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Geçersiz Dosya Tipi',
        description: 'Sadece JPG, PNG, WebP ve GIF dosyaları yükleyebilirsiniz.',
        variant: 'destructive',
      });
      return;
    }

    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'Dosya Çok Büyük',
        description: 'Maksimum dosya boyutu 5MB olmalıdır.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(color);

    try {
      // Benzersiz ve güvenli dosya adı oluştur
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      // Renk adını temizle (Türkçe karakterler ve boşlukları kaldır)
      const safeColor = color
        .toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      
      const fileName = `${timestamp}-${safeColor}-${randomStr}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log('[ColorImageUpload] Uploading file:', { color, fileName, filePath });

      // Dosyayı Supabase Storage'a yükle
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('[ColorImageUpload] Upload error:', error);
        throw error;
      }

      console.log('[ColorImageUpload] Upload successful:', data);

      // Public URL al
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      console.log('[ColorImageUpload] Public URL:', publicUrl);

      // Renk görseli ekle
      const newColorImages = { ...value, [color]: publicUrl };
      onChange(newColorImages);

      toast({
        title: 'Başarılı',
        description: `${color} rengi için görsel yüklendi.`,
      });
    } catch (error: any) {
      console.error('[ColorImageUpload] Upload error:', error);
      toast({
        title: 'Yükleme Hatası',
        description: error.message || 'Görsel yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setUploading(null);
      // Input'u temizle
      if (fileInputRefs.current[color]) {
        fileInputRefs.current[color]!.value = '';
      }
    }
  };

  const handleRemove = (color: string) => {
    const newColorImages = { ...value };
    delete newColorImages[color];
    onChange(newColorImages);
  };

  if (colors.length === 0) {
    return (
      <div className="p-4 border-2 border-dashed rounded-lg bg-muted/50 text-center">
        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Önce renk seçin, sonra her renk için görsel yükleyebilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label>Renk Bazlı Görseller (Opsiyonel)</Label>
      <p className="text-xs text-muted-foreground mb-3">
        💡 Her renk için ayrı görsel yükleyebilirsiniz. Müşteri renk seçtiğinde ilgili görsel gösterilir.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {colors.map((color) => (
          <div key={color} className="border rounded-lg p-3 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{color}</span>
              {value[color] && (
                <button
                  type="button"
                  onClick={() => handleRemove(color)}
                  className="text-red-500 hover:text-red-700 text-xs"
                  title="Görseli Kaldır"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Preview */}
            {value[color] ? (
              <div className="relative aspect-square w-full mb-2 border rounded overflow-hidden bg-muted">
                <img
                  src={value[color]}
                  alt={color}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
            ) : (
              <div className="aspect-square w-full mb-2 border-2 border-dashed rounded flex items-center justify-center bg-muted/50">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}

            {/* Upload Button */}
            <input
              ref={(el) => (fileInputRefs.current[color] = el)}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={(e) => handleFileSelect(color, e)}
              className="hidden"
              disabled={uploading === color}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRefs.current[color]?.click()}
              disabled={uploading === color}
              className="w-full"
            >
              {uploading === color ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Yükleniyor...
                </>
              ) : (
                <>
                  <Upload className="h-3 w-3 mr-2" />
                  {value[color] ? 'Değiştir' : 'Yükle'}
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorImageUpload;
