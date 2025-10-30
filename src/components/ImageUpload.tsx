import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Görsel',
  required = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: 'Dosya Çok Büyük',
        description: 'Maksimum dosya boyutu 5MB olmalıdır.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Benzersiz ve güvenli dosya adı oluştur
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}-${randomStr}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Dosyayı Supabase Storage'a yükle
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Public URL al
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Preview ve form değerini güncelle
      setPreview(publicUrl);
      onChange(publicUrl);

      toast({
        title: 'Başarılı',
        description: 'Görsel başarıyla yüklendi.',
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Yükleme Hatası',
        description: error.message || 'Görsel yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      // Input'u temizle
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Preview */}
      {preview ? (
        <div className="relative w-full aspect-square max-w-xs border rounded-lg overflow-hidden bg-muted">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Görseli Kaldır"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="w-full aspect-square max-w-xs border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50">
          <div className="text-center p-4">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Henüz görsel yüklenmedi</p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-xs"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Yükleniyor...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Dosya Seç ve Yükle
            </>
          )}
        </Button>
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground">
        💡 JPG, PNG, WebP veya GIF formatında, maksimum 5MB boyutunda dosya yükleyebilirsiniz.
      </p>
    </div>
  );
};

export default ImageUpload;
