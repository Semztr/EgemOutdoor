-- Eski tabloyu sil (varsa)
DROP TABLE IF EXISTS public.categories CASCADE;

-- Kategori tablosu oluştur
CREATE TABLE public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  parent_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  level integer NOT NULL, -- 1: Ana, 2: Alt, 3: Detay
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_level ON public.categories(level);

-- RLS (Row Level Security) - Herkes okuyabilir, sadece authenticated kullanıcılar yazabilir
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes kategorileri okuyabilir"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated kullanıcılar kategorileri yönetebilir"
  ON public.categories FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Balık Av Malzemeleri Hiyerarşisi
-- Ana Kategori
INSERT INTO public.categories (name, slug, level, display_order) VALUES
('Balık Av Malzemeleri', 'balik-av-malzemeleri', 1, 1);

-- Alt Kategoriler
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Olta Makineleri', 'olta-makineleri', (SELECT id FROM categories WHERE slug = 'balik-av-malzemeleri'), 2, 1),
('Olta Kamışları', 'olta-kamislari', (SELECT id FROM categories WHERE slug = 'balik-av-malzemeleri'), 2, 2),
('Suni Yemler', 'suni-yemler', (SELECT id FROM categories WHERE slug = 'balik-av-malzemeleri'), 2, 3),
('Misineler', 'misineler', (SELECT id FROM categories WHERE slug = 'balik-av-malzemeleri'), 2, 4),
('İğne ve Jighead', 'igne-ve-jighead', (SELECT id FROM categories WHERE slug = 'balik-av-malzemeleri'), 2, 5),
('Aksesurlar', 'aksesurlar', (SELECT id FROM categories WHERE slug = 'balik-av-malzemeleri'), 2, 6),
('Diğer', 'diger', (SELECT id FROM categories WHERE slug = 'balik-av-malzemeleri'), 2, 7);

-- Detay Kategoriler - Olta Makineleri
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Spin Olta Makineleri', 'spin-olta-makineleri', (SELECT id FROM categories WHERE slug = 'olta-makineleri'), 3, 1),
('LRF Olta Makineleri', 'lrf-olta-makineleri', (SELECT id FROM categories WHERE slug = 'olta-makineleri'), 3, 2),
('Surf Olta Makineleri', 'surf-olta-makineleri', (SELECT id FROM categories WHERE slug = 'olta-makineleri'), 3, 3),
('Genel Kullanım', 'genel-kullanim', (SELECT id FROM categories WHERE slug = 'olta-makineleri'), 3, 4);

-- Detay Kategoriler - Olta Kamışları
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Telespin', 'telespin', (SELECT id FROM categories WHERE slug = 'olta-kamislari'), 3, 1),
('Teleskopik', 'teleskopik', (SELECT id FROM categories WHERE slug = 'olta-kamislari'), 3, 2),
('Spin', 'spin', (SELECT id FROM categories WHERE slug = 'olta-kamislari'), 3, 3),
('LRF', 'lrf', (SELECT id FROM categories WHERE slug = 'olta-kamislari'), 3, 4),
('Bot - Tekne', 'bot-tekne', (SELECT id FROM categories WHERE slug = 'olta-kamislari'), 3, 5),
('Tatlı Su', 'tatli-su', (SELECT id FROM categories WHERE slug = 'olta-kamislari'), 3, 6),
('Light Spin', 'light-spin', (SELECT id FROM categories WHERE slug = 'olta-kamislari'), 3, 7);

-- Detay Kategoriler - Suni Yemler
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Su Üstü Maketler', 'su-ustu-maketler', (SELECT id FROM categories WHERE slug = 'suni-yemler'), 3, 1),
('Kaşık Yemler', 'kasik-yemler', (SELECT id FROM categories WHERE slug = 'suni-yemler'), 3, 2),
('Silikon Yemler', 'silikon-yemler', (SELECT id FROM categories WHERE slug = 'suni-yemler'), 3, 3),
('Jig Yemler', 'jig-yemler', (SELECT id FROM categories WHERE slug = 'suni-yemler'), 3, 4),
('Kaşıklar ve Vibrasyonlar', 'kasiklar-ve-vibrasyonlar', (SELECT id FROM categories WHERE slug = 'suni-yemler'), 3, 5),
('Zokalar', 'zokalar', (SELECT id FROM categories WHERE slug = 'suni-yemler'), 3, 6),
('Meppsler', 'meppsler', (SELECT id FROM categories WHERE slug = 'suni-yemler'), 3, 7),
('Sazan Yemleri', 'sazan-yemleri', (SELECT id FROM categories WHERE slug = 'suni-yemler'), 3, 8);

-- Detay Kategoriler - Misineler
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Monofilament', 'monofilament', (SELECT id FROM categories WHERE slug = 'misineler'), 3, 1),
('Fluorocarbon', 'fluorocarbon', (SELECT id FROM categories WHERE slug = 'misineler'), 3, 2),
('İp - Örgü', 'ip-orgu', (SELECT id FROM categories WHERE slug = 'misineler'), 3, 3);

-- Detay Kategoriler - İğne ve Jighead
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Kurşunlar', 'kursunlar', (SELECT id FROM categories WHERE slug = 'igne-ve-jighead'), 3, 1),
('Jighead - Zoka', 'jighead-zoka', (SELECT id FROM categories WHERE slug = 'igne-ve-jighead'), 3, 2),
('Assist Jig İğneleri', 'assist-jig-igneleri', (SELECT id FROM categories WHERE slug = 'igne-ve-jighead'), 3, 3),
('Üçlü İğneler', 'uclu-igneler', (SELECT id FROM categories WHERE slug = 'igne-ve-jighead'), 3, 4),
('Fırdöndü - Klips - Halkalar', 'firdondu-klips-halkalar', (SELECT id FROM categories WHERE slug = 'igne-ve-jighead'), 3, 5),
('Tekli İğneler', 'tekli-igneler', (SELECT id FROM categories WHERE slug = 'igne-ve-jighead'), 3, 6),
('Ofset İğneler', 'ofset-igneler', (SELECT id FROM categories WHERE slug = 'igne-ve-jighead'), 3, 7);

-- Detay Kategoriler - Aksesurlar
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Çizmeler - Tulum', 'cizmeler-tulum', (SELECT id FROM categories WHERE slug = 'aksesurlar'), 3, 1),
('Şamandıra ve Stopler', 'samandira-ve-stopler', (SELECT id FROM categories WHERE slug = 'aksesurlar'), 3, 2),
('Fenerler', 'fenerler', (SELECT id FROM categories WHERE slug = 'aksesurlar'), 3, 3),
('Pense - Gripper - Makas', 'pense-gripper-makas', (SELECT id FROM categories WHERE slug = 'aksesurlar'), 3, 4),
('Kepçe - Livar - Kakıç - Tripod', 'kepce-livar-kakic-tripod', (SELECT id FROM categories WHERE slug = 'aksesurlar'), 3, 5),
('Şişme Yataklar', 'sisme-yataklar', (SELECT id FROM categories WHERE slug = 'aksesurlar'), 3, 6),
('Alarm - Zil - Fosfor - Boncuk', 'alarm-zil-fosfor-boncuk', (SELECT id FROM categories WHERE slug = 'aksesurlar'), 3, 7);

-- Detay Kategoriler - Diğer
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Balıkçı Kıyafetleri ve Eldivenler', 'balikci-kiyafetleri-ve-eldivenler', (SELECT id FROM categories WHERE slug = 'diger'), 3, 1),
('Çanta ve Kutular', 'canta-ve-kutular', (SELECT id FROM categories WHERE slug = 'diger'), 3, 2);

-- Outdoor Giyim Hiyerarşisi (Mevcut)
INSERT INTO public.categories (name, slug, level, display_order) VALUES
('Outdoor Giyim', 'outdoor-giyim', 1, 2);

-- Alt Kategoriler - Outdoor Giyim
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Erkek', 'erkek', (SELECT id FROM categories WHERE slug = 'outdoor-giyim'), 2, 1),
('Kadın', 'kadin', (SELECT id FROM categories WHERE slug = 'outdoor-giyim'), 2, 2),
('Aksesuar', 'aksesuar', (SELECT id FROM categories WHERE slug = 'outdoor-giyim'), 2, 3);

-- Detay Kategoriler - Erkek
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Pantolon', 'pantolon', (SELECT id FROM categories WHERE slug = 'erkek' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 1),
('Tişört', 'tisort', (SELECT id FROM categories WHERE slug = 'erkek' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 2),
('Gömlek', 'gomlek', (SELECT id FROM categories WHERE slug = 'erkek' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 3),
('Mont ve Ceket', 'mont-ve-ceket', (SELECT id FROM categories WHERE slug = 'erkek' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 4),
('Ayakkabı', 'ayakkabi', (SELECT id FROM categories WHERE slug = 'erkek' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 5),
('Bot', 'bot', (SELECT id FROM categories WHERE slug = 'erkek' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 6);

-- Detay Kategoriler - Kadın
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Tişört', 'tisort-kadin', (SELECT id FROM categories WHERE slug = 'kadin' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 1),
('Ayakkabı', 'ayakkabi-kadin', (SELECT id FROM categories WHERE slug = 'kadin' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 2),
('Bot', 'bot-kadin', (SELECT id FROM categories WHERE slug = 'kadin' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 3),
('Mont ve Ceket', 'mont-ve-ceket-kadin', (SELECT id FROM categories WHERE slug = 'kadin' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 4),
('Pantolon', 'pantolon-kadin', (SELECT id FROM categories WHERE slug = 'kadin' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 5);

-- Detay Kategoriler - Aksesuar
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Çanta', 'canta', (SELECT id FROM categories WHERE slug = 'aksesuar' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 1),
('Şapka', 'sapka', (SELECT id FROM categories WHERE slug = 'aksesuar' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 2),
('Bere', 'bere', (SELECT id FROM categories WHERE slug = 'aksesuar' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 3),
('Termal İçlik', 'termal-iclik', (SELECT id FROM categories WHERE slug = 'aksesuar' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 4),
('Sweatshirts', 'sweatshirts', (SELECT id FROM categories WHERE slug = 'aksesuar' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 5),
('Polar', 'polar', (SELECT id FROM categories WHERE slug = 'aksesuar' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 6),
('Yelek', 'yelek', (SELECT id FROM categories WHERE slug = 'aksesuar' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 7),
('Şort', 'sort', (SELECT id FROM categories WHERE slug = 'aksesuar' AND parent_id = (SELECT id FROM categories WHERE slug = 'outdoor-giyim')), 3, 8);

-- Kamp Malzemeleri Hiyerarşisi
-- Ana Kategori
INSERT INTO public.categories (name, slug, level, display_order) VALUES
('Kamp Malzemeleri', 'kamp-malzemeleri', 1, 3);

-- Alt Kategoriler - Kamp Malzemeleri
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Pişirme', 'pisirme', (SELECT id FROM categories WHERE slug = 'kamp-malzemeleri'), 2, 1),
('Barınma & Uyku', 'barinma-uyku', (SELECT id FROM categories WHERE slug = 'kamp-malzemeleri'), 2, 2),
('Aksesuar', 'aksesuar-kamp', (SELECT id FROM categories WHERE slug = 'kamp-malzemeleri'), 2, 3);

-- Detay Kategoriler - Pişirme
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Kamp Ocağı', 'kamp-ocagi', (SELECT id FROM categories WHERE slug = 'pisirme'), 3, 1),
('Kartuşlar', 'kartuslar', (SELECT id FROM categories WHERE slug = 'pisirme'), 3, 2),
('Pürmüz', 'purmuz', (SELECT id FROM categories WHERE slug = 'pisirme'), 3, 3),
('Kamp Mutfağı', 'kamp-mutfagi', (SELECT id FROM categories WHERE slug = 'pisirme'), 3, 4);

-- Detay Kategoriler - Barınma & Uyku
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Çadırlar', 'cadirlar', (SELECT id FROM categories WHERE slug = 'barinma-uyku'), 3, 1),
('Uyku Tulumları', 'uyku-tulumlari', (SELECT id FROM categories WHERE slug = 'barinma-uyku'), 3, 2),
('Şişme Ürünler ve Matlar', 'sisme-urunler-ve-matlar', (SELECT id FROM categories WHERE slug = 'barinma-uyku'), 3, 3);

-- Detay Kategoriler - Aksesuar (Kamp)
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Kamp Çantası', 'kamp-cantasi', (SELECT id FROM categories WHERE slug = 'aksesuar-kamp'), 3, 1),
('Aydınlatma', 'aydinlatma', (SELECT id FROM categories WHERE slug = 'aksesuar-kamp'), 3, 2),
('Kafa Lambası', 'kafa-lambasi', (SELECT id FROM categories WHERE slug = 'aksesuar-kamp'), 3, 3),
('El Feneri', 'el-feneri', (SELECT id FROM categories WHERE slug = 'aksesuar-kamp'), 3, 4),
('Masalar ve Sandalyeler', 'masalar-ve-sandalyeler', (SELECT id FROM categories WHERE slug = 'aksesuar-kamp'), 3, 5),
('Çizmeler', 'cizmeler', (SELECT id FROM categories WHERE slug = 'aksesuar-kamp'), 3, 6),
('Balta , Kürek', 'balta-kurek', (SELECT id FROM categories WHERE slug = 'aksesuar-kamp'), 3, 7),
('Köpek Kovucu', 'kopek-kovucu', (SELECT id FROM categories WHERE slug = 'aksesuar-kamp'), 3, 8),
('Kamp Ekipmanları', 'kamp-ekipmanlari', (SELECT id FROM categories WHERE slug = 'aksesuar-kamp'), 3, 9);

-- Dalış Ürünleri Hiyerarşisi
-- Ana Kategori
INSERT INTO public.categories (name, slug, level, display_order) VALUES
('Dalış Ürünleri', 'dalis-urunleri', 1, 4);

-- Alt Kategoriler - Dalış Ürünleri
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Ekipman', 'ekipman', (SELECT id FROM categories WHERE slug = 'dalis-urunleri'), 2, 1),
('Giyim & Parça', 'giyim-parca', (SELECT id FROM categories WHERE slug = 'dalis-urunleri'), 2, 2),
('Av & Aksesuar', 'av-aksesuar', (SELECT id FROM categories WHERE slug = 'dalis-urunleri'), 2, 3);

-- Detay Kategoriler - Ekipman
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Denge Yeleği (BCD)', 'denge-yelegi-bcd', (SELECT id FROM categories WHERE slug = 'ekipman'), 3, 1),
('Dalış Bilgisayarı', 'dalis-bilgisayari', (SELECT id FROM categories WHERE slug = 'ekipman'), 3, 2),
('Regülatörler', 'regulatorler', (SELECT id FROM categories WHERE slug = 'ekipman'), 3, 3),
('Konsol & Pusula & Manometre', 'konsol-pusula-manometre', (SELECT id FROM categories WHERE slug = 'ekipman'), 3, 4),
('Dalış Tüp ve Vanalar', 'dalis-tup-ve-vanalar', (SELECT id FROM categories WHERE slug = 'ekipman'), 3, 5);

-- Detay Kategoriler - Giyim & Parça
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Elbise & Yelek & Shorty', 'elbise-yelek-shorty', (SELECT id FROM categories WHERE slug = 'giyim-parca'), 3, 1),
('Patik & Eldiven & Başlık', 'patik-eldiven-baslik', (SELECT id FROM categories WHERE slug = 'giyim-parca'), 3, 2),
('Dalış Çantaları', 'dalis-cantalari', (SELECT id FROM categories WHERE slug = 'giyim-parca'), 3, 3),
('Yedek Parça ve Aksesuar', 'yedek-parca-ve-aksesuar', (SELECT id FROM categories WHERE slug = 'giyim-parca'), 3, 4);

-- Detay Kategoriler - Av & Aksesuar
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Zıpkın Modelleri', 'zipkin-modelleri', (SELECT id FROM categories WHERE slug = 'av-aksesuar'), 3, 1),
('Zıpkın Yedek Parçaları', 'zipkin-yedek-parcalari', (SELECT id FROM categories WHERE slug = 'av-aksesuar'), 3, 2),
('Dalış & Yüzücü Paletleri', 'dalis-yuzucu-paletleri', (SELECT id FROM categories WHERE slug = 'av-aksesuar'), 3, 3),
('Maske & Şnorkel & Gözlük', 'maske-snorkel-gozluk', (SELECT id FROM categories WHERE slug = 'av-aksesuar'), 3, 4),
('Dalış Bıçak ve Makaslar', 'dalis-bicak-ve-makaslar', (SELECT id FROM categories WHERE slug = 'av-aksesuar'), 3, 5),
('Dalış Şamandıraları', 'dalis-samandiralari', (SELECT id FROM categories WHERE slug = 'av-aksesuar'), 3, 6);

-- Spor Malzemeleri Hiyerarşisi (Sadece 2 seviye - Detay yok)
-- Ana Kategori
INSERT INTO public.categories (name, slug, level, display_order) VALUES
('Spor Malzemeleri', 'spor-malzemeleri', 1, 5);

-- Alt Kategoriler - Spor Malzemeleri (Detay kategori YOK)
INSERT INTO public.categories (name, slug, parent_id, level, display_order) VALUES
('Su Sporları Ekipmanları', 'su-sporlari-ekipmanlari', (SELECT id FROM categories WHERE slug = 'spor-malzemeleri'), 2, 1),
('Tenis Ekipmanları', 'tenis-ekipmanlari', (SELECT id FROM categories WHERE slug = 'spor-malzemeleri'), 2, 2),
('Futbol Ekipmanları', 'futbol-ekipmanlari', (SELECT id FROM categories WHERE slug = 'spor-malzemeleri'), 2, 3),
('Basketbol Ekipmanları', 'basketbol-ekipmanlari', (SELECT id FROM categories WHERE slug = 'spor-malzemeleri'), 2, 4),
('Kaykay ve Patenler', 'kaykay-ve-patenler', (SELECT id FROM categories WHERE slug = 'spor-malzemeleri'), 2, 5),
('Raketler', 'raketler', (SELECT id FROM categories WHERE slug = 'spor-malzemeleri'), 2, 6),
('Jimnastik Ekipmanları', 'jimnastik-ekipmanlari', (SELECT id FROM categories WHERE slug = 'spor-malzemeleri'), 2, 7),
('Toplar', 'toplar', (SELECT id FROM categories WHERE slug = 'spor-malzemeleri'), 2, 8);

-- Termoslar & Mataralar (Sadece 1 seviye - Alt ve Detay yok)
-- Ana Kategori
INSERT INTO public.categories (name, slug, level, display_order) VALUES
('Termoslar & Mataralar', 'termoslar-mataralar', 1, 6);

-- Kontrol
SELECT 
  c1.name as ana_kategori,
  c2.name as alt_kategori,
  c3.name as detay_kategori,
  c3.slug
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
LEFT JOIN categories c3 ON c3.parent_id = c2.id
WHERE c1.level = 1
ORDER BY c1.display_order, c2.display_order, c3.display_order;
