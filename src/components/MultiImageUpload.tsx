import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MultiImageUploadProps {
  value: string; // Virgülle ayrılmış URL'ler
  onChange: (urls: string) => void;
  label?: string;
  maxImages?: number;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  value,
  onChange,
  label = 'Ek Görseller',
  maxImages = 5,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mevcut URL'leri array'e çevir
  const currentUrls = value ? value.split(',').map(url => url.trim()).filter(Boolean) : [];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Maksimum görsel kontrolü
    if (currentUrls.length + files.length > maxImages) {
      toast({
        title: 'Çok Fazla Görsel',
        description: `Maksimum ${maxImages} görsel yükleyebilirsiniz.`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        // Dosya tipi kontrolü
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: 'Geçersiz Dosya',
            description: `${file.name} desteklenmiyor. Sadece JPG, PNG, WebP ve GIF yükleyebilirsiniz.`,
            variant: 'destructive',
          });
          continue;
        }

        // Dosya boyutu kontrolü (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          toast({
            title: 'Dosya Çok Büyük',
            description: `${file.name} çok büyük. Maksimum 5MB olmalıdır.`,
            variant: 'destructive',
          });
          continue;
        }

        // Benzersiz ve güvenli dosya adı oluştur
        const fileExt = file.name.split('.').pop();
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const fileName = `${timestamp}-${randomStr}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Dosyayı yükle
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          console.error('Upload error:', error);
          toast({
            title: 'Yükleme Hatası',
            description: `${file.name} yüklenemedi.`,
            variant: 'destructive',
          });
          continue;
        }

        // Public URL al
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      // Yeni URL'leri ekle
      const allUrls = [...currentUrls, ...uploadedUrls];
      onChange(allUrls.join(', '));

      toast({
        title: 'Başarılı',
        description: `${uploadedUrls.length} görsel yüklendi.`,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Yükleme Hatası',
        description: error.message || 'Görseller yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (urlToRemove: string) => {
    const newUrls = currentUrls.filter(url => url !== urlToRemove);
    onChange(newUrls.join(', '));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Preview Grid */}
      {currentUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {currentUrls.map((url, index) => (
            <div key={index} className="relative aspect-square border rounded-lg overflow-hidden bg-muted">
              <img
                src={url}
                alt={`Ek görsel ${index + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Görseli Kaldır"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {currentUrls.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/50">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Henüz ek görsel yüklenmedi</p>
        </div>
      )}

      {/* Upload Button */}
      {currentUrls.length < maxImages && (
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            multiple
            className="hidden"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Ek Görsel Yükle ({currentUrls.length}/{maxImages})
              </>
            )}
          </Button>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-muted-foreground">
        💡 Birden fazla görsel seçebilirsiniz. Maksimum {maxImages} görsel yükleyebilirsiniz.
      </p>
    </div>
  );
};

export default MultiImageUpload;
