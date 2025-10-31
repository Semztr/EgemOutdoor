import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export interface ColorImages {
  main: string;  // Ana görsel
  extra: string[];  // Ek görseller
}

interface ColorImageUploadProps {
  colors: string[]; // Seçili renkler listesi
  value: Record<string, ColorImages>; // { "Siyah": { main: "url1.jpg", extra: ["url2.jpg"] } }
  onChange: (colorImages: Record<string, ColorImages>) => void;
}

export const ColorImageUpload: React.FC<ColorImageUploadProps> = ({
  colors,
  value,
  onChange,
}) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { toast } = useToast();

  const handleFileSelect = async (color: string, isMainImage: boolean, event: React.ChangeEvent<HTMLInputElement>) => {
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
      const currentImages = value[color] || { main: '', extra: [] };
      const newColorImages = {
        ...value,
        [color]: isMainImage 
          ? { ...currentImages, main: publicUrl }
          : { ...currentImages, extra: [...currentImages.extra, publicUrl] }
      };
      onChange(newColorImages);

      toast({
        title: 'Başarılı',
        description: `${color} rengi için ${isMainImage ? 'ana görsel' : 'ek görsel'} yüklendi.`,
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

  const handleRemoveMain = (color: string) => {
    const currentImages = value[color];
    if (!currentImages) return;
    
    const newColorImages = {
      ...value,
      [color]: { ...currentImages, main: '' }
    };
    onChange(newColorImages);
  };

  const handleRemoveExtra = (color: string, index: number) => {
    const currentImages = value[color];
    if (!currentImages) return;
    
    const newExtra = currentImages.extra.filter((_, i) => i !== index);
    const newColorImages = {
      ...value,
      [color]: { ...currentImages, extra: newExtra }
    };
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
    <div className="space-y-4">
      <div>
        <Label>Renk Bazlı Görseller (Opsiyonel)</Label>
        <p className="text-xs text-muted-foreground mt-1">
          💡 Her renk için ayrı ana görsel ve ek görseller yükleyebilirsiniz. Müşteri renk seçtiğinde ilgili görseller gösterilir.
        </p>
      </div>

      <div className="space-y-4">
        {colors.map((color) => {
          const colorImages = value[color] || { main: '', extra: [] };
          const mainInputKey = `${color}-main`;
          const extraInputKey = `${color}-extra`;
          
          return (
            <div key={color} className="border-2 rounded-lg p-4 bg-card space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color.toLowerCase() }} />
                <span className="font-semibold">{color}</span>
              </div>

              {/* Ana Görsel */}
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  📸 Ana Görsel
                  {colorImages.main && (
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  )}
                </Label>
                
                {colorImages.main ? (
                  <div className="relative aspect-video w-full border rounded overflow-hidden bg-muted">
                    <img
                      src={colorImages.main}
                      alt={`${color} ana görsel`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMain(color)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                      title="Kaldır"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-video w-full border-2 border-dashed rounded flex items-center justify-center bg-muted/50">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                <input
                  ref={(el) => (fileInputRefs.current[mainInputKey] = el)}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={(e) => handleFileSelect(color, true, e)}
                  className="hidden"
                  disabled={uploading === mainInputKey}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRefs.current[mainInputKey]?.click()}
                  disabled={uploading === mainInputKey}
                  className="w-full"
                >
                  {uploading === mainInputKey ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      <Upload className="h-3 w-3 mr-2" />
                      {colorImages.main ? 'Ana Görseli Değiştir' : 'Ana Görsel Yükle'}
                    </>
                  )}
                </Button>
              </div>

              {/* Ek Görseller */}
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1">
                  🖼️ Ek Görseller ({colorImages.extra.length}/5)
                </Label>
                
                {/* Mevcut Ek Görseller */}
                {colorImages.extra.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {colorImages.extra.map((url, index) => (
                      <div key={index} className="relative aspect-square border rounded overflow-hidden bg-muted">
                        <img
                          src={url}
                          alt={`${color} ek görsel ${index + 1}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExtra(color, index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-0.5 rounded-full"
                          title="Kaldır"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ek Görsel Ekleme Butonu */}
                {colorImages.extra.length < 5 && (
                  <>
                    <input
                      ref={(el) => (fileInputRefs.current[extraInputKey] = el)}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={(e) => handleFileSelect(color, false, e)}
                      className="hidden"
                      disabled={uploading === extraInputKey}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRefs.current[extraInputKey]?.click()}
                      disabled={uploading === extraInputKey}
                      className="w-full"
                    >
                      {uploading === extraInputKey ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                          Yükleniyor...
                        </>
                      ) : (
                        <>
                          <Upload className="h-3 w-3 mr-2" />
                          Ek Görsel Ekle
                        </>
                      )}
                    </Button>
                  </>
                )}
                
                <p className="text-xs text-muted-foreground">
                  En fazla 5 ek görsel ekleyebilirsiniz.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ColorImageUpload;
